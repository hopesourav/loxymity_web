'use client';

/**
 * Near-duplicate finder.
 *
 * 0187's unique index catches (name, lat, lng) collisions — the exact re-seed
 * that put the Kolkata batch in twice. It cannot catch the same place entered
 * twice at slightly different coordinates, which is the common case: two pins
 * named "Dakshineshwar" 20 m apart are two rows to Postgres and one station to
 * a user.
 *
 * Why it matters beyond tidiness: nearest_poi resolves ties with
 * `order by dist_m limit 1`, so which of the two answers depends on which side
 * of the platform the phone was standing. Names flicker between otherwise
 * identical stops.
 *
 * Resolving is a delete, not a merge. There is nothing to merge — the rows
 * carry no references, no counts and no history worth preserving — and the
 * audit trigger from 0212 keeps a full snapshot of whichever one is removed.
 */

import { useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { formatDistance, tierSpec } from '../_lib/poiTiers';
import type { Bbox, DupePair } from '../_lib/types';

type Props = {
  supabase: SupabaseClient;
  bbox: Bbox | null;
  pairs: DupePair[] | null;
  onPairs: (p: DupePair[] | null) => void;
  focused: DupePair | null;
  onFocus: (p: DupePair | null) => void;
  onFly: (lat: number, lng: number) => void;
  onResolved: () => void;
};

export default function DupesPanel({
  supabase, bbox, pairs, onPairs, focused, onFocus, onFly, onResolved,
}: Props) {
  const [radius, setRadius] = useState(250);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);

  async function scan() {
    if (!bbox) return;
    setBusy(true);
    setError('');
    onFocus(null);
    const { data, error: err } = await supabase.rpc('admin_poi_near_duplicates', {
      p_min_lat: bbox.minLat,
      p_min_lng: bbox.minLng,
      p_max_lat: bbox.maxLat,
      p_max_lng: bbox.maxLng,
      p_radius_m: radius,
      p_limit: 200,
    });
    setBusy(false);
    if (err) {
      // 54000 is the deliberate "zoom in" guard in 0213 — the self-join is
      // O(name-group²) and the biggest group in the table is 328 rows.
      setError(
        err.code === '54000'
          ? 'This area is too large to scan for duplicates — zoom in to roughly a city and try again.'
          : err.message,
      );
      onPairs(null);
      return;
    }
    onPairs((data ?? []) as DupePair[]);
  }

  async function drop(pair: DupePair, which: 'a' | 'b') {
    const id = which === 'a' ? pair.a_id : pair.b_id;
    setDeleting(id);
    const { error: err } = await supabase.from('poi_directory').delete().eq('id', id);
    setDeleting(null);
    if (err) { setError(err.message); return; }
    onPairs((pairs ?? []).filter((p) => p.a_id !== id && p.b_id !== id));
    if (focused && (focused.a_id === id || focused.b_id === id)) onFocus(null);
    onResolved();
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-4 space-y-3 shrink-0 border-b border-dark-border">
        <p className="text-xs text-dark-muted leading-snug">
          Same name (case- and space-insensitive), different row, within the radius below.
          Restricted to the current view.
        </p>
        <div>
          <label className="block text-xs font-medium text-dark-muted mb-1.5">
            Within {formatDistance(radius)}
          </label>
          <input
            type="range"
            min={25}
            max={1000}
            step={25}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full accent-[#C9A227]"
          />
        </div>
        <button
          onClick={scan}
          disabled={busy || !bbox}
          className="w-full bg-primary hover:bg-primary-dark text-dark-bg font-bold py-2.5 rounded-xl text-sm disabled:opacity-40"
        >
          {busy ? 'Scanning…' : 'Find duplicates here'}
        </button>
        {error && <p className="text-brand-danger text-xs">{error}</p>}
        {pairs && !busy && (
          <p className="text-xs text-dark-muted">
            {pairs.length === 0
              ? 'No duplicate pairs in this view.'
              : `${pairs.length} pair${pairs.length === 1 ? '' : 's'}.`}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {(pairs ?? []).map((p) => {
          const isFocused = focused?.a_id === p.a_id && focused?.b_id === p.b_id;
          return (
            <div
              key={`${p.a_id}-${p.b_id}`}
              onMouseEnter={() => onFocus(p)}
              onMouseLeave={() => onFocus(null)}
              onClick={() => onFly((p.a_lat + p.b_lat) / 2, (p.a_lng + p.b_lng) / 2)}
              className={`rounded-xl border p-2.5 cursor-pointer transition-colors ${
                isFocused ? 'border-primary bg-primary/5' : 'border-dark-border hover:bg-dark-bg'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-dark-text truncate">{p.a_name}</span>
                <span className="ml-auto text-[11px] text-brand-danger shrink-0">
                  {formatDistance(p.dist_m)} apart
                </span>
              </div>

              <div className="mt-1.5 space-y-1">
                <Side
                  id={p.a_id} type={p.a_type} tier={p.a_tier} source={p.a_source}
                  name={p.a_name}
                  busy={deleting === p.a_id}
                  onDrop={(e) => { e.stopPropagation(); drop(p, 'a'); }}
                />
                <Side
                  id={p.b_id} type={p.b_type} tier={p.b_tier} source={p.b_source}
                  name={p.b_name}
                  busy={deleting === p.b_id}
                  onDrop={(e) => { e.stopPropagation(); drop(p, 'b'); }}
                />
              </div>

              {(p.a_tier !== p.b_tier || p.a_type !== p.b_type) && (
                <p className="text-[11px] text-brand-warning mt-1.5 leading-snug">
                  These differ in tier or type — check which is right before deleting. Keeping
                  the higher tier changes which radius names this spot.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Side({
  id, name, type, tier, source, busy, onDrop,
}: {
  id: number; name: string; type: string; tier: number; source: string;
  busy: boolean; onDrop: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="flex items-center gap-2 bg-dark-bg rounded-lg px-2 py-1.5">
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: tierSpec(tier).color }} />
      <span className="text-[11px] text-dark-muted truncate">
        #{id} · T{tier} · {type} · {source}
      </span>
      <button
        onClick={onDrop}
        disabled={busy}
        title={`Delete "${name}" #${id}`}
        className="ml-auto text-[11px] text-dark-muted hover:text-brand-danger shrink-0 disabled:opacity-40"
      >
        {busy ? '…' : 'Delete'}
      </button>
    </div>
  );
}
