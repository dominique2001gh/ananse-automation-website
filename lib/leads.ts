/**
 * SERVER-ONLY. The single shared lead-writing layer for every intake
 * source (contact form, questionnaire today; Ask Ananse AI, consultation
 * requests, and the future Voice Agent later). Per the approved CRM
 * architecture, nothing writes to the `leads` table except through here --
 * this is what lets a future createLead()/updateLead() agent tool reuse
 * the exact same code path instead of a parallel one.
 *
 * Uses the secret-key admin client (lib/supabase/admin.ts), which bypasses
 * Row Level Security -- appropriate here because these writes originate
 * from public form submissions with no authenticated Supabase user of
 * their own, already validated server-side by the caller
 * (lib/contact-validation.ts / lib/questionnaire-validation.ts) before
 * reaching this file.
 *
 * Every export here catches its own errors and returns { ok: false }
 * rather than throwing -- callers (the API routes) run this independently
 * of email delivery, and a CRM write failure must never block or alter
 * the existing email-only behavior.
 */

import { getSupabaseAdminClient } from "./supabase/admin";
import type { ContactInquiry } from "./contact";
import type { QuestionnaireDraft } from "./questionnaire";

export const LEAD_SOURCE_LABELS: Record<string, string> = {
  contact_form: "Contact Form",
  questionnaire: "Project Questionnaire",
  ai_chat: "Ask Ananse AI",
  consultation_request: "Consultation Request",
  voice_agent: "Voice Agent",
  manual: "Manual",
  other: "Other",
};

// Mirrors the pipeline_statuses seed data (supabase/migrations/…) --
// kept here as the app's own typed copy for dropdowns/labels, the same
// way HelpTopic/ServiceInterest already work elsewhere in this codebase.
// The DB foreign key is still the real integrity boundary.
export const PIPELINE_STATUSES: { key: string; label: string }[] = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "qualified", label: "Qualified" },
  { key: "proposal_sent", label: "Proposal Sent" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
];

export type LeadWriteResult = { ok: true; leadId: string } | { ok: false; error: string };

// A second submission from the same source/email within this window is
// treated as the same intake event (accidental double-submit, retry, or a
// deliberate resend) and updates the existing lead instead of creating a
// duplicate -- but only while that lead is still untouched ("new"). Once
// staff have engaged with it, a new submission becomes its own lead
// instead of silently overwriting progress; see findPossiblyRelatedLeads
// for how genuinely separate submissions from the same person are
// surfaced for a human to review instead of being auto-merged.
const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;

async function findRecentDuplicate(source: string, email: string) {
  const supabase = getSupabaseAdminClient();
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();

  const { data, error } = await supabase
    .from("leads")
    .select("id")
    .eq("source", source)
    .eq("status", "new")
    .ilike("contact_email", email)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[leads] duplicate lookup failed:", error.message);
    return null;
  }
  return data as { id: string } | null;
}

async function logActivity(
  leadId: string,
  actorId: string | null,
  activityType: "created" | "status_change" | "note_added" | "email_sent" | "assigned" | "other",
  detail: Record<string, unknown>
) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("lead_activities")
    .insert({ lead_id: leadId, actor_id: actorId, activity_type: activityType, detail });
  if (error) console.error("[leads] activity log failed:", error.message);
}

export async function upsertLeadFromContact(data: ContactInquiry): Promise<LeadWriteResult> {
  try {
    const supabase = getSupabaseAdminClient();
    const duplicate = await findRecentDuplicate("contact_form", data.email);

    const payload = {
      source: "contact_form",
      contact_name: data.fullName,
      contact_email: data.email,
      contact_phone: data.phone || null,
      business_name: data.organization || null,
      preferred_contact_method: data.preferredContact,
      requested_services: [data.helpTopic],
      primary_message: data.message,
    };

    if (duplicate) {
      const { error } = await supabase.from("leads").update(payload).eq("id", duplicate.id);
      if (error) throw error;
      await logActivity(duplicate.id, null, "other", {
        note: "Duplicate contact-form submission within 24h -- existing lead updated instead of creating a new one.",
      });
      return { ok: true, leadId: duplicate.id };
    }

    const { data: inserted, error } = await supabase
      .from("leads")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw error;

    await logActivity(inserted.id, null, "created", { source: "contact_form" });
    return { ok: true, leadId: inserted.id };
  } catch (err) {
    console.error("[leads] upsertLeadFromContact failed:", err instanceof Error ? err.message : err);
    return { ok: false, error: "lead_write_failed" };
  }
}

export async function upsertLeadFromQuestionnaire(data: QuestionnaireDraft): Promise<LeadWriteResult> {
  try {
    const supabase = getSupabaseAdminClient();
    const duplicate = await findRecentDuplicate("questionnaire", data.contactEmail);

    const payload = {
      source: "questionnaire",
      contact_name: data.contactName,
      contact_email: data.contactEmail,
      contact_phone: data.contactPhone || null,
      business_name: data.businessName || null,
      preferred_contact_method: data.preferredContactMethod || null,
      requested_services: data.servicesNeeded,
      primary_message: data.primaryProblem || data.additionalDetails || data.businessDescription || null,
    };

    let leadId: string;
    if (duplicate) {
      const { error } = await supabase.from("leads").update(payload).eq("id", duplicate.id);
      if (error) throw error;
      leadId = duplicate.id;
      await logActivity(leadId, null, "other", {
        note: "Duplicate questionnaire submission within 24h -- existing lead updated instead of creating a new one.",
      });
    } else {
      const { data: inserted, error } = await supabase
        .from("leads")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw error;
      leadId = inserted.id;
      await logActivity(leadId, null, "created", { source: "questionnaire" });
    }

    // 1:1 with the lead -- upsert on lead_id so a duplicate/resubmitted
    // questionnaire replaces the prior answers rather than violating the
    // unique constraint from the Phase 1 schema.
    const { error: answersError } = await supabase
      .from("questionnaire_responses")
      .upsert(
        { lead_id: leadId, answers: data, submitted_at: new Date().toISOString() },
        { onConflict: "lead_id" }
      );
    if (answersError) throw answersError;

    return { ok: true, leadId };
  } catch (err) {
    console.error(
      "[leads] upsertLeadFromQuestionnaire failed:",
      err instanceof Error ? err.message : err
    );
    return { ok: false, error: "lead_write_failed" };
  }
}
