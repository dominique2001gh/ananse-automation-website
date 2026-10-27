/**
 * Dash Postal and Tax Services Questionnaire -- API route.
 *
 * Rate-limited, honeypot/timing spam check via `looksLikeBot` from
 * lib/contact-delivery.ts, server-authoritative validation, then the CRM
 * write (lib/leads.ts) and email delivery (lib/questionnaire-dash-postal-
 * delivery.ts) run in parallel.
 *
 * Unlike the generic questionnaire's route (app/api/project-questionnaire/
 * route.ts, untouched by this file) and Xmine Consult's, which both treat
 * a CRM write failure as a pure background concern that never changes the
 * visitor-facing response, this route treats Supabase persistence as the
 * primary success signal -- see lib/questionnaire-dash-postal-outcome.ts
 * for the exact decision table and the reasoning. That stricter contract
 * is deliberately scoped to Dash Postal only.
 *
 * Also guards against duplicate submissions (a double-click, or a browser/
 * network layer retrying the same POST) via a client-generated
 * `submissionId`, idempotent per lib/questionnaire-dash-postal-outcome.ts's
 * in-memory store -- a repeat of the same id after a successful outcome
 * returns the cached result instead of writing a second lead or sending a
 * second email; concurrent requests for the same id share one in-flight
 * attempt; a hard failure is never cached, so retrying after "both failed"
 * genuinely re-attempts.
 */

import { NextRequest, NextResponse } from "next/server";
import { validateDashPostalQuestionnaire } from "@/lib/questionnaire-dash-postal-validation";
import { deliverDashPostalQuestionnaire } from "@/lib/questionnaire-dash-postal-delivery";
import { looksLikeBot } from "@/lib/contact-delivery";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";
import { upsertLeadFromDashPostalQuestionnaire } from "@/lib/leads";
import {
  resolveSubmissionOutcome,
  createIdempotencyStore,
  type DashPostalApiResult,
} from "@/lib/questionnaire-dash-postal-outcome";

// Same generous-but-bounded window as the generic questionnaire and the
// contact form -- a long-form questionnaire is a deliberate, one-time
// submission.
const isRateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 });

const idempotency = createIdempotencyStore<DashPostalApiResult>();
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
    return NextResponse.json({ ok: true, crmSaved: true });
  }

  const validation = validateDashPostalQuestionnaire(record);
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

  const attempt = async (): Promise<{ body: DashPostalApiResult; status: number }> => {
    const [leadResult, delivery] = await Promise.all([
      upsertLeadFromDashPostalQuestionnaire(validation.data),
      deliverDashPostalQuestionnaire(validation.data),
    ]);

    if (!leadResult.ok && delivery.ok) {
      console.error(
        "[dash-postal-questionnaire] CRM save failed but the notification email sent -- " +
          "add this lead manually, the submission was NOT persisted to Supabase:",
        leadResult.error
      );
    } else if (leadResult.ok && !delivery.ok) {
      console.error(
        "[dash-postal-questionnaire] notification email failed but the CRM save succeeded -- " +
          "the lead is in Supabase, but no one was notified by email. Admin follow-up needed:",
        delivery.error
      );
    } else if (!leadResult.ok && !delivery.ok) {
      console.error(
        "[dash-postal-questionnaire] both CRM save and email delivery failed -- nothing was persisted:",
        leadResult.error,
        delivery.error
      );
    }

    const outcome = resolveSubmissionOutcome(leadResult.ok, delivery.ok);
    return { body: outcome, status: outcome.ok ? 200 : 502 };
  };

  const result = submissionId ? await idempotency.run(submissionId, attempt) : await attempt();

  return NextResponse.json(result.body, { status: result.status });
}
