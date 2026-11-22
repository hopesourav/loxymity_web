'use client';

/**
 * Abuse reports (Block / Report in the app, Loxymity migrations 0273 + 0338).
 *
 * Read through admin_reports_list and decided through admin_report_act — both SECURITY DEFINER and
 * refused unless is_current_user_admin() (an aal2 session). The decision is kept in a private side
 * table the reporter cannot read. Recording "removed" or "blocked" changes nothing else: removing
 * someone from a circle or blocking stays a manual step (the note on the page says where).
 *
 * Reports quote people's messages and can name children: everything is rendered as React text
 * (never HTML, never auto-linked), nothing is logged to the console, nothing is sent anywhere else.
 */
import { useCallback, useEffect, useState } from 'react';
import { useAdmin } from '../_lib/adminContext';

type Status = 'open' | 'reviewing' | 'actioned' | 'dismissed';
type Action = 'reviewing' | 'dismiss' | 'warn' | 'remove_from_circle' | 'block' | 'escalate';

/** One row of admin_reports_list (0338) — exactly the keys the function builds. */
type Report = {
  id: number;
  created_at: string;
  reason: string;
  status: Status;
  involves_minor: boolean | null;
  message_kind: 'circle' | 'direct' | null;
  content_snapshot: string | null;
  details: string | null;
  reporter_id: string | null;
  reported_user_id: string | null;
  circle_id: string | null;
  reporter_name: string | null;
  reported_name: string | null;
  due_at: string;
  action: Action | null;
  notes: string | null;
  assigned_to: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
};

/** admin_reports_list caps a call at 500 rows (newest first). */
const LIST_LIMIT = 500;

const TODO: Status[] = ['open', 'reviewing'];

const REASON_LABEL: Record<string, string> = {
  harassment: 'Harassment',
  sexual: 'Sexual content',
  threat: 'Threat',
  self_harm: 'Self-harm',
  spam: 'Spam',
  other: 'Other',
};

const STATUS_STYLE: Record<Status, string> = {
  open: 'bg-primary/15 text-primary border-primary/30',
  reviewing: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/25',
  actioned: 'bg-brand-success/10 text-brand-success border-brand-success/25',
  dismissed: 'bg-dark-bg text-dark-muted border-dark-border',
};

/** What each button records. Only "Mark reviewing" and "Dismiss" do what they say by themselves. */
const ACTIONS: { action: Action; label: string; style: string }[] = [
  { action: 'reviewing', label: 'Mark reviewing', style: STATUS_STYLE.reviewing },
  { action: 'dismiss', label: 'Dismiss', style: 'bg-dark-bg text-dark-muted border-dark-border' },
  { action: 'warn', label: 'Record: I warned them', style: 'bg-brand-warning/10 text-brand-warning border-brand-warning/25' },
  { action: 'remove_from_circle', label: 'Record: I removed them from the circle', style: 'bg-brand-warning/10 text-brand-warning border-brand-warning/25' },
  { action: 'block', label: 'Record: I blocked them', style: 'bg-brand-danger/10 text-brand-danger border-brand-danger/25' },
  { action: 'escalate', label: 'Escalate', style: 'bg-brand-danger/10 text-brand-danger border-brand-danger/25' },
];

const DECISION_LABEL: Record<Action, string> = {
  reviewing: 'Marked reviewing',
  dismiss: 'Dismissed',
  warn: 'Recorded: warned',
  remove_from_circle: 'Recorded: removed from the circle',
  block: 'Recorded: blocked',
  escalate: 'Escalated',
};

function errorText(message: string): string {
  if (/not_admin/.test(message)) {
    return 'Not allowed: this session is not a verified admin. Sign out and sign in again with your authenticator code.';
  }
  if (/not_found/.test(message)) return 'That report no longer exists. The list has been refreshed.';
  if (/invalid_action/.test(message)) return 'That action is not accepted by the server.';
  return message;
}

/** "3 h 20 min" / "2 days" — no seconds; a review clock, not a stopwatch. */
function span(ms: number): string {
  const min = Math.max(0, Math.round(ms / 60_000));
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 48) return min % 60 ? `${h} h ${min % 60} min` : `${h} h`;
  return `${Math.floor(h / 24)} days`;
}

function shortId(id: string | null): string {
  return id ? id.slice(0, 8) : '—';
}

function Person({ label, name, id }: { label: string; name: string | null; id: string | null }) {
  return (
    <p className="text-sm text-dark-muted">
      {label}: <span className="text-dark-text font-medium">{name ?? 'Unknown (no profile)'}</span>
      {' '}<span className="font-mono text-xs select-all">{id ?? '—'}</span>
    </p>
  );
}

/** Everything a reviewer needs, as plain React text (never HTML, never linkified). */
function ReportBody({ r, me }: { r: Report; me: string }) {
  const who = (id: string | null) => (id && id === me ? 'you' : shortId(id));
  return (
    <>
      <Person label="Reported" name={r.reported_name} id={r.reported_user_id} />
      <Person label="Reported by" name={r.reporter_name} id={r.reporter_id} />
      {r.circle_id && (
        <p className="text-sm text-dark-muted">
          Circle: <span className="font-mono text-xs select-all">{r.circle_id}</span>
        </p>
      )}
      <p className="text-sm text-dark-muted">
        {r.message_kind === 'circle'
          ? 'About a circle chat message:'
          : r.message_kind === 'direct'
            ? 'About a direct message:'
            : 'About the person (no message attached).'}
      </p>
      {r.message_kind && (
        r.content_snapshot
          ? <p className="text-sm text-dark-text whitespace-pre-wrap break-words bg-dark-bg border border-dark-border rounded-xl px-3 py-2">{r.content_snapshot}</p>
          : <p className="text-sm text-dark-muted italic">The message had no text (or could not be copied).</p>
      )}
      {r.details && (
        <div>
          <p className="text-xs text-dark-muted mb-1">What the reporter wrote</p>
          <p className="text-sm text-dark-text whitespace-pre-wrap break-words">{r.details}</p>
        </div>
      )}
      {(r.action || r.reviewed_at) && (
        <p className="text-xs text-dark-muted">
          {r.action ? DECISION_LABEL[r.action] ?? r.action : ''}
          {r.assigned_to ? ` · taken by ${who(r.assigned_to)}` : ''}
          {r.reviewed_by ? ` · decided by ${who(r.reviewed_by)}` : ''}
          {r.reviewed_at ? ` · ${new Date(r.reviewed_at).toLocaleString()}` : ''}
        </p>
      )}
      {r.notes && (
        <div>
          <p className="text-xs text-dark-muted mb-1">Notes (admins only)</p>
          <p className="text-sm text-dark-text whitespace-pre-wrap break-words">{r.notes}</p>
        </div>
      )}
    </>
  );
}

export default function ReportsPage() {
  const { supabase, userId } = useAdmin();
  const [reports, setReports] = useState<Report[]>([]);
  const [closedCapped, setClosedCapped] = useState(false);
  const [loading, setLoading] = useState(true);
  /** False when the last read failed: never show "Nothing to review" for a list we could not read. */
  const [listOk, setListOk] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [now, setNow] = useState(() => Date.now());

  const loadData = useCallback(async () => {
    setError('');
    const { data, error: e } = await supabase.rpc('admin_reports_list', { p_status: null, p_limit: LIST_LIMIT });
    if (e) { setError(errorText(e.message)); setListOk(false); setLoading(false); return; }
    let rows = (Array.isArray(data) ? data : []) as Report[];
    let capped = false;
    if (rows.length >= LIST_LIMIT) {
      // The newest 500 of all statuses: an older report still to do could have fallen off.
      // Read the to-do statuses on their own so none is ever missed.
      capped = true;
      const extra = await Promise.all(TODO.map((s) =>
        supabase.rpc('admin_reports_list', { p_status: s, p_limit: LIST_LIMIT })));
      const failed = extra.find((r) => r.error);
      if (failed?.error) {
        setError(errorText(failed.error.message));
        setListOk(false);
        setLoading(false);
        return;
      }
      const byId = new Map(rows.map((r) => [r.id, r]));
      for (const r of extra) {
        for (const row of (Array.isArray(r.data) ? r.data : []) as Report[]) byId.set(row.id, row);
      }
      rows = Array.from(byId.values());
    }
    setReports(rows);
    setListOk(true);
    setClosedCapped(capped);
    setNow(Date.now());
    setLoading(false);
  }, [supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  // Keeps "due in" / "overdue" honest while the page stays open.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, []);

  async function act(r: Report, action: Action) {
    setBusyId(r.id);
    setError('');
    const note = (notes[r.id] ?? '').trim().slice(0, 2000);
    const { error: e } = await supabase.rpc('admin_report_act', {
      p_report_id: r.id,
      p_action: action,
      p_notes: note || null,
    });
    if (!e) setNotes((n) => { const next = { ...n }; delete next[r.id]; return next; });
    await loadData();
    // After the reload, which clears the message: an action that failed must stay visible.
    if (e) setError(errorText(e.message));
    setBusyId(null);
  }

  const todo = reports
    .filter((r) => TODO.includes(r.status))
    .sort((a, b) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime()); // overdue first
  const closed = reports
    .filter((r) => !TODO.includes(r.status))
    .sort((a, b) =>
      new Date(b.reviewed_at ?? b.created_at).getTime() - new Date(a.reviewed_at ?? a.created_at).getTime());
  const overdue = todo.filter((r) => new Date(r.due_at).getTime() < now).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-dark-text">Abuse reports</h1>
          <p className="text-dark-muted text-sm">
            From Report in the app. Due in 4 h when a child is involved or for self-harm, threats and
            sexual content; else 48 h.
          </p>
        </div>
        <button
          onClick={loadData}
          className="shrink-0 px-3 py-1.5 bg-dark-surface border border-dark-border text-dark-text text-xs font-semibold rounded-xl hover:bg-dark-border transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-2xl px-5 py-4 text-sm text-dark-muted space-y-1.5">
        <p className="text-dark-text font-semibold">Recording a decision does not carry it out.</p>
        <p>
          <span className="text-dark-text">Remove from a circle:</span> there is no console button. The circle&apos;s
          owner or an admin does it in the app — open the circle, tap the person, Remove from Circle.
        </p>
        <p>
          <span className="text-dark-text">Block:</span> a block is between two people — the reporter blocks them
          in the app (a direct message&apos;s ⋯ menu, or press and hold their message in circle chat). To stop the
          account itself, ban it in the Supabase dashboard (Authentication → Users → the user → Ban user); a
          session already open can keep working for up to 7 days.
        </p>
        <p>
          <span className="text-dark-text">Warn:</span> contact them yourself; nothing is sent from here.
          Then record what you did, with a note.
        </p>
      </div>

      {error && <p className="text-sm text-brand-danger bg-brand-danger/10 rounded-lg px-3 py-2">{error}</p>}

      <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-dark-border">
          <p className="font-semibold text-dark-text">
            To do
            {todo.length > 0 && (
              <span className="ml-2 bg-primary text-dark-bg text-xs px-2 py-0.5 rounded-full">{todo.length}</span>
            )}
            {overdue > 0 && (
              <span className="ml-2 bg-brand-danger text-white text-xs px-2 py-0.5 rounded-full">{overdue} overdue</span>
            )}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : !listOk ? (
          <div className="px-5 py-14 text-center">
            <p className="text-dark-text font-semibold">Could not read the reports</p>
            <p className="text-dark-muted text-sm mt-1">See the message above, then Refresh.</p>
          </div>
        ) : todo.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="text-dark-text font-semibold">Nothing to review</p>
            <p className="text-dark-muted text-sm mt-1">New reports appear here, and admins get a push.</p>
          </div>
        ) : (
          <div className="divide-y divide-dark-border">
            {todo.map((r) => {
              const dueMs = new Date(r.due_at).getTime() - now;
              const late = dueMs < 0;
              const busy = busyId === r.id;
              return (
                <div key={r.id} className="px-5 py-5 space-y-3">
                  <div className="flex items-start gap-2 flex-wrap">
                    <p className="font-semibold text-dark-text flex-1 min-w-0">
                      {REASON_LABEL[r.reason] ?? r.reason}
                      <span className="text-dark-muted font-normal text-sm"> · report #{r.id}</span>
                    </p>
                    {r.involves_minor && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-brand-danger/10 text-brand-danger border-brand-danger/25">Child involved</span>
                    )}
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${late
                      ? 'bg-brand-danger text-white border-brand-danger'
                      : 'bg-dark-bg text-dark-muted border-dark-border'}`}>
                      {late ? `Overdue by ${span(-dueMs)}` : `Due in ${span(dueMs)}`}
                    </span>
                  </div>
                  <p className="text-dark-muted text-xs">
                    Reported {new Date(r.created_at).toLocaleString()} · due {new Date(r.due_at).toLocaleString()}
                  </p>

                  <ReportBody r={r} me={userId} />

                  <textarea
                    value={notes[r.id] ?? ''}
                    onChange={(e) => setNotes((n) => ({ ...n, [r.id]: e.target.value }))}
                    placeholder="Note, saved with the next button you press (only admins see it)"
                    maxLength={2000}
                    rows={2}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-sm text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                  <div className="flex flex-wrap gap-2">
                    {ACTIONS.filter((a) => !(a.action === 'reviewing' && r.status === 'reviewing')).map((a) => (
                      <button
                        key={a.action}
                        onClick={() => act(r, a.action)}
                        disabled={busyId !== null}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors hover:opacity-80 disabled:opacity-40 ${a.style}`}
                      >
                        {busy ? 'Saving…' : a.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-dark-border">
          <p className="font-semibold text-dark-text">
            Closed
            {closedCapped && (
              <span className="text-dark-muted font-normal text-sm"> (only the newest {LIST_LIMIT} reports are read; older closed ones are not shown)</span>
            )}
          </p>
        </div>
        {loading || !listOk ? null : closed.length === 0 ? (
          <div className="px-5 py-10 text-center text-dark-muted text-sm">Nothing closed yet.</div>
        ) : (
          <div className="divide-y divide-dark-border">
            {closed.map((r) => (
              <details key={r.id} className="px-5 py-4">
                <summary className="cursor-pointer">
                  <span className="inline-flex items-center gap-2 flex-wrap align-middle">
                    <span className="font-medium text-dark-text">{REASON_LABEL[r.reason] ?? r.reason}</span>
                    <span className="text-dark-muted text-sm">· report #{r.id} · {r.reported_name ?? 'Unknown'}</span>
                    {r.involves_minor && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-brand-danger/10 text-brand-danger border-brand-danger/25">Child involved</span>
                    )}
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                    <span className="text-dark-muted text-xs whitespace-nowrap">
                      {r.reviewed_at ? `Closed ${new Date(r.reviewed_at).toLocaleString()}` : new Date(r.created_at).toLocaleString()}
                    </span>
                  </span>
                </summary>
                <div className="pt-3 space-y-3">
                  <p className="text-dark-muted text-xs">Reported {new Date(r.created_at).toLocaleString()}</p>
                  <ReportBody r={r} me={userId} />
                  <textarea
                    value={notes[r.id] ?? ''}
                    onChange={(e) => setNotes((n) => ({ ...n, [r.id]: e.target.value }))}
                    placeholder="Note, saved if you reopen it (only admins see it)"
                    maxLength={2000}
                    rows={2}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-sm text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={() => act(r, 'reviewing')}
                    disabled={busyId !== null}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors hover:opacity-80 disabled:opacity-40 ${STATUS_STYLE.reviewing}`}
                  >
                    {busyId === r.id ? 'Saving…' : 'Reopen (mark reviewing)'}
                  </button>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
