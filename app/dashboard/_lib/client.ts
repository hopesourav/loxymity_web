import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://szsipgfrxvvkgqtpwhso.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6c2lwZ2ZyeHZ2a2dxdHB3aHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MzcxNDYsImV4cCI6MjA5MzMxMzE0Nn0.wVB1R1dsx5hbuXvuCYbgKdPDofiQApdVNeRpSIaFQrY';

// Module-level singleton — matches the pattern used in admin/page.tsx and share/page.tsx.
// All dashboard data fetching is client-side; no SSR, no cookies.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
