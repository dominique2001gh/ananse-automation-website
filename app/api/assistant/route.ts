/**
 * Ananse AI Assistant -- API route.
 *
 * When AI_PROVIDER="openai" and AI_API_KEY are both set, every message is
 * answered by a real OpenAI call (lib/ai-openai.ts), grounded by the
 * system prompt in lib/ai-knowledge.ts. If either is unset, or the OpenAI
 * call fails for any reason (network error, bad response, empty reply),
 * this falls back to the deterministic knowledge matcher in
 * lib/ai-topics.ts -- real, grounded answers sourced from the site's own
 * data files, never generated or invented. The assistant never goes
 * silent and never fabricates a reply either way.
 *
 * Cost/abuse safeguards (pre-launch audit addition): every real OpenAI
 * call costs money and this endpoint is open to the public, so requests
 * are bounded on every axis a script could otherwise abuse -- rate
 * (isRateLimited), raw payload size (MAX_BODY_BYTES), conversation length
 * (MAX_MESSAGES) and per-message length (MAX_MESSAGE_LENGTH). Oversized
 * conversations/messages are trimmed rather than rejected outright, since
 * a genuine visitor chatting for a while should never see an error --
 * only a request crafted to be abusive (a huge body, or absurdly long
 * single message) gets an explicit 400/413.
 *
 * See docs/ai-assistant-architecture.md for the full plan.
 */

import { NextRequest, NextResponse } from "next/server";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";
import { matchTopic } from "@/lib/ai-topics";
import { callOpenAi } from "@/lib/ai-openai";
import { HANDOFF_QUESTION } from "@/lib/ai-knowledge";

// A visitor can send more chat turns than contact-form submissions, so this
// window is looser than the contact endpoint's.
const isRateLimited = createRateLimiter({ windowMs: 60 * 1000, max: 20 });

// Best-effort payload cap, checked against the Content-Length header before
// the body is even parsed -- cheap protection against a deliberately huge
// request (a normal conversation, even a long one, is nowhere near this).
// Like the rate limiter, this trusts the header rather than streaming and
// counting bytes, so it's a deterrent, not a guarantee.
const MAX_BODY_BYTES = 20_000;

// A real visitor's single chat message is realistically a sentence or two.
// This is generous headroom above that, not a tight UX constraint --
// anything longer is truncated, never silently dropped or rejected, so a
// visitor who pastes something long still gets a normal reply.
const MAX_MESSAGE_LENGTH = 2000;

// Keeps the full conversation sent to OpenAI (and its token cost) bounded
// even in an unusually long back-and-forth -- only the most recent turns
// are kept, so older context ages out rather than the request failing.
const MAX_MESSAGES = 30;

type IncomingMessage = { role: string; text: string };

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "payload_too_large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const rawMessages = Array.isArray((body as { messages?: unknown })?.messages)
    ? ((body as { messages: unknown[] }).messages as IncomingMessage[])
    : null;
  if (!rawMessages || rawMessages.length === 0) {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  // Trim to the most recent turns and clamp each message's length -- see
  // the constants above. Applied once, up front, so every path below
  // (OpenAI and the matcher fallback) is already working with bounded
  // input.
  const messages: IncomingMessage[] = rawMessages
    .slice(-MAX_MESSAGES)
    .map((m) => ({
      role: typeof m?.role === "string" ? m.role : "",
      text: typeof m?.text === "string" ? m.text.slice(0, MAX_MESSAGE_LENGTH) : "",
    }));

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user" && m.text);
  if (!lastUserMessage) {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  if (process.env.AI_PROVIDER === "openai" && process.env.AI_API_KEY) {
    const turns = messages
      .filter((m) => (m.role === "user" || m.role === "assistant") && m.text)
      .map((m) => ({ role: m.role as "user" | "assistant", text: m.text }));

    const reply = await callOpenAi(turns);
    if (reply) {
      return NextResponse.json({
        ok: true,
        reply,
        // Only true when the model actually asked the exact handoff
        // question (it's instructed to use this precise phrase -- see
        // lib/ai-knowledge.ts) -- not on every reply regardless of
        // content, so the widget's contextual "yes" detection stays
        // accurate instead of firing after an unrelated answer.
        offerHandoff: reply.includes(HANDOFF_QUESTION),
        // No matcher topic was involved, so there's no service-area hint
        // to offer during lead capture -- explicit null (not omitted)
        // clears any stale hint left over from earlier in the
        // conversation. See TOPIC_HELP_TOPIC_HINTS in lib/ai-topics.ts.
        topicId: null,
      });
    }
    // Falls through to the matcher below -- OpenAI call failed or
    // returned nothing usable. Degrade gracefully, never go silent.
  }

  const match = matchTopic(lastUserMessage.text);
  return NextResponse.json({
    ok: true,
    reply: match.reply,
    offerHandoff: match.prioritizeHandoff,
    // Lets the widget suggest a relevant service area during lead capture
    // instead of asking the visitor to categorize their own problem from
    // scratch -- see TOPIC_HELP_TOPIC_HINTS in lib/ai-topics.ts.
    topicId: match.id,
  });
}
