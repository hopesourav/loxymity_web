'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from './_lib/client';
import { AdminContext } from './_lib/adminContext';
import AdminSidebar from './_components/AdminSidebar';

/**
 * Admin access needs a second factor (TOTP). The database enforces it: is_current_user_admin()
 * is true only for an aal2 session (migration 0266), so a password-only session sees no one
 * else's data. This screen gets the session to aal2 — enrolling an authenticator the first time.
 */
type AuthState = 'loading' | 'unauthenticated' | 'not_admin' | 'mfa_enroll' | 'mfa_verify' | 'ready';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [userId, setUserId] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Second factor
  const [factorId, setFactorId] = useState('');
  const [qrSrc, setQrSrc] = useState('');
  const [totpSecret, setTotpSecret] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaError, setMfaError] = useState('');
  const [mfaLoading, setMfaLoading] = useState(false);

  const checkSession = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setAuthState('unauthenticated'); return; }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, is_admin')
      .eq('id', session.user.id)
      .single();

    if (!profile?.is_admin) {
      await supabase.auth.signOut();
      setAuthState('not_admin');
      return;
    }

    setUserId(session.user.id);

    // Already multi-factor? Then in.
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.currentLevel === 'aal2') { setAuthState('ready'); return; }

    const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
    if (factorsError) { setMfaError(factorsError.message); setAuthState('mfa_verify'); return; }
    const verified = factors?.totp?.find((f) => f.status === 'verified');
    if (verified) {
      setFactorId(verified.id);
      setAuthState('mfa_verify');
      return;
    }

    // First time: drop any half-finished enrolment, then enrol a new authenticator.
    for (const f of factors?.all ?? []) {
      if (f.factor_type === 'totp' && f.status !== 'verified') {
        await supabase.auth.mfa.unenroll({ factorId: f.id });
      }
    }
    const { data: enrolled, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'Loxymity Admin',
    });
    if (enrollError || !enrolled) {
      setMfaError(enrollError?.message ?? 'Could not start authenticator setup.');
      setAuthState('mfa_enroll');
      return;
    }
    const qr = enrolled.totp.qr_code;
    setFactorId(enrolled.id);
    setQrSrc(qr.startsWith('data:') ? qr : `data:image/svg+xml;utf-8,${encodeURIComponent(qr)}`);
    setTotpSecret(enrolled.totp.secret);
    setAuthState('mfa_enroll');
  }, []);

  async function handleVerifyCode() {
    setMfaLoading(true);
    setMfaError('');
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code: mfaCode.trim() });
    if (error) {
      setMfaError(error.message);
      setMfaLoading(false);
      return;
    }
    setMfaCode('');
    await checkSession();
    setMfaLoading(false);
  }

  useEffect(() => { checkSession(); }, [checkSession]);

  async function handleLogin() {
    setLoginLoading(true);
    setLoginError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError(error.message);
      setLoginLoading(false);
      return;
    }
    await checkSession();
    setLoginLoading(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setAuthState('unauthenticated');
    setUserId('');
  }

  if (authState === 'loading') {
    return (
      <div className="min-h-dvh bg-dark-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (authState === 'not_admin') {
    return (
      <div className="min-h-dvh bg-dark-bg flex items-center justify-center px-4">
        <div className="bg-dark-surface border border-dark-border rounded-3xl p-8 w-full max-w-sm text-center">
          <div className="w-12 h-12 bg-brand-danger/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-brand-danger">
              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 0 1 5.11 6.524L13.477 14.89zm1.414-1.414A6 6 0 0 0 6.524 5.11L14.89 13.476zM18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="font-bold text-dark-text text-lg">Access denied</p>
          <p className="text-dark-muted text-sm mt-2">Your account does not have admin privileges.</p>
          <button
            onClick={() => setAuthState('unauthenticated')}
            className="mt-6 px-6 py-2.5 bg-dark-bg border border-dark-border rounded-xl text-sm text-dark-muted hover:text-dark-text transition-colors"
          >
            Try another account
          </button>
        </div>
      </div>
    );
  }

  if (authState === 'mfa_enroll' || authState === 'mfa_verify') {
    const enrolling = authState === 'mfa_enroll';
    return (
      <div className="min-h-dvh bg-dark-bg flex items-center justify-center px-4">
        <div className="bg-dark-surface border border-dark-border rounded-3xl p-8 w-full max-w-sm shadow-2xl">
          <div className="mb-6">
            <p className="font-display text-2xl font-bold text-dark-text">Loxymity</p>
            <p className="text-primary text-sm font-semibold mt-0.5">
              {enrolling ? 'Set up two-step sign-in' : 'Two-step sign-in'}
            </p>
          </div>

          {enrolling ? (
            <>
              <p className="text-dark-muted text-sm mb-4">
                Admin access needs a second step. Scan this with an authenticator app (Google
                Authenticator, 1Password, Authy…), then enter the 6-digit code it shows.
              </p>
              {qrSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrSrc} alt="Authenticator QR code" className="w-44 h-44 mx-auto mb-3 bg-white rounded-xl p-2" />
              )}
              {totpSecret && (
                <p className="text-dark-muted text-xs mb-4 break-all text-center">
                  Or enter this key: <span className="font-mono text-dark-text">{totpSecret}</span>
                </p>
              )}
            </>
          ) : (
            <p className="text-dark-muted text-sm mb-4">Enter the 6-digit code from your authenticator app.</p>
          )}

          <label className="block text-xs font-medium text-dark-muted mb-1.5">Code</label>
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-dark-text placeholder-dark-muted mb-4 tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="123456"
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && mfaCode.length === 6 && handleVerifyCode()}
          />

          {mfaError && <p className="text-brand-danger text-xs mb-3">{mfaError}</p>}

          <button
            onClick={handleVerifyCode}
            disabled={mfaLoading || mfaCode.length !== 6 || !factorId}
            className="w-full bg-primary hover:bg-primary-dark text-dark-bg font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {mfaLoading ? 'Checking…' : 'Verify'}
          </button>
          <button
            onClick={signOut}
            className="w-full mt-3 py-2.5 text-sm text-dark-muted hover:text-dark-text transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  if (authState === 'unauthenticated') {
    return (
      <div className="min-h-dvh bg-dark-bg flex items-center justify-center px-4">
        <div className="bg-dark-surface border border-dark-border rounded-3xl p-8 w-full max-w-sm shadow-2xl">
          <div className="mb-8">
            <p className="font-display text-2xl font-bold text-dark-text">Loxymity</p>
            <p className="text-primary text-sm font-semibold mt-0.5">Admin Console</p>
          </div>

          <label className="block text-xs font-medium text-dark-muted mb-1.5">Email</label>
          <input
            type="email"
            className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-dark-text placeholder-dark-muted mb-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="admin@loxymity.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />

          <label className="block text-xs font-medium text-dark-muted mb-1.5">Password</label>
          <input
            type="password"
            className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-dark-text placeholder-dark-muted mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />

          {loginError && <p className="text-brand-danger text-xs mb-3">{loginError}</p>}

          <button
            onClick={handleLogin}
            disabled={loginLoading}
            className="w-full bg-primary hover:bg-primary-dark text-dark-bg font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {loginLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ supabase, userId, signOut }}>
      <div className="flex min-h-dvh bg-dark-bg text-dark-text">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile top bar */}
          <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-dark-surface border-b border-dark-border shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-dark-muted hover:text-dark-text"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M3 5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm0 5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm1 4a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2H4z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="font-display text-lg font-bold text-dark-text">Loxymity Admin</span>
          </div>

          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminContext.Provider>
  );
}
