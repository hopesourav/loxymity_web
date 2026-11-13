'use client';

import { MAX_CIRCLES, PLAN_CARDS, planPrice, webPriceInr } from '../../_lib/pricing';
import type { PlanPeriod, PlanTier } from '../_lib/webBilling';
import { formatInr } from '../_lib/webBilling';
import { IconCheck } from './Icons';

export type PlanChoice = { tier: PlanTier; circles: number; period: PlanPeriod };

/** Tier × circles × period, priced at the web rate with the app price beside it. Display only —
 *  the amount charged is always the server's quote. */
export function PlanPicker({ value, onChange, minCircles = 1 }: {
  value: PlanChoice;
  onChange: (v: PlanChoice) => void;
  minCircles?: number;
}) {
  const paid = PLAN_CARDS.filter((p) => p.id !== null);
  const pill = (on: boolean) => `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
    on ? 'bg-primary text-dark-bg' : 'text-dark-muted hover:text-dark-text'
  }`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="inline-flex bg-dark-bg border border-dark-border rounded-xl p-1" role="group" aria-label="Billing period">
          <button type="button" className={pill(value.period === 'monthly')} onClick={() => onChange({ ...value, period: 'monthly' })}>Monthly</button>
          <button type="button" className={pill(value.period === 'annual')} onClick={() => onChange({ ...value, period: 'annual' })}>Yearly</button>
        </div>
        <div className="flex items-center gap-2" aria-label="Circles covered">
          <span className="text-xs text-dark-muted">Circles</span>
          <div className="inline-flex bg-dark-bg border border-dark-border rounded-xl p-1">
            {Array.from({ length: MAX_CIRCLES }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                disabled={n < minCircles}
                className={`${pill(value.circles === n)} disabled:opacity-30`}
                onClick={() => onChange({ ...value, circles: n })}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {paid.map((card) => {
          const tier = card.id as PlanTier;
          const on = value.tier === tier;
          const web = webPriceInr(tier, value.circles, value.period);
          const app = planPrice(tier, value.circles, value.period, 'INR');
          return (
            <button
              key={tier}
              type="button"
              onClick={() => onChange({ ...value, tier })}
              aria-pressed={on}
              className={`text-left rounded-2xl p-4 border transition-colors ${
                on ? 'border-primary bg-primary/5' : 'border-dark-border bg-dark-surface hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-dark-text">{card.name}</p>
                {on && <IconCheck size={16} className="text-primary" />}
              </div>
              <p className="mt-2 font-display text-2xl font-bold text-dark-text">
                {formatInr(web)}
                <span className="text-xs font-normal text-dark-muted"> / {value.period === 'annual' ? 'year' : 'month'}</span>
              </p>
              <p className="text-xs text-dark-muted">{formatInr(app)} in the app</p>
              <p className="text-xs text-dark-muted mt-2">{card.tagline}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
