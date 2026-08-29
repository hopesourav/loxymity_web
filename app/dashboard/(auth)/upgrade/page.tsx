'use client';

/**
 * Dashboard paywall + checkout (Workstream E1/E2).
 *
 * WHAT CHANGED: this page used to sell ONE ₹399 "Pro Dashboard" SKU that wrote
 * `web_tier = 'pro'`. Nobody ever bought it (all 10 profiles read `free`), so
 * there is nothing to grandfather. It now sells the same four tiers the
 * marketing page advertises, reading prices from `_lib/pricing.ts` so the two
 * cannot drift.
 *
 * THE MOCK RAIL. The real checkout functions (`razorpay-checkout`,
 * `stripe-checkout`) are written but NOT DEPLOYED to this project, and the store
 * accounts are still pending — so there is currently no way to exercise this
 * page end to end. `mock_apply_subscription` (migration 0137) stands in: it runs
 * the genuine server path — `apply_circle_subscription` -> `circle_subscriptions`
 * -> `record_subscription_event` -> `profiles.subscription_tier` — without a
 * payment. It is gated three ways server-side (global flag, admin only, circle
 * owner/admin) and `mock_payments_available()` reflects the first two, so the
 * mock UI is never shown to a user the server would refuse.
 *
 * When the real rail lands, delete the mock branch. Nothing else on this page
 * depends on it: the post-payment polling below is shared by both.
 */

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../_lib/client';
import { hasDashboardAccess } from '../../../_lib/tiers';
import { PLANS, detectCurrency, type Currency, type PlanId } from '../../../_lib/pricing';
import { RAZORPAY_SCRIPT_URL, STRIPE_LIVE } from '../../_lib/constants';
import { IconCheck } from '../../_components/Icons';

type Stage = 'wall' | 'processing' | 'timeout';

/** A circle this user may buy a plan for. `apply_circle_subscription` requires
 *  owner or admin, so anything else is not a valid checkout target. */
type OwnedCircle = { id: string; name: string };

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).Razorpay) { resolve(); return; }
    const s = document.createElement('script');
    s.src = RAZORPAY_SCRIPT_URL;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.head.appendChild(s);
  });
}

export default function UpgradePage() {
  const [stage, setStage]       = useState<Stage>('wall');
  const [error, setError]       = useState('');
  const [busy, setBusy]         = useState<PlanId | null>(null);
  const [checking, setChecking] = useState(true);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [circles, setCircles]   = useState<OwnedCircle[]>([]);
  const [circleId, setCircleId] = useState<string>('');
  const [mockAvailable, setMockAvailable] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { setCurrency(detectCurrency()); }, []);

  // Session check, Stripe redirect-back, owned circles, mock availability.
  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/dashboard/login/'; return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier,web_tier')
        .eq('id', session.user.id)
        .single();

      if (hasDashboardAccess(profile)) {
        window.location.href = '/dashboard/';
        return;
      }

      // Only owner/admin memberships — the server enforces the same rule, so
      // offering any other circle would just produce a 403 after payment.
      const { data: memberships } = await supabase
        .from('circle_members')
        .select('circle_id, role, circles!inner(id,name)')
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .in('role', ['owner', 'admin']);

      const owned: OwnedCircle[] = ((memberships ?? []) as any[])
        .map((m) => ({ id: m.circles.id, name: m.circles.name }));
      setCircles(owned);
      if (owned.length > 0) setCircleId(owned[0].id);

      const { data: mock } = await supabase.rpc('mock_payments_available');
      setMockAvailable(mock === true);

      // Stripe redirects back with ?checkout=stripe on success
      const params = new URLSearchParams(window.location.search);
      if (params.get('checkout') === 'stripe') setStage('processing');

      setChecking(false);
    }
    check();
  }, []);

  // Poll for access after payment. Shared by every rail, mock included — the
  // mock RPC writes the tier synchronously, so this resolves on the first tick.
  useEffect(() => {
    if (stage !== 'processing') return;
    let attempts = 0;
    pollRef.current = setInterval(async () => {
      attempts++;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier,web_tier')
        .eq('id', session.user.id)
        .single();

      if (hasDashboardAccess(profile)) {
        clearInterval(pollRef.current!);
        window.location.href = '/dashboard/';
      } else if (attempts >= 15) { // 30 s — Stripe webhooks can be slower
        clearInterval(pollRef.current!);
        setStage('timeout');
      }
    }, 2000);
    return () => clearInterval(pollRef.current!);
  }, [stage]);

  async function handleMock(plan: PlanId) {
    if (!circleId) { setError('Create a circle in the app before upgrading.'); return; }
    setError(''); setBusy(plan);
    const { error: rpcErr } = await supabase.rpc('mock_apply_subscription', {
      p_circle_id: circleId,
      p_plan_id: plan,
    });
    if (rpcErr) { setError(rpcErr.message); setBusy(null); return; }
    setStage('processing');
  }

  async function handleRazorpay(plan: PlanId) {
    setError(''); setBusy(plan);
    try {
      await loadRazorpayScript();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/dashboard/login/'; return; }

      const { data, error: fnErr } = await supabase.functions.invoke('razorpay-checkout', {
        body: { plan_id: plan, circle_id: circleId || null },
      });
      if (fnErr || !data?.subscription_id) {
        setError('Could not start checkout. Please try again.'); setBusy(null); return;
      }

      const { subscription_id, key_id } = data as { subscription_id: string; key_id: string };
      const rzp = new (window as any).Razorpay({
        key: key_id,
        subscription_id,
        name: 'Loxymity',
        description: `Loxymity ${plan[0].toUpperCase()}${plan.slice(1)}`,
        prefill: { email: session.user.email ?? '' },
        theme: { color: '#C9A227' },
        handler: () => { setStage('processing'); },
        modal: { ondismiss: () => setBusy(null) },
      });
      rzp.open();
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong.'); setBusy(null);
    }
  }

  async function handleStripe(plan: PlanId) {
    setError(''); setBusy(plan);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke('stripe-checkout', {
        body: { plan_id: plan, circle_id: circleId || null },
      });
      if (fnErr || !data?.url) {
        setError('Could not start Stripe checkout. Please try again.'); setBusy(null); return;
      }
      window.location.href = data.url;
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong.'); setBusy(null);
    }
  }

  function choose(plan: PlanId) {
    if (mockAvailable) return handleMock(plan);
    if (STRIPE_LIVE) return handleStripe(plan);
    return handleRazorpay(plan);
  }

  if (checking) return <Spinner />;

  if (stage === 'processing') {
    return (
      <Centered>
        <div className="w-10 h-10 border-2 border-dark-border border-t-primary rounded-full animate-spin mx-auto" />
        <p className="text-dark-text font-semibold">Setting up your access…</p>
        <p className="text-dark-muted text-sm">This takes a few seconds.</p>
      </Centered>
    );
  }

  if (stage === 'timeout') {
    return (
      <Centered>
        <p className="text-dark-text font-semibold">Taking longer than expected</p>
        <p className="text-dark-muted text-sm">
          Your payment was received. Refresh in a moment, or contact us if this persists.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-primary text-dark-bg font-semibold rounded-xl text-sm"
          >
            Refresh
          </button>
          <a
            href="mailto:support@loxymity.com"
            className="px-5 py-2.5 border border-dark-border text-dark-muted rounded-xl text-sm hover:border-primary transition-colors"
          >
            Contact support
          </a>
        </div>
      </Centered>
    );
  }

  // Free is not purchasable, and this page is only reachable by a user who
  // already has it — so it is filtered out rather than shown as an option.
  const paidPlans = PLANS[currency].filter((p) => p.id !== null);

  return (
    <div className="min-h-dvh bg-dark-bg px-4 py-12">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-2">
          <p className="font-display text-3xl font-bold text-dark-text">Loxymity</p>
        </div>
        <p className="text-center text-dark-muted mb-8">
          Choose a plan to unlock the web dashboard — and everything in the app.
        </p>

        {mockAvailable && (
          <div className="max-w-lg mx-auto mb-8 rounded-xl border border-dashed border-dark-border px-4 py-3 text-center">
            <p className="text-xs font-semibold text-dark-muted">
              Test mode — payment rails are not connected yet. Choosing a plan applies it
              directly, no money moves.
            </p>
          </div>
        )}

        {circles.length > 1 && (
          <div className="max-w-sm mx-auto mb-8">
            <label htmlFor="circle" className="block text-xs font-semibold text-dark-muted mb-1.5">
              Which circle is this plan for?
            </label>
            <select
              id="circle"
              value={circleId}
              onChange={(e) => setCircleId(e.target.value)}
              className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2.5 text-sm text-dark-text"
            >
              {circles.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}

        {circles.length === 0 && (
          <p className="max-w-lg mx-auto mb-8 text-center text-sm text-dark-muted bg-dark-surface border border-dark-border rounded-xl px-4 py-3">
            A plan covers a circle. Create one in the Loxymity app — or ask your circle&apos;s
            owner to upgrade — and this page will let you check out.
          </p>
        )}

        {error && (
          <p className="max-w-lg mx-auto text-sm text-brand-danger bg-brand-danger/10 rounded-lg px-3 py-2 mb-6 text-center">
            {error}
          </p>
        )}

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {paidPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-6 bg-dark-surface border ${
                plan.highlight ? 'border-primary/60' : 'border-dark-border'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-dark-bg text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}
              <p className="uppercase tracking-wide text-sm font-semibold text-dark-muted mb-2">{plan.name}</p>
              <p className="flex items-baseline gap-1 mb-1">
                <span className="font-display text-4xl font-bold text-dark-text">{plan.price}</span>
                <span className="text-dark-muted text-sm">/mo</span>
              </p>
              <p className="text-dark-muted text-xs mb-3">{plan.cadence}</p>
              {/* The billed total has to sit beside the derived monthly figure —
                  a per-month headline on an annual commitment is misleading
                  without it, and the monthly alternative must stay visible. */}
              <div className="rounded-lg bg-brand-success/8 border border-brand-success/20 px-2.5 py-2 mb-5">
                <p className="text-brand-success text-xs font-bold leading-tight">
                  Save {plan.annualSave} vs monthly
                </p>
                <p className="text-dark-muted text-[10px] mt-0.5">Billed annually — {plan.annualTotal}/year</p>
                <p className="text-dark-muted text-[10px] mt-0.5">Prefer monthly? {plan.trueMonthly}/month</p>
              </div>

              <ul className="flex flex-col gap-2 mb-6 flex-1">
                {plan.features.map((f, i) => (
                  <li key={f} className={`flex items-start gap-2 text-sm ${i === 0 ? 'text-dark-text font-semibold' : 'text-dark-muted'}`}>
                    {i !== 0 && <IconCheck className="text-brand-success shrink-0 mt-0.5" size={15} />}
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => choose(plan.id!)}
                disabled={busy !== null || circles.length === 0}
                className={`w-full px-5 py-3 rounded-xl text-sm font-bold transition-opacity disabled:opacity-50 ${
                  plan.highlight
                    ? 'bg-primary text-dark-bg hover:opacity-90'
                    : 'bg-dark-bg border border-dark-border text-dark-text hover:border-primary'
                }`}
              >
                {busy === plan.id ? 'Opening checkout…' : `Choose ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs text-dark-muted text-center mt-8">
          Already subscribed in the mobile app?{' '}
          <a href="/dashboard/login/" className="text-primary hover:underline">Sign in</a>
          {' '}— your plan carries over automatically.
        </p>

        <p className="text-center mt-4 space-x-4">
          <button
            onClick={async () => { await supabase.auth.signOut(); window.location.href = '/dashboard/login/'; }}
            className="text-xs text-dark-muted hover:text-brand-danger transition-colors"
          >
            Sign out
          </button>
          <a href="mailto:support@loxymity.com" className="text-xs text-dark-muted hover:text-dark-text transition-colors">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-dark-bg flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-sm">{children}</div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="min-h-dvh bg-dark-bg flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
    </div>
  );
}
