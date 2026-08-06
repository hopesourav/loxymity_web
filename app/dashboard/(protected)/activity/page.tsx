'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDashboard } from '../../_lib/context';
import type { GeofenceEvent, SosAlert } from '../../_lib/types';
import { IconActivity, IconRefresh } from '../../_components/Icons';

type Filter = 'all' | 'geofence' | 'sos';

type FeedItem =
  | { kind: 'geofence'; data: GeofenceEvent; at: string }
  | { kind: 'sos';      data: SosAlert;      at: string };

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = diffMs / 3600000;
  if (diffH < 24) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function groupByDate(items: FeedItem[]): { label: string; items: FeedItem[] }[] {
  const map = new Map<string, FeedItem[]>();
  items.forEach(item => {
    const d = new Date(item.at);
    const key = d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  });
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
}

export default function ActivityPage() {
  const { supabase, activeCircleId, members } = useDashboard();
  const [feed, setFeed]         = useState<FeedItem[]>([]);
  const [filter, setFilter]     = useState<Filter>('all');
  const [memberFilter, setMemberFilter] = useState<string>('all');
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(0);
  const [hasMore, setHasMore]   = useState(true);
  const PAGE_SIZE = 20;

  const load = useCallback(async (pageNum: number, append = false) => {
    setLoading(true);

    // Get geofence IDs for this circle
    const { data: fences } = await supabase
      .from('geofences')
      .select('id')
      .eq('circle_id', activeCircleId);
    const fenceIds = (fences ?? []).map((f: any) => f.id);

    const geofencePromise = fenceIds.length
      ? supabase
        .from('geofence_events')
        .select('id,geofence_id,triggered_by,event_type,created_at,geofences(name),profiles!triggered_by(display_name,avatar_url)')
        .in('geofence_id', fenceIds)
        .order('created_at', { ascending: false })
        .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1)
      : Promise.resolve({ data: [] });

    const sosPromise = supabase
      .from('sos_alerts')
      .select('id,sender_id,circle_id,message,resolved,created_at,profiles!sender_id(display_name,avatar_url)')
      .eq('circle_id', activeCircleId)
      .order('created_at', { ascending: false })
      .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);

    const [{ data: geoData }, { data: sosData }] = await Promise.all([geofencePromise, sosPromise]);

    const geoItems: FeedItem[] = (geoData ?? []).map((e: any) => ({
      kind: 'geofence' as const,
      data: e as GeofenceEvent,
      at: e.created_at ?? '',
    }));
    const sosItems: FeedItem[] = (sosData ?? []).map((s: any) => ({
      kind: 'sos' as const,
      data: s as SosAlert,
      at: s.created_at,
    }));

    const merged = [...geoItems, ...sosItems].sort(
      (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
    );

    setFeed(prev => append ? [...prev, ...merged] : merged);
    setHasMore(merged.length >= PAGE_SIZE);
    setLoading(false);
  }, [supabase, activeCircleId]);

  useEffect(() => { setPage(0); load(0); }, [activeCircleId, load]);

  function loadMore() {
    const next = page + 1;
    setPage(next);
    load(next, true);
  }

  const filtered = feed.filter(item => {
    if (filter !== 'all' && item.kind !== filter) return false;
    if (memberFilter === 'all') return true;
    const uid = item.kind === 'geofence' ? item.data.triggered_by : item.data.sender_id;
    return uid === memberFilter;
  });

  const groups = groupByDate(filtered);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-dark-border bg-dark-surface shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IconActivity size={18} className="text-primary" />
            <h1 className="text-base font-semibold text-dark-text">Activity</h1>
          </div>
          <button
            onClick={() => load(0)}
            className="p-1.5 rounded-lg hover:bg-dark-bg text-dark-muted hover:text-dark-text transition-colors"
            aria-label="Refresh"
          >
            <IconRefresh size={15} />
          </button>
        </div>
        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'geofence', 'sos'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                filter === f
                  ? 'bg-primary/20 text-primary'
                  : 'bg-dark-bg text-dark-muted hover:text-dark-text'
              }`}
            >
              {f === 'all' ? 'All events' : f === 'geofence' ? 'Geofence' : 'SOS'}
            </button>
          ))}
          <select
            value={memberFilter}
            onChange={e => setMemberFilter(e.target.value)}
            className="ml-auto bg-dark-bg border border-dark-border rounded-lg px-2.5 py-1 text-xs text-dark-text focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All members</option>
            {members.map(m => (
              <option key={m.user_id} value={m.user_id}>
                {m.display_name ?? 'Unknown'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {loading && page === 0 ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-12">
            <IconActivity size={32} className="text-dark-muted mx-auto mb-3" />
            <p className="text-dark-muted text-sm">No activity yet.</p>
          </div>
        ) : (
          groups.map(group => (
            <div key={group.label}>
              <p className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-3">
                {group.label}
              </p>
              <div className="space-y-2">
                {group.items.map((item, i) => (
                  <FeedRow key={`${item.kind}-${i}`} item={item} />
                ))}
              </div>
            </div>
          ))
        )}

        {hasMore && !loading && (
          <div className="flex justify-center pt-2 pb-4">
            <button
              onClick={loadMore}
              className="px-5 py-2 bg-dark-surface border border-dark-border rounded-xl text-sm text-dark-muted hover:text-dark-text hover:border-primary transition-colors"
            >
              Load more
            </button>
          </div>
        )}
        {loading && page > 0 && (
          <div className="flex justify-center py-4">
            <div className="w-5 h-5 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}

function FeedRow({ item }: { item: FeedItem }) {
  if (item.kind === 'geofence') {
    const e = item.data;
    const name = (e.profiles as any)?.display_name ?? 'Someone';
    const fence = (e.geofences as any)?.name ?? 'a fence';
    const isEnter = e.event_type === 'enter';
    return (
      <div className="flex items-start gap-3 bg-dark-surface border border-dark-border rounded-xl px-4 py-3">
        <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${isEnter ? 'bg-brand-success' : 'bg-brand-warning'}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-dark-text">
            <span className="font-semibold">{name}</span>{' '}
            {isEnter ? 'arrived at' : 'left'}{' '}
            <span className="font-semibold">{fence}</span>
          </p>
          <p className="text-xs text-dark-muted mt-0.5">{formatTime(item.at)}</p>
        </div>
      </div>
    );
  }
  const s = item.data;
  const senderName = (s.profiles as any)?.display_name ?? 'Someone';
  return (
    <div className="flex items-start gap-3 bg-brand-danger/10 border border-brand-danger/30 rounded-xl px-4 py-3">
      <span className="mt-0.5 w-2 h-2 rounded-full bg-brand-danger shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-dark-text">
          <span className="font-semibold">SOS</span> from{' '}
          <span className="font-semibold">{senderName}</span>
          {s.message ? ` — "${s.message}"` : ''}
          {s.resolved && <span className="ml-2 text-xs text-dark-muted">(resolved)</span>}
        </p>
        <p className="text-xs text-dark-muted mt-0.5">{formatTime(item.at)}</p>
      </div>
    </div>
  );
}
