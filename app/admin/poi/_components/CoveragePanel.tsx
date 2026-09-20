'use client';

/**
 * Coverage-hole scan.
 *
 * The probe answers "what is this ONE point called?". This answers "what would
 * this whole area be called?", by sampling a grid and running every sample
 * through the real nearest_poi() server-side (admin_poi_coverage_grid, 0213).
 *
 * The result has three states, and the middle one is the point of the feature:
 * a tier-4 pincode match beyond labelFor()'s 1 km cut-off produces NO label and
 * stops the fall-through, so the stop is nameless. A map of pins cannot show
 * that — the pin is right there.
 *
 * Not automatic on pan. A 20×20 scan is 400 nearest_poi calls (~1.2 s of
 * database time), so it is an explicit button.
 */

import { useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { labelFor } from '../_lib/poiTiers';
import type { Bbox, CoverageCell, CoverageScan } from '../_lib/types';

type Props = {
  supabase: SupabaseClient;
  bbox: Bbox | null;
  scan: CoverageScan | null;
  onScan: (s: CoverageScan | null) => void;
};

function stateOf(c: CoverageCell): 'named' | 'unnamed' | 'none' {
  if (c.poi_id === null || c.poi_name === null || c.tier === null || c.dist_m === null) return 'none';
  return labelFor({ name: c.poi_name, tier: c.tier, dist_m: c.dist_m }) ? 'named' : 'unnamed';
}

export default function CoveragePanel({ supabase, bbox, scan, onScan }: Props) {
  const [n, setN] = useState(12);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function run() {
    if (!bbox) return;
    setBusy(true);
    setError('');
    const { data, error: err } = await supabase.rpc('admin_poi_coverage_grid', {
      p_min_lat: bbox.minLat,
      p_min_lng: bbox.minLng,
      p_max_lat: bbox.maxLat,
      p_max_lng: bbox.maxLng,
      p_n: n,
    });
    setBusy(false);
    if (err) { setError(err.message); return; }
    onScan({ bbox, n, cells: (data ?? []) as CoverageCell[] });
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
      <p className="text-xs text-dark-muted leading-snug">
        Samples a grid across the current view and asks the live{' '}
        <code className="text-primary">nearest_poi</code> what each point resolves to. Shows
        where the directory would leave a stop with no name.
      </p>

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
