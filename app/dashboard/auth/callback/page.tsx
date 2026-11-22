'use client';

import { useEffect, useRef, useState } from 'react';
import { readAuthLink, authLinkErrorMessage, NO_AUTH_LINK, type AuthLink } from '../../_lib/authLink';
import { supabase } from '../../_lib/client';
import { takeNext } from '../../_lib/nextPath';

/**
 * The URL this page was opened with, read at module load. A failed sign-in comes back as
 * `#error=…&error_description=…`: the Supabase client neither clears that nor fires an event, so
 * the page used to spin forever. Taken once per load.
 */
let linkAtLoad: AuthLink = readAuthLink();

/** No session this long after the client finished with the URL: say so instead of spinning. */
const NO_SESSION_GRACE_MS = 8000;

export default function AuthCallbackPage() {
  const link = useRef(linkAtLoad);
  const [failure, setFailure] = useState('');

  useEffect(() => {
    linkAtLoad = NO_AUTH_LINK;
    if (link.current.errorCode) {
      setFailure(authLinkErrorMessage(link.current, 'signin'));
      return;
    }

    // Let the Supabase client exchange the OAuth code for a session, then forward to where the
    // sign-in started (login stored a dashboard path in sessionStorage; the redirect URL itself
    // stays the exact allow-listed one). onAuthStateChange fires once the exchange is complete;
    // getSession() handles the already-signed-in case.
    let done = false;
    let graceTimer: ReturnType<typeof setTimeout> | null = null;
    const go = () => {
      if (!done) {
        done = true;
        if (graceTimer) clearTimeout(graceTimer);
        window.location.href = takeNext();
      }
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        subscription.unsubscribe();
        go();
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (done) return;
      if (session) {
        subscription.unsubscribe();
        go();
        return;
      }
      graceTimer = setTimeout(() => {
        if (!done) setFailure('Sign-in did not complete. Please try again.');
      }, NO_SESSION_GRACE_MS);
    });

    return () => {
      done = true;
      if (graceTimer) clearTimeout(graceTimer);
      subscription.unsubscribe();
    };
  }, []);

  if (failure) {
    return (
      <div className="min-h-dvh bg-dark-bg flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-dark-surface border border-dark-border rounded-2xl p-6 text-center space-y-4">
          <p className="text-sm text-dark-text">{failure}</p>
          <a
            href="/dashboard/login/"
            className="block w-full bg-primary hover:opacity-90 text-dark-bg font-semibold py-2.5 rounded-xl text-sm transition-opacity"
          >
            Back to sign in
          </a>
          <a href="/dashboard/reset-password/" className="block text-xs text-dark-muted hover:text-dark-text transition-colors">
            Reset your password
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-dark-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
    </div>
  );
}
