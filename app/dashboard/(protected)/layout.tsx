'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../_lib/client';
import { DashboardContext, type DashboardContextValue } from '../_lib/context';
import {
  STALE_THRESHOLD_MS, OFFLINE_THRESHOLD_MS,
} from '../_lib/constants';
import type {
  UserProfile, Circle, DashboardMember, SosAlert,
  LatestLocation, CircleMemberRow,
} from '../_lib/types';
import { hasDashboardAccess } from '../../_lib/tiers';
import { mergeLatestWithApprox, makeLiveRowFilter } from '../_lib/approxLocations';
import { activeSos, isActiveSos, SOS_ACTIVE_WINDOW_MS } from '../_lib/sosActive';
import Sidebar from '../_components/Sidebar';
import SOSBanner from '../_components/SOSBanner';
import { IconMenu } from '../_components/Icons';

/** A roster change re-reads the members once, after the burst (joins, leaves, an epoch move). */
const ROSTER_RELOAD_MS = 1000;
/** How often the SOS banner drops alerts that passed their 24 h. */
const SOS_REFILTER_MS = 60_000;

function getMemberStatus(
  sharesLocation: boolean,
  location: LatestLocation | null,
): DashboardMember['status'] {
  if (!sharesLocation) return 'sharing_off';
  if (!location) return 'offline';
  const age = Date.now() - new Date(location.reported_at).getTime();
  if (age < STALE_THRESHOLD_MS) return 'online';
  if (age < OFFLINE_THRESHOLD_MS) return 'stale';
  return 'offline';
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ctx, setCtx] = useState<DashboardContextValue | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const channelsRef = useRef<ReturnType<typeof supabase.channel>[]>([]);
  /** Only the newest subscribe may join (a circle switch can overtake the topic read). */
  const subSeq = useRef(0);
  /** The pending roster re-read (debounced); cleared on a circle switch and on unmount. */
  const rosterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadDashboard = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.replace('/dashboard/login/'); return; }

    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('id,display_name,avatar_url,google_avatar_url,subscription_tier,web_tier')
      .eq('id', session.user.id)
      .single();

    if (profileErr || !profile) { router.replace('/dashboard/login/'); return; }

    // Plan & billing sits outside this gate, so neither redirect can bounce back here.
    if (!hasDashboardAccess(profile as UserProfile)) { router.replace('/dashboard/plan/'); return; }

    // Load circles where user is an active member
    const { data: memberships } = await supabase
      .from('circle_members')
      .select('circle_id, role, circles!inner(id,name,created_by)')
      .eq('user_id', session.user.id)
      .eq('status', 'active');

    const circles: Circle[] = (memberships ?? []).map((m: any) => ({
      id: m.circles.id,
      name: m.circles.name,
      created_by: m.circles.created_by,
      role: m.role,
    }));

    if (circles.length === 0) { router.replace('/dashboard/plan/'); return; }

    const defaultCircleId = circles[0].id;
    const myUid = session.user.id;

    /**
     * The circle's active members with their last position. `complete` is false when the member
     * list or the exact positions could not be read — a roster re-read then keeps what is shown.
     */
    async function loadMembers(circleId: string): Promise<{ members: DashboardMember[]; complete: boolean }> {
      const { data: memberRows, error: membersErr } = await supabase
        .from('circle_members')
        .select('user_id,role,shares_location,profiles!inner(display_name,avatar_url,google_avatar_url)')
        .eq('circle_id', circleId)
        .eq('status', 'active');

      const rows: CircleMemberRow[] = (memberRows as any[]) ?? [];
      const memberIds = rows.map(r => r.user_id);

      // Both location tables (0349): a member with approximate location is only in the copy. A
      // failed read of the copy keeps the exact rows (those members show no pin until they move).
      let locations: LatestLocation[] = [];
      let locationsErr = false;
      if (memberIds.length) {
        const [exact, approx] = await Promise.all([
          supabase.from('latest_locations').select('*').in('user_id', memberIds),
          supabase.from('latest_locations_approx').select('*').in('user_id', memberIds),
        ]);
        locationsErr = !!exact.error;
        locations = mergeLatestWithApprox(
          (exact.data ?? []) as LatestLocation[],
          approx.error ? [] : (approx.data ?? []) as LatestLocation[],
        );
      }

      const locMap = new Map<string, LatestLocation>(locations.map(l => [l.user_id, l]));

      const members = rows.map(r => {
        const loc = locMap.get(r.user_id) ?? null;
        const p = r.profiles as any;
        return {
          user_id: r.user_id,
          display_name: p?.display_name ?? null,
          avatar_url: p?.avatar_url ?? p?.google_avatar_url ?? null,
          role: r.role,
          shares_location: r.shares_location,
          location: loc,
          status: getMemberStatus(r.shares_location, loc),
        };
      });
      return { members, complete: !membersErr && !locationsErr };
    }

    /** Someone else's SOS that is still active (the app's rule, ../_lib/sosActive). */
    async function loadSos(circleId: string): Promise<SosAlert[]> {
      const since = new Date(Date.now() - SOS_ACTIVE_WINDOW_MS).toISOString();
      const { data } = await supabase
        .from('sos_alerts')
        .select('id,sender_id,circle_id,message,resolved,dismissed_at,created_at,profiles!sender_id(display_name)')
        .eq('circle_id', circleId)
        .eq('resolved', false)
        .is('dismissed_at', null)
        .gte('created_at', since)
        .neq('sender_id', myUid)
        .order('created_at', { ascending: false });
      return activeSos((data ?? []) as unknown as SosAlert[], myUid);
    }

    function scheduleRosterReload(circleId: string) {
      if (rosterTimerRef.current) clearTimeout(rosterTimerRef.current);
      rosterTimerRef.current = setTimeout(async () => {
        rosterTimerRef.current = null;
        const { members: fresh, complete } = await loadMembers(circleId);
        if (!complete) return;
        setCtx(prev => {
          if (!prev || prev.activeCircleId !== circleId) return prev; // another circle is open now
          // A live position that arrived while reading is newer than the one read: keep it.
          const shown = new Map(prev.members.map(m => [m.user_id, m.location]));
          const members = fresh.map(m => {
            const live = shown.get(m.user_id);
            if (live && m.location && Date.parse(live.reported_at) > Date.parse(m.location.reported_at)) {
              return { ...m, location: live, status: getMemberStatus(m.shares_location, live) };
            }
            return m;
          });
          return { ...prev, members };
        });
      }, ROSTER_RELOAD_MS);
    }

    const [{ members }, sosAlerts] = await Promise.all([
      loadMembers(defaultCircleId),
      loadSos(defaultCircleId),
    ]);

    const initialCtx: DashboardContextValue = {
      supabase,
      userId: session.user.id,
      userEmail: session.user.email,
      profile: profile as UserProfile,
      circles,
      activeCircleId: defaultCircleId,
      setActiveCircleId: async (id: string) => {
        cancelRosterReload();
        const [{ members: newMembers }, newSos] = await Promise.all([
          loadMembers(id), loadSos(id),
        ]);
        setCtx(prev => prev ? { ...prev, activeCircleId: id, members: newMembers, activeSosAlerts: newSos } : prev);
        subscribeRealtime(id, newMembers.map(m => m.user_id));
      },
      members,
      activeSosAlerts: sosAlerts,
    };

    setCtx(initialCtx);
    setLoading(false);
    subscribeRealtime(defaultCircleId, members.map(m => m.user_id));

    /**
     * Live updates through the app's Broadcast topics (Loxymity migrations 0390 / 0392) — the same
     * private topics the phones join. Postgres Changes stop once 0393 empties the supabase_realtime
     * publication, so the dashboard must not use them.
     *   c:<circle>:<epoch>  sos_alerts (INSERT / UPDATE, the whole row); circle_members (any roster
     *                       change: the members are read again)
     *   l:<circle>:<epoch>  latest_locations (exact rows) and latest_locations_approx (the rounded
     *                       copy of a member with approximate location — their exact row instead
     *                       while their SOS is open in this circle, 0350); only for a member who may
     *                       see others. Ghosted members and members not sharing are left out, as RLS does.
     *   rt_epoch            access changed in the circle: read the topics again, rejoin, and read
     *                       the members again
     * Who may join is decided by the server (_rt_can_join); get_realtime_topics() names mine.
     */
    async function subscribeRealtime(circleId: string, memberIds: string[]) {
      const seq = ++subSeq.current;
      leaveChannels();
      if (memberIds.length === 0) return;

      const { data } = await supabase.rpc('get_realtime_topics');
      if (seq !== subSeq.current) return; // another circle was opened meanwhile
      const circles = ((data as { circles?: unknown } | null)?.circles ?? []) as { circle_id: string; c: string; l: string | null }[];
      const topics = circles.find((c) => c.circle_id === circleId);
      if (!topics) return;

      // Exact beats the rounded copy of the same upload (during an SOS both arrive). Per subscription.
      const acceptRow = makeLiveRowFilter();

      const onMessage = (msg: { event?: string; payload?: unknown }) => {
        const change = msg.payload as { op?: string; new?: Record<string, unknown> } | undefined;
        if (msg.event === 'rt_epoch') {
          subscribeRealtime(circleId, memberIds);
          scheduleRosterReload(circleId);
          return;
        }
        if (msg.event === 'circle_members') { scheduleRosterReload(circleId); return; }
        if (!change?.new) return;
        if ((msg.event === 'latest_locations' || msg.event === 'latest_locations_approx') && change.op !== 'DELETE') {
          const updated = change.new as unknown as LatestLocation;
          if (!updated.user_id || !acceptRow(updated)) return;
          setCtx(prev => {
            if (!prev || prev.activeCircleId !== circleId) return prev;
            const members = prev.members.map(m =>
              m.user_id === updated.user_id
                ? { ...m, location: updated, status: getMemberStatus(m.shares_location, updated) }
                : m,
            );
            return { ...prev, members };
          });
        }
        if (msg.event === 'sos_alerts' && (change.op === 'INSERT' || change.op === 'UPDATE')) {
          const row = change.new as unknown as SosAlert;
          if (!row.id) return;
          setCtx(prev => {
            if (!prev || prev.activeCircleId !== circleId) return prev;
            const existing = prev.activeSosAlerts.find(a => a.id === row.id);
            // The broadcast row has no joined profile: keep the one already read, if any.
            const merged: SosAlert = { ...existing, ...row, profiles: existing?.profiles ?? null };
            const others = prev.activeSosAlerts.filter(a => a.id !== row.id);
            // Added only while active (not resolved, not dismissed, not mine, within 24 h): an
            // UPDATE that resolves or dismisses it drops it, one that un-dismisses it brings it back.
            const next = isActiveSos(merged, myUid) ? activeSos([merged, ...others], myUid) : others;
            return { ...prev, activeSosAlerts: next };
          });
        }
      };

      for (const topic of [topics.c, topics.l]) {
        if (!topic) continue;
        const ch = supabase
          .channel(topic, { config: { private: true } })
          .on('broadcast', { event: '*' }, onMessage)
          .subscribe();
        channelsRef.current.push(ch);
      }
    }
  }, [router]);

  function leaveChannels() {
    for (const ch of channelsRef.current) supabase.removeChannel(ch);
    channelsRef.current = [];
  }

  function cancelRosterReload() {
    if (rosterTimerRef.current) { clearTimeout(rosterTimerRef.current); rosterTimerRef.current = null; }
  }

  useEffect(() => {
    loadDashboard();
    return () => { subSeq.current += 1; leaveChannels(); cancelRosterReload(); };
  }, [loadDashboard]);

  // An SOS nobody resolved stops being active after 24 h: drop it from the banner on time.
  useEffect(() => {
    const timer = setInterval(() => {
      setCtx(prev => {
        if (!prev) return prev;
        const next = activeSos(prev.activeSosAlerts, prev.userId);
        return next.length === prev.activeSosAlerts.length ? prev : { ...prev, activeSosAlerts: next };
      });
    }, SOS_REFILTER_MS);
    return () => clearInterval(timer);
  }, []);

  if (loading || !ctx) {
    return (
      <div className="min-h-dvh bg-dark-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={ctx}>
      <div className="flex flex-col min-h-dvh bg-dark-bg text-dark-text">
        <SOSBanner />
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-dark-surface border-b border-dark-border shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-dark-muted hover:text-dark-text hover:bg-dark-bg transition-colors"
            aria-label="Open menu"
          >
            <IconMenu size={20} />
          </button>
          <span className="font-display text-lg font-bold text-dark-text tracking-tight">Loxymity</span>
        </div>
        <div className="flex flex-1 overflow-hidden">
          {/* Backdrop overlay — mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 z-20 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 overflow-auto flex flex-col min-w-0">
            {children}
          </main>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
