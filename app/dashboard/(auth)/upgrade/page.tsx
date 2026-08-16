'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../_lib/client';
import { hasProAccess } from '../../../_lib/tiers';
import {
  PRO_PRICE_DISPLAY, RAZORPAY_SCRIPT_URL, STRIPE_LIVE,
} from '../../_lib/constants';
import { IconCheck, IconLock } from '../../_components/Icons';

type Stage = 'wall' | 'processing' | 'timeout';
type Gateway = 'razorpay' | 'stripe';

const FEATURES = [
  'Live map — see your circle in real time',
  'Activity feed — geofence & safety events',
  'History playback — replay any member\'s day',
  'Geofence manager — create & edit fences from web',
  'Circle admin — invite, approve, manage roles',
  'Share links — share your location with anyone',
];

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).Razorpay) { resolve(); return; }
    const s = document.createElement('script');
    s.src = RAZORPAY_SCRIPT_URL;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.head.appendChild(s);
  });
}

export default function UpgradePage() {
  const [stage, setStage]       = useState<Stage>('wall');
  const [error, setError]       = useState('');
  const [activeGateway, setActiveGateway] = useState<Gateway | null>(null);
  const [checking, setChecking] = useState(true);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check existing session & detect Stripe redirect-back
  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/dashboard/login/'; return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier,web_tier')
        .eq('id', session.user.id)
        .single();

      if (hasProAccess(profile)) {
        window.location.href = '/dashboard/';
        return;
      }

      // Stripe redirects back with ?checkout=stripe on success
      const params = new URLSearchParams(window.location.search);
      if (params.get('checkout') === 'stripe') {
        setStage('processing');
        setActiveGateway('stripe');
      }

      setChecking(false);
    }
    check();
  }, []);

  // Poll for pro access after payment
  useEffect(() => {
    if (stage !== 'processing') return;
    let attempts = 0;
    pollRef.current = setInterval(async () => {
      attempts++;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier,web_tier')
        .eq('id', session.user.id)
        .single();

      if (hasProAccess(profile)) {
        clearInterval(pollRef.current!);
        window.location.href = '/dashboard/';
      } else if (attempts >= 15) { // 30 s — Stripe webhooks can be slower
        clearInterval(pollRef.current!);
        setStage('timeout');
      }
    }, 2000);
    return () => clearInterval(pollRef.current!);
  }, [stage]);

  async function handleRazorpay() {
    setError(''); setActiveGateway('razorpay');
    try {
      await loadRazorpayScript();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/dashboard/login/'; return; }

      const { data, error: fnErr } = await supabase.functions.invoke('razorpay-checkout', {});
      if (fnErr || !data?.subscription_id) {
        setError('Could not start checkout. Please try again.'); setActiveGateway(null); return;
      }

      const { subscription_id, key_id } = data as { subscription_id: string; key_id: string };
      const rzp = new (window as any).Razorpay({
        key: key_id,
        subscription_id,
        name: 'Loxymity',
        description: 'Pro — Web Dashboard',
        prefill: { email: session.user.email ?? '' },
        theme: { color: '#C9A227' },
        handler: () => { setStage('processing'); },
        modal: { ondismiss: () => setActiveGateway(null) },
      });
      rzp.open();
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong.'); setActiveGateway(null);
    }
  }

  async function handleStripe() {
    setError(''); setActiveGateway('stripe');
    try {
      const { data, error: fnErr } = await supabase.functions.invoke('stripe-checkout', {});
      if (fnErr || !data?.url) {
        setError('Could not start Stripe checkout. Please try again.'); setActiveGateway(null); return;
      }
      window.location.href = data.url;
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong.'); setActiveGateway(null);
    }
  }

  if (checking) return <Spinner />;

  if (stage === 'processing') {
    return (
      <div className="min-h-dvh bg-dark-bg flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-dark-border border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-dark-text font-semibold">Setting up your Pro access…</p>
          <p className="text-dark-muted text-sm">This takes a few seconds.</p>
        </div>
      </div>
    );
  }

  if (stage === 'timeout') {
    return (
      <div className="min-h-dvh bg-dark-bg flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-dark-text font-semibold">Taking longer than expected</p>
          <p className="text-dark-muted text-sm">
            Your payment was received. Refresh in a moment, or contact us if this persists.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-primary text-dark-bg font-semibold rounded-xl text-sm"
            >
              Refresh
            </button>
            <a
              href="mailto:support@loxymity.com"
              className="px-5 py-2.5 border border-dark-border text-dark-muted rounded-xl text-sm hover:border-primary transition-colors"
            >
              Contact support
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-dark-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-3xl font-bold text-dark-text">Loxymity</p>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <IconLock className="text-primary" size={18} />
            </div>
            <div>
              <p className="font-semibold text-dark-text">Pro Dashboard</p>
              <p className="text-sm text-dark-muted">{PRO_PRICE_DISPLAY}</p>
            </div>
          </div>

          {/* Feature list */}
          <ul className="space-y-2.5 mb-6">
            {FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-dark-muted">
                <IconCheck className="text-brand-success shrink-0 mt-0.5" size={15} />
                {f}
              </li>
            ))}
          </ul>

          {error && (
            <p className="text-sm text-brand-danger bg-brand-danger/10 rounded-lg px-3 py-2 mb-4">
              {error}
            </p>
          )}

          {/* Payment buttons */}
          <div className={`${STRIPE_LIVE ? 'grid grid-cols-2 gap-3' : ''}`}>
            {STRIPE_LIVE && (
              <button
                onClick={handleStripe}
                disabled={activeGateway !== null}
                className="flex flex-col items-center gap-1 px-4 py-3 bg-dark-bg border border-dark-border rounded-xl hover:border-primary disabled:opacity-50 transition-colors"
              >
                <span className="text-sm font-semibold text-dark-text">Stripe</span>
                <span className="text-xs text-dark-muted">Card / UPI</span>
                {activeGateway === 'stripe' && (
                  <div className="w-4 h-4 border-2 border-dark-border border-t-primary rounded-full animate-spin mt-1" />
                )}
              </button>
            )}

            <button
              onClick={handleRazorpay}
              disabled={activeGateway !== null}
              className={`${STRIPE_LIVE ? '' : 'w-full'} flex flex-col items-center gap-1 px-4 py-3 bg-primary hover:opacity-90 disabled:opacity-50 rounded-xl transition-opacity`}
            >
              {STRIPE_LIVE ? (
                <>
                  <span className="text-sm font-bold text-dark-bg">Razorpay</span>
                  <span className="text-xs text-dark-bg/70">UPI / Netbanking</span>
                  {activeGateway === 'razorpay' && (
                    <div className="w-4 h-4 border-2 border-dark-bg/30 border-t-dark-bg rounded-full animate-spin mt-1" />
                  )}
                </>
              ) : (
                <span className="text-sm font-bold text-dark-bg">
                  {activeGateway === 'razorpay' ? 'Opening checkout…' : `Get Pro — ${PRO_PRICE_DISPLAY}`}
                </span>
              )}
            </button>
          </div>

          <p className="text-xs text-dark-muted text-center mt-4">
            Already subscribed on the mobile app?{' '}
            <a href="/dashboard/login/" className="text-primary hover:underline">Sign in</a>
            {' '}— Pro carries over automatically.
          </p>
        </div>

        <p className="text-center mt-4 space-x-4">
          <button
            onClick={async () => { await supabase.auth.signOut(); window.location.href = '/dashboard/login/'; }}
            className="text-xs text-dark-muted hover:text-brand-danger transition-colors"
          >
            Sign out
          </button>
          <a href="mailto:support@loxymity.com" className="text-xs text-dark-muted hover:text-dark-text transition-colors">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="min-h-dvh bg-dark-bg flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
    </div>
  );
}
