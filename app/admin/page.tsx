'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://szsipgfrxvvkgqtpwhso.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Simple admin password — gate only, not a security boundary.
// Real security is enforced by Supabase RLS on the server.
const ADMIN_PASSWORD = 'loxy-admin-2024';

type BeaconToken = {
  id: string;
  name: string;
  owner_id: string;
  beacon_uuid: string;
  major: number;
  minor: number;
  lat: number | null;
  lng: number | null;
  last_seen_at: string | null;
  created_at: string;
  profiles?: { display_name: string | null };
};

type GeofenceRow = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius_m: number;
  active: boolean;
  owner_id: string;
};

type Stats = {
  totalBeacons: number;
  activeToday: number;
  totalGeofences: number;
  activeGeofences: number;
  totalSightings: number;
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [step, setStep] = useState<'gate' | 'login'>('gate');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [beacons, setBeacons] = useState<BeaconToken[]>([]);
  const [geofences, setGeofences] = useState<GeofenceRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'beacons' | 'geofences'>('map');

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<unknown>(null);

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  function handleGate() {
    if (password === ADMIN_PASSWORD) {
      setStep('login');
      setError('');
    } else {
      setError('Incorrect admin password.');
    }
  }

  async function handleLogin() {
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password: loginPassword,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setAuthed(true);
      loadData();
    }
  }

  async function loadData() {
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

    const tokens: BeaconToken[] = (beaconData as BeaconToken[]) ?? [];
    const fences: GeofenceRow[] = (geoData as GeofenceRow[]) ?? [];

    const activeToday = tokens.filter(
      (b) => b.last_seen_at && new Date(b.last_seen_at) >= today
    ).length;

    setBeacons(tokens);
    setGeofences(fences);
    setStats({
      totalBeacons: tokens.length,
      activeToday,
      totalGeofences: fences.length,
      activeGeofences: fences.filter((f) => f.active).length,
      totalSightings: sightCount ?? 0,
    });
  }

  // Build Leaflet map after auth + data loaded
  useEffect(() => {
    if (!authed || activeTab !== 'map') return;
    if (typeof window === 'undefined') return;

    async function initMap() {
      // Inject Leaflet CSS once
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      const L = (await import('leaflet')).default;

      if (!mapRef.current) return;
      if (leafletMapRef.current) {
        (leafletMapRef.current as { remove: () => void }).remove();
      }

      const map = L.map(mapRef.current).setView([20, 0], 2);
      leafletMapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      // Beacon markers
      const beaconIcon = L.divIcon({
        html: `<div style="background:#5C6BF8;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(92,107,248,0.4)">📡</div>`,
        iconSize: [28, 28],
        className: '',
      });

      const withLocation = beacons.filter((b) => b.lat !== null && b.lng !== null);
      for (const b of withLocation) {
        const lastSeen = b.last_seen_at
          ? new Date(b.last_seen_at).toLocaleString()
          : 'Never';
        L.marker([b.lat!, b.lng!], { icon: beaconIcon })
          .addTo(map)
          .bindPopup(
            `<b>${b.name}</b><br/>Minor: ${b.minor}<br/>Last seen: ${lastSeen}`
          );
        // Coverage ring (~30 m detection range)
        L.circle([b.lat!, b.lng!], {
          radius: 30,
          color: '#5C6BF8',
          fillColor: '#5C6BF8',
          fillOpacity: 0.1,
          weight: 1,
        }).addTo(map);
      }

      // Geofence circles
      for (const g of geofences) {
        L.circle([g.lat, g.lng], {
          radius: g.radius_m,
          color: g.active ? '#10B981' : '#9CA3AF',
          fillColor: g.active ? '#10B981' : '#9CA3AF',
          fillOpacity: 0.08,
          weight: 1.5,
        })
          .addTo(map)
          .bindPopup(`<b>${g.name}</b><br/>Radius: ${g.radius_m}m<br/>Status: ${g.active ? 'Active' : 'Paused'}`);
      }

      if (withLocation.length > 0) {
        const group = L.featureGroup(
          withLocation.map((b) => L.marker([b.lat!, b.lng!]))
        );
        map.fitBounds(group.getBounds().pad(0.3));
      }
    }

    initMap();
  }, [authed, activeTab, beacons, geofences]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-8">
            <p className="text-2xl font-black text-gray-900">Loxymity</p>
            <p className="text-gray-500 text-sm mt-1">Admin Dashboard</p>
          </div>

          {step === 'gate' ? (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin password</label>
              <input
                type="password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGate()}
              />
              {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
              <button
                onClick={handleGate}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Continue
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">Sign in with your Loxymity account to view network data.</p>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-black text-gray-900 text-lg">Loxymity Admin</p>
          <p className="text-gray-400 text-xs">Network device coverage</p>
        </div>
        <a href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">← Back to site</a>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Total beacons', value: stats.totalBeacons, color: 'text-primary' },
              { label: 'Active today', value: stats.activeToday, color: 'text-emerald-600' },
              { label: 'Sightings today', value: stats.totalSightings, color: 'text-blue-600' },
              { label: 'Total geofences', value: stats.totalGeofences, color: 'text-violet-600' },
              { label: 'Active geofences', value: stats.activeGeofences, color: 'text-amber-600' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
                <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-gray-500 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['map', 'beacons', 'geofences'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              {tab === 'map' ? '🗺️ Coverage Map' : tab === 'beacons' ? '📡 Beacons' : '📐 Geofences'}
            </button>
          ))}
        </div>

        {/* Map tab */}
        {activeTab === 'map' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
              <p className="font-semibold text-gray-900">Network Coverage Map</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-primary inline-block" /> Beacon token</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Active geofence</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-400 inline-block" /> Paused geofence</span>
              </div>
            </div>
            <div ref={mapRef} style={{ height: '560px' }} />
            {beacons.filter((b) => b.lat).length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-gray-400 text-sm">No beacon locations reported yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Beacons tab */}
        {activeTab === 'beacons' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="font-semibold text-gray-900">Registered Beacon Tokens ({beacons.length})</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-left">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Minor</th>
                    <th className="px-6 py-3 font-medium">Last location</th>
                    <th className="px-6 py-3 font-medium">Last seen</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {beacons.map((b) => {
                    const lastSeen = b.last_seen_at ? new Date(b.last_seen_at) : null;
                    const isActive = lastSeen && Date.now() - lastSeen.getTime() < 24 * 60 * 60 * 1000;
                    return (
                      <tr key={b.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium text-gray-900">{b.name}</td>
                        <td className="px-6 py-3 text-gray-500">{b.minor}</td>
                        <td className="px-6 py-3 text-gray-500 font-mono text-xs">
                          {b.lat !== null ? `${b.lat.toFixed(5)}, ${b.lng!.toFixed(5)}` : '—'}
                        </td>
                        <td className="px-6 py-3 text-gray-500">
                          {lastSeen ? lastSeen.toLocaleString() : 'Never'}
                        </td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                            isActive ? 'bg-emerald-100 text-emerald-700' : b.last_seen_at ? 'bg-gray-100 text-gray-600' : 'bg-amber-100 text-amber-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : b.last_seen_at ? 'bg-gray-400' : 'bg-amber-400'}`} />
                            {isActive ? 'Active' : b.last_seen_at ? 'Inactive' : 'Never seen'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {beacons.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No beacon tokens registered yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Geofences tab */}
        {activeTab === 'geofences' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="font-semibold text-gray-900">Geofences ({geofences.length})</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-left">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Center</th>
                    <th className="px-6 py-3 font-medium">Radius</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {geofences.map((g) => (
                    <tr key={g.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-900">{g.name}</td>
                      <td className="px-6 py-3 text-gray-500 font-mono text-xs">
                        {g.lat.toFixed(5)}, {g.lng.toFixed(5)}
                      </td>
                      <td className="px-6 py-3 text-gray-500">{g.radius_m} m</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          g.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${g.active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                          {g.active ? 'Active' : 'Paused'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {geofences.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-400">No geofences created yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
