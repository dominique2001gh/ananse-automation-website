/**
 * Client Discovery Questionnaire -- API route.
 *
 * Rate-limited, honeypot/timing spam check (reusing `looksLikeBot` from
 * lib/contact-delivery.ts -- that heuristic isn't form-specific), server-
 * authoritative validation, then the CRM write (lib/leads.ts) and email
 * delivery (lib/questionnaire-delivery.ts, reusing the same Resend account
 * as the contact form; falls back to a generic webhook; otherwise inert)
 * run in parallel.
 *
 * Same stricter contract already proven for the Dash Postal and Tax Office
 * Texas questionnaires (app/api/project-questionnaire/dash-postal/
 * route.ts, .../the-tax-office-texas/route.ts, both untouched by this
 * file): Supabase persistence is the primary success signal, so a visitor
 * is never told "success" unless the submission was actually saved -- see
 * lib/questionnaire-outcome.ts for the exact decision table. Xmine
 * Consult's questionnaire posts through this exact route (it has no
 * dedicated route of its own), so it is covered by this same contract,
 * not exempt from it -- only the contact form (app/api/contact/route.ts,
 * its own separate route) keeps its prior CRM-write-failure-never-
 * blocks-the-response behavior untouched.
 *
 * Also guards against duplicate submissions (a double-click, or a browser/
 * network layer retrying the same POST) via a client-generated
 * `submissionId`, idempotent per lib/questionnaire-outcome.ts's in-memory
 * store -- a repeat of the same id after a successful outcome returns the
 * cached result instead of writing a second lead or sending a second
 * email; concurrent requests for the same id share one in-flight attempt;
 * a hard failure is never cached, so retrying after "both failed"
 * genuinely re-attempts.
 */

import { NextRequest, NextResponse } from "next/server";
import { validateQuestionnaire } from "@/lib/questionnaire-validation";
import { deliverQuestionnaire } from "@/lib/questionnaire-delivery";
import { looksLikeBot, logBotCheckRejection } from "@/lib/contact-delivery";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";
import { upsertLeadFromQuestionnaire, logEmailDeliveryActivity } from "@/lib/leads";
import {
  resolveSubmissionOutcome,
  createIdempotencyStore,
  type QuestionnaireApiResult,
} from "@/lib/questionnaire-outcome";

// A long-form questionnaire is a deliberate, one-time submission -- same
// generous-but-bounded window as the contact form.
const isRateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 });

const idempotency = createIdempotencyStore<QuestionnaireApiResult>();
const MAX_SUBMISSION_ID_LEN = 100;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const record = body as Record<string, unknown>;

  // Spam heuristics run before validation, and respond as if nothing was
  // wrong -- a real error response here just teaches bots what to fix.
  if (looksLikeBot(record.honeypot, record.startedAt)) {
    logBotCheckRejection("project-questionnaire", record.honeypot, record.startedAt);
    return NextResponse.json({ ok: true, crmSaved: true });
  }

  const validation = validateQuestionnaire(record);
  if (!validation.valid) {
    return NextResponse.json(
      { ok: false, error: "validation_failed", fieldErrors: validation.errors },
      { status: 400 }
    );
  }

  const submissionId =
    typeof record.submissionId === "string" &&
    record.submissionId.length > 0 &&
    record.submissionId.length <= MAX_SUBMISSION_ID_LEN
      ? record.submissionId
      : null;

  const attempt = async (): Promise<{ body: QuestionnaireApiResult; status: number }> => {
    const [leadResult, delivery] = await Promise.all([
      upsertLeadFromQuestionnaire(validation.data),
      deliverQuestionnaire(validation.data),
    ]);

    if (!leadResult.ok && delivery.ok) {
      console.error(
        "[project-questionnaire] CRM save failed but the notification email sent -- " +
          "add this lead manually, the submission was NOT persisted to Supabase:",
        leadResult.error
      );
    } else if (leadResult.ok && !delivery.ok) {
      console.error(
        "[project-questionnaire] notification email failed but the CRM save succeeded -- " +
          "the lead is in Supabase, but no one was notified by email. Admin follow-up needed:",
        delivery.error
      );
    } else if (!leadResult.ok && !delivery.ok) {
      console.error(
        "[project-questionnaire] both CRM save and email delivery failed -- nothing was persisted:",
        leadResult.error,
        delivery.error
      );
    }

    if (leadResult.ok) {
      // Diagnostic-only, additive -- surfaces the email outcome on the
      // lead itself in the admin CRM instead of only an ephemeral server
      // log. Never affects the response below either way.
      await logEmailDeliveryActivity(leadResult.leadId, delivery);
    }

    const outcome = resolveSubmissionOutcome(leadResult.ok, delivery.ok);
    return { body: outcome, status: outcome.ok ? 200 : 502 };
  };

  const result = submissionId ? await idempotency.run(submissionId, attempt) : await attempt();

  return NextResponse.json(result.body, { status: result.status });
}
