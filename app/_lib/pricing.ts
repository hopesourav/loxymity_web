/**
 * Published plan prices and plan contents — the website's copy of the app's catalogue.
 *
 * SOURCE OF TRUTH: the app repo's `supabase/functions/_shared/planCatalog.ts` (prices frozen
 * 2026-10-14, identical on the App Store and Google Play, US + India verified live) and the
 * live `tier_limits` table. This file cannot import across repos, so the numbers are copied.
 * Change a price here only after it has changed there and in both stores.
 *
 * THE MODEL (plan v6.3): a plan is tier × circles × period. Gold, Platinum or Infinite, covering
 * 1, 2 or 3 circles, billed monthly or annually. Each circle beyond the first costs one flat
 * amount at every tier. Everyone also has 2 free circles; covered circles come on top.
 *
 * DISPLAY RULE: lead with the amount actually billed ("$59.99 / year"). A per-month figure for
 * an annual plan is shown only as a smaller "about … a month" line, rounded UP so it never
 * understates — App Store 3.1.2, Play's subscription policy and consumer law all treat an
 * annual plan headlined by its monthly equivalent as misleading.
 *
 * Shared by the marketing pricing grid (`_components/PricingCards.tsx`) and the dashboard plan
 * page (`dashboard/(auth)/upgrade/page.tsx`), so the two can never quote different figures.
 */
export type Currency = 'USD' | 'INR';
export type PlanId = 'gold' | 'platinum' | 'infinite';
export type Period = 'monthly' | 'annual';

type Money = Record<Currency, number>;

export const PLAN_TIERS: readonly PlanId[] = ['gold', 'platinum', 'infinite'];
export const MAX_CIRCLES = 3;
/** Uncovered permanent circles anyone may own. */
export const FREE_CIRCLES = 2;
/** Members of a temporary (event) circle, for everyone. Never covered by a plan. */
export const EVENT_CIRCLE_MEMBERS = 15;
/** The one trial: 7 days, once per store account, on this product only. */
export const TRIAL = { tier: 'platinum' as PlanId, circles: 1, period: 'annual' as Period, days: 7 };

/** 1-circle prices. */
const BASE_PRICES: Record<PlanId, Record<Period, Money>> = {
  gold:     { monthly: { INR: 299, USD: 7.99 },  annual: { INR: 2399, USD: 59.99 } },
  platinum: { monthly: { INR: 599, USD: 14.99 }, annual: { INR: 4799, USD: 119.99 } },
  infinite: { monthly: { INR: 799, USD: 19.99 }, annual: { INR: 6599, USD: 169.99 } },
};

/** Each circle beyond the first, at every tier. */
export const EXTRA_CIRCLE_PRICE: Record<Period, Money> = {
  monthly: { INR: 150, USD: 3.99 },
  annual:  { INR: 1500, USD: 29.99 },
};

/** Same formula as planCatalog.planPrice: USD sums land a cent under a store point (7.99 + 3.99
 *  = 11.98) and round up to the .99 the stores sell; INR is the plain sum. */
export function planPrice(tier: PlanId, circles: number, period: Period, currency: Currency): number {
  const base = BASE_PRICES[tier][period][currency];
  const n = circles - 1;
  if (n === 0) return base;
  const extra = EXTRA_CIRCLE_PRICE[period][currency];
  if (currency === 'INR') return base + extra * n;
  return Math.round((Math.ceil(base + extra * n) - 0.01) * 100) / 100;
}

export function formatPrice(amount: number, currency: Currency): string {
  if (currency === 'INR') return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  return `$${amount.toFixed(2)}`;
}

/** "about $5.00 a month" for an annual price — rounded up, never down. */
export function perMonthOfAnnual(annual: number, currency: Currency): string {
  const monthly = currency === 'INR' ? Math.ceil(annual / 12) : Math.ceil((annual / 12) * 100) / 100;
  return formatPrice(monthly, currency);
}

/** Whole-percent saving of annual over twelve monthly payments, rounded down. */
export function annualSaving(tier: PlanId, circles: number, currency: Currency): number {
  const monthly12 = planPrice(tier, circles, 'monthly', currency) * 12;
  const annual = planPrice(tier, circles, 'annual', currency);
  return Math.floor((1 - annual / monthly12) * 100);
}

export type PlanCard = {
  id: PlanId | null;
  name: string;
  tagline: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
};

/**
 * What each plan adds over the one below it. Mirrors the app's paywall (`app/(main)/circle-plan.tsx`
 * PLAN_CARDS) and the live `tier_limits` values (members 5/10/15/15, history 2/30/90/180 days,
 * places 2/10/50/100, temporary circles 1/5/5/5, Street View 5/10/30/60 a month, assistant
 * questions 10/100/300/300 a month, flights 20/40/unlimited/unlimited a month, video minutes
 * 0/0/60/100 a month).
 *
 * Deliberately NOT sold here (audit 2026-10-17):
 *  - calls, SOS, crash checks and share links — free for everyone, nothing gates them;
 *  - beacons — the screens exist but automatic beacon reporting is off and no hardware ships;
 *  - location blur — it is applied on the viewer's phone, so it must never read as "hidden".
 * "Ghost mode" is Privacy Shield's ghost mode; pausing your own sharing is free on every plan.
 * The web dashboard follows the payer's own plan (`hasDashboardAccess`), not circle coverage.
 */
export const PLAN_CARDS: PlanCard[] = [
  {
    id: null,
    name: 'Free',
    tagline: 'Everything you need to start',
    features: [
      `${FREE_CIRCLES} circles of up to 5 people each`,
      'Live map, SOS, crash check & voice calls',
      'Circle chat and one-tap “Arrived safely”',
      'Today’s and yesterday’s history',
      '2 places with arrival & leave alerts',
      `1 temporary circle (up to ${EVENT_CIRCLE_MEMBERS} people)`,
      'Live share links for people without the app',
      'Street View 5 · assistant 10 · flights 20 a month',
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    tagline: 'Everything in Free, for bigger families',
    features: [
      'Up to 10 members in each covered circle',
      '30 days of location history',
      '10 places with arrival & leave alerts',
      '5 temporary circles at a time',
      'Street View 10 · assistant 100 · flights 40 a month',
      'Web dashboard for the person who pays',
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    tagline: 'Everything in Gold, plus the full toolkit',
    highlight: true,
    badge: 'Most popular',
    features: [
      'Up to 15 members in each covered circle',
      '90 days of location history',
      'Driving reports & road smoothness',
      '50 places with arrival & leave alerts',
      'Video calls — 60 minutes a month',
      'Street View 30 · assistant 300 · unlimited flights',
    ],
  },
  {
    id: 'infinite',
    name: 'Infinite',
    tagline: 'Everything in Platinum, plus privacy control',
    features: [
      '180 days of location history',
      '100 places with arrival & leave alerts',
      'Privacy Shield — see who viewed your location',
      'Ghost mode and automatic history clean-up',
      'Instant export of your data',
      'Video calls — 100 minutes a month',
      'Street View 60 a month',
    ],
  },
];

/** Timezone beats navigator.language here: a phone set to en-GB but sitting in
 *  Kolkata should see rupees, and IANA zone names are stable where locale tags
 *  are not. Wrapped because Intl can throw in hardened browser configs. */
export function detectCurrency(): Currency {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') return 'INR';
  } catch { /* fall through to USD */ }
  return 'USD';
}
