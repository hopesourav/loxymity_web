'use client';

/**
 * POI Directory console.
 *
 * poi_directory is the name source behind every stop label in the history
 * timeline, both endpoints of every drive report, and the "where is X" answer
 * that Loxy / Alexa / WhatsApp give. Until now it was seed-only: a wrong pin
 * could only be fixed with hand-written SQL, and nobody could see what the
 * coverage actually looked like.
 *
 * Three things this page does that a plain CRUD table could not:
 *
 *   1. Draws each POI at its TIER'S NAMING RADIUS, not as a dot. A POI's reach
 *      is a property of its tier (500 m / 200 m / 2 km / 1 km), so coverage —
 *      and the holes in it — is the thing worth looking at.
 *   2. "Name preview" calls the real nearest_poi RPC at a clicked point and
 *      runs the real labelFor() over the answer. That is the whole pipeline,
 *      end to end, so it can show a tier-4 match that produces NO label.
 *   3. Loads by viewport. The table is 129k rows; selecting it is not an option.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAdmin } from '../_lib/adminContext';
import PoiMap, { COVERAGE_MAX, COVERAGE_MIN_ZOOM } from './_components/PoiMap';
import PoiEditor from './_components/PoiEditor';
import BulkPanel from './_components/BulkPanel';
import CoveragePanel from './_components/CoveragePanel';
import DupesPanel from './_components/DupesPanel';
import { TIERS, TIER_IDS, formatDistance, labelFor, tierSpec } from './_lib/poiTiers';
import type {
  Bbox, CoverageMode, CoverageScan, DupePair, NearestPoiHit, PoiFacet, PoiRow,
} from './_lib/types';

const MAX_ROWS = 2000;

type Tab = 'list' | 'probe' | 'find' | 'scan' | 'dupes' | 'bulk';

const TAB_LABEL: Record<Tab, string> = {
  list: 'In view',
  probe: 'Name preview',
  find: 'Find',
  scan: 'Coverage',
  dupes: 'Duplicates',
  bulk: 'Import / export',
};

type Draft = {
  id: number | null;
  name: string;
  poi_type: string;
  tier: number;
  source: string;
  lat: number | null;
  lng: number | null;
};

export default function PoiPage() {
  const { supabase } = useAdmin();

  const [facets, setFacets] = useState<PoiFacet[]>([]);
  const [rows, setRows] = useState<PoiRow[]>([]);
  const [totalInView, setTotalInView] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [bbox, setBbox] = useState<Bbox | null>(null);
  const [zoom, setZoom] = useState(13);

  const [tierFilter, setTierFilter] = useState<Set<number>>(new Set(TIER_IDS));
  const [typeFilter, setTypeFilter] = useState<Set<string>>(new Set());
  const [sourceFilter, setSourceFilter] = useState<Set<string>>(new Set());
  const [nameFilter, setNameFilter] = useState('');
  const [coverage, setCoverage] = useState<CoverageMode>('effective');

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [tab, setTab] = useState<Tab>('list');

  const [scan, setScan] = useState<CoverageScan | null>(null);
  const [dupes, setDupes] = useState<DupePair[] | null>(null);
  const [focusedDupe, setFocusedDupe] = useState<DupePair | null>(null);

  const [probe, setProbe] = useState<{ lat: number; lng: number } | null>(null);
  const [probeHit, setProbeHit] = useState<NearestPoiHit | null>(null);
  const [probeBusy, setProbeBusy] = useState(false);

  const [findQ, setFindQ] = useState('');
  const [findRows, setFindRows] = useState<PoiRow[]>([]);
  const [findBusy, setFindBusy] = useState(false);

  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number; zoom?: number; nonce: number } | null>(null);
  const nonceRef = useRef(0);
  const fly = useCallback((lat: number, lng: number, z = 16) => {
    nonceRef.current += 1;
    setFlyTo({ lat, lng, zoom: z, nonce: nonceRef.current });
  }, []);

  const mode = draft ? 'place' : tab === 'probe' ? 'probe' : 'browse';

  // ── Facets ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc('admin_poi_facets');
      setFacets((data ?? []) as PoiFacet[]);
    })();
  }, [supabase]);

  const allTypes = useMemo(
    () => Array.from(new Set(facets.map((f) => f.poi_type))).sort(),
    [facets],
  );
  const allSources = useMemo(
    () => Array.from(new Set(facets.map((f) => f.source))).sort(),
    [facets],
  );
  const tierTotals = useMemo(() => {
    const m = new Map<number, number>();
    for (const f of facets) m.set(f.tier, (m.get(f.tier) ?? 0) + f.n);
    return m;
  }, [facets]);
  /** Types available given the tier filter — a Pincode type under T1 is noise. */
  const visibleTypes = useMemo(() => {
    const s = new Set<string>();
    for (const f of facets) if (tierFilter.has(f.tier)) s.add(f.poi_type);
    return Array.from(s).sort();
  }, [facets, tierFilter]);

  // ── Viewport load ──────────────────────────────────────────────────────────
  const loadViewport = useCallback(async (b: Bbox) => {
    setLoading(true);
    setLoadError('');
    const { data, error } = await supabase.rpc('admin_pois_in_bbox', {
      p_min_lat: b.minLat,
      p_min_lng: b.minLng,
      p_max_lat: b.maxLat,
      p_max_lng: b.maxLng,
      p_tiers: tierFilter.size === TIER_IDS.length ? null : Array.from(tierFilter),
      p_types: typeFilter.size === 0 ? null : Array.from(typeFilter),
      p_sources: sourceFilter.size === 0 ? null : Array.from(sourceFilter),
      p_q: nameFilter.trim() || null,
      p_limit: MAX_ROWS,
    });
    setLoading(false);
    if (error) { setLoadError(error.message); return; }
    const list = (data ?? []) as (PoiRow & { total_in_view: number })[];
    setRows(list.map(({ total_in_view: _t, ...r }) => r));
    setTotalInView(list.length ? Number(list[0].total_in_view) : 0);
  }, [supabase, tierFilter, typeFilter, sourceFilter, nameFilter]);

  useEffect(() => {
    if (bbox) loadViewport(bbox);
  }, [bbox, loadViewport]);

  const onViewportChange = useCallback((b: Bbox, z: number) => {
    setBbox(b);
    setZoom(z);
  }, []);

  // ── Probe ──────────────────────────────────────────────────────────────────
  const runProbe = useCallback(async (lat: number, lng: number) => {
    setProbe({ lat, lng });
    setProbeHit(null);
    setProbeBusy(true);
    const { data } = await supabase.rpc('nearest_poi', { p_lat: lat, p_lng: lng });
    setProbeBusy(false);
    setProbeHit(Array.isArray(data) ? ((data[0] ?? null) as NearestPoiHit | null) : null);
  }, [supabase]);

  const onMapClick = useCallback((lat: number, lng: number) => {
    if (draft) { setDraft((d) => (d ? { ...d, lat, lng } : d)); return; }
    if (tab === 'probe') runProbe(lat, lng);
  }, [draft, tab, runProbe]);

  // ── Global name search ─────────────────────────────────────────────────────
  useEffect(() => {
    if (findQ.trim().length < 2) { setFindRows([]); return; }
    const t = setTimeout(async () => {
      setFindBusy(true);
      const { data } = await supabase.rpc('admin_poi_search', {
        p_q: findQ.trim(),
        p_tiers: tierFilter.size === TIER_IDS.length ? null : Array.from(tierFilter),
        p_limit: 50,
      });
      setFindBusy(false);
      setFindRows((data ?? []) as PoiRow[]);
    }, 350);
    return () => clearTimeout(t);
  }, [findQ, tierFilter, supabase]);

  // ── CRUD plumbing ──────────────────────────────────────────────────────────
  function openCreate() {
    const centre = probe ?? (rows[0] ? { lat: rows[0].lat, lng: rows[0].lng } : null);
    setDraft({
      id: null, name: '', poi_type: '', tier: 1, source: 'manual',
      lat: centre?.lat ?? null, lng: centre?.lng ?? null,
    });
  }

  function openEdit(p: PoiRow) {
    setDraft({
      id: p.id, name: p.name, poi_type: p.poi_type, tier: p.tier,
      source: p.source, lat: p.lat, lng: p.lng,
    });
    setSelectedId(p.id);
    fly(p.lat, p.lng);
  }

  /** Re-read the viewport and the facet counts after a write from any panel. */
  const refreshAll = useCallback(() => {
    if (bbox) loadViewport(bbox);
    supabase.rpc('admin_poi_facets').then(({ data }) => setFacets((data ?? []) as PoiFacet[]));
  }, [bbox, loadViewport, supabase]);

  function afterSave(row: PoiRow) {
    setDraft(null);
    setSelectedId(row.id);
    setRows((prev) => {
      const i = prev.findIndex((r) => r.id === row.id);
      if (i === -1) return [...prev, row];
      const next = [...prev];
      next[i] = row;
      return next;
    });
    // Counts moved; the facet menu is now stale.
    supabase.rpc('admin_poi_facets').then(({ data }) => setFacets((data ?? []) as PoiFacet[]));
    if (probe) runProbe(probe.lat, probe.lng);
  }

  function afterDelete(id: number) {
    setDraft(null);
    setSelectedId(null);
    setRows((prev) => prev.filter((r) => r.id !== id));
    supabase.rpc('admin_poi_facets').then(({ data }) => setFacets((data ?? []) as PoiFacet[]));
    if (probe) runProbe(probe.lat, probe.lng);
  }

  const coverageSuppressed =
    coverage !== 'off' && (rows.length > COVERAGE_MAX || zoom < COVERAGE_MIN_ZOOM);

  const previewLabel = probeHit ? labelFor(probeHit) : null;

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div className="px-6 pt-6 pb-4 shrink-0">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-dark-text">POI Directory</h1>
            <p className="text-dark-muted text-sm">
              Place names behind stop labels, drive endpoints and assistant answers
            </p>
          </div>
          <button
            onClick={openCreate}
            className="bg-primary hover:bg-primary-dark text-dark-bg font-bold px-4 py-2 rounded-xl text-sm transition-colors"
          >
            + New POI
          </button>
        </div>

        {/* Tier totals double as the tier filter. */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {TIER_IDS.map((t) => {
            const s = TIERS[t];
            const on = tierFilter.has(t);
            return (
              <button
                key={t}
                onClick={() => setTierFilter((prev) => {
                  const next = new Set(prev);
                  if (next.has(t)) next.delete(t); else next.add(t);
                  return next.size === 0 ? new Set(TIER_IDS) : next;
                })}
                className={`text-left bg-dark-surface border rounded-2xl p-4 transition-colors ${
                  on ? 'border-dark-border' : 'border-dark-border/40 opacity-40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-xs font-semibold text-dark-text">T{t} · {s.label}</span>
                </div>
                <p className="text-2xl font-black mt-1" style={{ color: s.color }}>
                  {(tierTotals.get(t) ?? 0).toLocaleString()}
                </p>
                <p className="text-dark-muted text-[11px] mt-0.5">
                  names to {formatDistance(s.effectiveRadius)}
                  {s.matchRadius !== s.effectiveRadius && ` · matches to ${formatDistance(s.matchRadius)}`}
                </p>
              </button>
            );
          })}
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <input
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Filter this view by name…"
            className="bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-sm text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary w-56"
          />

          <MultiSelect
            label="Type"
            options={visibleTypes}
            selected={typeFilter}
            onChange={setTypeFilter}
          />
          <MultiSelect
            label="Source"
            options={allSources}
            selected={sourceFilter}
            onChange={setSourceFilter}
          />

          <div className="flex items-center gap-1 bg-dark-surface border border-dark-border rounded-xl p-1">
            {(['effective', 'match', 'off'] as CoverageMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setCoverage(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  coverage === m ? 'bg-primary text-dark-bg' : 'text-dark-muted hover:text-dark-text'
                }`}
              >
                {m === 'effective' ? 'Naming radius' : m === 'match' ? 'Match radius' : 'Dots only'}
              </button>
            ))}
          </div>

          {(typeFilter.size > 0 || sourceFilter.size > 0 || nameFilter ||
            tierFilter.size !== TIER_IDS.length) && (
            <button
              onClick={() => {
                setTypeFilter(new Set());
                setSourceFilter(new Set());
                setNameFilter('');
                setTierFilter(new Set(TIER_IDS));
              }}
              className="text-xs text-dark-muted hover:text-dark-text px-2 py-2"
            >
              Clear filters
            </button>
          )}

          <div className="ml-auto text-xs text-dark-muted">
            {loading
              ? 'Loading…'
              : `${rows.length.toLocaleString()}${
                  totalInView > rows.length ? ` of ${totalInView.toLocaleString()}` : ''
                } in view · zoom ${zoom}`}
          </div>
        </div>
      </div>

      {/* ── Map + panel ── */}
      {/* min-h keeps the map usable when the viewport is short; the admin
          <main> is overflow-auto, so the page scrolls rather than crushing it. */}
      <div className="flex-1 min-h-[560px] px-6 pb-6 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 min-w-0 relative rounded-2xl overflow-hidden border border-dark-border">
          <PoiMap
            rows={rows}
            selectedId={selectedId}
            coverage={coverage}
            mode={mode}
            draft={draft && draft.lat !== null && draft.lng !== null
              ? { lat: draft.lat, lng: draft.lng, tier: draft.tier }
              : null}
            probe={tab === 'probe' ? probe : null}
            probeHit={probeHit}
            scan={scan}
            dupes={tab === 'dupes' ? dupes : null}
            focusedDupe={focusedDupe}
            flyTo={flyTo}
            onViewportChange={onViewportChange}
            onSelect={(id) => {
              setSelectedId(id);
              // Only the Find tab is worth leaving on a pin click. Probe,
              // Coverage and Duplicates all have map overlays that the click
              // is part of reading — yanking the panel away loses the context.
              if (tab === 'find') setTab('list');
            }}
            onMapClick={onMapClick}
            onDraftDrag={(lat, lng) => setDraft((d) => (d ? { ...d, lat, lng } : d))}
          />

          {/* Banners live over the map so the map keeps its full height. */}
          <div className="absolute top-3 left-3 right-3 z-[500] space-y-2 pointer-events-none">
            {mode !== 'browse' && (
              <Banner tone="info">
                {mode === 'place'
                  ? 'Click the map to place this POI, or drag the pin.'
                  : 'Click anywhere to see what the app would call that point.'}
              </Banner>
            )}
            {coverageSuppressed && (
              <Banner tone="warn">
                {zoom < COVERAGE_MIN_ZOOM
                  ? `Zoom to ${COVERAGE_MIN_ZOOM}+ to draw coverage circles.`
                  : `${rows.length.toLocaleString()} POIs in view — coverage circles are hidden above ${COVERAGE_MAX}. Zoom in or narrow the filters.`}
              </Banner>
            )}
            {totalInView > rows.length && (
              <Banner tone="warn">
                Showing {rows.length.toLocaleString()} of {totalInView.toLocaleString()} —
                the map is truncated. Zoom in for a complete picture.
              </Banner>
            )}
            {loadError && <Banner tone="error">{loadError}</Banner>}
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 z-[500] bg-dark-surface/90 backdrop-blur border border-dark-border rounded-xl px-3 py-2">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {TIER_IDS.map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-[11px] text-dark-muted">
                  <span className="w-2 h-2 rounded-full" style={{ background: TIERS[t].color }} />
                  T{t} {TIERS[t].label}
                </span>
              ))}
            </div>
            {coverage === 'effective' && (
              <p className="text-[10px] text-dark-muted mt-1 max-w-xs leading-snug">
                Dashed outer ring on T4 = matched by nearest_poi but too far to be named:
                the stop gets no label at all.
              </p>
            )}
            {scan && (
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 pt-1.5 border-t border-dark-border">
                <span className="flex items-center gap-1.5 text-[11px] text-dark-muted">
                  <span className="w-2 h-2 rounded-sm bg-brand-success" /> named
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-dark-muted">
                  <span className="w-2 h-2 rounded-sm bg-brand-warning" /> matched, no label
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-dark-muted">
                  <span className="w-2 h-2 rounded-sm bg-brand-danger" /> no match
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Side panel ── */}
        <div className="w-full lg:w-[360px] shrink-0 bg-dark-surface border border-dark-border rounded-2xl flex flex-col min-h-0">
          {draft ? (
            <PoiEditor
              supabase={supabase}
              draft={draft}
              knownTypes={allTypes}
              knownSources={allSources}
              onChange={(patch) => setDraft((d) => (d ? { ...d, ...patch } : d))}
              onClose={() => setDraft(null)}
              onSaved={afterSave}
              onDeleted={afterDelete}
            />
          ) : (
            <>
              <div className="grid grid-cols-3 gap-1 p-2 border-b border-dark-border shrink-0">
                {(Object.keys(TAB_LABEL) as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-2 py-2 rounded-lg text-[11px] font-semibold transition-colors ${
                      tab === t ? 'bg-primary text-dark-bg' : 'text-dark-muted hover:text-dark-text'
                    }`}
                  >
                    {TAB_LABEL[t]}
                  </button>
                ))}
              </div>

              {tab === 'list' && (
                <ListPanel rows={rows} selectedId={selectedId} onPick={(p) => { setSelectedId(p.id); fly(p.lat, p.lng); }} onEdit={openEdit} />
              )}

              {tab === 'probe' && (
                <ProbePanel
                  probe={probe}
                  hit={probeHit}
                  busy={probeBusy}
                  label={previewLabel}
                  onEditHit={() => {
                    const target = rows.find((r) => r.id === probeHit?.id);
                    if (target) openEdit(target);
                  }}
                  hitInView={!!probeHit && rows.some((r) => r.id === probeHit.id)}
                  onCreateHere={() => {
                    if (!probe) return;
                    setDraft({
                      id: null, name: '', poi_type: '', tier: 1,
                      source: 'manual', lat: probe.lat, lng: probe.lng,
                    });
                  }}
                />
              )}

              {tab === 'find' && (
                <FindPanel
                  q={findQ}
                  onQ={setFindQ}
                  busy={findBusy}
                  rows={findRows}
                  onPick={(p) => { setSelectedId(p.id); fly(p.lat, p.lng); }}
                  onEdit={openEdit}
                />
              )}

              {tab === 'scan' && (
                <CoveragePanel supabase={supabase} bbox={bbox} scan={scan} onScan={setScan} />
              )}

              {tab === 'dupes' && (
                <DupesPanel
                  supabase={supabase}
                  bbox={bbox}
                  pairs={dupes}
                  onPairs={setDupes}
                  focused={focusedDupe}
                  onFocus={setFocusedDupe}
                  onFly={(lat, lng) => fly(lat, lng, 17)}
                  onResolved={refreshAll}
                />
              )}

              {tab === 'bulk' && (
                <BulkPanel supabase={supabase} viewportRows={rows} onImported={refreshAll} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */

function Banner({ tone, children }: { tone: 'info' | 'warn' | 'error'; children: React.ReactNode }) {
  const cls = tone === 'error'
    ? 'bg-brand-danger/90 text-dark-text'
    : tone === 'warn'
      ? 'bg-brand-warning/90 text-dark-bg'
      : 'bg-primary/90 text-dark-bg';
  return (
    <div className={`${cls} rounded-xl px-3 py-2 text-xs font-semibold shadow-lg pointer-events-none`}>
      {children}
    </div>
  );
}

function MultiSelect({
  label, options, selected, onChange,
}: {
  label: string;
  options: string[];
  selected: Set<string>;
  onChange: (s: Set<string>) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`px-3 py-2 rounded-xl text-sm border transition-colors ${
          selected.size
            ? 'bg-primary/10 border-primary text-primary'
            : 'bg-dark-surface border-dark-border text-dark-muted hover:text-dark-text'
        }`}
      >
        {label}{selected.size ? ` · ${selected.size}` : ''} ▾
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[600]" onClick={() => setOpen(false)} />
          <div className="absolute z-[601] mt-1 w-64 max-h-72 overflow-y-auto bg-dark-surface border border-dark-border rounded-xl shadow-2xl p-1">
            {options.length === 0 && (
              <p className="text-xs text-dark-muted px-3 py-2">Nothing to filter.</p>
            )}
            {options.map((o) => {
              const on = selected.has(o);
              return (
                <button
                  key={o}
                  onClick={() => {
                    const next = new Set(selected);
                    if (on) next.delete(o); else next.add(o);
                    onChange(next);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    on ? 'bg-primary/10 text-primary' : 'text-dark-muted hover:text-dark-text hover:bg-dark-bg'
                  }`}
                >
                  {on ? '✓ ' : ''}{o}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function ListPanel({
  rows, selectedId, onPick, onEdit,
}: {
  rows: PoiRow[];
  selectedId: number | null;
  onPick: (p: PoiRow) => void;
  onEdit: (p: PoiRow) => void;
}) {
  if (rows.length === 0) {
    return <p className="text-dark-muted text-sm p-4">No POIs in this view.</p>;
  }
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-1">
      {rows.slice(0, 400).map((p) => {
        const s = tierSpec(p.tier);
        const on = p.id === selectedId;
        return (
          <div
            key={p.id}
            onClick={() => onPick(p)}
            className={`px-3 py-2 rounded-xl cursor-pointer border transition-colors ${
              on ? 'bg-primary/10 border-primary' : 'border-transparent hover:bg-dark-bg'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
              <span className="text-sm text-dark-text truncate">{p.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(p); }}
                className="ml-auto text-[11px] text-dark-muted hover:text-primary shrink-0"
              >
                Edit
              </button>
            </div>
            <p className="text-[11px] text-dark-muted mt-0.5 pl-4">
              T{p.tier} · {p.poi_type} · {p.source}
              {p.updated_at && ' · edited'}
            </p>
          </div>
        );
      })}
      {rows.length > 400 && (
        <p className="text-[11px] text-dark-muted px-3 py-2">
          Listing the first 400 of {rows.length.toLocaleString()} — all of them are on the map.
        </p>
      )}
    </div>
  );
}

function ProbePanel({
  probe, hit, busy, label, hitInView, onEditHit, onCreateHere,
}: {
  probe: { lat: number; lng: number } | null;
  hit: NearestPoiHit | null;
  busy: boolean;
  label: string | null;
  hitInView: boolean;
  onEditHit: () => void;
  onCreateHere: () => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      <p className="text-xs text-dark-muted leading-snug">
        Calls the live <code className="text-primary">nearest_poi</code> RPC at a point and runs
        the app&apos;s own <code className="text-primary">labelFor()</code> over the result — the
        exact pipeline a stop goes through.
      </p>

      {!probe && <p className="text-dark-muted text-sm">Click the map to probe a point.</p>}

      {probe && (
        <div className="bg-dark-bg rounded-xl px-3 py-2">
          <p className="text-[11px] text-dark-muted">Probe point</p>
          <p className="text-xs text-dark-text font-mono">
            {probe.lat.toFixed(6)}, {probe.lng.toFixed(6)}
          </p>
        </div>
      )}

      {busy && <p className="text-dark-muted text-sm">Resolving…</p>}

      {probe && !busy && !hit && (
        <div className="border border-dark-border rounded-xl p-3">
          <p className="text-sm font-semibold text-dark-text">No POI matched</p>
          <p className="text-xs text-dark-muted mt-1 leading-snug">
            Every tier fell through. The stop shows no place name, and the app falls back to
            reverse geocoding where that path exists. A coverage hole — consider adding a POI.
          </p>
          <button
            onClick={onCreateHere}
            className="mt-2 w-full bg-primary text-dark-bg font-bold py-2 rounded-xl text-xs"
          >
            Add a POI here
          </button>
        </div>
      )}

      {hit && !busy && (
        <>
          <div
            className="border rounded-xl p-3"
            style={{ borderColor: tierSpec(hit.tier).color }}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: tierSpec(hit.tier).color }} />
              <p className="text-sm font-semibold text-dark-text">{hit.name}</p>
            </div>
            <p className="text-[11px] text-dark-muted mt-1">
              T{hit.tier} {tierSpec(hit.tier).label} · {hit.poi_type} · {formatDistance(hit.dist_m)} away
            </p>
          </div>

          <div>
            <p className="text-[11px] text-dark-muted mb-1">App would show</p>
            {label ? (
              <p className="text-lg font-semibold text-dark-text bg-dark-bg rounded-xl px-3 py-2">
                {label}
              </p>
            ) : (
              <div className="bg-brand-warning/10 border border-brand-warning/40 rounded-xl px-3 py-2">
                <p className="text-brand-warning text-sm font-semibold">No label</p>
                <p className="text-[11px] text-dark-muted mt-1 leading-snug">
                  nearest_poi matched this pincode at {formatDistance(hit.dist_m)}, but labelFor()
                  drops tier 4 beyond 1 km. Because tier 4 is the last rung, nothing else is
                  consulted — the stop ends up nameless.
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onEditHit}
              disabled={!hitInView}
              className="flex-1 border border-dark-border text-dark-muted hover:text-dark-text py-2 rounded-xl text-xs disabled:opacity-40"
              title={hitInView ? '' : 'Pan the map over this POI to edit it'}
            >
              Edit this POI
            </button>
            <button
              onClick={onCreateHere}
              className="flex-1 border border-dark-border text-dark-muted hover:text-dark-text py-2 rounded-xl text-xs"
            >
              Add a better one
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function FindPanel({
  q, onQ, busy, rows, onPick, onEdit,
}: {
  q: string;
  onQ: (s: string) => void;
  busy: boolean;
  rows: PoiRow[];
  onPick: (p: PoiRow) => void;
  onEdit: (p: PoiRow) => void;
}) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-3 shrink-0">
        <input
          value={q}
          onChange={(e) => onQ(e.target.value)}
          placeholder="Search all 129k POIs by name…"
          className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-sm text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-[11px] text-dark-muted mt-1.5">
          Whole-table search, not limited to the viewport. Respects the tier filter.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
        {busy && <p className="text-dark-muted text-xs px-3 py-2">Searching…</p>}
        {!busy && q.trim().length >= 2 && rows.length === 0 && (
          <p className="text-dark-muted text-xs px-3 py-2">No match.</p>
        )}
        {rows.map((p) => (
          <div
            key={p.id}
            onClick={() => onPick(p)}
            className="px-3 py-2 rounded-xl cursor-pointer hover:bg-dark-bg"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: tierSpec(p.tier).color }} />
              <span className="text-sm text-dark-text truncate">{p.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(p); }}
                className="ml-auto text-[11px] text-dark-muted hover:text-primary shrink-0"
              >
                Edit
              </button>
            </div>
            <p className="text-[11px] text-dark-muted mt-0.5 pl-4">
              T{p.tier} · {p.poi_type} · {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
