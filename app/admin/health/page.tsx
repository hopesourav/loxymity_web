'use client';

import { useEffect, useState } from 'react';
import { useAdmin } from '../_lib/adminContext';
import type { DeviceHealthEvent, RefreshAttempt } from '../_lib/types';

type OemRow = { manufacturer: string; total: number; hibernation: number; doze: number; ios: number };
type RetryGroup = { status: string; count: number };

export default function HealthPage() {
  const { supabase } = useAdmin();
  const [events, setEvents] = useState<DeviceHealthEvent[]>([]);
  const [retryAttempts, setRetryAttempts] = useState<RefreshAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const [{ data: evtData }, { data: retryData }] = await Promise.all([
        supabase
          .from('device_health_events')
          .select('id,user_id,event_type,manufacturer,device_model,platform,created_at')
          .gte('created_at', sevenDaysAgo)
          .order('created_at', { ascending: false })
          .limit(2000),
        supabase
          .from('location_refresh_attempts')
          .select('id,user_id,status,created_at,updated_at,profiles!user_id(display_name)')
          .not('status', 'eq', 'resolved')
          .order('updated_at', { ascending: false })
          .limit(200),
      ]);
      setEvents((evtData ?? []) as DeviceHealthEvent[]);
      setRetryAttempts((retryData ?? []) as unknown as RefreshAttempt[]);
      setLoading(false);
    }
    load();
  }, [supabase]);

  // Derive summary counts
  const hibernationCount = events.filter((e) => e.event_type === 'hibernation_suspected').length;
  const dozeCount = events.filter((e) => e.event_type === 'doze_deferred').length;
  const iosBgGapCount = events.filter((e) => e.event_type === 'ios_bg_gap').length;
  const iosSlcWakeCount = events.filter((e) => e.event_type === 'ios_slc_wake').length;

  // OEM breakdown
  const oemMap = new Map<string, OemRow>();
  for (const e of events) {
    const mfr = e.manufacturer ?? 'Unknown';
    if (!oemMap.has(mfr)) {
      oemMap.set(mfr, { manufacturer: mfr, total: 0, hibernation: 0, doze: 0, ios: 0 });
    }
    const row = oemMap.get(mfr)!;
    row.total++;
    if (e.event_type === 'hibernation_suspected') row.hibernation++;
    if (e.event_type === 'doze_deferred') row.doze++;
    if (e.event_type === 'ios_bg_gap' || e.event_type === 'ios_slc_wake') row.ios++;
  }
  const oemRows = Array.from(oemMap.values()).sort((a, b) => b.total - a.total);

  // Retry queue grouped by status
  const retryGroupMap = new Map<string, number>();
  for (const r of retryAttempts) {
    retryGroupMap.set(r.status, (retryGroupMap.get(r.status) ?? 0) + 1);
  }
  const retryGroups: RetryGroup[] = Array.from(retryGroupMap.entries())
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);

  const statusColor = (s: string) => {
    if (s === 'exhausted') return 'text-brand-danger';
    if (s.startsWith('retry')) return 'text-brand-warning';
    return 'text-primary';
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-dark-text">Device Health</h1>
        <p className="text-dark-muted text-sm">Telemetry from the last 7 days</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Hibernation Events', value: hibernationCount, color: 'text-brand-danger', sub: 'Android' },
              { label: 'Doze Deferred', value: dozeCount, color: 'text-brand-warning', sub: 'Android' },
              { label: 'iOS BG Gap', value: iosBgGapCount, color: 'text-accent-cyan', sub: 'iOS background' },
              { label: 'iOS SLC Wake', value: iosSlcWakeCount, color: 'text-accent-cyan', sub: 'iOS significant-location' },
            ].map((c) => (
              <div key={c.label} className="bg-dark-surface border border-dark-border rounded-2xl p-4">
                <p className={`text-3xl font-black ${c.color}`}>{c.value}</p>
                <p className="text-dark-text text-xs font-semibold mt-1">{c.label}</p>
                <p className="text-dark-muted text-xs">{c.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* OEM breakdown */}
            <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-dark-border">
                <p className="font-semibold text-dark-text">OEM Breakdown</p>
                <p className="text-dark-muted text-xs mt-0.5">Events per manufacturer (last 7 days)</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-border text-dark-muted text-left text-xs">
                      <th className="px-5 py-3 font-medium">Manufacturer</th>
                      <th className="px-5 py-3 font-medium text-right">Total</th>
                      <th className="px-5 py-3 font-medium text-right">Hibernate</th>
                      <th className="px-5 py-3 font-medium text-right">Doze</th>
                      <th className="px-5 py-3 font-medium text-right">iOS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {oemRows.map((row) => (
                      <tr key={row.manufacturer} className="hover:bg-dark-bg transition-colors">
                        <td className="px-5 py-3 font-medium text-dark-text">{row.manufacturer}</td>
                        <td className="px-5 py-3 text-dark-muted text-right">{row.total}</td>
                        <td className="px-5 py-3 text-right">
                          <span className={row.hibernation > 0 ? 'text-brand-danger font-semibold' : 'text-dark-muted'}>
                            {row.hibernation}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className={row.doze > 0 ? 'text-brand-warning font-semibold' : 'text-dark-muted'}>
                            {row.doze}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-dark-muted text-right">{row.ios}</td>
                      </tr>
                    ))}
                    {oemRows.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-5 py-10 text-center text-dark-muted">
                          No health events in the last 7 days.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Silent push retry queue */}
            <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-dark-border">
                <p className="font-semibold text-dark-text">Silent Push Retry Queue</p>
                <p className="text-dark-muted text-xs mt-0.5">
                  Devices not yet recovered ({retryAttempts.length} open)
                </p>
              </div>

              {/* Status summary */}
              <div className="px-5 py-4 flex gap-4 border-b border-dark-border flex-wrap">
                {retryGroups.map((g) => (
                  <div key={g.status} className="text-center">
                    <p className={`text-2xl font-black ${statusColor(g.status)}`}>{g.count}</p>
                    <p className="text-dark-muted text-xs capitalize">{g.status.replace('_', ' ')}</p>
                  </div>
                ))}
                {retryGroups.length === 0 && (
                  <p className="text-brand-success text-sm font-semibold">Queue empty</p>
                )}
              </div>

              {/* Device list */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-border text-dark-muted text-left text-xs">
                      <th className="px-5 py-3 font-medium">User</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Last Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {retryAttempts.slice(0, 20).map((r) => (
                      <tr key={r.id} className="hover:bg-dark-bg transition-colors">
                        <td className="px-5 py-3 text-dark-text font-medium">
                          {(r.profiles as unknown as { display_name: string | null })?.display_name ?? r.user_id.slice(0, 8) + '…'}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-semibold capitalize ${statusColor(r.status)}`}>
                            {r.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-dark-muted text-xs whitespace-nowrap">
                          {new Date(r.updated_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    {retryAttempts.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-5 py-10 text-center text-dark-muted">
                          No open retry attempts.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
