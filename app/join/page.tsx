'use client';

import { useEffect, useState } from 'react';
import { LogoFull } from '../_components/Logo';
import { StoreButtons } from '../_components/StoreButtons';
import { APP_STORE_URL, DOWNLOAD_URL, PLAY_URL, playUrlWithReferrer } from '../_lib/appLinks';

// Circle invite landing page — https://loxymity.com/join/<CODE> (or /join?code=<CODE>).
//
// With the app installed, Universal / App Links open the app directly and this page is never
// seen. It is reached when the app is not installed (or links are not verified yet):
//   • Android: the Play button carries `referrer=invite=<CODE>`; Play hands it to the first
//     launch, so the app joins automatically after install.
//   • iOS: there is no install referrer. "Copy code", then "I have an invite" in the app.
// Copying is a TAP, not automatic — iOS Safari only allows clipboard writes from a gesture.
// "Open in Loxymity" is a button, not an automatic redirect: a custom-scheme redirect with no
// app installed shows Safari's "invalid address" error.
//
// A link with a missing or broken code still offers the stores (it used to hide the Play button,
// because the referrer URL needs a code).

const CODE_RE = /^[A-Z0-9]{6}$|^[A-Z0-9]{8}$/;

function readCode(): string | null {
  const url = new URL(window.location.href);
  const fromQuery = url.searchParams.get('code');
  const fromPath = url.pathname.match(/\/join\/([A-Za-z0-9-]+)\/?$/)?.[1];
  const raw = (fromQuery ?? fromPath ?? '').replace(/[\s-]/g, '').toUpperCase();
  return CODE_RE.test(raw) ? raw : null;
}

function pretty(code: string): string {
  return code.length === 8 ? `${code.slice(0, 4)}-${code.slice(4)}` : code;
}

export default function JoinPage() {
  const [code, setCode] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [copy, setCopy] = useState<'idle' | 'done' | 'failed'>('idle');

  useEffect(() => {
    setCode(readCode());
    setReady(true);
  }, []);

  const play = code ? playUrlWithReferrer('invite', code) : PLAY_URL;
  const noStore = !play && !APP_STORE_URL && !DOWNLOAD_URL;

  const onCopy = () => {
    if (!code) return;
    if (!navigator.clipboard) { setCopy('failed'); return; }
    navigator.clipboard.writeText(code).then(() => setCopy('done')).catch(() => setCopy('failed'));
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-dark-bg px-6 py-16 text-center">
      <div className="aurora" aria-hidden="true"><span className="a1" /><span className="a2" /></div>
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6">
        <LogoFull className="text-3xl" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-dark-text">You&apos;re invited to a Loxymity circle</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-dark-muted">
            Loxymity lets your family see where each other is — and gets help to you fast in an emergency.
          </p>
        </div>

        {ready && code && (
          <div className="card-premium w-full rounded-2xl px-5 py-4">
            <p className="text-xs text-dark-muted">Your invite code</p>
            <p className="mt-1 text-3xl font-semibold tracking-[0.2em] text-primary-soft">{pretty(code)}</p>
            <button
              type="button"
              onClick={onCopy}
              className="mt-3 w-full rounded-xl border border-white/[0.1] py-2.5 text-sm font-semibold text-dark-text transition-colors hover:bg-white/5"
            >
              {copy === 'done' ? 'Copied ✓' : copy === 'failed' ? 'Couldn’t copy — type the code instead' : 'Copy code'}
            </button>
            <p className="mt-2 text-xs text-dark-muted">Works once, for one person, for 7 days.</p>
          </div>
        )}

        {ready && !code && (
          <p className="text-sm text-dark-muted">This invite link looks incomplete. Ask the person who invited you to send it again.</p>
        )}

        {code && (
          <a
            href={`loxymity://join?code=${encodeURIComponent(code)}`}
            className="w-full rounded-full bg-primary py-3.5 text-[15px] font-semibold text-dark-bg transition-colors hover:bg-primary-dark"
          >
            Open in Loxymity
          </a>
        )}

        <StoreButtons playHref={play} />
        {DOWNLOAD_URL && (
          <a href={DOWNLOAD_URL} className="text-sm font-semibold text-primary-soft hover:underline">Other ways to get the app</a>
        )}

        <p className="text-[13px] leading-relaxed text-dark-muted">
          {noStore
            ? 'Loxymity isn’t in the app stores yet — ask the person who invited you how to get it. Then '
            : 'After installing, '}
          open Loxymity, tap <strong className="text-dark-text">I have an invite</strong> and paste the code.
        </p>
      </div>
    </main>
  );
}
