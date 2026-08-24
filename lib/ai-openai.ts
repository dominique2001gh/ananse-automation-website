/**
 * SERVER-ONLY. Do not import this from a "use client" component -- it
 * reads AI_API_KEY from `process.env`, which must never reach the browser
 * bundle. It's only ever imported from `app/api/assistant/route.ts`.
 *
 * Talks to OpenAI's Responses API (the current, non-deprecated endpoint
 * for text generation -- not the older Chat Completions API) via a plain
 * `fetch` call, same zero-dependency pattern already used for Resend in
 * lib/contact-delivery.ts. No SDK required.
 *
 * `callOpenAi` never throws and never fabricates a reply: any failure
 * (network error, non-2xx response, unparseable body) resolves to `null`,
 * which app/api/assistant/route.ts treats as "fall back to the
 * deterministic matcher" -- the assistant degrades gracefully instead of
 * erroring out or inventing something.
 */

import { buildSystemPrompt } from "./ai-knowledge";

// "gpt-5.6-luna" is OpenAI's fastest/most affordable current-generation
// model -- a sensible default for a concise website FAQ/lead-qualification
// assistant. Overridable via AI_MODEL without a code change if a different
// tier is ever preferred.
const DEFAULT_MODEL = "gpt-5.6-luna";

// Keeps replies short by construction, not just by prompt instruction --
// this is also the primary cost-control lever, alongside sending only
// structured summary text (never raw page HTML) as context.
const MAX_OUTPUT_TOKENS = 400;

export type OpenAiTurn = { role: "user" | "assistant"; text: string };

export async function callOpenAi(turns: OpenAiTurn[]): Promise<string | null> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || DEFAULT_MODEL,
        instructions: buildSystemPrompt(),
        input: turns.map((t) => ({ role: t.role, content: t.text })),
        max_output_tokens: MAX_OUTPUT_TOKENS,
      }),
    });

    if (!res.ok) {
      // Diagnostic only -- OpenAI's own status/error body, never the key.
      console.error("[assistant] OpenAI request failed:", res.status, await safeText(res));
      return null;
    }

    const data: unknown = await res.json().catch(() => null);
    return extractReplyText(data);
  } catch (err) {
    console.error("[assistant] OpenAI request threw:", err);
    return null;
  }
}

/**
 * Defensive parsing: the Responses API exposes a convenience top-level
 * `output_text` string for simple text replies, but falls back to walking
 * the structured `output` array (an OpenAI SDK client would normally do
 * this for you) in case a given response doesn't populate that shortcut.
 */
function extractReplyText(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;

  if (typeof record.output_text === "string" && record.output_text.trim()) {
    return record.output_text.trim();
  }

  const output = record.output;
  if (Array.isArray(output)) {
    for (const item of output) {
      if (!item || typeof item !== "object") continue;
      const content = (item as Record<string, unknown>).content;
      if (!Array.isArray(content)) continue;
      for (const part of content) {
        if (part && typeof part === "object" && "text" in part) {
          const text = (part as Record<string, unknown>).text;
          if (typeof text === "string" && text.trim()) return text.trim();
        }
      }
    }
  }

  return null;
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}
