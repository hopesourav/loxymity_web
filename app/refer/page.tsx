'use client';

import { useEffect, useState } from 'react';
import { LogoFull } from '../_components/Logo';
import { StoreButtons } from '../_components/StoreButtons';
import { DOWNLOAD_URL, PLAY_URL, playUrlWithReferrer } from '../_lib/appLinks';

// Referral landing page. Reached when someone taps a referral link and either the app isn't
// installed or App Links aren't verified on their device.
//   • Store links come from app/_lib/appLinks.ts (this page used to link the pre-rename package
//     com.sawsibinfotech.loxymity and a placeholder App Store id).
//   • Android: the Play link carries `referrer=referral=<CODE>` — Play returns it on first launch.
//     Without a code it falls back to the plain listing (it used to show no Play button at all).
//   • Copy and "Open in Loxymity" are buttons: iOS Safari blocks clipboard writes without a tap,
//     and an automatic custom-scheme redirect with no app installed shows an error page.
//   • The reward line links the referral terms (Terms 8.7): rewards are for NEW accounts — a returning
//     account (0303 fingerprint) is refused — and can change or end.

const CODE_RE = /^[A-Z0-9]{4,12}$/;

export default function ReferPage() {
  const [code, setCode] = useState<string | null>(null);
  const [copy, setCopy] = useState<'idle' | 'done' | 'failed'>('idle');

  useEffect(() => {
    // Parse ?code= or #code= (client-only; site is statically exported).
    const url = new URL(window.location.href);
    const raw = (url.searchParams.get('code') ?? new URLSearchParams(url.hash.replace(/^#/, '')).get('code') ?? '')
      .trim()
      .toUpperCase();
    if (CODE_RE.test(raw)) setCode(raw);
  }, []);

  const play = code ? playUrlWithReferrer('referral', code) : PLAY_URL;

  const onCopy = () => {
    if (!code) return;
    if (!navigator.clipboard) { setCopy('failed'); return; }
    navigator.clipboard.writeText(code).then(() => setCopy('done')).catch(() => setCopy('failed'));
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-dark-bg px-6 py-16 text-center">
      <div className="aurora" aria-hidden="true"><span className="a1" /><span className="a3" /></div>
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6">
        <LogoFull className="text-3xl" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-dark-text">You&apos;ve been invited to Loxymity</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-dark-muted">
            Install the app and you can both get a <strong className="text-dark-text">free week of Platinum</strong> when
            you join a family circle.
          </p>
          <p className="mt-2 text-xs text-dark-muted">
            New accounts only. Rewards can change or end — see the{' '}
            <a href="/terms/#plans" className="underline hover:text-dark-text">referral terms</a>.
          </p>
        </div>

        {code && (
          <div className="card-premium w-full rounded-2xl px-5 py-4">
            <p className="text-xs text-dark-muted">Your referral code</p>
            <p className="mt-1 text-3xl font-semibold tracking-[0.2em] text-primary-soft">{code}</p>
            <button
              type="button"
              onClick={onCopy}
              className="mt-3 w-full rounded-xl border border-white/[0.1] py-2.5 text-sm font-semibold text-dark-text transition-colors hover:bg-white/5"
            >
              {copy === 'done' ? 'Copied ✓' : copy === 'failed' ? 'Couldn’t copy — type the code instead' : 'Copy code'}
            </button>
          </div>
        )}

        {code && (
          <a
            href={`loxymity://refer?code=${encodeURIComponent(code)}`}
            className="w-full rounded-full bg-primary py-3.5 text-[15px] font-semibold text-dark-bg transition-colors hover:bg-primary-dark"
          >
            Open in Loxymity
          </a>
        )}

        <StoreButtons playHref={play} />
        {DOWNLOAD_URL && (
          <a href={DOWNLOAD_URL} className="text-sm font-semibold text-primary-soft hover:underline">Other ways to get the app</a>
        )}

        <p className="text-xs text-dark-muted">
          {code
            ? <>Already have Loxymity? Open the app and enter code <strong className="text-dark-text">{code}</strong> during setup.</>
            : 'Already have Loxymity? Open the app and enter the code from your invite during setup.'}
        </p>
      </div>
    </main>
  );
}
