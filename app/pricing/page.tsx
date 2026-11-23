import PricingCards from '../_components/PricingCards';
import { JsonLd } from '../_components/JsonLd';
import { SiteFooter } from '../_components/SiteFooter';
import { SiteNav } from '../_components/SiteNav';
import { StoreButtons } from '../_components/StoreButtons';
import {
  FREE_CIRCLES, MAX_CIRCLES, PLAN_TIERS, TRIAL, formatPrice, planPrice,
  type Currency, type PlanId,
} from '../_lib/pricing';
import { APP_ID, breadcrumb, faqPage, pageMeta } from '../_lib/seo';

/**
 * loxymity.com/pricing/ — the plans on a page of their own (SEO/AEO pass, 2026-11-23).
 *
 * "How much does Loxymity cost?" is one of the questions people ask search engines and AI
 * assistants, and the answer used to exist only as a section of the home page, priced in USD until
 * a script ran. This page states it in plain text, in all four currencies the stores set exactly,
 * straight from `catalog.generated.ts` (never type a price here — `_lib/pricing.ts`).
 *
 * Copy rules: the home page's claims rules, the billed amount before any per-month figure, no price
 * for an extra circle (the steps are not equal everywhere — PricingCards), plans are bought in the
 * app (web checkout is off and the Terms say plans are not sold on the website), no claims about
 * other apps. The FAQ questions here are NOT repeated on /help/ (one marked-up copy per question).
 */
export const metadata = pageMeta({
  title: 'Loxymity pricing — free to start, one plan for the whole circle',
  description:
    'Loxymity is free to start. Gold, Platinum and Infinite plans cover your whole circle — one person pays, everyone gets the plan. Prices in US dollars, rupees, euros and pounds, with a 7-day free trial of Platinum.',
  path: '/pricing/',
});

const TIER_NAME: Record<PlanId, string> = { gold: 'Gold', platinum: 'Platinum', infinite: 'Infinite' };

const CURRENCIES: { code: Currency; label: string }[] = [
  { code: 'USD', label: 'US dollars' },
  { code: 'INR', label: 'Indian rupees' },
  { code: 'EUR', label: 'Euros' },
  { code: 'GBP', label: 'British pounds' },
];

const p = (tier: PlanId, period: 'monthly' | 'annual', c: Currency) => formatPrice(planPrice(tier, 1, period, c), c);

const FROM_USD = `${p('gold', 'monthly', 'USD')} a month or ${p('gold', 'annual', 'USD')} a year`;
const FROM_INR = `${p('gold', 'monthly', 'INR')} a month or ${p('gold', 'annual', 'INR')} a year`;

const FAQ: { q: string; text: string }[] = [
  {
    q: 'Who pays for a Loxymity plan?',
    text: 'One person. Whoever buys the plan picks the circles it covers, and everyone in a covered circle gets the plan there — a bigger circle, longer history, in-app calls and, from Platinum, driving reports. Loxymity is never priced per person. Places with alerts, Vault backup and the web dashboard come with the plan for the person who pays.',
  },
  {
    q: 'Can one plan cover more than one circle?',
    text: `Yes. A plan covers 1, 2 or ${MAX_CIRCLES} circles — choose the number when you buy it, and the price above changes with it. Everyone can also have ${FREE_CIRCLES} circles on the free plan; covered circles come on top.`,
  },
  {
    q: 'Is there a free trial?',
    text: `Yes: ${TRIAL.days} days of Platinum on the yearly plan for one circle, once per App Store or Google Play account. It becomes a paid plan unless you cancel at least 24 hours before it ends.`,
  },
  {
    q: 'Where do I buy a plan, and how do I cancel?',
    text: 'In the Loxymity app, through the App Store or Google Play. Plans are not sold on this website. Cancel any time in your App Store or Google Play subscriptions; the plan stays until the end of the period you paid for.',
  },
  {
    q: 'Why is the price different in my country?',
    text: 'Prices in US dollars, Indian rupees, euros and British pounds are set exactly in both stores. Anywhere else, the store charges its own local price, and taxes are added as your store applies them.',
  },
  {
    q: 'What stays free on every plan?',
    text: `The live map, SOS, crash check, chat and share links are free for everyone, as are ${FREE_CIRCLES} circles of up to 5 people with 2 places and 2 days of history. Answering a voice call is always free, and calls about an SOS are free for the hour after it is sent.`,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <JsonLd
        nodes={[
          breadcrumb('Pricing', '/pricing/'),
          {
            '@type': 'MobileApplication',
            '@id': APP_ID,
            name: 'Loxymity',
            offers: [
              { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD' },
              ...PLAN_TIERS.flatMap((tier) =>
                (['monthly', 'annual'] as const).flatMap((period) =>
                  CURRENCIES.map(({ code }) => ({
                    '@type': 'Offer',
                    name: `${TIER_NAME[tier]}, 1 circle, ${period === 'annual' ? 'yearly' : 'monthly'}`,
                    price: String(planPrice(tier, 1, period, code)),
                    priceCurrency: code,
                  })),
                ),
              ),
            ],
          },
          faqPage(FAQ),
        ]}
      />
      <SiteNav />

      <header className="relative overflow-hidden px-6 pb-12 pt-36">
        <div className="aurora" aria-hidden="true"><span className="a1" /><span className="a2" /></div>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="eyebrow">Pricing</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-dark-text md:text-6xl">
            Loxymity pricing
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-dark-muted">
            Loxymity is free to start: {FREE_CIRCLES} circles of up to 5 people, 2 places with arrival and leave alerts,
            2 days of history, SOS, crash check and chat. Paid plans — Gold, Platinum and Infinite — start at {FROM_USD}{' '}
            ({FROM_INR} in India). <span className="text-dark-text">One person pays, and everyone in the circle gets the plan.</span>
          </p>
        </div>
      </header>

      <section className="relative px-6 pb-20">
        <div className="relative z-10 mx-auto max-w-6xl">
          <PricingCards />
          <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-dark-muted">
            Other regions pay the store&apos;s local price; taxes as your store applies them. The free trial is on
            Platinum yearly for one circle, once per store account, and becomes a paid plan unless you cancel at least
            24 hours before it ends. See the <a href="/terms/#plans" className="underline hover:text-dark-text">plan terms</a>.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20" aria-labelledby="one-circle">
        <div className="mx-auto max-w-4xl">
          <h2 id="one-circle" className="text-2xl font-semibold tracking-tight text-dark-text md:text-3xl">Prices for one circle</h2>
          <p className="mt-3 text-sm leading-relaxed text-dark-muted">
            What the App Store and Google Play charge for a plan that covers one circle. Plans for 2 or {MAX_CIRCLES} circles
            cost more — the selector above shows the exact price.
          </p>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/[0.07] bg-dark-surface/60">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <caption className="sr-only">Loxymity plan prices for one circle, monthly and yearly, in four currencies</caption>
              <thead>
                <tr className="border-b border-white/[0.07]">
                  <th scope="col" className="px-4 py-3 text-left font-medium text-dark-muted">Plan</th>
                  {CURRENCIES.map((c) => (
                    <th key={c.code} scope="col" className="px-4 py-3 text-left font-medium text-dark-muted">{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/[0.05]">
                  <th scope="row" className="px-4 py-3 text-left font-semibold text-dark-text">Free</th>
                  {CURRENCIES.map((c) => (
                    <td key={c.code} className="px-4 py-3 text-dark-text">{formatPrice(0, c.code)}</td>
                  ))}
                </tr>
                {PLAN_TIERS.map((tier) => (
                  <tr key={tier} className="border-b border-white/[0.05] last:border-0">
                    <th scope="row" className="px-4 py-3 text-left font-semibold text-dark-text">{TIER_NAME[tier]}</th>
                    {CURRENCIES.map(({ code }) => (
                      <td key={code} className="px-4 py-3 text-dark-muted">
                        <span className="text-dark-text">{p(tier, 'monthly', code)}</span> a month
                        <br />
                        <span className="text-dark-text">{p(tier, 'annual', code)}</span> a year
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24" aria-labelledby="pricing-faq">
        <div className="mx-auto max-w-3xl">
          <h2 id="pricing-faq" className="text-2xl font-semibold tracking-tight text-dark-text md:text-3xl">Plan questions</h2>
          <div className="mt-8 divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {FAQ.map(({ q, text }) => (
              <div key={q} className="py-6">
                <h3 className="text-base font-semibold text-dark-text">{q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dark-muted">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-dark-muted">
            Something else? See the <a href="/help/" className="text-primary-soft hover:underline">Help centre</a> or write to{' '}
            <a href="mailto:support@loxymity.com" className="text-primary-soft hover:underline">support@loxymity.com</a>.
          </p>
        </div>
      </section>

      {/* The plan cards' buttons point at #download. */}
      <section id="download" className="scroll-mt-24 border-t border-white/[0.06] px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-dark-text md:text-4xl">Start free, upgrade in the app</h2>
        <p className="mt-3 text-dark-muted">Free on iPhone and Android.</p>
        <StoreButtons className="mt-8" />
      </section>

      <SiteFooter showStores={false} />
    </div>
  );
}
