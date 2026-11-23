import { JsonLd } from '../_components/JsonLd';
import { SiteFooter } from '../_components/SiteFooter';
import { SiteNav } from '../_components/SiteNav';
import { StoreButtons } from '../_components/StoreButtons';
import { ONE_LINE, SITE_URL, breadcrumb, pageMeta } from '../_lib/seo';
import { FEATURES } from './_data';

/**
 * /features/ — every feature page in one list (SEO/AEO pass, 2026-11-23). "Also included" is the
 * home page's list (app/page.tsx) minus what now has a page of its own — keep the two in step.
 */
export const metadata = pageMeta({
  title: 'Loxymity features — live map, place alerts, SOS, crash check and more',
  description:
    'Everything Loxymity does: a private live map, arrival and leave alerts, an SOS that rings, crash check, a no-signal relay, driving reports, WhatsApp answers, trips, flights and official alerts.',
  path: '/features/',
});

const ALSO = [
  'Day timeline & replay',
  'Family schedule: on time or late',
  'Temporary circles that end on their own',
  'Low-battery & speeding alerts',
  'Circle chat, messages and calls',
  'Loxy, the in-app assistant',
  'Vault backup only you can open',
  'App Lock with Face ID or fingerprint',
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <JsonLd
        nodes={[
          breadcrumb('Features', '/features/'),
          {
            '@type': 'ItemList',
            name: 'Loxymity features',
            itemListElement: FEATURES.map((f, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: f.name,
              url: `${SITE_URL}/features/${f.slug}/`,
            })),
          },
        ]}
      />
      <SiteNav />

      <header className="relative overflow-hidden px-6 pb-14 pt-36">
        <div className="aurora" aria-hidden="true"><span className="a1" /><span className="a3" /></div>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="eyebrow">Features</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-dark-text md:text-6xl">Everything Loxymity does</h1>
          <p className="mt-6 text-lg leading-relaxed text-dark-muted">
            {ONE_LINE} Here is each feature, how it works, and what to know before you rely on it.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <a key={f.slug} href={`/features/${f.slug}/`} className="card-premium lift flex flex-col rounded-3xl p-6">
              <h2 className="text-lg font-semibold text-dark-text">{f.name}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-dark-muted">{f.summary}</p>
              <p className="mt-4 text-xs font-semibold text-primary-soft">{f.plan.split(' · ')[0]} →</p>
            </a>
          ))}
        </div>

        <section className="mt-16" aria-labelledby="also">
          <h2 id="also" className="text-center text-sm font-medium text-dark-text">Also included</h2>
          <ul className="mx-auto mt-4 flex max-w-4xl flex-wrap justify-center gap-2">
            {ALSO.map((t) => (
              <li key={t} className="rounded-full border border-white/[0.07] bg-white/[0.02] px-3.5 py-1.5 text-[13px] text-dark-muted">{t}</li>
            ))}
          </ul>
        </section>
      </main>

      <section id="download" className="scroll-mt-24 border-t border-white/[0.06] px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-dark-text md:text-4xl">Free on iPhone and Android</h2>
        <p className="mt-3 text-dark-muted">
          Start free. <a href="/pricing/" className="text-primary-soft hover:underline">See what each plan adds</a>.
        </p>
        <StoreButtons className="mt-8" />
      </section>

      <SiteFooter showStores={false} />
    </div>
  );
}
