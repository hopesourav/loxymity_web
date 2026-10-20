export type PoiRow = {
  id: number;
  name: string;
  poi_type: string;
  tier: number;
  source: string;
  lat: number;
  lng: number;
  created_at?: string | null;
  updated_at?: string | null;
};

export type PoiFacet = {
  tier: number;
  poi_type: string;
  source: string;
  n: number;
};

export type NearestPoiHit = {
  id: number;
  name: string;
  poi_type: string;
  tier: number;
  dist_m: number;
};

export type PoiAuditRow = {
  id: number;
  poi_id: number;
  op: 'INSERT' | 'UPDATE' | 'DELETE';
  old_row: Partial<PoiRow> | null;
  new_row: Partial<PoiRow> | null;
  changed_by: string | null;
  changed_at: string;
};

export type Bbox = {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
};

/** What the map is doing with a click. */
export type MapMode = 'browse' | 'place' | 'probe';

/** Which radius the coverage circles are drawn at. */
export type CoverageMode = 'off' | 'effective' | 'match';

export type CoverageCell = {
  row_i: number;
  col_i: number;
  lat: number;
  lng: number;
  poi_id: number | null;
  poi_name: string | null;
  poi_type: string | null;
  tier: number | null;
  dist_m: number | null;
};

/**
 * Three states, not two. `unnamed` is a tier-4 match beyond labelFor()'s 1 km
 * cut-off: nearest_poi returned a row, so the fall-through stopped, and then
 * the label was discarded — the stop ends up nameless with nothing left to try.
 */
export type CoverageState = 'named' | 'unnamed' | 'none';

export type CoverageScan = {
  bbox: Bbox;
  n: number;
  cells: CoverageCell[];
};

export type DupePair = {
  a_id: number; a_name: string; a_type: string; a_tier: number; a_source: string;
  a_lat: number; a_lng: number;
  b_id: number; b_name: string; b_type: string; b_tier: number; b_source: string;
  b_lat: number; b_lng: number;
  dist_m: number;
};

// ── The published tile set (0297) ────────────────────────────────────────────

/**
 * One published tile. `n` is how many POI entries the tile carries, which is
 * NOT a count of distinct POIs: a POI is written into every tile within reach
 * of it, so the same row appears in several tiles. Across the whole set the
 * entries outnumber the source rows by about 1.6x.
 */
export type TileCell = { id: string; n: number; b: number };

export type TilePublish = {
  published_at: string;
  source: string;
  source_rows: number;
  tiles: number;
  changed: number;
  removed: number;
  source_changed_at: string | null;
  git_sha: string | null;
};

/** The shape admin_poi_tile_coverage() returns. */
export type TileCoverage = {
  grid: { n: number; cell_lat: number; cell_lng: number };
  enabled: boolean;
  publish: TilePublish | null;
  totals: { tiles: number; pois: number; bytes: number };
  window: { tiles: number; pois: number; bytes: number };
  /** The window held more cells than the cap: no tiles were sent, by design. */
  truncated: boolean;
  tiles: TileCell[];
  /** Which bbox produced it — the overlay stays where it was measured. */
  scope: 'world' | 'view';
};
