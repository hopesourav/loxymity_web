import { notFound } from 'next/navigation';
import { JsonLd } from '../../_components/JsonLd';
import { SiteFooter } from '../../_components/SiteFooter';
import { SiteNav } from '../../_components/SiteNav';
import { StoreButtons } from '../../_components/StoreButtons';
import { APP_ID, SITE_URL, WEBSITE_ID, breadcrumbTrail, faqPage, pageMeta } from '../../_lib/seo';
import { FEATURES, FEATURE_BY_SLUG } from '../_data';

/**
 * /features/<slug>/ — one page per feature, built at export time from `../_data.ts` (the content and
 * its sources live there). Answer first (the lead), then how it works, what you get, the honest
 * limits and three questions not asked anywhere else on the site.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return FEATURES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = FEATURE_BY_SLUG[slug];
  if (!f) return {};
  return pageMeta({ title: f.metaTitle, description: f.description, path: `/features/${f.slug}/` });
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = FEATURE_BY_SLUG[slug];
  if (!f) notFound();
  const path = `/features/${f.slug}/`;
  const related = f.related.map((s) => FEATURE_BY_SLUG[s]).filter(Boolean);

  return (
    <div className="min-h-screen bg-dark-bg">
      <JsonLd
        nodes={[
          breadcrumbTrail([{ name: 'Features', path: '/features/' }, { name: f.name, path }]),
          {
            '@type': 'WebPage',
            url: `${SITE_URL}${path}`,
            name: f.h1,
            description: f.description,
            isPartOf: { '@id': WEBSITE_ID },
            about: { '@id': APP_ID },
          },
          faqPage(f.faq),
        ]}
      />
      <SiteNav />

      <header className="relative overflow-hidden px-6 pb-14 pt-32">
        <div className="aurora" aria-hidden="true"><span className="a1" /><span className="a2" /></div>
        <div className="relative z-10 mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-xs text-dark-muted">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><a href="/" className="hover:text-dark-text">Home</a></li>
              <li aria-hidden="true">›</li>
              <li><a href="/features/" className="hover:text-dark-text">Features</a></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" className="text-dark-text">{f.name}</li>
            </ol>
          </nav>
          <p className="eyebrow mt-8">{f.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-dark-text md:text-6xl">{f.h1}</h1>
          <p className="mt-6 text-lg leading-relaxed text-dark-muted">{f.lead}</p>
          <p className="mt-6 inline-block rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary-soft">
            {f.plan}
          </p>
        </div>
      </header>

      {/* Padding outside the width cap, as in the header, so both start at the same left edge. */}
      <main className="px-6 pb-20">
        <div className="mx-auto max-w-3xl space-y-16">
        <section aria-labelledby="how">
          <h2 id="how" className="text-2xl font-semibold tracking-tight text-dark-text md:text-3xl">How it works</h2>
          <ol className="mt-6 space-y-5">
            {f.steps.map((s, i) => (
              <li key={s.t} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/40 text-sm font-semibold text-primary-soft">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-dark-text">{s.t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-dark-muted">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="what">
          <h2 id="what" className="text-2xl font-semibold tracking-tight text-dark-text md:text-3xl">What you get</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {f.details.map((d) => (
              <div key={d.t} className="card-premium rounded-3xl p-6">
                <h3 className="font-semibold text-dark-text">{d.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dark-muted">{d.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="limits" className="rounded-3xl border border-white/[0.07] bg-dark-surface/60 p-6">
          <h2 id="limits" className="text-lg font-semibold text-dark-text">Good to know</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-dark-muted">
            {f.limits.map((l) => <li key={l}>{l}</li>)}
          </ul>
        </section>

        <section aria-labelledby="faq">
          <h2 id="faq" className="text-2xl font-semibold tracking-tight text-dark-text md:text-3xl">Questions</h2>
          <div className="mt-6 divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {f.faq.map(({ q, text }) => (
              <div key={q} className="py-6">
                <h3 className="text-base font-semibold text-dark-text">{q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dark-muted">{text}</p>
              </div>
            ))}
          </div>
          {f.help && f.help.length > 0 && (
            <ul className="mt-6 space-y-2 text-sm">
              {f.help.map((h) => (
                <li key={h.href}><a href={h.href} className="font-semibold text-primary-soft hover:underline">{h.label} →</a></li>
              ))}
            </ul>
          )}
        </section>

        {related.length > 0 && (
          <section aria-labelledby="related">
            <h2 id="related" className="text-2xl font-semibold tracking-tight text-dark-text md:text-3xl">More from Loxymity</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <a key={r.slug} href={`/features/${r.slug}/`} className="card-premium lift block rounded-3xl p-5">
                  <p className="font-semibold text-dark-text">{r.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-dark-muted">{r.summary}</p>
                </a>
              ))}
            </div>
          </section>
        )}
        </div>
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
