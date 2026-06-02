import { createClient } from "@supabase/supabase-js";

// Service-role Supabase client. This key BYPASSES Row-Level Security, so it must
// only ever be used in server code that has already authorized the caller
// (e.g. after requireAdmin()). Never import this into a client component.
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}