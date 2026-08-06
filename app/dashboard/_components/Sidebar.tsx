'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoMark } from '../../_components/Logo';
import { useDashboard } from '../_lib/context';
import {
  IconMap, IconActivity, IconHistory, IconFence,
  IconCircle, IconShare, IconChevronDown, IconLogout, IconX,
} from './Icons';

const NAV = [
  { href: '/dashboard/', label: 'Live Map',    Icon: IconMap },
  { href: '/dashboard/activity/', label: 'Activity',  Icon: IconActivity },
  { href: '/dashboard/history/',  label: 'History',   Icon: IconHistory },
  { href: '/dashboard/fences/',   label: 'Fences',    Icon: IconFence },
  { href: '/dashboard/circle/',   label: 'Circle',    Icon: IconCircle },
  { href: '/dashboard/share/',    label: 'Share',     Icon: IconShare },
];

type Props = { open: boolean; onClose: () => void };

export default function Sidebar({ open, onClose }: Props) {
  const path = usePathname();
  const { circles, activeCircleId, setActiveCircleId, userEmail, supabase } = useDashboard();
  const activeCircle = circles.find(c => c.id === activeCircleId);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = '/dashboard/login/';
  }

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-30 flex flex-col w-64 shrink-0
      bg-dark-surface border-r border-dark-border
      transition-transform duration-200 ease-in-out
      md:relative md:inset-auto md:z-auto md:w-56 md:translate-x-0
      ${open ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Logo */}
      <div className="px-4 py-4 border-b border-dark-border flex items-center gap-3">
        <LogoMark />
        <div className="flex-1 min-w-0">
          <span className="font-display text-2xl font-bold text-dark-text tracking-tight block leading-tight">
            Loxymity
          </span>
          <span className="text-xs font-semibold bg-primary/20 text-primary rounded-full px-2 py-0.5">
            Pro
          </span>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg text-dark-muted hover:text-dark-text hover:bg-dark-bg transition-colors shrink-0"
          aria-label="Close menu"
        >
          <IconX size={18} />
        </button>
      </div>

      {/* Circle selector */}
      {circles.length > 1 && (
        <div className="px-3 py-3 border-b border-dark-border">
          <label className="block text-xs font-medium text-dark-muted mb-1">Circle</label>
          <div className="relative">
            <select
              value={activeCircleId}
              onChange={e => { setActiveCircleId(e.target.value); onClose(); }}
              className="w-full appearance-none bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text pr-7 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {circles.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <IconChevronDown className="absolute right-2 top-2.5 text-dark-muted pointer-events-none" size={14} />
          </div>
        </div>
      )}
      {circles.length === 1 && activeCircle && (
        <div className="px-4 py-2.5 border-b border-dark-border">
          <p className="text-xs text-dark-muted">Circle</p>
          <p className="text-sm font-semibold text-dark-text truncate">{activeCircle.name}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
        {NAV.map(({ href, label, Icon }) => {
          const active = path === href || (href !== '/dashboard/' && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary/15 text-primary'
                  : 'text-dark-muted hover:text-dark-text hover:bg-dark-bg'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-dark-border px-3 py-3 space-y-1">
        <p className="text-xs text-dark-muted truncate px-1">{userEmail}</p>
        <button
          onClick={signOut}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-dark-muted hover:text-brand-danger hover:bg-dark-bg rounded-lg transition-colors"
        >
          <IconLogout size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
