'use client';

/**
 * The POI coverage map.
 *
 * Leaflet is driven imperatively behind a ref rather than through a React
 * wrapper, matching /admin/network and /admin. The layer work is split across
 * four effects that own four disjoint layer groups — POIs, selection highlight,
 * draft pin, probe result — so selecting a row does not rebuild two thousand
 * circles.
 *
 * Two deliberate perf decisions:
 *   • `preferCanvas` — at coverage zoom this draws hundreds of overlapping
 *     radius circles, which is exactly the workload SVG is worst at.
 *   • Coverage circles are suppressed above COVERAGE_MAX rows. Drawing a 5 km
 *     circle around each of 2000 pincodes produces a solid brown rectangle: no
 *     information, several seconds of layout. Dots instead, with a banner.
 */

import { useEffect, useRef } from 'react';
import { TIERS, tierSpec } from '../_lib/poiTiers';
import { labelFor } from '../_lib/poiTiers';
import type {
  Bbox, CoverageMode, CoverageScan, DupePair, MapMode, NearestPoiHit, PoiRow,
} from '../_lib/types';

/** Above this many rows in view, coverage circles are replaced by dots. */
export const COVERAGE_MAX = 900;
/** Below this zoom Leaflet is drawing sub-pixel circles; show dots instead. */
export const COVERAGE_MIN_ZOOM = 11;

type Props = {
  rows: PoiRow[];
  selectedId: number | null;
  coverage: CoverageMode;
  mode: MapMode;
  draft: { lat: number; lng: number; tier: number } | null;
  probe: { lat: number; lng: number } | null;
  probeHit: NearestPoiHit | null;
  scan: CoverageScan | null;
  dupes: DupePair[] | null;
  focusedDupe: DupePair | null;
  flyTo: { lat: number; lng: number; zoom?: number; nonce: number } | null;
  onViewportChange: (bbox: Bbox, zoom: number) => void;
  onSelect: (id: number) => void;
  onMapClick: (lat: number, lng: number) => void;
  onDraftDrag: (lat: number, lng: number) => void;
};

type L = typeof import('leaflet');

export default function PoiMap({
  rows, selectedId, coverage, mode, draft, probe, probeHit, scan, dupes, focusedDupe, flyTo,
  onViewportChange, onSelect, onMapClick, onDraftDrag,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const LRef = useRef<L | null>(null);
  const mapRef = useRef<any>(null);
  const poiLayerRef = useRef<any>(null);
  const highlightRef = useRef<any>(null);
  const draftLayerRef = useRef<any>(null);
  const probeLayerRef = useRef<any>(null);
  const scanLayerRef = useRef<any>(null);
  const dupeLayerRef = useRef<any>(null);
  const readyRef = useRef(false);

  // Callbacks are read through a ref so the init effect can stay mount-only.
  const cb = useRef({ onViewportChange, onSelect, onMapClick, onDraftDrag });
  cb.current = { onViewportChange, onSelect, onMapClick, onDraftDrag };

  // ── Init (once) ────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      const Lmod = (await import('leaflet')).default;
      if (cancelled || !hostRef.current || mapRef.current) return;
      LRef.current = Lmod;

      const map = Lmod.map(hostRef.current, {
        preferCanvas: true,
        zoomControl: true,
        attributionControl: false,
        // Kolkata — where the directory is densest, so the first frame is useful.
        center: [22.5726, 88.3639],
        zoom: 13,
      });
      Lmod.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Order matters: the scan grid is a full-bleed fill and has to sit
      // under everything else, so it is added first.
      scanLayerRef.current = Lmod.layerGroup().addTo(map);
      poiLayerRef.current = Lmod.layerGroup().addTo(map);
      dupeLayerRef.current = Lmod.layerGroup().addTo(map);
      highlightRef.current = Lmod.layerGroup().addTo(map);
      probeLayerRef.current = Lmod.layerGroup().addTo(map);
      draftLayerRef.current = Lmod.layerGroup().addTo(map);
      mapRef.current = map;
      readyRef.current = true;

      let timer: ReturnType<typeof setTimeout> | null = null;
      const emit = () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          const b = map.getBounds();
          cb.current.onViewportChange(
            {
              minLat: b.getSouth(), minLng: b.getWest(),
              maxLat: b.getNorth(), maxLng: b.getEast(),
            },
            map.getZoom(),
          );
        }, 250);
      };
      map.on('moveend zoomend', emit);
      map.on('click', (e: any) => cb.current.onMapClick(e.latlng.lat, e.latlng.lng));
      emit();
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      readyRef.current = false;
    };
  }, []);

  // ── Cursor reflects what a click will do ──────────────────────────────────
  useEffect(() => {
    if (hostRef.current) {
      hostRef.current.style.cursor = mode === 'browse' ? '' : 'crosshair';
    }
  }, [mode]);

  // ── POI layer ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const Lmod = LRef.current;
    const layer = poiLayerRef.current;
    const map = mapRef.current;
    if (!Lmod || !layer || !map) return;

    layer.clearLayers();

    const zoom = map.getZoom();
    const drawCoverage =
      coverage !== 'off' && rows.length <= COVERAGE_MAX && zoom >= COVERAGE_MIN_ZOOM;

    for (const p of rows) {
      const spec = tierSpec(p.tier);

      if (drawCoverage) {
        const radius = coverage === 'match' ? spec.matchRadius : spec.effectiveRadius;
        Lmod.circle([p.lat, p.lng], {
          radius,
          color: spec.color,
          fillColor: spec.color,
          fillOpacity: 0.07,
          weight: 1,
          interactive: false,
        }).addTo(layer);

        // Tier 4's dead annulus: nearest_poi matches out here and wins the
        // fall-through, but labelFor() drops it, so the stop ends up nameless.
        // Only worth drawing when the two radii differ.
        if (coverage === 'effective' && spec.matchRadius > spec.effectiveRadius) {
          Lmod.circle([p.lat, p.lng], {
            radius: spec.matchRadius,
            color: spec.color,
            fill: false,
            weight: 1,
            dashArray: '3 6',
            opacity: 0.45,
            interactive: false,
          }).addTo(layer);
        }
      }

      Lmod.circleMarker([p.lat, p.lng], {
        radius: 4,
        color: spec.color,
        fillColor: spec.color,
        fillOpacity: 0.95,
        weight: 1,
      })
        .addTo(layer)
        .bindTooltip(
          `<b>${escapeHtml(p.name)}</b><br/>T${p.tier} · ${escapeHtml(p.poi_type)}`,
          { direction: 'top', offset: [0, -4] },
        )
        .on('click', (e: any) => {
          e.originalEvent?.stopPropagation?.();
          cb.current.onSelect(p.id);
        });
    }
  }, [rows, coverage]);

  // ── Selection highlight ────────────────────────────────────────────────────
  useEffect(() => {
    const Lmod = LRef.current;
    const layer = highlightRef.current;
    if (!Lmod || !layer) return;
    layer.clearLayers();
    const p = rows.find((r) => r.id === selectedId);
    if (!p) return;
    const spec = tierSpec(p.tier);
    Lmod.circleMarker([p.lat, p.lng], {
      radius: 11,
      color: '#F5F3EE',
      fill: false,
      weight: 2,
      interactive: false,
    }).addTo(layer);
    Lmod.circle([p.lat, p.lng], {
      radius: spec.effectiveRadius,
      color: '#F5F3EE',
      fill: false,
      weight: 1.5,
      dashArray: '5 5',
      interactive: false,
    }).addTo(layer);
  }, [selectedId, rows]);

  // ── Draft pin (create / edit) ──────────────────────────────────────────────
  useEffect(() => {
    const Lmod = LRef.current;
    const layer = draftLayerRef.current;
    if (!Lmod || !layer) return;
    layer.clearLayers();
    if (!draft) return;

    const spec = tierSpec(draft.tier);
    Lmod.circle([draft.lat, draft.lng], {
      radius: spec.effectiveRadius,
      color: '#F5F3EE',
      fillColor: spec.color,
      fillOpacity: 0.12,
      weight: 2,
      dashArray: '6 5',
      interactive: false,
    }).addTo(layer);

    Lmod.marker([draft.lat, draft.lng], {
      draggable: true,
      icon: Lmod.divIcon({
        className: '',
        html:
          `<div style="width:18px;height:18px;border-radius:50%;background:${spec.color};` +
          `border:3px solid #F5F3EE;box-shadow:0 0 0 2px rgba(0,0,0,.5)"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      }),
    })
      .addTo(layer)
      .on('dragend', (e: any) => {
        const ll = e.target.getLatLng();
        cb.current.onDraftDrag(ll.lat, ll.lng);
      });
  }, [draft]);

  // ── Probe result ───────────────────────────────────────────────────────────
  useEffect(() => {
    const Lmod = LRef.current;
    const layer = probeLayerRef.current;
    if (!Lmod || !layer) return;
    layer.clearLayers();
    if (!probe) return;

    Lmod.circleMarker([probe.lat, probe.lng], {
      radius: 6,
      color: '#F5F3EE',
      fillColor: '#0A0C10',
      fillOpacity: 1,
      weight: 2,
    }).addTo(layer);

    // Every tier ring around the probe point, so it is visible at a glance
    // which tiers could possibly have answered and which one did.
    for (const spec of Object.values(TIERS)) {
      Lmod.circle([probe.lat, probe.lng], {
        radius: spec.matchRadius,
        color: spec.color,
        fill: false,
        weight: 1,
        opacity: 0.35,
        dashArray: '2 6',
        interactive: false,
      }).addTo(layer);
    }

    if (probeHit) {
      const target = rows.find((r) => r.id === probeHit.id);
      if (target) {
        Lmod.polyline(
          [[probe.lat, probe.lng], [target.lat, target.lng]],
          { color: '#F5F3EE', weight: 2, dashArray: '4 4', interactive: false },
        ).addTo(layer);
      }
    }
  }, [probe, probeHit, rows]);

  // ── Coverage scan grid ─────────────────────────────────────────────────────
  useEffect(() => {
    const Lmod = LRef.current;
    const layer = scanLayerRef.current;
    if (!Lmod || !layer) return;
    layer.clearLayers();
    if (!scan) return;

    const halfLat = (scan.bbox.maxLat - scan.bbox.minLat) / scan.n / 2;
    const halfLng = (scan.bbox.maxLng - scan.bbox.minLng) / scan.n / 2;

    for (const c of scan.cells) {
      const named = c.poi_id !== null && c.poi_name !== null && c.tier !== null && c.dist_m !== null
        ? labelFor({ name: c.poi_name, tier: c.tier, dist_m: c.dist_m })
        : null;
      const state = c.poi_id === null ? 'none' : named ? 'named' : 'unnamed';
      const colour = state === 'named' ? '#5C8F6B' : state === 'unnamed' ? '#C08B3E' : '#B5453F';

      Lmod.rectangle(
        [[c.lat - halfLat, c.lng - halfLng], [c.lat + halfLat, c.lng + halfLng]],
        {
          color: colour,
          weight: 0.5,
          opacity: 0.35,
          fillColor: colour,
          fillOpacity: state === 'named' ? 0.1 : 0.3,
        },
      )
        .addTo(layer)
        .bindTooltip(
          state === 'named'
            ? `<b>${escapeHtml(named!)}</b><br/>T${c.tier} · ${Math.round(c.dist_m!)} m`
            : state === 'unnamed'
              ? `<b>No label</b><br/>T${c.tier} match at ${Math.round(c.dist_m!)} m — beyond the 1 km cut-off`
              : '<b>No POI matched</b><br/>every tier fell through',
          { direction: 'top', sticky: true },
        );
    }
  }, [scan]);

  // ── Near-duplicate pairs ───────────────────────────────────────────────────
  useEffect(() => {
    const Lmod = LRef.current;
    const layer = dupeLayerRef.current;
    if (!Lmod || !layer) return;
    layer.clearLayers();
    if (!dupes?.length) return;

    for (const d of dupes) {
      const focused = focusedDupe
        ? focusedDupe.a_id === d.a_id && focusedDupe.b_id === d.b_id
        : false;
      // A 0 m pair is two pins on the same point: a line between them is
      // invisible, so the ring around the pair is what actually shows it.
      Lmod.polyline([[d.a_lat, d.a_lng], [d.b_lat, d.b_lng]], {
        color: focused ? '#F5F3EE' : '#B5453F',
        weight: focused ? 3 : 2,
        opacity: focused ? 1 : 0.7,
        interactive: false,
      }).addTo(layer);

      for (const [lat, lng] of [[d.a_lat, d.a_lng], [d.b_lat, d.b_lng]] as const) {
        Lmod.circleMarker([lat, lng], {
          radius: focused ? 9 : 6,
          color: focused ? '#F5F3EE' : '#B5453F',
          fill: false,
          weight: 2,
          interactive: false,
        }).addTo(layer);
      }
    }
  }, [dupes, focusedDupe]);

  // ── Imperative fly-to ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!flyTo || !mapRef.current) return;
    mapRef.current.flyTo([flyTo.lat, flyTo.lng], flyTo.zoom ?? 16, { duration: 0.6 });
  }, [flyTo?.nonce]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={hostRef} className="w-full h-full" />;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
