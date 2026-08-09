'use client';

import { useCallback, useRef, useState } from 'react';

type Slide = {
  title: string;
  desc: string;
  tag: string;
  iconPath: string;
  iconColor: string;
  iconBg: string;
};

// Differentiators — what sets Loxymity apart from a plain dot on a map.
const SLIDES: Slide[] = [
  {
    tag: 'Ask in WhatsApp',
    title: '“Where’s mum?” — right inside WhatsApp',
    desc: 'Ask in plain language and get an instant, human answer. No app to open, no map to scan — just message and know.',
    iconPath: 'M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z',
    iconColor: 'text-brand-success', iconBg: 'bg-brand-success/10',
  },
  {
    tag: 'Ask Alexa',
    title: 'Ask Alexa where your family is',
    desc: 'Link your phone number and just ask out loud. Alexa answers from your live circle — hands-free peace of mind.',
    iconPath: 'M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z',
    iconColor: 'text-accent-cyan', iconBg: 'bg-accent-cyan/10',
  },
  {
    tag: 'AI-powered search',
    title: 'AI-powered, privacy-first location search',
    desc: 'Natural-language questions understood by AI — and your family’s location is never sold, ever. Answers, not ad targeting.',
    iconPath: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z',
    iconColor: 'text-primary', iconBg: 'bg-primary/10',
  },
  {
    tag: 'Never sold. Ever.',
    title: 'Your location is never sold',
    desc: 'Processed on-device wherever possible and never handed to advertisers or data brokers. Privacy is the whole point — not a paywall.',
    iconPath: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    iconColor: 'text-brand-success', iconBg: 'bg-brand-success/10',
  },
  {
    tag: 'Adaptive tracking',
    title: 'Battery-smart adaptive tracking',
    desc: 'Speeds up when you’re moving, slows right down when you’re still. No fixed polling — real-time when it matters, gentle on your battery.',
    iconPath: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
    iconColor: 'text-primary', iconBg: 'bg-primary/10',
  },
  {
    tag: 'Hardware tokens',
    title: 'iBeacon & BLE tokens',
    desc: 'Attach a token to a bag, bike, or car. The nearby app-user network crowds-sources its location — no GPS in the token required.',
    iconPath: 'M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
    iconColor: 'text-accent-cyan', iconBg: 'bg-accent-cyan/10',
  },
  {
    tag: 'Street View',
    title: 'Street View on any pin',
    desc: 'Drop into ground-level Street View for any member or place — recognise the actual doorway, corner, or car park at a glance.',
    iconPath: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
    iconColor: 'text-accent-cyan', iconBg: 'bg-accent-cyan/10',
  },
  {
    tag: 'Voice & video',
    title: 'In-app voice & video calls',
    desc: 'Call any circle member by name — no phone number needed. Tap and connect, right where you already see them on the map.',
    iconPath: 'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z',
    iconColor: 'text-accent-cyan', iconBg: 'bg-accent-cyan/10',
  },
  {
    tag: 'Event circles',
    title: 'Time-limited event circles',
    desc: 'Spin up a circle for a trip or a night out — it auto-dissolves when the event ends. Share for the moment, not forever.',
    iconPath: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5',
    iconColor: 'text-primary', iconBg: 'bg-primary/10',
  },
  {
    tag: 'No app needed',
    title: 'Browser share links',
    desc: 'Send a time-limited link to anyone — a grandparent, a driver, a friend without the app. They open it in any browser and see live location.',
    iconPath: 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244',
    iconColor: 'text-accent-cyan', iconBg: 'bg-accent-cyan/10',
  },
];

export function DifferentiatorCarousel() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const count = SLIDES.length;
  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );
  const prev = useCallback(() => go(index - 1), [go, index]);
  const next = useCallback(() => go(index + 1), [go, index]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    touchStartX.current = null;
  };

  // No autoplay by design — navigation is user-driven, so reduced-motion needs no special handling.
  return (
    <div
      ref={rootRef}
      className="relative"
      role="group"
      aria-roledescription="carousel"
      aria-label="What sets Loxymity apart"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* Viewport */}
      <div
        className="overflow-hidden rounded-3xl border border-dark-border bg-dark-surface"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SLIDES.map((s, i) => (
            <div
              key={s.title}
              className="w-full flex-shrink-0 px-8 py-14 md:px-16 md:py-20"
              aria-hidden={i !== index}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
            >
              <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
                <div className={`w-16 h-16 rounded-2xl ${s.iconBg} flex items-center justify-center mb-7`}>
                  <svg className={`w-8 h-8 ${s.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.iconPath} />
                  </svg>
                </div>
                <span className="inline-flex items-center gap-2 border border-accent-cyan/25 bg-accent-cyan/10 text-accent-cyan font-hud uppercase tracking-wide text-xs font-semibold px-3 py-1 rounded-full mb-5">
                  <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full" />
                  {s.tag}
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-semibold text-dark-text mb-4 text-balance">{s.title}</h3>
                <p className="text-dark-muted text-base md:text-lg leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous"
        className="absolute left-2 md:-left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-dark-border bg-dark-bg/90 backdrop-blur flex items-center justify-center text-dark-muted hover:text-accent-cyan hover:border-accent-cyan/40 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next"
        className="absolute right-2 md:-right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-dark-border bg-dark-bg/90 backdrop-blur flex items-center justify-center text-dark-muted hover:text-accent-cyan hover:border-accent-cyan/40 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2.5 mt-8">
        {SLIDES.map((s, i) => (
          <button
            key={s.title}
            type="button"
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}: ${s.tag}`}
            aria-current={i === index}
            className={`h-2 rounded-full transition-all duration-200 motion-reduce:transition-none ${
              i === index ? 'w-6 bg-primary' : 'w-2 bg-dark-border hover:bg-dark-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
