import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-bg">

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/85 backdrop-blur-lg border-b border-dark-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="chrome-badge relative w-44 h-11 flex-shrink-0 px-2 py-1">
            <Image
              src="/logo-full.png"
              alt="Loxymity"
              fill
              style={{ objectFit: 'contain', objectPosition: 'left center' }}
              className="mix-blend-screen"
              priority
            />
          </div>
          <div className="hidden md:flex items-center gap-7 text-sm font-hud font-semibold uppercase tracking-wide text-dark-muted">
            <a href="#features"    className="hover:text-accent-cyan hover:[text-shadow:0_0_8px_rgba(0,240,255,0.5)] transition-colors">Features</a>
            <a href="#safety"      className="hover:text-accent-cyan hover:[text-shadow:0_0_8px_rgba(0,240,255,0.5)] transition-colors">Safety</a>
            <a href="#how-it-works" className="hover:text-accent-cyan hover:[text-shadow:0_0_8px_rgba(0,240,255,0.5)] transition-colors">How it works</a>
            <a href="#pricing"     className="hover:text-accent-cyan hover:[text-shadow:0_0_8px_rgba(0,240,255,0.5)] transition-colors">Pricing</a>
            <a href="#faq"         className="hover:text-accent-cyan hover:[text-shadow:0_0_8px_rgba(0,240,255,0.5)] transition-colors">FAQ</a>
          </div>
          <a
            href="#download"
            className="chrome-shine text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-transform hover:scale-[1.03]"
            style={{ background: 'linear-gradient(135deg, #FF2E9A 0%, #FF7A18 100%)' }}
          >
            Get the App
          </a>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-0 px-6 text-center bg-dark-bg overflow-hidden">
        {/* Radial glow */}
        <div
          className="absolute inset-x-0 top-0 h-[560px] pointer-events-none animate-glow-breathe"
          style={{ background: 'radial-gradient(ellipse 80% 55% at 50% -5%, rgba(255,46,154,0.28), transparent 70%)' }}
        />
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(185,169,224,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Retro sun + grid horizon */}
        <div className="retro-sun absolute left-1/2 top-10 -translate-x-1/2 w-72 h-72 opacity-30 animate-glow-breathe pointer-events-none" />
        <div className="grid-horizon" />

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-dark-surface border border-accent-cyan/25 text-accent-cyan font-hud uppercase tracking-wide text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" />
            Live location sharing
          </div>
          <h1 className="text-chrome font-display text-5xl md:text-[4.25rem] font-black tracking-tight leading-[1.08] mb-6">
            See where your<br />
            <span className="text-neon-magenta">circle is</span>, right now.
          </h1>
          <p className="text-xl text-dark-muted max-w-xl mx-auto mb-10 leading-relaxed">
            Loxymity keeps families and close friends connected through private,
            real-time location sharing — with safety check-ins, emergency SOS,
            iBeacon tracking, and geo-fencing for complete peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center" id="download">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-3 bg-dark-surface/60 backdrop-blur border border-accent-cyan/20 hover:border-accent-cyan/40 text-dark-text font-semibold px-7 py-4 rounded-2xl transition-colors text-base"
            >
              <AppleIcon />
              Download on the App Store
            </a>
            <a
              href="#"
              className="chrome-shine inline-flex items-center justify-center gap-3 text-white font-semibold px-7 py-4 rounded-2xl transition-transform hover:scale-[1.02] text-base"
              style={{ background: 'linear-gradient(135deg, #FF2E9A 0%, #FF7A18 100%)' }}
            >
              <PlayIcon />
              Get it on Google Play
            </a>
          </div>
        </div>

        {/* Phone mockup */}
        <div className="relative mt-16 max-w-[285px] mx-auto animate-float" style={{ willChange: 'transform' }}>
          <div className="absolute -inset-8 bg-primary/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-dark-bg to-transparent pointer-events-none z-10" />
          {/* Chassis */}
          <div className="relative bg-dark-surface rounded-[3rem] p-[3px] ring-1 ring-accent-cyan/25 shadow-2xl" style={{ boxShadow: '0 32px 80px rgba(255,46,154,0.22)' }}>
            <div className="scanlines bg-[#070d19] rounded-[2.8rem] overflow-hidden">

              {/* Status bar */}
              <div className="h-9 flex items-center justify-between px-5 pt-2">
                <span className="text-dark-text text-[10px] font-semibold">9:41</span>
                <div className="w-14 h-[18px] bg-black rounded-full" />
                <div className="flex items-center gap-1.5 opacity-70">
                  <svg className="w-3 h-3 text-dark-text" fill="currentColor" viewBox="0 0 10 12">
                    <rect x="0" y="6.5" width="1.8" height="5.5" rx="0.4" />
                    <rect x="2.7" y="4.5" width="1.8" height="7.5" rx="0.4" />
                    <rect x="5.4" y="2.5" width="1.8" height="9.5" rx="0.4" />
                    <rect x="8.1" y="0.5" width="1.8" height="11.5" rx="0.4" />
                  </svg>
                  <svg className="w-[18px] h-3 text-dark-text" fill="none" viewBox="0 0 20 12">
                    <rect x="0.5" y="0.5" width="16.5" height="11" rx="2.5" stroke="currentColor" strokeOpacity="0.45" />
                    <rect x="2" y="2" width="11.5" height="8" rx="1.5" fill="currentColor" fillOpacity="0.75" />
                    <path d="M18 4v4a2 2 0 000-4z" fill="currentColor" fillOpacity="0.35" />
                  </svg>
                </div>
              </div>

              {/* Circle header */}
              <div className="px-4 pb-2 flex items-center justify-between">
                <div>
                  <p className="text-dark-text font-bold text-[11px] leading-tight">Family Circle</p>
                  <p className="text-dark-muted text-[10px] leading-tight">4 members · all active</p>
                </div>
                <div className="flex -space-x-2">
                  {[['S','#FF2E9A'],['A','#00F0FF'],['R','#FFC24B'],['M','#FF3B5C']].map(([init, col]) => (
                    <div
                      key={init}
                      className="w-6 h-6 rounded-full border border-[#070d19] flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                      style={{ backgroundColor: col }}
                    >{init}</div>
                  ))}
                </div>
              </div>

              {/* Map area */}
              <div className="h-[168px] relative overflow-hidden" style={{ backgroundColor: '#0a0518' }}>
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(rgba(0,240,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,240,255,0.05) 1px,transparent 1px)',
                  backgroundSize: '22px 22px',
                }} />
                <div className="absolute top-[41%] left-0 right-0 h-[2px]" style={{ backgroundColor: '#1c1240' }} />
                <div className="absolute top-[68%] left-0 right-0 h-[2px]" style={{ backgroundColor: '#1c1240' }} />
                <div className="absolute left-[27%] top-0 bottom-0 w-[2px]" style={{ backgroundColor: '#1c1240' }} />
                <div className="absolute left-[63%] top-0 bottom-0 w-[2px]" style={{ backgroundColor: '#1c1240' }} />

                {/* Sourav — active / pulsing */}
                <div className="absolute" style={{ top: '28%', left: '34%' }}>
                  <div
                    className="absolute rounded-full"
                    style={{ width: 28, height: 28, top: -11, left: -11, backgroundColor: 'rgba(255,46,154,0.22)', animation: 'beacon-ring 2.4s ease-out infinite' }}
                  />
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white/25" style={{ backgroundColor: '#FF2E9A' }} />
                </div>
                {/* Ananya */}
                <div className="absolute w-3 h-3 rounded-full" style={{ top: '56%', left: '61%', backgroundColor: '#00F0FF' }} />
                {/* Rohan */}
                <div className="absolute w-3 h-3 rounded-full" style={{ top: '37%', left: '15%', backgroundColor: '#FFC24B' }} />

                {/* Place label */}
                <div
                  className="absolute text-[8px] text-dark-muted rounded-md px-1.5 py-0.5"
                  style={{ top: '17%', left: '37%', backgroundColor: 'rgba(27,16,66,0.88)', border: '1px solid rgba(61,43,111,0.6)' }}
                >
                  Home
                </div>
              </div>

              {/* Member cards */}
              <div className="flex flex-col gap-1.5 px-3 py-3">
                {[
                  { name: 'Sourav', place: 'Home',   time: 'Just now',  color: '#FF2E9A', bat: 82 },
                  { name: 'Ananya', place: 'Office', time: '3 min ago', color: '#00F0FF', bat: 61 },
                  { name: 'Rohan',  place: 'School', time: '7 min ago', color: '#FFC24B', bat: 34 },
                ].map((m) => {
                  const bc = m.bat > 50 ? '#39FF88' : m.bat > 20 ? '#FFC24B' : '#FF3B5C';
                  const bb = m.bat > 50 ? 'rgba(57,255,136,0.12)' : m.bat > 20 ? 'rgba(255,194,75,0.12)' : 'rgba(255,59,92,0.12)';
                  return (
                    <div key={m.name} className="bg-dark-surface rounded-xl px-3 py-2 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: m.color }}>
                        {m.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-dark-text text-[11px] font-semibold leading-tight">{m.name}</p>
                        <p className="text-dark-muted text-[10px] leading-tight">{m.place}</p>
                      </div>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ color: bc, backgroundColor: bb }}>{m.bat}%</span>
                      <p className="text-[9px] flex-shrink-0" style={{ color: '#6B5A99' }}>{m.time}</p>
                    </div>
                  );
                })}
              </div>

              {/* Bottom tab bar */}
              <div className="h-12 border-t border-dark-border flex items-center justify-around px-3 pb-1">
                {/* Map (active) */}
                <div className="flex flex-col items-center gap-0.5">
                  <svg className="w-[17px] h-[17px] text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25M3 17.25V6.75a1.125 1.125 0 01.622-1.06l4.125-2.063a1.125 1.125 0 011.006 0l4.5 2.25a1.125 1.125 0 001.006 0l4.125-2.063A1.125 1.125 0 0121 4.813V15.5a1.125 1.125 0 01-.622 1.06l-4.125 2.063a1.125 1.125 0 01-1.006 0l-4.5-2.25a1.125 1.125 0 00-1.006 0L3.622 18.44" />
                  </svg>
                  <div className="w-1 h-1 bg-primary rounded-full" />
                </div>
                {/* Activity */}
                <svg className="w-[17px] h-[17px] text-dark-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {/* SOS */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,59,92,0.12)', border: '1px solid rgba(255,59,92,0.22)' }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#FF3B5C" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                {/* Circles */}
                <svg className="w-[17px] h-[17px] text-dark-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                {/* Profile */}
                <svg className="w-[17px] h-[17px] text-dark-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────────────── */}
      <div className="border-b border-dark-border bg-dark-bg">
        <div className="max-w-5xl mx-auto px-6 py-7 flex flex-wrap justify-center gap-x-10 gap-y-3">
          {[
            { label: 'End-to-end encrypted',   path: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z' },
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

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 bg-dark-bg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-black text-dark-text mb-4">Everything your circle needs</h2>
            <p className="text-lg text-dark-muted max-w-xl mx-auto">Built for real families and close friends — not strangers.</p>
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
                iconPath: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
                iconColor: 'text-accent-cyan', iconBg: 'bg-accent-cyan/10',
                title: 'Private circles',
                desc: 'Create groups for family, friends, or trips. Invite with a QR code or link — you control every member.',
              },
              {
                iconPath: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
                iconColor: 'text-accent-cyan', iconBg: 'bg-accent-cyan/10',
                title: 'Owner approval',
                desc: 'Circle owners review and approve every join request. No one enters without your explicit permission.',
              },
              {
                iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
                iconColor: 'text-accent-cyan', iconBg: 'bg-accent-cyan/10',
                title: 'Activity feed',
                desc: 'A chronological log of every geofence crossing, safety check-in, motion alert, and SOS in your circle.',
              },
              {
                iconPath: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
                iconColor: 'text-brand-danger', iconBg: 'bg-brand-danger/10',
                title: 'SOS emergency',
                desc: 'One tap sends an emergency alert with your exact GPS location to every circle member, instantly.',
              },
              {
                iconPath: 'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z',
                iconColor: 'text-brand-success', iconBg: 'bg-brand-success/10',
                title: 'Safety check-in',
                desc: "Mark yourself safe with a single tap. Your circle sees your status instantly — no anxious group texts needed.",
              },
              {
                iconPath: 'M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
                iconColor: 'text-accent-cyan', iconBg: 'bg-accent-cyan/10',
                title: 'iBeacon tokens',
                desc: 'Attach a Loxymity beacon to anything valuable. Nearby app users automatically report its location back to you.',
                badge: 'Pro',
              },
              {
                iconPath: 'M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z',
                iconColor: 'text-accent-cyan', iconBg: 'bg-accent-cyan/10',
                title: 'Geo-fencing',
                desc: 'Draw virtual boundaries on the map with a custom dwell time — alerts fire only when someone actually stays inside.',
                badge: 'Pro',
              },
              {
                iconPath: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
                iconColor: 'text-accent-cyan', iconBg: 'bg-accent-cyan/10',
                title: 'Arrival & departure alerts',
                desc: 'Get notified the moment someone arrives at or leaves school, home, work, or any zone you define.',
                badge: 'Pro',
              },
              {
                iconPath: 'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z',
                iconColor: 'text-accent-cyan', iconBg: 'bg-accent-cyan/10',
                title: 'In-app voice & video',
                desc: 'Call any circle member directly inside the app. No phone number needed — tap their name and connect.',
                badge: 'Pro',
              },
              {
                iconPath: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3v.75h-3v-.75z',
                iconColor: 'text-accent-cyan', iconBg: 'bg-accent-cyan/10',
                title: 'Member battery status',
                desc: "See each member's battery level on the map — know when someone's phone is about to die before they go dark.",
                badge: 'Pro',
              },
              {
                iconPath: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
                iconColor: 'text-accent-cyan', iconBg: 'bg-accent-cyan/10',
                title: 'Battery friendly',
                desc: "Smart adaptive tracking slows down when you're still and speeds up when you're moving — minimum drain.",
              },
            ].map((f) => (
              <div key={f.title} className="bg-dark-surface border border-dark-border rounded-2xl p-7 hover:border-accent-cyan/40 hover:shadow-[0_8px_32px_rgba(0,240,255,0.08)] transition-all duration-200 group relative">
                {f.badge && (
                  <span className="chrome-shine absolute top-4 right-4 bg-accent-gold/12 text-accent-gold border border-accent-gold/30 font-hud uppercase text-[10px] font-bold px-2 py-0.5 rounded-full">
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
        </div>
      </section>

      {/* ── iBeacon highlight ──────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-dark-surface">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-accent-cyan/10 border border-accent-cyan/25 text-accent-cyan font-hud uppercase tracking-wide text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-accent-cyan rounded-full" />
              iBeacon tokens
            </div>
            <h2 className="text-chrome font-display text-4xl font-black mb-6">Never lose what matters</h2>
            <p className="text-dark-muted text-lg mb-8 leading-relaxed">
              Loxymity iBeacon tokens use a unique UUID so any nearby app user automatically
              crowdsources its location — no GPS in the token required. Attach one to a bag,
              bike, or car and see it move on your map in real time.
            </p>
            <div className="flex flex-col gap-4">
              {[
                { p: 'M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z', text: 'Unique UUID — registered exclusively to the Loxymity network' },
                { p: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z', text: 'Crowd-sourced — every nearby Loxymity user reports it silently' },
                { p: 'M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z', text: 'Last-seen location and time visible on your map instantly' },
                { p: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0', text: 'Set a geofence around a token to get alerted if it moves' },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-accent-cyan/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d={item.p} />
                    </svg>
                  </div>
                  <p className="text-dark-muted text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-accent-cyan/10 animate-beacon-ring" />
              <div className="absolute inset-8 rounded-full border border-accent-cyan/15 animate-beacon-ring" style={{ animationDelay: '1s' }} />
              <div className="absolute inset-16 rounded-full border border-accent-cyan/25 animate-beacon-ring" style={{ animationDelay: '2s' }} />
              <div className="absolute inset-20 bg-dark-bg border border-accent-cyan/30 rounded-3xl flex items-center justify-center shadow-xl" style={{ boxShadow: '0 0 40px rgba(0,240,255,0.25)' }}>
                <svg className="w-9 h-9 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Safety & Emergency ───────────────────────────────────────────── */}
      <section id="safety" className="py-24 px-6 bg-dark-bg">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-danger/10 border border-brand-danger/20 text-brand-danger text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-brand-danger rounded-full" />
              Safety & emergency
            </div>
            <h2 className="font-display text-4xl font-black text-dark-text mb-4">There when it counts most</h2>
            <p className="text-lg text-dark-muted max-w-xl mx-auto">Loxymity has a full safety layer built in — not bolted on.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                iconPath: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
                bg: 'bg-brand-danger/6 border border-brand-danger/18', iconBg: 'bg-brand-danger/10', iconColor: 'text-brand-danger', titleColor: 'text-brand-danger',
                title: 'One-tap SOS',
                desc: 'Press SOS in an emergency. Every circle member receives an immediate push notification with your exact GPS coordinates — no typing, no calling.',
              },
              {
                iconPath: 'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z',
                bg: 'bg-brand-success/6 border border-brand-success/18', iconBg: 'bg-brand-success/10', iconColor: 'text-brand-success', titleColor: 'text-brand-success',
                title: 'Safety check-in',
                desc: "Arrived safely? Tap once to mark yourself safe. Your circle sees the update instantly with a timestamp — no anxious follow-up calls needed.",
              },
              {
                iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
                bg: 'bg-accent-cyan/6 border border-accent-cyan/18', iconBg: 'bg-accent-cyan/10', iconColor: 'text-accent-cyan', titleColor: 'text-accent-cyan',
                title: 'Activity feed',
                desc: 'A chronological log of every geofence crossing, safety check-in, motion event, and SOS alert in your circle. Catch up on anything you missed.',
              },
            ].map((item) => (
              <div key={item.title} className={`${item.bg} rounded-2xl p-8`}>
                <div className={`w-11 h-11 ${item.iconBg} rounded-xl flex items-center justify-center mb-5`}>
                  <svg className={`w-5 h-5 ${item.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.iconPath} />
                  </svg>
                </div>
                <h3 className={`text-xl font-bold mb-3 ${item.titleColor}`}>{item.title}</h3>
                <p className="text-dark-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 bg-dark-surface">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-black text-dark-text mb-4">Up and running in minutes</h2>
            <p className="text-lg text-dark-muted">No complicated setup. Just download, invite, and go.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div
              className="hidden md:block absolute top-7 left-[calc(16.67%+2.5rem)] right-[calc(16.67%+2.5rem)] h-px"
              style={{ background: 'linear-gradient(90deg, rgba(255,46,154,.3), rgba(0,240,255,.3), rgba(255,194,75,.3))' }}
            />
            {[
              { step: '01', title: 'Create your account', desc: 'Sign up with your email. We send a one-time code — no password to remember.' },
              { step: '02', title: 'Start or join a circle', desc: 'Create a circle and share the invite QR with the people you trust. Owner approval keeps it private.' },
              { step: '03', title: 'See your circle live', desc: 'Everyone appears on the shared map in real time. SOS, check-ins, and alerts are always one tap away.' },
            ].map((s) => (
              <div key={s.step} className="text-center relative">
                <div className="font-display w-14 h-14 border-2 border-accent-gold/40 bg-accent-gold/10 text-accent-gold font-black text-lg rounded-2xl flex items-center justify-center mx-auto mb-5">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-dark-text mb-2">{s.title}</h3>
                <p className="text-dark-muted text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 bg-dark-bg">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-black text-dark-text mb-4">Simple, honest pricing</h2>
            <p className="text-lg text-dark-muted">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">

            {/* Free */}
            <div className="bg-dark-surface rounded-3xl p-8 border border-dark-border">
              <p className="text-sm font-semibold text-dark-muted mb-2">Free</p>
              <p className="text-5xl font-black text-dark-text mb-1">$0</p>
              <p className="text-dark-border text-sm mb-8">Forever free</p>
              <ul className="flex flex-col gap-3 mb-8">
                {[
                  '1 circle (up to 5 members)',
                  '24-hour location history',
                  '1 iBeacon token',
                  '2 geofences',
                  'Real-time shared map',
                  'SOS emergency alerts',
                  'Safety check-in',
                  'Activity feed',
                  'QR invite codes',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-dark-muted">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#download" className="block text-center bg-dark-border hover:bg-[#55408F] text-dark-text font-semibold px-6 py-3 rounded-xl transition-colors">
                Get started free
              </a>
            </div>

            {/* Pro */}
            <div
              className="relative rounded-3xl p-8 overflow-hidden shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(11,6,32,0.45), rgba(11,6,32,0.45)), linear-gradient(135deg, #FF2E9A 0%, #FF7A18 55%, #FFC24B 100%)',
                boxShadow: '0 24px 64px rgba(255,122,24,0.35)',
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />
              <div className="absolute top-0 right-0 w-52 h-52 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
              <div className="chrome-shine absolute top-4 right-4 bg-white/15 border border-white/25 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                Most Popular
              </div>
              <p className="font-hud uppercase tracking-wide text-sm font-semibold text-white/70 mb-2">Pro</p>
              <p className="font-display text-5xl font-black text-white mb-1">$4.99</p>
              <p className="text-white/60 text-sm mb-8">per month</p>
              <ul className="flex flex-col gap-3 mb-8 relative">
                {[
                  'Unlimited circles',
                  'Up to 20 members per circle',
                  '30-day location history',
                  '20 iBeacon tokens',
                  '50 geofences',
                  'Arrival & departure alerts',
                  'Member battery status',
                  'In-app voice & video calls',
                  'Priority support',
                  'Pro badge on your profile',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white relative">
                    <CheckIcon white />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#download" className="relative block text-center bg-white hover:bg-white/90 text-primary-dark font-bold px-6 py-3 rounded-xl transition-colors">
                Upgrade to Pro
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ── Privacy ──────────────────────────────────────────────────────── */}
      <section id="privacy" className="py-24 px-6 bg-dark-surface">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="font-display text-4xl font-black text-dark-text mb-6">Privacy first, always</h2>
            <div className="flex flex-col gap-4">
              {[
                'Your location is never sold or shared with advertisers.',
                'You can pause or stop sharing at any time — instantly.',
                'Only circle members you approve can see your location.',
                'All data is encrypted in transit and at rest.',
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
            <h2 className="font-display text-4xl font-black text-dark-text mb-4">Frequently asked questions</h2>
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
                a: "Those tools offer basic, temporary location sharing as a side feature. Loxymity is purpose-built for continuous family and friend tracking, with a dedicated shared map, geofencing with custom dwell times, arrival/departure alerts, iBeacon support, battery status, SOS alerts, in-app voice and video calls, and a full activity feed — all in one app.",
              },
              {
                q: 'Can I see where someone was earlier today?',
                a: "Yes. All plans include location history — 24 hours on Free and 30 days on Pro. Tap any circle member on the map to replay their location trail and see exactly where they were and when.",
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
        style={{
          background: 'linear-gradient(135deg, rgba(11,6,32,0.45), rgba(11,6,32,0.45)), linear-gradient(135deg, #4A2E85 0%, #FF2E9A 55%, #FF7A18 100%)',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-white/15" />
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white/5" />
        <div className="grid-horizon" />
        <div className="relative max-w-2xl mx-auto">
          <div className="relative w-36 h-14 mx-auto mb-8 bg-dark-bg/80 backdrop-blur rounded-2xl p-3 ring-1 ring-white/10">
            <Image src="/logo-full.png" alt="Loxymity" fill style={{ objectFit: 'contain' }} />
          </div>
          <h2 className="font-display text-4xl font-black text-white mb-4">Ready to stay connected?</h2>
          <p className="text-white/70 text-lg mb-10">Free to download. No subscription required to get started.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#" className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 hover:bg-gray-50 font-semibold px-7 py-4 rounded-2xl transition-colors text-base">
              <AppleIcon dark />
              App Store
            </a>
            <a href="#" className="inline-flex items-center justify-center gap-3 bg-white/12 hover:bg-white/20 text-white border border-white/25 font-semibold px-7 py-4 rounded-2xl transition-colors text-base">
              <PlayIcon />
              Google Play
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="py-12 px-6 bg-dark-bg border-t border-dark-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="relative w-40 h-10 mb-2">
              <Image src="/logo-full.png" alt="Loxymity" fill style={{ objectFit: 'contain', objectPosition: 'left center' }} className="mix-blend-screen opacity-80" />
            </div>
            <p className="text-dark-muted text-sm">© {new Date().getFullYear()} Sawsib Infotech. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-dark-muted">
            <a href="/privacy" className="hover:text-dark-text transition-colors">Privacy Policy</a>
            <a href="/terms"   className="hover:text-dark-text transition-colors">Terms of Service</a>
            <a href="mailto:hello@loxymity.com" className="hover:text-dark-text transition-colors">Contact</a>
            <a href="/admin"   className="transition-colors" style={{ color: '#1B1042' }}>Admin</a>
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

function PlayIcon() {
  return (
    <svg className="w-5 h-5 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.18 23.82a2 2 0 001.76-.22l12.89-7.44-3.53-3.53-11.12 11.19zM20.83 9.58L17.96 7.9 14.1 11.76l3.87 3.87 2.89-1.67a2 2 0 000-4.38zM.46.4A2 2 0 000 1.74v20.52a2 2 0 00.46 1.34L.54 23.6l11.5-11.5v-.27L.54.4zM14.1 12.24L2.6.74l-.06.06 11.5 11.5.06-.06z" />
    </svg>
  );
}

function CheckIcon({ white }: { white?: boolean }) {
  return (
    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${white ? 'bg-white/20' : 'bg-accent-cyan/15 border border-accent-cyan/25'}`}>
      <svg className={`w-3 h-3 ${white ? 'text-white' : 'text-accent-cyan'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}
