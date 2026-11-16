import type { Metadata } from 'next';
import { DifferentiatorCarousel } from './_components/DifferentiatorCarousel';
import { HeroPhoneCarousel } from './_components/HeroPhoneCarousel';
import PricingCards from './_components/PricingCards';
import { SiteFooter } from './_components/SiteFooter';
import { SiteNav } from './_components/SiteNav';
import { StoreButtons } from './_components/StoreButtons';
import { WEB_DISCOUNT_PCT } from './_lib/pricing';

/*
 * The landing page (2026-11 refresh). One idea per section, each said ONCE:
 *   hero → how it works → features (bento) → more than a dot (carousel) → coming soon → privacy
 *   → pricing → FAQ → organisations → download.
 * The old page said "never sold" about ten times and listed WhatsApp, the offline relay and driving
 * reports four or five times each (feature cards, a checklist, the carousel, safety chips, FAQ).
 *
 * Claims rules (keep them when editing):
 *  - Only what a shipped build does today. Paused or unbuilt things go in COMING_SOON (Alexa is
 *    paused; web checkout is switched off — and the published Terms say plans are not sold on the
 *    website; iPhone Critical Alerts need Apple's approval).
 *  - No claims about other apps ("they sell your data", "they kill your battery"): unprovable here.
 *  - Never "we review every report" (there is no review screen yet), never "forever" about a price.
 *  - The #background-location block is Google Play's required website disclosure — keep its four
 *    parts (collects location / even when closed or not in use / shared with the circle / features).
 */

// Canonical on the home page only (in the root layout it would be inherited by every page).
export const metadata: Metadata = { alternates: { canonical: '/' } };

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://loxymity.com/#org',
      name: 'AMSEK RESEARCH LABS LLP',
      brand: { '@type': 'Brand', name: 'Loxymity' },
      url: 'https://loxymity.com',
      logo: 'https://loxymity.com/icon.png',
      email: 'support@loxymity.com',
    },
    {
      '@type': 'MobileApplication',
      name: 'Loxymity',
      url: 'https://loxymity.com',
      operatingSystem: 'iOS 17 or later, Android 7.0 or later',
      applicationCategory: 'LifestyleApplication',
      description: 'Private, real-time location sharing for families and close friends.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@id': 'https://loxymity.com/#org' },
    },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <SiteNav />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-32 lg:pb-24 lg:pt-36">
        <div className="aurora" aria-hidden="true"><span className="a1" /><span className="a2" /><span className="a3" /></div>
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px] animate-glow-breathe"
          style={{ background: 'radial-gradient(ellipse 80% 55% at 50% -5%, rgba(124,136,255,0.14), transparent 70%)' }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(163,168,195,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          aria-hidden="true"
        />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-14 lg:flex-row lg:gap-10">
          <div className="flex-1 text-center lg:text-left">
            <p className="eyebrow animate-fade-up">Private location sharing for families</p>
            <h1
              className="mt-5 text-5xl font-semibold leading-[1.03] tracking-[-0.035em] text-dark-text md:text-7xl animate-fade-up"
              style={{ animationDelay: '0.08s' }}
            >
              Never wonder<br />
              <span className="accent-serif text-gradient text-gradient-anim">where they are</span> again.
            </h1>
            <p
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-dark-muted md:text-xl lg:mx-0 animate-fade-up"
              style={{ animationDelay: '0.16s' }}
            >
              A live, private map of the people you love — with an SOS that rings, a crash check, and an
              alert when they get home. <span className="text-dark-text">Your location is never sold.</span>
            </p>
            <div id="download" className="mt-9 animate-fade-up" style={{ animationDelay: '0.24s' }}>
              <StoreButtons align="start" />
            </div>
            <p className="mt-5 text-xs text-dark-muted animate-fade-up" style={{ animationDelay: '0.3s' }}>
              Free to start · iPhone (iOS 17+) and Android (7.0+) · English for now
            </p>
          </div>
          <div className="flex w-full flex-1 justify-center">
            <HeroPhoneCarousel />
          </div>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────────────── */}
      <div className="border-y border-white/[0.06]">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-4 px-6 py-6 md:grid-cols-4">
          {[
            { t: 'Never sold. No ads.', p: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z' },
            { t: 'Encrypted on your phone', p: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
            { t: 'One plan, whole circle', p: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
            { t: 'Gentle on battery', p: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
          ].map(({ t, p }) => (
            <div key={t} className="flex items-center justify-center gap-2.5 text-sm text-dark-muted">
              <svg className="h-4 w-4 shrink-0 text-primary-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={p} />
              </svg>
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHead eyebrow="How it works" title={<>Up and running in <Accent>minutes</Accent></>} />
          <div className="relative mt-14">
          <div className="absolute left-[16.67%] right-[16.67%] top-5 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent md:block" aria-hidden="true" />
          <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
            {[
              { n: '1', t: 'Create your account', d: 'Sign in with Apple, Google or your email. You must be 18 or older to sign up.' },
              { n: '2', t: 'Invite your people', d: 'Send each person a single-use link or QR code. Everyone decides for themselves whether to share.' },
              { n: '3', t: 'See each other, live', d: 'Everyone who shares appears on the map. SOS, “Arrived safely” and place alerts are one tap away.' },
            ].map((s) => (
              <li key={s.n} className="reveal relative text-center">
                <span className="relative mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-dark-bg text-sm font-semibold text-primary-soft">
                  {s.n}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-dark-text">{s.t}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-dark-muted">{s.d}</p>
              </li>
            ))}
          </ol>
          </div>
        </div>
      </section>

      {/* ── Features (bento) ─────────────────────────────────────────────── */}
      <section id="features" className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            eyebrow="Features"
            title={<>Everything <Accent>your circle</Accent> needs</>}
            sub="Built for the moments that matter — and quiet the rest of the time."
          />

          {/* Old links to /#safety (the previous page had a Safety section) land on the safety tiles. */}
          <span id="safety" className="block scroll-mt-24" aria-hidden="true" />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Tile className="md:col-span-2 lg:row-span-2" visualClass="min-h-[300px]" visual={<MapVisual />} title="A live map, and places that tell you"
              body="See everyone who shares with you, updated as they move. Save home, school or work and get an alert when someone arrives or leaves — 2 places free, up to 100 with a plan." />
            <Tile visual={<SosVisual />} title="An SOS that gets heard"
              body="One press alerts your whole circle with your exact location — on Android it rings through silent mode. See who has seen it and who is on the way; if nobody answers in 3 minutes, everyone is alerted again." />
            <Tile visual={<CrashVisual />} title="Crash check"
              body="If your phone senses a crash while you’re moving, it asks “Are you OK?”. No answer in 30 seconds, and your circle gets an SOS with your location." />
            <Tile visual={<RelayVisual />} title="Gets through with no signal"
              body="Out of coverage or data? Nearby Loxymity phones can carry your encrypted location — or your SOS — until one of them is online. They can’t read what they carry." />
            <Tile visual={<DriveVisual />} badge="Platinum" title="Honest driving reports"
              body="Every drive scored, with time stuck in traffic kept apart from time moving — so a jam never costs the driver. Plus a road-smoothness reading." />
            <Tile visual={<ChatVisual />} title="Chat and calls, built in"
              body="Circle chat, private messages, and “On my way” or “Arrived safely” in one tap. Call anyone in your circle by name — voice with any plan, video from Platinum." />
          </div>

          <div className="reveal mt-10">
            <p className="text-center text-sm font-medium text-dark-text">Also included</p>
            <ul className="mx-auto mt-4 flex max-w-4xl flex-wrap justify-center gap-2">
              {[
                'Day timeline & replay',
                'History: 2 days free, up to 180',
                'Family schedule: on time or late',
                'Live mode for the moments that matter',
                'Street View on any pin',
                'Temporary circles that end on their own',
                'Share links for people without the app',
                'Low-battery & speeding alerts',
                'Loxy, the in-app assistant',
                'Vault backup only you can open',
                'App Lock with Face ID or fingerprint',
                'Pause sharing any time',
                'Block & report',
              ].map((t) => (
                <li key={t} className="rounded-full border border-white/[0.07] bg-white/[0.02] px-3.5 py-1.5 text-[13px] text-dark-muted">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── More than a dot (carousel) ───────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <SectionHead eyebrow="Smart extras" title={<>More than a <Accent>dot on a map</Accent></>} />
          <div className="mt-12">
            <DifferentiatorCarousel />
          </div>
        </div>
      </section>

      {/* ── Coming soon ─────────────────────────────────────────────────── */}
      <section id="coming-soon" className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <SectionHead eyebrow="Coming soon" title={<>On <Accent>the way</Accent></>} sub="Not available yet — here’s what we’re building next." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {COMING_SOON.map((c) => (
              <div key={c.title} className="reveal card-premium rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <svg className="h-5 w-5 text-primary-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={c.icon} />
                    </svg>
                  </span>
                  <span className="tag-soon">Coming soon</span>
                </div>
                <h3 className="mt-5 font-semibold text-dark-text">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dark-muted">{c.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-dark-muted">
            These features are in development and not part of any plan yet. What they include, and when they arrive, may change.
          </p>
        </div>
      </section>

      {/* ── Privacy ─────────────────────────────────────────────────────── */}
      <section id="privacy" className="border-y border-white/[0.06] bg-dark-surface/40 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHead eyebrow="Privacy" title={<>Private <Accent>by design</Accent></>} sub="It’s your family’s location. We treat it that way." />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: 'Never sold', d: 'Your location is never sold, never used for ads and never used to train AI.', p: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z' },
              { t: 'You decide who sees you', d: 'Only the circles you join, and anyone you send a share link to. Pause, leave or delete your account at any time. Infinite adds ghost mode.', p: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
              { t: 'Encrypted on your phone', d: 'What the app keeps on your phone is encrypted, App Lock adds Face ID or fingerprint, and Vault backups open only with your password.', p: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
              { t: 'Straight about the limits', d: 'Everything is encrypted on the way and protected on our servers, but not end-to-end encrypted — that is how alerts and SOS work. Calls are not recorded.', p: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z' },
            ].map((x) => (
              <div key={x.t} className="reveal card-premium rounded-3xl p-6">
                <svg className="h-6 w-6 text-primary-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={x.p} />
                </svg>
                <h3 className="mt-4 font-semibold text-dark-text">{x.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dark-muted">{x.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
            {/* Google Play's required website disclosure for background location (see the header). */}
            <div id="background-location" className="reveal rounded-3xl border border-white/[0.07] bg-dark-bg/60 p-6">
              <h3 className="font-semibold text-dark-text">Location in the background</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark-muted">
                Loxymity collects location data to let the people in your circle see where you are, even when the app
                is closed or not in use. The same location powers place alerts, SOS, crash check and drive reports.
                Sharing is opt-in, you choose who is in your circle, and you can pause it at any time. Your location is
                never sold and never used for ads.
              </p>
            </div>
            <div className="reveal flex flex-col justify-center rounded-3xl border border-white/[0.07] bg-dark-bg/60 p-6">
              <p className="text-sm leading-relaxed text-dark-muted">
                Every detail — what we collect, who can see it, how long we keep it and your rights — is in plain words in
                our Privacy Policy.
              </p>
              <a href="/privacy/" className="mt-4 text-sm font-semibold text-primary-soft hover:underline">Read the Privacy Policy →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="relative overflow-hidden px-6 py-24">
        <div className="aurora" aria-hidden="true"><span className="a1" /><span className="a2" /></div>
        <div className="relative z-10 mx-auto max-w-6xl">
          <SectionHead
            eyebrow="Pricing"
            title={<>One plan covers <Accent>the whole circle</Accent></>}
            sub="Start free. Plans are priced per circle, never per person — one person pays and everyone in the circle gets the plan on their own free account."
          />
          <div className="mt-12">
            <PricingCards />
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {['Try Platinum free for 7 days', 'Cancel any time in your store account', 'No ads, ever'].map((r) => (
              <div key={r} className="flex items-center gap-2 text-sm text-dark-muted">
                <svg className="h-4 w-4 shrink-0 text-status-ok" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                {r}
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-dark-muted">
            Prices shown in US dollars, rupees, euros and pounds; other regions are billed the store&apos;s local price,
            with taxes as your store applies them. The free trial is on Platinum annual for one circle, once per store
            account, and becomes a paid plan unless you cancel at least 24 hours before it ends. Free circles hold 5
            people, Gold 10, Platinum and Infinite 15. See the <a href="/terms/#plans" className="underline hover:text-dark-text">plan terms</a>.
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <SectionHead eyebrow="FAQ" title={<>Questions, <Accent>answered</Accent></>} />
          <div className="mt-12 divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-medium leading-snug text-dark-text">
                  <span>{q}</span>
                  <svg className="faq-plus h-5 w-5 shrink-0 text-dark-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </summary>
                <div className="mt-3 pr-8 text-sm leading-relaxed text-dark-muted">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── For organisations ───────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="reveal card-premium mx-auto flex max-w-4xl flex-col items-center justify-between gap-5 rounded-3xl p-8 text-center sm:flex-row sm:text-left">
          <div>
            <p className="font-semibold text-dark-text">For organisations</p>
            <p className="mt-1 text-sm text-dark-muted">
              Lone-worker safety, a family-safety benefit for your people, care organisations, and partnerships — always
              with the person in control.
            </p>
          </div>
          <a href="/business/" className="shrink-0 rounded-full border border-white/[0.1] px-6 py-2.5 text-sm font-semibold text-dark-text transition-colors hover:bg-white/5">
            Talk to us
          </a>
        </div>
      </section>

      {/* ── Download CTA ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-28 text-center">
        <div className="absolute inset-x-0 top-0 hairline" aria-hidden="true" />
        <div className="aurora" aria-hidden="true"><span className="a1" /><span className="a3" /></div>
        <div className="relative z-10 mx-auto max-w-2xl">
          <div className="relative mx-auto mb-10 flex h-20 w-20 items-center justify-center" aria-hidden="true">
            <span className="absolute inset-0 rounded-[1.4rem] bg-primary/25 animate-beacon-ring" />
            <span className="absolute inset-0 rounded-[1.4rem] bg-primary/20 animate-beacon-ring" style={{ animationDelay: '1.5s' }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon-192.png" alt="" width={80} height={80} className="relative h-20 w-20 rounded-[1.4rem] shadow-2xl" />
          </div>
          <h2 className="text-4xl font-semibold tracking-[-0.03em] text-dark-text md:text-5xl">
            Bring your people <Accent>closer</Accent>.
          </h2>
          <p className="mt-4 text-lg text-dark-muted">Free to download. Free to start.</p>
          <StoreButtons className="mt-10" />
        </div>
      </section>

      <SiteFooter showStores={false} />
    </div>
  );
}

/* ── Pieces ───────────────────────────────────────────────────────────── */

function Accent({ children }: { children: React.ReactNode }) {
  return <span className="accent-serif text-gradient">{children}</span>;
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: string }) {
  return (
    <div className="reveal mx-auto max-w-2xl text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-dark-text md:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-lg leading-relaxed text-dark-muted">{sub}</p>}
    </div>
  );
}

// `reveal` (an animation that owns `transform`) sits on the wrapper and `lift` (a hover transform)
// on the card inside it — on one element the animation's fill would cancel the hover lift.
function Tile({ title, body, visual, badge, className = '', visualClass = 'min-h-[170px]' }: {
  title: string; body: string; visual: React.ReactNode; badge?: string; className?: string; visualClass?: string;
}) {
  return (
    <div className={`reveal ${className}`}>
      <div className="card-premium lift relative flex h-full flex-col overflow-hidden rounded-3xl">
        <div className={`relative flex-1 border-b border-white/[0.05] ${visualClass}`} aria-hidden="true">{visual}</div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-dark-text">{title}</h3>
            {badge && (
              <span className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-soft">
                {badge}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-dark-muted">{body}</p>
        </div>
      </div>
    </div>
  );
}

/* Tile visuals: pure CSS/SVG, decorative (aria-hidden on the wrapper), all motion off for
   prefers-reduced-motion (globals.css). */

function GridBackdrop() {
  return (
    <>
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',
        backgroundSize: '24px 24px',
      }} />
      <div className="absolute inset-x-0 top-[44%] h-[3px] bg-white/[0.04]" />
      <div className="absolute inset-y-0 left-[30%] w-[3px] bg-white/[0.04]" />
      <div className="absolute inset-y-0 left-[68%] w-[3px] bg-white/[0.04]" />
    </>
  );
}

function Dot({ color, top, left, ring = false }: { color: string; top: string; left: string; ring?: boolean }) {
  return (
    <div className="absolute" style={{ top, left }}>
      {/* Centred with margins, not translate: the ring's animation owns `transform`. */}
      {ring && <span className="absolute left-0 top-0 -ml-[15px] -mt-[15px] h-[30px] w-[30px] rounded-full animate-beacon-ring" style={{ backgroundColor: `${color}40` }} />}
      <span className="relative block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/80" style={{ backgroundColor: color }} />
    </div>
  );
}

function MapVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0B0E22]">
      <GridBackdrop />
      {/* Roads + a park: enough map to read as a city at a glance. */}
      <svg viewBox="0 0 600 340" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <rect x="380" y="210" width="150" height="90" rx="18" fill="rgba(16,185,129,0.06)" />
        <path d="M-20 250 C 120 230, 210 260, 330 200 S 520 120, 640 140" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="14" strokeLinecap="round" />
        <path d="M150 -20 C 170 90, 120 180, 160 360" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" strokeLinecap="round" />
        <path d="M-20 90 L 640 60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" strokeLinecap="round" />
        <path d="M150 230 C 200 210, 260 150, 345 110" fill="none" stroke="#7C88FF" strokeOpacity="0.55" strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round" />
      </svg>
      <span className="absolute left-[14%] top-[56%] -translate-x-1/2 translate-y-4 rounded-md border border-white/10 bg-dark-bg/80 px-2 py-0.5 text-[10px] text-dark-muted">Home</span>
      <span className="absolute left-[80%] top-[16%] -translate-x-1/2 rounded-md border border-white/10 bg-dark-bg/80 px-2 py-0.5 text-[10px] text-dark-muted">Office</span>
      <div className="absolute left-[58%] top-[30%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/50 bg-primary/[0.06]" />
      <span className="absolute left-[58%] top-[30%] -translate-x-1/2 -translate-y-[4.6rem] rounded-md border border-primary/30 bg-dark-bg/90 px-2 py-0.5 text-[10px] text-primary-soft">School</span>
      <Dot color="#10B981" top="34%" left="60%" ring />
      <Dot color="#7C88FF" top="56%" left="14%" ring />
      <Dot color="#F59E0B" top="24%" left="80%" />
      <div className="absolute bottom-5 left-1/2 w-[min(88%,320px)] -translate-x-1/2">
        <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-dark-surface/95 px-4 py-3 shadow-2xl backdrop-blur animate-toast">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-status-ok/15">
            <svg className="h-4 w-4 text-status-ok" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
          </span>
          <div className="min-w-0 text-left">
            <p className="truncate text-[13px] font-semibold text-dark-text">Rohan arrived at School</p>
            <p className="text-[11px] text-dark-muted">Place alert · just now</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SosVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#140B16]">
      <span className="absolute h-16 w-16 rounded-full bg-status-sos/30 animate-beacon-ring" />
      <span className="absolute h-16 w-16 rounded-full bg-status-sos/25 animate-beacon-ring" style={{ animationDelay: '1s' }} />
      <span className="absolute h-16 w-16 rounded-full bg-status-sos/20 animate-beacon-ring" style={{ animationDelay: '2s' }} />
      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#DC2626] text-sm font-bold tracking-wider text-white shadow-[0_0_40px_rgba(239,68,68,0.45)]">SOS</span>
    </div>
  );
}

function CrashVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-5 bg-[#0B0E22]">
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 40 40" className="h-20 w-20 -rotate-90">
          <circle cx="20" cy="20" r="17" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
          <circle cx="20" cy="20" r="17" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" pathLength={1} className="animate-countdown" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-dark-text">30</span>
      </div>
      <div className="text-left">
        <p className="text-sm font-semibold text-dark-text">Are you OK?</p>
        <span className="mt-2 inline-block rounded-full bg-white/[0.08] px-3 py-1 text-xs font-semibold text-dark-text">I’m OK</span>
      </div>
    </div>
  );
}

function RelayVisual() {
  const Phone = ({ dim = false }: { dim?: boolean }) => (
    <span className={`relative z-10 flex h-10 w-6 items-center justify-center rounded-md border ${dim ? 'border-white/15 bg-dark-bg' : 'border-primary/50 bg-primary/10'}`}>
      <span className={`h-1 w-1 rounded-full ${dim ? 'bg-white/30' : 'bg-primary-soft'}`} />
    </span>
  );
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0B0E22]">
      <div className="relative flex w-[78%] items-center justify-between">
        <div className="absolute inset-x-3 top-1/2 border-t border-dashed border-white/15" />
        <span className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary-soft shadow-[0_0_10px_#8C97FF] animate-hop" />
        <div className="flex flex-col items-center gap-1.5"><Phone dim /><span className="text-[10px] text-dark-muted">No signal</span></div>
        <div className="flex flex-col items-center gap-1.5"><Phone /><span className="text-[10px] text-dark-muted">Nearby phone</span></div>
        <div className="flex flex-col items-center gap-1.5">
          <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-status-ok/40 bg-status-ok/10">
            <svg className="h-5 w-5 text-status-ok" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" /></svg>
          </span>
          <span className="text-[10px] text-dark-muted">Your circle</span>
        </div>
      </div>
    </div>
  );
}

function DriveVisual() {
  return (
    <div className="absolute inset-0 bg-[#0B0E22]">
      <GridBackdrop />
      <svg viewBox="0 0 300 150" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <path d="M20 125 C 70 120, 70 70, 120 72 S 180 110, 215 60 S 260 30, 282 25" fill="none" stroke="rgba(124,136,255,0.18)" strokeWidth="6" strokeLinecap="round" />
        <path d="M20 125 C 70 120, 70 70, 120 72 S 180 110, 215 60 S 260 30, 282 25" fill="none" stroke="#7C88FF" strokeWidth="3" strokeLinecap="round" pathLength={1} className="animate-draw" />
        <circle cx="20" cy="125" r="5" fill="#10B981" />
        <circle cx="282" cy="25" r="5" fill="#F5F3EE" />
      </svg>
      <div className="absolute right-4 top-4 rounded-xl border border-white/[0.08] bg-dark-bg/85 px-3 py-2 text-left backdrop-blur">
        <p className="text-[10px] uppercase tracking-wider text-dark-muted">Score</p>
        <p className="text-lg font-semibold leading-tight text-dark-text">92 <span className="text-sm text-status-ok">A</span></p>
      </div>
    </div>
  );
}

function ChatVisual() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-2 bg-[#0B0E22] px-6 py-5">
      <div className="max-w-[75%] self-start rounded-2xl rounded-bl-md bg-white/[0.07] px-3.5 py-2 text-[12px] text-dark-text animate-bubble">
        Leaving the office now
      </div>
      <div className="max-w-[75%] self-end rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-[12px] font-medium text-dark-bg animate-bubble" style={{ animationDelay: '0.9s' }}>
        On my way 🚗
      </div>
      <div className="flex max-w-[75%] items-center gap-2 self-start rounded-2xl rounded-bl-md bg-status-ok/15 px-3.5 py-2 text-[12px] text-dark-text animate-bubble" style={{ animationDelay: '1.8s' }}>
        <svg className="h-3.5 w-3.5 text-status-ok" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
        Arrived safely
      </div>
    </div>
  );
}

/* ── Content ──────────────────────────────────────────────────────────── */

const COMING_SOON = [
  {
    title: 'Ask Alexa',
    body: 'Ask out loud where your family is — hands-free, from the kitchen or the car.',
    icon: 'M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z',
  },
  {
    title: 'SOS through the iPhone silent switch',
    body: 'Today an iPhone SOS breaks through Focus, but the silent switch can mute it. Ringing on silent needs Apple’s approval — we’re working on it.',
    icon: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
  },
  {
    title: 'Buy on loxymity.com',
    body: `Pay in rupees by UPI, card or net banking, about ${WEB_DISCOUNT_PCT}% less than in the app — prepaid, and never renewed by itself.`,
    icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z',
  },
  {
    title: 'More languages',
    body: 'Loxymity in German, French and Spanish first, with more to follow.',
    icon: 'M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802',
  },
];

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: 'Is my location always being shared?',
    a: 'Only while you choose to share. Turn off “Share my location” in Settings and your phone stops sending new positions — your circle then sees only the last location you shared, and when. You can leave a circle at any time, and on Infinite go into ghost mode.',
  },
  {
    q: 'Who can see where I am?',
    a: 'The people in the circles you join. Circles are invite-only: each invite is a single-use code, and invites sent by ordinary members wait for an owner’s approval. A share link you create shows your live location to anyone who has it until it expires (at most 24 hours). If someone in your circle links WhatsApp, they — and anyone who can use that WhatsApp account — can ask where you are, unless you are in ghost mode, have paused sharing or have blocked them. Nobody else can.',
  },
  {
    q: 'Will Loxymity drain my battery?',
    a: 'It is designed not to. There is no fixed polling interval: your phone reports roughly once a minute while you move and about every ten minutes when you are still, and slows down further on low battery unless you are charging or driving. Live mode, an active trip or an SOS report faster for a short time, because that is when it matters.',
  },
  {
    q: 'What happens when someone sends an SOS?',
    a: 'Everyone in the circle gets an urgent alert with the sender’s exact location, even if the app is closed. On Android it uses an alarm channel that rings through silent mode; on iPhone it is a time-sensitive alert that breaks through Focus, but the ring/silent switch can still silence it. Members tap “On my way”, call, or open the map, and the sender sees who has seen it. If nobody responds within three minutes, the circle is alerted again. Loxymity is not an emergency service — always call your local emergency number too.',
  },
  {
    q: 'What is the crash check?',
    a: 'If your phone senses a crash while you are moving, Loxymity asks “Are you OK?” with a 30-second countdown. Tap “I’m OK” and nothing is sent; if you don’t answer, your circle gets an SOS with your location. If notifications are off for Loxymity it cannot ask, so it sends straight away. It is on by default and you can turn it off in Settings. It relies on your phone’s motion sensors, so it can miss a crash or react to a hard knock.',
  },
  {
    q: 'How does it work when my phone has no signal?',
    a: 'Other Loxymity phones nearby can carry your location — or your SOS — over Bluetooth until one of them gets online. The phone carrying it cannot read it; our server opens it and delivers it only to your circles. It needs another Loxymity phone close by, works best between Android phones, and while backgrounded an iPhone can only be found by other iPhones. You can turn it off in Settings.',
  },
  {
    q: 'How accurate are locations, alerts and driving scores?',
    a: 'They are good estimates, not guarantees. A phone’s location can be off by tens or hundreds of metres, late, or missing — when the phone is off, has no signal, is in battery saver, or its maker limits background apps. A “left” alert waits for a second reading outside the place, so it can arrive a little late. Driving scores, speeds and road smoothness are for your own information and must not be used for insurance, work or legal decisions.',
  },
  {
    q: 'Do I have to buy a plan for every family member?',
    a: 'No. A plan covers circles, not people. Everyone gets 2 free circles; one plan covers 1, 2 or 3 circles, and everyone in a covered circle gets the plan’s features on their own free account. Plans are bought in the app through the App Store or Google Play.',
  },
  {
    q: 'What happens to my history if I lose my phone?',
    a: 'Whatever is within your plan’s window is on our servers and syncs to your new phone. Older history lives only on your old phone — unless you use Vault, a backup encrypted with a password only you know, which comes with a plan for the person who pays. We cannot read it, and we cannot recover it if you forget the password.',
  },
  {
    q: 'Are calls and messages private?',
    a: 'In-app calls are not recorded. Calls, messages and locations are encrypted on the way and protected on our servers, but they are not end-to-end encrypted — that is how alerts, history and SOS can work. You can block anyone, and report any message to us; we keep a copy of a reported message so it can be looked into.',
  },
  {
    q: 'Can I use Loxymity to track employees or a team?',
    a: (
      <>
        Loxymity is made for families and close friends who choose to share — it is not a tool for monitoring employees.
        Using it to monitor employees, drivers, students or anyone else for an organisation makes you responsible for
        complying with privacy and employment law, as our <a href="/terms/#your-responsibilities" className="text-primary-soft hover:underline">Terms</a> explain.
        Never track anyone without their knowledge and agreement. For organisations we offer safety services that people
        control, under a written agreement: <a href="/business/" className="text-primary-soft hover:underline">Loxymity for organisations</a>.
      </>
    ),
  },
  {
    q: 'Is my data ever sold?',
    a: (
      <>
        Never — and there is no advertising. We use service providers to run the app (for example Supabase, our database
        in Mumbai, India), and each may use data only to provide its service to us. The full list is in our{' '}
        <a href="/privacy/#providers" className="text-primary-soft hover:underline">Privacy Policy</a>.
      </>
    ),
  },
];
