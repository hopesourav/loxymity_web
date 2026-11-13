/**
 * The website's side of buying a circle plan on loxymity.com.
 *
 * Every decision is the server's (app repo: supabase/functions/razorpay-checkout and
 * _shared/webPlan.ts). This file only calls it and words its answers. Check first, then charge:
 * `state`/`check` create nothing; `create` validates again and returns a Razorpay invoice URL;
 * `confirm` asks Razorpay — never the browser — whether it was paid.
 */
import { supabase, SUPABASE_ANON_KEY, SUPABASE_URL } from './client';
import { LEGAL_VERSION } from '../../_components/LegalPage';

export type PlanTier = 'gold' | 'platinum' | 'infinite';
export type PlanPeriod = 'monthly' | 'annual';
export type OrderKind = 'new' | 'upgrade' | 'renew';

export type WebCircle = {
  id: string;
  name: string;
  status: 'eligible' | 'covered_web' | 'covered_store' | 'covered_other' | 'event';
  payerName?: string | null;
  left?: boolean;
};

export type Quote = {
  kind: OrderKind;
  productId: string;
  product: { tier: PlanTier; circles: number; period: PlanPeriod };
  priceInr: number;
  creditInr: number;
  amountInr: number;
  baseOrderId: string | null;
  startsMs: number;
  endsMs: number;
};

export type PriceRow = { product_id: string; tier: PlanTier; circles: number; period: PlanPeriod; web_inr: number; app_inr: number };

export type OrderRow = {
  id: string; product_id: string; kind: OrderKind; status: string;
  amount_inr: number; refund_inr: number | null;
  created_at: string; paid_at: string | null; period_start: string | null; period_end: string | null;
  invoice_url: string | null; open: boolean;
};

export type BillingState = {
  ok: boolean;
  eligible: boolean;
  reasons: string[];
  needs: { age: boolean; terms: boolean };
  termsVersion: string;
  checkoutEnabled: boolean;
  quote: Quote | null;
  circles: WebCircle[];
  storePlan: { productId: string; periodEnd: string | null; sandbox: boolean } | null;
  webPlan: null | {
    productId: string; tier: PlanTier; circles: number; period: PlanPeriod;
    startsAt: string; endsAt: string; inGrace: boolean; renewalPaid: boolean;
    covered: string[]; heldSlots: number; orderId: string;
  };
  discount_pct?: number;
  prices?: PriceRow[];
  orders?: OrderRow[];
  /** What cancelling now would refund under the policy (state only). */
  cancel?: { refundInr: number; orders: { orderId: string; paidInr: number; refundInr: number; keptInr: number; rule: string; used: number }[] };
};

export type Selection = { tier: PlanTier; circles: number; period: PlanPeriod; kind: OrderKind; circle_ids: string[] };

type Answer<T> = { ok: true; data: T } | { ok: false; status: number; data: any };

async function call<T>(action: string, body: Record<string, unknown> = {}): Promise<Answer<T>> {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch(`${SUPABASE_URL}/functions/v1/razorpay-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${session?.access_token ?? SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ action, ...body }),
  });
  const data = await res.json().catch(() => null);
  return res.ok && data?.ok !== false ? { ok: true, data: data as T } : { ok: false, status: res.status, data };
}

export const getBillingState = () => call<BillingState>('state');
export const checkSelection = (sel: Selection) => call<BillingState>('check', sel);
export const createInvoice = (sel: Selection) =>
  call<{ order_id: string; url: string; reused: boolean; amount_inr: number }>('create', sel);
export const confirmOrder = (orderId: string) =>
  call<{ status: string; applied: boolean }>('confirm', { order_id: orderId });
export const coverCircle = (circleId: string) => call<{ covered: string[] }>('cover', { circle_id: circleId });
/** Cancel the web plan now; the server refunds only if the amount still equals what was shown. */
export const cancelPlan = (expectedRefundInr: number) =>
  call<{ refund_inr: number }>('cancel', { expected_refund_inr: expectedRefundInr });

/** The refund policy, in words (the server computes the amounts). */
export const REFUND_POLICY =
  'Monthly plans: the unused days back if you cancel within 7 days of paying. Yearly plans: we keep 3 months, ' +
  'or every month started if that is more, at the monthly price, and refund the rest.';

/** The Terms this site shows are new enough to sell on the web. Until the Terms that mention web
 *  purchases are published (LEGAL_VERSION ≥ the server's), the page must not ask anyone to accept
 *  them — it would record a version the server does not count. */
export function termsPublished(serverVersion: string): boolean {
  return LEGAL_VERSION >= serverVersion;
}

/** Record acceptance of the current Terms/Privacy (and the age answer, if one was just given).
 *  null age = keep what is on record; analytics is never touched here (null keeps it). */
export async function acceptTerms(ageBand: 'adult' | 'minor' | null): Promise<boolean> {
  const { data, error } = await supabase.rpc('record_consent', {
    p_terms_version: LEGAL_VERSION,
    p_privacy_version: LEGAL_VERSION,
    p_age_band: ageBand,
    p_analytics: null,
    p_app_version: 'web',
    p_platform: 'web',
  });
  return !error && (data as any)?.ok === true;
}

const REASONS: Record<string, string> = {
  not_available: 'Buying on the web isn’t open for your account yet.',
  minor: 'Plans can only be bought by adults.',
  store_plan: 'You already have a plan through the App Store or Google Play. Manage it in the Loxymity app.',
  store_check_failed: 'We couldn’t check your existing plans just now. Please try again in a minute.',
  no_profile: 'We couldn’t find your account. Please sign in again.',
  has_plan: 'You already have a plan. Renew or upgrade it instead.',
  already_renewed: 'Your next period is already paid.',
  renewal_waiting: 'Your renewal is already paid — upgrades open once it starts.',
  in_grace: 'Your plan has ended. Renew it to keep your circles covered.',
  at_renewal: 'That change starts when you renew. Choose it under Renew.',
  pick_circle: 'Choose a circle for this plan to cover.',
  too_many_circles: 'That’s more circles than this plan covers.',
  circle_not_eligible: 'One of the chosen circles can’t be covered by you.',
  covered_by_other: 'Someone else already covers one of the chosen circles.',
  not_authorized: 'You’re not a member of one of the chosen circles.',
  event_circle: 'Temporary circles can’t be put on a plan.',
  circle_not_found: 'One of the chosen circles no longer exists.',
  keep_not_covered: 'You can only keep circles your plan covers now.',
  invalid_plan: 'Please choose a plan.',
  paused: 'Buying on the web is paused for a moment. Please try again later.',
  invoice_failed: 'We couldn’t create your invoice. Please try again.',
  order_failed: 'We couldn’t create your invoice. Please try again.',
  not_configured: 'Buying on the web isn’t available yet.',
  plan_full: 'Your plan already covers as many circles as it pays for.',
  not_entitled: 'Your plan isn’t active.',
  nothing_to_refund: 'Under the refund policy nothing is refundable now. Your plan simply ends on its date.',
  quote_changed: 'The refund amount has changed since this page loaded. Please check the new amount.',
  no_plan: 'There is no web plan to cancel.',
};

export function reasonText(reason: string): string {
  return REASONS[reason] ?? 'Something went wrong. Please try again.';
}

/** First reason worth showing (age/Terms are handled by their own step, not as an error). */
export function blockingReason(reasons: string[]): string | null {
  return reasons.find((r) => r !== 'age_required' && r !== 'terms_required') ?? null;
}

export function formatInr(n: number): string {
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

export function formatDay(ms: number | string): string {
  const d = typeof ms === 'string' ? new Date(ms) : new Date(ms);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const TIER_NAME: Record<PlanTier, string> = { gold: 'Gold', platinum: 'Platinum', infinite: 'Infinite' };

export function planName(p: { tier: PlanTier; circles: number; period: PlanPeriod }): string {
  return `${TIER_NAME[p.tier]} · ${p.circles} circle${p.circles === 1 ? '' : 's'} · ${p.period === 'annual' ? 'yearly' : 'monthly'}`;
}

export function productParts(productId: string): { tier: PlanTier; circles: number; period: PlanPeriod } | null {
  const m = /^loxymity_(gold|platinum|infinite)_(?:([23])c_)?(monthly|annual)/.exec(productId);
  return m ? { tier: m[1] as PlanTier, circles: m[2] ? Number(m[2]) : 1, period: m[3] as PlanPeriod } : null;
}
