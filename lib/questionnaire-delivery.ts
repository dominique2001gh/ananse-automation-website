/**
 * SERVER-ONLY. Do not import this from a "use client" component -- it
 * reads secrets from `process.env` that must never reach the browser
 * bundle. It's only ever imported from
 * `app/api/project-questionnaire/route.ts`.
 *
 * Reuses the exact same Resend account/credentials as the main contact
 * form (lib/contact-delivery.ts) -- RESEND_API_KEY, CONTACT_TO_EMAIL,
 * CONTACT_FROM_EMAIL -- since this is the same business inbox receiving
 * the same kind of inbound inquiry, just with a much richer, structured
 * shape. lib/contact-delivery.ts itself is left completely untouched;
 * this file duplicates its small zero-dependency Resend fetch helper
 * rather than importing a private function from it, so the existing
 * contact form's delivery code path can't be affected by anything here.
 *
 * `deliverQuestionnaire` is inert (returns `not_configured`) unless a
 * provider's env vars are set, exactly like the contact form's delivery
 * function -- nothing here spends money or contacts a third party by
 * default.
 */

import type { QuestionnaireDraft } from "./questionnaire";

export type DeliveryResult = { ok: true } | { ok: false; error: string };

export async function deliverQuestionnaire(
  data: QuestionnaireDraft
): Promise<DeliveryResult> {
  if (
    process.env.RESEND_API_KEY &&
    process.env.CONTACT_TO_EMAIL &&
    process.env.CONTACT_FROM_EMAIL
  ) {
    return deliverViaResend(data);
  }

  if (process.env.CONTACT_WEBHOOK_URL) {
    return deliverViaWebhook(data);
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(
      "[project-questionnaire] no delivery provider configured; submission not sent:",
      data
    );
  }
  return { ok: false, error: "not_configured" };
}

async function deliverViaResend(data: QuestionnaireDraft): Promise<DeliveryResult> {
  const primary = await sendResendEmail({
    to: process.env.CONTACT_TO_EMAIL as string,
    replyTo: data.contactEmail,
    subject: `New Project Questionnaire — ${data.businessName}`,
    text: formatQuestionnaireAsText(data),
  });

  if (!primary.ok) {
    console.error(
      "[project-questionnaire] Resend delivery failed:",
      primary.status,
      primary.body
    );
    return { ok: false, error: "delivery_failed" };
  }

  // The business notification is safely delivered as of here. The
  // acknowledgement below is a courtesy on top of it and must never undo
  // that result -- a failure here is logged, not surfaced as an overall
  // failure, mirroring lib/contact-delivery.ts's same trade-off.
  const ack = await sendResendEmail({
    to: data.contactEmail,
    replyTo: process.env.CONTACT_FROM_EMAIL as string,
    subject: "We received your Ananse Automation project questionnaire",
    text: buildAcknowledgementText(data),
  });
  if (!ack.ok) {
    console.error(
      "[project-questionnaire] acknowledgement email to visitor failed (business notification was still delivered):",
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

/** Same generic-webhook fallback contract as lib/contact-delivery.ts, on a
 * distinct `source` value so a downstream automation (Zapier/Make/n8n/etc.)
 * can tell the two payload shapes apart. */
async function deliverViaWebhook(data: QuestionnaireDraft): Promise<DeliveryResult> {
  try {
    const res = await fetch(process.env.CONTACT_WEBHOOK_URL as string, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "ananse-automation-website-project-questionnaire",
        questionnaire: data,
      }),
    });
    if (!res.ok) {
      console.error(
        "[project-questionnaire] webhook delivery failed:",
        res.status,
        await safeText(res)
      );
      return { ok: false, error: "delivery_failed" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[project-questionnaire] webhook delivery threw:", err);
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

function listLine(
  label: string,
  values: string[],
  otherText?: string
): string | null {
  if (values.length === 0) return null;
  const hasOther = values.includes("Other") && otherText;
  const rendered = hasOther
    ? [...values.filter((v) => v !== "Other"), `Other (${otherText})`]
    : values;
  return `${label}: ${rendered.join(", ")}`;
}

/** Renders a section only when it has at least one real answer -- an
 * entirely-skipped section (e.g. a prospect with no website questions)
 * never appears as a wall of empty labels. */
function section(title: string, lines: (string | null)[]): string {
  const present = lines.filter((l): l is string => Boolean(l));
  if (present.length === 0) return "";
  return `${title}\n${"-".repeat(title.length)}\n${present.join("\n")}`;
}

function formatQuestionnaireAsText(data: QuestionnaireDraft): string {
  const sections = [
    section("Contact Information", [
      line("Name", data.contactName),
      line("Role/title", data.contactRole),
      line("Email", data.contactEmail),
      line("Phone", data.contactPhone),
      line("Preferred contact method", data.preferredContactMethod),
      line("Best time to contact", data.bestTimeToContact),
    ]),

    section("Requested Services", [
      listLine("Services", data.servicesNeeded, data.servicesNeededOtherText),
      line("Primary problem to solve", data.primaryProblem),
      line("What success looks like", data.successDefinition),
      line("Desired timeframe", data.timeframe),
    ]),

    section("Business Information", [
      line("Business name", data.businessName),
      line("Industry / business type", data.industry),
      line("What the business does", data.businessDescription),
      line("Location(s)", data.businessLocation),
      line("Business size", data.businessSize),
      line("Typical customers/clients", data.typicalCustomers),
      line("Main business goals", data.businessGoals),
      line("Current major challenges", data.currentChallenges),
    ]),

    section("Website Requirements", [
      line("Currently has a website", data.hasWebsite),
      line("Current website URL", data.currentWebsiteUrl),
      line("Likes about current site", data.currentWebsiteLikes),
      line("Dislikes / wants improved", data.currentWebsiteDislikes),
      listLine("What visitors should be able to do", data.websiteGoals, data.websiteGoalsOtherText),
      listLine("Assets already available", data.websiteAssets),
      line("Design/style preferences", data.designPreferences),
    ]),

    section("CRM / Operations Requirements", [
      line("How they currently manage leads/customers/jobs/etc.", data.currentManagementDescription),
      line("Customer information they need to keep", data.customerInfoNeeded),
      line("Stages/statuses things move through", data.stagesStatuses),
      line("Different staff access levels needed", data.staffAccessLevels),
      listLine("Useful features", data.crmFeatures, data.crmFeaturesOtherText),
    ]),

    section("Analytics Requirements", [
      listLine("Wants to understand", data.analyticsInterests, data.analyticsInterestsOtherText),
      listLine("Where data currently lives", data.dataSources),
      line("Who needs report/dashboard access", data.reportAccess),
      line("Reporting frequency needed", data.reportFrequency),
      line("Decisions analytics should help make", data.analyticsDecisions),
    ]),

    section("Automation / AI Requirements", [
      listLine("Repetitive work to hand off", data.repetitiveTasks, data.repetitiveTasksOtherText),
      listLine("Interested in", data.automationInterests),
      line("Manual process they'd like automated", data.manualProcessDescription),
    ]),

    section("Additional Notes", [
      line("Anything else they want built", data.additionalDetails),
      line("Liked examples (sites/apps/systems)", data.likedExamples),
      line("Must integrate with", data.integrationRequirements),
      line("Definitely does NOT want", data.dislikedThings),
    ]),
  ].filter(Boolean);

  sections.push(`Submitted: ${new Date().toLocaleString("en-US", { timeZoneName: "short" })}`);

  return sections.join("\n\n");
}

function buildAcknowledgementText(data: QuestionnaireDraft): string {
  const firstName = data.contactName.trim().split(/\s+/)[0] || data.contactName;
  return `Hi ${firstName},

Thank you for telling us about your project. We've received your information and will review your requirements.

Someone from Ananse Automation will follow up with you.

You don't need to reply to this automated confirmation unless you would like to add something to what you shared.

— Ananse Automation`;
}
