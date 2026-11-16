'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { Map as LeafletMap, Marker, Circle } from 'leaflet';
import { MAP_TILE_URL, mapTileOptions } from '../_lib/mapTiles';
// Bundled, not fetched from unpkg.com: a viewer's browser now talks only to loxymity.com, Supabase
// and the map tiles named in the Privacy Policy. The pin is a divIcon (globals.css .lox-pin), so
// Leaflet's marker images are never requested either.
import 'leaflet/dist/leaflet.css';

type LocationData = {
  lat: number;
  lng: number;
  accuracy_m: number | null;
  reported_at: string;
  display_name: string;
  avatar_url: string | null;
};

const TOKEN_RE = /^[A-Za-z0-9_-]{24}$/;

// Public values — safe to embed in client bundles.
// NEXT_PUBLIC_* env vars take precedence if set at build time.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://szsipgfrxvvkgqtpwhso.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6c2lwZ2ZyeHZ2a2dxdHB3aHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MzcxNDYsImV4cCI6MjA5MzMxMzE0Nn0.wVB1R1dsx5hbuXvuCYbgKdPDofiQApdVNeRpSIaFQrY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchLocation(token: string): Promise<LocationData | null> {
  const { data, error } = await supabase.rpc('get_shared_location', { p_token: token });
  if (error) { console.error('get_shared_location error:', error.message); return null; }
  return data as LocationData | null;
}

function formatAgo(iso: string): string {
  const secs = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

/** A reading older than this is shown as "not live" (amber dot), never as live. */
const STALE_MS = 10 * 60 * 1000;
function isStale(iso: string): boolean {
  return Date.now() - new Date(iso).getTime() > STALE_MS;
}

export default function SharePage() {
  const [status, setStatus] = useState<'loading' | 'found' | 'expired' | 'invalid'>('loading');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [lastUpdated, setLastUpdated] = useState('');
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const circleRef = useRef<Circle | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const tokenRef = useRef('');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!TOKEN_RE.test(hash)) { setStatus('invalid'); return; }
    tokenRef.current = hash;

    let cancelled = false;
    let pollId: ReturnType<typeof setInterval>;
    let tickId: ReturnType<typeof setInterval>;

    async function load() {
      const data = await fetchLocation(hash);
      if (cancelled) return;
      if (!data) { setStatus('expired'); return; }
      setLocation(data);
      setLastUpdated(formatAgo(data.reported_at));
      setStatus('found');

      pollId = setInterval(async () => {
        // Nothing to show in a background tab: skip the request (the next visible tick catches up).
        if (cancelled || document.visibilityState === 'hidden') return;
        const fresh = await fetchLocation(tokenRef.current);
        if (cancelled) return;
        if (!fresh) { setStatus('expired'); clearInterval(pollId); clearInterval(tickId); return; }
        setLocation(fresh);
        setLastUpdated(formatAgo(fresh.reported_at));
      }, 10_000);

      tickId = setInterval(() => {
        setLocation(prev => { if (prev) setLastUpdated(formatAgo(prev.reported_at)); return prev; });
      }, 1_000);
    }

    load();
    return () => { cancelled = true; clearInterval(pollId); clearInterval(tickId); };
  }, []);

  // Initialise Leaflet map once we have a location
  useEffect(() => {
    if (status !== 'found' || !location || !mapDivRef.current || mapRef.current) return;

    import('leaflet').then((L) => {
      if (!mapDivRef.current || mapRef.current) return;

      const pin = L.divIcon({ className: '', html: '<div class="lox-pin"></div>', iconSize: [18, 18], iconAnchor: [9, 9] });

      const map = L.map(mapDivRef.current, { zoomControl: true, attributionControl: true });
      L.tileLayer(MAP_TILE_URL, mapTileOptions(false)).addTo(map);
      map.setView([location.lat, location.lng], 16);

      markerRef.current = L.marker([location.lat, location.lng], { icon: pin, keyboard: false }).addTo(map);
      if (location.accuracy_m && location.accuracy_m > 0) {
        circleRef.current = L.circle([location.lat, location.lng], {
          radius: location.accuracy_m,
          color: '#7C88FF', fillColor: '#7C88FF', fillOpacity: 0.08, weight: 1.5,
        }).addTo(map);
      }
      mapRef.current = map;
    });
  }, [status, location]);

  // Update pin on subsequent polls
  useEffect(() => {
    if (!location || !mapRef.current || !markerRef.current) return;
    markerRef.current.setLatLng([location.lat, location.lng]);
    circleRef.current?.setLatLng([location.lat, location.lng]);
    if (circleRef.current && location.accuracy_m) circleRef.current.setRadius(location.accuracy_m);
    mapRef.current.panTo([location.lat, location.lng], { animate: true });
  }, [location]);

  useEffect(() => () => { mapRef.current?.remove(); mapRef.current = null; }, []);

  if (status === 'loading') {
    return (
      <div style={styles.centered}>
        <div style={styles.spinner} />
        <p style={styles.mutedText}>Finding location…</p>
      </div>
    );
  }

  if (status === 'invalid' || status === 'expired') {
    return (
      <div style={styles.centered}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔗</div>
        <h2 style={styles.heading}>
          {status === 'invalid' ? 'Invalid link' : 'This link has expired'}
        </h2>
        <p style={styles.mutedText}>
          {status === 'invalid'
            ? 'This location link is not valid. Check the URL and try again.'
            : 'The link is no longer active. Ask the sender to share a new one.'}
        </p>
        <a href="https://loxymity.com" style={styles.ctaBtn}>Get Loxymity</a>
      </div>
    );
  }

  return (
    <>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {location?.avatar_url
              ? <img src={location.avatar_url} alt="" style={styles.avatar} />
              : <div style={styles.avatarPlaceholder}>
                  {location?.display_name?.charAt(0)?.toUpperCase() ?? '?'}
                </div>
            }
            <div>
              <p style={styles.nameText}>{location?.display_name ?? 'Unknown'}</p>
              <p style={styles.mutedText}>Updated {lastUpdated}</p>
            </div>
          </div>
          {location && isStale(location.reported_at)
            ? <div style={{ ...styles.liveDot, ...styles.staleDot }} title="Not updated recently" />
            : <div style={styles.liveDot} title="Live" />}
        </div>

        <div ref={mapDivRef} style={styles.map} />

        <div style={styles.footer}>
          <p style={{ ...styles.mutedText, margin: 0, textAlign: 'center' }}>
            Shared by {location?.display_name ?? 'a Loxymity user'} for a limited time. Anyone with this link can
            see it — please don&apos;t forward it.{' '}
            <a href="https://loxymity.com" style={styles.footerLink} target="_blank" rel="noopener noreferrer">
              Get Loxymity →
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex', flexDirection: 'column',
    height: '100dvh', width: '100%',
    backgroundColor: '#080A1C', fontFamily: 'var(--font-inter), system-ui, sans-serif',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: '#11142A',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
  },
  avatar: { width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' },
  avatarPlaceholder: {
    width: 38, height: 38, borderRadius: '50%',
    backgroundColor: '#7C88FF', color: '#080A1C',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: 16,
  },
  nameText: { color: '#F5F3EE', fontWeight: 600, fontSize: 15, margin: 0 },
  mutedText: { color: '#A3A8C3', fontSize: 13, margin: '2px 0 0' },
  liveDot: {
    width: 10, height: 10, borderRadius: '50%',
    backgroundColor: '#10B981',
    boxShadow: '0 0 0 3px rgba(16,185,129,0.25)',
  },
  staleDot: { backgroundColor: '#F59E0B', boxShadow: '0 0 0 3px rgba(245,158,11,0.25)' },
  map: { flex: 1, width: '100%' },
  footer: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '10px 16px',
    backgroundColor: '#11142A',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
  },
  footerLink: { color: '#8C97FF', fontSize: 13, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' },
  centered: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    height: '100dvh', backgroundColor: '#080A1C',
    fontFamily: 'var(--font-inter), system-ui, sans-serif', padding: '0 24px', textAlign: 'center',
  },
  spinner: {
    width: 36, height: 36, borderRadius: '50%',
    border: '3px solid rgba(255,255,255,0.1)',
    borderTopColor: '#7C88FF',
    animation: 'lox-spin 0.8s linear infinite',
    marginBottom: 16,
  },
  heading: { color: '#F5F3EE', fontSize: 22, fontWeight: 700, margin: '0 0 8px' },
  ctaBtn: {
    display: 'inline-block', marginTop: 16,
    backgroundColor: '#7C88FF', color: '#080A1C',
    padding: '12px 28px', borderRadius: 9999,
    fontWeight: 600, fontSize: 15, textDecoration: 'none',
  },
};
