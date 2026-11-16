/**
 * SERVER-ONLY. Do not import this from a "use client" component -- it
 * reads secrets from `process.env` that must never reach the browser
 * bundle. It's only ever imported from
 * `app/api/project-questionnaire/zimela-wellness/route.ts`.
 *
 * Reuses the same Resend account/credentials as the main contact form and
 * the generic questionnaire (RESEND_API_KEY, CONTACT_FROM_EMAIL) for auth
 * and the "from" address, but the notification recipient is hardcoded to
 * ananse.technologies@gmail.com, same as the Dash Postal and Tax Office
 * Texas questionnaires -- deliberately independent of whatever
 * CONTACT_TO_EMAIL happens to be set to, since that env var is shared
 * with other forms and could change for unrelated reasons. lib/
 * questionnaire-delivery.ts, lib/questionnaire-dash-postal-delivery.ts,
 * and lib/questionnaire-tax-office-texas-delivery.ts are left completely
 * untouched; this file duplicates the same small zero-dependency Resend
 * fetch helper rather than importing a private function from any of
 * them, so none of the delivery paths can affect each other.
 *
 * `deliverZimelaWellnessQuestionnaire` is inert (returns `not_configured`)
 * unless a provider's env vars are set, exactly like the other delivery
 * functions in this codebase -- nothing here spends money or contacts a
 * third party by default.
 *
 * Healthcare scope boundary: the formatted email below only ever contains
 * the practice/business answers defined in lib/questionnaire-zimela-
 * wellness.ts -- there is no patient name, diagnosis, medical record, or
 * other protected health information anywhere in this module.
 */

import type { ZimelaWellnessQuestionnaireDraft } from "./questionnaire-zimela-wellness";

export type DeliveryResult = { ok: true } | { ok: false; error: string };

const NOTIFICATION_RECIPIENT = "ananse.technologies@gmail.com";

export async function deliverZimelaWellnessQuestionnaire(
  data: ZimelaWellnessQuestionnaireDraft
): Promise<DeliveryResult> {
  if (process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL) {
    return deliverViaResend(data);
  }

  if (process.env.CONTACT_WEBHOOK_URL) {
    return deliverViaWebhook(data);
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(
      "[zimela-wellness-questionnaire] no delivery provider configured; submission not sent:",
      data
    );
  }
  return { ok: false, error: "not_configured" };
}

async function deliverViaResend(data: ZimelaWellnessQuestionnaireDraft): Promise<DeliveryResult> {
  const primary = await sendResendEmail({
    to: NOTIFICATION_RECIPIENT,
    replyTo: data.contactEmail,
    subject: `New Project Questionnaire — Zimela Wellness Center (${data.contactName})`,
    text: formatQuestionnaireAsText(data),
  });

  if (!primary.ok) {
    console.error(
      "[zimela-wellness-questionnaire] Resend delivery failed:",
      primary.status,
      primary.body
    );
    return { ok: false, error: "delivery_failed" };
  }

  // The business notification is safely delivered as of here. The
  // acknowledgement below is a courtesy on top of it and must never undo
  // that result -- a failure here is logged, not surfaced as an overall
  // failure, mirroring lib/questionnaire-tax-office-texas-delivery.ts's
  // same trade-off.
  const ack = await sendResendEmail({
    to: data.contactEmail,
    replyTo: process.env.CONTACT_FROM_EMAIL as string,
    subject: "We received your Ananse Automation project questionnaire",
    text: buildAcknowledgementText(data),
  });
  if (!ack.ok) {
    console.error(
      "[zimela-wellness-questionnaire] acknowledgement email to submitter failed (business notification was still delivered):",
      ack.status,
      ack.body
    );
  }

  return { ok: true };
}

async function sendResendEmail({
  to,
  replyTo,
  subject,
  text,
}: {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
}): Promise<{ ok: boolean; status?: number; body?: string }> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL,
        to,
        reply_to: replyTo,
        subject,
        text,
      }),
    });
    if (!res.ok) return { ok: false, status: res.status, body: await safeText(res) };
    return { ok: true };
  } catch (err) {
    return { ok: false, body: err instanceof Error ? err.message : String(err) };
  }
}

/** Same generic-webhook fallback contract as the other delivery modules,
 * on a distinct `source` value so a downstream automation can tell the
 * payload shapes apart. */
async function deliverViaWebhook(data: ZimelaWellnessQuestionnaireDraft): Promise<DeliveryResult> {
  try {
    const res = await fetch(process.env.CONTACT_WEBHOOK_URL as string, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "ananse-automation-website-zimela-wellness-questionnaire",
        questionnaire: data,
      }),
    });
    if (!res.ok) {
      console.error(
        "[zimela-wellness-questionnaire] webhook delivery failed:",
        res.status,
        await safeText(res)
      );
      return { ok: false, error: "delivery_failed" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[zimela-wellness-questionnaire] webhook delivery threw:", err);
    return { ok: false, error: "delivery_failed" };
  }
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

// --- Formatting ------------------------------------------------------------

function line(label: string, value: string | null | undefined): string | null {
  return value ? `${label}: ${value}` : null;
}

function listLine(label: string, values: string[], otherText?: string): string | null {
  if (values.length === 0) return null;
  const hasOther = values.includes("Other") && otherText;
  const rendered = hasOther
    ? [...values.filter((v) => v !== "Other"), `Other (${otherText})`]
    : values;
  return `${label}: ${rendered.join(", ")}`;
}

/** Renders a section only when it has at least one real answer. */
function section(title: string, lines: (string | null)[]): string {
  const present = lines.filter((l): l is string => Boolean(l));
  if (present.length === 0) return "";
  return `${title}\n${"-".repeat(title.length)}\n${present.join("\n")}`;
}

function formatQuestionnaireAsText(data: ZimelaWellnessQuestionnaireDraft): string {
  const sections = [
    section("Contact Information", [
      line("Name", data.contactName),
      line("Email", data.contactEmail),
      line("Phone", data.contactPhone),
      line("Preferred contact method", data.preferredContactMethod),
    ]),

    section("Section 1 — Practice Overview", [
      line("Practice location(s)", data.practiceLocations),
      listLine("Services offered", data.servicesOffered, data.servicesOfferedOtherText),
      listLine("Who they typically serve", data.patientPopulation, data.patientPopulationOtherText),
    ]),

    section("Section 2 — Website & Online Presence", [
      line("Current website", data.currentWebsiteUrl),
      line("Likes about current site", data.currentWebsiteLikes),
      line("Wants improved", data.currentWebsiteDislikes),
      listLine("Main goals for the website", data.websiteGoals, data.websiteGoalsOtherText),
      line("Design preferences", data.designPreferences),
    ]),

    section("Section 3 — Booking & Patient Communication", [
      line("How patients currently book", data.currentBookingMethod),
      listLine(
        "Desired booking features",
        data.desiredBookingFeatures,
        data.desiredBookingFeaturesOtherText
      ),
      line("Offers telehealth", data.telehealthOffered),
      line("Telehealth platform", data.telehealthPlatform),
      line("Has a patient portal", data.hasPatientPortal),
      line("Patient portal notes", data.patientPortalNotes),
      line("General inquiry contact method", data.generalInquiryContactMethod),
    ]),

    section("Section 4 — Systems, CRM & Staff Access", [
      line("Current EHR / practice management system", data.currentEhrSystem),
      line("Current CRM or scheduling tool", data.currentCrmOrScheduling),
      line("Desired future integrations", data.desiredIntegrations),
      line("Interested in a CRM", data.crmInterest),
      listLine("Desired CRM features", data.desiredCrmFeatures, data.desiredCrmFeaturesOtherText),
      listLine("Staff roles needing access", data.staffAccessRoles, data.staffAccessRolesOtherText),
    ]),

    section("Section 5 — AI Assistant & Automation", [
      line("Interested in an AI chat agent", data.aiChatInterest),
      line("Interested in an AI voice agent", data.aiVoiceInterest),
      listLine(
        "Automations of interest",
        data.automationInterests,
        data.automationInterestsOtherText
      ),
      listLine("Reporting interests", data.reportingInterests, data.reportingInterestsOtherText),
    ]),

    section("Section 6 — Security & Compliance", [
      line("HIPAA policies/BAAs already in place", data.hipaaPoliciesInPlace),
      line("Approved/vetted vendors", data.approvedVendors),
      line("Required security standards", data.requiredSecurityStandards),
      line("Future patient-data handling expectations", data.dataHandlingExpectations),
    ]),

    section("Section 7 — Priorities & Timeline", [
      line("Desired launch timeframe", data.launchTimeframe),
      line("Top priorities", data.topPriorities),
      line("Budget range", data.budgetRange),
      line("Anything else before the consultation", data.anythingElse),
    ]),
  ].filter(Boolean);

  sections.push(`Submitted: ${new Date().toLocaleString("en-US", { timeZoneName: "short" })}`);

  return sections.join("\n\n");
}

function buildAcknowledgementText(data: ZimelaWellnessQuestionnaireDraft): string {
  const firstName = data.contactName.trim().split(/\s+/)[0] || data.contactName;
  return `Hi ${firstName},

Thank you for telling us about Zimela Wellness Center. We've received your information and will review it ahead of our consultation.

Someone from Ananse Automation will follow up with you.

You don't need to reply to this automated confirmation unless you would like to add something to what you shared.

— Ananse Automation`;
}
