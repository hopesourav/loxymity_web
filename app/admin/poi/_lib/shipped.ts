/**
 * The shipped set, read from the tiles.
 *
 * Everything the console draws now comes through here: the `poi-tiles` edge
 * function pulls the covering tiles from R2, decrypts them server-side and
 * returns plain POIs. No tile key ever reaches this browser, and no quota is
 * spent — poi_tiles_admin_fetch (0298) is admin-only and writes no grant row,
 * so a panning admin cannot pollute the phones' download record.
 *
 * Why not read poi_directory any more: since publish #6 it is not what ships.
 * It is missing the 96,584 global POIs (EU + US), and it still holds ~25k
 * hidden rows that no tile carries. The names differ too — a tile carries
 * coalesce(label, name), which is what a user actually sees.
 *
 * What a tile does NOT carry, and why the console lost those features:
 * `source`, `created_at`/`updated_at` and `hidden`. `source` is reconstructed
 * below from the id range, which is the one piece that still matters: it says
 * whether a row can be edited at all.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Bbox, PoiRow } from './types';

/**
 * Global POI ids start at 2^52 (scripts/poi_global/rules.ts). They are built
 * from OSM and Wikidata into the snapshot, have no poi_directory row, and so
 * cannot be edited here — only republished.
 */
export const GLOBAL_ID_BASE = 2 ** 52;

export function isGlobalId(id: number): boolean {
  return id >= GLOBAL_ID_BASE;
}

/** What a tile actually carries, per supabase/functions/_shared/poiTiles.ts. */
export type ShippedPoi = {
  id: number;
  lat: number;
  lng: number;
  tier: number;
  poi_type: string | null;
  name: string;
  context: string | null;
};

export type ShippedNearest = {
  id: number;
  name: string;
  poi_type: string;
  tier: number;
  dist_m: number;
  context: string | null;
};

export type ShippedResult = {
  rows: PoiRow[];
  /** Matches before the 2000 cap, so the list can say "showing N of M". */
  total: number;
  /** Tiles actually read. 0 with truncated = the view spans too many cells. */
  tiles: number;
  truncated: boolean;
};

export class ShippedError extends Error {
  constructor(public readonly kind: 'unavailable' | 'forbidden' | 'bad_request' | 'server' | 'network') {
    super(kind);
  }
}

/** The copy the console shows for each failure. Never a raw transport string. */
export function shippedErrorText(kind: ShippedError['kind']): string {
  switch (kind) {
    case 'unavailable':
      return 'The tile set is switched off (system_flags.poi_tiles_enabled) or nothing has been published yet.';
    case 'forbidden':
      return 'This account is not an admin, so the tiles cannot be opened.';
    case 'bad_request':
      return 'The view could not be turned into a tile request. Zoom in and try again.';
    default:
      return 'Could not read the tiles. Try again, or check the poi-tiles function logs.';
  }
}

function toRow(p: ShippedPoi): PoiRow {
  return {
    id: p.id,
    name: p.name,
    // A tile omits the type rather than storing an empty string; the console's
    // filters and labels want a string.
    poi_type: p.poi_type ?? '',
    tier: p.tier,
    source: isGlobalId(p.id) ? 'global' : 'directory',
    lat: p.lat,
    lng: p.lng,
  };
}

async function call<T>(supabase: SupabaseClient, body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke('poi-tiles', { body });
  if (error) {
    // FunctionsHttpError carries the response; anything else is transport.
    const res = (error as { context?: Response }).context;
    if (res) {
      try {
        const j = await res.clone().json();
        const kind = j?.error;
        if (kind === 'unavailable' || kind === 'forbidden' || kind === 'bad_request' || kind === 'server') {
          throw new ShippedError(kind);
        }
      } catch (e) {
        if (e instanceof ShippedError) throw e;
      }
      throw new ShippedError(res.status === 403 ? 'forbidden' : res.status === 503 ? 'unavailable' : 'server');
    }
    throw new ShippedError('network');
  }
  return data as T;
}

/** Every POI the shipped set would answer with inside this box. */
export async function fetchShippedPois(supabase: SupabaseClient, bbox: Bbox): Promise<ShippedResult> {
  const data = await call<{ pois: ShippedPoi[]; total: number; tiles: number; truncated: boolean }>(
    supabase,
    { op: 'pois', bbox },
  );
  return {
    rows: (data.pois ?? []).map(toRow),
    total: data.total ?? 0,
    tiles: data.tiles ?? 0,
    truncated: !!data.truncated,
  };
}

/**
 * What the app would call each of these points. Runs the SHARED resolveNearest
 * inside the edge function — the same code the phone runs and a line-for-line
 * copy of 0260's nearest_poi — so this is the real answer, not a re-implementation.
 */
export async function resolveShipped(
  supabase: SupabaseClient,
  points: Array<[number, number]>,
): Promise<(ShippedNearest | null)[]> {
  if (points.length === 0) return [];
  const data = await call<{ results: (ShippedNearest | null)[] }>(supabase, { op: 'resolve', points });
  return data.results ?? [];
}
