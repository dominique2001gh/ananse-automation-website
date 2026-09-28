"use server";

/**
 * Sign-in Server Action for the admin login form. Rate-limited the same
 * way every other public-facing endpoint in this codebase is
 * (lib/rate-limit.ts) -- a login form is exactly the kind of endpoint a
 * script might hammer. Authorization (not just authentication) is
 * re-checked by proxy.ts immediately after a successful sign-in, so a
 * valid Supabase account with no admin_profiles row still can't reach
 * anything under /admin.
 */

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { createRateLimiter } from "@/lib/rate-limit";

// Generous enough for a real staff member fumbling a password a few
// times, tight enough to blunt a credential-stuffing script.
const isRateLimited = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 10 });

async function getRequestIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export async function signInAction(formData: FormData) {
  const ip = await getRequestIp();
  if (isRateLimited(ip)) {
    redirect("/admin/login?error=rate_limited");
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/admin/login?error=missing_fields");
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/admin/login?error=invalid_credentials");
  }

  redirect("/admin");
}
