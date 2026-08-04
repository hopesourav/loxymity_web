'use client';

import { useEffect, useRef, useState } from 'react';
import { useAdmin } from '../_lib/adminContext';
import type { BeaconToken, GeofenceRow } from '../_lib/types';

type Stats = {
  totalBeacons: number;
  activeToday: number;
  totalSightings: number;
  totalGeofences: number;
  activeGeofences: number;
};

export default function NetworkPage() {
  const { supabase } = useAdmin();
  const [beacons, setBeacons] = useState<BeaconToken[]>([]);
  const [geofences, setGeofences] = useState<GeofenceRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'beacons' | 'geofences'>('map');
  const [loading, setLoading] = useState(true);

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<unknown>(null);

  useEffect(() => {
    async function load() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [{ data: beaconData }, { data: geoData }, { count: sightCount }] = await Promise.all([
        supabase
          .from('beacon_tokens')
          .select('*, profiles(display_name)')
          .order('last_seen_at', { ascending: false }),
        supabase
          .from('geofences')
          .select('id, name, lat, lng, radius_m, active, owner_id')
          .order('created_at', { ascending: false }),
        supabase
          .from('beacon_sightings')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', today.toISOString()),
      ]);

      const tokens: BeaconToken[] = (beaconData ?? []) as BeaconToken[];
      const fences: GeofenceRow[] = (geoData ?? []) as GeofenceRow[];
      const activeToday = tokens.filter(
        (b) => b.last_seen_at && new Date(b.last_seen_at) >= today,
      ).length;

      setBeacons(tokens);
      setGeofences(fences);
      setStats({
        totalBeacons: tokens.length,
        activeToday,
        totalSightings: sightCount ?? 0,
        totalGeofences: fences.length,
        activeGeofences: fences.filter((f) => f.active).length,
      });
      setLoading(false);
    }
    load();
  }, [supabase]);

  // Build Leaflet map
  useEffect(() => {
    if (loading || activeTab !== 'map') return;
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

      const map = L.map(mapRef.current).setView([20, 0], 2);
      leafletMapRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OSM contributors © CARTO',
      }).addTo(map);

      const beaconIcon = L.divIcon({
        html: `<div style="background:#5C6BF8;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(92,107,248,0.4)">📡</div>`,
        iconSize: [28, 28],
        className: '',
      });

      const withLocation = beacons.filter((b) => b.lat !== null && b.lng !== null);
      for (const b of withLocation) {
        const lastSeen = b.last_seen_at ? new Date(b.last_seen_at).toLocaleString() : 'Never';
        L.marker([b.lat!, b.lng!], { icon: beaconIcon })
          .addTo(map)
          .bindPopup(`<b>${b.name}</b><br/>Minor: ${b.minor}<br/>Last seen: ${lastSeen}`);
        L.circle([b.lat!, b.lng!], {
          radius: 30,
          color: '#5C6BF8',
          fillColor: '#5C6BF8',
          fillOpacity: 0.1,
          weight: 1,
        }).addTo(map);
      }

      for (const g of geofences) {
        L.circle([g.lat, g.lng], {
          radius: g.radius_m,
          color: g.active ? '#5C8F6B' : '#4B5563',
          fillColor: g.active ? '#5C8F6B' : '#4B5563',
          fillOpacity: 0.08,
          weight: 1.5,
        })
          .addTo(map)
          .bindPopup(`<b>${g.name}</b><br/>Radius: ${g.radius_m}m<br/>${g.active ? 'Active' : 'Paused'}`);
      }

      if (withLocation.length > 0) {
        const group = L.featureGroup(withLocation.map((b) => L.marker([b.lat!, b.lng!])));
        map.fitBounds(group.getBounds().pad(0.3));
      }
    }

    initMap();
  }, [loading, activeTab, beacons, geofences]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-dark-text">Network</h1>
        <p className="text-dark-muted text-sm">Beacon tokens and geofence coverage</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Total Beacons', value: stats.totalBeacons, color: 'text-accent-cyan' },
            { label: 'Active Today', value: stats.activeToday, color: 'text-brand-success' },
            { label: 'Sightings Today', value: stats.totalSightings, color: 'text-dark-text' },
            { label: 'Total Geofences', value: stats.totalGeofences, color: 'text-primary' },
            { label: 'Active Geofences', value: stats.activeGeofences, color: 'text-brand-success' },
          ].map((s) => (
            <div key={s.label} className="bg-dark-surface border border-dark-border rounded-2xl p-4">
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-dark-muted text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {(['map', 'beacons', 'geofences'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-primary text-dark-bg'
                : 'bg-dark-surface border border-dark-border text-dark-muted hover:text-dark-text'
            }`}
          >
            {tab === 'map' ? 'Coverage Map' : tab === 'beacons' ? 'Beacons' : 'Geofences'}
          </button>
        ))}
      </div>

      {/* Map */}
      {activeTab === 'map' && (
        <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-dark-border flex items-center gap-6">
            <p className="font-semibold text-dark-text">Network Coverage Map</p>
            <div className="flex items-center gap-4 text-xs text-dark-muted">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Beacon</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-success inline-block" /> Active fence</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-dark-muted inline-block" /> Paused fence</span>
            </div>
          </div>
          <div ref={mapRef} style={{ height: 560 }} />
        </div>
      )}

      {/* Beacons table */}
      {activeTab === 'beacons' && (
        <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-dark-border">
            <p className="font-semibold text-dark-text">Registered Beacon Tokens ({beacons.length})</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-border text-dark-muted text-left text-xs">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Minor</th>
                  <th className="px-5 py-3 font-medium">Last location</th>
                  <th className="px-5 py-3 font-medium">Last seen</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {beacons.map((b) => {
                  const lastSeen = b.last_seen_at ? new Date(b.last_seen_at) : null;
                  const isActive = lastSeen && Date.now() - lastSeen.getTime() < 24 * 3600 * 1000;
                  return (
                    <tr key={b.id} className="hover:bg-dark-bg transition-colors">
                      <td className="px-5 py-3 font-medium text-dark-text">{b.name}</td>
                      <td className="px-5 py-3 text-dark-muted">{b.minor}</td>
                      <td className="px-5 py-3 text-dark-muted font-mono text-xs">
                        {b.lat !== null ? `${b.lat.toFixed(5)}, ${b.lng!.toFixed(5)}` : '—'}
                      </td>
                      <td className="px-5 py-3 text-dark-muted text-xs whitespace-nowrap">
                        {lastSeen ? lastSeen.toLocaleString() : 'Never'}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-brand-success/10 text-brand-success'
                              : b.last_seen_at
                              ? 'bg-dark-bg text-dark-muted'
                              : 'bg-brand-warning/10 text-brand-warning'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-brand-success' : b.last_seen_at ? 'bg-dark-muted' : 'bg-brand-warning'
                            }`}
                          />
                          {isActive ? 'Active' : b.last_seen_at ? 'Inactive' : 'Never seen'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {beacons.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-dark-muted">
                      No beacon tokens registered.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Geofences table */}
      {activeTab === 'geofences' && (
        <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-dark-border">
            <p className="font-semibold text-dark-text">Geofences ({geofences.length})</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-border text-dark-muted text-left text-xs">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Center</th>
                  <th className="px-5 py-3 font-medium">Radius</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {geofences.map((g) => (
                  <tr key={g.id} className="hover:bg-dark-bg transition-colors">
                    <td className="px-5 py-3 font-medium text-dark-text">{g.name}</td>
                    <td className="px-5 py-3 text-dark-muted font-mono text-xs">
                      {g.lat.toFixed(5)}, {g.lng.toFixed(5)}
                    </td>
                    <td className="px-5 py-3 text-dark-muted">{g.radius_m} m</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          g.active
                            ? 'bg-brand-success/10 text-brand-success'
                            : 'bg-dark-bg text-dark-muted'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${g.active ? 'bg-brand-success' : 'bg-dark-muted'}`} />
                        {g.active ? 'Active' : 'Paused'}
                      </span>
                    </td>
                  </tr>
                ))}
                {geofences.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-dark-muted">
                      No geofences created.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
