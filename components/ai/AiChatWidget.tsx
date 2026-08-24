"use client";

/**
 * Ananse AI Assistant.
 *
 * Every message goes to `/api/assistant`, which answers using a real
 * OpenAI call (lib/ai-openai.ts) grounded by lib/ai-knowledge.ts. If that
 * call is ever unavailable, it falls back to the deterministic knowledge
 * matcher in lib/ai-topics.ts (real, grounded replies sourced from the
 * site's own data -- see that file's header for why this isn't a
 * fabricated response engine) so the assistant never goes silent and
 * never fabricates a reply either way (see docs/ai-assistant-architecture.md).
 *
 * Lead capture, when the visitor opts in, is a guided step-by-step
 * exchange handled entirely client-side, then submitted through the exact
 * same `submitContactInquiry()` used by the main contact form -- no
 * separate lead-delivery system.
 *
 * Rendered once, globally, from app/layout.tsx (alongside Header/Footer)
 * so it appears on every page. Do not also import it into an individual
 * page's own file -- that would mount a second, duplicate launcher.
 */

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { IconChat, IconNetwork } from "@/components/graphics/icons";
import { submitContactInquiry, type HelpTopic, type PreferredContact } from "@/lib/contact";
import { HELP_TOPICS, PREFERRED_CONTACT_OPTIONS, isValidEmail } from "@/lib/contact-validation";
import { TOPIC_HELP_TOPIC_HINTS } from "@/lib/ai-topics";

type ChatMessage = {
  id: string;
  role: "assistant" | "user" | "system";
  text: string;
};

type QuickReplyAction =
  | { type: "send-message"; text: string }
  | { type: "start-lead" }
  | { type: "dismiss" }
  | { type: "lead-answer"; value: string }
  | { type: "confirm-lead" }
  | { type: "cancel-lead" };

type QuickReply = { label: string; action: QuickReplyAction };

type LeadStep =
  | "fullName"
  | "email"
  | "organization"
  | "phone"
  | "helpTopic"
  | "message"
  | "preferredContact"
  | "review";

type LeadDraft = {
  fullName: string;
  email: string;
  organization: string;
  phone: string;
  helpTopic: HelpTopic | "";
  message: string;
  preferredContact: PreferredContact | "";
};

const emptyLeadDraft: LeadDraft = {
  fullName: "",
  email: "",
  organization: "",
  phone: "",
  helpTopic: "",
  message: "",
  preferredContact: "",
};

const LEAD_STEP_ORDER: LeadStep[] = [
  "fullName",
  "email",
  "organization",
  "phone",
  "helpTopic",
  "message",
  "preferredContact",
  "review",
];

const INTRO_MESSAGE =
  "Hi. Tell me a little about your business or what you’re trying to solve. I can help you understand which Ananse services may be relevant.";

const GENERIC_ERROR_NOTE =
  "I’m having trouble responding right now. You can still send Ananse a message through the contact form below.";

const RATE_LIMITED_NOTE =
  "That’s a lot of messages in a short time — please wait a moment before sending another.";

const STARTER_PROMPTS: QuickReply[] = [
  "I want to automate a process",
  "I need a better website",
  "I need help understanding my data",
  "I need custom software",
  "I’m not sure what I need",
].map((text) => ({ label: text, action: { type: "send-message", text } }));

const HANDOFF_OFFER: QuickReply[] = [
  { label: "Yes, please", action: { type: "start-lead" } },
  { label: "Keep chatting", action: { type: "dismiss" } },
];

const SKIP_REPLY: QuickReply = { label: "Skip", action: { type: "lead-answer", value: "" } };
const CANCEL_LEAD_REPLY: QuickReply = { label: "Cancel", action: { type: "cancel-lead" } };

// Recognizes a typed "yes"/"no" to the handoff offer -- but only ever
// consulted when the assistant is actually waiting on that answer (see
// `wasAwaitingHandoff` in sendMessage). A "yes" typed at any other point
// in the conversation is treated as an ordinary message, not a trigger.
const AFFIRMATIVE_PHRASES = [
  "yes",
  "yeah",
  "yep",
  "yup",
  "sure",
  "please do",
  "go ahead",
  "sounds good",
  "that would be great",
  "that works",
  "id like that",
  "contact me",
  "ok",
  "okay",
];

const NEGATIVE_PHRASES = [
  "no",
  "nope",
  "not now",
  "no thanks",
  "not right now",
  "maybe later",
  "not yet",
];

function normalizeReply(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[.,!]+$/g, "");
}

function matchesPhrase(normalized: string, phrases: string[]): boolean {
  return phrases.some(
    (phrase) =>
      normalized === phrase ||
      normalized.startsWith(`${phrase} `) ||
      normalized.startsWith(`${phrase},`)
  );
}

function isAffirmative(text: string): boolean {
  return matchesPhrase(normalizeReply(text), AFFIRMATIVE_PHRASES);
}

function isNegative(text: string): boolean {
  return matchesPhrase(normalizeReply(text), NEGATIVE_PHRASES);
}

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${idCounter}`;
}

export default function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: nextId(), role: "assistant", text: INTRO_MESSAGE },
  ]);
  const [quickReplies, setQuickReplies] = useState<QuickReply[] | null>(STARTER_PROMPTS);

  const [mode, setMode] = useState<"chat" | "lead">("chat");
  const [leadStep, setLeadStep] = useState<LeadStep>("fullName");
  const [leadDraft, setLeadDraft] = useState<LeadDraft>(emptyLeadDraft);
  const [leadFieldNote, setLeadFieldNote] = useState<string | null>(null);
  // Snapshot of the chat as it stood the moment lead capture began -- used
  // to draft the "problem/project" step so it summarizes what the visitor
  // actually said in conversation, not the name/email/etc. answered since.
  const [preLeadMessages, setPreLeadMessages] = useState<ChatMessage[]>([]);

  // Captured once, at mount -- reused as the spam-prevention timestamp for
  // a lead submitted via chat (there's no separate form render moment).
  const [widgetOpenedAt] = useState(() => Date.now());

  // The most recently matched topic (see lib/ai-topics.ts) -- used to
  // suggest a relevant service area during lead capture instead of
  // asking the visitor to categorize their own problem from scratch.
  const [lastTopicId, setLastTopicId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const panelId = useId();
  const titleId = useId();

  // --- Auto-scroll ------------------------------------------------------
  // Scrolls only this panel's own message list -- never the underlying
  // page (plain scrollTop/scrollTo on the container ref, not
  // window.scrollTo or scrollIntoView, which could otherwise walk up to
  // an ancestor). Auto-follow is suspended the moment the visitor
  // scrolls away from the bottom on their own (e.g. to reread something),
  // and resumed the moment they take a new action (send a message,
  // answer a lead-capture step, click a quick reply) -- so it never
  // fights a deliberate upward scroll, but also never leaves a new
  // reply hidden below the fold after the visitor re-engages.
  const messageListRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);

  function isNearBottom(el: HTMLDivElement, thresholdPx = 80) {
    return el.scrollHeight - el.scrollTop - el.clientHeight < thresholdPx;
  }

  function handleMessageListScroll() {
    const el = messageListRef.current;
    if (el) stickToBottomRef.current = isNearBottom(el);
  }

  // Runs after every render that could have added content to the list --
  // new messages, the "Thinking…" indicator appearing/disappearing, a
  // validation note, or a new set of quick replies (e.g. a fresh
  // lead-capture question).
  useEffect(() => {
    if (!stickToBottomRef.current) return;
    const el = messageListRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(raf);
  }, [messages, quickReplies, sending, leadFieldNote]);

  // Show the latest message immediately (no animation) the moment the
  // panel opens, rather than leaving it scrolled wherever it last was.
  useEffect(() => {
    if (!open) return;
    const el = messageListRef.current;
    if (!el) return;
    stickToBottomRef.current = true;
    el.scrollTop = el.scrollHeight;
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function pushMessage(role: ChatMessage["role"], text: string) {
    setMessages((prev) => [...prev, { id: nextId(), role, text }]);
  }

  // --- Free chat -----------------------------------------------------

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    // True only when the assistant's last message was the explicit
    // "Would you like someone from Ananse Automation to contact you?"
    // offer (quickReplies is the exact HANDOFF_OFFER array reference at
    // that point) -- so a "yes" typed anywhere else in the conversation
    // is never misread as accepting an offer that wasn't made.
    const wasAwaitingHandoff = quickReplies === HANDOFF_OFFER;

    // Sending is a deliberate new action -- resume following the
    // conversation even if the visitor had scrolled up to reread something.
    stickToBottomRef.current = true;

    const history = [...messages, { id: nextId(), role: "user" as const, text: trimmed }];
    setMessages(history);
    setInput("");
    setQuickReplies(null);

    if (wasAwaitingHandoff && isAffirmative(trimmed)) {
      startLeadCapture();
      return;
    }
    if (wasAwaitingHandoff && isNegative(trimmed)) {
      pushMessage("assistant", "No problem — let me know if that changes. What else can I help with?");
      setQuickReplies(STARTER_PROMPTS);
      return;
    }

    setSending(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Only the most recent turns are sent -- keeps the request small
          // and cheap even in an unusually long conversation. The visible
          // `messages` state (what the visitor can scroll back through) is
          // never trimmed, only what's sent over the wire. Mirrors the
          // server's own MAX_MESSAGES cap in app/api/assistant/route.ts,
          // so a genuinely long chat never bumps into that route's payload
          // guard -- only an abusive request would.
          messages: history
            .filter((m) => m.role !== "system")
            .slice(-30)
            .map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.ok && typeof data.reply === "string") {
        pushMessage("assistant", data.reply);
        // `topicId` is always present when `data.ok` -- a matcher id
        // string, or explicit null from the OpenAI path (clearing any
        // stale hint from earlier in the conversation).
        if ("topicId" in data) {
          setLastTopicId(typeof data.topicId === "string" ? data.topicId : null);
        }
        // Substantive answers (services/solutions/industries/pricing/etc.)
        // offer the contact hand-off directly. Lighter replies (a greeting,
        // "what is Ananse") re-surface example prompts instead of pushing
        // toward lead capture before there's anything to follow up on.
        setQuickReplies(data.offerHandoff ? HANDOFF_OFFER : STARTER_PROMPTS);
      } else if (data?.error === "rate_limited") {
        pushMessage("system", RATE_LIMITED_NOTE);
      } else {
        pushMessage("system", GENERIC_ERROR_NOTE);
      }
    } catch {
      pushMessage("system", GENERIC_ERROR_NOTE);
    } finally {
      setSending(false);
    }
  }

  // --- Lead capture ----------------------------------------------------

  function startLeadCapture() {
    setMode("lead");
    setLeadStep("fullName");
    setLeadDraft(emptyLeadDraft);
    setLeadFieldNote(null);
    setPreLeadMessages(messages);
    setInput("");
    pushMessage(
      "assistant",
      "Great — I just need a few details so our team can follow up. What's your name?"
    );
    setQuickReplies([CANCEL_LEAD_REPLY]);
  }

  function cancelLeadCapture() {
    setMode("chat");
    setLeadFieldNote(null);
    setInput("");
    pushMessage(
      "assistant",
      "No problem — let me know if you change your mind, or use the contact form below."
    );
    setQuickReplies(HANDOFF_OFFER);
  }

  function goToStep(step: LeadStep, draft: LeadDraft) {
    setLeadStep(step);
    setLeadFieldNote(null);

    switch (step) {
      case "email":
        setInput("");
        pushMessage("assistant", "Thanks. What's the best email to reach you?");
        setQuickReplies([CANCEL_LEAD_REPLY]);
        break;
      case "organization":
        setInput("");
        pushMessage("assistant", "What business or organization are you with?");
        setQuickReplies([SKIP_REPLY, CANCEL_LEAD_REPLY]);
        break;
      case "phone":
        setInput("");
        pushMessage("assistant", "And a phone number, if you'd like to share one?");
        setQuickReplies([SKIP_REPLY, CANCEL_LEAD_REPLY]);
        break;
      case "helpTopic": {
        // Suggest a service area from what's already been discussed,
        // rather than asking the visitor to categorize their own problem
        // from a blank list -- still just the real HELP_TOPICS taxonomy,
        // reordered and hinted at, never a new invented category.
        const hints = lastTopicId ? TOPIC_HELP_TOPIC_HINTS[lastTopicId] : undefined;
        pushMessage(
          "assistant",
          hints && hints.length > 0
            ? `Based on what you've shared, this sounds like it could be ${hints.join(" or ")} -- pick whichever fits best, or choose another option:`
            : "Which of these is closest to what you need?"
        );
        const orderedTopics = hints
          ? [...hints, ...HELP_TOPICS.filter((topic) => !hints.includes(topic))]
          : HELP_TOPICS;
        setQuickReplies([
          ...orderedTopics.map((topic) => ({
            label: topic,
            action: { type: "lead-answer", value: topic } as const,
          })),
          CANCEL_LEAD_REPLY,
        ]);
        break;
      }
      case "message": {
        // Left empty on purpose -- the visitor types their own description
        // here rather than finding it pre-filled with their earlier chat
        // messages. Those earlier messages (preLeadMessages) are still
        // retained and folded into the submitted lead in submitLead()
        // below, so nothing from the conversation is lost -- the visitor
        // just isn't asked to edit/approve a machine-drafted paraphrase of
        // their own words.
        setInput("");
        pushMessage(
          "assistant",
          "Last thing before I put this together — can you describe the problem or project in a sentence or two?"
        );
        setQuickReplies([CANCEL_LEAD_REPLY]);
        break;
      }
      case "preferredContact":
        pushMessage("assistant", "How would you prefer we reach out?");
        setQuickReplies([
          ...PREFERRED_CONTACT_OPTIONS.map((option) => ({
            label: option,
            action: { type: "lead-answer", value: option } as const,
          })),
          SKIP_REPLY,
          CANCEL_LEAD_REPLY,
        ]);
        break;
      case "review": {
        setInput("");
        const lines = [
          `Name: ${draft.fullName}`,
          draft.organization ? `Organization: ${draft.organization}` : null,
          `Email: ${draft.email}`,
          draft.phone ? `Phone: ${draft.phone}` : null,
          `Service: ${draft.helpTopic}`,
          draft.preferredContact ? `Preferred contact: ${draft.preferredContact}` : null,
          `Message: ${draft.message}`,
        ].filter((line): line is string => Boolean(line));
        pushMessage(
          "assistant",
          `Here's what I'll send to the Ananse team:\n\n${lines.join("\n")}\n\nShould I send it?`
        );
        setQuickReplies([
          { label: "Send it", action: { type: "confirm-lead" } },
          CANCEL_LEAD_REPLY,
        ]);
        break;
      }
      default:
        setInput("");
    }
  }

  function submitLeadField(rawValue: string) {
    const value = rawValue.trim();
    stickToBottomRef.current = true;

    if (leadStep === "fullName" && !value) {
      setLeadFieldNote("I'll need your name to continue.");
      return;
    }
    if (leadStep === "email" && !isValidEmail(value)) {
      setLeadFieldNote("That doesn't look like a valid email — mind double-checking it?");
      return;
    }
    if (leadStep === "message" && !value) {
      setLeadFieldNote("A short description helps our team a lot — go ahead and add one.");
      return;
    }

    if (value) pushMessage("user", value);

    const nextDraft: LeadDraft = { ...leadDraft };
    if (leadStep === "fullName") nextDraft.fullName = value;
    else if (leadStep === "email") nextDraft.email = value;
    else if (leadStep === "organization") nextDraft.organization = value;
    else if (leadStep === "phone") nextDraft.phone = value;
    else if (leadStep === "helpTopic") nextDraft.helpTopic = value as HelpTopic;
    else if (leadStep === "message") nextDraft.message = value;
    else if (leadStep === "preferredContact")
      nextDraft.preferredContact = (value || "") as PreferredContact | "";

    setLeadDraft(nextDraft);

    const currentIndex = LEAD_STEP_ORDER.indexOf(leadStep);
    const next = LEAD_STEP_ORDER[currentIndex + 1];
    goToStep(next, nextDraft);
  }

  async function submitLead() {
    if (sending) return;
    setQuickReplies(null);
    setSending(true);
    // The visitor's typed description (leadDraft.message) is the primary
    // content, but the conversation that led up to lead capture is still
    // valuable context for whoever follows up -- so it's appended here
    // rather than lost, even though it's no longer pre-filled into the
    // input for the visitor to edit (see the "message" case in goToStep).
    const priorConversation = preLeadMessages
      .filter((m) => m.role === "user")
      .map((m) => m.text)
      .join(" ")
      .trim();
    const message = priorConversation
      ? `[Submitted via Ananse AI Assistant]\n\n${leadDraft.message}\n\n---\nEarlier in the conversation, the visitor also said:\n${priorConversation}`
      : `[Submitted via Ananse AI Assistant]\n\n${leadDraft.message}`;
    const result = await submitContactInquiry({
      fullName: leadDraft.fullName,
      organization: leadDraft.organization,
      email: leadDraft.email,
      phone: leadDraft.phone,
      helpTopic: leadDraft.helpTopic as HelpTopic,
      message,
      preferredContact: (leadDraft.preferredContact || null) as PreferredContact | null,
      honeypot: "",
      startedAt: widgetOpenedAt,
    });
    setSending(false);

    if (result.ok) {
      const firstName = leadDraft.fullName.trim().split(/\s+/)[0] || leadDraft.fullName;
      pushMessage(
        "assistant",
        `Thank you, ${firstName}. Your information has been sent to the Ananse Automation team. Someone will follow up with you using ${
          leadDraft.preferredContact ? "your preferred contact method" : "the details you shared"
        }.`
      );
      setMode("chat");
      setQuickReplies(STARTER_PROMPTS);
      return;
    }

    // Submission failed -- stay on the review step with the draft intact
    // (leadDraft/mode/leadStep are untouched) so "Try again" resubmits the
    // same details instead of making the visitor start over.
    if (result.error === "rate_limited") {
      pushMessage(
        "assistant",
        "I wasn't able to send that just now — we've hit a sending limit. Your details are still here; want to try again in a moment, or use the contact form below?"
      );
    } else {
      pushMessage(
        "assistant",
        "I wasn't able to send that just now. Your details are still here — want to try again, or use the contact form below?"
      );
    }
    setQuickReplies([
      { label: "Try again", action: { type: "confirm-lead" } },
      CANCEL_LEAD_REPLY,
    ]);
  }

  // --- Shared dispatch ---------------------------------------------------

  function handleQuickReply(reply: QuickReply) {
    stickToBottomRef.current = true;
    setQuickReplies(null);
    switch (reply.action.type) {
      case "send-message":
        void sendMessage(reply.action.text);
        break;
      case "start-lead":
        startLeadCapture();
        break;
      case "dismiss":
        break;
      case "lead-answer":
        submitLeadField(reply.action.value);
        break;
      case "confirm-lead":
        void submitLead();
        break;
      case "cancel-lead":
        cancelLeadCapture();
        break;
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (mode === "lead") {
      // Chip-driven steps ignore free-text submission.
      if (["helpTopic", "preferredContact", "review"].includes(leadStep)) return;
      submitLeadField(input);
    } else {
      void sendMessage(input);
    }
  }

  const isChipOnlyStep =
    mode === "lead" && ["helpTopic", "preferredContact", "review"].includes(leadStep);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="fixed right-5 bottom-5 z-50 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-medium text-paper shadow-[0_12px_32px_-12px_rgba(23,20,15,0.5)] transition-colors duration-200 hover:bg-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:right-6 sm:bottom-6"
      >
        <IconChat className="h-4 w-4 text-gold-bright" />
        {open ? "Close" : "Ask Ananse AI"}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Ananse AI Assistant"
          aria-labelledby={titleId}
          className="fixed right-4 bottom-20 left-4 z-50 flex max-h-[min(32rem,calc(100vh-6rem))] flex-col overflow-hidden rounded-3xl border border-ink-line bg-paper shadow-[0_24px_64px_-16px_rgba(23,20,15,0.45)] sm:right-6 sm:bottom-24 sm:left-auto sm:w-full sm:max-w-sm"
        >
          <div className="relative overflow-hidden bg-ink px-5 py-4">
            <IconNetwork className="pointer-events-none absolute -top-3 -right-3 h-16 w-16 text-gold opacity-20" />
            <div className="relative flex items-center justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <span id={titleId} className="text-sm font-semibold text-paper">
                  Ananse AI Assistant
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="relative inline-flex h-8 w-8 items-center justify-center rounded-full text-paper/70 transition-colors hover:bg-paper/10 hover:text-paper"
              >
                ×
              </button>
            </div>
          </div>

          <div
            ref={messageListRef}
            onScroll={handleMessageListScroll}
            aria-live="polite"
            className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}

            {leadFieldNote ? (
              <p className="self-center px-4 text-center text-xs text-terracotta">
                {leadFieldNote}
              </p>
            ) : null}

            {sending ? (
              <p className="self-start rounded-2xl rounded-bl-sm bg-paper-dim px-4 py-2.5 text-sm text-slate/60 italic">
                Thinking…
              </p>
            ) : null}

            {quickReplies ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {quickReplies.map((reply) => (
                  <button
                    key={reply.label}
                    type="button"
                    onClick={() => handleQuickReply(reply)}
                    disabled={sending}
                    className="rounded-full border border-line px-3 py-1.5 text-left text-xs text-slate transition-colors hover:border-gold/50 hover:text-ink disabled:pointer-events-none disabled:opacity-50"
                  >
                    {reply.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-line p-3"
          >
            <label htmlFor={`${panelId}-input`} className="sr-only">
              Message Ananse AI
            </label>
            <input
              ref={inputRef}
              id={`${panelId}-input`}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isChipOnlyStep ? "Choose an option above" : "Type a message…"}
              disabled={sending || isChipOnlyStep}
              maxLength={2000}
              className="flex-1 rounded-full border border-line bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-slate/50 focus:border-gold focus:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!input.trim() || sending || isChipOnlyStep}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-colors hover:bg-ink-soft disabled:pointer-events-none disabled:opacity-40"
            >
              →
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  if (message.role === "system") {
    return (
      <p className="self-center px-4 text-center text-xs text-slate/70 italic">
        {message.text}
      </p>
    );
  }

  const isUser = message.role === "user";
  return (
    <p
      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
        isUser
          ? "self-end rounded-br-sm bg-ink text-paper"
          : "self-start rounded-bl-sm bg-paper-dim text-ink"
      }`}
    >
      {message.text}
    </p>
  );
}
