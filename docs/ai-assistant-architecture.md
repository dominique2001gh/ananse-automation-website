# Ananse AI Assistant — architecture notes

**Status:** live. OpenAI (`gpt-5.6-luna`) is connected and answering real
visitor messages, verified with real requests after billing was added to
the account. If the OpenAI call is ever unavailable (quota, network,
outage), `/api/assistant` falls back to the deterministic knowledge
matcher (`lib/ai-topics.ts`), grounded entirely in the site's own data
files, so the assistant never goes silent and never fabricates a reply
either way. The launcher is site-wide (mounted once in `app/layout.tsx`).
The "Automated Preview" badge has been removed from the panel header --
see §1's history below for how that was verified before removal.

## What's built

- **OpenAI integration** (`lib/ai-openai.ts`, server-only): calls OpenAI's
  Responses API (`POST https://api.openai.com/v1/responses`) via plain
  `fetch` -- no SDK dependency, same zero-dependency pattern already used
  for Resend in `lib/contact-delivery.ts`. Model defaults to
  **`gpt-5.6-luna`** (OpenAI's fastest/most affordable current tier --
  a deliberate cost/latency choice for a concise website assistant),
  overridable via `AI_MODEL` without a code change. Capped at 400 output
  tokens. Response parsing is defensive: reads the convenience
  `output_text` field first, falls back to walking the structured
  `output` array, and returns `null` (never throws) on any failure --
  `app/api/assistant/route.ts` treats `null` as "fall back to the
  matcher."
- **Grounding** (`lib/ai-knowledge.ts`): `buildSystemPrompt()` assembles
  the same data `lib/services-data.ts`, `lib/solutions-data.ts` and
  `lib/industries-data.ts` already render on the Services/Solutions/
  Industries pages into OpenAI's system prompt (the `instructions`
  field), plus explicit tone rules ("sound conversational, not like
  you're reading website copy," 2-4 sentences per reply) and hard rules
  against inventing prices, discounts, customers, testimonials, case
  studies, staff/team members, timelines, guarantees, features,
  partnerships, availability, or company history. The model is
  explicitly instructed to ask the handoff question **verbatim** (see
  `HANDOFF_QUESTION`, exported from this file) and never to attempt
  collecting contact details or claim it has submitted anything itself --
  that stays the website's job (§3).
- **Knowledge matcher** (`lib/ai-topics.ts`): the pre-OpenAI fallback,
  still fully functional. Same grounded, topic-matched replies as before,
  ending in the same verbatim `HANDOFF_QUESTION` for any substantive
  match.
- **API route** (`app/api/assistant/route.ts`): rate-limited (20
  messages/minute/IP), validates the request. If
  `AI_PROVIDER === "openai"` and `AI_API_KEY` are both set, calls OpenAI
  first; on success, `offerHandoff` is only `true` if the reply actually
  contains the exact `HANDOFF_QUESTION` text (so the widget's "yes"
  detection stays accurate instead of firing after an unrelated OpenAI
  reply). On any failure, or if the env vars aren't set, falls through to
  the matcher.
- **Lead capture** (`components/ai/AiChatWidget.tsx`): unchanged
  end-to-end flow (name → email → organization → phone → service area →
  problem description → preferred contact → review), triggered only on
  explicit consent -- either clicking "Yes, please," or typing an
  affirmative reply ("yes," "sure," "contact me," etc.) *while the
  assistant is actually waiting on that answer* (tracked via reference
  equality to the current quick-replies set, not just any "yes" anywhere
  in the conversation). Submits through `submitContactInquiry()` from
  `lib/contact.ts` -- **the same function the main contact form uses** --
  with the message prefixed `[Submitted via Ananse AI Assistant]`.
  `lib/contact.ts`, `lib/contact-validation.ts`, `lib/contact-delivery.ts`
  and `app/api/contact/route.ts` remain untouched by any of this. A
  failed submission preserves the entered details and offers "Try again"
  rather than discarding everything.
- **Auto-scroll** (`components/ai/AiChatWidget.tsx`): the message list
  (`messageListRef`) scrolls itself -- never the underlying page -- to
  the latest content whenever a new message, loading state, validation
  note, or quick-reply set appears, as long as the visitor hasn't
  deliberately scrolled away from the bottom (tracked via `onScroll` +
  an 80px-from-bottom threshold). Any new visitor action (sending a
  message, answering a lead-capture step, clicking a quick reply) resumes
  auto-follow even if they'd scrolled up to reread something. Opening the
  panel jumps to the latest message immediately (no animation); new
  content afterward scrolls smoothly.

## What's left (all optional, later)

### 1. Let the model trigger lead capture via a tool call

Right now `startLeadCapture()` is reachable via the "Yes, please" chip or
a typed affirmative reply to the handoff question -- both already work
with OpenAI live, since the model is instructed to ask that exact
question and the widget detects it contextually either way. A future
refinement could expose lead capture as an OpenAI tool/function call
instead of relying on exact-phrase detection, but the guided step flow
and `submitContactInquiry()` call underneath wouldn't need to change.

### 2. Streaming

Replies currently arrive as one complete message, not token-by-token.
The auto-scroll implementation already accounts for a future streaming
version (it re-runs on every relevant state change, not just once per
message), but adding real streaming means restructuring
`lib/ai-openai.ts`'s fetch as a readable stream and parsing
server-sent events, plus a corresponding change in the widget to append
partial text to the last bubble instead of waiting for one final
message.

### 3. Scheduling

A separate integration (Calendly, Cal.com, or a custom flow) offered as
an additional tool call once lead capture via OpenAI tool-calling (§1)
exists.
