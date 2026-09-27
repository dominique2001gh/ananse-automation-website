"use client";

import { useId, useState, type FormEvent } from "react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { EXAMPLE_QUESTIONS, answerExampleQuestion, answerQuestion } from "@/lib/ai-analytics-demo";
import { presetToRange, type AnalyticsFilters } from "@/lib/analytics-demo-engine";

// A fixed, generous context (last 12 months, every location/service/team) so
// this section's answers are meaningful on their own without depending on
// whatever a visitor left the live dashboard filters set to above.
const DEMO_FILTERS: AnalyticsFilters = {
  ...presetToRange("last12"),
  locationId: "all",
  serviceId: "all",
  teamMemberId: "all",
  customerType: "all",
};

type Message = { id: string; role: "user" | "assistant"; text: string };

let messageCounter = 0;
function nextId() {
  return `msg-${++messageCounter}`;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: nextId(),
    role: "assistant",
    text: "Ask me something about the sample business above -- try one of the examples, or type your own question.",
  },
];

export default function AskYourData() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");
  const inputId = useId();

  function ask(questionText: string, exampleId?: string) {
    const trimmed = questionText.trim();
    if (!trimmed) return;
    const answer = exampleId ? answerExampleQuestion(exampleId, DEMO_FILTERS) : answerQuestion(trimmed, DEMO_FILTERS);
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", text: trimmed },
      { id: nextId(), role: "assistant", text: answer.text },
    ]);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    ask(draft);
    setDraft("");
  }

  return (
    <section className="bg-paper-dim py-20 sm:py-28">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="AI Data Analyst"
          title="Ask Your Data"
          description="Data → dashboard → question → explanation → action. This is what it looks like when management can ask a plain-English question about the business instead of waiting on a report."
        />

        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 rounded-3xl border border-line bg-paper p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUESTIONS.map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => ask(q.question, q.id)}
                className="rounded-full border border-line px-4 py-2 text-left text-xs font-medium text-slate transition-colors hover:border-ink/30 hover:bg-ink/[0.04] hover:text-ink"
              >
                {q.question}
              </button>
            ))}
          </div>

          <div
            role="log"
            aria-live="polite"
            className="flex max-h-[420px] min-h-[220px] flex-col gap-3 overflow-y-auto rounded-2xl border border-line bg-paper-dim p-4"
          >
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    message.role === "user"
                      ? "rounded-br-sm bg-ink text-paper"
                      : "rounded-bl-sm border border-line bg-paper text-ink"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <label htmlFor={inputId} className="sr-only">
              Ask a question about the sample business data
            </label>
            <input
              id={inputId}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about revenue, retention, cancellations, trends…"
              className="flex-1 rounded-full border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              Ask
            </button>
          </form>

          <p className="text-xs text-slate/70 italic">
            Answers above are generated from the fictional sample dataset (last 12 months, all locations) — not a
            live connection to your business. Connect your own data and every answer grounds in it instead.
          </p>
        </div>
      </Container>
    </section>
  );
}
