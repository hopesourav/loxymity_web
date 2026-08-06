'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '../../_lib/client';
import { IconEye, IconEyeOff } from '../../_components/Icons';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [checking, setChecking] = useState(true);

  // Restore existing session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) window.location.href = '/dashboard/';
      else setChecking(false);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    window.location.href = '/dashboard/';
  }

  async function handleGoogleSignIn() {
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard/auth/callback/` },
    });
    if (err) { setLoading(false); setError(err.message); }
  }

  if (checking) {
    return (
      <div className="min-h-dvh bg-dark-bg flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-dark-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image src="/icon.png" alt="Loxymity" width={96} height={96} className="rounded-2xl mx-auto mb-4" />
          <p className="font-display text-3xl font-bold text-dark-text">Loxymity</p>
          <p className="text-dark-muted text-sm mt-1">Sign in to your Pro account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-dark-surface border border-dark-border rounded-2xl p-6 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-dark-muted mb-1.5">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-3.5 py-2.5 text-sm text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-dark-muted">Password</label>
              <a
                href="/dashboard/reset-password/"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-3.5 py-2.5 text-sm text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-2.5 text-dark-muted hover:text-dark-text transition-colors"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <IconEyeOff size={16} /> : <IconEye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-brand-danger bg-brand-danger/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:opacity-90 disabled:opacity-50 text-dark-bg font-semibold py-2.5 rounded-xl text-sm transition-opacity"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 flex items-center gap-3">
          <span className="flex-1 h-px bg-dark-border" />
          <span className="text-xs text-dark-muted">or</span>
          <span className="flex-1 h-px bg-dark-border" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="mt-4 w-full flex items-center justify-center gap-3 bg-dark-surface border border-dark-border hover:border-primary disabled:opacity-50 text-dark-text font-semibold py-2.5 rounded-xl text-sm transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* New user CTA */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-dark-muted">
            New to Loxymity? Get the app first.
          </p>
          <div className="flex justify-center gap-3">
            <a
              href="https://apps.apple.com"
              className="px-4 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs font-semibold text-dark-text hover:border-primary transition-colors"
            >
              App Store
            </a>
            <a
              href="https://play.google.com"
              className="px-4 py-2 bg-dark-surface border border-dark-border rounded-xl text-xs font-semibold text-dark-text hover:border-primary transition-colors"
            >
              Google Play
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
