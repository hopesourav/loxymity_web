/**
 * Geometry and reading aids for the published tile set.
 *
 * The grid is NOT defined here. Every number needed to turn a tile id into a
 * rectangle arrives in the RPC response (`grid`), which the server takes from
 * supabase/functions/_shared/poiTiles.ts — the one definition the publisher,
 * the phone and the assistants all share. Hard-coding 1024 here would create a
 * second one, and a console that silently disagreed with the set it describes.
 */

import type { TileCell, TileCoverage } from './types';

export type Grid = TileCoverage['grid'];

/** The cell a tile id names, as a lat/lng rectangle. */
export function tileBounds(id: string, grid: Grid) {
  const [xs, ys] = id.split('_');
  const x = Number(xs);
  const y = Number(ys);
  return {
    minLng: x * grid.cell_lng - 180,
    maxLng: (x + 1) * grid.cell_lng - 180,
    minLat: y * grid.cell_lat - 90,
    maxLat: (y + 1) * grid.cell_lat - 90,
  };
}

/**
 * Density bands for the overlay. One hue, four opacities: the question is
 * "covered or not", and a cell carrying 1 POI should not look like a cell
 * carrying 900 — but it is still covered, so it is still painted.
 */
export const DENSITY_BANDS: readonly { min: number; opacity: number; label: string }[] = [
  { min: 0, opacity: 0.12, label: '1–9' },
  { min: 10, opacity: 0.22, label: '10–99' },
  { min: 100, opacity: 0.34, label: '100–499' },
  { min: 500, opacity: 0.48, label: '500+' },
];

/** tailwind accent.cyan — Leaflet needs a literal, like poiTiers.ts's tier colours. */
export const TILE_HUE = '#5F82A5';

export function densityOpacity(n: number): number {
  let out = DENSITY_BANDS[0].opacity;
  for (const b of DENSITY_BANDS) if (n >= b.min) out = b.opacity;
  return out;
}

/**
 * The publisher writes its source as `poi_directory;db=104299;global=<id>:96584`
 * — one segment per source, so a future third source reads without a change
 * here. Returns null rather than guessing when the shape is not recognised.
 */
export function parseSource(source: string | undefined | null): { label: string; rows: number }[] | null {
  if (!source) return null;
  const out: { label: string; rows: number }[] = [];
  for (const part of source.split(';')) {
    const m = /^([a-z_]+)=(?:([^:]+):)?(\d+)$/i.exec(part.trim());
    if (m) out.push({ label: m[1] === 'db' ? 'poi_directory' : m[1], rows: Number(m[3]) });
  }
  return out.length ? out : null;
}

export function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

export function formatCount(n: number): string {
  return n.toLocaleString('en-IN');
}

/** Largest first — what the busiest cells in view are, for the panel. */
export function densest(tiles: TileCell[], k: number): TileCell[] {
  return [...tiles].sort((a, b) => b.n - a.n).slice(0, k);
}
