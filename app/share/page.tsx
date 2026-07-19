'use client';

import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap, Marker, Circle } from 'leaflet';

type LocationData = {
  lat: number;
  lng: number;
  accuracy_m: number | null;
  reported_at: string;
  display_name: string;
  avatar_url: string | null;
};

const TOKEN_RE = /^[A-Za-z0-9_-]{24}$/;

// Derived from NEXT_PUBLIC_SUPABASE_URL at build time.
// Falls back to empty string — page will show "invalid link" if not configured.
const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
const EDGE_FN_URL = SUPABASE_URL
  ? `${SUPABASE_URL}/functions/v1/get-shared-location`
  : '';

async function fetchLocation(token: string): Promise<LocationData | null> {
  if (!EDGE_FN_URL) return null;
  try {
    const res = await fetch(`${EDGE_FN_URL}?token=${encodeURIComponent(token)}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function formatAgo(iso: string): string {
  const secs = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
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

  // Read token from URL hash (fragment never sent to server — private by design)
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!TOKEN_RE.test(hash)) {
      setStatus('invalid');
      return;
    }
    tokenRef.current = hash;

    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval>;

    async function load() {
      const data = await fetchLocation(hash);
      if (cancelled) return;
      if (!data) {
        setStatus('expired');
        return;
      }
      setLocation(data);
      setLastUpdated(formatAgo(data.reported_at));
      setStatus('found');
    }

    load().then(() => {
      intervalId = setInterval(async () => {
        if (cancelled) return;
        const data = await fetchLocation(tokenRef.current);
        if (cancelled) return;
        if (!data) {
          setStatus('expired');
          clearInterval(intervalId);
          return;
        }
        setLocation(data);
        setLastUpdated(formatAgo(data.reported_at));
      }, 10_000);

      // Keep "X ago" text fresh every second without re-fetching
      const tickId = setInterval(() => {
        setLocation(prev => {
          if (prev) setLastUpdated(formatAgo(prev.reported_at));
          return prev;
        });
      }, 1000);

      return () => { clearInterval(tickId); };
    });

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  // Initialize Leaflet map once we have a location
  useEffect(() => {
    if (status !== 'found' || !location || !mapDivRef.current) return;
    if (mapRef.current) return; // already initialised

    // Leaflet is client-only; load after mount to avoid SSR errors
    import('leaflet').then((L) => {
      if (!mapDivRef.current || mapRef.current) return;

      // Fix default marker icon paths broken by bundlers
      // @ts-expect-error — leaflet internal
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapDivRef.current, { zoomControl: true, attributionControl: true });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      map.setView([location.lat, location.lng], 16);

      const marker = L.marker([location.lat, location.lng]).addTo(map);
      if (location.accuracy_m && location.accuracy_m > 0) {
        circleRef.current = L.circle([location.lat, location.lng], {
          radius: location.accuracy_m,
          color: '#2563EB',
          fillColor: '#2563EB',
          fillOpacity: 0.08,
          weight: 1.5,
        }).addTo(map);
      }

      mapRef.current = map;
      markerRef.current = marker;
    });
  }, [status, location]);

  // Update marker position on subsequent polls
  useEffect(() => {
    if (!location || !mapRef.current || !markerRef.current) return;

    markerRef.current.setLatLng([location.lat, location.lng]);
    if (circleRef.current) {
      circleRef.current.setLatLng([location.lat, location.lng]);
      if (location.accuracy_m) circleRef.current.setRadius(location.accuracy_m);
    }
    mapRef.current.panTo([location.lat, location.lng], { animate: true });
  }, [location]);

  // Clean up map on unmount
  useEffect(() => {
    return () => { mapRef.current?.remove(); mapRef.current = null; };
  }, []);

  if (status === 'loading') {
    return (
      <div style={styles.centered}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Finding location…</p>
      </div>
    );
  }

  if (status === 'invalid' || status === 'expired') {
    return (
      <div style={styles.centered}>
        <div style={styles.expiredIcon}>🔗</div>
        <h2 style={styles.expiredTitle}>
          {status === 'invalid' ? 'Invalid link' : 'This link has expired'}
        </h2>
        <p style={styles.expiredBody}>
          {status === 'invalid'
            ? 'This location link is not valid. Please check the URL and try again.'
            : 'The location link is no longer active. Ask the sender to share a new one.'}
        </p>
        <a href="https://loxymity.com" style={styles.ctaBtn}>
          Download Loxymity
        </a>
      </div>
    );
  }

  return (
    <>
      {/* Leaflet CSS — loaded at runtime to avoid SSR */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />

      <div style={styles.wrapper}>
        {/* Header bar */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            {location?.avatar_url
              ? <img src={location.avatar_url} alt="" style={styles.avatar} />
              : <div style={styles.avatarPlaceholder}>
                  {location?.display_name?.charAt(0)?.toUpperCase() ?? '?'}
                </div>
            }
            <div>
              <p style={styles.nameText}>{location?.display_name ?? 'Unknown'}</p>
              <p style={styles.updatedText}>Updated {lastUpdated}</p>
            </div>
          </div>
          <div style={styles.liveDot} title="Live" />
        </div>

        {/* Map */}
        <div ref={mapDivRef} style={styles.map} />

        {/* Footer CTA */}
        <div style={styles.footer}>
          <p style={styles.footerText}>Track your people with</p>
          <a
            href="https://loxymity.com"
            style={styles.footerLink}
            rel="noopener noreferrer"
            target="_blank"
          >
            Loxymity →
          </a>
        </div>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex', flexDirection: 'column',
    height: '100dvh', width: '100%',
    backgroundColor: '#0F172A', fontFamily: 'Inter, system-ui, sans-serif',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: '#1E293B',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: { width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' },
  avatarPlaceholder: {
    width: 38, height: 38, borderRadius: '50%',
    backgroundColor: '#2563EB', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: 16,
  },
  nameText: { color: '#F1F5F9', fontWeight: 600, fontSize: 15, margin: 0 },
  updatedText: { color: '#64748B', fontSize: 12, margin: '2px 0 0' },
  liveDot: {
    width: 10, height: 10, borderRadius: '50%',
    backgroundColor: '#22C55E',
    boxShadow: '0 0 0 3px rgba(34,197,94,0.25)',
    animation: 'pulse 2s infinite',
  },
  map: { flex: 1, width: '100%' },
  footer: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '10px 16px',
    backgroundColor: '#1E293B',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
  },
  footerText: { color: '#64748B', fontSize: 13, margin: 0 },
  footerLink: {
    color: '#60A5FA', fontSize: 13, fontWeight: 600,
    textDecoration: 'none',
  },
  centered: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    height: '100dvh', backgroundColor: '#0F172A',
    fontFamily: 'Inter, system-ui, sans-serif', padding: '0 24px',
    textAlign: 'center',
  },
  spinner: {
    width: 36, height: 36, borderRadius: '50%',
    border: '3px solid rgba(255,255,255,0.1)',
    borderTopColor: '#2563EB',
    animation: 'spin 0.8s linear infinite',
    marginBottom: 16,
  },
  loadingText: { color: '#64748B', fontSize: 15, margin: 0 },
  expiredIcon: { fontSize: 48, marginBottom: 16 },
  expiredTitle: { color: '#F1F5F9', fontSize: 22, fontWeight: 700, margin: '0 0 8px' },
  expiredBody: { color: '#64748B', fontSize: 15, maxWidth: 320, margin: '0 0 24px' },
  ctaBtn: {
    display: 'inline-block',
    backgroundColor: '#2563EB', color: '#fff',
    padding: '12px 28px', borderRadius: 12,
    fontWeight: 600, fontSize: 15, textDecoration: 'none',
  },
};
