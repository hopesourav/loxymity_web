'use client';

/**
 * Delete (or restore) a Loxymity account on the web — Google Play's "web link resource" for
 * account deletion. Same server functions as the app (migration 0302):
 *   my_account_deletion · request_account_deletion(p_now) · cancel_account_deletion
 *
 * Sign-in is a 6-digit email code (signInWithOtp, shouldCreateUser: false): it works for password,
 * Google and Apple accounts alike, needs no OAuth redirect (only the app's loxymity:// addresses
 * are allow-listed), and can never create an account. A session older than 10 minutes asks for a
 * fresh code first, so an old open browser cannot delete someone's account.
 *
 * The request signs out every device on the server, this browser included; we drop the local
 * session too.
 */
import { useEffect, useState } from 'react';
import { supabase } from '../dashboard/_lib/client';

type Status =
  | { scheduled: false }
  | { scheduled: true; mode: 'scheduled' | 'immediate'; execute_after: string; can_restore: boolean };

type Step = 'loading' | 'email' | 'code' | 'ready' | 'done';

const FRESH_MS = 10 * 60 * 1000;

function day(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

const input =
  'w-full bg-dark-bg border border-dark-border rounded-xl px-3.5 py-2.5 text-sm text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary';
const primaryBtn =
  'w-full bg-primary hover:opacity-90 disabled:opacity-50 text-dark-bg font-semibold py-2.5 rounded-xl text-sm transition-opacity';
const dangerBtn =
  'w-full bg-brand-danger hover:opacity-90 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition-opacity';
const ghostBtn =
  'w-full border border-dark-border hover:border-dark-muted disabled:opacity-50 text-dark-text font-medium py-2.5 rounded-xl text-sm transition-colors';

export function WebDeletion() {
  const [step, setStep] = useState<Step>('loading');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<Status | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState('');

  async function loadStatus() {
    const { data, error: e } = await supabase.rpc('my_account_deletion');
    if (e || !data) {
      setError('We couldn’t check your account. Please try again.');
      setStep('email');
      return;
    }
    setStatus(data as Status);
    setStep('ready');
  }

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const signedInAt = session?.user?.last_sign_in_at ? Date.parse(session.user.last_sign_in_at) : 0;
      if (session && Date.now() - signedInAt < FRESH_MS) {
        setEmail(session.user.email ?? '');
        await loadStatus();
      } else {
        setStep('email');
      }
    })();
  }, []);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false },
    });
    setBusy(false);
    if (err) {
      setError(/signups not allowed|not found|user/i.test(err.message)
        ? 'We couldn’t find a Loxymity account with that email.'
        : 'We couldn’t send a code just now. Please try again in a minute.');
      return;
    }
    setStep('code');
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: 'email' });
    setBusy(false);
    if (err) {
      setError('That code didn’t work. Check the latest email from Loxymity and try again.');
      return;
    }
    await loadStatus();
  }

  async function requestDeletion(now: boolean) {
    setBusy(true);
    setError(null);
    const { data, error: err } = await supabase.rpc('request_account_deletion', { p_now: now });
    const d = data as { ok?: boolean; mode?: string; execute_after?: string } | null;
    if (err || !d?.ok) {
      setBusy(false);
      setError('We couldn’t delete your account. Please try again, or write to privacy@loxymity.com.');
      return;
    }
    await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
    setBusy(false);
    setDone(d.mode === 'scheduled' && d.execute_after
      ? `Your account will be deleted on ${day(d.execute_after)}. You’ve been signed out on every device. To keep it, sign in to the app before then and tap Restore.`
      : 'Your account is being deleted. It will be gone within a few minutes.');
    setStep('done');
  }

  async function restore() {
    setBusy(true);
    setError(null);
    const { data, error: err } = await supabase.rpc('cancel_account_deletion');
    const d = data as { ok?: boolean; error?: string } | null;
    setBusy(false);
    if (err || !d?.ok) {
      setError(d?.error === 'already_deleting'
        ? 'The deletion has already started, so it can’t be restored.'
        : d?.error === 'sign_in_again'
          ? 'For your security, please sign in again with a new code.'
          : 'We couldn’t restore your account. Please try again.');
      if (d?.error === 'sign_in_again') setStep('email');
      return;
    }
    await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
    setDone('Your account is restored. Open Loxymity and sign in to carry on where you left off.');
    setStep('done');
  }

  return (
    <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 space-y-4 not-prose">
      {step === 'loading' && <p className="text-sm text-dark-muted">Checking…</p>}

      {step === 'email' && (
        <form onSubmit={sendCode} className="space-y-4">
          <p className="text-sm text-[#D6D3CE]">Sign in with the email address on your account. We’ll email you a 6-digit code.</p>
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
                 className={input} placeholder="you@example.com" aria-label="Email" />
          <button type="submit" disabled={busy} className={primaryBtn}>{busy ? 'Sending…' : 'Email me a code'}</button>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={verify} className="space-y-4">
          <p className="text-sm text-[#D6D3CE]">{`Enter the 6-digit code we sent to ${email.trim()}.`}</p>
          <input inputMode="numeric" autoComplete="one-time-code" required maxLength={6} value={code}
                 onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                 className={`${input} tracking-[0.4em] text-center text-lg`} placeholder="••••••" aria-label="Code" />
          <button type="submit" disabled={busy || code.length !== 6} className={primaryBtn}>{busy ? 'Checking…' : 'Continue'}</button>
          <button type="button" onClick={() => { setCode(''); setStep('email'); }} className={ghostBtn}>Use a different email</button>
        </form>
      )}

      {step === 'ready' && status && status.scheduled && (
        <div className="space-y-4">
          <p className="text-dark-text font-semibold">Your account is scheduled for deletion</p>
          <p className="text-sm text-[#D6D3CE]">
            {status.can_restore
              ? `It will be deleted on ${day(status.execute_after)}. Restore it to carry on exactly where you left off.`
              : 'It is being deleted and can’t be restored any more.'}
          </p>
          {status.can_restore && (
            <>
              <button type="button" disabled={busy} onClick={restore} className={primaryBtn}>Restore my account</button>
              <button type="button" disabled={busy} onClick={() => requestDeletion(true)} className={ghostBtn}>Delete it now instead</button>
            </>
          )}
        </div>
      )}

      {step === 'ready' && status && !status.scheduled && (
        <div className="space-y-4">
          <p className="text-sm text-[#D6D3CE]">{`Signed in as ${email.trim() || 'your account'}.`}</p>
          <label className="flex gap-3 items-start text-sm text-[#D6D3CE]">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1" />
            <span>
              I understand that my account and its data will be deleted, that I have 7 days to restore it
              (accounts of anyone under 18 are deleted straight away), and that a store subscription is not
              cancelled by this.
            </span>
          </label>
          <button type="button" disabled={busy || !confirmed} onClick={() => requestDeletion(false)} className={dangerBtn}>
            Delete my account
          </button>
          <button type="button" disabled={busy || !confirmed} onClick={() => requestDeletion(true)} className={ghostBtn}>
            Delete immediately — can’t be restored
          </button>
        </div>
      )}

      {step === 'done' && <p className="text-sm text-dark-text">{done}</p>}

      {error && <p className="text-sm text-brand-danger bg-brand-danger/10 rounded-lg px-3 py-2">{error}</p>}
    </div>
  );
}
