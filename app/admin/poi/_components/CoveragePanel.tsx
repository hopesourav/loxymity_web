'use client';

/**
 * Coverage-hole scan.
 *
 * The probe answers "what is this ONE point called?". This answers "what would
 * this whole area be called?", by sampling a grid and resolving every sample
 * through the published tiles (poi-tiles `resolve`, 0298 — it replaced
 * admin_poi_coverage_grid, which could only see poi_directory).
 *
 * The result has three states, and the middle one is the point of the feature:
 * a tier-4 pincode match beyond labelFor()'s 1 km cut-off produces NO label and
 * stops the fall-through, so the stop is nameless. A map of pins cannot show
 * that — the pin is right there.
 *
 * Not automatic on pan. A 20×20 scan is 400 points, resolved in ONE call: the
 * edge function opens each point's tile once and answers every point in it.
 *
 * It resolves against the TILES, not nearest_poi — the shipped set includes
 * the global snapshot, which has no Postgres row, and excludes the hidden rows,
 * which have one. TileSetPanel above answers "is there a tile here" per cell;
 * this answers "what would a stop here be called" per point.
 */

import { useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import TileSetPanel from './TileSetPanel';
import { ShippedError, resolveShipped, shippedErrorText } from '../_lib/shipped';
import { labelFor } from '../_lib/poiTiers';
import type { Bbox, CoverageCell, CoverageScan, TileCoverage } from '../_lib/types';

type Props = {
  supabase: SupabaseClient;
  bbox: Bbox | null;
  scan: CoverageScan | null;
  onScan: (s: CoverageScan | null) => void;
  tiles: TileCoverage | null;
  onTiles: (t: TileCoverage | null) => void;
};

function stateOf(c: CoverageCell): 'named' | 'unnamed' | 'none' {
  if (c.poi_id === null || c.poi_name === null || c.tier === null || c.dist_m === null) return 'none';
  return labelFor({ name: c.poi_name, tier: c.tier, dist_m: c.dist_m }) ? 'named' : 'unnamed';
}

export default function CoveragePanel({ supabase, bbox, scan, onScan, tiles, onTiles }: Props) {
  const [n, setN] = useState(12);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function run() {
    if (!bbox) return;
    setBusy(true);
    setError('');

    // The sample points, in the order the grid is read.
    const pts: Array<[number, number]> = [];
    const meta: Array<{ row_i: number; col_i: number }> = [];
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const lat = bbox.minLat + ((bbox.maxLat - bbox.minLat) * (r + 0.5)) / n;
        const lng = bbox.minLng + ((bbox.maxLng - bbox.minLng) * (c + 0.5)) / n;
        pts.push([lat, lng]);
        meta.push({ row_i: r, col_i: c });
      }
    }

    try {
      const hits = await resolveShipped(supabase, pts);
      setBusy(false);
      const cells: CoverageCell[] = pts.map(([lat, lng], i) => {
        const h = hits[i] ?? null;
        return {
          row_i: meta[i].row_i,
          col_i: meta[i].col_i,
          lat,
          lng,
          poi_id: h ? h.id : null,
          poi_name: h ? h.name : null,
          poi_type: h ? h.poi_type : null,
          tier: h ? h.tier : null,
          dist_m: h ? h.dist_m : null,
        };
      });
      onScan({ bbox, n, cells });
    } catch (e) {
      setBusy(false);
      setError(e instanceof ShippedError ? shippedErrorText(e.kind) : 'Could not read the tiles.');
    }
  }

  const counts = scan
    ? scan.cells.reduce(
        (acc, c) => { acc[stateOf(c)]++; return acc; },
        { named: 0, unnamed: 0, none: 0 } as Record<'named' | 'unnamed' | 'none', number>,
      )
    : null;

  const total = scan?.cells.length ?? 0;
  const pct = (v: number) => (total ? Math.round((v / total) * 100) : 0);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <TileSetPanel supabase={supabase} bbox={bbox} tiles={tiles} onTiles={onTiles} />

      <div>
        <h3 className="text-sm font-semibold text-dark-text">Name preview scan</h3>
        <p className="text-xs text-dark-muted leading-snug mt-1">
          Samples a grid across the current view and resolves every point through the tiles, using
          the same <code className="text-primary">resolveNearest</code> the phone runs. This is the
          per-point answer the layer above can only give per cell — a painted cell can still hold
          points that resolve to nothing.
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-dark-muted mb-1.5">
          Grid resolution — {n} × {n} ({n * n} samples)
        </label>
        <input
          type="range"
          min={4}
          max={20}
          step={2}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="w-full accent-[#C9A227]"
        />
      </div>

      <button
        onClick={run}
        disabled={busy || !bbox}
        className="w-full bg-primary hover:bg-primary-dark text-dark-bg font-bold py-2.5 rounded-xl text-sm disabled:opacity-40"
      >
        {busy ? 'Scanning…' : 'Scan this area'}
      </button>

      {scan && (
        <button
          onClick={() => onScan(null)}
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

      {counts && (
        <div className="space-y-2">
          <Bar
            colour="#5C8F6B"
            label="Named"
            n={counts.named}
            pct={pct(counts.named)}
            note="A stop here gets a place name."
          />
          <Bar
            colour="#C08B3E"
            label="Matched, no label"
            n={counts.unnamed}
            pct={pct(counts.unnamed)}
            note="Tier 4 matched past 1 km. The fall-through stopped, then labelFor() threw it away — the stop shows nothing."
          />
          <Bar
            colour="#B5453F"
            label="No match"
            n={counts.none}
            pct={pct(counts.none)}
            note="Every tier fell through. Reverse geocoding is the only remaining source."
          />
          <p className="text-[11px] text-dark-muted pt-1">
            {total} samples · hover a cell on the map for its resolution.
          </p>
        </div>
      )}

      {scan && !busy && (
        <p className="text-[11px] text-dark-muted leading-snug border-t border-dark-border pt-3">
          The overlay is a snapshot of the area scanned, not of the current view — pan away and it
          stays where it was measured.
        </p>
      )}
    </div>
  );
}

function Bar({
  colour, label, n, pct, note,
}: { colour: string; label: string; n: number; pct: number; note: string }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-sm" style={{ background: colour }} />
        <span className="text-xs text-dark-text">{label}</span>
        <span className="ml-auto text-xs font-semibold" style={{ color: colour }}>
          {n} · {pct}%
        </span>
      </div>
      <div className="h-1.5 bg-dark-bg rounded-full overflow-hidden mt-1">
        <div className="h-full" style={{ width: `${pct}%`, background: colour }} />
      </div>
      <p className="text-[11px] text-dark-muted mt-1 leading-snug">{note}</p>
    </div>
  );
}
