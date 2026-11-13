'use client';

import { useEffect } from 'react';

/**
 * Old address of the plan page. Buying, upgrading and renewing now live on /dashboard/plan/
 * (Razorpay invoices, check first then charge); this keeps old links and bookmarks working.
 */
export default function UpgradeRedirect() {
  useEffect(() => { window.location.replace('/dashboard/plan/'); }, []);
  return (
    <div className="min-h-dvh bg-dark-bg flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
    </div>
  );
}
