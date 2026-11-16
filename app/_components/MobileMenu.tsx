'use client';

import { useEffect, useRef } from 'react';

/**
 * The phone-width menu. A native <details> (works before hydration and with JavaScript off); this
 * client wrapper only CLOSES it — after a link is tapped (a same-page anchor would otherwise leave
 * the panel open over the section it scrolled to), on Escape, and on a tap outside.
 */
export function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const close = () => { if (ref.current) ref.current.open = false; };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    const onDown = (e: PointerEvent) => {
      if (ref.current?.open && !ref.current.contains(e.target as Node)) close();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('hashchange', close);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('hashchange', close);
    };
  }, []);

  const onLink = () => { if (ref.current) ref.current.open = false; };

  return (
    <details ref={ref} className="group relative md:hidden">
      <summary
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-dark-text hover:bg-white/5"
        aria-label="Menu"
      >
        <svg className="h-5 w-5 group-open:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        <svg className="hidden h-5 w-5 group-open:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </summary>
      <div className="absolute right-0 top-12 w-56 rounded-2xl border border-white/[0.08] bg-dark-surface/95 p-2 shadow-2xl backdrop-blur-xl">
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={onLink} className="block rounded-xl px-4 py-2.5 text-sm text-dark-text hover:bg-white/5">
            {l.label}
          </a>
        ))}
        <div className="my-1 h-px bg-white/[0.06]" />
        <a href="/dashboard/login/" onClick={onLink} className="block rounded-xl px-4 py-2.5 text-sm text-dark-muted hover:bg-white/5">
          Web dashboard
        </a>
      </div>
    </details>
  );
}
