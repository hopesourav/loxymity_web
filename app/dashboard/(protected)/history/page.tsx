'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useDashboard } from '../../_lib/context';
import { historyRetentionDays, effectiveTier } from '../../../_lib/tiers';
import type { LocationHistoryPoint } from '../../_lib/types';
import { MAP_TILE_URL, mapTileOptions } from '../../../_lib/mapTiles';
import { IconHistory, IconPlay, IconPause, IconSkipForward, IconUser } from '../../_components/Icons';

type Speed = 1 | 10 | 60;

function fmt(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/**
 * Days are the viewer's LOCAL calendar days, like the app's day view. toISOString() gave the UTC
 * date — before 05:30 in India "today" was still yesterday, and the day was read 00:00–23:59 UTC.
 */
function localYmd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function todayISO() { return localYmd(new Date()); }
function minDate(retentionDays: number) {
  const d = new Date();
  d.setDate(d.getDate() - retentionDays);
  return localYmd(d);
}

/** Rows per read (PostgREST answers at most 1000) and how many reads one day may take. */
const PAGE_ROWS = 720;
const MAX_PAGES = 10;

export default function HistoryPage() {
  const { supabase, members, profile } = useDashboard();
  // Tier-driven, not a flat 7 — see historyRetentionDays(). A flat constant was
  // blocking paying users from history they had bought.
  const retentionDays = historyRetentionDays(effectiveTier(profile));

  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [date, setDate]   = useState(todayISO());
  const [points, setPoints]    = useState<LocationHistoryPoint[]>([]);
  const [loading, setLoading]  = useState(false);
  const [error, setError]      = useState('');
  /** Set when the day had more points than one load reads (MAX_PAGES full pages). */
  const [capped, setCapped]    = useState(false);
  /** The member + day the shown points belong to (null = nothing loaded yet). */
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  /** Only the newest Load may write its answer (a slow one must not replace a newer one). */
  const loadSeq = useRef(0);

  // Playback
  const [cursor, setCursor]  = useState(0);   // index into points
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed]     = useState<Speed>(1);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Map
  const mapRef     = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<any>(null);   // L
  const mapObjRef  = useRef<any>(null);   // L.Map
  const polyRef    = useRef<any>(null);   // L.Polyline
  const markerRef  = useRef<any>(null);   // L.Marker (current position dot)

  // Init Leaflet
  useEffect(() => {
    if (!mapRef.current || mapObjRef.current) return;
    import('leaflet').then(L => {
      leafletRef.current = L;
      const map = L.map(mapRef.current!, { zoomControl: true }).setView([20.5937, 78.9629], 5);
      L.tileLayer(MAP_TILE_URL, mapTileOptions()).addTo(map);
      mapObjRef.current = map;
    });
    return () => { mapObjRef.current?.remove(); mapObjRef.current = null; };
  }, []);

  // Draw polyline when points change
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapObjRef.current;
    if (!L || !map) return;

    polyRef.current?.remove();
    markerRef.current?.remove();
    polyRef.current = null;
    markerRef.current = null;

    if (points.length === 0) return;

    const latlngs = points.map(p => [p.lat, p.lng] as [number, number]);
    const poly = L.polyline(latlngs, { color: '#7C88FF', weight: 2, opacity: 0.8 }).addTo(map);
    polyRef.current = poly;
    map.fitBounds(poly.getBounds(), { padding: [32, 32] });

    const icon = L.divIcon({
      className: '',
      html: '<div style="width:12px;height:12px;border-radius:50%;background:#7C88FF;border:2px solid #080A1C;box-shadow:0 0 0 2px #7C88FF"></div>',
      iconSize: [12, 12], iconAnchor: [6, 6],
    });
    markerRef.current = L.marker(latlngs[cursor] ?? latlngs[0], { icon }).addTo(map);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);

  // Move marker when cursor changes
  useEffect(() => {
    if (!markerRef.current || points.length === 0) return;
    const pt = points[cursor];
    if (pt) markerRef.current.setLatLng([pt.lat, pt.lng]);
  }, [cursor, points]);

  // Playback tick
  useEffect(() => {
    if (!playing || points.length === 0) {
      clearInterval(tickRef.current!);
      return;
    }
    tickRef.current = setInterval(() => {
      setCursor(prev => {
        if (prev >= points.length - 1) { setPlaying(false); return prev; }
        return prev + 1;
      });
    }, 1000 / speed);
    return () => clearInterval(tickRef.current!);
  }, [playing, speed, points.length]);

  async function fetchHistory() {
    if (!selectedMemberId) { setError('Select a member first.'); return; }
    const seq = ++loadSeq.current;
    const memberId = selectedMemberId;
    const day = date;
    setLoading(true); setError(''); setPlaying(false); setCursor(0); setCapped(false);
    // The local day, from its first to its last millisecond, sent as UTC instants.
    const from = new Date(`${day}T00:00:00`).toISOString();
    const to   = new Date(`${day}T23:59:59.999`).toISOString();

    // Paged like the app's getHistoryRange: each page continues after the last row it got. One
    // capped read used to cut the rest of a busy day off without saying so.
    const out: LocationHistoryPoint[] = [];
    let after: string | null = null;
    let full = false;
    let partialError = '';
    for (let page = 0; page < MAX_PAGES; page++) {
      let q = supabase
        .from('location_history')
        .select('id,lat,lng,speed_mps,activity_type,recorded_at')
        .eq('user_id', memberId)
        .lte('recorded_at', to)
        .order('recorded_at', { ascending: true })
        .limit(PAGE_ROWS);
      q = after ? q.gt('recorded_at', after) : q.gte('recorded_at', from);
      const { data, error: err } = await q;
      if (seq !== loadSeq.current) return; // a newer Load took over
      if (err) {
        if (page === 0) { setLoading(false); setError(err.message); return; }
        partialError = err.message;
        break;
      }
      const rows = (data ?? []) as LocationHistoryPoint[];
      out.push(...rows);
      full = rows.length === PAGE_ROWS;
      if (!full) break;
      // The raw value (no Date round trip, which drops microseconds). As in the app, a second row
      // with exactly this instant, cut off by the page end, is not read.
      after = rows[rows.length - 1].recorded_at;
    }
    setLoading(false);
    setPoints(out);
    setLoadedKey(`${memberId}|${day}`);
    setCapped(!partialError && full);
    if (partialError) setError(`Could not read the whole day (${partialError}). Showing the first ${out.length} points.`);
  }

  const currentPt = points[cursor];

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-dark-border bg-dark-surface shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <IconHistory size={18} className="text-primary" />
          <h1 className="text-base font-semibold text-dark-text">History Playback</h1>
        </div>
        <div className="flex flex-wrap gap-2 items-end">
          {/* Member select */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-dark-muted">Member</label>
            <select
              value={selectedMemberId}
              onChange={e => setSelectedMemberId(e.target.value)}
              className="bg-dark-bg border border-dark-border rounded-lg px-2.5 py-1.5 text-sm text-dark-text focus:outline-none focus:ring-1 focus:ring-primary min-w-[140px]"
            >
              <option value="">Choose member…</option>
              {members.map(m => (
                <option key={m.user_id} value={m.user_id}>{m.display_name ?? 'Unknown'}</option>
              ))}
            </select>
          </div>
          {/* Date */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-dark-muted">Date (last {retentionDays} days)</label>
            <input
              type="date"
              value={date}
              min={minDate(retentionDays)}
              max={todayISO()}
              onChange={e => setDate(e.target.value)}
              className="bg-dark-bg border border-dark-border rounded-lg px-2.5 py-1.5 text-sm text-dark-text focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            onClick={fetchHistory}
            disabled={loading}
            className="px-4 py-1.5 bg-primary text-dark-bg text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity self-end"
          >
            {loading ? 'Loading…' : 'Load'}
          </button>
        </div>
        {error && <p className="text-xs text-brand-danger mt-2">{error}</p>}
        {capped && points.length > 0 && (
          <p className="text-xs text-dark-muted mt-2">Showing the first {points.length} points of this day.</p>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative overflow-hidden">
        <div ref={mapRef} className="absolute inset-0 z-0" />

        {/* Empty overlay */}
        {!loading && points.length === 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="text-center bg-dark-surface/80 backdrop-blur rounded-2xl px-6 py-8 border border-dark-border">
              <IconHistory size={28} className="text-dark-muted mx-auto mb-2" />
              <p className="text-dark-muted text-sm">
                {loadedKey === `${selectedMemberId}|${date}`
                  ? 'No points for this day.'
                  : 'Select a member and date, then tap Load.'}
              </p>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="w-7 h-7 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {/* Playback controls — bottom overlay */}
        {points.length > 0 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-dark-surface/95 backdrop-blur border border-dark-border rounded-2xl px-4 py-3 w-[calc(100%-2rem)] max-w-lg shadow-xl">
            {/* Scrubber */}
            <input
              type="range" min={0} max={points.length - 1} value={cursor}
              onChange={e => { setPlaying(false); setCursor(Number(e.target.value)); }}
              className="w-full accent-primary mb-2"
            />
            <div className="flex items-center justify-between text-xs text-dark-muted mb-2">
              <span>{fmt(points[0].recorded_at)}</span>
              {currentPt && <span className="font-semibold text-dark-text">{fmt(currentPt.recorded_at)}</span>}
              <span>{fmt(points[points.length - 1].recorded_at)}</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <button
                onClick={() => setPlaying(v => !v)}
                className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label={playing ? 'Pause' : 'Play'}
              >
                {playing ? <IconPause size={16} className="text-dark-bg" /> : <IconPlay size={16} className="text-dark-bg" />}
              </button>
              <button
                onClick={() => { setPlaying(false); setCursor(points.length - 1); }}
                className="w-8 h-8 rounded-xl bg-dark-bg border border-dark-border flex items-center justify-center hover:border-primary text-dark-muted hover:text-dark-text transition-colors"
                aria-label="Skip to end"
              >
                <IconSkipForward size={14} />
              </button>
              {/* Speed toggle */}
              {([1, 10, 60] as Speed[]).map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    speed === s ? 'bg-primary/20 text-primary' : 'bg-dark-bg text-dark-muted hover:text-dark-text border border-dark-border'
                  }`}
                >
                  {s}×
                </button>
              ))}
              <span className="ml-auto text-xs text-dark-muted">
                {cursor + 1} / {points.length}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
