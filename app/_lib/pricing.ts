/**
 * Published plan prices and plan contents.
 *
 * PRICES come from `catalog.generated.ts`, which the app repo writes from its ONE catalogue
 * (`supabase/functions/_shared/planCatalog.ts`) with `scripts/web/website-catalog.mjs`, and checks
 * with `__tests__/websiteCatalogParity.test.ts`. Never type a price here: change the catalogue,
 * regenerate, commit the generated file. Every figure in it is final, so this file only looks up.
 *
 * THE MODEL (plan v6.3, prices of 2026-10-19 at Life360 parity): a plan is tier × circles × period.
 * Gold, Platinum or Infinite, covering 1, 2 or 3 circles, billed monthly or annually. Each circle
 * beyond the first costs one flat amount at every tier. Everyone also has 2 free circles; covered
 * circles come on top. USD, INR, EUR and GBP are set exactly in both stores; any other country pays
 * the store's conversion of the US price, so the site shows USD there.
 *
 * DISPLAY RULE: lead with the amount actually billed ("$143.99 / year"). The per-month figure of an
 * annual plan sits directly underneath, smaller ("≈ $11.99/mo, billed yearly") — App Store 3.1.2,
 * Play's subscription policy, California's auto-renewal law, the EU's Canal Digital ruling and the
 * UK's CMA209 all treat an annual plan headlined by its monthly equivalent as misleading. The
 * per-month figure is rounded DOWN (it ends in .99), so "≈" stays on it.
 *
 * Shared by the marketing pricing grid (`_components/PricingCards.tsx`) and the dashboard plan
 * page (`dashboard/(auth)/upgrade/page.tsx`), so the two can never quote different figures.
 */
import { CATALOG } from './catalog.generated';

export type Currency = 'USD' | 'INR' | 'EUR' | 'GBP';
export type PlanId = 'gold' | 'platinum' | 'infinite';
export type Period = 'monthly' | 'annual';

type Money = Record<Currency, number>;
type Row = { monthly: Money; annual: Money; perMonthOfAnnual: Money; annualSavingPct: Money };

export const PLAN_TIERS: readonly PlanId[] = ['gold', 'platinum', 'infinite'];
export const MAX_CIRCLES: number = CATALOG.maxCircles;
/** Uncovered permanent circles anyone may own. */
export const FREE_CIRCLES: number = CATALOG.freeCircles;
/** Members of a temporary (event) circle, for everyone. Never covered by a plan. */
export const EVENT_CIRCLE_MEMBERS: number = CATALOG.eventCircleMembers;
/** The store's trial: 7 days, once per store account, on this product only. */
export const TRIAL = CATALOG.storeTrial as { tier: PlanId; circles: number; period: Period; days: number };

/** Each circle beyond the first, at every tier. */
export const EXTRA_CIRCLE_PRICE = CATALOG.extraCirclePrice as Record<Period, Money>;

export const CURRENCY_OPTIONS: { value: Currency; label: string }[] = [
  { value: 'USD', label: '$ USD' },
  { value: 'INR', label: '₹ INR' },
  { value: 'EUR', label: '€ EUR' },
  { value: 'GBP', label: '£ GBP' },
];

function row(tier: PlanId, circles: number): Row {
  return (CATALOG.prices as unknown as Record<PlanId, Record<string, Row>>)[tier][String(circles)];
}

/** What the store charges for this plan, in this currency. */
export function planPrice(tier: PlanId, circles: number, period: Period, currency: Currency): number {
  return row(tier, circles)[period][currency];
}

/** The per-month figure of the ANNUAL plan, already rounded down ("$11.99"). Show it only under the
 *  billed amount, never instead of it. */
export function perMonthOfAnnual(tier: PlanId, circles: number, currency: Currency): string {
  return formatPrice(row(tier, circles).perMonthOfAnnual[currency], currency);
}

/** Whole-percent saving of annual over twelve monthly payments, rounded down. */
export function annualSaving(tier: PlanId, circles: number, currency: Currency): number {
  return row(tier, circles).annualSavingPct[currency];
}

const LOCALE: Record<Currency, string> = { USD: 'en-US', INR: 'en-IN', EUR: 'en-IE', GBP: 'en-GB' };

/** "$95.99", "₹2,999", "€59.99", "£71.99"; whole amounts without decimals ("$4", "€3"). */
export function formatPrice(amount: number, currency: Currency): string {
  const whole = currency === 'INR' || Number.isInteger(amount);
  return new Intl.NumberFormat(LOCALE[currency], {
    style: 'currency',
    currency,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(amount);
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
 * PLAN_CARDS), Plans & billing (`membership.tsx`) and the live `tier_limits` values (members
 * 5/10/15/15, history 2/30/90/180 days, places 2/10/50/100, temporary circles 1/2/2/2 — free ones
 * last up to 24 hours, a plan allows one of up to 30 days (app migration 0296) — Street View
 * 5/10/30/60 a month, assistant questions 10/100/300/300 a month, flights 20/40/unlimited/unlimited
 * a month, voice calls none/unlimited/unlimited/unlimited, video minutes 0/0/60/100 a month).
 *
 * Voice calls are paid from 2026-10-19 (migration 0290): placing one needs Gold or a covered
 * circle. Answering is free, and anyone may call during the hour after an SOS.
 * Deliberately NOT sold here (audit 2026-10-17):
 *  - SOS, crash checks, battery level and share links — free for everyone, nothing gates them;
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
      'Live map, a loud SOS & crash check',
      'Circle chat and one-tap “Arrived safely”',
      'Today’s and yesterday’s history',
      '2 places with arrival & leave alerts',
      `1 temporary circle of up to ${EVENT_CIRCLE_MEMBERS} people, for up to 24 hours`,
      'Battery level & live share links for people without the app',
      'Street View 5 · assistant 10 · flights 20 a month',
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    tagline: 'Everything in Free, for bigger families',
    features: [
      'Unlimited voice calls',
      'Up to 10 members in each covered circle',
      '30 days of location history',
      '10 places with arrival & leave alerts',
      '2 temporary circles, one lasting up to 30 days',
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

/** Timezone beats navigator.language here: a phone set to en-GB but sitting in Kolkata should see
 *  rupees, and IANA zone names are stable where locale tags are not. Same zone lists as the app's
 *  `currencyForTimeZone`. Wrapped because Intl can throw in hardened browser configs. */
export function detectCurrency(): Currency {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    for (const c of ['INR', 'GBP', 'EUR'] as const) {
      if ((CATALOG.zones[c] as readonly string[]).includes(tz)) return c;
    }
  } catch { /* fall through to USD */ }
  return 'USD';
}
