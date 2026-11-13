'use client';

import { useEffect } from 'react';
import { supabase } from '../../_lib/client';
import { takeNext } from '../../_lib/nextPath';

export default function AuthCallbackPage() {
  useEffect(() => {
    // Let the Supabase client exchange the OAuth code for a session, then forward to where the
    // sign-in started (login stored a dashboard path in sessionStorage; the redirect URL itself
    // stays the exact allow-listed one). onAuthStateChange fires once the exchange is complete;
    // getSession() handles the already-signed-in case.
    let done = false;
    const go = () => { if (!done) { done = true; window.location.href = takeNext(); } };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        subscription.unsubscribe();
        go();
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        subscription.unsubscribe();
        go();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-dvh bg-dark-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
    </div>
  );
}
