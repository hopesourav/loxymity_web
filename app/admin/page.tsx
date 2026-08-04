'use client';

import { useEffect, useRef, useState } from 'react';
import { useAdmin } from './_lib/adminContext';
import type { OverviewStats, SosAlert, AdminLocation } from './_lib/types';

const ACTIVE_MS = 15 * 60 * 1000;
const STALE_MS = 60 * 60 * 1000;

export default function AdminOverviewPage() {
  const { supabase } = useAdmin();
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [recentSos, setRecentSos] = useState<SosAlert[]>([]);
  const [locations, setLocations] = useState<AdminLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<unknown>(null);

  useEffect(() => {
    async function load() {
      const now = Date.now();
      const activeThreshold = new Date(now - ACTIVE_MS).toISOString();
      const staleThreshold = new Date(now - STALE_MS).toISOString();

      const [
        { count: totalUsers },
        { count: proUsers },
        { count: activeDevices },
        { count: staleDevices },
        { count: offlineDevices },
        { count: activeSos },
        { count: retryQueue },
        { data: sosData },
        { data: locData },
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true })
          .or('subscription_tier.eq.pro,web_tier.eq.pro'),
        supabase.from('latest_locations').select('user_id', { count: 'exact', head: true })
          .gte('reported_at', activeThreshold),
        supabase.from('latest_locations').select('user_id', { count: 'exact', head: true })
          .lt('reported_at', activeThreshold)
          .gte('reported_at', staleThreshold),
        supabase.from('latest_locations').select('user_id', { count: 'exact', head: true })
          .lt('reported_at', staleThreshold),
        supabase.from('sos_alerts').select('id', { count: 'exact', head: true })
          .eq('resolved', false),
        supabase.from('location_refresh_attempts').select('id', { count: 'exact', head: true })
          .not('status', 'in', '(resolved,exhausted)'),
        supabase.from('sos_alerts')
          .select('id,sender_id,circle_id,message,resolved,created_at,profiles!sender_id(display_name),circles(name)')
          .order('created_at', { ascending: false })
          .limit(6),
        supabase.from('latest_locations')
          .select('user_id,lat,lng,reported_at,battery_level,activity_type'),
      ]);

      setStats({
        totalUsers: totalUsers ?? 0,
        proUsers: proUsers ?? 0,
        activeDevices: activeDevices ?? 0,
        staleDevices: staleDevices ?? 0,
        offlineDevices: offlineDevices ?? 0,
        activeSos: activeSos ?? 0,
        retryQueue: retryQueue ?? 0,
      });
      setRecentSos((sosData ?? []) as unknown as SosAlert[]);
      setLocations((locData ?? []) as AdminLocation[]);
      setLoading(false);
    }
    load();
  }, [supabase]);

  useEffect(() => {
    if (!locations.length || !mapRef.current) return;
    if (typeof window === 'undefined') return;

    async function initMap() {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      const L = (await import('leaflet')).default;
      if (!mapRef.current) return;
      if (leafletMapRef.current) (leafletMapRef.current as { remove: () => void }).remove();

      const map = L.map(mapRef.current).setView([20, 78], 4);
      leafletMapRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OSM contributors © CARTO',
      }).addTo(map);

      const now = Date.now();
      for (const loc of locations) {
        const age = now - new Date(loc.reported_at).getTime();
        const color =
          age < 5 * 60 * 1000 ? '#5C8F6B'
          : age < 15 * 60 * 1000 ? '#C9A227'
          : age < 60 * 60 * 1000 ? '#C08B3E'
          : '#B5453F';

        const icon = L.divIcon({
          html: `<div style="background:${color};width:10px;height:10px;border-radius:50%;border:2px solid rgba(255,255,255,0.25)"></div>`,
          iconSize: [10, 10],
          className: '',
        });

        L.marker([loc.lat, loc.lng], { icon })
          .addTo(map)
          .bindPopup(`Last seen: ${new Date(loc.reported_at).toLocaleTimeString()}`);
      }

      if (locations.length > 0) {
        const group = L.featureGroup(locations.map((l) => L.marker([l.lat, l.lng])));
        try { map.fitBounds(group.getBounds().pad(0.2)); } catch { /* empty bounds */ }
      }
    }

    initMap();
  }, [locations]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = stats
    ? [
        { label: 'Total Users', value: stats.totalUsers, color: 'text-dark-text', sub: `${stats.proUsers} Pro` },
        { label: 'Active Devices', value: stats.activeDevices, color: 'text-brand-success', sub: '< 15 min ago' },
        { label: 'Stale Devices', value: stats.staleDevices, color: 'text-primary', sub: '15 min – 1 h' },
        { label: 'Offline', value: stats.offlineDevices, color: 'text-brand-danger', sub: '> 1 hour' },
        { label: 'SOS Active', value: stats.activeSos, color: stats.activeSos > 0 ? 'text-brand-danger' : 'text-dark-text', sub: 'unresolved' },
        { label: 'Push Retry', value: stats.retryQueue, color: stats.retryQueue > 0 ? 'text-brand-warning' : 'text-dark-text', sub: 'dormant devices' },
      ]
    : [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-dark-text">Platform Overview</h1>
        <p className="text-dark-muted text-sm mt-0.5">{new Date().toLocaleString()}</p>
      </div>

      {stats && stats.activeSos > 0 && (
        <div className="bg-brand-danger/10 border border-brand-danger/30 rounded-2xl px-5 py-4 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-danger animate-pulse shrink-0" />
          <p className="text-brand-danger font-semibold text-sm">
            {stats.activeSos} active SOS alert{stats.activeSos !== 1 ? 's' : ''} —{' '}
            <a href="/admin/sos" className="underline">view now</a>
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {statCards.map((s) => (
          <div key={s.label} className="bg-dark-surface border border-dark-border rounded-2xl p-4">
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-dark-text text-xs font-semibold mt-1">{s.label}</p>
            <p className="text-dark-muted text-xs">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Fleet map */}
        <div className="xl:col-span-2 bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-dark-border flex items-center justify-between">
            <p className="font-semibold text-dark-text">Live Fleet Map</p>
            <div className="flex items-center gap-4 text-xs text-dark-muted">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-success inline-block" /> Active</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary inline-block" /> Stale</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-danger inline-block" /> Offline</span>
            </div>
          </div>
          <div ref={mapRef} style={{ height: 360 }} />
        </div>

        {/* Recent SOS */}
        <div className="bg-dark-surface border border-dark-border rounded-2xl flex flex-col">
          <div className="px-5 py-4 border-b border-dark-border flex items-center justify-between">
            <p className="font-semibold text-dark-text">Recent SOS</p>
            <a href="/admin/sos" className="text-xs text-primary hover:underline">View all</a>
          </div>
          <div className="flex-1 divide-y divide-dark-border overflow-auto">
            {recentSos.length === 0 && (
              <p className="px-5 py-10 text-center text-dark-muted text-sm">No SOS alerts.</p>
            )}
            {recentSos.map((s) => (
              <div key={s.id} className="px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      s.resolved ? 'bg-dark-muted' : 'bg-brand-danger animate-pulse'
                    }`}
                  />
                  <p className="text-sm font-medium text-dark-text truncate">
                    {(s.profiles as unknown as { display_name: string | null })?.display_name ?? 'Unknown'}
                  </p>
                  <span
                    className={`ml-auto text-xs px-1.5 py-0.5 rounded-full shrink-0 ${
                      s.resolved
                        ? 'bg-dark-bg text-dark-muted'
                        : 'bg-brand-danger/10 text-brand-danger'
                    }`}
                  >
                    {s.resolved ? 'resolved' : 'active'}
                  </span>
                </div>
                {s.message && (
                  <p className="text-xs text-dark-muted mt-0.5 ml-4 truncate">{s.message}</p>
                )}
                <p className="text-xs text-dark-muted mt-0.5 ml-4">
                  {new Date(s.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
