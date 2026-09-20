'use client';

/**
 * Bulk CSV import / export.
 *
 * Today the only way rows get into poi_directory is scripts/gen_poi_sql.py on
 * one laptop. This is the same operation through the console, and it leans on
 * exactly the same safety net: 0187's unique index on (name, lat, lng), which
 * is what made `ON CONFLICT DO NOTHING` in the generated batch files mean
 * anything at all.
 *
 * `ignoreDuplicates: true` sends `Prefer: resolution=ignore-duplicates`, so
 * re-importing the same file is a no-op rather than a second copy of it — the
 * failure mode that put 1730 duplicate Kolkata rows in production before 0187.
 *
 * Chunked at CHUNK rows because PostgREST, the Nano instance and the audit
 * trigger all have to survive the import: every inserted row also writes a
 * poi_directory_audit row, so a 5000-row file is 10,000 inserts.
 */

import { useRef, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { downloadCsv, parseCsv, toCsv } from '../_lib/csv';
import { TIER_IDS } from '../_lib/poiTiers';
import type { PoiRow } from '../_lib/types';

const CHUNK = 250;
const HEADERS = ['name', 'poi_type', 'tier', 'source', 'lat', 'lng'] as const;

type ParsedRow = { name: string; poi_type: string; tier: number; source: string; lat: number; lng: number };
type Problem = { line: number; reason: string };

type Props = {
  supabase: SupabaseClient;
  viewportRows: PoiRow[];
  onImported: () => void;
};

export default function BulkPanel({ supabase, viewportRows, onImported }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [parsed, setParsed] = useState<ParsedRow[] | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState('');

  function exportViewport() {
    downloadCsv(
      `poi-viewport-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '')}.csv`,
      toCsv(
        [...HEADERS, 'id'],
        viewportRows.map((r) => [r.name, r.poi_type, r.tier, r.source, r.lat, r.lng, r.id]),
      ),
    );
  }

  function exportTemplate() {
    downloadCsv(
      'poi-import-template.csv',
      toCsv([...HEADERS], [['Ruby General Hospital', 'Hospital', 1, 'manual', 22.5138, 88.4008]]),
    );
  }

  async function onFile(file: File) {
    setError('');
    setResult('');
    setParsed(null);
    setProblems([]);
    setFileName(file.name);

    const rows = parseCsv(await file.text());
    if (rows.length < 2) { setError('That file has no data rows.'); return; }

    const header = rows[0].map((h) => h.trim().toLowerCase());
    const idx = Object.fromEntries(HEADERS.map((h) => [h, header.indexOf(h)]));
    const missing = HEADERS.filter((h) => idx[h] === -1);
    if (missing.length) {
      setError(`Missing column${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}. Download the template.`);
      return;
    }

    const good: ParsedRow[] = [];
    const bad: Problem[] = [];
    const seen = new Set<string>();

    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      const line = i + 1;
      const name = (r[idx.name] ?? '').trim();
      const poi_type = (r[idx.poi_type] ?? '').trim();
      const source = (r[idx.source] ?? '').trim() || 'manual';
      const tier = Number((r[idx.tier] ?? '').trim());
      const lat = Number((r[idx.lat] ?? '').trim());
      const lng = Number((r[idx.lng] ?? '').trim());

      if (!name) { bad.push({ line, reason: 'name is empty' }); continue; }
      if (!poi_type) { bad.push({ line, reason: 'poi_type is empty' }); continue; }
      if (!TIER_IDS.includes(tier as 1 | 2 | 3 | 4)) { bad.push({ line, reason: `tier "${r[idx.tier]}" is not 1-4` }); continue; }
      if (!Number.isFinite(lat) || lat < -90 || lat > 90) { bad.push({ line, reason: `lat "${r[idx.lat]}" out of range` }); continue; }
      if (!Number.isFinite(lng) || lng < -180 || lng > 180) { bad.push({ line, reason: `lng "${r[idx.lng]}" out of range` }); continue; }

      // Two identical rows inside ONE file would collide against each other
      // mid-request, and Postgres rejects that even with
      // resolution=ignore-duplicates ("ON CONFLICT DO UPDATE command cannot
      // affect row a second time" territory). Drop them here instead.
      const key = `${name}|${lat}|${lng}`;
      if (seen.has(key)) { bad.push({ line, reason: 'duplicate of an earlier row in this file' }); continue; }
      seen.add(key);

      good.push({ name, poi_type, tier, source, lat, lng });
    }

    setParsed(good);
    setProblems(bad);
  }

  async function runImport() {
    if (!parsed?.length) return;
    setProgress({ done: 0, total: parsed.length });
    setError('');
    setResult('');

    let inserted = 0;
    for (let i = 0; i < parsed.length; i += CHUNK) {
      const slice = parsed.slice(i, i + CHUNK);
      const { data, error: err } = await supabase
        .from('poi_directory')
        .upsert(slice, { onConflict: 'name,lat,lng', ignoreDuplicates: true })
        .select('id');
      if (err) {
        setProgress(null);
        setError(`Stopped at row ${i + 1}: ${err.message}${err.code ? ` (${err.code})` : ''}. ${inserted} row(s) already committed.`);
        onImported();
        return;
      }
      inserted += (data ?? []).length;
      setProgress({ done: Math.min(i + CHUNK, parsed.length), total: parsed.length });
    }

    setProgress(null);
    setResult(
      `${inserted.toLocaleString()} inserted, ` +
      `${(parsed.length - inserted).toLocaleString()} skipped as already present.`,
    );
    setParsed(null);
    if (fileRef.current) fileRef.current.value = '';
    onImported();
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <div>
        <p className="text-xs font-semibold text-dark-text mb-2">Export</p>
        <div className="flex gap-2">
          <button
            onClick={exportViewport}
            disabled={viewportRows.length === 0}
            className="flex-1 border border-dark-border text-dark-muted hover:text-dark-text py-2 rounded-xl text-xs disabled:opacity-40"
          >
            This viewport ({viewportRows.length.toLocaleString()})
          </button>
          <button
            onClick={exportTemplate}
            className="flex-1 border border-dark-border text-dark-muted hover:text-dark-text py-2 rounded-xl text-xs"
          >
            Blank template
          </button>
        </div>
        <p className="text-[11px] text-dark-muted mt-1.5 leading-snug">
          Export carries an <code className="text-primary">id</code> column for reference; import
          ignores it. Editing an existing row through CSV is not supported — a re-import with a
          changed name creates a second pin.
        </p>
      </div>

      <div className="border-t border-dark-border pt-4">
        <p className="text-xs font-semibold text-dark-text mb-2">Import</p>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
          className="w-full text-xs text-dark-muted file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-dark-bg file:text-dark-text hover:file:bg-dark-border"
        />
        <p className="text-[11px] text-dark-muted mt-1.5">
          Columns: {HEADERS.join(', ')}. Order does not matter; extra columns are ignored.
        </p>
      </div>

      {error && (
        <div className="bg-brand-danger/10 border border-brand-danger/40 rounded-xl px-3 py-2">
          <p className="text-brand-danger text-xs">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-brand-success/10 border border-brand-success/40 rounded-xl px-3 py-2">
          <p className="text-brand-success text-xs">{result}</p>
        </div>
      )}

      {parsed && (
        <div className="space-y-2">
          <div className="bg-dark-bg rounded-xl px-3 py-2">
            <p className="text-xs text-dark-text font-semibold">{fileName}</p>
            <p className="text-[11px] text-dark-muted mt-1">
              {parsed.length.toLocaleString()} valid row{parsed.length === 1 ? '' : 's'}
              {problems.length > 0 && ` · ${problems.length.toLocaleString()} rejected`}
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
              {TIER_IDS.map((t) => {
                const n = parsed.filter((p) => p.tier === t).length;
                return n ? (
                  <span key={t} className="text-[11px] text-dark-muted">T{t}: {n.toLocaleString()}</span>
                ) : null;
              })}
            </div>
          </div>

          {problems.length > 0 && (
            <div className="max-h-40 overflow-y-auto border border-brand-warning/40 rounded-xl p-2 space-y-0.5">
              {problems.slice(0, 50).map((p) => (
                <p key={p.line} className="text-[11px] text-brand-warning">
                  line {p.line}: {p.reason}
                </p>
              ))}
              {problems.length > 50 && (
                <p className="text-[11px] text-dark-muted">…and {problems.length - 50} more.</p>
              )}
            </div>
          )}

          {progress ? (
            <div>
              <div className="h-1.5 bg-dark-bg rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(progress.done / progress.total) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-dark-muted mt-1">
                {progress.done.toLocaleString()} / {progress.total.toLocaleString()}
              </p>
            </div>
          ) : (
            <button
              onClick={runImport}
              disabled={parsed.length === 0}
              className="w-full bg-primary hover:bg-primary-dark text-dark-bg font-bold py-2.5 rounded-xl text-sm disabled:opacity-40"
            >
              Import {parsed.length.toLocaleString()} POI{parsed.length === 1 ? '' : 's'}
            </button>
          )}

          <p className="text-[11px] text-dark-muted leading-snug">
            Rows that already exist at the same name and coordinate are skipped, not duplicated
            — the import is safe to re-run.
          </p>
        </div>
      )}
    </div>
  );
}
