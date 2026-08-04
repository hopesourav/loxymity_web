'use client';

import { useEffect, useState } from 'react';
import { useAdmin } from '../_lib/adminContext';
import type { AdminProfile, AdminLocation } from '../_lib/types';

type UserRow = AdminProfile & {
  lastSeen: string | null;
  battery: number | null;
  circleCount: number;
};

export default function UsersPage() {
  const { supabase } = useAdmin();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'pro' | 'free'>('all');

  useEffect(() => {
    async function load() {
      const [{ data: profiles }, { data: locations }, { data: memberships }] = await Promise.all([
        supabase
          .from('profiles')
          .select('id,display_name,avatar_url,google_avatar_url,subscription_tier,web_tier,is_admin')
          .order('display_name'),
        supabase.from('latest_locations').select('user_id,reported_at,battery_level'),
        supabase.from('circle_members').select('user_id').eq('status', 'active'),
      ]);

      const locMap = new Map<string, Pick<AdminLocation, 'reported_at' | 'battery_level'>>(
        (locations ?? []).map((l: any) => [l.user_id, l]),
      );
      const circleCountMap = new Map<string, number>();
      for (const m of (memberships ?? []) as { user_id: string }[]) {
        circleCountMap.set(m.user_id, (circleCountMap.get(m.user_id) ?? 0) + 1);
      }

      const rows: UserRow[] = ((profiles ?? []) as any[]).map((p) => {
        const loc = locMap.get(p.id);
        return {
          ...p,
          lastSeen: loc?.reported_at ?? null,
          battery: loc?.battery_level ?? null,
          circleCount: circleCountMap.get(p.id) ?? 0,
        };
      });

      setUsers(rows);
      setLoading(false);
    }
    load();
  }, [supabase]);

  function getStatus(lastSeen: string | null) {
    if (!lastSeen) return 'never';
    const age = Date.now() - new Date(lastSeen).getTime();
    if (age < 15 * 60 * 1000) return 'online';
    if (age < 60 * 60 * 1000) return 'stale';
    return 'offline';
  }

  const filtered = users.filter((u) => {
    const matchSearch =
      !search || (u.display_name ?? '').toLowerCase().includes(search.toLowerCase());
    const matchTier =
      tierFilter === 'all' ||
      u.subscription_tier === tierFilter ||
      u.web_tier === tierFilter;
    return matchSearch && matchTier;
  });

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-dark-text">Users</h1>
          <p className="text-dark-muted text-sm">{users.length} total accounts</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            className="bg-dark-surface border border-dark-border rounded-xl px-4 py-2 text-sm text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary w-52"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-1">
            {(['all', 'pro', 'free'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  tierFilter === t
                    ? 'bg-primary text-dark-bg'
                    : 'bg-dark-surface border border-dark-border text-dark-muted hover:text-dark-text'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-border text-dark-muted text-left text-xs">
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Tier</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Last Seen</th>
                  <th className="px-5 py-3 font-medium">Battery</th>
                  <th className="px-5 py-3 font-medium">Circles</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {filtered.map((u) => {
                  const status = getStatus(u.lastSeen);
                  const isPro = u.subscription_tier === 'pro' || u.web_tier === 'pro';
                  const avatarUrl = u.avatar_url ?? u.google_avatar_url;
                  return (
                    <tr key={u.id} className="hover:bg-dark-bg transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-dark-border flex items-center justify-center text-xs text-dark-muted font-bold shrink-0">
                              {(u.display_name ?? '?')[0]?.toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-dark-text truncate">{u.display_name ?? '—'}</p>
                            <p className="text-dark-muted text-xs font-mono">{u.id.slice(0, 8)}…</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            isPro
                              ? 'bg-primary/10 text-primary'
                              : 'bg-dark-bg text-dark-muted'
                          }`}
                        >
                          {isPro ? 'Pro' : 'Free'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                            status === 'online'
                              ? 'text-brand-success'
                              : status === 'stale'
                              ? 'text-primary'
                              : status === 'offline'
                              ? 'text-brand-danger'
                              : 'text-dark-muted'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              status === 'online'
                                ? 'bg-brand-success'
                                : status === 'stale'
                                ? 'bg-primary'
                                : status === 'offline'
                                ? 'bg-brand-danger'
                                : 'bg-dark-muted'
                            }`}
                          />
                          {status === 'never' ? 'No data' : status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-dark-muted text-xs whitespace-nowrap">
                        {u.lastSeen ? new Date(u.lastSeen).toLocaleString() : '—'}
                      </td>
                      <td className="px-5 py-3 text-dark-muted text-xs">
                        {u.battery !== null ? `${Math.round(u.battery * 100)}%` : '—'}
                      </td>
                      <td className="px-5 py-3 text-dark-muted text-xs">{u.circleCount}</td>
                      <td className="px-5 py-3">
                        {u.is_admin && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-accent-cyan/10 text-accent-cyan">
                            Admin
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-dark-muted">
                      No users match your filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
