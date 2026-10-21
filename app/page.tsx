import { LogoFull } from './_components/Logo';
import { DifferentiatorCarousel } from './_components/DifferentiatorCarousel';
import { HeroPhoneCarousel } from './_components/HeroPhoneCarousel';
import PricingCards from './_components/PricingCards';
import { APP_STORE_URL, PLAY_URL } from './_lib/appLinks';

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
            <a href="/business/"   className="hover:text-dark-text transition-colors">Business</a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/dashboard/login/"
              className="text-sm font-semibold text-dark-muted hover:text-dark-text transition-colors"
            >
              Dashboard
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
      <section className="relative pt-32 pb-8 lg:pb-10 px-6 bg-dark-bg overflow-hidden">
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

        <div className="relative max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-10">
          {/* Copy */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 gradient-border card-premium text-dark-muted font-hud uppercase tracking-wide text-sm font-semibold px-4 py-1.5 rounded-full mb-6 animate-fade-up">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-halo" />
              The family locator that never sells your data
            </div>
            <h1 className="font-display text-dark-text text-5xl md:text-[4.25rem] font-semibold tracking-tight leading-[1.08] mb-6 animate-fade-up" style={{ animationDelay: '0.08s' }}>
              Never wonder<br />
              <span className="italic text-gradient text-gradient-anim">where they are</span> again.
            </h1>
            <p className="text-xl text-dark-muted max-w-xl mx-auto lg:mx-0 mb-6 leading-relaxed animate-fade-up" style={{ animationDelay: '0.16s' }}>
              A private, real-time map of the people you love — with SOS that rings, a crash
              check that alerts your circle if you can&apos;t, driving reports, and answers from
              WhatsApp &amp; Alexa. Nearby Loxymity phones can even carry your location out when
              yours has no signal. <span className="text-dark-text font-medium">Your location is never sold. Ever.</span>
            </p>
            <p className="text-sm text-dark-muted mb-10 animate-fade-up" style={{ animationDelay: '0.24s' }}>Free to start · Peace of mind from less than 50¢ a day.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: '0.32s' }} id="download">
              <StoreButton store="apple" />
              <StoreButton store="google" primary />
            </div>
            <p className="text-xs text-dark-muted mt-4 animate-fade-up" style={{ animationDelay: '0.36s' }}>iPhone (iOS 17 or later) and Android (7.0 or later). English only for now.</p>
          </div>

          {/* Phone mockup — auto-rotating app scenes */}
          <div className="flex-1 flex justify-center lg:justify-center w-full">
            <HeroPhoneCarousel />
          </div>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────────────── */}
      <div className="border-b border-dark-border bg-dark-bg">
        <div className="max-w-5xl mx-auto px-6 py-7 flex flex-wrap justify-center gap-x-10 gap-y-3">
          {[
            { label: 'Location Data Never sold. Ever.',        path: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z' },
            { label: 'Encrypted on your phone', path: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
            { label: 'iOS & Android',           path: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3v.75h-3v-.75z' },
            { label: 'Adaptive battery tracking', path: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
            { label: 'No ads. Ever.',            path: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
            { label: 'Real-time. No refresh.',   path: 'M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
            { label: 'Works offline',            path: 'M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z' },
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
                title: 'Places & arrival alerts',
                desc: 'Save home, school or work and get a notification when someone arrives or leaves. Two places free, up to 100 with a plan.',
              },
              {
                iconPath: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
                iconColor: 'text-brand-danger', iconBg: 'bg-brand-danger/10',
                title: 'SOS that gets heard',
                desc: 'One press alerts your whole circle with your exact location. On Android it rings through silent mode. See who has seen it and who is on the way — and if nobody responds in 3 minutes, everyone is alerted again.',
              },
              {
                iconPath: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
                iconColor: 'text-brand-danger', iconBg: 'bg-brand-danger/10',
                title: 'Crash check',
                desc: 'If your phone senses a crash while you are moving, it asks “Are you OK?”. Tap “I’m OK” within 30 seconds — or your circle gets an SOS with your location.',
              },
              {
                iconPath: 'M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z',
                iconColor: 'text-brand-success', iconBg: 'bg-brand-success/10',
                title: 'WhatsApp & Alexa answers',
                desc: 'Link WhatsApp or Alexa and ask “where’s mum?” — get her place, how long ago and battery. Nothing to open. Opt-in.',
              },
              {
                iconPath: 'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z',
                iconColor: 'text-accent-cyan', iconBg: 'bg-accent-cyan/10',
                title: 'In-app voice & video',
                desc: 'Call any member by name, right from the map — no phone number needed. Voice calls come with every paid plan (anyone in a circle can answer, and during the hour after an SOS anyone can call); video comes with Platinum and Infinite. Voice calls between adults are recorded.',
              },
              {
                iconPath: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
                iconColor: 'text-primary', iconBg: 'bg-primary/10',
                title: 'Battery-friendly by design',
                desc: 'Adaptive tracking speeds up when moving and eases off when still — real-time when it counts, gentle on battery.',
              },
              {
                iconPath: 'M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z',
                iconColor: 'text-accent-cyan', iconBg: 'bg-accent-cyan/10',
                title: 'Keeps working with no signal',
                desc: 'Out of coverage, in a basement, out of data? Nearby Loxymity phones carry your encrypted location — or your SOS — until one of them reaches the internet. The phones carrying it cannot read it.',
              },
              {
                iconPath: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12',
                iconColor: 'text-primary', iconBg: 'bg-primary/10',
                title: 'Driving reports',
                desc: 'Every trip scored and graded, with time stuck in traffic separated from time actually moving — plus a road-smoothness reading. Road quality never counts against the driver.',
                badge: 'Platinum',
              },
              {
                iconPath: 'M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5',
                iconColor: 'text-accent-cyan', iconBg: 'bg-accent-cyan/10',
                title: 'Flight tracking',
                desc: 'Add a flight number and watch the aircraft move across the map. Everyone in the circle gets the landing notification — no more refreshing an airline app.',
              },
              {
                iconPath: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
                iconColor: 'text-brand-danger', iconBg: 'bg-brand-danger/10',
                title: 'Official hazard alerts',
                desc: 'Official cyclone, flood, heat and storm warnings for India and the US, matched against where your circle actually is — so you get the ones that matter.',
              },
              {
                iconPath: 'M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
                iconColor: 'text-brand-success', iconBg: 'bg-brand-success/10',
                title: 'Circle chat & messages',
                desc: 'Group chat for the circle and one-to-one messages, with “On my way” and “Arrived safely” as one tap. Messages relay over Bluetooth too, so they get through without a connection.',
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
                { t: 'Private, invite-only circles' },
                { t: 'Day timeline: stops, moves & replay' },
                { t: '“On my way” / “Arrived safely” in one tap' },
                { t: 'Loxy, the in-app assistant' },
                { t: 'Trips with a shared live ETA' },
                { t: 'Works offline — map, trail & history' },
                { t: 'Vault: backup only you can unlock', p: true },
                { t: 'Battery status, speeding & low-battery alerts' },
                { t: 'Family plans: on time, late or missed' },
                { t: 'Live mode for the next 15 minutes' },
                { t: 'Street View on any pin' },
                { t: 'Temporary circles that end on their own' },
                { t: 'Live share links for people without the app' },
                { t: 'Single-use invite links & QR codes' },
                { t: 'App Lock with Face ID or fingerprint' },
                { t: 'Place names you recognise, not coordinates' },
                { t: 'Give a week, get a week of Platinum' },
                { t: 'Pause sharing whenever you want' },
              ].map((item) => (
                <div key={item.t} className="flex items-start gap-2.5 text-sm text-dark-muted">
                  <span className="mt-0.5"><CheckIcon /></span>
                  <span>
                    {item.t}
                    {item.p && <span className="ml-1.5 text-accent-gold/80 text-[10px] font-hud uppercase font-bold">Paid plans</span>}
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
              { t: '“Arrived safely” in one tap', c: '#5C8F6B' },
              { t: 'Live activity feed', c: '#5F82A5' },
              { t: 'Crash check', c: '#C9A227' },
              { t: 'Official hazard alerts', c: '#B5453F' },
              { t: 'Works with no signal', c: '#5F82A5' },
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
                { step: '01', title: 'Create your account', desc: 'Sign in with Apple or Google, or with your email and a password. You must be 18 or older; children join through a parent’s invite.' },
                { step: '02', title: 'Start or join a circle', desc: 'Send a single-use invite link or QR code to each person you trust. Invites from members wait for an owner’s approval.' },
                { step: '03', title: 'See your circle live', desc: 'Everyone who agrees to share appears on the map in real time. SOS, “Arrived safely” and alerts are always one tap away.' },
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
            <p className="text-lg text-dark-muted max-w-xl mx-auto">Start free. Plans are priced per circle, never per person — and every plan keeps the promise: <span className="text-dark-text font-medium">we never sell your location data. Not to advertisers, not to data brokers, not to anyone.</span></p>
          </div>
          <p className="text-center text-dark-muted text-sm mb-12">Prices are what you pay each year or month. Choose annual or monthly, and how many circles the plan covers.</p>
          <div className="max-w-2xl mx-auto mb-12 card-premium gradient-border rounded-2xl p-6 text-center">
            <p className="text-dark-text font-semibold mb-1">One person pays. The whole circle is covered.</p>
            <p className="text-dark-muted text-sm leading-relaxed">When one member puts a circle on a plan, everyone in it gets the longer history, more places, driving reports, video minutes and Street View — on their own free account, at no extra cost. Nobody else has to buy anything.</p>
          </div>
          <PricingCards />
          {/* Risk reversal */}
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {['7-day free Platinum trial', 'Cancel anytime in your store account', 'No ads, ever', 'Your data is never sold'].map((r) => (
              <div key={r} className="flex items-center gap-2 text-dark-muted text-sm font-medium">
                <svg className="w-4 h-4 text-brand-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                {r}
              </div>
            ))}
          </div>
          <p className="text-center text-dark-muted text-xs mt-6">Prices shown in US dollars, rupees, euros and pounds; other regions are billed the store&apos;s local price, with taxes as your store applies them. Member counts are per circle, not seats — Free circles hold 5 people, Gold 10, Platinum and Infinite 15. See the <a href="/terms/#plans" className="underline hover:text-dark-text">plan terms</a>.</p>
        </div>
      </section>

      {/* ── Privacy ──────────────────────────────────────────────────────── */}
      <section id="privacy" className="py-24 px-6 bg-dark-surface">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-dark-text mb-6 tracking-tight">Privacy first, <span className="text-gradient">always</span></h2>
            <div className="flex flex-col gap-4">
              {[
                'Your location is never sold, never used for ads, and never used to train AI.',
                'Pause sharing at any time. Your circle then sees only your last shared location and when it was.',
                'Only the people in circles you join can see you — plus anyone you choose to send a share link to.',
                'Encrypted in transit and protected on our servers. What the app keeps on your phone is encrypted too, and App Lock adds Face ID or fingerprint.',
                'Privacy Shield (Infinite): see who viewed your location, go into ghost mode, auto-delete history, export your data.',
                'Your circle can open 2 days of history on Free, then 30, 90 or 180 days by plan. Your own phone keeps its copy for as long as you want, on every plan.',
                'A phone that relays someone else\u2019s location offline cannot read what it carries.',
                'In-app voice calls are recorded and kept 28 days (never when a child is on the call), and a Recording notice shows on every call. Messages and calls are not end-to-end encrypted.',
                'Block anyone, and report any message — we keep a copy and review every report.',
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
                a: 'Only while you choose to share. Turn off “Share my location” in Settings and your phone stops sending new positions — your circle then sees only the last location you shared and when. You can also leave a circle at any time, and on Infinite go into ghost mode.',
              },
              {
                q: 'Will Loxymity drain my battery?',
                a: 'It is designed not to. There is no fixed polling interval: your phone reports roughly once a minute while you move and about every ten minutes when you are still, and slows down further on low battery unless you are charging or driving. Live mode, an active trip or an SOS report faster for a short time, because that is when it matters.',
              },
              {
                q: 'Who can see where I am?',
                a: 'The people in the circles you join. A circle is invite-only: each invite is a single-use code, and invites sent by ordinary members wait for an owner to approve them. If you create a share link, anyone with that link can see your live location until it expires (at most 24 hours). If a member of your circle links WhatsApp or Alexa, they can ask where you are. Nobody else can.',
              },
              {
                q: 'Is Loxymity available on both iPhone and Android?',
                a: 'Yes — iPhone with iOS 17 or later, and Android 7.0 or later. Circles mix freely across the two. A few things differ by platform: on Android an SOS rings through silent mode, and some phone makers restrict background apps more than others. The app is in English.',
              },
              {
                q: 'What happens when someone sends an SOS?',
                a: 'Every member of the circle gets an urgent alert with the sender’s exact location, even if the app is closed. On Android it uses an alarm channel that rings through silent mode; on iPhone it is a time-sensitive alert that breaks through Focus, but the ring/silent switch can still silence it. Members tap “On my way”, call, or open the map, and the sender sees who has seen it. If nobody responds within three minutes, the circle is alerted again. Loxymity is not an emergency service — always call your local emergency number too.',
              },
              {
                q: 'What is the crash check?',
                a: 'If your phone senses a crash while you are moving, Loxymity asks “Are you OK?” with a 30-second countdown. Tap “I’m OK” and nothing is sent; if you don’t answer, your circle gets an SOS with your location. It is on by default and you can turn it off in Settings. It relies on your phone’s motion sensor, so it can miss a crash or trigger on a hard drop.',
              },
              {
                q: 'How is this different from sharing location on WhatsApp or Google Maps?',
                a: 'Those offer location sharing as a side feature. Loxymity is built for families: a shared map, places with arrival and leave alerts, history and a day timeline, SOS with responses, crash checks, driving reports, in-app calls and chat, trips with a live ETA, flight tracking, official hazard alerts, and answers from WhatsApp and Alexa — and nearby Loxymity phones can carry your location out when yours has no signal. Your location is never sold.',
              },
              {
                q: 'Can I ask where someone is from WhatsApp or Alexa?',
                a: 'Yes. Link your account and ask “where’s mum?” in WhatsApp, or ask Alexa out loud. You get the place, how long ago and battery. It is opt-in, uses your plan’s monthly assistant allowance, and anyone who can use your WhatsApp or Alexa device can ask too — so keep them secure.',
              },
              {
                q: 'Can I see where someone was earlier today?',
                a: 'Yes. Tap a member and open their day: stops, moves and a replay on the map. Your circle can open 2 days on Free, and 30, 90 or 180 days with Gold, Platinum or Infinite. Your own phone keeps its own record for as long as you want, on every plan.',
              },
              {
                q: 'What happens to my history if I lose my phone?',
                a: 'Whatever is within your plan’s window is on our servers and syncs to your new phone. Older history lives only on your old phone — unless you use Vault, a backup encrypted with a password only you know, available on paid plans. We cannot read it, and we cannot recover it if you forget the password.',
              },
              {
                q: 'Are in-app calls recorded?',
                a: 'Yes. In-app voice calls are recorded automatically from when the call starts ringing, and a “Recording” notice shows on the call screen. Recordings are encrypted, kept for 28 days and then deleted, and are not available in the app. Calls involving anyone under 18 are never recorded, and video calls are not recorded at present. Recording laws vary and some places require everyone’s consent, so tell the people you call — and use your ordinary phone dialler for anything you would rather not have recorded.',
              },
              {
                q: 'How can it work when my phone has no internet?',
                a: 'Other Loxymity phones nearby can carry your location — or your SOS — over Bluetooth until one of them gets online. The phone carrying it cannot read it; our server opens it and delivers it only to your circles. It works best between Android phones; while backgrounded, an iPhone can only be found by other iPhones. You can turn it off in Settings.',
              },
              {
                q: 'What is in a driving report?',
                a: 'Each trip gets a score and a grade, a route, distance and duration, speeding events, and an honest split between time moving and time stuck in traffic — plus a road-smoothness reading from your phone’s motion sensor that never counts against your score. Driving reports come with Platinum and Infinite, and everyone in a covered circle gets them. They are estimates for your own information.',
              },
              {
                q: 'Do I have to buy a plan for every family member?',
                a: 'No. A plan covers circles, not people. Everyone gets 2 free circles; one plan covers 1, 2 or 3 circles, and everyone in a covered circle gets the plan’s features on their own free account. Plans are bought in the app through the App Store or Google Play.',
              },
              {
                q: 'Can I use Loxymity to track employees or a team?',
                a: (
                  <>
                    Loxymity is made for families and close friends who choose to share — it is not a tool for monitoring
                    employees. Using it to monitor employees, drivers, students or anyone else for an organisation makes you
                    responsible for complying with privacy and employment law — consent, notices and the rest — as our Terms
                    explain. Never track anyone without their knowledge and agreement. For organisations we offer safety
                    services that people control, under a written agreement:{' '}
                    <a href="/business/" className="text-primary hover:underline">Loxymity for organisations</a>.
                  </>
                ),
              },
              {
                q: 'Is my data ever sold or shared with third parties?',
                a: 'Never sold, and there is no advertising. We use service providers to run the app — Supabase for the database (in Mumbai, India), Agora for calls, Cloudflare for backups and call recordings, Google and Apple for maps, Groq to understand assistant questions (it receives only the question text), Meta and Amazon if you link WhatsApp or Alexa, and RevenueCat with Apple and Google for purchases. Each processes data only to provide its service. The full list is in our Privacy Policy.',
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

      {/* ── For organisations ───────────────────────────────────────────── */}
      <section className="py-10 px-6 bg-dark-bg border-t border-dark-border">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-dark-muted">
            <span className="text-dark-text font-semibold">For organisations</span> — lone-worker safety, a family
            safety benefit for your people, care organisations, insurer and bank partnerships.
          </p>
          <a href="/business/" className="shrink-0 bg-dark-surface hover:bg-dark-border border border-dark-border text-dark-text font-semibold px-6 py-3 rounded-xl transition-colors">
            Talk to us
          </a>
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
            <StoreButton store="apple" />
            <StoreButton store="google" primary />
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
            <p className="text-dark-muted text-sm">© {new Date().getFullYear()} AMSEK RESEARCH LABS LLP. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-dark-muted">
            <a href="/privacy" className="hover:text-dark-text transition-colors">Privacy Policy</a>
            <a href="/terms"   className="hover:text-dark-text transition-colors">Terms of Service</a>
            <a href="/business/" className="hover:text-dark-text transition-colors">For businesses</a>
            <a href="mailto:support@loxymity.com" className="hover:text-dark-text transition-colors">Contact</a>
            <a href="/privacy/#contact" className="hover:text-dark-text transition-colors">Grievance Officer</a>
            <a href="/delete-account/" className="hover:text-dark-text transition-colors">Delete your account</a>
            <a href="/admin"   className="transition-colors" style={{ color: '#14171D' }}>Admin</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

/** Store buttons link only to a listing that exists (NEXT_PUBLIC_APP_STORE_URL /
 *  NEXT_PUBLIC_PLAY_URL, see _lib/appLinks.ts). Until then they say "Coming soon" rather
 *  than pointing at "#". */
function StoreButton({ store, primary }: { store: 'apple' | 'google'; primary?: boolean }) {
  const url = store === 'apple' ? APP_STORE_URL : PLAY_URL;
  const label = store === 'apple' ? 'App Store' : 'Google Play';
  const cls = `inline-flex items-center justify-center gap-3 font-semibold px-7 py-4 rounded-2xl transition-colors text-base ${
    primary
      ? 'bg-primary hover:bg-primary-dark text-dark-bg'
      : 'bg-dark-surface hover:bg-dark-border border border-dark-border text-dark-text'
  }`;
  const icon = store === 'apple' ? <AppleIcon dark={primary} /> : <PlayIcon dark={primary} />;
  if (url) {
    return (
      <a href={url} className={cls} target="_blank" rel="noopener noreferrer">
        {icon}
        {store === 'apple' ? 'Download on the App Store' : 'Get it on Google Play'}
      </a>
    );
  }
  return (
    <span className={`${cls} opacity-80 cursor-default`} aria-label={`${label} — coming soon`}>
      {icon}
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[10px] uppercase tracking-wide opacity-80">Coming soon</span>
        {label}
      </span>
    </span>
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
