'use client';

import { useEffect, useRef, useState } from 'react';
import { useAdmin } from '../_lib/adminContext';
import type { SosAlert } from '../_lib/types';

export default function SosPage() {
  const { supabase } = useAdmin();
  const [activeSos, setActiveSos] = useState<SosAlert[]>([]);
  const [history, setHistory] = useState<SosAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const loadData = async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const [{ data: active }, { data: hist }] = await Promise.all([
      supabase
        .from('sos_alerts')
        .select(
          'id,sender_id,circle_id,message,resolved,created_at,profiles!sender_id(display_name),circles(name)',
        )
        .eq('resolved', false)
        .order('created_at', { ascending: false }),
      supabase
        .from('sos_alerts')
        .select(
          'id,sender_id,circle_id,message,resolved,created_at,profiles!sender_id(display_name),circles(name)',
        )
        .eq('resolved', true)
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: false })
        .limit(50),
    ]);
    setActiveSos((active ?? []) as unknown as SosAlert[]);
    setHistory((hist ?? []) as unknown as SosAlert[]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    channelRef.current = supabase
      .channel('admin-sos')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sos_alerts' }, loadData)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sos_alerts' }, loadData)
      .subscribe();
    return () => { channelRef.current?.unsubscribe(); };
  }, [supabase]);

  async function resolveAlert(id: string) {
    await supabase.from('sos_alerts').update({ resolved: true }).eq('id', id);
    await loadData();
  }

  function elapsed(created_at: string) {
    const s = Math.floor((Date.now() - new Date(created_at).getTime()) / 1000);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    return `${Math.floor(s / 3600)}h ago`;
  }

  type ProfileShape = { display_name: string | null };
  type CircleShape = { name: string };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-dark-text">SOS Monitor</h1>
        <p className="text-dark-muted text-sm">Real-time emergency alerts across all circles</p>
      </div>

      {/* Active alerts */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-dark-border flex items-center gap-3">
          {activeSos.length > 0 && (
            <span className="w-2.5 h-2.5 rounded-full bg-brand-danger animate-pulse shrink-0" />
          )}
          <p className="font-semibold text-dark-text">
            Active Alerts
            {activeSos.length > 0 && (
              <span className="ml-2 bg-brand-danger text-white text-xs px-2 py-0.5 rounded-full">
                {activeSos.length}
              </span>
            )}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : activeSos.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="text-brand-success font-semibold text-lg">All clear</p>
            <p className="text-dark-muted text-sm mt-1">No active SOS alerts.</p>
          </div>
        ) : (
          <div className="divide-y divide-dark-border">
            {activeSos.map((s) => (
              <div key={s.id} className="px-5 py-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-danger/10 flex items-center justify-center shrink-0 mt-0.5">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-brand-danger">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-7 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1-9a1 1 0 0 0-1 1v4a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-dark-text">
                      {(s.profiles as unknown as ProfileShape)?.display_name ?? 'Unknown user'}
                    </p>
                    <span className="text-dark-muted text-xs">in</span>
                    <p className="text-primary text-sm font-medium">
                      {(s.circles as unknown as CircleShape)?.name ?? 'unknown circle'}
                    </p>
                    <span className="text-dark-muted text-xs ml-auto shrink-0">{elapsed(s.created_at)}</span>
                  </div>
                  {s.message && <p className="text-dark-muted text-sm mt-1">{s.message}</p>}
                  <p className="text-dark-muted text-xs mt-1">{new Date(s.created_at).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => resolveAlert(s.id)}
                  className="shrink-0 px-3 py-1.5 bg-brand-success/10 border border-brand-success/20 text-brand-success text-xs font-semibold rounded-xl hover:bg-brand-success/20 transition-colors"
                >
                  Resolve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-dark-border">
          <p className="font-semibold text-dark-text">
            History{' '}
            <span className="text-dark-muted font-normal text-sm">(last 30 days)</span>
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border text-dark-muted text-left text-xs">
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Circle</th>
                <th className="px-5 py-3 font-medium">Message</th>
                <th className="px-5 py-3 font-medium">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {history.map((s) => (
                <tr key={s.id} className="hover:bg-dark-bg transition-colors">
                  <td className="px-5 py-3 text-dark-text font-medium">
                    {(s.profiles as unknown as ProfileShape)?.display_name ?? '—'}
                  </td>
                  <td className="px-5 py-3 text-dark-muted">
                    {(s.circles as unknown as CircleShape)?.name ?? '—'}
                  </td>
                  <td className="px-5 py-3 text-dark-muted max-w-xs truncate">
                    {s.message ?? '—'}
                  </td>
                  <td className="px-5 py-3 text-dark-muted text-xs whitespace-nowrap">
                    {new Date(s.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-dark-muted">
                    No resolved SOS in the last 30 days.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
