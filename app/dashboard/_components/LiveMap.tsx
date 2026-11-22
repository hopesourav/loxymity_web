'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap, Marker } from 'leaflet';
import type { DashboardMember } from '../_lib/types';
import { MAP_TILE_URL, mapTileOptions } from '../../_lib/mapTiles';
import { escapeHtml, httpsUrlOrNull } from '../../_lib/escapeHtml';

// Status → pin ring colour (matches Tailwind config brand colours)
const STATUS_COLOR: Record<DashboardMember['status'], string> = {
  online:      '#5C8F6B',
  stale:       '#C08B3E',
  offline:     '#A8A29E',
  sharing_off: '#A8A29E',
};

/** What the pin looks like: a new icon is built only when this changes (no avatar re-fetch per move). */
function iconKey(member: DashboardMember): string {
  return `${member.status}|${httpsUrlOrNull(member.avatar_url) ?? ''}|${member.display_name ?? ''}`;
}

function makeIcon(L: typeof import('leaflet'), member: DashboardMember) {
  const color = STATUS_COLOR[member.status];
  const initial = escapeHtml((member.display_name ?? '?').charAt(0).toUpperCase());
  const opacity = member.status === 'offline' || member.status === 'sharing_off' ? '0.5' : '1';
  // The avatar URL is user data: only an https: URL, escaped for the attribute (else initials).
  const avatar = httpsUrlOrNull(member.avatar_url);

  return L.divIcon({
    html: `
      <div style="
        width:36px;height:36px;border-radius:50%;
        background:${color};border:2.5px solid #14171D;
        display:flex;align-items:center;justify-content:center;
        color:#fff;font-weight:700;font-size:13px;
        box-shadow:0 2px 8px rgba(0,0,0,0.5);
        opacity:${opacity};
        font-family:var(--font-inter),system-ui,sans-serif;
      ">${avatar
        ? `<img src="${escapeHtml(avatar)}" alt="" style="width:100%;height:100%;border-radius:50%;object-fit:cover" />`
        : initial
      }</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    className: '',
  });
}

/** The popup, as HTML (Leaflet sets it with innerHTML): every user-typed value escaped once, here. */
function popupHtml(m: DashboardMember): string {
  const loc = m.location;
  let html = `<b>${escapeHtml(m.display_name ?? 'Unknown')}</b><br/>`
    + (m.status === 'online' ? 'Online' : m.status === 'stale' ? 'Last seen recently' : 'Offline');
  if (loc?.approx_m != null) html += `<br/>Approximate (±${Math.round(Number(loc.approx_m))} m)`;
  // battery_level is a percentage, 0–100 (latest_locations' CHECK).
  if (loc?.battery_level != null) html += `<br/>Battery: ${Math.round(Number(loc.battery_level))}%`;
  return html;
}

type Props = {
  members: DashboardMember[];
  focusMemberId?: string | null;
  /** The circle the members belong to: a switch clears every pin and fits the new circle. */
  circleId?: string | null;
};

export default function LiveMap({ members, focusMemberId, circleId }: Props) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const LRef = useRef<typeof import('leaflet') | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const iconKeysRef = useRef<Map<string, string>>(new Map());
  // Leaflet loads asynchronously: the map draws from the LATEST props once it is ready.
  const membersRef = useRef(members);
  membersRef.current = members;
  const circleIdRef = useRef(circleId ?? null);
  circleIdRef.current = circleId ?? null;
  /** The circle the pins on the map belong to (undefined = none drawn yet). */
  const pinsCircleRef = useRef<string | null | undefined>(undefined);

  /** Brings the pins in line with the members: adds, moves, re-labels and removes. */
  function syncMarkers() {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    const switched = pinsCircleRef.current !== circleIdRef.current;
    if (switched) {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current.clear();
      iconKeysRef.current.clear();
      pinsCircleRef.current = circleIdRef.current;
    }

    const shown = new Map(
      membersRef.current
        .filter(m => m.location && m.status !== 'sharing_off')
        .map(m => [m.user_id, m] as const),
    );

    // Someone who left the circle, stopped sharing or lost their position: no pin.
    markersRef.current.forEach((marker, userId) => {
      if (!shown.has(userId)) {
        marker.remove();
        markersRef.current.delete(userId);
        iconKeysRef.current.delete(userId);
      }
    });

    shown.forEach(m => {
      const pos: [number, number] = [m.location!.lat, m.location!.lng];
      const key = iconKey(m);
      const html = popupHtml(m);
      const existing = markersRef.current.get(m.user_id);
      if (existing) {
        existing.setLatLng(pos);
        if (iconKeysRef.current.get(m.user_id) !== key) {
          existing.setIcon(makeIcon(L, m));
          iconKeysRef.current.set(m.user_id, key);
        }
        existing.setPopupContent(html);
      } else {
        const marker = L.marker(pos, { icon: makeIcon(L, m) }).addTo(map).bindPopup(html);
        markersRef.current.set(m.user_id, marker);
        iconKeysRef.current.set(m.user_id, key);
      }
    });

    // A new circle (or the first draw): show everyone who has a position.
    if (switched && shown.size > 0) {
      const bounds = L.latLngBounds(Array.from(shown.values()).map(m => [m.location!.lat, m.location!.lng] as [number, number]));
      map.fitBounds(bounds.pad(0.3));
    }
  }

  // Create the map once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!mapDivRef.current || mapRef.current) return;

      if (!document.getElementById('leaflet-css-dashboard')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css-dashboard';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      const L = (await import('leaflet')).default;
      if (cancelled || !mapDivRef.current || mapRef.current) return;

      // Fix default icon URLs broken by bundlers
      // @ts-expect-error leaflet internal
      delete L.Icon.Default.prototype._getIconUrl;

      const map = L.map(mapDivRef.current, { zoomControl: true, attributionControl: true });
      L.tileLayer(MAP_TILE_URL, mapTileOptions()).addTo(map);

      map.setView([20, 78], 5); // Default: India
      mapRef.current = map;
      LRef.current = L;

      syncMarkers();
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current.clear();
      iconKeysRef.current.clear();
      pinsCircleRef.current = undefined;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Members or circle changed: update the pins.
  useEffect(() => { syncMarkers(); }, [members, circleId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus on a specific member
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focusMemberId) return;
    const member = members.find(m => m.user_id === focusMemberId);
    if (member?.location) {
      map.setView([member.location.lat, member.location.lng], 16, { animate: true });
      markersRef.current.get(focusMemberId)?.openPopup();
    }
  }, [focusMemberId, members]);

  return <div ref={mapDivRef} className="flex-1 w-full" style={{ minHeight: 0 }} />;
}
