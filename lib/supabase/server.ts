/**
 * SERVER-ONLY. Per-request Supabase client bound to the current visitor's
 * session cookies via the publishable key -- Row Level Security applies
 * exactly as it would for that specific authenticated user, unlike
 * lib/supabase/admin.ts (secret key, bypasses RLS entirely). This is the
 * client every admin page/Server Action under app/admin/ should use, so
 * the real enforcement boundary is Postgres RLS, not just application
 * code -- matching the approved security architecture.
 *
 * Only usable from a Server Component, Server Action, or Route Handler
 * (it reads/writes cookies via next/headers). `setAll` is wrapped in a
 * try/catch because Server Components can read cookies but not set them
 * -- proxy.ts is responsible for refreshing the session cookie on GET
 * navigations; this catch just prevents that expected case from throwing.
 */

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    throw new Error(
      "Supabase server client requested but NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are not set."
    );
  }

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component -- expected, see file header.
        }
      },
    },
  });
}
