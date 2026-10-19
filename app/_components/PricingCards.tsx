'use client';

/**
 * Pricing grid: currency × billing period × circles covered.
 *
 * WHY THIS IS A CLIENT COMPONENT, and why USD is the SSG default:
 * the site is a STATIC EXPORT (next.config.ts `output: 'export'`), so page.tsx
 * is prerendered once at build time and served from a CDN. Choosing a currency
 * during render would bake ONE region's prices into the HTML that every visitor
 * receives. Detection therefore happens after hydration, on the visitor's own
 * device, with USD as the statically-safe default.
 *
 * The manual currency switch is not decoration: timezone detection fails for VPN
 * users and travellers.
 *
 * The circles selector exists because the circle count is part of the plan (one
 * subscription covers 1–3 circles), exactly as on the in-app paywall. Prices come
 * from `_lib/pricing.ts`, which reads the catalogue generated from the app's.
 *
 * An annual card leads with the BILLED amount; the "≈ …/mo, billed yearly" line sits right under
 * it in the price colour but smaller (see the display rule in `_lib/pricing.ts`).
 */
import { useEffect, useState } from 'react';
import {
  PLAN_CARDS, MAX_CIRCLES, FREE_CIRCLES, EXTRA_CIRCLE_PRICE, TRIAL, CURRENCY_OPTIONS,
  annualSaving, detectCurrency, formatPrice, perMonthOfAnnual, planPrice,
  type Currency, type Period,
} from '../_lib/pricing';

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-brand-success flex-shrink-0" fill="none" viewBox="0 0 24 24"
         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function Segmented<T extends string | number>({ label, value, options, onChange }: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[11px] font-hud uppercase tracking-wide text-dark-muted">{label}</span>
      <div className="inline-flex rounded-full border border-dark-border p-1 bg-dark-surface" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={value === o.value}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              value === o.value ? 'bg-primary text-dark-bg' : 'text-dark-muted hover:text-dark-text'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PricingCards() {
  // USD on the server AND on the first client render, so hydration matches the
  // prerendered HTML. The switch happens in an effect, one frame later.
  const [currency, setCurrency] = useState<Currency>('USD');
  const [period, setPeriod] = useState<Period>('annual');
  const [circles, setCircles] = useState(1);

  useEffect(() => { setCurrency(detectCurrency()); }, []);

  const extra = formatPrice(EXTRA_CIRCLE_PRICE[period][currency], currency);
  const per = period === 'annual' ? 'year' : 'month';

  return (
    <>
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10">
        <Segmented
          label="Currency"
          value={currency}
          onChange={setCurrency}
          options={CURRENCY_OPTIONS}
        />
        <Segmented
          label="Billing"
          value={period}
          onChange={setPeriod}
          options={[{ value: 'annual', label: 'Annual' }, { value: 'monthly', label: 'Monthly' }]}
        />
        <Segmented
          label="Circles on the plan"
          value={circles}
          onChange={setCircles}
          options={Array.from({ length: MAX_CIRCLES }, (_, i) => ({ value: i + 1, label: String(i + 1) }))}
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {PLAN_CARDS.map((plan) => {
          const price = plan.id ? planPrice(plan.id, circles, period, currency) : 0;
          const saving = plan.id ? annualSaving(plan.id, circles, currency) : 0;
          const trial = plan.id === TRIAL.tier && period === TRIAL.period && circles === TRIAL.circles;
          return (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl p-7 lift ${
                plan.highlight
                  ? 'card-premium border-2 border-primary/50 lg:scale-[1.04] z-10 isolate'
                  : 'card-premium gradient-border'
              }`}
              style={plan.highlight ? { boxShadow: '0 30px 80px -20px rgba(201,162,39,0.38), 0 0 0 1px rgba(201,162,39,0.28)' } : undefined}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-dark-bg text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full shadow-lg">
                  {plan.badge}
                </div>
              )}
              <p className="font-hud uppercase tracking-wide text-sm font-semibold text-dark-muted mb-1">{plan.name}</p>
              <p className="text-dark-muted text-xs mb-3">{plan.tagline}</p>

              {plan.id ? (
                <>
                  <p className="flex items-baseline gap-1 mb-1">
                    <span className="font-display font-bold text-dark-text text-4xl">{formatPrice(price, currency)}</span>
                    <span className="text-dark-muted text-sm">/ {per}</span>
                  </p>
                  {period === 'annual' && (
                    <p className="text-dark-text text-lg font-semibold leading-snug">
                      ≈ {perMonthOfAnnual(plan.id, circles, currency)}/mo
                      <span className="text-dark-muted text-sm font-normal">, billed yearly</span>
                    </p>
                  )}
                  <p className="text-dark-muted text-xs mt-1 mb-3">
                    {circles === 1 ? 'Covers 1 circle' : `Covers ${circles} circles`}
                  </p>
                  {period === 'annual' && saving > 0 ? (
                    <p className="self-start text-brand-success text-xs font-bold bg-brand-success/8 border border-brand-success/20 rounded-lg px-2.5 py-1.5 mb-5">
                      Save {saving}% vs paying monthly
                    </p>
                  ) : (
                    <div className="mb-5" />
                  )}
                </>
              ) : (
                <>
                  <p className="flex items-baseline gap-1 mb-1">
                    <span className="font-display text-5xl font-black text-dark-text">{formatPrice(0, currency)}</span>
                  </p>
                  <p className="text-dark-muted text-xs mb-8">Free forever — no card needed</p>
                </>
              )}

              <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-dark-muted">
                    <span className="mt-0.5"><CheckIcon /></span>
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
                {plan.id ? (trial ? `Try ${plan.name} free for ${TRIAL.days} days` : `Get ${plan.name}`) : 'Start free'}
              </a>
            </div>
          );
        })}
      </div>

      <div className="mt-12 max-w-3xl mx-auto rounded-2xl border border-dark-border bg-dark-surface p-6 text-sm text-dark-muted leading-relaxed space-y-3">
        <p className="text-dark-text font-semibold text-center">How plans work</p>
        <ul className="space-y-2 list-disc pl-5">
          <li>
            <span className="text-dark-text">A plan covers circles, not people.</span> Everyone in a covered circle
            gets the plan&apos;s history, places, driving reports and minutes on their own free account. You are
            never charged per person.
          </li>
          <li>
            Everyone gets {FREE_CIRCLES} free circles. One plan covers 1, 2 or 3 circles at the same tier;
            each extra circle is {extra} a {per} on every tier. A circle you put on a plan stays on it for the
            life of the plan.
          </li>
          <li>
            Adding circles or moving to a higher tier starts today. Fewer circles, a lower tier or a different
            billing period starts at your next renewal.
          </li>
          <li>
            The {TRIAL.days}-day free trial is offered once per store account, on Platinum annual for 1 circle.
            Cancel in the App Store or Google Play at least 24 hours before it ends and you are not charged.
          </li>
          <li>
            Plans are bought in the Loxymity app and billed by the App Store or Google Play. They renew
            automatically until you cancel, at least 24 hours before the period ends, in your store account.
            Temporary circles can&apos;t be put on a plan and are free for everyone. Only adults can buy a plan.
          </li>
          <li>
            Monthly allowances (Street View, assistant questions, flights, video minutes) reset each month and
            never bill you extra — the feature simply pauses until the next month.
          </li>
        </ul>
      </div>
    </>
  );
}
