export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-primary">Loxymity</span>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#privacy" className="hover:text-primary transition-colors">Privacy</a>
          </div>
          <a
            href="#download"
            className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            Get the App
          </a>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-24 px-6 text-center bg-gradient-to-b from-indigo-50/60 to-white">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Live location sharing
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 leading-tight mb-6">
            See where your<br />
            <span className="text-primary">circle is</span>, right now.
          </h1>
          <p className="text-xl text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Loxymity keeps families and close friends connected through private,
            real-time location sharing — plus iBeacon tokens and geo-fencing for the whole network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center" id="download">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-7 py-4 rounded-2xl transition-colors text-base"
            >
              <AppleIcon />
              Download on the App Store
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark text-white font-semibold px-7 py-4 rounded-2xl transition-colors text-base"
            >
              <PlayIcon />
              Get it on Google Play
            </a>
          </div>
        </div>

        {/* Phone mockup */}
        <div className="mt-16 max-w-sm mx-auto">
          <div className="bg-gray-900 rounded-[3rem] p-3 shadow-2xl shadow-indigo-200">
            <div className="bg-gradient-to-br from-indigo-500 to-primary rounded-[2.4rem] h-[480px] flex flex-col items-center justify-center gap-4 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    style={{ left: `${15 + i * 10}%`, top: `${20 + (i % 3) * 25}%` }}
                  />
                ))}
              </div>
              <div className="relative text-center px-6">
                <div className="flex -space-x-3 justify-center mb-4">
                  {['S', 'A', 'R', 'M'].map((letter, i) => (
                    <div
                      key={letter}
                      className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: ['#5C6BF8', '#10B981', '#F59E0B', '#EF4444'][i] }}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <p className="text-white font-semibold text-lg">Family Circle</p>
                <p className="text-indigo-200 text-sm mt-1">4 members · all active</p>
              </div>
              <div className="relative flex flex-col gap-2 w-full px-6">
                {[
                  { name: 'Sourav', place: 'Home', time: 'Just now', color: '#5C6BF8' },
                  { name: 'Ananya', place: 'Office', time: '3 min ago', color: '#10B981' },
                  { name: 'Rohan', place: 'School', time: '7 min ago', color: '#F59E0B' },
                ].map((m) => (
                  <div key={m.name} className="bg-white/15 backdrop-blur rounded-xl px-4 py-2.5 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: m.color }}>
                      {m.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold">{m.name}</p>
                      <p className="text-indigo-200 text-xs">{m.place}</p>
                    </div>
                    <p className="text-indigo-300 text-xs">{m.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Everything your circle needs</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Built for real families and close friends — not strangers.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '📍',
                title: 'Real-time location',
                desc: 'See exactly where everyone is on a live map, updated in real time. No refresh needed.',
              },
              {
                icon: '👥',
                title: 'Private circles',
                desc: 'Create groups for family, friends, or trips. Invite with a code or QR — total control over who joins.',
              },
              {
                icon: '✅',
                title: 'Owner approval',
                desc: 'Circle owners approve every join request. No one gets in without permission.',
              },
              {
                icon: '📡',
                title: 'iBeacon tokens',
                desc: 'Attach a Loxymity iBeacon to anything valuable. Any nearby app user automatically reports its GPS location back to you.',
                badge: 'Pro',
              },
              {
                icon: '🗺️',
                title: 'Geo-fencing',
                desc: 'Draw virtual boundaries anywhere on the map. Get instant alerts when a person or beacon enters or exits the zone.',
                badge: 'Pro',
              },
              {
                icon: '🔔',
                title: 'Arrival alerts',
                desc: 'Get notified when someone arrives at or leaves a location. Stay in the loop effortlessly.',
              },
              {
                icon: '⭐',
                title: 'Pro subscription',
                desc: 'Unlock unlimited circles, beacon tokens, geofences, and extended location history with a single Pro plan.',
              },
              {
                icon: '🔒',
                title: 'You control your data',
                desc: "Pause sharing anytime. Your location is only visible to circles you've joined.",
              },
              {
                icon: '⚡',
                title: 'Battery friendly',
                desc: 'Smart location updates that balance accuracy with battery life, so it runs all day.',
              },
            ].map((f) => (
              <div key={f.title} className="bg-gray-50 rounded-2xl p-7 hover:bg-indigo-50 transition-colors group relative">
                {f.badge && (
                  <span className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {f.badge}
                  </span>
                )}
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── iBeacon highlight ───────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-indigo-50/50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-primary rounded-full" />
              New — iBeacon tokens
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Never lose what matters
            </h2>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
              Loxymity iBeacon tokens use your Loxymity UUID so any app user within range
              automatically crowdsources its location — no GPS in the token required.
              Attach one to a bag, bike, or car and see it move on your map.
            </p>
            <div className="flex flex-col gap-4">
              {[
                { icon: '📡', text: 'UUID E2C56DB5 — unique to the Loxymity network' },
                { icon: '👥', text: 'Crowd-sourced — every Loxymity user nearby reports it' },
                { icon: '🗺️', text: 'Last-seen location visible on your map instantly' },
                { icon: '🛒', text: 'Purchase tokens at loxymity.com (coming soon)' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <p className="text-gray-600 text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 bg-primary rounded-full opacity-10 animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-8 bg-primary rounded-full opacity-20 animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
              <div className="absolute inset-16 bg-primary rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-200">
                <span className="text-5xl">📡</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Up and running in minutes</h2>
            <p className="text-lg text-gray-500">No complicated setup. Just download, invite, and go.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create your account',
                desc: 'Sign up with email or a one-time code. No password required if you prefer.',
              },
              {
                step: '02',
                title: 'Start or join a circle',
                desc: 'Create a circle and share the invite code or QR with the people you trust.',
              },
              {
                step: '03',
                title: 'See your circle live',
                desc: 'Everyone in the circle appears on a shared map, updated in real time.',
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-14 h-14 bg-primary text-white font-black text-lg rounded-2xl flex items-center justify-center mx-auto mb-5">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 bg-indigo-50/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Simple, honest pricing</h2>
            <p className="text-lg text-gray-500">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <p className="text-sm font-semibold text-gray-500 mb-2">Free</p>
              <p className="text-5xl font-black text-gray-900 mb-1">$0</p>
              <p className="text-gray-400 text-sm mb-8">Forever free</p>
              <ul className="flex flex-col gap-3 mb-8">
                {[
                  '1 circle (up to 5 members)',
                  '1 day location history',
                  '1 iBeacon token',
                  '2 geofences',
                  'Real-time map',
                  'QR invite codes',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#download"
                className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Get started free
              </a>
            </div>
            {/* Pro */}
            <div className="bg-primary rounded-3xl p-8 shadow-xl shadow-indigo-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <p className="text-sm font-semibold text-indigo-200 mb-2">Pro</p>
              <p className="text-5xl font-black text-white mb-1">$4.99</p>
              <p className="text-indigo-300 text-sm mb-8">per month</p>
              <ul className="flex flex-col gap-3 mb-8">
                {[
                  'Unlimited circles',
                  'Unlimited members per circle',
                  '30 days location history',
                  '20 iBeacon tokens',
                  '50 geofences',
                  'Priority support',
                  'Pro badge on your profile',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white">
                    <CheckIcon white />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#download"
                className="block text-center bg-white hover:bg-indigo-50 text-primary font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Upgrade to Pro
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Privacy ─────────────────────────────────────────────────────── */}
      <section id="privacy" className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="text-4xl font-black text-gray-900 mb-6">Privacy first, always</h2>
            <div className="flex flex-col gap-4">
              {[
                'Your location is never sold or shared with advertisers.',
                'You can pause or stop sharing at any time — instantly.',
                'Only circle members you approve can see your location.',
                'All data is encrypted in transit and at rest.',
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-base">{point}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-48 h-48 bg-indigo-100 rounded-full flex items-center justify-center">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Download CTA ────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-br from-primary to-primary-dark text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black mb-4">Ready to stay connected?</h2>
          <p className="text-indigo-200 text-lg mb-10">
            Free to download. No subscription required to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 hover:bg-gray-100 font-semibold px-7 py-4 rounded-2xl transition-colors text-base"
            >
              <AppleIcon dark />
              App Store
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-3 bg-white/15 hover:bg-white/25 text-white font-semibold px-7 py-4 rounded-2xl transition-colors text-base border border-white/30"
            >
              <PlayIcon />
              Google Play
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="py-12 px-6 bg-gray-950 text-gray-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-lg">Loxymity</p>
            <p className="text-sm mt-1">© {new Date().getFullYear()} Sawsib Infotech. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="mailto:hello@loxymity.com" className="hover:text-white transition-colors">Contact</a>
            <a href="/admin" className="hover:text-white transition-colors text-gray-600">Admin</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

function AppleIcon({ dark }: { dark?: boolean }) {
  return (
    <svg className={`w-5 h-5 ${dark ? 'text-gray-900' : 'text-white'}`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.18 23.82a2 2 0 001.76-.22l12.89-7.44-3.53-3.53-11.12 11.19zM20.83 9.58L17.96 7.9 14.1 11.76l3.87 3.87 2.89-1.67a2 2 0 000-4.38zM.46.4A2 2 0 000 1.74v20.52a2 2 0 00.46 1.34L.54 23.6l11.5-11.5v-.27L.54.4zM14.1 12.24L2.6.74l-.06.06 11.5 11.5.06-.06z" />
    </svg>
  );
}

function CheckIcon({ white }: { white?: boolean }) {
  return (
    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${white ? 'bg-white/20' : 'bg-indigo-100'}`}>
      <svg className={`w-3 h-3 ${white ? 'text-white' : 'text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}
