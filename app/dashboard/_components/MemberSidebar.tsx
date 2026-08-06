'use client';

import { useDashboard } from '../_lib/context';
import type { DashboardMember } from '../_lib/types';
import { IconBattery } from './Icons';

function formatAgo(iso: string): string {
  const secs = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}

function statusColor(status: DashboardMember['status']): string {
  switch (status) {
    case 'online':      return 'bg-brand-success';
    case 'stale':       return 'bg-brand-warning';
    case 'offline':     return 'bg-dark-muted';
    case 'sharing_off': return 'bg-dark-muted';
  }
}

function batteryColor(pct: number): string {
  if (pct > 50) return 'text-brand-success';
  if (pct > 20) return 'text-brand-warning';
  return 'text-brand-danger';
}

function activityLabel(type: string | null): string {
  if (!type) return '';
  return type.replace(/_/g, ' ').toLowerCase();
}

type Props = { onMemberClick?: (userId: string) => void };

export default function MemberSidebar({ onMemberClick }: Props) {
  const { members } = useDashboard();

  const sorted = [...members].sort((a, b) => {
    const order = { online: 0, stale: 1, offline: 2, sharing_off: 3 };
    return order[a.status] - order[b.status];
  });

  return (
    <div className="w-52 shrink-0 bg-dark-surface border-l border-dark-border flex flex-col">
      <div className="px-4 py-3 border-b border-dark-border">
        <p className="text-xs font-semibold text-dark-muted uppercase tracking-wider">
          Members ({members.length})
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {sorted.map(m => {
          const initial = (m.display_name ?? '?').charAt(0).toUpperCase();
          const loc = m.location;
          const battery = loc?.battery_level != null ? loc.battery_level : null;

          return (
            <button
              key={m.user_id}
              onClick={() => onMemberClick?.(m.user_id)}
              className="w-full flex items-start gap-3 px-4 py-3 hover:bg-dark-bg transition-colors border-b border-dark-border/50 text-left"
            >
              {/* Avatar */}
              <div className="relative shrink-0 mt-0.5">
                {m.avatar_url ? (
                  <img
                    src={m.avatar_url}
                    alt={m.display_name ?? ''}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                    {initial}
                  </div>
                )}
                {/* Status dot */}
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-dark-surface ${statusColor(m.status)}`}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-dark-text truncate">
                  {m.display_name ?? 'Unknown'}
                </p>

                {m.status === 'sharing_off' ? (
                  <p className="text-xs text-dark-muted">Sharing paused</p>
                ) : m.status === 'offline' ? (
                  <p className="text-xs text-dark-muted">
                    Offline{loc ? ` · ${formatAgo(loc.reported_at)}` : ''}
                  </p>
                ) : loc ? (
                  <>
                    <p className="text-xs text-dark-muted truncate">
                      {activityLabel(loc.activity_type) || 'Active'}
                      {' · '}{formatAgo(loc.reported_at)}
                    </p>
                    {battery != null && (
                      <p className={`text-xs flex items-center gap-1 mt-0.5 ${batteryColor(battery)}`}>
                        <IconBattery size={12} />
                        {battery}%
                        {battery < 20 && ' !'}
                      </p>
                    )}
                  </>
                ) : null}
              </div>
            </button>
          );
        })}

        {members.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-dark-muted">No members yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
