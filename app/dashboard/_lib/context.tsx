'use client';

import { createContext, useContext } from 'react';
import type { UserProfile, Circle, DashboardMember, SosAlert } from './types';
import type { SupabaseClient } from '@supabase/supabase-js';

export type DashboardContextValue = {
  supabase: SupabaseClient;
  userId: string;
  userEmail: string | undefined;
  profile: UserProfile;
  circles: Circle[];
  activeCircleId: string;
  setActiveCircleId: (id: string) => void;
  members: DashboardMember[];
  activeSosAlerts: SosAlert[];
};

export const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used inside DashboardLayout');
  return ctx;
}
