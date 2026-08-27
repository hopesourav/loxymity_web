'use client';

/**
 * Control plane — app_config (migration 0127).
 *
 * The single place to change app behaviour without a release.
 *
 * Two things shape this UI and are worth knowing before editing it:
 *
 * 1. KILL-ONLY. A flag override may only ever set a flag to its registered safe
 *    value. There is therefore no "on/off" control — an override is either ACTIVE
 *    (feature forced to its safe state) or ABSENT (app uses its compiled default).
 *    Re-enabling a feature is "clear the override", never "set it to true".
 *
 * 2. The database enforces every rule this page enforces. This UI exists for
 *    better errors and safer defaults, not as the security boundary — the SQL
 *    editor bypasses it entirely, which is why the app also clamps on read.
 */

import { useCallback, useEffect, useState } from 'react';
import { useAdmin } from '../_lib/adminContext';

interface KeyRow {
  key: string;
  kind: 'flag' | 'number';
  safe_value: boolean | null;
  min_value: number | null;
  max_value: number | null;
  label: string;
  description: string;
  unit: string | null;
  risk: 'low' | 'medium' | 'high';
}

interface OverrideRow {
  key: string;
  value: boolean | number;
  user_id: string | null;
  expires_at: string | null;
  reason: string | null;
  updated_at: string;
}

interface AuditRow {
  id: number;
  key: string;
  old_value: unknown;
  new_value: unknown;
  reason: string | null;
  changed_at: string;
}

const EXPIRY_OPTIONS: { label: string; hours: number | null }[] = [
  { label: '24 hours', hours: 24 },
  { label: '3 days', hours: 72 },
  { label: '7 days', hours: 168 },
  { label: 'No expiry', hours: null },
];

const RISK_STYLE: Record<string, string> = {
  low: 'bg-brand-success/10 text-brand-success',
  medium: 'bg-brand-warning/10 text-brand-warning',
  high: 'bg-brand-danger/10 text-brand-danger',
};

function expiresAtFrom(hours: number | null): string | null {
  return hours == null ? null : new Date(Date.now() + hours * 3600_000).toISOString();
}

function relative(iso: string): string {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

function expiryLabel(iso: string | null): string {
  if (!iso) return 'no expiry';
  const mins = Math.round((new Date(iso).getTime() - Date.now()) / 60_000);
  if (mins <= 0) return 'expired';
  if (mins < 60) return `expires in ${mins}m`;
  if (mins < 1440) return `expires in ${Math.round(mins / 60)}h`;
  return `expires in ${Math.round(mins / 1440)}d`;
}

export default function ConfigPage() {
  const { supabase, userId } = useAdmin();

  const [keys, setKeys] = useState<KeyRow[]>([]);
  const [overrides, setOverrides] = useState<Record<string, OverrideRow>>({});
  const [audit, setAudit] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Per-key UI state for the numeric editors and the expiry picker.
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [expiryHours, setExpiryHours] = useState<number | null>(24);

  const load = useCallback(async () => {
    const [k, o, a] = await Promise.all([
      supabase.from('app_config_keys').select('*').order('kind').order('key'),
      supabase.from('app_config').select('*'),
      supabase.from('app_config_audit').select('*').order('changed_at', { ascending: false }).limit(25),
    ]);
    setKeys((k.data ?? []) as KeyRow[]);
    const map: Record<string, OverrideRow> = {};
    for (const row of (o.data ?? []) as OverrideRow[]) {
      if (row.user_id === null) map[row.key] = row;   // this page edits global scope
    }
    setOverrides(map);
    setAudit((a.data ?? []) as AuditRow[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { void load(); }, [load]);

  const run = async (key: string, fn: () => Promise<{ error: { message: string } | null }>) => {
    setBusy(key);
    setError('');
    const { error: e } = await fn();
    if (e) setError(`${key}: ${e.message}`);
    await load();
    setBusy(null);
  };

  const killFlag = (row: KeyRow, reason: string) =>
    run(row.key, async () =>
      supabase.from('app_config').insert({
        key: row.key,
        value: row.safe_value,
        expires_at: expiresAtFrom(expiryHours),
        reason: reason || 'admin console',
        updated_by: userId,
      }));

  const clearOverride = (key: string) =>
    run(key, async () => supabase.from('app_config').delete().eq('key', key).is('user_id', null));

  const setNumber = (row: KeyRow, raw: string, reason: string) => {
    const n = Number(raw);
    if (!Number.isFinite(n)) { setError(`${row.key}: not a number`); return Promise.resolve(); }
    const min = row.min_value ?? -Infinity;
    const max = row.max_value ?? Infinity;
    if (n < min || n > max) { setError(`${row.key}: must be between ${min} and ${max}`); return Promise.resolve(); }
    return run(row.key, async () =>
      supabase.from('app_config').upsert(
        {
          key: row.key,
          value: n,
          expires_at: expiresAtFrom(expiryHours),
          reason: reason || 'admin console',
          updated_by: userId,
        },
        { onConflict: 'key' },
      ));
  };

  const flags = keys.filter((k) => k.kind === 'flag');
  const numbers = keys.filter((k) => k.kind === 'number');
  const activeCount = Object.keys(overrides).length;

  if (loading) {
    return <div className="p-8 text-dark-muted">Loading control plane…</div>;
  }

  return (
    <div className="p-6 max-w-5xl space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-dark-text">Control Plane</h1>
        <p className="text-sm text-dark-muted mt-1">
          Change app behaviour without a release. {activeCount} override{activeCount === 1 ? '' : 's'} active.
        </p>
      </header>

      {/* The single most important thing an operator can know right now. */}
      <div className="bg-brand-warning/10 border border-brand-warning/30 rounded-3xl p-4">
        <p className="text-sm text-brand-warning font-medium">Shadow mode</p>
        <p className="text-sm text-dark-muted mt-1">
          The app fetches and logs these values but does <strong>not</strong> apply them yet
          (<code className="text-xs">REMOTE_CONFIG_APPLY = false</code>). Changes here are safe to
          make and will show up in device logs, but will not alter behaviour until that flag ships
          as true.
        </p>
      </div>

      {error && (
        <div className="bg-brand-danger/10 border border-brand-danger/30 rounded-3xl p-4 text-sm text-brand-danger">
          {error}
        </div>
      )}

      {/* Expiry applies to whatever you change next. Defaulting to 24h is deliberate:
          a kill switch nobody remembers to turn off is how a feature stays dead for
          months (see migration 0114's header, and 0102 for the cautionary tale). */}
      <div className="bg-dark-surface border border-dark-border rounded-3xl p-4 flex items-center gap-3">
        <span className="text-sm text-dark-muted">New overrides expire after</span>
        <select
          value={expiryHours ?? ''}
          onChange={(e) => setExpiryHours(e.target.value === '' ? null : Number(e.target.value))}
          className="bg-dark-bg border border-dark-border rounded-xl px-3 py-1.5 text-sm text-dark-text"
        >
          {EXPIRY_OPTIONS.map((o) => (
            <option key={o.label} value={o.hours ?? ''}>{o.label}</option>
          ))}
        </select>
        {expiryHours === null && (
          <span className="text-xs text-brand-warning">
            A permanent kill switch is how a feature silently stays dead. Prefer a window.
          </span>
        )}
      </div>

      {/* ── Kill switches ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-sm font-semibold text-dark-muted uppercase tracking-wide mb-3">
          Kill switches
        </h2>
        <p className="text-sm text-dark-muted mb-4">
          These can only turn a feature <strong>off</strong>. Enabling anything requires an app
          release — that is enforced by the database, not just by this page.
        </p>

        <div className="bg-dark-surface border border-dark-border rounded-3xl divide-y divide-dark-border">
          {flags.map((row) => {
            const ov = overrides[row.key];
            const killed = !!ov;
            return (
              <div key={row.key} className="p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-dark-text font-medium">{row.label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase ${RISK_STYLE[row.risk]}`}>
                      {row.risk}
                    </span>
                    {killed && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-danger/10 text-brand-danger uppercase">
                        {row.safe_value ? 'forced on' : 'killed'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-dark-muted mt-1">{row.description}</p>
                  <code className="text-[11px] text-dark-muted/70">{row.key}</code>
                  {killed && (
                    <p className="text-xs text-dark-muted mt-1">
                      {expiryLabel(ov.expires_at)} · set {relative(ov.updated_at)}
                      {ov.reason ? ` · ${ov.reason}` : ''}
                    </p>
                  )}
                </div>

                {killed ? (
                  <button
                    onClick={() => void clearOverride(row.key)}
                    disabled={busy === row.key}
                    className="shrink-0 px-3 py-1.5 rounded-xl text-sm border border-dark-border text-dark-text hover:bg-dark-bg disabled:opacity-50"
                  >
                    {busy === row.key ? '…' : 'Restore default'}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const reason = window.prompt(
                        `Set ${row.label} to its safe value (${row.safe_value}).\n\nWhy? (recorded in the audit log)`,
                        '',
                      );
                      if (reason === null) return;
                      void killFlag(row, reason);
                    }}
                    disabled={busy === row.key}
                    className="shrink-0 px-3 py-1.5 rounded-xl text-sm bg-brand-danger/10 text-brand-danger border border-brand-danger/30 hover:bg-brand-danger/20 disabled:opacity-50"
                  >
                    {busy === row.key ? '…' : row.safe_value ? 'Force on' : 'Kill'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Tunables ────────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-sm font-semibold text-dark-muted uppercase tracking-wide mb-3">
          Tunables
        </h2>
        <p className="text-sm text-dark-muted mb-4">
          Values outside the stated range are rejected by the database and clamped again by the
          app on read.
        </p>

        <div className="bg-dark-surface border border-dark-border rounded-3xl divide-y divide-dark-border">
          {numbers.map((row) => {
            const ov = overrides[row.key];
            const current = draft[row.key] ?? (ov ? String(ov.value) : '');
            return (
              <div key={row.key} className="p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-dark-text font-medium">{row.label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase ${RISK_STYLE[row.risk]}`}>
                      {row.risk}
                    </span>
                    {ov && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                        overridden
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-dark-muted mt-1">{row.description}</p>
                  <p className="text-[11px] text-dark-muted/70">
                    <code>{row.key}</code> · allowed {row.min_value} – {row.max_value}
                    {row.unit ? ` ${row.unit}` : ''}
                  </p>
                  {ov && (
                    <p className="text-xs text-dark-muted mt-1">
                      {expiryLabel(ov.expires_at)} · set {relative(ov.updated_at)}
                    </p>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <input
                    type="number"
                    value={current}
                    min={row.min_value ?? undefined}
                    max={row.max_value ?? undefined}
                    step="any"
                    placeholder="default"
                    onChange={(e) => setDraft((d) => ({ ...d, [row.key]: e.target.value }))}
                    className="w-28 bg-dark-bg border border-dark-border rounded-xl px-3 py-1.5 text-sm text-dark-text"
                  />
                  <button
                    onClick={() => {
                      const reason = window.prompt(`Change ${row.label}.\n\nWhy?`, '');
                      if (reason === null) return;
                      void setNumber(row, current, reason);
                    }}
                    disabled={busy === row.key || current === ''}
                    className="px-3 py-1.5 rounded-xl text-sm bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 disabled:opacity-40"
                  >
                    Set
                  </button>
                  {ov && (
                    <button
                      onClick={() => {
                        setDraft((d) => ({ ...d, [row.key]: '' }));
                        void clearOverride(row.key);
                      }}
                      disabled={busy === row.key}
                      className="px-3 py-1.5 rounded-xl text-sm border border-dark-border text-dark-text hover:bg-dark-bg disabled:opacity-50"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Audit ───────────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-sm font-semibold text-dark-muted uppercase tracking-wide mb-3">
          Recent changes
        </h2>
        <div className="bg-dark-surface border border-dark-border rounded-3xl divide-y divide-dark-border">
          {audit.length === 0 && (
            <p className="p-4 text-sm text-dark-muted">No changes recorded yet.</p>
          )}
          {audit.map((a) => (
            <div key={a.id} className="p-3 flex items-center justify-between gap-4 text-sm">
              <div className="min-w-0">
                <code className="text-dark-text">{a.key}</code>
                <span className="text-dark-muted">
                  {' '}
                  {a.new_value === null
                    ? '→ restored to app default'
                    : `→ ${JSON.stringify(a.new_value)}`}
                </span>
                {a.reason && <span className="text-dark-muted/70"> · {a.reason}</span>}
              </div>
              <span className="text-dark-muted/70 shrink-0">{relative(a.changed_at)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
