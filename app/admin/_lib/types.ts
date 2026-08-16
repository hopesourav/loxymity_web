import type { Tier } from '../../_lib/tiers';

export type AdminProfile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  google_avatar_url: string | null;
  subscription_tier: Tier;
  web_tier: Tier;
  is_admin: boolean;
};

export type AdminLocation = {
  user_id: string;
  lat: number;
  lng: number;
  reported_at: string;
  battery_level: number | null;
  activity_type: string | null;
  accuracy_m: number | null;
};

export type SosAlert = {
  id: string;
  sender_id: string;
  circle_id: string;
  message: string | null;
  resolved: boolean;
  created_at: string;
  profiles: { display_name: string | null } | null;
  circles: { name: string } | null;
};

export type DeviceHealthEvent = {
  id: string;
  user_id: string;
  event_type: string;
  manufacturer: string | null;
  device_model: string | null;
  platform: string | null;
  created_at: string;
};

export type RefreshAttempt = {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  profiles: { display_name: string | null } | null;
};

export type BeaconToken = {
  id: string;
  name: string;
  owner_id: string;
  beacon_uuid: string;
  major: number;
  minor: number;
  lat: number | null;
  lng: number | null;
  last_seen_at: string | null;
  created_at: string;
  profiles?: { display_name: string | null };
};

export type GeofenceRow = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius_m: number;
  active: boolean;
  owner_id: string;
};

export type AppPrompt = {
  id: string;
  key: string;
  title: string;
  body: string;
  icon: string | null;
  cta_label: string;
  dismiss_label: string | null;
  input_type: 'none' | 'text' | 'phone' | 'choice';
  choices: { label: string; value: string }[] | null;
  style: 'sheet' | 'banner' | 'fullscreen';
  required: boolean;
  priority: number;
  expires_at: string | null;
  target_platform: string | null;
  target_min_version: string | null;
  target_user_ids: string[] | null;
  target_circle_ids: string[] | null;
  created_at: string;
};

export type OverviewStats = {
  totalUsers: number;
  proUsers: number;
  activeDevices: number;
  staleDevices: number;
  offlineDevices: number;
  activeSos: number;
  retryQueue: number;
};
