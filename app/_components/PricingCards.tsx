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
 *
 * Prices themselves live in `_lib/pricing.ts` so the dashboard checkout quotes
 * the same numbers this page advertises.
 */
import { useEffect, useState } from 'react';
import { PLANS, detectCurrency, type Currency } from '../_lib/pricing';

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-brand-success flex-shrink-0" fill="none" viewBox="0 0 24 24"
         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
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

      {/* Where history actually lives.
          Worth stating plainly because it is a genuine differentiator no
          competitor offers, AND because the three layers do different jobs.
          The phone is the PRIMARY store — calling it a "backup" would be
          backwards, and would mislead anyone who later loses the device. The
          server window is what your circle can see. Vault is the only one of
          the three that survives a lost phone, which is precisely why it is
          worth paying for. */}
      <div className="mt-12 max-w-3xl mx-auto rounded-2xl border border-dark-border bg-dark-surface p-6">
        <p className="text-dark-text font-semibold text-center mb-4">
          Your location history lives in three places
        </p>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-brand-success font-semibold">On your phone</p>
            <p className="text-dark-muted mt-1">
              Unlimited, on every plan including Free. Your device keeps the full
              record — you can shorten it any time in Data &amp; Storage.
            </p>
          </div>
          <div>
            <p className="text-primary font-semibold">On our servers</p>
            <p className="text-dark-muted mt-1">
              30, 90 or 180 days by plan. This is the window your circle can see,
              and what syncs to a new device.
            </p>
          </div>
          <div>
            <p className="text-dark-text font-semibold">Vault backup</p>
            <p className="text-dark-muted mt-1">
              End-to-end encrypted, on paid plans. The only copy that survives a
              lost or reset phone — we cannot read it.
            </p>
          </div>
        </div>
      </div>

      {/* R32. Per-call rounding means many short calls exhaust an allowance on
          far less real talk time. Saying so at the point of sale is the honest
          version; leaving it to be discovered is a fair complaint. */}
      <p className="text-center text-dark-muted text-xs mt-8">
        Calls are billed in whole minutes, minimum one minute per call.
      </p>
    </>
  );
}
