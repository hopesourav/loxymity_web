'use client';

/**
 * What actually ships.
 *
 * Every other view in this console reads poi_directory. That stopped being the
 * shipped set at publish #6 (2026-10-20), the first to carry the global
 * snapshot: the EU + US POIs are in R2 and in the tiles but have never been in
 * Postgres, and the hidden rows (the us-police batch) are in Postgres but in no
 * tile. So the pins can be wrong in both directions at once.
 *
 * poi_tiles (0294) is not a second opinion about that — it is written in the
 * same transaction as the R2 upload, one row per published cell. A cell with a
 * row has a tile; a cell without one has nothing in reach. Read through
 * admin_poi_tile_coverage (0297), which returns ids, counts and sizes and
 * never the tile keys.
 *
 * The honest limit, stated on screen because it is easy to misread: a painted
 * cell means a POI is within REACH of that cell, not that every point inside it
 * gets a name. Tier 3 reaches 2 km and tier 4 reaches 5 km, so one locality in
 * a corner paints the whole cell. Per-point truth needs the tile bodies, which
 * are AES-GCM blobs in R2 — a different job.
 */

import { useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { TILE_INTERACTIVE_MAX } from './PoiMap';
import {
  DENSITY_BANDS, TILE_HUE, densest, densityOpacity, formatBytes, formatCount, parseSource,
} from '../_lib/tiles';
import type { Bbox, TileCoverage } from '../_lib/types';

type Props = {
  supabase: SupabaseClient;
  bbox: Bbox | null;
  tiles: TileCoverage | null;
  onTiles: (t: TileCoverage | null) => void;
};

const WORLD: Bbox = { minLat: -90, minLng: -180, maxLat: 90, maxLng: 180 };

export default function TileSetPanel({ supabase, bbox, tiles, onTiles }: Props) {
  const [busy, setBusy] = useState<'world' | 'view' | null>(null);
  const [error, setError] = useState('');

  async function load(scope: 'world' | 'view') {
    const box = scope === 'world' ? WORLD : bbox;
    if (!box) return;
    setBusy(scope);
    setError('');
    const { data, error: err } = await supabase.rpc('admin_poi_tile_coverage', {
      p_min_lat: box.minLat,
      p_min_lng: box.minLng,
      p_max_lat: box.maxLat,
      p_max_lng: box.maxLng,
    });
    setBusy(null);
    if (err) { setError(err.message); return; }
    onTiles({ ...(data as Omit<TileCoverage, 'scope'>), scope });
  }

  const sources = parseSource(tiles?.publish?.source);

  // Both numbers come from the response's own grid, so they cannot drift from
  // the set being drawn.
  const cellKm = tiles
    ? `${(tiles.grid.cell_lng * 111.32).toFixed(0)} × ${(tiles.grid.cell_lat * 110.57).toFixed(0)} km`
    : null;

  return (
    <div className="space-y-3 border-b border-dark-border pb-4">
      <div>
        <h3 className="text-sm font-semibold text-dark-text">Published set (R2)</h3>
        <p className="text-xs text-dark-muted leading-snug mt-1">
          The tiles the phones actually download. Painted cells are covered; everything unpainted
          has no POI within reach of it. Pins on this map come from{' '}
          <code className="text-primary">poi_directory</code> and include hidden rows and nothing
          from the global snapshot — this layer does not.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => load('world')}
          disabled={busy !== null}
          className="flex-1 bg-primary hover:bg-primary-dark text-dark-bg font-bold py-2.5 rounded-xl text-sm disabled:opacity-40"
        >
          {busy === 'world' ? 'Loading…' : tiles ? 'Refresh (world)' : 'Whole world'}
        </button>
        <button
          onClick={() => load('view')}
          disabled={busy !== null || !bbox}
          className="flex-1 border border-dark-border text-dark-text hover:border-primary py-2.5 rounded-xl text-sm disabled:opacity-40"
        >
          {busy === 'view' ? 'Loading…' : 'This view'}
        </button>
      </div>

      {tiles && (
        <button
          onClick={() => onTiles(null)}
          className="w-full border border-dark-border text-dark-muted hover:text-dark-text py-2 rounded-xl text-xs"
        >
          Clear overlay
        </button>
      )}

      {error && (
        <div className="bg-brand-danger/10 border border-brand-danger/40 rounded-xl px-3 py-2">
          <p className="text-brand-danger text-xs">{error}</p>
        </div>
      )}

      {tiles && !tiles.enabled && (
        <div className="bg-brand-danger/10 border border-brand-danger/40 rounded-xl px-3 py-2">
          <p className="text-brand-danger text-xs leading-snug">
            <code>poi_tiles_enabled</code> is off. These tiles exist but no phone is being served
            them — the app falls back to the <code>nearest_poi</code> RPC.
          </p>
        </div>
      )}

      {tiles?.truncated && (
        <div className="bg-brand-warning/10 border border-brand-warning/40 rounded-xl px-3 py-2">
          <p className="text-xs text-dark-muted leading-snug">
            {formatCount(tiles.window.tiles)} cells is past the cap, so none were drawn. A partial
            grid would read as a coverage hole, which is the one thing this layer must not invent.
            Zoom in and use <b>This view</b>.
          </p>
        </div>
      )}

      {tiles && !tiles.truncated && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Cells" value={formatCount(tiles.totals.tiles)} />
            <Stat label="Entries" value={formatCount(tiles.totals.pois)} />
            <Stat label="On disk" value={formatBytes(tiles.totals.bytes)} />
          </div>

          {tiles.scope === 'view' && (
            <p className="text-[11px] text-dark-muted">
              In this view: <b className="text-dark-text">{formatCount(tiles.window.tiles)}</b> cells
              · {formatCount(tiles.window.pois)} entries · {formatBytes(tiles.window.bytes)}
            </p>
          )}

          <div className="space-y-1.5">
            <p className="text-[11px] text-dark-muted">POI entries per cell</p>
            <div className="flex gap-1.5">
              {DENSITY_BANDS.map((b) => (
                <div key={b.label} className="flex-1">
                  <div
                    className="h-4 rounded-sm border"
                    style={{
                      background: TILE_HUE,
                      opacity: densityOpacity(b.min) / DENSITY_BANDS[3].opacity,
                      borderColor: TILE_HUE,
                    }}
                  />
                  <p className="text-[10px] text-dark-muted text-center mt-0.5">{b.label}</p>
                </div>
              ))}
            </div>
          </div>

          {tiles.publish && (
            <div className="border border-dark-border rounded-xl p-3 space-y-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[11px] text-dark-muted">Last publish</span>
                <span className="text-xs text-dark-text">
                  {new Date(tiles.publish.published_at).toLocaleString()}
                </span>
              </div>

              {sources ? (
                <div className="space-y-1">
                  {sources.map((s) => (
                    <div key={s.label} className="flex items-baseline justify-between gap-2">
                      <code className="text-[11px] text-dark-muted">{s.label}</code>
                      <span className="text-xs text-dark-text">{formatCount(s.rows)} rows</span>
                    </div>
                  ))}
                  <div className="flex items-baseline justify-between gap-2 border-t border-dark-border pt-1">
                    <span className="text-[11px] text-dark-muted">total source rows</span>
                    <span className="text-xs text-dark-text">
                      {formatCount(tiles.publish.source_rows)}
                    </span>
                  </div>
                </div>
              ) : (
                <code className="block text-[11px] text-dark-muted break-all">
                  {tiles.publish.source}
                </code>
              )}

              <p className="text-[11px] text-dark-muted">
                {formatCount(tiles.publish.changed)} changed · {formatCount(tiles.publish.removed)}{' '}
                removed
                {tiles.publish.git_sha ? ` · ${tiles.publish.git_sha.slice(0, 7)}` : ''}
              </p>
            </div>
          )}

          {tiles.tiles.length > 0 && (
            <div className="space-y-1">
              <p className="text-[11px] text-dark-muted">Densest cells</p>
              {densest(tiles.tiles, 3).map((t) => (
                <div key={t.id} className="flex items-baseline justify-between gap-2">
                  <code className="text-[11px] text-dark-muted">{t.id}</code>
                  <span className="text-xs text-dark-text">
                    {formatCount(t.n)} · {formatBytes(t.b)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {tiles.tiles.length > TILE_INTERACTIVE_MAX && (
            <p className="text-[11px] text-dark-muted leading-snug">
              {formatCount(tiles.tiles.length)} cells drawn — per-cell tooltips are off at this
              size. Zoom in and press <b className="text-dark-text">This view</b> for cell counts.
            </p>
          )}

          <p className="text-[11px] text-dark-muted leading-snug">
            One cell is {cellKm} at the equator. A painted cell means a POI is within reach of it —
            tier 3 reaches 2 km and tier 4 reaches 5 km, so it does not promise that every point
            inside gets a name. <b className="text-dark-text">Entries</b> counts a POI once per tile
            that carries it, so it runs ahead of the source rows.
          </p>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-dark-border rounded-xl px-2 py-2 text-center">
      <p className="text-sm font-semibold text-dark-text">{value}</p>
      <p className="text-[10px] text-dark-muted mt-0.5">{label}</p>
    </div>
  );
}
