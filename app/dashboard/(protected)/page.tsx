'use client';

import { useState } from 'react';
import { useDashboard } from '../_lib/context';
import LiveMap from '../_components/LiveMap';
import MemberSidebar from '../_components/MemberSidebar';

export default function DashboardPage() {
  const { members } = useDashboard();
  const [focusMemberId, setFocusMemberId] = useState<string | null>(null);

  const onlineCnt = members.filter(m => m.status === 'online').length;

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Map */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Map toolbar */}
        <div className="flex items-center gap-3 px-4 py-2.5 bg-dark-surface border-b border-dark-border shrink-0">
          <span className="flex items-center gap-1.5 text-sm text-dark-muted">
            <span className="inline-block w-2 h-2 rounded-full bg-brand-success animate-pulse" />
            Live
          </span>
          <span className="text-dark-border">|</span>
          <span className="text-sm text-dark-muted">
            {onlineCnt} of {members.length} online
          </span>
        </div>
        <LiveMap members={members} focusMemberId={focusMemberId} />
      </div>

      {/* Member sidebar */}
      <MemberSidebar onMemberClick={setFocusMemberId} />
    </div>
  );
}
