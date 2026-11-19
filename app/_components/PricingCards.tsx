'use client';

/**
 * Pricing: four short cards, then the detail for anyone who wants it.
 *
 * Layout (2026-11-19, "less cluttered"): ONE control up front (Monthly / Yearly). The circle count
 * and the currency are a single line of small text with two native selects ("Prices for 1 circle in
 * ₹ INR") — both still there, neither in the way. Each card has four lines in the same order
 * (people · history · places · the tier's headline feature); every other figure is in the
 * "Compare all plans" table (`COMPARE_ROWS`), and the rules are in "How plans work".
 *
 * WHY THIS IS A CLIENT COMPONENT, and why USD is the SSG default:
 * the site is a STATIC EXPORT (next.config.ts `output: 'export'`), so page.tsx is prerendered once
 * at build time and served from a CDN. Choosing a currency during render would bake ONE region's
 * prices into the HTML that every visitor receives. Detection therefore happens after hydration,
 * on the visitor's own device, with USD as the statically-safe default. The manual currency switch
 * stays: timezone detection fails for VPN users and travellers.
 *
 * The circles select exists because the circle count is part of the plan (one subscription covers
 * 1–3 circles), exactly as on the in-app paywall. It shows the store's exact price — never "+$4 per
 * extra circle": the steps are not equal everywhere (Infinite × 3 yearly in US dollars).
 *
 * A yearly card leads with the BILLED amount; "≈ …/mo" sits under it, smaller (display rule in
 * `_lib/pricing.ts`).
 */
import { useEffect, useState } from 'react';
import {
  PLAN_CARDS, COMPARE_ROWS, MAX_CIRCLES, FREE_CIRCLES, TRIAL, CURRENCY_OPTIONS,
  detectCurrency, formatPrice, maxAnnualSaving, perMonthOfAnnual, planPrice,
  type CompareCell, type Currency, type Period,
} from '../_lib/pricing';

function Check({ className = 'h-4 w-4 text-status-ok' }: { className?: string }) {
  return (
    <svg className={`shrink-0 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function Plus() {
  return (
    <svg className="faq-plus h-5 w-5 shrink-0 text-dark-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/** A small native select that reads as part of the sentence around it. */
function InlineSelect<T extends string | number>({ label, value, options, onChange }: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <select
      aria-label={label}
      value={String(value)}
      onChange={(e) => {
        const hit = options.find((o) => String(o.value) === e.target.value);
        if (hit) onChange(hit.value);
      }}
      className="cursor-pointer rounded-lg border border-white/[0.1] bg-dark-surface px-2 py-1 font-semibold text-dark-text hover:border-white/20 focus:border-primary focus:outline-none"
    >
      {options.map((o) => (
        <option key={String(o.value)} value={String(o.value)}>{o.label}</option>
      ))}
    </select>
  );
}

function Cell({ value }: { value: CompareCell }) {
  if (value === true) return <><Check className="mx-auto h-4 w-4 text-status-ok" /><span className="sr-only">Included</span></>;
  if (value === false) return <><span aria-hidden="true" className="text-dark-muted/50">—</span><span className="sr-only">Not included</span></>;
  return <span className="text-dark-text">{value}</span>;
}

export default function PricingCards() {
  // USD on the server AND on the first client render, so hydration matches the prerendered HTML.
  // The switch happens in an effect, one frame later.
  const [currency, setCurrency] = useState<Currency>('USD');
  const [period, setPeriod] = useState<Period>('annual');
  const [circles, setCircles] = useState(1);

  useEffect(() => { setCurrency(detectCurrency()); }, []);

  const saving = maxAnnualSaving(circles, currency);
  const per = period === 'annual' ? 'year' : 'month';

  return (
    <>
      {/* ── The one control, and the sentence that holds the other two ── */}
      <div className="flex flex-col items-center gap-3">
        <div className="inline-flex rounded-full border border-dark-border bg-dark-surface p-1" role="group" aria-label="Billing period">
          {([['monthly', 'Monthly'], ['annual', 'Yearly']] as const).map(([v, label]) => (
            <button
              key={v}
              type="button"
              onClick={() => setPeriod(v)}
              aria-pressed={period === v}
              className={`rounded-full px-5 py-1.5 text-sm font-semibold transition-colors ${
                period === v ? 'bg-primary text-dark-bg' : 'text-dark-muted hover:text-dark-text'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2 text-sm text-dark-muted">
          {saving > 0 && (
            <>
              <span className="basis-full text-center font-medium text-status-ok sm:basis-auto">Yearly saves up to {saving}%</span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
            </>
          )}
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            Prices for
            <InlineSelect
              label="Circles on the plan"
              value={circles}
              onChange={setCircles}
              options={Array.from({ length: MAX_CIRCLES }, (_, i) => ({ value: i + 1, label: i === 0 ? '1 circle' : `${i + 1} circles` }))}
            />
            in
            <InlineSelect label="Currency" value={currency} onChange={setCurrency} options={CURRENCY_OPTIONS} />
          </span>
        </p>
      </div>

      {/* ── Cards ── */}
      <div className="mt-10 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-4">
        {PLAN_CARDS.map((plan) => {
          const price = plan.id ? planPrice(plan.id, circles, period, currency) : 0;
          const trial = plan.id === TRIAL.tier && period === TRIAL.period && circles === TRIAL.circles;
          return (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl p-6 ${
                plan.highlight ? 'card-premium z-10 border-2 border-primary/50' : 'card-premium gradient-border'
              }`}
              style={plan.highlight ? { boxShadow: '0 30px 80px -20px rgba(124,136,255,0.35), 0 0 0 1px rgba(124,136,255,0.25)' } : undefined}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-dark-bg shadow-lg">
                  {plan.badge}
                </span>
              )}
              <p className="font-hud text-sm font-semibold uppercase tracking-wide text-dark-text">{plan.name}</p>
              <p className="mt-1 min-h-[2.5rem] text-xs leading-snug text-dark-muted">{plan.tagline}</p>

              <div className="mt-4 min-h-[4.25rem]">
                <p className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight text-dark-text">{formatPrice(price, currency)}</span>
                  {plan.id && <span className="text-sm text-dark-muted">/ {per}</span>}
                </p>
                <p className="mt-1 text-sm text-dark-muted">
                  {!plan.id
                    ? 'No card needed'
                    : period === 'annual'
                      ? <>≈ {perMonthOfAnnual(plan.id, circles, currency)} a month</>
                      : 'Billed monthly'}
                </p>
              </div>

              <ul className="mt-5 flex flex-1 flex-col gap-2.5 border-t border-white/[0.06] pt-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-dark-muted">
                    <span className="mt-0.5"><Check /></span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#download"
                className={`mt-7 block rounded-xl px-6 py-3 text-center font-semibold transition-colors ${
                  plan.highlight ? 'bg-primary font-bold text-dark-bg hover:bg-primary-dark' : 'bg-white/[0.06] text-dark-text hover:bg-white/[0.12]'
                }`}
              >
                {plan.id ? (trial ? `Try free for ${TRIAL.days} days` : `Get ${plan.name}`) : 'Start free'}
              </a>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
        {[`${TRIAL.days}-day free trial of Platinum`, 'Cancel any time in your store account', 'No ads, ever'].map((r) => (
          <div key={r} className="flex items-center gap-2 text-sm text-dark-muted">
            <Check />
            {r}
          </div>
        ))}
      </div>

      {/* ── The detail, folded away ── */}
      <div className="mx-auto mt-10 max-w-4xl space-y-3">
        <details className="group rounded-2xl border border-white/[0.07] bg-dark-surface/60">
          <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 text-base font-semibold text-dark-text">
            Compare all plans
            <Plus />
          </summary>
          <div className="overflow-x-auto px-2 pb-4 sm:px-4">
            <table className="w-full min-w-[620px] border-collapse text-sm">
              <caption className="sr-only">What each plan includes</caption>
              <thead>
                <tr className="border-b border-white/[0.07]">
                  <th scope="col" className="px-3 py-3 text-left font-medium text-dark-muted"><span className="sr-only">Feature</span></th>
                  {PLAN_CARDS.map((p) => (
                    <th key={p.name} scope="col" className={`px-3 py-3 text-center font-hud text-xs font-semibold uppercase tracking-wide ${p.highlight ? 'text-primary-soft' : 'text-dark-text'}`}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-white/[0.05] last:border-0">
                    <th scope="row" className="px-3 py-3 text-left font-normal text-dark-muted">
                      {row.label}{row.payer && <sup className="ml-0.5 text-dark-muted">1</sup>}
                    </th>
                    {row.values.map((v, i) => (
                      <td key={i} className="px-3 py-3 text-center"><Cell value={v} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-3 pt-3 text-xs text-dark-muted"><sup>1</sup> Comes with the plan for the person who pays.</p>
          </div>
        </details>

        <details className="group rounded-2xl border border-white/[0.07] bg-dark-surface/60 text-sm leading-relaxed text-dark-muted">
          <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 text-base font-semibold text-dark-text">
            How plans work
            <Plus />
          </summary>
          <ul className="list-disc space-y-2 pb-6 pl-11 pr-6">
            <li>
              <span className="text-dark-text">A plan covers circles, not people.</span> Everyone in a covered circle
              gets the plan&apos;s history, calls and driving reports on their own free account. More places, Vault
              backup and the web dashboard come with the plan for the person who pays. You are never charged per person.
            </li>
            <li>
              Everyone gets {FREE_CIRCLES} free circles. One plan covers 1, 2 or 3 circles at the same tier, and a
              circle you put on a plan stays on it for the life of the plan.
            </li>
            <li>
              Adding circles or moving to a higher tier starts today. Fewer circles, a lower tier or a different
              billing period starts at your next renewal.
            </li>
            <li>
              Plans are bought in the Loxymity app and billed by the App Store or Google Play. They renew
              automatically until you cancel in your store account, at least 24 hours before the period ends.
              Temporary circles can&apos;t be put on a plan and are free for everyone. Only adults can buy a plan.
            </li>
            <li>
              Monthly allowances (Street View, assistant questions, video minutes) reset each month and never bill
              you extra — the feature simply pauses until the next month.
            </li>
          </ul>
        </details>
      </div>
    </>
  );
}
