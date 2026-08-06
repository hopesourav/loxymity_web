'use client';

import { useEffect, useState } from 'react';

// Referral landing page. Reached when someone taps a referral link and either
// the app isn't installed or App Links aren't verified on their device. We copy
// the code to the clipboard (so a fresh install can auto-detect it — deferred
// attribution), try to open the app via the custom scheme, and show store links.

const PLAY_URL =
  'https://play.google.com/store/apps/details?id=com.sawsibinfotech.loxymity';
// TODO: replace with the real App Store URL once the iOS app is published.
const APP_STORE_URL = 'https://apps.apple.com/app/loxymity/id0000000000';
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
    if (!CODE_RE.test(raw)) return;
    setCode(raw);

    // Copy for deferred attribution after install.
    navigator.clipboard?.writeText(raw).then(() => setCopied(true)).catch(() => {});

    // Try to open the app if it's installed (custom scheme).
    const t = setTimeout(() => {
      window.location.href = `loxymity://refer?code=${encodeURIComponent(raw)}`;
    }, 400);
    return () => clearTimeout(t);
  }, []);

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
        Install the app and you&apos;ll both get a <strong style={{ color: '#F1F5F9' }}>free week of Pro</strong>{' '}
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
          {copied && <div style={{ fontSize: 12, color: '#10B981', marginTop: 6 }}>Copied — we&apos;ll fill it in for you</div>}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 320 }}>
        <a href={PLAY_URL} style={btnStyle('#5C6BF8', '#fff')}>Get it on Google Play</a>
        <a href={APP_STORE_URL} style={btnStyle('transparent', '#F1F5F9', '#334155')}>Download on the App Store</a>
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
