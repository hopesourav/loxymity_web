'use client';

/**
 * Pricing grid with geo-detected currency.
 *
 * WHY THIS IS A CLIENT COMPONENT, and why USD is the SSG default:
 * the site is a STATIC EXPORT (next.config.ts `output: 'export'`), so page.tsx
 * is prerendered once at build time and served from a CDN. Choosing a currency
 * during render would bake ONE region's prices into the HTML that every visitor
 * receives — an Indian visitor would see USD, or worse, a US visitor would see
 * INR depending on which build ran last. Detection therefore has to happen after
 * hydration, on the visitor's own device, with USD as the statically-safe
 * default so the cached HTML is always valid.
 *
 * The manual switcher is not decoration: timezone detection fails for VPN users
 * and travellers, so there has to be a way to correct it that does not involve
 * changing device settings.
 */
import { useEffect, useState } from 'react';

type Currency = 'USD' | 'INR';

type Plan = {
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
const PLANS: Record<Currency, Plan[]> = {
  USD: [
    {
      name: 'Free', price: '$0', cadence: 'Forever free — no card required', cta: 'Start free',
      features: [
        'Up to 5 members', '2 days location history', '2 geofences',
        'Real-time shared map', 'SOS emergency alerts',
        'Safety check-in & activity feed', 'WhatsApp & Alexa queries (10/mo)',
      ],
    },
    {
      name: 'Gold', price: '$4.99', cadence: 'per month, billed annually',
      annualSave: '38%', annualTotal: '$59.88', trueMonthly: '$7.99', cta: 'Get Gold',
      features: [
        'Everything in Free, plus:', 'Up to 10 members', '30 days location history',
        'In-app voice calls', 'Arrival & departure alerts', 'Member battery status',
        'Browser share links · 1 iBeacon token',
      ],
    },
    {
      name: 'Platinum', price: '$9.99', cadence: 'per month, billed annually',
      annualSave: '33%', annualTotal: '$119.88', trueMonthly: '$14.99',
      cta: 'Start 7-day free trial', highlight: true, badge: 'Most popular',
      features: [
        'Everything in Gold, plus:', 'Up to 15 members', '90 days location history',
        'In-app voice & video calls', 'Street View on any pin',
        'Driving reports & auto check-ins', 'WhatsApp & Alexa queries (30/day) · 20 beacons',
      ],
    },
    {
      name: 'Infinite', price: '$13.99', cadence: 'per month, billed annually',
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
      name: 'Free', price: '₹0', cadence: 'Forever free — no card required', cta: 'Start free',
      features: [
        'Up to 5 members', '2 days location history', '2 geofences',
        'Real-time shared map', 'SOS emergency alerts',
        'Safety check-in & activity feed', 'WhatsApp & Alexa queries (10/mo)',
      ],
    },
    {
      name: 'Gold', price: '₹199', cadence: 'per month, billed annually',
      annualSave: '33%', annualTotal: '₹2,388', trueMonthly: '₹299', cta: 'Get Gold',
      features: [
        'Everything in Free, plus:', 'Up to 10 members', '30 days location history',
        'In-app voice calls', 'Arrival & departure alerts', 'Member battery status',
        'Browser share links · 1 iBeacon token',
      ],
    },
    {
      name: 'Platinum', price: '₹399', cadence: 'per month, billed annually',
      annualSave: '33%', annualTotal: '₹4,788', trueMonthly: '₹599',
      cta: 'Start 7-day free trial', highlight: true, badge: 'Most popular',
      features: [
        'Everything in Gold, plus:', 'Up to 15 members', '90 days location history',
        'In-app voice & video calls', 'Street View on any pin',
        'Driving reports & auto check-ins', 'WhatsApp & Alexa queries (30/day) · 20 beacons',
      ],
    },
    {
      name: 'Infinite', price: '₹549', cadence: 'per month, billed annually',
      annualSave: '31%', annualTotal: '₹6,588', trueMonthly: '₹799', cta: 'Go Infinite',
      features: [
        'Everything in Platinum, plus:', 'Up to 15 members', '180 days location history',
        'Privacy Shield — see who viewed you', 'Location blur & ghost mode',
        'Retention control & data export', 'Priority support',
      ],
    },
  ],
};

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-brand-success flex-shrink-0" fill="none" viewBox="0 0 24 24"
         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

/** Timezone beats navigator.language here: a phone set to en-GB but sitting in
 *  Kolkata should see rupees, and IANA zone names are stable where locale tags
 *  are not. Wrapped because Intl can throw in hardened browser configs. */
function detectCurrency(): Currency {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') return 'INR';
  } catch { /* fall through to USD */ }
  return 'USD';
}

export default function PricingCards() {
  // USD on the server AND on the first client render, so hydration matches the
  // prerendered HTML. The switch happens in an effect, one frame later.
  const [currency, setCurrency] = useState<Currency>('USD');

  useEffect(() => { setCurrency(detectCurrency()); }, []);

  return (
    <>
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-full border border-dark-border p-1 bg-dark-surface">
          {(['USD', 'INR'] as Currency[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCurrency(c)}
              aria-pressed={currency === c}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                currency === c ? 'bg-primary text-dark-bg' : 'text-dark-muted hover:text-dark-text'
              }`}
            >
              {c === 'USD' ? '$ USD' : '₹ INR'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {PLANS[currency].map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-3xl p-7 lift ${
              plan.highlight
                ? 'card-premium border-2 border-primary/50 lg:scale-[1.04] z-10 isolate'
                : 'card-premium gradient-border'
            }`}
            style={plan.highlight ? { boxShadow: '0 30px 80px -20px rgba(201,162,39,0.38), 0 0 0 1px rgba(201,162,39,0.28)' } : undefined}
          >
            {plan.highlight && (
              <div className="absolute -inset-px rounded-3xl pointer-events-none animate-halo -z-10" aria-hidden="true" style={{ background: 'radial-gradient(120% 60% at 50% 0%, rgba(201,162,39,0.14), transparent 60%)' }} />
            )}
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-dark-bg text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full shadow-lg">
                {plan.badge}
              </div>
            )}
            <p className="font-hud uppercase tracking-wide text-sm font-semibold text-dark-muted mb-2">{plan.name}</p>
            <p className="flex items-baseline gap-1 mb-1">
              <span className={`font-display font-bold text-dark-text ${plan.name === 'Free' ? 'text-5xl font-black' : 'text-4xl'}`}>{plan.price}</span>
              {plan.name !== 'Free' && <span className="text-dark-muted text-sm">/mo</span>}
            </p>
            <p className="text-dark-muted text-xs mb-3">{plan.cadence}</p>
            {plan.annualTotal ? (
              <div className="rounded-lg bg-brand-success/8 border border-brand-success/20 px-2.5 py-2 mb-4">
                <p className="text-brand-success text-xs font-bold leading-tight">
                  Save {plan.annualSave} vs monthly
                </p>
                <p className="text-dark-muted text-[10px] mt-0.5">Billed annually — {plan.annualTotal}/year</p>
                <p className="text-dark-muted text-[10px] mt-0.5">Prefer monthly? {plan.trueMonthly}/month</p>
              </div>
            ) : (
              <div className="mb-4" />
            )}
            <div className="inline-flex items-center gap-1.5 self-start bg-brand-success/10 border border-brand-success/25 text-brand-success text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full mb-6">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 0h10.5a2.25 2.25 0 012.25 2.25v6.75a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25v-6.75a2.25 2.25 0 012.25-2.25z" /></svg>
              Location data — never sold
            </div>
            <ul className="flex flex-col gap-2.5 mb-8 flex-1">
              {plan.features.map((f, i) => (
                <li key={f} className={`flex items-start gap-2.5 text-sm ${i === 0 && plan.name !== 'Free' ? 'text-dark-text font-semibold' : 'text-dark-muted'}`}>
                  {!(i === 0 && plan.name !== 'Free') && <span className="mt-0.5"><CheckIcon /></span>}
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#download"
              className={`block text-center font-semibold px-6 py-3 rounded-xl transition-colors ${
                plan.highlight
                  ? 'bg-primary hover:bg-primary-dark text-dark-bg font-bold'
                  : 'bg-dark-border hover:bg-[#333944] text-dark-text'
              }`}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
