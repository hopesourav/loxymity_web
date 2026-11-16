'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const AUTOPLAY_MS = 5000;

type Slide = {
  title: string;
  desc: string;
  tag: string;
  iconPath: string;
  iconColor: string;
  iconBg: string;
};

// "More than a dot on a map": the smart extras. Deliberately NOTHING that the feature bento on the
// landing page already shows (map, places, SOS, crash check, no-signal relay, driving, calls) — the
// old 13 slides repeated almost every card above them. Alexa is NOT here: the skill is paused, so it
// lives in "Coming soon" (page.tsx), never in a list of things you get today.
const SLIDES: Slide[] = [
  {
    tag: 'Ask in WhatsApp',
    title: '“Where’s mum?” — asked in WhatsApp',
    desc: 'Link your number once, then ask in plain words. You get the place, how long ago and the battery — without opening the app. Opt-in, and it respects ghost mode, paused sharing and blocks.',
    iconPath: 'M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z',
    iconColor: 'text-status-ok', iconBg: 'bg-status-ok/10',
  },
  {
    tag: 'Trips',
    title: 'Share the trip, skip the texts',
    desc: 'Start a trip and your circle sees a live ETA on the map, then gets one “arrived” alert. No more “are you there yet?”.',
    iconPath: 'M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z',
    iconColor: 'text-primary-soft', iconBg: 'bg-primary/10',
  },
  {
    tag: 'Flights',
    title: 'Watch their flight come in',
    desc: 'Add a flight number and the plane appears on the same map as everyone else. The whole circle hears when it lands.',
    iconPath: 'M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5',
    iconColor: 'text-accent-cyan', iconBg: 'bg-accent-cyan/10',
  },
  {
    tag: 'Official alerts',
    title: 'Government warnings, filtered to your people',
    desc: 'Cyclone, flood, heat and storm warnings from the official feeds in India and the US, matched to where your circle actually is — with the authority’s own instructions, never rewritten.',
    iconPath: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
    iconColor: 'text-status-warn', iconBg: 'bg-status-warn/10',
  },
  {
    tag: 'Place names',
    title: 'Names you recognise — and some it never guesses',
    desc: '“Near Victoria Memorial”, not coordinates. And Loxymity is built never to guess that someone is at a hospital, a place of worship or a school — only a place your circle saved itself can say that.',
    iconPath: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
    iconColor: 'text-primary-soft', iconBg: 'bg-primary/10',
  },
  {
    tag: 'Battery',
    title: 'Gentle on battery, quick when it matters',
    desc: 'No fixed polling. About once a minute while you move, about every ten minutes when you are still, slower on low battery — and faster during an SOS, a trip or Live mode.',
    iconPath: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
    iconColor: 'text-status-ok', iconBg: 'bg-status-ok/10',
  },
  {
    tag: 'One plan, whole circle',
    title: 'One person pays. Everyone is covered.',
    desc: 'Plans cover circles, not seats. Put a circle on a plan and every member gets its longer history, calls and — from Platinum — driving reports, on their own free account.',
    iconPath: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
    iconColor: 'text-primary-soft', iconBg: 'bg-primary/10',
  },
];

export function DifferentiatorCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const count = SLIDES.length;
  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );
  const prev = useCallback(() => go(index - 1), [go, index]);
  const next = useCallback(() => go(index + 1), [go, index]);

  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Gentle autoplay — paused on hover/focus/touch, and disabled entirely for users who prefer
  // reduced motion. Manual controls always work. Keyed on `index` so a manual move restarts the
  // timer (and the progress bar) from the slide the visitor chose.
  useEffect(() => {
    if (paused || reduced) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [paused, reduced, count, index]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setPaused(true); // stop autoplay from fighting a swipe
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    touchStartX.current = null;
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      role="group"
      aria-roledescription="carousel"
      aria-label="What sets Loxymity apart"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Viewport */}
      <div
        className="overflow-hidden rounded-3xl card-premium gradient-border"
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
                <span className="eyebrow mb-4">{s.tag}</span>
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-dark-text mb-4 text-balance">{s.title}</h3>
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
        className="absolute left-2 md:-left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-dark-border bg-dark-bg/90 backdrop-blur flex items-center justify-center text-dark-muted hover:text-dark-text hover:border-primary/40 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next"
        className="absolute right-2 md:-right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-dark-border bg-dark-bg/90 backdrop-blur flex items-center justify-center text-dark-muted hover:text-dark-text hover:border-primary/40 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Autoplay progress: refills for each slide, hidden while paused or for reduced motion. */}
      <div className="mx-auto mt-6 h-px w-40 overflow-hidden rounded-full bg-dark-border" aria-hidden="true">
        {!paused && !reduced && (
          <div
            key={index}
            className="h-full origin-left bg-primary"
            style={{ animation: `progress-fill ${AUTOPLAY_MS}ms linear both` }}
          />
        )}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2.5 mt-5">
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
