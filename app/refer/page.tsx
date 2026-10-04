'use client';

import { useEffect, useState } from 'react';
import { APP_STORE_URL, DOWNLOAD_URL, playUrlWithReferrer } from '../_lib/appLinks';

// Referral landing page. Reached when someone taps a referral link and either the app isn't
// installed or App Links aren't verified on their device.
//   • Store links come from app/_lib/appLinks.ts (this page used to link the pre-rename package
//     com.sawsibinfotech.loxymity and a placeholder App Store id).
//   • Android: the Play link carries `referrer=referral=<CODE>` — Play returns it on first launch.
//   • Copy and "Open in Loxymity" are buttons: iOS Safari blocks clipboard writes without a tap,
//     and an automatic custom-scheme redirect with no app installed shows an error page.

const CODE_RE = /^[A-Z0-9]{4,12}$/;

export default function ReferPage() {
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Parse ?code= or #code= (client-only; site is statically exported).
    const url = new URL(window.location.href);
    const raw = (url.searchParams.get('code') ?? new URLSearchParams(url.hash.replace(/^#/, '')).get('code') ?? '')
      .trim()
      .toUpperCase();
    if (CODE_RE.test(raw)) setCode(raw);
  }, []);

  const play = code ? playUrlWithReferrer('referral', code) : null;

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        padding: 24,
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        background: '#0F172A',
        color: '#F1F5F9',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 44 }}>🎁</div>
      <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>You&apos;ve been invited to Loxymity</h1>
      <p style={{ fontSize: 15, lineHeight: 1.5, color: '#A0AEC0', maxWidth: 340, margin: 0 }}>
        Install the app and you&apos;ll both get a <strong style={{ color: '#F1F5F9' }}>free week of Platinum</strong>{' '}
        when you join a family circle.
      </p>

      {code && (
        <div
          style={{
            background: '#1E293B',
            border: '1px solid #334155',
            borderRadius: 14,
            padding: '14px 20px',
          }}
        >
          <div style={{ fontSize: 12, color: '#A0AEC0', marginBottom: 4 }}>Your referral code</div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 6, color: '#5C6BF8' }}>{code}</div>
          <button
            type="button"
            style={{ ...btnStyle('transparent', '#F1F5F9', '#334155'), marginTop: 12, width: '100%', cursor: 'pointer' }}
            onClick={() => { navigator.clipboard?.writeText(code).then(() => setCopied(true)).catch(() => {}); }}
          >
            {copied ? 'Copied ✓' : 'Copy code'}
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 320 }}>
        {code && <a href={`loxymity://refer?code=${encodeURIComponent(code)}`} style={btnStyle('#5C6BF8', '#fff')}>Open in Loxymity</a>}
        {play && <a href={play} style={btnStyle('transparent', '#F1F5F9', '#334155')}>Get it on Google Play</a>}
        {APP_STORE_URL && <a href={APP_STORE_URL} style={btnStyle('transparent', '#F1F5F9', '#334155')}>Download on the App Store</a>}
        {DOWNLOAD_URL && <a href={DOWNLOAD_URL} style={btnStyle('transparent', '#F1F5F9', '#334155')}>Get the app</a>}
      </div>

      <p style={{ fontSize: 12, color: '#64748B', maxWidth: 320, margin: 0 }}>
        Already have Loxymity? Open the app and enter code <strong>{code ?? 'above'}</strong> during setup.
      </p>
    </main>
  );
}

function btnStyle(bg: string, color: string, border?: string): React.CSSProperties {
  return {
    display: 'block',
    background: bg,
    color,
    border: border ? `1px solid ${border}` : 'none',
    borderRadius: 12,
    padding: '14px 18px',
    fontSize: 15,
    fontWeight: 700,
    textDecoration: 'none',
  };
}
