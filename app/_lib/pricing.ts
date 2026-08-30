/**
 * Single source of truth for published plan prices on the web.
 *
 * Shared by the marketing pricing grid (`_components/PricingCards.tsx`) and the
 * dashboard checkout (`dashboard/(auth)/upgrade/page.tsx`). They MUST read the
 * same table: a checkout that quotes a different figure from the page that sold
 * it is the exact drift this whole pricing pass exists to remove.
 *
 * Annual totals are the headline x 12 EXACTLY — see the note on PLANS below.
 */
export type Currency = 'USD' | 'INR';

/** Server plan id. `null` for Free, which is not purchasable. */
export type PlanId = 'gold' | 'platinum' | 'infinite';

export type Plan = {
  /** Matches `tier_limits.tier` and the `p_plan_id` argument of the checkout
   *  RPCs. Null on Free so it can't be routed to a purchase path. */
  id: PlanId | null;
  name: string;
  price: string;
  cadence: string;
  cta: string;
  features: string[];
  annualSave?: string;
  annualTotal?: string;
  trueMonthly?: string;
  highlight?: boolean;
  badge?: string;
};

// Annual totals are the headline x 12 EXACTLY. A total that divided to, say,
// $4.99083 would make the displayed monthly figure an understatement, which both
// stores and consumer law treat as misleading.
// Infinite is $13.99 / ₹549 rather than $14.99 / ₹599 deliberately: those are
// Platinum's TRUE MONTHLY prices, so the two tiers would show the same number on
// one page. ₹549 also buys the strongest line here — Infinite works out cheaper
// per month than Platinum billed monthly.
export const PLANS: Record<Currency, Plan[]> = {
  USD: [
    {
      id: null, name: 'Free', price: '$0', cadence: 'Forever free — no card required', cta: 'Start free',
      features: [
        'Up to 5 members', '2 days location history', '2 geofences',
        'Real-time shared map', 'SOS emergency alerts',
        'Safety check-in & activity feed', 'WhatsApp & Alexa queries (10/mo)',
      ],
    },
    {
      id: 'gold', name: 'Gold', price: '$4.99', cadence: 'per month, billed annually',
      annualSave: '38%', annualTotal: '$59.88', trueMonthly: '$7.99', cta: 'Get Gold',
      features: [
        'Everything in Free, plus:', 'Up to 10 members', '30 days location history',
        'In-app voice calls (billed per minute)', 'Arrival & departure alerts', 'Member battery status',
        'Browser share links · 1 iBeacon token',
      ],
    },
    {
      id: 'platinum', name: 'Platinum', price: '$9.99', cadence: 'per month, billed annually',
      annualSave: '33%', annualTotal: '$119.88', trueMonthly: '$14.99',
      cta: 'Start 7-day free trial', highlight: true, badge: 'Most popular',
      features: [
        'Everything in Gold, plus:', 'Up to 15 members', '90 days location history',
        'In-app voice & video calls (billed per minute)', 'Street View on any pin',
        'Driving reports & auto check-ins', 'WhatsApp & Alexa queries (30/day) · 20 beacons',
      ],
    },
    {
      id: 'infinite', name: 'Infinite', price: '$13.99', cadence: 'per month, billed annually',
      annualSave: '30%', annualTotal: '$167.88', trueMonthly: '$19.99', cta: 'Go Infinite',
      features: [
        'Everything in Platinum, plus:', 'Up to 15 members', '180 days location history',
        'Privacy Shield — see who viewed you', 'Location blur & ghost mode',
        'Retention control & data export', 'Priority support',
      ],
    },
  ],
  INR: [
    {
      id: null, name: 'Free', price: '₹0', cadence: 'Forever free — no card required', cta: 'Start free',
      features: [
        'Up to 5 members', '2 days location history', '2 geofences',
        'Real-time shared map', 'SOS emergency alerts',
        'Safety check-in & activity feed', 'WhatsApp & Alexa queries (10/mo)',
      ],
    },
    {
      id: 'gold', name: 'Gold', price: '₹199', cadence: 'per month, billed annually',
      annualSave: '33%', annualTotal: '₹2,388', trueMonthly: '₹299', cta: 'Get Gold',
      features: [
        'Everything in Free, plus:', 'Up to 10 members', '30 days location history',
        'In-app voice calls (billed per minute)', 'Arrival & departure alerts', 'Member battery status',
        'Browser share links · 1 iBeacon token',
      ],
    },
    {
      id: 'platinum', name: 'Platinum', price: '₹399', cadence: 'per month, billed annually',
      annualSave: '33%', annualTotal: '₹4,788', trueMonthly: '₹599',
      cta: 'Start 7-day free trial', highlight: true, badge: 'Most popular',
      features: [
        'Everything in Gold, plus:', 'Up to 15 members', '90 days location history',
        'In-app voice & video calls (billed per minute)', 'Street View on any pin',
        'Driving reports & auto check-ins', 'WhatsApp & Alexa queries (30/day) · 20 beacons',
      ],
    },
    {
      id: 'infinite', name: 'Infinite', price: '₹549', cadence: 'per month, billed annually',
      annualSave: '31%', annualTotal: '₹6,588', trueMonthly: '₹799', cta: 'Go Infinite',
      features: [
        'Everything in Platinum, plus:', 'Up to 15 members', '180 days location history',
        'Privacy Shield — see who viewed you', 'Location blur & ghost mode',
        'Retention control & data export', 'Priority support',
      ],
    },
  ],
};

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

