'use client';

/**
 * Pick a point: click the map to drop the pin, drag it to adjust. Leaflet loaded in the browser
 * only (static export), the same way as the admin POI map. OpenStreetMap tiles (_lib/mapTiles).
 *
 * "Centre on me" uses the browser's location ONLY to move the map — the point sent is the pin the
 * person places, never their position.
 */
import { useEffect, useRef } from 'react';
import { MAP_TILE_URL, mapTileOptions } from '../../../_lib/mapTiles';

type Props = {
  point: { lat: number; lng: number } | null;
  onPick: (lat: number, lng: number) => void;
};

export default function PickMap({ point, onPick }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const pinRef = useRef<any>(null);
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      const L = (await import('leaflet')).default;
      if (cancelled || !hostRef.current || mapRef.current) return;
      LRef.current = L;
      const map = L.map(hostRef.current, { zoomControl: true, center: [22.5726, 88.3639], zoom: 13 });
      L.tileLayer(MAP_TILE_URL, mapTileOptions()).addTo(map);
      map.on('click', (e: any) => onPickRef.current(e.latlng.lat, e.latlng.lng));
      mapRef.current = map;
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      pinRef.current = null;
    };
  }, []);

  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;
    if (!point) {
      pinRef.current?.remove();
      pinRef.current = null;
      return;
    }
    if (!pinRef.current) {
      pinRef.current = L.marker([point.lat, point.lng], {
        draggable: true,
        keyboard: true,
        title: 'The place',
        icon: L.divIcon({
          className: '',
          html: '<div style="width:20px;height:20px;border-radius:50%;background:#7C88FF;'
            + 'border:3px solid #F5F3EE;box-shadow:0 0 0 2px rgba(0,0,0,.5)"></div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        }),
      }).addTo(map).on('dragend', (e: any) => {
        const ll = e.target.getLatLng();
        onPickRef.current(ll.lat, ll.lng);
      });
    } else {
      pinRef.current.setLatLng([point.lat, point.lng]);
    }
  }, [point]);

  function centreOnMe() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => mapRef.current?.setView([pos.coords.latitude, pos.coords.longitude], 16),
      () => {},
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }

  return (
    <div className="relative">
      <div
        ref={hostRef}
        className="h-[360px] w-full rounded-2xl border border-dark-border overflow-hidden"
        role="application"
        aria-label="Map. Click where the place is to put the pin there; drag the pin to adjust."
      />
      <button
        type="button"
        onClick={centreOnMe}
        className="absolute top-3 right-3 z-[1000] px-3 py-1.5 bg-dark-surface border border-dark-border text-dark-text text-xs font-semibold rounded-xl hover:bg-dark-border"
      >
        Centre on me
      </button>
    </div>
  );
}
