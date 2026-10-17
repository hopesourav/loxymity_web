/**
 * Map tiles for every Leaflet map on the site: the admin console, the dashboard and the
 * public share page. One place, so a provider change is one edit.
 *
 * WHY NOT CARTO ANY MORE: on 2026-10-17 basemaps.cartocdn.com answered every request
 * without a key with the same watermark tile ("API KEY REQUIRED — carto.com/basemaps/apikey",
 * ETag "wm-…"), on every subdomain and zoom. Every dark map here showed that tile instead
 * of a map.
 *
 * These are OpenStreetMap's own tiles: no key, no account. A dark map darkens them with a CSS
 * filter on the tile layer only (`.map-tiles-dark` in globals.css), so markers, circles and
 * popups keep their real colours.
 *
 * OSM's tile policy (https://operations.osmfoundation.org/policies/tiles/) allows this for
 * light use, with the attribution visible and the browser's normal Referer (the site's
 * default `strict-origin-when-cross-origin` sends it). It forbids bulk download and heavy
 * use. If traffic grows, set NEXT_PUBLIC_MAP_TILE_URL and NEXT_PUBLIC_MAP_TILE_ATTRIBUTION at
 * build time to a keyed provider; nothing else needs to change.
 */
export const MAP_TILE_URL =
  process.env.NEXT_PUBLIC_MAP_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

export const MAP_TILE_ATTRIBUTION =
  process.env.NEXT_PUBLIC_MAP_TILE_ATTRIBUTION ||
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';

export const MAP_MAX_ZOOM = 19;

/** Tile-layer options. `dark` darkens the tiles to match the site's dark UI. */
export function mapTileOptions(dark = true) {
  return {
    attribution: MAP_TILE_ATTRIBUTION,
    maxZoom: MAP_MAX_ZOOM,
    className: dark ? 'map-tiles-dark' : '',
  };
}
