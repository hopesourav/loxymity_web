import { JsonLd } from '../_components/JsonLd';
import { SiteFooter } from '../_components/SiteFooter';
import { SiteNav } from '../_components/SiteNav';
import { StoreButtons } from '../_components/StoreButtons';
import { BUSINESS_EMAIL } from '../_lib/business';
import { ONE_LINE, ORG_ID, ORG_NODE, SITE_URL, SOCIAL_LINKS, SUPPORT_EMAIL, breadcrumb, pageMeta } from '../_lib/seo';

/**
 * loxymity.com/about/ — who makes Loxymity (SEO/AEO pass, 2026-11-23).
 *
 * Search engines and AI assistants look for one clear statement of who is behind a product; the site
 * had none beyond the footer's company line. Facts only, each already stated elsewhere on the site
 * (the footer, the legal pages, the home page). No founder names until the owner chooses to add
 * them. Claims rules: the home page's (app/page.tsx header).
 */
export const metadata = pageMeta({
  title: 'About Loxymity — private location sharing, made in India',
  description:
    'Loxymity is a private, real-time location-sharing app for families and close friends, made by AMSEK RESEARCH LABS LLP in West Bengal, India. Never sold. No ads.',
  path: '/about/',
});

const PRINCIPLES = [
  {
    t: 'Never sold. No ads.',
    d: 'Your location is never sold and never used for ads, and there are no ads in Loxymity. It is paid for by the people who choose a plan.',
  },
  {
    t: 'You stay in control',
    d: 'You choose your circles, can pause sharing at any time and leave whenever you like. Organisations work with us only under a written agreement, with the person in control — never to track employees.',
  },
  {
    t: 'Straight about the limits',
    d: 'Loxymity is not end-to-end encrypted and it is not an emergency service. We say so on the page, not in the fine print.',
  },
  {
    t: 'Gentle on your phone',
    d: 'There is no fixed polling interval: your phone reports more while you move and much less while you are still.',
  },
];

const FACTS: { k: string; v: React.ReactNode }[] = [
  { k: 'Company', v: 'AMSEK RESEARCH LABS LLP' },
  { k: 'Based in', v: 'West Bengal, India' },
  { k: 'The app', v: 'Loxymity: Family & Friends Map — on the App Store and Google Play' },
  { k: 'Works on', v: 'iPhone (iOS 17 or later) and Android (7.0 or later)' },
  { k: 'Language', v: 'English, with more on the way' },
  { k: 'Support', v: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary-soft hover:underline">{SUPPORT_EMAIL}</a> },
  { k: 'Organisations', v: <a href={`mailto:${BUSINESS_EMAIL}`} className="text-primary-soft hover:underline">{BUSINESS_EMAIL}</a> },
  { k: 'Personal data complaints', v: <a href="/privacy/#contact" className="text-primary-soft hover:underline">Grievance Officer</a> },
];

const FOLLOW = [
  { label: 'YouTube', href: SOCIAL_LINKS.youtube },
  { label: 'Instagram', href: SOCIAL_LINKS.instagram },
  { label: 'Facebook', href: SOCIAL_LINKS.facebook },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <JsonLd
        nodes={[
          breadcrumb('About', '/about/'),
          { '@type': 'AboutPage', url: `${SITE_URL}/about/`, name: 'About Loxymity', mainEntity: { '@id': ORG_ID } },
          ORG_NODE,
        ]}
      />
      <SiteNav />

      <header className="relative overflow-hidden px-6 pb-14 pt-36">
        <div className="aurora" aria-hidden="true"><span className="a1" /><span className="a2" /></div>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="eyebrow">About</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-dark-text md:text-6xl">About Loxymity</h1>
          <p className="mt-6 text-lg leading-relaxed text-dark-muted">
            {ONE_LINE} It is made by AMSEK RESEARCH LABS LLP, a limited liability partnership based in West Bengal, India.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-16 px-6 pb-24">
        <section aria-labelledby="why">
          <h2 id="why" className="text-2xl font-semibold tracking-tight text-dark-text md:text-3xl">Why we built it</h2>
          <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-dark-muted">
            <p>
              Every family has the same message thread: &ldquo;Reached?&rdquo; &ldquo;Leaving now.&rdquo; &ldquo;Call me when you get
              there.&rdquo; Loxymity replaces it with one private map, an alert when someone gets to school, work or home, and an
              SOS the whole circle hears when something goes wrong.
            </p>
            <p>
              How it pays for itself is simple: Loxymity is free to start, the people who want more pay for a plan that covers
              their whole circle, and nobody&apos;s location is ever sold.
            </p>
          </div>
        </section>

        <section aria-labelledby="principles">
          <h2 id="principles" className="text-2xl font-semibold tracking-tight text-dark-text md:text-3xl">What we stand for</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {PRINCIPLES.map((x) => (
              <div key={x.t} className="card-premium rounded-3xl p-6">
                <h3 className="font-semibold text-dark-text">{x.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dark-muted">{x.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="company">
          <h2 id="company" className="text-2xl font-semibold tracking-tight text-dark-text md:text-3xl">The company</h2>
          <dl className="mt-6 divide-y divide-white/[0.07] border-y border-white/[0.07] text-sm">
            {FACTS.map((f) => (
              <div key={f.k} className="grid gap-1 py-4 sm:grid-cols-[200px_1fr] sm:gap-6">
                <dt className="text-dark-muted">{f.k}</dt>
                <dd className="text-dark-text">{f.v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="follow">
          <h2 id="follow" className="text-2xl font-semibold tracking-tight text-dark-text md:text-3xl">Follow Loxymity</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-dark-muted">Short videos about real family moments, and what is new in the app.</p>
          <ul className="mt-5 flex flex-wrap gap-3">
            {FOLLOW.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="inline-block rounded-full border border-white/[0.1] px-5 py-2 text-sm font-semibold text-dark-text transition-colors hover:bg-white/5"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-white/[0.07] bg-dark-surface/60 p-8 text-center">
          <p className="text-lg font-semibold text-dark-text">Free on iPhone and Android</p>
          <StoreButtons className="mt-6" />
        </section>
      </main>

      <SiteFooter showStores={false} />
    </div>
  );
}
