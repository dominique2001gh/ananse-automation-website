import { NextRequest, NextResponse } from "next/server";
import { validateContactInquiry } from "@/lib/contact-validation";
import { deliverInquiry, looksLikeBot } from "@/lib/contact-delivery";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";

// Same IP: at most 5 inquiries per 10 minutes. Generous enough for a real
// visitor retrying a typo, tight enough to blunt a naive script.
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

  const result = validateContactInquiry(record);
  if (!result.valid) {
    return NextResponse.json(
      { ok: false, error: "validation_failed", fieldErrors: result.errors },
      { status: 400 }
    );
  }

  const delivery = await deliverInquiry(result.data);
  if (!delivery.ok) {
    const status = delivery.error === "not_configured" ? 503 : 502;
    return NextResponse.json({ ok: false, error: delivery.error }, { status });
  }

  return NextResponse.json({ ok: true });
}
