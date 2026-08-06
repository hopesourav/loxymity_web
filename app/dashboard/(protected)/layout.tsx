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
import Sidebar from '../_components/Sidebar';
import SOSBanner from '../_components/SOSBanner';
import { IconMenu } from '../_components/Icons';

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
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const loadDashboard = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.replace('/dashboard/login/'); return; }

    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('id,display_name,avatar_url,google_avatar_url,subscription_tier,web_tier')
      .eq('id', session.user.id)
      .single();

    if (profileErr || !profile) { router.replace('/dashboard/login/'); return; }

    const isPro =
      (profile as UserProfile).subscription_tier === 'pro' ||
      (profile as UserProfile).web_tier === 'pro';
    if (!isPro) { router.replace('/dashboard/upgrade/'); return; }

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

    if (circles.length === 0) { router.replace('/dashboard/upgrade/'); return; }

    const defaultCircleId = circles[0].id;

    async function loadMembers(circleId: string): Promise<DashboardMember[]> {
      const { data: memberRows } = await supabase
        .from('circle_members')
        .select('user_id,role,shares_location,profiles!inner(display_name,avatar_url,google_avatar_url)')
        .eq('circle_id', circleId)
        .eq('status', 'active');

      const rows: CircleMemberRow[] = (memberRows as any[]) ?? [];
      const memberIds = rows.map(r => r.user_id);

      const { data: locations } = memberIds.length
        ? await supabase
          .from('latest_locations')
          .select('*')
          .in('user_id', memberIds)
        : { data: [] };

      const locMap = new Map<string, LatestLocation>(
        (locations ?? []).map((l: LatestLocation) => [l.user_id, l]),
      );

      return rows.map(r => {
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
    }

    async function loadSos(circleId: string): Promise<SosAlert[]> {
      const { data } = await supabase
        .from('sos_alerts')
        .select('id,sender_id,circle_id,message,resolved,created_at,profiles!sender_id(display_name)')
        .eq('circle_id', circleId)
        .eq('resolved', false);
      return (data ?? []) as unknown as SosAlert[];
    }

    const [members, sosAlerts] = await Promise.all([
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
        const [newMembers, newSos] = await Promise.all([
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

    function subscribeRealtime(circleId: string, memberIds: string[]) {
      channelRef.current?.unsubscribe();
      if (memberIds.length === 0) return;

      channelRef.current = supabase
        .channel(`dashboard-${circleId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'latest_locations',
            filter: `user_id=in.(${memberIds.join(',')})`,
          },
          (payload: any) => {
            const updated: LatestLocation = payload.new as LatestLocation;
            setCtx(prev => {
              if (!prev) return prev;
              const members = prev.members.map(m =>
                m.user_id === updated.user_id
                  ? { ...m, location: updated, status: getMemberStatus(m.shares_location, updated) }
                  : m,
              );
              return { ...prev, members };
            });
          },
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'sos_alerts', filter: `circle_id=eq.${circleId}` },
          (payload: any) => {
            setCtx(prev => prev
              ? { ...prev, activeSosAlerts: [payload.new as SosAlert, ...prev.activeSosAlerts] }
              : prev);
          },
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'sos_alerts', filter: `circle_id=eq.${circleId}` },
          (payload: any) => {
            const updated = payload.new as SosAlert;
            setCtx(prev => prev
              ? { ...prev, activeSosAlerts: prev.activeSosAlerts.filter(a => a.id !== updated.id || !updated.resolved) }
              : prev);
          },
        )
        .subscribe();
    }
  }, [router]);

  useEffect(() => {
    loadDashboard();
    return () => { channelRef.current?.unsubscribe(); };
  }, [loadDashboard]);

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
