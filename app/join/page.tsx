'use client';

import { useEffect, useState } from 'react';
import { APP_STORE_URL, DOWNLOAD_URL, playUrlWithReferrer } from '../_lib/appLinks';

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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCode(readCode());
    setReady(true);
  }, []);

  const play = code ? playUrlWithReferrer('invite', code) : null;
  const noStore = !play && !APP_STORE_URL;

  return (
    <main style={page}>
      <div style={{ fontSize: 44 }} aria-hidden>👋</div>
      <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>You&apos;re invited to a Loxymity circle</h1>
      <p style={muted}>
        Loxymity lets your family see where each other is — and gets help to you fast in an emergency.
      </p>

      {ready && code && (
        <div style={card}>
          <div style={{ fontSize: 12, color: '#A0AEC0', marginBottom: 4 }}>Your invite code</div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 4, color: '#5C6BF8' }}>{pretty(code)}</div>
          <button
            type="button"
            style={{ ...btn('transparent', '#F1F5F9', '#334155'), marginTop: 12, width: '100%', cursor: 'pointer' }}
            onClick={() => {
              navigator.clipboard?.writeText(code).then(() => setCopied(true)).catch(() => {});
            }}
          >
            {copied ? 'Copied ✓' : 'Copy code'}
          </button>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 8 }}>Works once, for one person, for 7 days.</div>
        </div>
      )}

      {ready && !code && (
        <p style={muted}>This invite link looks incomplete. Ask the person who invited you to send it again.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 320 }}>
        {code && (
          <a href={`loxymity://join?code=${encodeURIComponent(code)}`} style={btn('#5C6BF8', '#fff')}>
            Open in Loxymity
          </a>
        )}
        {play && <a href={play} style={btn('transparent', '#F1F5F9', '#334155')}>Get it on Google Play</a>}
        {APP_STORE_URL && <a href={APP_STORE_URL} style={btn('transparent', '#F1F5F9', '#334155')}>Download on the App Store</a>}
        {DOWNLOAD_URL && <a href={DOWNLOAD_URL} style={btn('transparent', '#F1F5F9', '#334155')}>Get the app</a>}
      </div>

      <p style={{ ...muted, fontSize: 13 }}>
        {noStore && !DOWNLOAD_URL
          ? 'Loxymity isn’t in the app stores yet — ask the person who invited you how to get it. '
          : 'After installing, '}
        open Loxymity, tap <strong>I have an invite</strong> and paste the code.
      </p>
    </main>
  );
}

const page: React.CSSProperties = {
  minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  gap: 20, padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  background: '#0F172A', color: '#F1F5F9', textAlign: 'center',
};
const muted: React.CSSProperties = { fontSize: 15, lineHeight: 1.5, color: '#A0AEC0', maxWidth: 340, margin: 0 };
const card: React.CSSProperties = {
  background: '#1E293B', border: '1px solid #334155', borderRadius: 14, padding: '14px 20px', minWidth: 260,
};

function btn(bg: string, color: string, border?: string): React.CSSProperties {
  return {
    display: 'block', background: bg, color, border: border ? `1px solid ${border}` : 'none',
    borderRadius: 12, padding: '14px 18px', fontSize: 15, fontWeight: 700, textDecoration: 'none',
  };
}
