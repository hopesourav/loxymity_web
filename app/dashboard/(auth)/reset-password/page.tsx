'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../_lib/client';
import { IconEye, IconEyeOff, IconCheck } from '../../_components/Icons';

type Stage = 'request' | 'new-password' | 'done' | 'error';

export default function ResetPasswordPage() {
  const [stage, setStage]   = useState<Stage>('request');
  const [email, setEmail]   = useState('');
  const [pw, setPw]         = useState('');
  const [pw2, setPw2]       = useState('');
  const [showPw, setShowPw] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Supabase redirects with #access_token=...&type=recovery in the hash.
  // onAuthStateChange fires PASSWORD_RECOVERY when the token is consumed.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setStage('new-password');
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/dashboard/reset-password/`,
    });
    setLoading(false);
    if (error) { setMessage(error.message); return; }
    setMessage('Check your email for a reset link.');
  }

  async function handleNewPassword(e: React.FormEvent) {
    e.preventDefault();
    if (pw !== pw2) { setMessage('Passwords do not match.'); return; }
    if (pw.length < 6) { setMessage('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (error) { setMessage(error.message); return; }
    setStage('done');
  }

  return (
    <div className="min-h-dvh bg-dark-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-3xl font-bold text-dark-text">Loxymity</p>
          <p className="text-dark-muted text-sm mt-1">
            {stage === 'new-password' ? 'Set a new password' : 'Reset your password'}
          </p>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
          {stage === 'request' && (
            <form onSubmit={handleRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-dark-muted mb-1.5">Email</label>
                <input
                  type="email" required autoComplete="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3.5 py-2.5 text-sm text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="you@example.com"
                />
              </div>
              {message && <p className="text-sm text-brand-success">{message}</p>}
              <button
                type="submit" disabled={loading}
                className="w-full bg-primary hover:opacity-90 disabled:opacity-50 text-dark-bg font-semibold py-2.5 rounded-xl text-sm transition-opacity"
              >
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          )}

          {stage === 'new-password' && (
            <form onSubmit={handleNewPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-dark-muted mb-1.5">New password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'} required minLength={6}
                    value={pw} onChange={e => setPw(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-3.5 py-2.5 text-sm text-dark-text focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-2.5 text-dark-muted">
                    {showPw ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-muted mb-1.5">Confirm password</label>
                <input
                  type="password" required value={pw2} onChange={e => setPw2(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3.5 py-2.5 text-sm text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>
              {message && <p className="text-sm text-brand-danger">{message}</p>}
              <button
                type="submit" disabled={loading}
                className="w-full bg-primary hover:opacity-90 disabled:opacity-50 text-dark-bg font-semibold py-2.5 rounded-xl text-sm transition-opacity"
              >
                {loading ? 'Updating…' : 'Set new password'}
              </button>
            </form>
          )}

          {stage === 'done' && (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-brand-success/20 flex items-center justify-center mx-auto">
                <IconCheck className="text-brand-success" size={22} />
              </div>
              <p className="text-sm text-dark-text font-semibold">Password updated!</p>
              <a
                href="/dashboard/login/"
                className="block w-full bg-primary hover:opacity-90 text-dark-bg font-semibold py-2.5 rounded-xl text-sm transition-opacity text-center"
              >
                Sign in
              </a>
            </div>
          )}
        </div>

        <p className="text-center mt-4">
          <a href="/dashboard/login/" className="text-xs text-dark-muted hover:text-dark-text transition-colors">
            ← Back to sign in
          </a>
        </p>
      </div>
    </div>
  );
}
