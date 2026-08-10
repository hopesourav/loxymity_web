import { LogoFull } from './_components/Logo';
import { DifferentiatorCarousel } from './_components/DifferentiatorCarousel';
import { HeroPhoneCarousel } from './_components/HeroPhoneCarousel';

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-bg">

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/85 backdrop-blur-lg border-b border-dark-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <LogoFull className="text-2xl font-bold flex-shrink-0" />
          <div className="hidden md:flex items-center gap-7 text-sm font-hud font-semibold uppercase tracking-wide text-dark-muted">
            <a href="#features"    className="hover:text-dark-text transition-colors">Features</a>
            <a href="#safety"      className="hover:text-dark-text transition-colors">Safety</a>
            <a href="#how-it-works" className="hover:text-dark-text transition-colors">How it works</a>
            <a href="#pricing"     className="hover:text-dark-text transition-colors">Pricing</a>
            <a href="#faq"         className="hover:text-dark-text transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/dashboard/login/"
              className="text-sm font-semibold text-dark-muted hover:text-dark-text transition-colors"
            >
              Pro Dashboard
            </a>
            <a
              href="#download"
              className="bg-primary hover:bg-primary-dark text-dark-bg text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              Get the App
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-0 px-6 text-center bg-dark-bg overflow-hidden">
        {/* Ambient aurora */}
        <div className="aurora" aria-hidden="true">
          <span className="a1" /><span className="a2" /><span className="a3" />
        </div>
        {/* Radial glow */}
        <div
          className="absolute inset-x-0 top-0 h-[560px] pointer-events-none animate-glow-breathe"
          style={{ background: 'radial-gradient(ellipse 80% 55% at 50% -5%, rgba(201,162,39,0.14), transparent 70%)' }}
        />
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(168,162,158,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 gradient-border card-premium text-dark-muted font-hud uppercase tracking-wide text-sm font-semibold px-4 py-1.5 rounded-full mb-6 animate-fade-up">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-halo" />
            The family locator that never sells your data
          </div>
          <h1 className="font-display text-dark-text text-5xl md:text-[4.25rem] font-semibold tracking-tight leading-[1.08] mb-6 animate-fade-up" style={{ animationDelay: '0.08s' }}>
            Never wonder<br />
            <span className="italic text-gradient text-gradient-anim">where they are</span> again.
          </h1>
          <p className="text-xl text-dark-muted max-w-xl mx-auto mb-6 leading-relaxed animate-fade-up" style={{ animationDelay: '0.16s' }}>
            A private, real-time map of everyone you love — with SOS, safety check-ins,
            and instant answers from WhatsApp &amp; Alexa. All the safety of the big
            trackers, none of the data-selling. <span className="text-dark-text font-medium">Your location is never sold. Ever.</span>
          </p>
          <p className="text-sm text-dark-muted mb-10 animate-fade-up" style={{ animationDelay: '0.24s' }}>Free to start · Peace of mind from less than 50¢ a day.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.32s' }} id="download">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-3 bg-dark-surface hover:bg-dark-border border border-dark-border text-dark-text font-semibold px-7 py-4 rounded-2xl transition-colors text-base"
            >
              <AppleIcon />
              Download on the App Store
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark text-dark-bg font-semibold px-7 py-4 rounded-2xl transition-colors text-base"
            >
              <PlayIcon dark />
              Get it on Google Play
            </a>
          </div>
        </div>

        {/* Phone mockup — auto-rotating app scenes */}
        <HeroPhoneCarousel />
      </section>

      {/* ── Trust strip ──────────────────────────────────────────────────── */}
      <div className="border-b border-dark-border bg-dark-bg">
        <div className="max-w-5xl mx-auto px-6 py-7 flex flex-wrap justify-center gap-x-10 gap-y-3">
          {[
            { label: 'Never sold. Ever.',        path: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z' },
            { label: 'End-to-end encrypted',    path: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
            { label: 'iOS & Android',           path: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3v.75h-3v-.75z' },
            { label: 'Adaptive battery tracking', path: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
            { label: 'No ads. Ever.',            path: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
            { label: 'Real-time. No refresh.',   path: 'M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
          ].map(({ label, path }) => (
            <div key={label} className="flex items-center gap-2 text-dark-muted text-sm font-medium">
              <span className="w-7 h-7 rounded-full border border-accent-cyan/25 bg-dark-surface flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d={path} />
                </svg>
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Features (Area 2 — Everything you get) ───────────────────────── */}
      <section id="features" className="py-24 px-6 bg-dark-bg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 gradient-border card-premium text-accent-cyan font-hud uppercase tracking-wide text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-accent-cyan rounded-full" />
              Everything you get
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-dark-text mb-4 tracking-tight">Everything <span className="text-gradient">your circle</span> needs</h2>
            <p className="text-lg text-dark-muted max-w-xl mx-auto">One app for the whole family — real-time safety, smart alerts, and answers you can just ask for.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                iconPath: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm4.5 0c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
                iconColor: 'text-accent-cyan', iconBg: 'bg-accent-cyan/10',
                title: 'Real-time location',
                desc: 'See exactly where everyone is on a live shared map, updated continuously. No refresh, no guessing.',
              },
              {
                iconPath: 'M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z',
                iconColor: 'text-accent-cyan', iconBg: 'bg-accent-cyan/10',
                title: 'Geofences & place alerts',
                desc: 'Draw zones around home, school, or work — get an alert the moment someone arrives or leaves.',
                badge: 'Premium',
              },
              {
                iconPath: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
                iconColor: 'text-brand-danger', iconBg: 'bg-brand-danger/10',
                title: 'SOS emergency',
                desc: 'One tap sends an alert with exact GPS to every circle member — even if their app is closed.',
              },
              {
                iconPath: 'M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z',
                iconColor: 'text-brand-success', iconBg: 'bg-brand-success/10',
                title: 'WhatsApp & Alexa answers',
                desc: 'Ask “where’s mum?” in WhatsApp or out loud to Alexa — AI-powered, privacy-first answers. Nothing to open.',
              },
              {
                iconPath: 'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z',
                iconColor: 'text-accent-cyan', iconBg: 'bg-accent-cyan/10',
                title: 'In-app voice & video',
                desc: 'Call any member by name, right from the map — no phone number needed.',
                badge: 'Premium',
              },
              {
                iconPath: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
                iconColor: 'text-primary', iconBg: 'bg-primary/10',
                title: 'Battery-friendly by design',
                desc: 'Adaptive tracking speeds up when moving and eases off when still — real-time when it counts, gentle on battery.',
              },
            ].map((f) => (
              <div key={f.title} className="card-premium gradient-border lift rounded-2xl p-7 group relative">
                {f.badge && (
                  <span className="absolute top-4 right-4 bg-accent-gold/12 text-accent-gold border border-accent-gold/30 font-hud uppercase text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {f.badge}
                  </span>
                )}
                <div className={`w-10 h-10 rounded-xl ${f.iconBg} flex items-center justify-center mb-4`}>
                  <svg className={`w-5 h-5 ${f.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d={f.iconPath} />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-dark-text mb-2 group-hover:text-accent-cyan transition-colors">{f.title}</h3>
                <p className="text-dark-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Detailed "everything else" box */}
          <div className="mt-6 card-premium gradient-border rounded-2xl p-8">
            <div className="flex items-center gap-2.5 mb-6">
              <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-display text-xl font-semibold text-dark-text">…and everything else, included</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
              {[
                { t: 'Private circles with owner approval' },
                { t: 'Full activity feed & history' },
                { t: 'Safety check-in' },
                { t: 'Member battery status', p: true },
                { t: 'Motion & stillness alerts' },
                { t: 'iBeacon / BLE tokens', p: true },
                { t: 'Street View on any pin', p: true },
                { t: 'Event circles (auto-dissolving)' },
                { t: 'Browser share links', p: true },
                { t: 'QR & link invites' },
                { t: 'Arrival & departure alerts', p: true },
                { t: 'On-device processing, never sold' },
              ].map((item) => (
                <div key={item.t} className="flex items-start gap-2.5 text-sm text-dark-muted">
                  <span className="mt-0.5"><CheckIcon /></span>
                  <span>
                    {item.t}
                    {item.p && <span className="ml-1.5 text-accent-gold/80 text-[10px] font-hud uppercase font-bold">Premium</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Differentiators carousel ───────────────────────────────────────── */}
      <section className="py-24 px-6 bg-dark-bg">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 text-primary font-hud uppercase tracking-wide text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-primary rounded-full" />
              What sets us apart
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-dark-text mb-4 tracking-tight">More than a <span className="text-gradient">dot on a map</span></h2>
            <p className="text-lg text-dark-muted max-w-xl mx-auto">The things other trackers don&apos;t do — and a privacy promise they can&apos;t make.</p>
          </div>
          <DifferentiatorCarousel />
        </div>
      </section>

      {/* ── Safety & trust (Area 3 — problem + safety + how-it-works merged) ─ */}
      <section id="safety" className="py-24 px-6 bg-dark-surface">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 gradient-border card-premium text-brand-danger font-hud uppercase tracking-wide text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-brand-danger rounded-full" />
              Safety &amp; trust
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-dark-text mb-4 tracking-tight">Trusted with <span className="text-gradient">the people you love</span></h2>
            <p className="text-lg text-dark-muted max-w-2xl mx-auto">Most family locators make you choose between safety and privacy. Here&apos;s the gap Loxymity closes — and how you start in minutes.</p>
          </div>

          {/* The problem / gap */}
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {[
              {
                iconPath: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
                title: 'They sell where you go',
                desc: 'A leading tracker was caught selling precise location data. When the app is “free,” your family’s movements are the product.',
              },
              {
                iconPath: 'M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5A2.25 2.25 0 012.25 12.75v0A2.25 2.25 0 014.5 10.5z',
                title: 'They kill your battery',
                desc: 'Constant fixed-interval polling drains phones by lunchtime — so people switch tracking off, exactly when it matters most.',
              },
              {
                iconPath: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm4.5 0c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
                title: 'They’re just a dot',
                desc: 'A pin on a map, no context, no answers. You still end up calling to ask “where are you?” — the one thing you wanted to avoid.',
              },
            ].map((p) => (
              <div key={p.title} className="bg-dark-bg gradient-border lift rounded-2xl p-7">
                <div className="w-10 h-10 rounded-xl bg-brand-danger/10 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-brand-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d={p.iconPath} />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-dark-text mb-2">{p.title}</h3>
                <p className="text-dark-muted text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center font-display text-2xl md:text-3xl font-semibold text-dark-text max-w-2xl mx-auto mb-6">
            Loxymity closes all three — <span className="text-gradient">and never sells your data.</span>
          </p>

          {/* Safety layer chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-20">
            {[
              { t: 'One-tap SOS', c: '#B5453F' },
              { t: 'Safety check-in', c: '#5C8F6B' },
              { t: 'Live activity feed', c: '#5F82A5' },
              { t: 'Motion & stillness alerts', c: '#C9A227' },
            ].map((chip) => (
              <span key={chip.t} className="inline-flex items-center gap-2 bg-dark-bg border border-dark-border rounded-full px-4 py-2 text-sm text-dark-text font-medium">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: chip.c }} />
                {chip.t}
              </span>
            ))}
          </div>

          {/* How it works */}
          <div id="how-it-works" className="scroll-mt-24">
            <div className="text-center mb-12">
              <h3 className="font-display text-3xl md:text-4xl font-semibold text-dark-text tracking-tight">Up and running in <span className="text-gradient">minutes</span></h3>
              <p className="text-dark-muted mt-2">No complicated setup. Download, invite, and go.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-7 left-[calc(16.67%+2.5rem)] right-[calc(16.67%+2.5rem)] h-px bg-dark-border" />
              {[
                { step: '01', title: 'Create your account', desc: 'Sign up with your email. We send a one-time code — no password to remember.' },
                { step: '02', title: 'Start or join a circle', desc: 'Create a circle and share the invite QR with the people you trust. Owner approval keeps it private.' },
                { step: '03', title: 'See your circle live', desc: 'Everyone appears on the shared map in real time. SOS, check-ins, and alerts are always one tap away.' },
              ].map((s) => (
                <div key={s.step} className="text-center relative">
                  <div className="font-display w-14 h-14 border border-accent-gold/40 bg-accent-gold/10 text-accent-gold font-semibold text-lg rounded-2xl flex items-center justify-center mx-auto mb-5">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-bold text-dark-text mb-2">{s.title}</h3>
                  <p className="text-dark-muted text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="relative overflow-hidden py-24 px-6 bg-dark-bg">
        <div className="aurora" aria-hidden="true"><span className="a1" /><span className="a2" /></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 gradient-border card-premium text-primary font-hud uppercase tracking-wide text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-primary rounded-full" />
              Pricing
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-dark-text mb-4 tracking-tight">What is <span className="text-gradient">knowing they&apos;re safe</span> worth?</h2>
            <p className="text-lg text-dark-muted max-w-xl mx-auto">Probably a lot. Loxymity is a few cents a day. Pick the features you need — never a per-person bill — and every plan keeps the promise: <span className="text-dark-text font-medium">we never sell your location data. Not to advertisers, not to data brokers, not to anyone.</span></p>
          </div>
          <p className="text-center text-dark-muted text-sm mb-12">Prices in USD, billed monthly. <span className="text-brand-success font-medium">Pay yearly and save up to 29%</span> — that&apos;s months free versus the monthly rate.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {[
              {
                name: 'Free',
                price: '$0',
                cadence: 'Forever free — no card required',
                daily: null,
                annual: null,
                cta: 'Start free',
                features: [
                  'Up to 5 members',
                  '2 days location history',
                  '2 geofences',
                  'Real-time shared map',
                  'SOS emergency alerts',
                  'Safety check-in & activity feed',
                  'WhatsApp & Alexa queries (10/mo)',
                ],
              },
              {
                name: 'Gold',
                price: '$7.99',
                cadence: 'per month',
                annualMo: '$5.83', annualSave: '27%', annualTotal: '$69.99',
                cta: 'Get Gold',
                features: [
                  'Everything in Free, plus:',
                  'Up to 10 members',
                  '30 days location history',
                  'In-app voice & video calls',
                  'Arrival & departure alerts',
                  'Member battery status',
                  'Browser share links · 1 iBeacon token',
                ],
              },
              {
                name: 'Platinum',
                price: '$14.99',
                cadence: 'per month',
                annualMo: '$10.83', annualSave: '28%', annualTotal: '$129.99',
                cta: 'Start 7-day free trial',
                highlight: true,
                badge: 'Most popular',
                features: [
                  'Everything in Gold, plus:',
                  'Up to 15 members',
                  '90 days location history',
                  'Unlimited voice & video calls',
                  'Street View on any pin',
                  'Driving reports & auto check-ins',
                  'WhatsApp & Alexa queries (30/day) · 20 beacons',
                ],
              },
              {
                name: 'Infinite',
                price: '$19.99',
                cadence: 'per month',
                annualMo: '$14.17', annualSave: '29%', annualTotal: '$169.99',
                cta: 'Go Infinite',
                features: [
                  'Everything in Platinum, plus:',
                  'Unlimited members',
                  '180 days location history',
                  'Privacy Shield — see who viewed you',
                  'Location blur & ghost mode',
                  'Retention control & data export',
                  'Priority support',
                ],
              },
            ].map((plan) => (
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
                {plan.annualMo ? (
                  <div className="rounded-lg bg-brand-success/8 border border-brand-success/20 px-2.5 py-2 mb-4">
                    <p className="text-brand-success text-xs font-bold leading-tight">
                      Pay yearly → {plan.annualMo}/mo
                      <span className="ml-1.5 bg-brand-success/15 rounded px-1 py-0.5 text-[10px]">save {plan.annualSave}</span>
                    </p>
                    <p className="text-dark-muted text-[10px] mt-0.5">{plan.annualTotal} billed once a year vs {plan.price}/mo</p>
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
          {/* Risk reversal */}
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {['7-day free Platinum trial', 'Cancel anytime', 'No ads, ever', 'Your data is never sold'].map((r) => (
              <div key={r} className="flex items-center gap-2 text-dark-muted text-sm font-medium">
                <svg className="w-4 h-4 text-brand-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                {r}
              </div>
            ))}
          </div>
          <p className="text-center text-dark-muted text-xs mt-6">Localized pricing shown in your region&apos;s store. Member counts are generous household caps — never per-seat billing.</p>
        </div>
      </section>

      {/* ── Privacy ──────────────────────────────────────────────────────── */}
      <section id="privacy" className="py-24 px-6 bg-dark-surface">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-dark-text mb-6 tracking-tight">Privacy first, <span className="text-gradient">always</span></h2>
            <div className="flex flex-col gap-4">
              {[
                'Your location is processed on-device where possible and never sold or shared with advertisers.',
                'You can pause or stop sharing at any time — instantly.',
                'Only circle members you approve can see your location.',
                'All data is encrypted in transit and at rest.',
                'Privacy Shield (Infinite): see who viewed you, blur your location, or go into ghost mode.',
                'Location history is automatically deleted after 30 days.',
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-accent-cyan/15 border border-accent-cyan/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-dark-muted text-base">{point}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-52 h-52 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-dark-border" />
              <div className="absolute inset-8 rounded-full border border-accent-cyan/20" />
              <div className="absolute inset-16 bg-accent-cyan/10 border border-accent-cyan/30 rounded-full flex items-center justify-center" style={{ boxShadow: '0 0 32px rgba(0,240,255,0.18)' }}>
                <svg className="w-10 h-10 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-6 bg-dark-bg">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-dark-text mb-4 tracking-tight">Frequently asked <span className="text-gradient">questions</span></h2>
            <p className="text-lg text-dark-muted">Everything you need to know before you download.</p>
          </div>
          <div className="flex flex-col divide-y divide-dark-border">
            {[
              {
                q: 'Is my location always being shared?',
                a: "No. You control your sharing at all times. You can pause location updates instantly from the app — when paused, circle members see you as offline and your position stops updating. You can resume at any time.",
              },
              {
                q: 'Will Loxymity drain my battery?',
                a: "Loxymity uses adaptive tracking that automatically adjusts based on your movement. When you're stationary, location updates slow down dramatically. When you're moving, accuracy increases. Most users see less than 3–5% additional battery use per day.",
              },
              {
                q: 'Who can see where I am?',
                a: "Only members of circles you've explicitly joined — and only after the circle owner has approved your request. No one outside your approved circles can see your location, ever.",
              },
              {
                q: 'Is Loxymity available on both iPhone and Android?',
                a: "Yes. Loxymity is available on both iOS and Android. All features, including real-time maps, SOS alerts, safety check-ins, iBeacon tracking, and geo-fencing, work across both platforms.",
              },
              {
                q: 'What happens when someone sends an SOS?',
                a: "Every circle member receives an immediate push notification — even if their app is closed — containing the exact GPS coordinates of the person in distress. There is no delay and no typing required. The app also logs the event in the activity feed.",
              },
              {
                q: 'How is this different from sharing location on WhatsApp or Google Maps?',
                a: "Those tools offer basic, temporary location sharing as a side feature. Loxymity is purpose-built for continuous family and friend tracking: a dedicated shared map, geofencing with custom dwell times, arrival/departure alerts, iBeacon support, battery status, SOS alerts, in-app voice and video calls, Street View on any pin, WhatsApp and Alexa location queries, and a full activity feed — all in one app, and your location is never sold.",
              },
              {
                q: 'Can I ask where someone is from WhatsApp or Alexa?',
                a: "Yes — this is one of the things that sets Loxymity apart. Link your account and simply ask “where’s mum?” in WhatsApp, or ask Alexa out loud, and get an instant, AI-powered answer from your live circle. It’s privacy-first: your location powers the answer and is never sold.",
              },
              {
                q: 'Can I see where someone was earlier today?',
                a: "Yes. Every plan includes location history — 2 days on Free, scaling up to 30, 90, and 180 days on Gold, Platinum, and Infinite. Tap any circle member on the map to replay their location trail and see exactly where they were and when.",
              },
              {
                q: 'Is my data ever sold or shared with third parties?',
                a: "Never. Loxymity has no advertising and your location data is not sold or shared with any third parties. We use Supabase for secure database hosting and RevenueCat for subscription management — both under strict data processing agreements.",
              },
            ].map(({ q, a }) => (
              <details key={q} className="py-5 group">
                <summary className="flex items-center justify-between cursor-pointer text-dark-text font-semibold text-base leading-snug pr-1 gap-4">
                  <span>{q}</span>
                  <svg className="faq-chevron w-5 h-5 text-dark-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-dark-muted text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Download CTA ─────────────────────────────────────────────────── */}
      <section
        className="relative py-24 px-6 overflow-hidden text-center"
        style={{ background: 'linear-gradient(180deg, #0A0C10 0%, #14171D 100%)' }}
      >
        <div
          className="absolute inset-x-0 top-0 h-72 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(201,162,39,0.12), transparent 70%)' }}
        />
        <div className="absolute top-0 left-0 right-0 hairline" />
        <div className="aurora" aria-hidden="true"><span className="a1" /><span className="a3" /></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex justify-center mb-8">
            <LogoFull className="text-4xl font-bold" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-dark-text mb-4 tracking-tight">Ready to <span className="text-gradient">stay connected</span>?</h2>
          <p className="text-dark-muted text-lg mb-10">Free to download. No subscription required to get started.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#" className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 hover:bg-gray-50 font-semibold px-7 py-4 rounded-2xl transition-colors text-base">
              <AppleIcon dark />
              App Store
            </a>
            <a href="#" className="inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark text-dark-bg font-semibold px-7 py-4 rounded-2xl transition-colors text-base">
              <PlayIcon dark />
              Google Play
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="py-12 px-6 bg-dark-bg border-t border-dark-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="mb-2">
              <LogoFull className="text-xl font-bold opacity-80" />
            </div>
            <p className="text-dark-muted text-sm">© {new Date().getFullYear()} Sawsib Infotech. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-dark-muted">
            <a href="/privacy" className="hover:text-dark-text transition-colors">Privacy Policy</a>
            <a href="/terms"   className="hover:text-dark-text transition-colors">Terms of Service</a>
            <a href="mailto:hello@loxymity.com" className="hover:text-dark-text transition-colors">Contact</a>
            <a href="/admin"   className="transition-colors" style={{ color: '#14171D' }}>Admin</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

function AppleIcon({ dark }: { dark?: boolean }) {
  return (
    <svg className={`w-5 h-5 flex-shrink-0 ${dark ? 'text-gray-900' : 'text-white'}`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function PlayIcon({ dark }: { dark?: boolean }) {
  return (
    <svg className={`w-5 h-5 flex-shrink-0 ${dark ? 'text-dark-bg' : 'text-white'}`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.18 23.82a2 2 0 001.76-.22l12.89-7.44-3.53-3.53-11.12 11.19zM20.83 9.58L17.96 7.9 14.1 11.76l3.87 3.87 2.89-1.67a2 2 0 000-4.38zM.46.4A2 2 0 000 1.74v20.52a2 2 0 00.46 1.34L.54 23.6l11.5-11.5v-.27L.54.4zM14.1 12.24L2.6.74l-.06.06 11.5 11.5.06-.06z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-accent-cyan/15 border border-accent-cyan/25">
      <svg className="w-3 h-3 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}
