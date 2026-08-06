'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { Map as LeafletMap, Marker } from 'leaflet';
import type { DashboardMember } from '../_lib/types';
import { CARTO_DARK_TILE_URL, CARTO_ATTRIBUTION } from '../_lib/constants';

// Status → pin ring colour (matches Tailwind config brand colours)
const STATUS_COLOR: Record<DashboardMember['status'], string> = {
  online:      '#5C8F6B',
  stale:       '#C08B3E',
  offline:     '#A8A29E',
  sharing_off: '#A8A29E',
};

function makeIcon(L: typeof import('leaflet'), member: DashboardMember) {
  const color = STATUS_COLOR[member.status];
  const initial = (member.display_name ?? '?').charAt(0).toUpperCase();
  const opacity = member.status === 'offline' || member.status === 'sharing_off' ? '0.5' : '1';

  return L.divIcon({
    html: `
      <div style="
        width:36px;height:36px;border-radius:50%;
        background:${color};border:2.5px solid #14171D;
        display:flex;align-items:center;justify-content:center;
        color:#fff;font-weight:700;font-size:13px;
        box-shadow:0 2px 8px rgba(0,0,0,0.5);
        opacity:${opacity};
        font-family:Inter,system-ui,sans-serif;
      ">${member.avatar_url
        ? `<img src="${member.avatar_url}" style="width:100%;height:100%;border-radius:50%;object-fit:cover" />`
        : initial
      }</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    className: '',
  });
}

type Props = {
  members: DashboardMember[];
  focusMemberId?: string | null;
};

export default function LiveMap({ members, focusMemberId }: Props) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());

  const initMap = useCallback(async () => {
    if (!mapDivRef.current || mapRef.current) return;

    if (!document.getElementById('leaflet-css-dashboard')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css-dashboard';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const L = (await import('leaflet')).default;

    // Fix default icon URLs broken by bundlers
    // @ts-expect-error leaflet internal
    delete L.Icon.Default.prototype._getIconUrl;

    const map = L.map(mapDivRef.current, { zoomControl: true, attributionControl: true });
    L.tileLayer(CARTO_DARK_TILE_URL, {
      attribution: CARTO_ATTRIBUTION,
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    map.setView([20, 78], 5); // Default: India
    mapRef.current = map;

    // Place initial member pins
    members.forEach(m => {
      if (!m.location || m.status === 'sharing_off') return;
      const icon = makeIcon(L, m);
      const marker = L.marker([m.location.lat, m.location.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<b>${m.display_name ?? 'Unknown'}</b><br/>` +
          `${m.status === 'online' ? 'Online' : m.status === 'stale' ? 'Last seen recently' : 'Offline'}` +
          (m.location.battery_level != null
            ? `<br/>Battery: ${Math.round(m.location.battery_level * 100)}%`
            : ''),
        );
      markersRef.current.set(m.user_id, marker);
    });

    // Fit bounds to members if any have location
    const located = members.filter(m => m.location && m.status !== 'sharing_off');
    if (located.length > 0) {
      const bounds = L.latLngBounds(located.map(m => [m.location!.lat, m.location!.lng]));
      map.fitBounds(bounds.pad(0.3));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { initMap(); }, [initMap]);

  // Update markers when members change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    (async () => {
      const L = (await import('leaflet')).default;
      members.forEach(m => {
        if (!m.location || m.status === 'sharing_off') {
          // Remove pin if location lost
          const existing = markersRef.current.get(m.user_id);
          if (existing) { existing.remove(); markersRef.current.delete(m.user_id); }
          return;
        }
        const pos: [number, number] = [m.location.lat, m.location.lng];
        const icon = makeIcon(L, m);
        const existing = markersRef.current.get(m.user_id);
        if (existing) {
          existing.setLatLng(pos).setIcon(icon);
        } else {
          const marker = L.marker(pos, { icon }).addTo(map);
          markersRef.current.set(m.user_id, marker);
        }
      });
    })();
  }, [members]);

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

  // Cleanup
  useEffect(() => () => { mapRef.current?.remove(); mapRef.current = null; }, []);

  return <div ref={mapDivRef} className="flex-1 w-full" style={{ minHeight: 0 }} />;
}
