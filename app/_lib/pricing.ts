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
 * page (`dashboard/(auth)/plan/page.tsx`), so the two can never quote different figures.
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

/** Plans bought on loxymity.com (Razorpay, INR only, prepaid) cost this much less than in the app.
 *  Same formula as planCatalog.webPriceInr in the app repo; the server's quote is what is charged,
 *  this is for display. */
export const WEB_DISCOUNT_PCT = 5;

export function webPriceInr(tier: PlanId, circles: number, period: Period): number {
  return Math.round((planPrice(tier, circles, period, 'INR') * (100 - WEB_DISCOUNT_PCT)) / 100);
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

/** The largest whole-percent saving of yearly over monthly among the paid tiers, for the billing
 *  toggle's "Yearly saves up to N%" — "up to" because the saving differs by tier and currency. */
export function maxAnnualSaving(circles: number, currency: Currency): number {
  return Math.max(...PLAN_TIERS.map((t) => annualSaving(t, circles, currency)));
}

export type PlanCard = {
  id: PlanId | null;
  name: string;
  /** One line under the name. Also shown by the dashboard's PlanPicker. */
  tagline: string;
  /** Exactly four lines, in the SAME order on every card (people · history · places · the tier's
   *  headline feature), so the cards read across as rows. Everything else is in COMPARE_ROWS. */
  features: string[];
  highlight?: boolean;
  badge?: string;
};

/**
 * What each plan adds over the one below it. Mirrors the app's paywall (`app/(main)/circle-plan.tsx`
 * PLAN_CARDS), Plans & billing (`membership.tsx`) and the live `tier_limits` values (members
 * 5/10/15/15, history 2/30/90/180 days, places 2/10/50/100, temporary circles 1/5/5/5 at a time —
 * free ones last up to 24 hours, a plan allows one of up to 30 days (live 2026-11-02:
 * temp_circle_rules_enabled is off, so the count is 5; if scripts/temp_circles/rules-on.sql runs it
 * becomes 2 — change this copy with it) — Street View 5/10/30/60 a month, assistant questions
 * 10/100/300/300 a month, voice calls none/unlimited/unlimited/unlimited, video minutes 0/0/60/100).
 *
 * Flights: NOT advertised as capped (E2E 2026-11-02, D-10) — the server counts them but never
 * refuses (no metering_enforced.flightsTracked), so the 20/40 figures promised a limit nobody hit.
 * Places and Vault are the PAYER's own — never "everyone in a covered circle gets places" (D-2/D-6).
 * Data export is free for everyone (export_my_data) — never an Infinite feature (D-3).
 *
 * Voice calls are paid from 2026-10-19 (migration 0290): placing one needs Gold or a covered
 * circle. Answering is free, and anyone may call during the hour after an SOS.
 * Deliberately NOT sold here (audit 2026-10-17):
 *  - SOS, crash checks, battery level and share links — free for everyone, nothing gates them;
 *  - beacons — the screens exist but automatic beacon reporting is off and no hardware ships;
 *  - location blur — it is applied on the viewer's phone, so it must never read as "hidden".
 * "Ghost mode" is Privacy Shield's ghost mode; pausing your own sharing is free on every plan.
 * The web dashboard follows the payer's own plan (`hasDashboardAccess`), not circle coverage.
 *
 * Layout (2026-11-19, "less cluttered pricing"): the cards carry four aligned lines each; every
 * other figure lives once, in COMPARE_ROWS (the "Compare all plans" table). The badge says
 * "Recommended", not "Most popular" — a popularity claim needs sales data to back it.
 */
export const PLAN_CARDS: PlanCard[] = [
  {
    id: null,
    name: 'Free',
    tagline: 'Everything you need to start',
    features: [
      `${FREE_CIRCLES} circles, up to 5 people each`,
      '2 days of history',
      '2 places with alerts',
      'SOS, crash check & chat',
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    tagline: 'Everything in Free, for bigger families',
    features: [
      'Up to 10 people per circle',
      '30 days of history',
      '10 places with alerts',
      'Unlimited voice calls',
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    tagline: 'Everything in Gold, plus driving reports',
    highlight: true,
    badge: 'Recommended',
    features: [
      'Up to 15 people per circle',
      '90 days of history',
      '50 places with alerts',
      'Driving reports & video calls',
    ],
  },
  {
    id: 'infinite',
    name: 'Infinite',
    tagline: 'Everything in Platinum, plus privacy control',
    features: [
      'Up to 15 people per circle',
      '180 days of history',
      '100 places with alerts',
      'Ghost mode & Privacy Shield',
    ],
  },
];

/** A cell of the comparison table: text, or true (included) / false (not included). */
export type CompareCell = string | boolean;

/**
 * "Compare all plans": every figure the old cards listed, once, in one table (Free · Gold ·
 * Platinum · Infinite). Same sources and rules as PLAN_CARDS above — change both together.
 * `payer` rows come with the plan for the person who pays, not for every member (D-2/D-6).
 */
export const COMPARE_ROWS: { label: string; payer?: boolean; values: [CompareCell, CompareCell, CompareCell, CompareCell] }[] = [
  { label: 'People in each circle', values: ['5', '10', '15', '15'] },
  { label: 'Location history', values: ['2 days', '30 days', '90 days', '180 days'] },
  { label: 'Places with arrival & leave alerts', payer: true, values: ['2', '10', '50', '100'] },
  {
    label: `Temporary circles at a time (up to ${EVENT_CIRCLE_MEMBERS} people)`,
    values: ['1 · up to 24 hours', '5 · one up to 30 days', '5 · one up to 30 days', '5 · one up to 30 days'],
  },
  { label: 'Live map, SOS, crash check, chat & share links', values: [true, true, true, true] },
  { label: 'Voice calls', values: ['Answer only', 'Unlimited', 'Unlimited', 'Unlimited'] },
  { label: 'Video calls', values: [false, false, '60 min a month', '100 min a month'] },
  { label: 'Driving reports & road smoothness', values: [false, false, true, true] },
  { label: 'Street View', values: ['5 a month', '10 a month', '30 a month', '60 a month'] },
  { label: 'Questions to Loxy, the assistant', values: ['10 a month', '100 a month', '300 a month', '300 a month'] },
  { label: 'Ghost mode, Privacy Shield & automatic history clean-up', values: [false, false, false, true] },
  { label: 'Vault backup', payer: true, values: [false, true, true, true] },
  { label: 'Web dashboard', payer: true, values: [false, true, true, true] },
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
