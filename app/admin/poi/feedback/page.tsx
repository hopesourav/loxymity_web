'use client';

/**
 * Place feedback (app repo migration 0342) — the reports the daily batch could not decide, what
 * it did decide, and the numbers that say whether the AI can be trusted with more.
 *
 * Everything goes through the 0342 admin functions (definer, `coalesce(is_current_user_admin(),
 * false)` — aal2), never the tables: they live in `private` and no client role can read them.
 * Approve runs `_apply_poi_edit`, the batch's own path: a rename writes `label` (never `name`), a
 * hide sets `hidden`, an add inserts a `user_feedback` row — and every change can be reverted
 * here while the row still looks as the change left it. Changes reach phones after the 21:38 UTC
 * tile publish and each phone's daily check (1–2 days).
 *
 * The admin never sees who reported: the list carries no reporter id, and "Block reporter" acts on
 * a report.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAdmin } from '../../_lib/adminContext';
import { labelFor } from '../_lib/poiTiers';
import { ShippedError, resolveShipped, shippedErrorText } from '../_lib/shipped';
import {
  GLOBAL_ID_BASE, KIND_LABEL, REASON_LABEL, REJECT_REASONS, SUGGESTED_TYPES, TYPE_LABEL, explainPark,
  type FeedbackKind, type RejectReason, type SuggestedType,
} from '../../../_lib/poiFeedback';

type Evidence = { source: 'osm' | 'wikidata'; name: string; alts?: string[]; oldNames?: string[]; type: string | null; distM: number };
type Ai = { verdict?: string; reason_code?: string; name_choice?: string; poi_type?: string | null; confidence?: number; off_schema?: boolean; model?: string };
type Report = {
  id: number; created_at: string; channel: 'app' | 'web' | 'admin'; kind: FeedbackKind; reason: string | null;
  poi_id: number | null; shown_name: string | null; suggested_name: string | null; suggested_type: string | null;
  lat: number | null; lng: number | null; note: string | null; status: string; group_key: string | null;
  park_reason: string | null; ai: Ai | null; evidence: Evidence[] | null; would_auto_apply: boolean | null;
  decided_by: string | null; reviewed_at: string | null; review_reason: string | null; edit_id: number | null;
  reporter_blocked: boolean; edit_action: string | null; edit_status: string | null; edit_label: string | null;
  edit_origin: string | null; edit_created_at: string | null; edit_owner_batch: string | null;
  poi_name: string | null; poi_label: string | null; poi_hidden: boolean | null; poi_type: string | null;
  poi_tier: number | null; poi_seed_batch: string | null;
};
type Metrics = {
  days: number; by_status: Record<string, number>; confusion: { ai: string; admin: string; n: number }[];
  would_auto: { applied: number; refused: number }; harmful_misses: number; off_schema: number; ai_judged: number;
  ai_edits_reverted_14d: number; waiting: number; oldest_waiting: string | null;
  switches: Record<string, boolean> | null; decided_since: string | null;
};
type Tab = 'open' | 'applied' | 'closed';
type Group = { key: string; reports: Report[] };

const TAB_LABEL: Record<Tab, string> = { open: 'Needs a decision', applied: 'Applied', closed: 'Closed' };
const STATUS_STYLE: Record<string, string> = {
  needs_review: 'bg-primary/15 text-primary border-primary/30',
  new: 'bg-primary/15 text-primary border-primary/30',
  queued: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/25',
  drifted: 'bg-brand-danger/10 text-brand-danger border-brand-danger/25',
  applied: 'bg-brand-success/10 text-brand-success border-brand-success/25',
};

/** Wilson score lower bound (95 %): precision we can count on, not the lucky-streak number. */
function wilsonLow(ok: number, n: number): number | null {
  if (n === 0) return null;
  const z = 1.96;
  const p = ok / n;
  const d = 1 + (z * z) / n;
  return (p + (z * z) / (2 * n) - z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;
}

function pct(x: number | null): string {
  return x === null ? '—' : `${Math.round(x * 1000) / 10} %`;
}

function rpcError(e: { message?: string } | null): string {
  if (!e) return '';
  if (/not_admin/.test(e.message ?? '')) {
    return 'This session is not an admin session with two-step sign-in. Sign out and back in with your authenticator code.';
  }
  return e.message ?? 'Something went wrong.';
}

export default function PoiFeedbackPage() {
  const { supabase } = useAdmin();
  const [tab, setTab] = useState<Tab>('open');
  const [rows, setRows] = useState<Report[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setError('');
    setLoading(true);
    const [list, m] = await Promise.all([
      supabase.rpc('admin_poi_feedback_list', { p_status: tab, p_limit: 400 }),
      supabase.rpc('admin_poi_feedback_metrics', { p_days: 30 }),
    ]);
    setLoading(false);
    if (list.error || m.error) { setError(rpcError(list.error ?? m.error)); return; }
    setRows((list.data ?? []) as Report[]);
    setMetrics(m.data as Metrics);
  }, [supabase, tab]);

  useEffect(() => { load(); }, [load]);

  // One card per group the batch formed; a report it has not seen yet stands alone.
  const groups = useMemo<Group[]>(() => {
    const m = new Map<string, Report[]>();
    for (const r of rows) {
      const k = r.group_key ?? `r:${r.id}`;
      m.set(k, [...(m.get(k) ?? []), r]);
    }
    return [...m.entries()].map(([key, reports]) => ({ key, reports }));
  }, [rows]);

  async function act(fn: () => PromiseLike<{ data: unknown; error: { message?: string } | null }>, ok: string) {
    setError('');
    setNotice('');
    const { data, error: e } = await fn();
    if (e) { setError(rpcError(e)); return; }
    const d = data as { ok?: boolean; error?: string } | null;
    if (d && d.ok === false) { setError(`Refused: ${d.error ?? 'unknown'}`); return; }
    setNotice(ok);
    await load();
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-dark-text">Place feedback</h1>
          <p className="text-dark-muted text-sm">
            From the app and loxymity.com/places/suggest. The daily batch (20:05 UTC) judges each report;
            approved changes ship in the 21:38 UTC tile publish.
          </p>
        </div>
        <button onClick={load}
          className="shrink-0 px-3 py-1.5 bg-dark-surface border border-dark-border text-dark-text text-xs font-semibold rounded-xl hover:bg-dark-border transition-colors">
          Refresh
        </button>
      </div>

      {metrics && <MetricsCard m={metrics} />}

      {error && <p className="text-sm text-brand-danger bg-brand-danger/10 rounded-lg px-3 py-2">{error}</p>}
      {notice && <p className="text-sm text-brand-success bg-brand-success/10 rounded-lg px-3 py-2">{notice}</p>}

      <div className="flex gap-1">
        {(Object.keys(TAB_LABEL) as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              tab === t ? 'bg-primary text-dark-bg' : 'text-dark-muted hover:text-dark-text bg-dark-surface border border-dark-border'}`}>
            {TAB_LABEL[t]}
          </button>
        ))}
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : groups.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="text-dark-text font-semibold">Nothing here</p>
            <p className="text-dark-muted text-sm mt-1">Admins get one push a day when reports wait for a decision.</p>
          </div>
        ) : (
          <div className="divide-y divide-dark-border">
            {groups.map((g) => (
              <GroupCard key={g.key} g={g} tab={tab}
                onApprove={(edit) => act(() => supabase.rpc('admin_review_poi_feedback', {
                  p_ids: g.reports.map((r) => r.id), p_action: 'approve', p_edit: edit, p_reason: null,
                }), 'Applied — it ships in the next tile publish.')}
                onReject={(reason) => act(() => supabase.rpc('admin_review_poi_feedback', {
                  p_ids: g.reports.map((r) => r.id), p_action: 'reject', p_edit: null, p_reason: reason,
                }), 'Rejected.')}
                onDuplicate={() => act(() => supabase.rpc('admin_review_poi_feedback', {
                  p_ids: g.reports.map((r) => r.id), p_action: 'duplicate', p_edit: null, p_reason: null,
                }), 'Marked as a duplicate.')}
                onRevert={(editId) => act(() => supabase.rpc('admin_revert_poi_edit', { p_edit_id: editId }),
                  'Reverted — the old name ships in the next tile publish.')}
                onBlock={(id) => act(() => supabase.rpc('admin_block_poi_reporter', { p_feedback_id: id }),
                  'Reporter blocked; their other open reports were closed.')}
                resolveNow={async (lat, lng) => {
                  try {
                    const [hit] = await resolveShipped(supabase, [[lat, lng]]);
                    return hit ? (labelFor(hit) ?? `${hit.name} (too far to name)`) : 'Nothing — no place name here';
                  } catch (e) {
                    return e instanceof ShippedError ? shippedErrorText(e.kind) : 'Could not read the tiles.';
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MetricsCard({ m }: { m: Metrics }) {
  const decided = m.would_auto.applied + m.would_auto.refused;
  const precision = decided ? m.would_auto.applied / decided : null;
  const low = wilsonLow(m.would_auto.applied, decided);
  const offSchemaRate = m.ai_judged ? m.off_schema / m.ai_judged : null;
  const adminDecided = m.confusion.reduce((s, c) => s + c.n, 0);
  const weeks = m.decided_since ? (Date.now() - Date.parse(m.decided_since)) / (7 * 86_400_000) : 0;
  const checks = [
    { ok: adminDecided >= 200, label: `≥ 200 reports decided by an admin (${adminDecided})` },
    { ok: weeks >= 4, label: `≥ 4 weeks of decisions (${Math.floor(weeks)})` },
    { ok: precision !== null && precision >= 0.98, label: `"Would apply" precision ≥ 98 % (${pct(precision)})` },
    { ok: low !== null && low >= 0.95, label: `…and its 95 % lower bound ≥ 95 % (${pct(low)})` },
    { ok: m.harmful_misses === 0, label: `No harmful misses (${m.harmful_misses})` },
    { ok: offSchemaRate !== null && offSchemaRate <= 0.02, label: `Unreadable AI answers ≤ 2 % (${pct(offSchemaRate)})` },
  ];
  const sw = m.switches ?? {};
  return (
    <div className="bg-dark-surface border border-dark-border rounded-2xl p-5 space-y-4">
      <div className="flex flex-wrap gap-4 text-xs">
        {(['poi_feedback_enabled', 'poi_feedback_ai_enabled', 'poi_feedback_auto_apply_enabled'] as const).map((k) => (
          <span key={k} className={`px-2 py-1 rounded-lg border ${sw[k] ? 'border-brand-success/40 text-brand-success' : 'border-dark-border text-dark-muted'}`}>
            {k.replace('poi_feedback_', '').replace(/_/g, ' ')}: {sw[k] ? 'on' : 'off'}
          </span>
        ))}
        <span className="text-dark-muted">
          {m.waiting} waiting{m.oldest_waiting ? ` · oldest ${new Date(m.oldest_waiting).toLocaleDateString()}` : ''}
          {' '}· AI changes reverted in 14 days: {m.ai_edits_reverted_14d}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <p className="text-xs font-semibold text-dark-text mb-2">AI verdict × your decision (last {m.days} days)</p>
          {m.confusion.length === 0 ? (
            <p className="text-xs text-dark-muted">No admin decisions yet.</p>
          ) : (
            <table className="text-xs text-dark-muted">
              <tbody>
                {m.confusion.map((c) => (
                  <tr key={`${c.ai}-${c.admin}`}>
                    <td className="pr-4 py-0.5">AI {c.ai}</td>
                    <td className="pr-4">→ you {c.admin}</td>
                    <td className="text-dark-text font-semibold">{c.n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold text-dark-text mb-2">Ready to switch on automatic apply?</p>
          <ul className="space-y-1">
            {checks.map((c) => (
              <li key={c.label} className={`text-xs ${c.ok ? 'text-brand-success' : 'text-dark-muted'}`}>
                {c.ok ? '✓' : '·'} {c.label}
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-dark-muted mt-2">
            Switching it on is a database change (system_flags.poi_feedback_auto_apply_enabled), never a button here.
          </p>
        </div>
      </div>
    </div>
  );
}

type CardProps = {
  g: Group;
  tab: Tab;
  onApprove: (edit: Record<string, unknown>) => void;
  onReject: (reason: RejectReason) => void;
  onDuplicate: () => void;
  onRevert: (editId: number) => void;
  onBlock: (feedbackId: number) => void;
  resolveNow: (lat: number, lng: number) => Promise<string>;
};

function GroupCard({ g, tab, onApprove, onReject, onDuplicate, onRevert, onBlock, resolveNow }: CardProps) {
  const first = g.reports[0];
  const kind = first.kind;
  const isGlobal = first.poi_id !== null && first.poi_id >= GLOBAL_ID_BASE;
  const suggestion = g.reports.find((r) => r.suggested_name)?.suggested_name ?? '';
  const aiName = (() => {
    const c = first.ai?.name_choice;
    if (!c?.startsWith('evidence:')) return null;
    return first.evidence?.[Number(c.slice(9))]?.name ?? null;
  })();
  const [label, setLabel] = useState(aiName ?? suggestion);
  const [poiId, setPoiId] = useState(first.poi_id !== null && !isGlobal ? String(first.poi_id) : '');
  const [type, setType] = useState<SuggestedType | ''>(
    (first.ai?.poi_type as SuggestedType | undefined) ?? (first.suggested_type as SuggestedType | null) ?? '');
  const [reject, setReject] = useState<RejectReason>('wrong');
  const [now, setNow] = useState<string | null>(null);

  const open = tab === 'open';
  // Reports, not people: the console is never told who sent them.
  const count = g.reports.length;
  const point = first.lat !== null && first.lng !== null ? { lat: first.lat, lng: first.lng } : null;
  const osm = point ? `https://www.openstreetmap.org/?mlat=${point.lat}&mlon=${point.lng}#map=18/${point.lat}/${point.lng}` : null;

  function approve() {
    if (kind === 'new_place') {
      if (!point || !label.trim() || !type) return;
      onApprove({ target: 'directory', action: 'add', name: label.trim(), type, lat: point.lat, lng: point.lng });
    } else if (kind === 'wrong_name') {
      if (!poiId || !label.trim()) return;
      onApprove({ target: 'directory', action: 'rename', poi_id: Number(poiId), label: label.trim() });
    } else {
      if (!poiId) return;
      onApprove({ target: 'directory', action: 'hide', poi_id: Number(poiId) });
    }
  }

  return (
    <div className="px-5 py-5 space-y-3">
      <div className="flex items-start gap-3 flex-wrap">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-dark-text">
            {KIND_LABEL[kind]}
            <span className="text-dark-muted font-normal">
              {' '}· {count} report{count === 1 ? '' : 's'} · {[...new Set(g.reports.map((r) => r.channel))].join(', ')}
              {' '}· {new Date(first.created_at).toLocaleString()}
            </span>
          </p>
          <div className="text-sm text-dark-muted mt-1 space-y-0.5">
            {first.shown_name && <p>Shown: <span className="text-dark-text">{first.shown_name}</span></p>}
            {suggestion && <p>Suggested: <span className="text-dark-text">{suggestion}</span>
              {first.suggested_type ? ` (${TYPE_LABEL[first.suggested_type as SuggestedType] ?? first.suggested_type})` : ''}</p>}
            {first.reason && <p>Reason: {REASON_LABEL[first.reason as keyof typeof REASON_LABEL] ?? first.reason}</p>}
            {first.poi_name && (
              <p>
                Directory row {first.poi_id}: {first.poi_label ? `“${first.poi_label}” (name “${first.poi_name}”)` : `“${first.poi_name}”`}
                {` · ${first.poi_type ?? 'no type'} · tier ${first.poi_tier}`}
                {first.poi_hidden ? ' · HIDDEN' : ''}
                {first.poi_seed_batch && first.poi_seed_batch !== 'feedback' ? ` · batch ${first.poi_seed_batch}` : ''}
              </p>
            )}
            {isGlobal && <p>Global POI {first.poi_id} — not editable here yet.</p>}
          </div>
          {g.reports.filter((r) => r.note).map((r) => (
            <p key={r.id} className="text-xs text-dark-text bg-dark-bg rounded-lg px-3 py-2 mt-2 whitespace-pre-wrap">{r.note}</p>
          ))}
        </div>
        <span className={`text-[11px] px-2 py-0.5 rounded-full border ${STATUS_STYLE[first.status] ?? 'bg-dark-bg text-dark-muted border-dark-border'}`}>
          {first.status.replace('_', ' ')}
        </span>
      </div>

      {(first.ai || first.park_reason) && (
        <div className="text-xs text-dark-muted bg-dark-bg rounded-xl px-3 py-2 space-y-1">
          {first.ai && (
            <p>
              AI: <span className="text-dark-text font-semibold">{first.ai.off_schema ? 'unreadable answer' : first.ai.verdict}</span>
              {first.ai.reason_code ? ` · ${first.ai.reason_code.replace(/_/g, ' ')}` : ''}
              {typeof first.ai.confidence === 'number' ? ` · ${Math.round(first.ai.confidence * 100)} %` : ''}
              {aiName ? ` · picked “${aiName}”` : ''}
              {first.would_auto_apply ? ' · would apply automatically' : ''}
            </p>
          )}
          {first.park_reason && <p>{explainPark(first.park_reason)}</p>}
        </div>
      )}

      {first.evidence && first.evidence.length > 0 && (
        <ul className="text-xs text-dark-muted space-y-0.5">
          {first.evidence.map((e, i) => (
            <li key={i}>
              {i}. {e.source === 'osm' ? 'OSM' : 'Wikidata'}: <span className="text-dark-text">{e.name}</span>
              {e.alts?.length ? ` (also ${e.alts.slice(0, 3).join(', ')})` : ''}
              {e.oldNames?.length ? ` (formerly ${e.oldNames.slice(0, 2).join(', ')})` : ''}
              {e.type ? ` · ${e.type}` : ''} · {Math.round(e.distM)} m
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-3 flex-wrap text-xs">
        {osm && <a href={osm} target="_blank" rel="noopener noreferrer" className="text-primary underline">Open in OpenStreetMap</a>}
        {point && (
          <button onClick={async () => setNow(await resolveNow(point.lat, point.lng))} className="text-primary underline">
            What does the app show here?
          </button>
        )}
        {now && <span className="text-dark-text">{now}</span>}
      </div>

      {tab === 'applied' && first.edit_id && first.edit_status === 'active' && (
        <div className="flex items-center gap-3 text-xs">
          <span className="text-dark-muted">
            {first.edit_origin === 'ai' ? 'Applied by the batch' : 'Applied by an admin'} · {first.edit_action}
            {first.edit_label ? ` “${first.edit_label}”` : ''}
            {first.edit_owner_batch ? ` · row owned by ${first.edit_owner_batch} (an undo of that batch resets it)` : ''}
          </span>
          <button onClick={() => { if (confirm('Revert this change?')) onRevert(first.edit_id!); }}
            className="px-3 py-1.5 border border-dark-border text-dark-text rounded-xl hover:bg-dark-border">
            Revert
          </button>
        </div>
      )}

      {open && (
        <div className="space-y-3 border-t border-dark-border pt-3">
          {kind !== 'not_here' && (
            <div className="grid sm:grid-cols-2 gap-2">
              <input className="bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-sm text-dark-text"
                value={label} onChange={(e) => setLabel(e.target.value)} maxLength={80}
                placeholder={kind === 'new_place' ? 'Name to add' : 'Name to show'} aria-label="Name" />
              {kind === 'new_place' ? (
                <select className="bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-sm text-dark-text"
                  value={type} onChange={(e) => setType(e.target.value as SuggestedType)} aria-label="Type">
                  <option value="">Type…</option>
                  {SUGGESTED_TYPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                </select>
              ) : (
                <input className="bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-sm text-dark-text"
                  value={poiId} onChange={(e) => setPoiId(e.target.value.replace(/\D/g, ''))}
                  placeholder="Directory POI id" aria-label="Directory POI id" />
              )}
            </div>
          )}
          {kind === 'not_here' && (
            <input className="bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-sm text-dark-text"
              value={poiId} onChange={(e) => setPoiId(e.target.value.replace(/\D/g, ''))}
              placeholder="Directory POI id to hide" aria-label="Directory POI id to hide" />
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={approve} disabled={isGlobal && kind !== 'new_place'}
              className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-dark-bg text-xs font-bold rounded-xl disabled:opacity-40">
              {kind === 'not_here' ? 'Approve: hide it' : kind === 'wrong_name' ? 'Approve: rename' : 'Approve: add'}
            </button>
            <select value={reject} onChange={(e) => setReject(e.target.value as RejectReason)} aria-label="Reject reason"
              className="bg-dark-bg border border-dark-border rounded-xl px-2 py-1.5 text-xs text-dark-text">
              {REJECT_REASONS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
            <button onClick={() => onReject(reject)}
              className="px-3 py-1.5 border border-dark-border text-dark-text text-xs font-semibold rounded-xl hover:bg-dark-border">
              Reject
            </button>
            <button onClick={onDuplicate}
              className="px-3 py-1.5 border border-dark-border text-dark-muted text-xs rounded-xl hover:bg-dark-border">
              Duplicate
            </button>
            {g.reports.filter((r) => !r.reporter_blocked).slice(0, 1).map((r) => (
              <button key={r.id} onClick={() => { if (confirm('Block whoever sent this report? Their other open reports are closed.')) onBlock(r.id); }}
                className="px-3 py-1.5 text-brand-danger text-xs rounded-xl hover:bg-brand-danger/10 ml-auto">
                Block reporter
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
