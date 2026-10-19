'use client';

/**
 * Business enquiries from loxymity.com/business/ (migration 0292, edge function `business-enquiry`).
 *
 * Admins read and triage through RLS (`business_enquiries_admin_select` / `_admin_update`); a
 * signed-in client can only ever change status, notes and contacted_at. Rows are written only by
 * the edge function. No realtime: the table is not in the realtime publication and enquiries are
 * rare — an admin's phone gets a push for each new one (the first 10 an hour), then Refresh here.
 *
 * Replies go from the team inbox: business@loxymity.com is a receive-only Cloudflare forward.
 */
import { useEffect, useState } from 'react';
import { useAdmin } from '../_lib/adminContext';

type Status = 'new' | 'contacted' | 'qualified' | 'closed' | 'spam';
type Enquiry = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  organisation: string;
  country: string;
  role: string | null;
  phone: string | null;
  org_size: string | null;
  interests: string[];
  people_count: string | null;
  needs_monitoring: string | null;
  message: string | null;
  status: Status;
  notes: string | null;
  contacted_at: string | null;
};

const COLS =
  'id,created_at,name,email,organisation,country,role,phone,org_size,interests,people_count,needs_monitoring,message,status,notes,contacted_at';
const OPEN: Status[] = ['new', 'contacted', 'qualified'];
const INTEREST_LABEL: Record<string, string> = {
  lone_worker: 'Lone-worker safety',
  employee_benefit: 'Employee benefit',
  care: 'Care organisation',
  insurance_partner: 'Insurer / bank',
  white_label: 'White-label',
  other: 'Other',
};
const MONITORING_LABEL: Record<string, string> = { yes: 'needs 24/7 monitoring', no: 'no 24/7 monitoring', not_sure: 'unsure about 24/7 monitoring' };
const STATUS_STYLE: Record<Status, string> = {
  new: 'bg-primary/15 text-primary border-primary/30',
  contacted: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/25',
  qualified: 'bg-brand-success/10 text-brand-success border-brand-success/25',
  closed: 'bg-dark-bg text-dark-muted border-dark-border',
  spam: 'bg-brand-danger/10 text-brand-danger border-brand-danger/25',
};

export default function EnquiriesPage() {
  const { supabase } = useAdmin();
  const [open, setOpen] = useState<Enquiry[]>([]);
  const [done, setDone] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>({});

  const loadData = async () => {
    setError('');
    const [{ data: o, error: e1 }, { data: d, error: e2 }] = await Promise.all([
      supabase.from('business_enquiries').select(COLS).in('status', OPEN).order('created_at', { ascending: false }),
      supabase.from('business_enquiries').select(COLS).in('status', ['closed', 'spam']).order('created_at', { ascending: false }).limit(50),
    ]);
    if (e1 || e2) setError((e1 ?? e2)!.message);
    setOpen((o ?? []) as Enquiry[]);
    setDone((d ?? []) as Enquiry[]);
    setNotes(Object.fromEntries(((o ?? []) as Enquiry[]).map((r) => [r.id, r.notes ?? ''])));
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [supabase]);

  async function setStatus(r: Enquiry, status: Status) {
    const patch: Partial<Enquiry> = { status };
    if (status === 'contacted' && !r.contacted_at) patch.contacted_at = new Date().toISOString();
    const { error: e } = await supabase.from('business_enquiries').update(patch).eq('id', r.id);
    if (e) setError(e.message);
    await loadData();
  }

  async function saveNotes(r: Enquiry) {
    const value = (notes[r.id] ?? '').slice(0, 2000);
    const { error: e } = await supabase.from('business_enquiries').update({ notes: value || null }).eq('id', r.id);
    if (e) setError(e.message);
    await loadData();
  }

  const mailto = (r: Enquiry) =>
    `mailto:${encodeURIComponent(r.email)}?subject=${encodeURIComponent(`Loxymity — your enquiry for ${r.organisation}`)}`;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-dark-text">Business enquiries</h1>
          <p className="text-dark-muted text-sm">From loxymity.com/business/ — reply within 2 working days</p>
        </div>
        <button
          onClick={loadData}
          className="shrink-0 px-3 py-1.5 bg-dark-surface border border-dark-border text-dark-text text-xs font-semibold rounded-xl hover:bg-dark-border transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && <p className="text-sm text-brand-danger bg-brand-danger/10 rounded-lg px-3 py-2">{error}</p>}

      <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-dark-border">
          <p className="font-semibold text-dark-text">
            Open
            {open.length > 0 && (
              <span className="ml-2 bg-primary text-dark-bg text-xs px-2 py-0.5 rounded-full">{open.length}</span>
            )}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : open.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="text-dark-text font-semibold">No open enquiries</p>
            <p className="text-dark-muted text-sm mt-1">New ones appear here, and admins get a push.</p>
          </div>
        ) : (
          <div className="divide-y divide-dark-border">
            {open.map((r) => (
              <div key={r.id} className="px-5 py-5 space-y-3">
                <div className="flex items-start gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-dark-text">
                      {r.organisation} <span className="text-dark-muted font-normal">· {r.country}{r.org_size ? ` · ${r.org_size} people` : ''}</span>
                    </p>
                    <p className="text-dark-muted text-sm">
                      {r.name}{r.role ? `, ${r.role}` : ''} ·{' '}
                      <a href={mailto(r)} className="text-primary hover:underline">{r.email}</a>
                      {r.phone && <> · {r.phone}</>}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                  <span className="text-dark-muted text-xs whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {r.interests.map((i) => (
                    <span key={i} className="text-xs text-dark-text bg-dark-bg border border-dark-border rounded-full px-2.5 py-1">{INTEREST_LABEL[i] ?? i}</span>
                  ))}
                  {r.needs_monitoring && (
                    <span className="text-xs text-dark-muted bg-dark-bg border border-dark-border rounded-full px-2.5 py-1">{MONITORING_LABEL[r.needs_monitoring] ?? r.needs_monitoring}</span>
                  )}
                  {r.people_count && (
                    <span className="text-xs text-dark-muted bg-dark-bg border border-dark-border rounded-full px-2.5 py-1">≈ {r.people_count} people</span>
                  )}
                </div>

                {r.message && <p className="text-sm text-dark-text whitespace-pre-wrap">{r.message}</p>}

                <div className="flex flex-col sm:flex-row gap-2">
                  <textarea
                    value={notes[r.id] ?? ''}
                    onChange={(e) => setNotes((n) => ({ ...n, [r.id]: e.target.value }))}
                    placeholder="Notes (only admins see these)"
                    maxLength={2000}
                    rows={2}
                    className="flex-1 bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-sm text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={() => saveNotes(r)}
                    disabled={(notes[r.id] ?? '') === (r.notes ?? '')}
                    className="self-start px-3 py-2 bg-dark-bg border border-dark-border text-dark-text text-xs font-semibold rounded-xl hover:bg-dark-border transition-colors disabled:opacity-40"
                  >
                    Save notes
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <a href={mailto(r)} className="px-3 py-1.5 bg-primary text-dark-bg text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors">Reply by email</a>
                  {(['contacted', 'qualified', 'closed', 'spam'] as Status[]).filter((s) => s !== r.status).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(r, s)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors hover:opacity-80 ${STATUS_STYLE[s]}`}
                    >
                      Mark {s}
                    </button>
                  ))}
                </div>
                {r.contacted_at && <p className="text-dark-muted text-xs">First contacted {new Date(r.contacted_at).toLocaleString()}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-dark-border">
          <p className="font-semibold text-dark-text">
            Closed and spam <span className="text-dark-muted font-normal text-sm">(latest 50 · spam is deleted after 30 days, the rest 24 months after the last change)</span>
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border text-dark-muted text-left text-xs">
                <th className="px-5 py-3 font-medium">Organisation</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Received</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {done.map((r) => (
                <tr key={r.id} className="hover:bg-dark-bg transition-colors">
                  <td className="px-5 py-3 text-dark-text font-medium">{r.organisation} <span className="text-dark-muted font-normal">· {r.country}</span></td>
                  <td className="px-5 py-3 text-dark-muted">{r.name} · {r.email}</td>
                  <td className="px-5 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLE[r.status]}`}>{r.status}</span></td>
                  <td className="px-5 py-3 text-dark-muted text-xs whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => setStatus(r, 'new')} className="text-xs text-primary hover:underline">Reopen</button>
                  </td>
                </tr>
              ))}
              {done.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-dark-muted">Nothing closed yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
