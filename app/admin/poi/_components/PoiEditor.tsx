'use client';

/**
 * Create / edit / delete a single POI.
 *
 * Writes go straight through PostgREST under the anon key — the admin's own
 * session is the authorisation, via the poi_directory_admin_write RLS policy
 * added in 0212. There is no server here (`output: 'export'`), so there is no
 * other door and no place to put server-side validation: everything below is a
 * convenience check, and the database constraints are the real ones.
 *
 * The one the admin will actually hit is 23505 on
 * poi_directory_name_lat_lng_uniq (0187) — the index that makes re-seeding
 * idempotent also means "same name, same coordinate" is a hard duplicate. It is
 * surfaced by name rather than as a raw Postgres error because hitting it
 * usually means the pin already exists and should be edited instead.
 */

import { useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { TIER_IDS, TIERS, formatDistance } from '../_lib/poiTiers';
import type { PoiAuditRow, PoiRow } from '../_lib/types';

type Draft = {
  id: number | null;
  name: string;
  poi_type: string;
  tier: number;
  source: string;
  lat: number | null;
  lng: number | null;
};

type Props = {
  supabase: SupabaseClient;
  draft: Draft;
  knownTypes: string[];
  knownSources: string[];
  onChange: (patch: Partial<Draft>) => void;
  onClose: () => void;
  onSaved: (row: PoiRow) => void;
  onDeleted: (id: number) => void;
};

export default function PoiEditor({
  supabase, draft, knownTypes, knownSources, onChange, onClose, onSaved, onDeleted,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [audit, setAudit] = useState<PoiAuditRow[] | null>(null);
  const [geoQ, setGeoQ] = useState('');
  const [geoResults, setGeoResults] = useState<{ display_name: string; lat: string; lon: string }[]>([]);
  const [geoBusy, setGeoBusy] = useState(false);

  const isEdit = draft.id !== null;
  const spec = TIERS[(draft.tier as 1 | 2 | 3 | 4)] ?? TIERS[1];

  // Change history, edit mode only. Seeded rows have none, which is itself the
  // answer to "has anyone touched this?".
  useEffect(() => {
    if (!isEdit) { setAudit(null); return; }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('poi_directory_audit')
        .select('*')
        .eq('poi_id', draft.id!)
        .order('changed_at', { ascending: false })
        .limit(10);
      if (!cancelled) setAudit((data ?? []) as PoiAuditRow[]);
    })();
    return () => { cancelled = true; };
  }, [supabase, draft.id, isEdit]);

  // Nominatim, same usage as the dashboard fences page. Debounced because their
  // terms cap it at 1 req/s.
  useEffect(() => {
    if (geoQ.trim().length < 3) { setGeoResults([]); return; }
    const t = setTimeout(async () => {
      setGeoBusy(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(geoQ)}`,
        );
        setGeoResults(await res.json());
      } catch { setGeoResults([]); }
      setGeoBusy(false);
    }, 600);
    return () => clearTimeout(t);
  }, [geoQ]);

  function validate(): string | null {
    if (!draft.name.trim()) return 'Name is required.';
    if (!draft.poi_type.trim()) return 'Type is required.';
    if (draft.lat === null || draft.lng === null) return 'Pick a location — click the map, or search.';
    if (draft.lat < -90 || draft.lat > 90) return 'Latitude must be between -90 and 90.';
    if (draft.lng < -180 || draft.lng > 180) return 'Longitude must be between -180 and 180.';
    return null;
  }

  async function save() {
    const bad = validate();
    if (bad) { setError(bad); return; }
    setBusy(true);
    setError('');

    const payload = {
      name: draft.name.trim(),
      poi_type: draft.poi_type.trim(),
      tier: draft.tier,
      source: draft.source.trim() || 'manual',
      lat: draft.lat!,
      lng: draft.lng!,
    };

    const q = isEdit
      ? supabase.from('poi_directory').update(payload).eq('id', draft.id!).select().single()
      : supabase.from('poi_directory').insert(payload).select().single();

    const { data, error: err } = await q;
    setBusy(false);

    if (err) {
      setError(
        err.code === '23505'
          ? 'A POI with this exact name and coordinate already exists — find and edit that one instead.'
          : `${err.message}${err.code ? ` (${err.code})` : ''}`,
      );
      return;
    }
    onSaved(data as PoiRow);
  }

  async function doDelete() {
    if (!isEdit) return;
    setBusy(true);
    const { error: err } = await supabase.from('poi_directory').delete().eq('id', draft.id!);
    setBusy(false);
    if (err) { setError(err.message); return; }
    onDeleted(draft.id!);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-dark-border flex items-center justify-between shrink-0">
        <div>
          <p className="font-semibold text-dark-text text-sm">{isEdit ? 'Edit POI' : 'New POI'}</p>
          {isEdit && <p className="text-dark-muted text-xs mt-0.5">id {draft.id}</p>}
        </div>
        <button onClick={onClose} className="text-dark-muted hover:text-dark-text text-sm px-2">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <Field label="Name">
          <input
            className={INPUT}
            value={draft.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Ruby General Hospital"
          />
        </Field>

        <Field label="Type">
          <input
            className={INPUT}
            list="poi-type-options"
            value={draft.poi_type}
            onChange={(e) => onChange({ poi_type: e.target.value })}
            placeholder="Hospital"
          />
          <datalist id="poi-type-options">
            {knownTypes.map((t) => <option key={t} value={t} />)}
          </datalist>
          <p className="text-dark-muted text-[11px] mt-1">
            Free text. nearest_poi never filters on it — it only reaches the UI as a label, so a
            new value costs nothing but a typo splits a facet.
          </p>
        </Field>

        <Field label="Tier">
          <div className="space-y-1.5">
            {TIER_IDS.map((t) => {
              const s = TIERS[t];
              const on = draft.tier === t;
              return (
                <button
                  key={t}
                  onClick={() => onChange({ tier: t })}
                  className={`w-full text-left px-3 py-2 rounded-xl border transition-colors ${
                    on ? 'border-primary bg-primary/10' : 'border-dark-border hover:border-dark-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                    <span className="text-sm font-semibold text-dark-text">T{t} · {s.label}</span>
                    <span className="text-[11px] text-dark-muted ml-auto">
                      {formatDistance(s.effectiveRadius)}
                      {s.matchRadius !== s.effectiveRadius && ` (matches ${formatDistance(s.matchRadius)})`}
                    </span>
                  </div>
                  <p className="text-[11px] text-dark-muted mt-1 leading-snug">{s.blurb}</p>
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Source">
          <input
            className={INPUT}
            list="poi-source-options"
            value={draft.source}
            onChange={(e) => onChange({ source: e.target.value })}
            placeholder="manual"
          />
          <datalist id="poi-source-options">
            {knownSources.map((s) => <option key={s} value={s} />)}
          </datalist>
        </Field>

        <Field label="Location">
          <div className="grid grid-cols-2 gap-2">
            <input
              className={INPUT}
              value={draft.lat ?? ''}
              onChange={(e) => onChange({ lat: e.target.value === '' ? null : Number(e.target.value) })}
              placeholder="lat"
              inputMode="decimal"
            />
            <input
              className={INPUT}
              value={draft.lng ?? ''}
              onChange={(e) => onChange({ lng: e.target.value === '' ? null : Number(e.target.value) })}
              placeholder="lng"
              inputMode="decimal"
            />
          </div>
          <p className="text-dark-muted text-[11px] mt-1.5">
            Click the map to place, or drag the pin. The dashed ring is this tier&apos;s
            naming radius.
          </p>

          <input
            className={`${INPUT} mt-2`}
            value={geoQ}
            onChange={(e) => setGeoQ(e.target.value)}
            placeholder="…or search a place name (OSM)"
          />
          {geoBusy && <p className="text-dark-muted text-[11px] mt-1">Searching…</p>}
          {geoResults.length > 0 && (
            <div className="mt-1.5 border border-dark-border rounded-xl overflow-hidden">
              {geoResults.map((r, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onChange({ lat: Number(r.lat), lng: Number(r.lon) });
                    setGeoResults([]);
                    setGeoQ('');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-dark-muted hover:bg-dark-bg hover:text-dark-text border-b border-dark-border last:border-0"
                >
                  {r.display_name}
                </button>
              ))}
            </div>
          )}
        </Field>

        {error && (
          <div className="bg-brand-danger/10 border border-brand-danger/40 rounded-xl px-3 py-2">
            <p className="text-brand-danger text-xs">{error}</p>
          </div>
        )}

        {isEdit && audit && audit.length > 0 && (
          <div>
            <p className="text-xs font-medium text-dark-muted mb-1.5">Change history</p>
            <div className="space-y-1">
              {audit.map((a) => (
                <div key={a.id} className="text-[11px] text-dark-muted bg-dark-bg rounded-lg px-2.5 py-1.5">
                  <span className="font-semibold text-dark-text">{a.op}</span>{' '}
                  {new Date(a.changed_at).toLocaleString()}
                  {a.op === 'UPDATE' && a.old_row && a.new_row && (
                    <span className="block mt-0.5">{diffLine(a.old_row, a.new_row)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {isEdit && audit && audit.length === 0 && (
          <p className="text-[11px] text-dark-muted">
            No change history — this row came from a seed script and has never been edited here.
          </p>
        )}
      </div>

      <div className="px-4 py-3 border-t border-dark-border shrink-0 space-y-2">
        <button
          onClick={save}
          disabled={busy}
          className="w-full bg-primary hover:bg-primary-dark text-dark-bg font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          {busy ? 'Saving…' : isEdit ? 'Save changes' : 'Create POI'}
        </button>
        {isEdit && (
          confirmDelete ? (
            <div className="flex gap-2">
              <button
                onClick={doDelete}
                disabled={busy}
                className="flex-1 bg-brand-danger text-dark-text font-semibold py-2 rounded-xl text-xs disabled:opacity-50"
              >
                Confirm delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 border border-dark-border text-dark-muted py-2 rounded-xl text-xs"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-full border border-dark-border text-dark-muted hover:text-brand-danger hover:border-brand-danger/50 py-2 rounded-xl text-xs transition-colors"
            >
              Delete POI
            </button>
          )
        )}
        <p className="text-dark-muted text-[11px] leading-snug">
          Edits are live immediately for new lookups. Devices cache resolved names locally
          (placeNameCache), so an already-named stop keeps its old label until that cache entry
          is pruned.
        </p>
      </div>
    </div>
  );
}

const INPUT =
  'w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-sm text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-dark-muted mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function diffLine(oldRow: Record<string, unknown>, newRow: Record<string, unknown>): string {
  const keys = ['name', 'poi_type', 'tier', 'source', 'lat', 'lng'];
  const parts = keys
    .filter((k) => String(oldRow[k]) !== String(newRow[k]))
    .map((k) => `${k}: ${String(oldRow[k])} → ${String(newRow[k])}`);
  return parts.length ? parts.join(', ') : 'no field change';
}
