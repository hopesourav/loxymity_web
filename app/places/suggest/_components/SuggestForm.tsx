'use client';

/**
 * The suggestion form: sign in (email + password, or Google — the website has no Apple sign-in, so
 * Apple accounts report from the app), pick the point on the map, say what is wrong, send.
 *
 * Sent with the person's own session to submit_poi_feedback (channel 'web'): the server checks the
 * switch, adults only, 10 a day, and the shape. One client_id per form, so a double click or a
 * retry after a lost answer is the same report. The point sent is the pin — where the PLACE is.
 */
import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../../dashboard/_lib/client';
import {
  KIND_LABEL, LIMITS, NOT_HERE_REASONS, SUBMIT_ERROR, SUGGESTED_TYPES,
  type FeedbackKind, type NotHereReason, type SuggestedType,
} from '../../../_lib/poiFeedback';

const PickMap = dynamic(() => import('./PickMap'), { ssr: false });

const INPUT = 'w-full bg-dark-bg border border-dark-border rounded-xl px-3.5 py-2.5 text-sm text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary';

function newClientId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

export default function SuggestForm() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-7 h-7 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }
  return session ? <ReportForm email={session.user.email ?? null} /> : <SignIn />;
}

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function withPassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) setError(err.message);
  }

  async function withGoogle() {
    setError('');
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/places/suggest/` },
    });
    if (err) { setBusy(false); setError(err.message); }
  }

  return (
    <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 space-y-4">
      <div>
        <p className="font-semibold text-dark-text">Sign in with your Loxymity account</p>
        <p className="text-dark-muted text-sm mt-1">
          Suggestions come from people who use Loxymity, so we can keep the names everyone sees free of spam.
        </p>
      </div>
      <form onSubmit={withPassword} className="space-y-3">
        <div>
          <label htmlFor="sp-email" className="block text-xs font-medium text-dark-muted mb-1.5">Email</label>
          <input id="sp-email" type="email" autoComplete="email" required value={email}
            onChange={(e) => setEmail(e.target.value)} className={INPUT} placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="sp-password" className="block text-xs font-medium text-dark-muted mb-1.5">Password</label>
          <input id="sp-password" type="password" autoComplete="current-password" required value={password}
            onChange={(e) => setPassword(e.target.value)} className={INPUT} />
        </div>
        {error && <p role="alert" className="text-sm text-brand-danger">{error}</p>}
        <button type="submit" disabled={busy}
          className="w-full bg-primary hover:bg-primary-dark text-dark-bg font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <button type="button" onClick={withGoogle} disabled={busy}
        className="w-full border border-dark-border text-dark-text font-semibold py-2.5 rounded-xl text-sm hover:bg-dark-border transition-colors disabled:opacity-50">
        Continue with Google
      </button>
      <p className="text-dark-muted text-xs">
        Signed up with Apple? Send suggestions from the app: open a stop in Activity and tap &ldquo;Name not right?&rdquo;.
      </p>
    </div>
  );
}

function ReportForm({ email }: { email: string | null }) {
  const [kind, setKind] = useState<FeedbackKind | null>(null);
  const [point, setPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [shown, setShown] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<SuggestedType | ''>('');
  const [reason, setReason] = useState<NotHereReason | ''>('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<null | { duplicate: boolean }>(null);
  const [clientId, setClientId] = useState(newClientId);

  const needsShown = kind === 'wrong_name' || kind === 'not_here';
  const needsName = kind === 'wrong_name' || kind === 'new_place';
  const ready = useMemo(() => {
    if (!kind || !point) return false;
    if (needsShown && !shown.trim()) return false;
    if (needsName && !name.trim()) return false;
    if (kind === 'new_place' && !type) return false;
    return true;
  }, [kind, point, shown, name, type, needsShown, needsName]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || busy || !kind || !point) return;
    setBusy(true);
    setError('');
    const { data, error: err } = await supabase.rpc('submit_poi_feedback', {
      p: {
        kind,
        channel: 'web',
        client_id: clientId,
        shown_name: needsShown ? shown.trim() : null,
        suggested_name: needsName ? name.trim() : null,
        suggested_type: kind === 'new_place' ? type : null,
        reason: kind === 'not_here' && reason ? reason : null,
        lat: point.lat,
        lng: point.lng,
        note: note.trim() || null,
      },
    });
    setBusy(false);
    if (err) { setError("Couldn't send. Check your connection and try again."); return; }
    const d = data as { ok?: boolean; error?: string; duplicate?: boolean } | null;
    if (d?.ok) { setDone({ duplicate: !!d.duplicate }); return; }
    setError(SUBMIT_ERROR[d?.error ?? ''] ?? "Couldn't send. Please try again.");
  }

  function another() {
    setKind(null); setPoint(null); setShown(''); setName(''); setType(''); setReason(''); setNote('');
    setDone(null); setError(''); setClientId(newClientId());
  }

  if (done) {
    return (
      <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 space-y-3" role="status">
        <p className="font-semibold text-dark-text text-lg">Thanks — we&apos;ll check it</p>
        <p className="text-dark-muted text-sm">
          {done.duplicate
            ? "We already have this suggestion from you, and we'll check it soon."
            : "We review suggestions every day. If it's right, the name usually changes within 2 days."}
        </p>
        <button type="button" onClick={another}
          className="bg-primary hover:bg-primary-dark text-dark-bg font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={send} className="space-y-6">
      <div className="flex items-center justify-between gap-3 text-xs text-dark-muted">
        <span>Signed in{email ? ` as ${email}` : ''}</span>
        <button type="button" onClick={() => supabase.auth.signOut()} className="underline hover:text-dark-text">Sign out</button>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-dark-text mb-2">What would you like to tell us?</legend>
        {(Object.keys(KIND_LABEL) as FeedbackKind[]).map((k) => (
          <label key={k} className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
            kind === k ? 'border-primary bg-primary/10' : 'border-dark-border hover:border-dark-muted'}`}>
            <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => { setKind(k); setError(''); }} />
            <span className="text-sm text-dark-text">{KIND_LABEL[k]}</span>
          </label>
        ))}
      </fieldset>

      {kind && (
        <>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-dark-text">
              {kind === 'new_place' ? 'Where is the place?' : 'Where is the place Loxymity names?'}
            </p>
            <p className="text-dark-muted text-xs">Click the map to put the pin on the place, then drag it to adjust.</p>
            <PickMap point={point} onPick={(lat, lng) => setPoint({ lat, lng })} />
            {!point && <p className="text-dark-muted text-xs">No pin yet.</p>}
          </div>

          {needsShown && (
            <div>
              <label htmlFor="sp-shown" className="block text-xs font-medium text-dark-muted mb-1.5">
                What Loxymity shows
              </label>
              <input id="sp-shown" className={INPUT} value={shown} maxLength={LIMITS.shownNameMax}
                onChange={(e) => setShown(e.target.value)} placeholder="e.g. Near Howrah Stn" />
            </div>
          )}

          {needsName && (
            <div>
              <label htmlFor="sp-name" className="block text-xs font-medium text-dark-muted mb-1.5">
                {kind === 'wrong_name' ? 'The right name' : "The place's name"}
              </label>
              <input id="sp-name" className={INPUT} value={name} maxLength={LIMITS.suggestedNameMax}
                onChange={(e) => setName(e.target.value)} placeholder="The name people use here" />
            </div>
          )}

          {kind === 'new_place' && (
            <div>
              <label htmlFor="sp-type" className="block text-xs font-medium text-dark-muted mb-1.5">What kind of place is it?</label>
              <select id="sp-type" className={INPUT} value={type} onChange={(e) => setType(e.target.value as SuggestedType)}>
                <option value="">Choose…</option>
                {SUGGESTED_TYPES.map(([k, label]) => <option key={k} value={k}>{label}</option>)}
              </select>
            </div>
          )}

          {kind === 'not_here' && (
            <fieldset className="space-y-2">
              <legend className="text-xs font-medium text-dark-muted mb-1.5">What&apos;s wrong? (optional)</legend>
              {NOT_HERE_REASONS.map(([k, label]) => (
                <label key={k} className="flex items-center gap-2 text-sm text-dark-text cursor-pointer">
                  <input type="radio" name="reason" value={k} checked={reason === k} onChange={() => setReason(k)} />
                  {label}
                </label>
              ))}
            </fieldset>
          )}

          <div>
            <label htmlFor="sp-note" className="block text-xs font-medium text-dark-muted mb-1.5">
              Anything that helps us check it (optional)
            </label>
            <textarea id="sp-note" className={`${INPUT} min-h-[88px]`} value={note} maxLength={LIMITS.noteMax}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. it was renamed in 2024 — please don't include anyone's personal details" />
          </div>

          <p className="text-dark-muted text-xs leading-relaxed">
            Use a public name only — never someone&apos;s home. We keep your suggestion with your account for up to
            180 days to prevent misuse, then keep only the suggestion itself. See our{' '}
            <a href="/privacy/" className="underline hover:text-dark-text">Privacy Policy</a>.
          </p>

          {error && <p role="alert" className="text-sm text-brand-danger bg-brand-danger/10 rounded-lg px-3 py-2">{error}</p>}

          <button type="submit" disabled={!ready || busy}
            className="w-full bg-primary hover:bg-primary-dark text-dark-bg font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-50">
            {busy ? 'Sending…' : 'Send suggestion'}
          </button>
        </>
      )}
    </form>
  );
}
