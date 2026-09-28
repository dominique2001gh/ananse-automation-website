/**
 * SERVER-ONLY. Do not import this from a "use client" component -- it
 * reads SUPABASE_SECRET_KEY from `process.env`, which must never reach the
 * browser bundle. Same convention already used for RESEND_API_KEY
 * (lib/contact-delivery.ts) and AI_API_KEY (lib/ai-openai.ts).
 *
 * The secret key bypasses Row Level Security entirely (Supabase's
 * `service_role`-equivalent under the current key format), so this client
 * is only ever appropriate for trusted server-side code acting on its own
 * authority -- e.g. inserting a lead from a public form submission that
 * has no authenticated user of its own. It must never be used to act on
 * behalf of an arbitrary visitor or browser request without that request
 * first being validated server-side (see lib/contact-validation.ts /
 * lib/questionnaire-validation.ts for the existing pattern this follows).
 *
 * Nothing in the application calls this yet -- Phase 1 only establishes
 * the schema and this client. Wiring it into app/api/contact/route.ts and
 * app/api/project-questionnaire/route.ts is a later, separate phase so
 * existing submission behavior is never at risk of regressing here.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      "Supabase admin client requested but NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY are not set."
    );
  }

  cached = createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
