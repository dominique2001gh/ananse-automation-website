/**
 * SERVER-ONLY. Do not import this from a "use client" component -- it
 * reads secrets from `process.env` that must never reach the browser
 * bundle. It's only ever imported from `app/api/contact/route.ts`.
 *
 * `deliverInquiry` is a pluggable dispatcher with zero active provider by
 * default. Nothing here spends money or contacts a third party unless the
 * matching environment variables are set -- see `.env.example`.
 *
 * When the Resend path is active, a successful business-inquiry send also
 * triggers a short acknowledgement email to the visitor. That second send
 * is a courtesy on top of the primary one: if it fails, the failure is
 * logged but never turns the overall result into a failure -- the business
 * already has the inquiry at that point, which is what matters most.
 */

import type { ContactInquiry } from "./contact";

export type DeliveryResult = { ok: true } | { ok: false; error: string };

const MIN_FILL_TIME_MS = 1500;

/** Honeypot field filled in, or the form was submitted implausibly fast --
 * both are strong signals of a bot rather than a person. */
export function looksLikeBot(honeypot: unknown, startedAt: unknown): boolean {
  if (typeof honeypot === "string" && honeypot.trim().length > 0) return true;
  if (typeof startedAt === "number" && Number.isFinite(startedAt)) {
    if (Date.now() - startedAt < MIN_FILL_TIME_MS) return true;
  }
  return false;
}

export async function deliverInquiry(
  inquiry: ContactInquiry
): Promise<DeliveryResult> {
  if (
    process.env.RESEND_API_KEY &&
    process.env.CONTACT_TO_EMAIL &&
    process.env.CONTACT_FROM_EMAIL
  ) {
    return deliverViaResend(inquiry);
  }

  if (process.env.CONTACT_WEBHOOK_URL) {
    return deliverViaWebhook(inquiry);
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(
      "[contact] no delivery provider configured; inquiry not sent:",
      inquiry
    );
  }
  return { ok: false, error: "not_configured" };
}

/**
 * Resend (https://resend.com) via its plain HTTP API -- no SDK dependency.
 * Inert unless RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL are
 * all set. This is offered as one ready-to-activate option, not a decision
 * made on your behalf -- see the chat summary for alternatives.
 */
async function deliverViaResend(inquiry: ContactInquiry): Promise<DeliveryResult> {
  const primary = await sendResendEmail({
    to: process.env.CONTACT_TO_EMAIL as string,
    replyTo: inquiry.email,
    subject: `New inquiry from ${inquiry.fullName} — ${inquiry.helpTopic}`,
    text: formatInquiryAsText(inquiry),
  });

  if (!primary.ok) {
    console.error("[contact] Resend delivery failed:", primary.status, primary.body);
    return { ok: false, error: "delivery_failed" };
  }

  // The business inquiry is safely delivered as of here. Everything below
  // is a courtesy to the visitor and must never undo the result above.
  const ack = await sendResendEmail({
    to: inquiry.email,
    replyTo: process.env.CONTACT_FROM_EMAIL as string,
    subject: "We received your Ananse Automation inquiry",
    text: buildAcknowledgementText(inquiry),
  });
  if (!ack.ok) {
    console.error(
      "[contact] acknowledgement email to visitor failed (business inquiry was still delivered):",
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

/**
 * Generic webhook fallback -- posts the inquiry as JSON to any URL you
 * control (Zapier, Make, n8n, a Slack/Discord incoming webhook, a CRM's
 * inbound webhook, or your own endpoint). Useful if you already have a
 * destination and don't want to introduce a new email provider at all.
 * (No visitor acknowledgement is sent on this path -- a generic webhook
 * has no email-sending capability of its own.)
 */
async function deliverViaWebhook(inquiry: ContactInquiry): Promise<DeliveryResult> {
  try {
    const res = await fetch(process.env.CONTACT_WEBHOOK_URL as string, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "ananse-automation-website", inquiry }),
    });
    if (!res.ok) {
      console.error("[contact] webhook delivery failed:", res.status, await safeText(res));
      return { ok: false, error: "delivery_failed" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[contact] webhook delivery threw:", err);
    return { ok: false, error: "delivery_failed" };
  }
}

function formatInquiryAsText(inquiry: ContactInquiry): string {
  return [
    `Name: ${inquiry.fullName}`,
    inquiry.organization ? `Organization: ${inquiry.organization}` : null,
    `Email: ${inquiry.email}`,
    inquiry.phone ? `Phone: ${inquiry.phone}` : null,
    `Help topic: ${inquiry.helpTopic}`,
    inquiry.preferredContact ? `Preferred contact: ${inquiry.preferredContact}` : null,
    "",
    "Message:",
    inquiry.message,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

function buildAcknowledgementText(inquiry: ContactInquiry): string {
  const firstName = inquiry.fullName.trim().split(/\s+/)[0] || inquiry.fullName;
  return `Hi ${firstName},

Thank you for contacting Ananse Automation. We've received your inquiry and the information you shared about your business or project.

We'll review it and follow up using the contact method you selected.

You don't need to reply to this automated confirmation unless you would like to add something to your request.

— Ananse Automation`;
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}
