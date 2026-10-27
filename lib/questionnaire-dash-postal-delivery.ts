/**
 * SERVER-ONLY. Do not import this from a "use client" component -- it
 * reads secrets from `process.env` that must never reach the browser
 * bundle. It's only ever imported from
 * `app/api/project-questionnaire/dash-postal/route.ts`.
 *
 * Reuses the same Resend account/credentials as the main contact form and
 * the generic questionnaire (RESEND_API_KEY, CONTACT_FROM_EMAIL) for auth
 * and the "from" address, but the notification recipient is hardcoded to
 * ananse.technologies@gmail.com per the Dash Postal engagement brief --
 * deliberately independent of whatever CONTACT_TO_EMAIL happens to be set
 * to, since that env var is shared with other forms and could change for
 * unrelated reasons. lib/questionnaire-delivery.ts (used by the generic
 * and Xmine Consult questionnaires) is left completely untouched; this
 * file duplicates its small zero-dependency Resend fetch helper rather
 * than importing a private function from it, so neither delivery path can
 * affect the other.
 *
 * `deliverDashPostalQuestionnaire` is inert (returns `not_configured`)
 * unless a provider's env vars are set, exactly like the other delivery
 * functions in this codebase -- nothing here spends money or contacts a
 * third party by default.
 */

import type { DashPostalQuestionnaireDraft } from "./questionnaire-dash-postal";

export type DeliveryResult = { ok: true } | { ok: false; error: string };

const NOTIFICATION_RECIPIENT = "ananse.technologies@gmail.com";

export async function deliverDashPostalQuestionnaire(
  data: DashPostalQuestionnaireDraft
): Promise<DeliveryResult> {
  if (process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL) {
    return deliverViaResend(data);
  }

  if (process.env.CONTACT_WEBHOOK_URL) {
    return deliverViaWebhook(data);
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(
      "[dash-postal-questionnaire] no delivery provider configured; submission not sent:",
      data
    );
  }
  return { ok: false, error: "not_configured" };
}

async function deliverViaResend(data: DashPostalQuestionnaireDraft): Promise<DeliveryResult> {
  const primary = await sendResendEmail({
    to: NOTIFICATION_RECIPIENT,
    replyTo: data.contactEmail,
    subject: `New Project Questionnaire — Dash Postal and Tax Services (${data.contactName})`,
    text: formatQuestionnaireAsText(data),
  });

  if (!primary.ok) {
    console.error(
      "[dash-postal-questionnaire] Resend delivery failed:",
      primary.status,
      primary.body
    );
    return { ok: false, error: "delivery_failed" };
  }

  // The business notification is safely delivered as of here. The
  // acknowledgement below is a courtesy on top of it and must never undo
  // that result -- a failure here is logged, not surfaced as an overall
  // failure, mirroring lib/questionnaire-delivery.ts's same trade-off.
  const ack = await sendResendEmail({
    to: data.contactEmail,
    replyTo: process.env.CONTACT_FROM_EMAIL as string,
    subject: "We received your Ananse Automation project questionnaire",
    text: buildAcknowledgementText(data),
  });
  if (!ack.ok) {
    console.error(
      "[dash-postal-questionnaire] acknowledgement email to submitter failed (business notification was still delivered):",
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

/** Same generic-webhook fallback contract as lib/questionnaire-delivery.ts,
 * on a distinct `source` value so a downstream automation can tell the
 * payload shapes apart. */
async function deliverViaWebhook(data: DashPostalQuestionnaireDraft): Promise<DeliveryResult> {
  try {
    const res = await fetch(process.env.CONTACT_WEBHOOK_URL as string, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "ananse-automation-website-dash-postal-questionnaire",
        questionnaire: data,
      }),
    });
    if (!res.ok) {
      console.error(
        "[dash-postal-questionnaire] webhook delivery failed:",
        res.status,
        await safeText(res)
      );
      return { ok: false, error: "delivery_failed" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[dash-postal-questionnaire] webhook delivery threw:", err);
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

function formatQuestionnaireAsText(data: DashPostalQuestionnaireDraft): string {
  const sections = [
    section("Contact Information", [
      line("Name", data.contactName),
      line("Email", data.contactEmail),
      line("Phone", data.contactPhone),
      line("Preferred contact method", data.preferredContactMethod),
    ]),

    section("Section 1 — Business Overview", [
      listLine("Services currently provided", data.currentServices, data.currentServicesOtherText),
      line("Most important services to promote", data.servicesToPromote),
      listLine("Primary customers", data.customerTypes, data.customerTypesOtherText),
      line("What makes the business different", data.differentiators),
    ]),

    section("Section 2 — Website Goals", [
      listLine("Main goals for the website", data.websiteGoals, data.websiteGoalsOtherText),
      line("Currently owns a domain / has a website", data.hasWebsite),
      line("Current website URL", data.currentWebsiteUrl),
      listLine("Desired website features", data.desiredFeatures, data.desiredFeaturesOtherText),
      line("Design inspiration", data.designInspiration),
    ]),

    section("Section 3 — Branding and Content", [
      listLine("Brand assets available", data.brandAssets),
      line("Preferred design style", data.designStyle),
      line("Social media / Google Business Profile", data.socialMediaProfiles),
    ]),

    section("Section 4 — CRM and Business Automation", [
      listLine(
        "How customers currently make contact",
        data.customerContactMethods,
        data.customerContactMethodsOtherText
      ),
      line("How they currently manage customer info/appointments/follow-ups", data.currentManagementDescription),
      line("Interested in a CRM", data.crmInterest),
      listLine("Automations of interest", data.automationInterests, data.automationInterestsOtherText),
    ]),

    section("Section 5 — Project Priorities", [
      line("Desired launch timeframe", data.launchTimeframe),
      line("Top three priorities", data.topPriorities),
      line("Anything else before the consultation", data.anythingElse),
    ]),
  ].filter(Boolean);

  sections.push(`Submitted: ${new Date().toLocaleString("en-US", { timeZoneName: "short" })}`);

  return sections.join("\n\n");
}

function buildAcknowledgementText(data: DashPostalQuestionnaireDraft): string {
  const firstName = data.contactName.trim().split(/\s+/)[0] || data.contactName;
  return `Hi ${firstName},

Thank you for telling us about Dash Postal and Tax Services. We've received your information and will review it ahead of our consultation.

Someone from Ananse Automation will follow up with you.

You don't need to reply to this automated confirmation unless you would like to add something to what you shared.

— Ananse Automation`;
}
