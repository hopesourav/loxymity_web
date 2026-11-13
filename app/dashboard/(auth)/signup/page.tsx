'use client';

/**
 * Create an account on the web — the same account the app uses, made the same way the app makes it
 * (app repo app/(auth)/register: age → credentials → 6-digit code):
 *
 *   1. the neutral age question (month + year). Under 18 stops HERE, before any account exists,
 *      and is remembered on this browser for 24 hours;
 *   2. name, email, password and the Terms → supabase.auth.signUp with the same metadata the app
 *      sends (display_name, terms/privacy version, age band, analytics off);
 *   3. the 6-digit code from the confirmation email → verifyOtp({ type: 'email' }), then
 *      record_consent so the acceptance is on record (it backfills from the sign-up metadata).
 *
 * An email that already has an account gets no email from Supabase (identities comes back empty),
 * so that case is caught and sent to sign in instead of waiting for a code that never comes.
 */
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '../../_lib/client';
import { acceptTerms } from '../../_lib/webBilling';
import { latchMinor, minorLatched, type ConsentBand } from '../../_lib/age';
import { captureNext, takeNext } from '../../_lib/nextPath';
import { AgeStep, MinorNotice } from '../../_components/AgeStep';
import { LEGAL_VERSION } from '../../../_components/LegalPage';

const PASSWORD_MIN_LENGTH = 8;   // = app src/lib/validation.ts
type Step = 'checking' | 'age' | 'minor' | 'details' | 'code' | 'exists';

export default function SignupPage() {
  const [step, setStep] = useState<Step>('checking');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);
  const [loginHref, setLoginHref] = useState('/dashboard/login/');

  useEffect(() => {
    const next = captureNext();
    if (next) setLoginHref(`/dashboard/login/?next=${encodeURIComponent(next)}`);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { window.location.href = takeNext('/dashboard/plan/'); return; }
      setStep(minorLatched() ? 'minor' : 'age');
    });
  }, []);

  function onAge(band: ConsentBand) {
    if (band === 'minor') { latchMinor(); setStep('minor'); return; }
    setStep('details');
  }

  async function createAccount(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (name.trim().length < 2) { setError('Please enter your name.'); return; }
    if (password.length < PASSWORD_MIN_LENGTH) { setError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters.`); return; }
    if (!agreed) { setError('Please accept the Terms and Privacy Policy.'); return; }
    setBusy(true);
    const { data, error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          display_name: name.trim(),
          terms_version: LEGAL_VERSION,
          privacy_version: LEGAL_VERSION,
          age_band: 'adult',
          analytics: false,
        },
        emailRedirectTo: `${window.location.origin}/dashboard/login/`,
      },
    });
    setBusy(false);
    if (err) { setError(err.message); return; }
    if (data.user && (data.user.identities?.length ?? 0) === 0) { setStep('exists'); return; }
    setStep('code');
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const { error: err } = await supabase.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: 'email' });
    if (err) { setBusy(false); setError('That code didn’t work. Check the latest email and try again.'); return; }
    await acceptTerms(null);   // backfills the sign-up acceptance; the age band carries over
    window.location.href = takeNext('/dashboard/plan/');
  }

  async function resend() {
    setError(''); setInfo('');
    const { error: err } = await supabase.auth.resend({ type: 'signup', email: email.trim() });
    if (err) setError(err.message); else setInfo('We sent a new code.');
  }

  const input = 'w-full bg-dark-bg border border-dark-border rounded-xl px-3.5 py-2.5 text-sm text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary';

  return (
    <div className="min-h-dvh bg-dark-bg flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image src="/icon.png" alt="Loxymity" width={80} height={80} className="rounded-2xl mx-auto mb-4" />
          <p className="font-display text-3xl font-bold text-dark-text">Create your account</p>
          <p className="text-dark-muted text-sm mt-1">The same account works in the Loxymity app.</p>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
          {step === 'checking' && <div className="flex justify-center py-6"><div className="w-6 h-6 border-2 border-dark-border border-t-primary rounded-full animate-spin" /></div>}

          {step === 'age' && <AgeStep onAnswer={onAge} />}

          {step === 'minor' && <MinorNotice />}

          {step === 'details' && (
            <form onSubmit={createAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-dark-muted mb-1.5">Your name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required maxLength={40} className={input} />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-muted mb-1.5">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required className={input} placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-muted mb-1.5">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required minLength={PASSWORD_MIN_LENGTH} className={input} />
                <p className="text-xs text-dark-muted mt-1">At least {PASSWORD_MIN_LENGTH} characters.</p>
              </div>
              <label className="flex items-start gap-3 text-xs text-dark-text">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-[#C9A227]" />
                <span>
                  I agree to the <a href="/terms/" target="_blank" className="text-primary underline">Terms</a> and
                  the <a href="/privacy/" target="_blank" className="text-primary underline">Privacy Policy</a>.
                </span>
              </label>
              {error && <p className="text-sm text-brand-danger bg-brand-danger/10 rounded-lg px-3 py-2">{error}</p>}
              <button type="submit" disabled={busy} className="w-full bg-primary hover:opacity-90 disabled:opacity-50 text-dark-bg font-semibold py-2.5 rounded-xl text-sm transition-opacity">
                {busy ? 'Creating…' : 'Create account'}
              </button>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={verify} className="space-y-4">
              <p className="text-sm text-dark-text">We emailed a 6-digit code to <span className="font-semibold">{email}</span>.</p>
              <input inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required
                value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className={`${input} tracking-[0.5em] text-center text-lg`} placeholder="••••••" />
              {error && <p className="text-sm text-brand-danger bg-brand-danger/10 rounded-lg px-3 py-2">{error}</p>}
              {info && <p className="text-xs text-dark-muted">{info}</p>}
              <button type="submit" disabled={busy || code.length !== 6} className="w-full bg-primary hover:opacity-90 disabled:opacity-50 text-dark-bg font-semibold py-2.5 rounded-xl text-sm transition-opacity">
                {busy ? 'Checking…' : 'Confirm'}
              </button>
              <button type="button" onClick={resend} className="w-full text-xs text-dark-muted hover:text-dark-text">Send a new code</button>
            </form>
          )}

          {step === 'exists' && (
            <div className="space-y-3 text-center">
              <p className="text-sm text-dark-text">You already have a Loxymity account with this email.</p>
              <a href={loginHref} className="inline-block bg-primary text-dark-bg font-semibold px-5 py-2.5 rounded-xl text-sm">Sign in</a>
              <p className="text-xs text-dark-muted">Forgot the password? Reset it from the sign-in page.</p>
            </div>
          )}
        </div>

        {step !== 'exists' && (
          <p className="text-center text-sm text-dark-muted mt-6">
            Already have an account? <a href={loginHref} className="text-primary hover:underline">Sign in</a>
          </p>
        )}
      </div>
    </div>
  );
}
