/**
 * Browser-safe Supabase client. Uses only the publishable key, which is
 * safe to ship to the client by design -- Row Level Security (see the
 * Phase 1 migration under supabase/migrations/) is the real access
 * boundary, not secrecy of this key. On its own, this client can read or
 * write nothing: every table it can reach has RLS enabled with no policy
 * granting the unauthenticated/`anon` role any access.
 *
 * Nothing in the application uses this yet -- it's foundational plumbing
 * for the future admin login screen (a later phase), created now so the
 * client/server Supabase integration is established as a pair from the
 * start, matching lib/supabase/admin.ts.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/** Lazy singleton -- mirrors lib/supabase/admin.ts's pattern so neither
 * client does any work (or can throw on missing env vars) until something
 * actually calls it. */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Supabase browser client requested but NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are not set."
    );
  }

  cached = createClient(url, publishableKey);
  return cached;
}
