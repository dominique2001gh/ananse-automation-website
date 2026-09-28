/**
 * Client Discovery Questionnaire -- API route.
 *
 * Same shape as app/api/contact/route.ts: rate-limited, honeypot/timing
 * spam check (reusing `looksLikeBot` from lib/contact-delivery.ts -- that
 * heuristic isn't form-specific), server-authoritative validation, then
 * delivery via lib/questionnaire-delivery.ts (Resend, reusing the same
 * account as the contact form; falls back to a generic webhook; otherwise
 * inert). app/api/contact/route.ts itself is untouched.
 */

import { NextRequest, NextResponse } from "next/server";
import { validateQuestionnaire } from "@/lib/questionnaire-validation";
import { deliverQuestionnaire } from "@/lib/questionnaire-delivery";
import { looksLikeBot } from "@/lib/contact-delivery";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";
import { upsertLeadFromQuestionnaire } from "@/lib/leads";

// A long-form questionnaire is a deliberate, one-time submission -- same
// generous-but-bounded window as the contact form.
const isRateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 });

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
    return NextResponse.json({ ok: true });
  }

  const result = validateQuestionnaire(record);
  if (!result.valid) {
    return NextResponse.json(
      { ok: false, error: "validation_failed", fieldErrors: result.errors },
      { status: 400 }
    );
  }

  // Runs independently, in parallel, with email delivery -- a CRM write
  // failure must never block or change the response the visitor sees,
  // and email delivery must never wait on (or be skipped because of) the
  // database. See lib/leads.ts.
  const [leadResult, delivery] = await Promise.all([
    upsertLeadFromQuestionnaire(result.data),
    deliverQuestionnaire(result.data),
  ]);

  if (!leadResult.ok) {
    console.error(
      "[project-questionnaire] CRM lead write failed (email delivery unaffected):",
      leadResult.error
    );
  }

  if (!delivery.ok) {
    const status = delivery.error === "not_configured" ? 503 : 502;
    return NextResponse.json({ ok: false, error: delivery.error }, { status });
  }

  return NextResponse.json({ ok: true });
}
