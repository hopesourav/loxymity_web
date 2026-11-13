'use client';

/**
 * Plan & billing — buy, upgrade or renew a circle plan on loxymity.com.
 *
 * Check first, then charge. Nothing here decides anything: every state, reason and amount comes
 * from the server (`razorpay-checkout`, app repo), which reads RevenueCat for a store plan and our
 * own circles and plans, validates again when the invoice is created, and a third time when the
 * payment is applied. Payment happens on Razorpay's invoice page; this page then asks the server
 * — never the browser — whether it went through.
 *
 * Deliberately OUTSIDE the paid-dashboard gate: a free user must reach it to buy, and a payer
 * whose tier is momentarily free (a refund, a plan that just ended) must never bounce between
 * here and the dashboard.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../_lib/client';
import {
  acceptTerms, blockingReason, cancelPlan, checkSelection, confirmOrder, coverCircle, createInvoice, formatDay,
  formatInr, getBillingState, planName, productParts, reasonText, REFUND_POLICY, termsPublished,
  type BillingState, type OrderKind, type WebCircle,
} from '../../_lib/webBilling';
import { latchMinor, minorLatched, type ConsentBand } from '../../_lib/age';
import { AgeStep, MinorNotice } from '../../_components/AgeStep';
import { PlanPicker, type PlanChoice } from '../../_components/PlanPicker';
import { APP_STORE_URL, DOWNLOAD_URL, PLAY_URL } from '../../../_lib/appLinks';
import { WEB_DISCOUNT_PCT } from '../../../_lib/pricing';

const PENDING_KEY = 'loxymity.pendingOrder';
const POLL_MS = 3000;
const POLL_FOR_MS = 15 * 60_000;

type Waiting = { orderId: string; url: string | null; since: number };
type Outcome = { kind: 'paid' | 'refused' | 'expired'; text: string } | null;

export default function PlanPage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [state, setState] = useState<BillingState | null>(null);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [waiting, setWaiting] = useState<Waiting | null>(null);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [band, setBand] = useState<ConsentBand | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [mode, setMode] = useState<OrderKind>('new');
  const [choice, setChoice] = useState<PlanChoice>({ tier: 'platinum', circles: 1, period: 'annual' });
  const [picked, setPicked] = useState<string[]>([]);
  const [check, setCheck] = useState<BillingState | null>(null);
  const [newCircle, setNewCircle] = useState('');
  const [mockAvailable, setMockAvailable] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const load = useCallback(async () => {
    const { data: { session: s } } = await supabase.auth.getSession();
    setSession(s);
    if (!s) return;
    const r = await getBillingState();
    if (!r.ok) { setLoadError(reasonText(r.data?.error ?? 'server_error')); return; }
    setLoadError('');
    setState(r.data);
    if (r.data.webPlan) {
      setMode((m) => (m === 'new' ? (r.data.webPlan!.inGrace ? 'renew' : 'upgrade') : m));
      const p = productParts(r.data.webPlan.productId);
      if (p) setChoice((c) => (c.tier === 'platinum' && c.circles === 1 ? p : c));
    } else {
      setMode('new');
    }
    const { data: mock } = await supabase.rpc('mock_payments_available');
    setMockAvailable(mock === true);
  }, []);

  useEffect(() => {
    load();
    try {
      const pending = sessionStorage.getItem(PENDING_KEY);
      if (pending) setWaiting({ orderId: pending, url: null, since: Date.now() });
    } catch { /* storage blocked */ }
  }, [load]);

  // ── waiting for the invoice to be paid ─────────────────────────────────────────────────────
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const poll = useCallback(async (w: Waiting) => {
    const r = await confirmOrder(w.orderId);
    if (!r.ok) return;
    const { status, applied } = r.data;
    const finish = (o: Outcome) => {
      if (timer.current) clearInterval(timer.current);
      try { sessionStorage.removeItem(PENDING_KEY); } catch { /* ignore */ }
      setWaiting(null);
      setOutcome(o);
      load();
    };
    if (status === 'paid' && applied) finish({ kind: 'paid', text: 'Payment received — your plan is active.' });
    else if (status === 'superseded') finish({ kind: 'refused', text: 'You already have a plan through the App Store or Google Play, so this payment is being refunded.' });
    else if (status === 'conflict') finish({ kind: 'refused', text: 'This invoice no longer matched your plan, so the payment is being refunded in full. Please check again and start a new purchase.' });
    else if (status === 'expired' || status === 'failed' || status === 'unknown') finish({ kind: 'expired', text: 'That invoice expired without a payment. Nothing was charged.' });
    else if (Date.now() - w.since > POLL_FOR_MS && timer.current) clearInterval(timer.current);
  }, [load]);

  useEffect(() => {
    if (!waiting) return;
    poll(waiting);
    timer.current = setInterval(() => poll(waiting), POLL_MS);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [waiting, poll]);

  // ── the server's verdict on the current selection ──────────────────────────────────────────
  const selection = useMemo(() => ({ ...choice, kind: mode, circle_ids: picked }), [choice, mode, picked]);
  useEffect(() => {
    if (!state || state.needs.age || state.needs.terms || state.storePlan) { setCheck(null); return; }
    let live = true;
    const t = setTimeout(async () => {
      const r = await checkSelection(selection);
      if (live) setCheck(r.ok ? r.data : null);
    }, 250);
    return () => { live = false; clearTimeout(t); };
  }, [selection, state]);

  // ── actions ────────────────────────────────────────────────────────────────────────────────
  async function answerAge(b: ConsentBand) {
    setError('');
    if (b === 'minor') {
      latchMinor();
      setBusy(true);
      await acceptTerms('minor');   // as the app does: the account is held for a guardian
      setBusy(false);
      setBand('minor');
      return;
    }
    setBand('adult');
  }

  async function agree() {
    setBusy(true); setError('');
    const ok = await acceptTerms(state?.needs.age ? band : null);
    setBusy(false);
    if (!ok) { setError('We couldn’t record that. Please try again.'); return; }
    await load();
  }

  async function makeCircle() {
    const name = newCircle.trim().slice(0, 40);
    if (!name || !session) return;
    setBusy(true); setError('');
    const { data: circle, error: e1 } = await supabase.from('circles')
      .insert({ name, created_by: session.user.id, type: 'family' }).select('id').single();
    if (e1 || !circle) {
      setBusy(false);
      setError(/quota/i.test(e1?.message ?? '') ? 'You already have 2 circles without a plan. Choose one of them to cover instead.' : 'We couldn’t create that circle. Please try again.');
      return;
    }
    // Same two writes as the app. A failed second write is retried once on the same circle.
    let { error: e2 } = await supabase.from('circle_members').insert({ circle_id: circle.id, user_id: session.user.id, role: 'owner' });
    if (e2) ({ error: e2 } = await supabase.from('circle_members').insert({ circle_id: circle.id, user_id: session.user.id, role: 'owner' }));
    setBusy(false);
    if (e2) { setError('Your circle was created but not finished. Please try again.'); return; }
    setNewCircle('');
    setPicked((p) => [...p, circle.id].slice(-choice.circles));
    await load();
  }

  async function pay() {
    setError('');
    // Opened inside the click so no pop-up blocker stops it; pointed at the invoice once it exists.
    const tab = window.open('', '_blank');
    setBusy(true);
    const r = await createInvoice(selection);
    setBusy(false);
    if (!r.ok) {
      tab?.close();
      const reasons: string[] = r.data?.reasons ?? [r.data?.error ?? 'server_error'];
      setError(reasonText(blockingReason(reasons) ?? reasons[0]));
      return;
    }
    try { sessionStorage.setItem(PENDING_KEY, r.data.order_id); } catch { /* ignore */ }
    setOutcome(null);
    setWaiting({ orderId: r.data.order_id, url: r.data.url, since: Date.now() });
    if (tab) { tab.opener = null; tab.location.href = r.data.url; }
    else window.location.href = r.data.url;
  }

  async function cover(id: string) {
    setBusy(true); setError('');
    const r = await coverCircle(id);
    setBusy(false);
    if (!r.ok) { setError(reasonText(r.data?.error ?? 'server_error')); return; }
    await load();
  }

  async function cancel(expected: number) {
    setBusy(true); setError('');
    const r = await cancelPlan(expected);
    setBusy(false);
    setConfirmCancel(false);
    if (!r.ok) { setError(reasonText(r.data?.error ?? 'server_error')); await load(); return; }
    setOutcome({ kind: 'refused', text: `Your plan is cancelled. ${formatInr(r.data.refund_inr)} is on its way back to your original payment method (usually 5–7 working days).` });
    await load();
  }

  async function mockBuy() {
    const circle = picked[0];
    if (!circle) { setError('Pick a circle first.'); return; }
    setBusy(true);
    const { error: e } = await supabase.rpc('mock_apply_subscription', { p_circle_id: circle, p_plan_id: choice.tier });
    setBusy(false);
    if (e) setError(e.message); else await load();
  }

  // ── render ─────────────────────────────────────────────────────────────────────────────────
  if (session === undefined) return <Shell><Spinner /></Shell>;

  if (session === null) {
    const next = encodeURIComponent('/dashboard/plan/');
    return (
      <Shell>
        <Heading sub={`${WEB_DISCOUNT_PCT}% less than in the app · prepaid · never renews by itself`} />
        <Card><PlanPicker value={choice} onChange={setChoice} /></Card>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={`/dashboard/signup/?next=${next}`} className={PRIMARY}>Create an account</a>
          <a href={`/dashboard/login/?next=${next}`} className={SECONDARY}>Sign in</a>
        </div>
        <p className="text-xs text-dark-muted text-center">Already use Loxymity? Sign in with the same email you use in the app.</p>
      </Shell>
    );
  }

  if (loadError) return <Shell><Notice>{loadError}</Notice><Retry onClick={load} /></Shell>;
  if (!state) return <Shell><Spinner /></Shell>;

  if (waiting) {
    return (
      <Shell>
        <Heading title="Waiting for your payment" />
        <Card>
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-dark-border border-t-primary rounded-full animate-spin mx-auto" />
            <p className="text-sm text-dark-text">Pay the invoice in the Razorpay tab. This page updates by itself.</p>
            <p className="text-xs text-dark-muted">Razorpay has also emailed you the invoice.</p>
            <div className="flex gap-3 justify-center pt-1">
              {waiting.url && <a href={waiting.url} target="_blank" rel="noopener noreferrer" className={SECONDARY}>Open the invoice again</a>}
              <button type="button" onClick={() => poll(waiting)} className={SECONDARY}>I’ve paid — check now</button>
            </div>
          </div>
        </Card>
      </Shell>
    );
  }

  const isMinor = state.reasons.includes('minor') || band === 'minor' || (state.needs.age && minorLatched());
  const block = blockingReason(state.reasons.filter((r) => !['has_plan', 'pick_circle'].includes(r)));

  return (
    <Shell>
      <Heading sub={`${WEB_DISCOUNT_PCT}% less than in the app · prepaid · never renews by itself`} />
      {outcome && (
        <Notice tone={outcome.kind === 'paid' ? 'good' : 'warn'}>
          {outcome.text}
          {outcome.kind === 'paid' && <AfterPurchase />}
        </Notice>
      )}

      {isMinor ? <MinorNotice /> : state.storePlan ? (
        <Card>
          <p className="text-sm font-semibold text-dark-text">Your plan is billed by the App Store or Google Play</p>
          <p className="text-xs text-dark-muted mt-1">Manage it in the Loxymity app. You can buy on the web once that plan has ended.</p>
          <CircleList circles={state.circles} />
        </Card>
      ) : state.needs.age && band === null ? (
        <Card><AgeStep onAnswer={answerAge} busy={busy} /></Card>
      ) : state.needs.terms || state.needs.age ? (
        termsPublished(state.termsVersion) ? (
          <Card>
            <label className="flex items-start gap-3 text-sm text-dark-text">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 accent-[#C9A227]" />
              <span>
                I agree to the <a href="/terms/" target="_blank" className="text-primary underline">Terms</a> and
                the <a href="/privacy/" target="_blank" className="text-primary underline">Privacy Policy</a>, including
                buying plans on loxymity.com.
              </span>
            </label>
            <button type="button" disabled={!agreed || busy} onClick={agree} className={`${PRIMARY} w-full mt-4`}>Continue</button>
          </Card>
        ) : (
          <Notice>Buying on the web opens soon. Until then, plans are available in the Loxymity app.</Notice>
        )
      ) : (
        <>
          {block && <Notice tone="warn">{reasonText(block)}</Notice>}

          {state.webPlan && (
            <Card>
              <p className="text-xs font-semibold text-dark-muted uppercase tracking-wider">Your plan</p>
              {(() => {
                const p = productParts(state.webPlan.productId);
                return <p className="mt-1 text-lg font-semibold text-dark-text">{p ? planName(p) : state.webPlan.productId}</p>;
              })()}
              <p className="text-xs text-dark-muted mt-0.5">
                {state.webPlan.inGrace
                  ? `Ended ${formatDay(state.webPlan.endsAt)} — renew within 3 days to keep your circles covered.`
                  : `Paid until ${formatDay(state.webPlan.endsAt)} · doesn’t renew automatically`}
                {state.webPlan.renewalPaid && ' · next period paid'}
              </p>
              <CircleList circles={state.circles} onCover={!state.webPlan.inGrace
                && state.webPlan.covered.length + state.webPlan.heldSlots < state.webPlan.circles ? cover : undefined} busy={busy} />
              <div className="flex gap-2 mt-4">
                {(['upgrade', 'renew'] as OrderKind[]).map((k) => (
                  <button key={k} type="button" onClick={() => { setMode(k); setPicked([]); }}
                    className={mode === k ? PRIMARY_SM : SECONDARY_SM}>{k === 'upgrade' ? 'Upgrade now' : 'Renew'}</button>
                ))}
              </div>

              {/* Cancel and refund, under the policy — the amount is the server's. */}
              <div className="mt-5 pt-4 border-t border-dark-border">
                <p className="text-xs font-semibold text-dark-muted uppercase tracking-wider">Cancel</p>
                <p className="text-xs text-dark-muted mt-1">{REFUND_POLICY}</p>
                {state.cancel && state.cancel.refundInr > 0 ? (
                  confirmCancel ? (
                    <div className="mt-3 rounded-xl border border-brand-danger/40 bg-brand-danger/10 px-3 py-3">
                      <p className="text-sm text-dark-text">
                        Cancel now? Your circles lose the plan today and {formatInr(state.cancel.refundInr)} is refunded.
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button type="button" disabled={busy} onClick={() => cancel(state.cancel!.refundInr)}
                          className="bg-brand-danger text-white font-semibold px-3 py-1.5 rounded-lg text-xs disabled:opacity-50">
                          Cancel and refund {formatInr(state.cancel.refundInr)}
                        </button>
                        <button type="button" onClick={() => setConfirmCancel(false)} className={SECONDARY_SM}>Keep my plan</button>
                      </div>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setConfirmCancel(true)} className={`${SECONDARY_SM} mt-3`}>
                      Cancel and get {formatInr(state.cancel.refundInr)} back
                    </button>
                  )
                ) : (
                  <p className="text-xs text-dark-text mt-2">
                    Nothing is refundable now. Your plan ends on {formatDay(state.webPlan.endsAt)} and never renews by itself.
                  </p>
                )}
              </div>
            </Card>
          )}

          <Card>
            <p className="text-sm font-semibold text-dark-text mb-3">
              {mode === 'new' ? 'Choose a plan' : mode === 'upgrade' ? 'Upgrade — starts today, with credit for the days left' : 'Renew — starts when your current period ends'}
            </p>
            <PlanPicker value={choice} onChange={(v) => { setChoice(v); setPicked((p) => p.slice(0, v.circles)); }}
              minCircles={mode === 'upgrade' && state.webPlan ? state.webPlan.circles : 1} />

            <div className="mt-5">
              <p className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-2">
                {mode === 'renew' ? 'Circles to keep' : mode === 'upgrade' ? 'Add circles (optional)' : 'Circles to cover'}
              </p>
              <CirclePicker
                circles={state.circles}
                selectable={(c) => mode === 'renew' ? c.status === 'covered_web' && !c.left : c.status === 'eligible'}
                picked={picked}
                max={mode === 'upgrade' && state.webPlan ? Math.max(0, choice.circles - state.webPlan.covered.length - state.webPlan.heldSlots) : choice.circles}
                onChange={setPicked}
              />
              {mode === 'new' && (
                <div className="mt-3 flex gap-2">
                  <input value={newCircle} onChange={(e) => setNewCircle(e.target.value)} maxLength={40}
                    placeholder="Or name a new circle, e.g. Family"
                    className="flex-1 bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-sm text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary" />
                  <button type="button" disabled={!newCircle.trim() || busy} onClick={makeCircle} className={SECONDARY_SM}>Create</button>
                </div>
              )}
              {mode === 'renew' && state.webPlan && choice.circles < state.webPlan.covered.length && picked.length === 0 && (
                <p className="text-xs text-dark-muted mt-2">If you don’t choose, the circles covered longest stay covered.</p>
              )}
            </div>

            <Summary check={check} />

            {error && <p className="mt-3 text-sm text-brand-danger bg-brand-danger/10 rounded-lg px-3 py-2">{error}</p>}

            <button type="button" onClick={pay}
              disabled={busy || !check?.eligible || !check.quote || !state.checkoutEnabled}
              className={`${PRIMARY} w-full mt-4`}>
              {busy ? 'Preparing your invoice…' : check?.quote ? `Pay ${formatInr(check.quote.amountInr)}` : 'Pay'}
            </button>
            {!state.checkoutEnabled && <p className="text-xs text-dark-muted text-center mt-2">{reasonText('paused')}</p>}
            <p className="text-xs text-dark-muted text-center mt-2">
              Paid through Razorpay (UPI, cards, net banking) · prices in rupees, including all taxes · Razorpay emails your invoice
            </p>
          </Card>

          {mockAvailable && (
            <Card>
              <p className="text-xs text-dark-muted">Admin test rail — applies the plan to the first chosen circle without any payment.</p>
              <button type="button" onClick={mockBuy} disabled={busy} className={`${SECONDARY_SM} mt-2`}>Simulate (no payment)</button>
            </Card>
          )}
        </>
      )}

      {state.orders && state.orders.length > 0 && (
        <Card>
          <p className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-2">Payments</p>
          <ul className="divide-y divide-dark-border">
            {state.orders.map((o) => {
              const p = productParts(o.product_id);
              return (
                <li key={o.id} className="py-2 flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="text-dark-text truncate">{p ? planName(p) : o.product_id}</p>
                    <p className="text-xs text-dark-muted">{formatDay(o.paid_at ?? o.created_at)} · {statusLabel(o.status, o.open)}{o.refund_inr ? ` · ${formatInr(o.refund_inr)} refunded` : ''}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-dark-text">{formatInr(o.amount_inr)}</p>
                    {o.invoice_url && <a href={o.invoice_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">{o.open ? 'Pay' : 'Invoice'}</a>}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      <p className="text-center space-x-4">
        <a href="/dashboard/" className="text-xs text-dark-muted hover:text-dark-text">Dashboard</a>
        <button type="button" onClick={async () => { await supabase.auth.signOut(); window.location.href = '/dashboard/login/'; }}
          className="text-xs text-dark-muted hover:text-brand-danger">Sign out</button>
        <a href="mailto:support@loxymity.com" className="text-xs text-dark-muted hover:text-dark-text">Contact support</a>
      </p>
    </Shell>
  );
}

function statusLabel(status: string, open: boolean): string {
  switch (status) {
    case 'paid': return 'Paid';
    case 'created': return open ? 'Waiting for payment' : 'Not paid';
    case 'expired': return 'Expired';
    case 'failed': return 'Not created';
    case 'refunded': return 'Refunded';
    case 'conflict': return 'Refunding';
    case 'superseded': return 'Replaced by your store plan';
    case 'upgraded': return 'Upgraded';
    case 'cancelled': return 'Cancelled';
    default: return status;
  }
}

function Summary({ check }: { check: BillingState | null }) {
  if (!check) return null;
  const q = check.quote;
  const reason = blockingReason(check.reasons);
  return (
    <div className="mt-5 rounded-xl bg-dark-bg border border-dark-border px-4 py-3 text-sm">
      {q ? (
        <>
          <div className="flex justify-between"><span className="text-dark-muted">{planName(q.product)}</span><span className="text-dark-text">{formatInr(q.priceInr)}</span></div>
          {q.creditInr > 0 && <div className="flex justify-between"><span className="text-dark-muted">Credit for unused days</span><span className="text-dark-text">−{formatInr(q.creditInr)}</span></div>}
          <div className="flex justify-between font-semibold mt-1"><span className="text-dark-text">To pay</span><span className="text-dark-text">{formatInr(q.amountInr)}</span></div>
          <p className="text-xs text-dark-muted mt-1">
            {q.kind === 'renew' ? `From ${formatDay(q.startsMs)} to ${formatDay(q.endsMs)}` : `From the payment date, about ${formatDay(q.endsMs)}`}
            {' '}· doesn’t renew automatically
          </p>
        </>
      ) : null}
      {reason && <p className="text-xs text-brand-warning mt-1">{reasonText(reason)}</p>}
    </div>
  );
}

function CircleList({ circles, onCover, busy }: { circles: WebCircle[]; onCover?: (id: string) => void; busy?: boolean }) {
  if (circles.length === 0) return null;
  return (
    <ul className="mt-3 divide-y divide-dark-border border border-dark-border rounded-xl">
      {circles.map((c) => (
        <li key={c.id} className="px-3 py-2 flex items-center justify-between text-sm">
          <span className="text-dark-text truncate">{c.name}</span>
          <span className="text-xs text-dark-muted flex items-center gap-2">
            {circleStatus(c)}
            {onCover && c.status === 'eligible' && (
              <button type="button" disabled={busy} onClick={() => onCover(c.id)} className="text-primary hover:underline disabled:opacity-50">Cover</button>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

function circleStatus(c: WebCircle): string {
  switch (c.status) {
    case 'covered_web': return c.left ? 'Covered until the period ends (you left)' : 'Covered by your plan';
    case 'covered_store': return 'Covered by your App Store / Google Play plan';
    case 'covered_other': return `Covered by ${c.payerName ?? 'another member'}`;
    case 'event': return 'Temporary — can’t be covered';
    default: return 'Free';
  }
}

function CirclePicker({ circles, selectable, picked, max, onChange }: {
  circles: WebCircle[]; selectable: (c: WebCircle) => boolean; picked: string[]; max: number; onChange: (ids: string[]) => void;
}) {
  if (circles.length === 0) return <p className="text-xs text-dark-muted">You’re not in a circle yet — name one below.</p>;
  return (
    <ul className="divide-y divide-dark-border border border-dark-border rounded-xl">
      {circles.map((c) => {
        const can = selectable(c);
        const on = picked.includes(c.id);
        return (
          <li key={c.id}>
            <label className={`px-3 py-2 flex items-center gap-3 text-sm ${can ? 'cursor-pointer' : 'opacity-50'}`}>
              <input type="checkbox" disabled={!can || (!on && picked.length >= max)} checked={on}
                onChange={() => onChange(on ? picked.filter((x) => x !== c.id) : [...picked, c.id])}
                className="accent-[#C9A227]" />
              <span className="text-dark-text flex-1 truncate">{c.name}</span>
              <span className="text-xs text-dark-muted">{circleStatus(c)}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

function AfterPurchase() {
  const store = APP_STORE_URL ?? PLAY_URL ?? DOWNLOAD_URL;
  return (
    <span className="block mt-2 text-xs">
      Next: <a href="/dashboard/circle/" className="underline">invite your family</a>
      {store ? <> and <a href={store} className="underline">get the app</a></> : ' and get the app'} — sign in with this same email.
    </span>
  );
}

const PRIMARY = 'inline-flex items-center justify-center bg-primary hover:opacity-90 disabled:opacity-50 text-dark-bg font-semibold px-5 py-2.5 rounded-xl text-sm transition-opacity';
const SECONDARY = 'inline-flex items-center justify-center bg-dark-surface border border-dark-border hover:border-primary text-dark-text font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors';
const PRIMARY_SM = 'bg-primary text-dark-bg font-semibold px-3 py-1.5 rounded-lg text-xs disabled:opacity-50';
const SECONDARY_SM = 'border border-dark-border text-dark-text hover:border-primary font-semibold px-3 py-1.5 rounded-lg text-xs disabled:opacity-50';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-dark-bg px-4 py-10">
      <div className="w-full max-w-2xl mx-auto space-y-5">{children}</div>
    </div>
  );
}

function Heading({ title = 'Plan & billing', sub }: { title?: string; sub?: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-3xl font-bold text-dark-text">{title}</p>
      {sub && <p className="text-dark-muted text-sm mt-1">{sub}</p>}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-dark-surface border border-dark-border rounded-2xl p-5">{children}</div>;
}

function Notice({ children, tone }: { children: React.ReactNode; tone?: 'good' | 'warn' }) {
  const cls = tone === 'good' ? 'border-brand-success/40 bg-brand-success/10' : tone === 'warn' ? 'border-brand-warning/40 bg-brand-warning/10' : 'border-dark-border bg-dark-surface';
  return <div className={`rounded-xl border px-4 py-3 text-sm text-dark-text ${cls}`}>{children}</div>;
}

function Retry({ onClick }: { onClick: () => void }) {
  return <div className="text-center"><button type="button" onClick={onClick} className={SECONDARY}>Try again</button></div>;
}

function Spinner() {
  return <div className="flex justify-center py-16"><div className="w-7 h-7 border-2 border-dark-border border-t-primary rounded-full animate-spin" /></div>;
}
