'use client';

import Link from 'next/link';
import { useDashboard } from '../_lib/context';
import { IconAlert } from './Icons';

export default function SOSBanner() {
  const { activeSosAlerts } = useDashboard();
  if (activeSosAlerts.length === 0) return null;

  const first = activeSosAlerts[0];
  const sender = first.profiles?.display_name ?? 'A member';

  return (
    <div className="flex items-center gap-3 bg-brand-danger px-4 py-2.5 z-50">
      <IconAlert size={16} className="text-white shrink-0" />
      <p className="text-sm font-semibold text-white flex-1">
        SOS alert from {sender}
        {first.message ? ` — "${first.message}"` : ''}
      </p>
      <Link
        href="/dashboard/"
        className="text-xs font-bold text-white underline underline-offset-2 shrink-0"
      >
        View on map
      </Link>
      {activeSosAlerts.length > 1 && (
        <span className="text-xs text-white/80 shrink-0">
          +{activeSosAlerts.length - 1} more
        </span>
      )}
    </div>
  );
}
