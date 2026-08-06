'use client';

import { useEffect } from 'react';
import { supabase } from '../../_lib/client';

export default function AuthCallbackPage() {
  useEffect(() => {
    // Let the Supabase client exchange the OAuth code for a session,
    // then forward to the dashboard. onAuthStateChange fires once the
    // exchange is complete; getSession() handles the already-signed-in case.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        subscription.unsubscribe();
        window.location.href = '/dashboard/';
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        subscription.unsubscribe();
        window.location.href = '/dashboard/';
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
