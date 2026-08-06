'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useDashboard } from '../../_lib/context';
import type { GeofenceRow } from '../../_lib/types';
import { IconFence, IconPlus, IconEdit, IconTrash, IconSearch, IconX, IconCheck } from '../../_components/Icons';

const MIN_RADIUS = 50;
const MAX_RADIUS = 5000;

function debounce<T extends (...args: any[]) => any>(fn: T, ms: number): T {
  let t: ReturnType<typeof setTimeout>;
  return ((...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); }) as T;
}

type DrawerMode = 'create' | 'edit';

export default function FencesPage() {
  const { supabase, activeCircleId, userId } = useDashboard();
  const [fences, setFences]   = useState<GeofenceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawer, setDrawer]   = useState<{ mode: DrawerMode; fence?: GeofenceRow } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  // Map
  const mapRef    = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<any>(null);
  const mapObjRef  = useRef<any>(null);
  const circlesRef = useRef<Map<string, any>>(new Map());

  // Form state
  const [formName, setFormName]     = useState('');
  const [formRadius, setFormRadius] = useState(200);
  const [formLat, setFormLat]       = useState<number | null>(null);
  const [formLng, setFormLng]       = useState<number | null>(null);
  const [searchQ, setSearchQ]       = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const previewCircleRef = useRef<any>(null);
  const clickListenerRef = useRef<any>(null);

  async function loadFences() {
    setLoading(true);
    const { data } = await supabase
      .from('geofences')
      .select('*')
      .eq('circle_id', activeCircleId)
      .order('created_at', { ascending: false });
    setFences((data ?? []) as GeofenceRow[]);
    setLoading(false);
  }

  useEffect(() => { loadFences(); }, [activeCircleId]);

  // Init map
  useEffect(() => {
    if (!mapRef.current || mapObjRef.current) return;
    import('leaflet').then(L => {
      leafletRef.current = L;
      const map = L.map(mapRef.current!, { zoomControl: true, attributionControl: false })
        .setView([20.5937, 78.9629], 5);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd', maxZoom: 19,
      }).addTo(map);
      mapObjRef.current = map;
    });
    return () => { mapObjRef.current?.remove(); mapObjRef.current = null; };
  }, []);

  // Draw fence circles on map
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapObjRef.current;
    if (!L || !map) return;

    circlesRef.current.forEach(c => c.remove());
    circlesRef.current.clear();

    fences.forEach(f => {
      const c = L.circle([f.lat, f.lng], {
        radius: f.radius_m, color: '#C9A227', fillColor: '#C9A227', fillOpacity: 0.1, weight: 2,
      }).addTo(map).bindTooltip(f.name);
      circlesRef.current.set(f.id, c);
    });

    if (fences.length > 0) {
      const group = L.featureGroup(Array.from(circlesRef.current.values()));
      try { map.fitBounds(group.getBounds(), { padding: [32, 32] }); } catch {}
    }
  }, [fences]);

  // Preview circle while creating/editing
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapObjRef.current;
    if (!L || !map) return;
    previewCircleRef.current?.remove();
    previewCircleRef.current = null;
    if (drawer && formLat !== null && formLng !== null) {
      previewCircleRef.current = L.circle([formLat, formLng], {
        radius: formRadius, color: '#5C8F6B', fillColor: '#5C8F6B', fillOpacity: 0.15, weight: 2, dashArray: '6',
      }).addTo(map);
      map.setView([formLat, formLng], 15);
    }
  }, [drawer, formLat, formLng, formRadius]);

  // Map click to set location
  useEffect(() => {
    const map = mapObjRef.current;
    if (!map) return;
    if (clickListenerRef.current) map.off('click', clickListenerRef.current);
    if (!drawer) return;
    const handler = (e: any) => { setFormLat(e.latlng.lat); setFormLng(e.latlng.lng); };
    map.on('click', handler);
    clickListenerRef.current = handler;
    return () => { map.off('click', handler); };
  }, [drawer]);

  const doSearch = useCallback(debounce(async (q: string) => {
    if (q.length < 3) { setSearchResults([]); return; }
    setSearchLoading(true);
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`);
    const data = await res.json();
    setSearchResults(data);
    setSearchLoading(false);
  }, 500), []);

  useEffect(() => { doSearch(searchQ); }, [searchQ, doSearch]);

  function openCreate() {
    setFormName(''); setFormRadius(200); setFormLat(null); setFormLng(null);
    setSearchQ(''); setSearchResults([]); setError('');
    setDrawer({ mode: 'create' });
  }

  function openEdit(f: GeofenceRow) {
    setFormName(f.name); setFormRadius(f.radius_m); setFormLat(f.lat); setFormLng(f.lng);
    setSearchQ(''); setSearchResults([]); setError('');
    setDrawer({ mode: 'edit', fence: f });
  }

  function closeDrawer() {
    previewCircleRef.current?.remove(); previewCircleRef.current = null;
    const map = mapObjRef.current;
    if (map && clickListenerRef.current) { map.off('click', clickListenerRef.current); clickListenerRef.current = null; }
    setDrawer(null);
  }

  async function handleSave() {
    if (!formName.trim()) { setError('Name is required.'); return; }
    if (formLat === null || formLng === null) { setError('Pick a location on the map or search for an address.'); return; }
    setSaving(true); setError('');
    if (drawer?.mode === 'create') {
      const { error: e } = await supabase.from('geofences').insert({
        circle_id: activeCircleId, created_by: userId,
        name: formName.trim(), lat: formLat, lng: formLng, radius_m: formRadius,
      });
      if (e) { setError(e.message); setSaving(false); return; }
    } else if (drawer?.fence) {
      const { error: e } = await supabase.from('geofences')
        .update({ name: formName.trim(), lat: formLat, lng: formLng, radius_m: formRadius })
        .eq('id', drawer.fence.id);
      if (e) { setError(e.message); setSaving(false); return; }
    }
    setSaving(false);
    closeDrawer();
    await loadFences();
  }

  async function handleDelete(id: string) {
    await supabase.from('geofences').delete().eq('id', id);
    setDeleteId(null);
    await loadFences();
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left panel — list */}
      <div className="w-72 shrink-0 flex flex-col border-r border-dark-border overflow-hidden">
        <div className="px-4 py-4 border-b border-dark-border bg-dark-surface shrink-0">
          <div className="flex items-center justify-between mb-0">
            <div className="flex items-center gap-2">
              <IconFence size={17} className="text-primary" />
              <h1 className="text-sm font-semibold text-dark-text">Geofences</h1>
            </div>
            <button
              onClick={openCreate}
              className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center hover:opacity-90 transition-opacity"
              aria-label="Create fence"
            >
              <IconPlus size={14} className="text-dark-bg" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-5 h-5 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
            </div>
          ) : fences.length === 0 ? (
            <div className="text-center py-10 px-4">
              <IconFence size={28} className="text-dark-muted mx-auto mb-2" />
              <p className="text-dark-muted text-xs">No geofences yet. Create one to get started.</p>
            </div>
          ) : (
            <ul className="divide-y divide-dark-border">
              {fences.map(f => (
                <li key={f.id} className="px-4 py-3 flex items-start justify-between gap-2 hover:bg-dark-surface/50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-dark-text truncate">{f.name}</p>
                    <p className="text-xs text-dark-muted">{f.radius_m} m radius</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => openEdit(f)} className="p-1 text-dark-muted hover:text-dark-text transition-colors" aria-label="Edit">
                      <IconEdit size={13} />
                    </button>
                    <button onClick={() => setDeleteId(f.id)} className="p-1 text-dark-muted hover:text-brand-danger transition-colors" aria-label="Delete">
                      <IconTrash size={13} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative overflow-hidden">
        <div ref={mapRef} className="absolute inset-0 z-0" />

        {/* Create/Edit drawer */}
        {drawer && (
          <div className="absolute top-4 right-4 z-10 w-72 bg-dark-surface border border-dark-border rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-dark-text">
                {drawer.mode === 'create' ? 'Create Geofence' : 'Edit Geofence'}
              </p>
              <button onClick={closeDrawer} className="text-dark-muted hover:text-dark-text transition-colors">
                <IconX size={15} />
              </button>
            </div>

            {/* Name */}
            <div className="mb-3">
              <label className="block text-xs text-dark-muted mb-1">Name</label>
              <input
                type="text" value={formName} onChange={e => setFormName(e.target.value)}
                placeholder="Home, School, Work…"
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-sm text-dark-text focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Address search */}
            <div className="mb-3 relative">
              <label className="block text-xs text-dark-muted mb-1">Location</label>
              <div className="relative">
                <input
                  type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)}
                  placeholder="Search address or tap map"
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 pl-7 text-sm text-dark-text focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <IconSearch size={13} className="absolute left-2.5 top-2.5 text-dark-muted" />
              </div>
              {searchLoading && <p className="text-xs text-dark-muted mt-1">Searching…</p>}
              {searchResults.length > 0 && (
                <ul className="absolute z-20 bg-dark-surface border border-dark-border rounded-xl mt-1 w-full shadow-xl max-h-36 overflow-y-auto">
                  {searchResults.map((r, i) => (
                    <li key={i}>
                      <button
                        onClick={() => {
                          setFormLat(parseFloat(r.lat)); setFormLng(parseFloat(r.lon));
                          setSearchQ(r.display_name.split(',').slice(0, 2).join(','));
                          setSearchResults([]);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-dark-muted hover:text-dark-text hover:bg-dark-bg transition-colors"
                      >
                        {r.display_name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {formLat !== null && (
              <p className="text-xs text-dark-muted mb-3">{formLat.toFixed(5)}, {formLng!.toFixed(5)}</p>
            )}

            {/* Radius */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-dark-muted mb-1">
                <label>Radius</label>
                <span>{formRadius} m</span>
              </div>
              <input
                type="range" min={MIN_RADIUS} max={MAX_RADIUS} step={50} value={formRadius}
                onChange={e => setFormRadius(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-dark-muted mt-0.5">
                <span>{MIN_RADIUS} m</span><span>{MAX_RADIUS} m</span>
              </div>
            </div>

            {error && <p className="text-xs text-brand-danger mb-3">{error}</p>}

            <button
              onClick={handleSave} disabled={saving}
              className="w-full bg-primary hover:opacity-90 disabled:opacity-50 text-dark-bg font-semibold py-2 rounded-xl text-sm transition-opacity"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        )}

        {/* Delete confirm */}
        {deleteId && (
          <div className="absolute inset-0 z-20 bg-dark-bg/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center">
              <p className="text-sm font-semibold text-dark-text mb-1">Delete geofence?</p>
              <p className="text-xs text-dark-muted mb-5">This will permanently remove the fence and all related events.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2 border border-dark-border rounded-xl text-sm text-dark-muted hover:text-dark-text transition-colors">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2 bg-brand-danger text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
