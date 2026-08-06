'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useDashboard } from '../../_lib/context';
import { HISTORY_RETENTION_DAYS } from '../../_lib/constants';
import type { LocationHistoryPoint } from '../../_lib/types';
import { IconHistory, IconPlay, IconPause, IconSkipForward, IconUser } from '../../_components/Icons';

type Speed = 1 | 10 | 60;

function fmt(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function todayISO() { return new Date().toISOString().slice(0, 10); }
function minDate() {
  const d = new Date();
  d.setDate(d.getDate() - HISTORY_RETENTION_DAYS);
  return d.toISOString().slice(0, 10);
}

export default function HistoryPage() {
  const { supabase, members } = useDashboard();

  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [date, setDate]   = useState(todayISO());
  const [points, setPoints]    = useState<LocationHistoryPoint[]>([]);
  const [loading, setLoading]  = useState(false);
  const [error, setError]      = useState('');

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
      const map = L.map(mapRef.current!, { zoomControl: true, attributionControl: false }).setView([20.5937, 78.9629], 5);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd', maxZoom: 19,
      }).addTo(map);
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
    const poly = L.polyline(latlngs, { color: '#C9A227', weight: 2, opacity: 0.8 }).addTo(map);
    polyRef.current = poly;
    map.fitBounds(poly.getBounds(), { padding: [32, 32] });

    const icon = L.divIcon({
      className: '',
      html: '<div style="width:12px;height:12px;border-radius:50%;background:#C9A227;border:2px solid #0A0C10;box-shadow:0 0 0 2px #C9A227"></div>',
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
    setLoading(true); setError(''); setPlaying(false); setCursor(0);
    const from = `${date}T00:00:00.000Z`;
    const to   = `${date}T23:59:59.999Z`;
    const { data, error: err } = await supabase
      .from('location_history')
      .select('id,lat,lng,speed_mps,activity_type,recorded_at')
      .eq('user_id', selectedMemberId)
      .gte('recorded_at', from)
      .lte('recorded_at', to)
      .order('recorded_at', { ascending: true })
      .limit(1000);
    setLoading(false);
    if (err) { setError(err.message); return; }
    setPoints((data ?? []) as LocationHistoryPoint[]);
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
            <label className="text-xs text-dark-muted">Date (last {HISTORY_RETENTION_DAYS} days)</label>
            <input
              type="date"
              value={date}
              min={minDate()}
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
      </div>

      {/* Map */}
      <div className="flex-1 relative overflow-hidden">
        <div ref={mapRef} className="absolute inset-0 z-0" />

        {/* Empty overlay */}
        {!loading && points.length === 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="text-center bg-dark-surface/80 backdrop-blur rounded-2xl px-6 py-8 border border-dark-border">
              <IconHistory size={28} className="text-dark-muted mx-auto mb-2" />
              <p className="text-dark-muted text-sm">Select a member and date, then tap Load.</p>
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
