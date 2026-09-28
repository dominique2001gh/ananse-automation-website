"use server";

/**
 * Mutations run through the per-request RLS-bound client (requireAdmin()
 * -> lib/supabase/server.ts), not the secret-key admin client -- so the
 * real enforcement boundary for "can this person change lead status/add
 * notes" is the Postgres RLS policies from the Phase 1 migration, not
 * just this function existing. requireAdmin() re-checks authorization
 * itself (on top of proxy.ts), consistent with the Server Actions
 * security guidance to never rely on render-time gating alone.
 */

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { PIPELINE_STATUSES } from "@/lib/leads";

const VALID_STATUS_KEYS = new Set(PIPELINE_STATUSES.map((s) => s.key));

export async function updateLeadStatusAction(leadId: string, formData: FormData) {
  const { supabase, profile } = await requireAdmin();

  const nextStatus = String(formData.get("status") ?? "");
  if (!VALID_STATUS_KEYS.has(nextStatus)) return;

  const { data: current } = await supabase
    .from("leads")
    .select("status")
    .eq("id", leadId)
    .single();

  if (!current || current.status === nextStatus) return;

  const { error } = await supabase.from("leads").update({ status: nextStatus }).eq("id", leadId);
  if (error) {
    console.error("[admin] status update failed:", error.message);
    return;
  }

  await supabase.from("lead_activities").insert({
    lead_id: leadId,
    actor_id: profile.id,
    activity_type: "status_change",
    detail: { from: current.status, to: nextStatus },
  });

  revalidatePath(`/admin/leads/${leadId}`);
}

export async function addNoteAction(leadId: string, formData: FormData) {
  const { supabase, profile } = await requireAdmin();

  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;

  const { error } = await supabase
    .from("lead_notes")
    .insert({ lead_id: leadId, author_id: profile.id, body });
  if (error) {
    console.error("[admin] add note failed:", error.message);
    return;
  }

  await supabase.from("lead_activities").insert({
    lead_id: leadId,
    actor_id: profile.id,
    activity_type: "note_added",
    detail: {},
  });

  revalidatePath(`/admin/leads/${leadId}`);
}
