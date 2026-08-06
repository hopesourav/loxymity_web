export type MemberStatus = 'online' | 'stale' | 'offline' | 'sharing_off';

export type UserProfile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  google_avatar_url: string | null;
  subscription_tier: 'free' | 'pro';
  web_tier: 'free' | 'pro';
};

export type Circle = {
  id: string;
  name: string;
  created_by: string;
  role: 'owner' | 'admin' | 'member';
};

export type LatestLocation = {
  user_id: string;
  lat: number;
  lng: number;
  accuracy_m: number | null;
  speed_mps: number | null;
  activity_type: string | null;
  battery_level: number | null;
  is_charging: boolean | null;
  shares_location: boolean;
  reported_at: string;
};

export type DashboardMember = {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: 'owner' | 'admin' | 'member';
  shares_location: boolean;
  location: LatestLocation | null;
  status: MemberStatus;
};

export type SosAlert = {
  id: string;
  sender_id: string;
  circle_id: string;
  message: string | null;
  resolved: boolean;
  created_at: string;
  profiles: { display_name: string | null } | null;
};

export type GeofenceRow = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius_m: number;
  exit_buffer_m: number;
  active: boolean;
  notify_on_enter: boolean;
  notify_on_exit: boolean;
  owner_id: string;
  circle_id: string;
};

export type GeofenceEvent = {
  id: string;
  geofence_id: string;
  triggered_by: string;
  event_type: 'enter' | 'exit';
  created_at: string;
  geofences: { name: string } | null;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
};

export type LocationHistoryPoint = {
  id: string;
  lat: number;
  lng: number;
  recorded_at: string;
  speed_mps: number | null;
  activity_type: string | null;
};

export type CircleMemberRow = {
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  status: 'active' | 'pending';
  shares_location: boolean;
  joined_at: string;
  profiles: {
    display_name: string | null;
    avatar_url: string | null;
    google_avatar_url: string | null;
  } | null;
};

export type InviteRow = {
  id: string;
  circle_id: string;
  invited_by: string;
  code: string;
  expires_at: string;
  used_by: string | null;
};

export type LocationShare = {
  id: string;
  token: string;
  owner_id: string;
  expires_at: string | null;
  revoked: boolean;
  created_at: string;
};
