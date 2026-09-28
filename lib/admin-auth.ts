/**
 * SERVER-ONLY. The authorization boundary for the admin area, used inside
 * every protected Server Component/Server Action under app/admin/.
 *
 * Being signed in via Supabase Auth only proves identity -- it does NOT
 * make someone an Ananse administrator. Authorization is a separate,
 * explicit check: does an `admin_profiles` row exist for this user, and
 * is it active? See supabase/migrations/…_phase1_crm_foundation.sql for
 * why (no self-service signup path, is_admin() SQL function, RLS
 * policies). proxy.ts performs the same check before a request even
 * reaches a page -- this is the defense-in-depth re-check for the render
 * itself, and the only place page/action code gets the current admin's
 * identity for attributing notes/activity.
 */

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "./supabase/server";

export type AdminProfile = {
  id: string;
  display_name: string;
  role: string;
  is_active: boolean;
};

export async function requireAdmin() {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("id, display_name, role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !profile.is_active) {
    redirect("/admin/login?error=not_authorized");
  }

  return { supabase, user, profile: profile as AdminProfile };
}
