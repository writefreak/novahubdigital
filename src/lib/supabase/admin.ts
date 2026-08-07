import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// SERVER-ONLY. Uses the service role key, which bypasses RLS entirely.
// Only ever import this inside a "use server" file. Never import it from
// a Client Component, and never send SUPABASE_SERVICE_ROLE_KEY to the
// browser — it must NOT have a NEXT_PUBLIC_ prefix in your env file.
//
// The one thing this is used for here: auth.admin.inviteUserByEmail(),
// which requires the service role and isn't available on the anon client.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
