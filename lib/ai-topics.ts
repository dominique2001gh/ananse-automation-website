/**
 * Deterministic knowledge matcher for the Ananse AI Assistant.
 *
 * This is NOT an LLM and doesn't pretend to be one. It's a keyword-matched
 * FAQ engine that answers from the same data files the site's own pages
 * render from -- every reply is built from real copy already reviewed and
 * published on the site, never generated or invented. It exists so the
 * assistant is genuinely useful (real grounded answers, real lead capture)
 * before any LLM credential exists, and it keeps working as a safety net
 * once one is added -- see app/api/assistant/route.ts.
 *
 * Editing lib/services-data.ts, lib/solutions-data.ts or
 * lib/industries-data.ts updates what this can talk about automatically.
 * The only hand-written prose here is (a) short conversational framing --
 * an acknowledgment and a clarifying question per topic, which never
 * asserts a fact, only invites more detail -- and (b) the handful of
 * general-purpose replies below (greeting, about, pricing, timeline,
 * human handoff, fallback), none of which claim anything beyond what the
 * site itself already states.
 */

import { servicePillars } from "./services-data";
import { featuredSolutions } from "./solutions-data";
import { industries } from "./industries-data";
import type { HelpTopic } from "./contact";

export type TopicMatch = {
  id: string;
  reply: string;
  /** True for intents where offering human follow-up is the point of the
   * reply, not just a generic add-on (pricing, timelines, "contact me"). */
  prioritizeHandoff: boolean;
};

type TopicSource = {
  id: string;
  keywords: string[];
  reply: () => string;
  prioritizeHandoff?: boolean;
};

function includesAny(message: string, keywords: string[]): boolean {
  return keywords.some((k) => message.includes(k));
}

const HANDOFF_QUESTION =
  "Would you like someone from Ananse Automation to contact you about this?";

const HUMAN_HANDOFF_KEYWORDS = [
  "contact me",
  "call me",
  "email me",
  "reach out",
  "get in touch",
  "talk to someone",
  "talk to a human",
  "speak with",
  "speak to",
  "reach a person",
  "sales",
  "representative",
];

const PRICING_KEYWORDS = [
  "price",
  "pricing",
  "cost",
  "how much",
  "rate",
  "fee",
  "budget",
  "quote",
  "expensive",
  "afford",
];

const TIMELINE_KEYWORDS = [
  "how long",
  "timeline",
  "turnaround",
  "how fast",
  "when will",
  "deadline",
  "how soon",
];

const GREETING_KEYWORDS = [
  "hi",
  "hello",
  "hey",
  "good morning",
  "good afternoon",
  "good evening",
];

const ABOUT_KEYWORDS = [
  "about ananse",
  "who are you",
  "what is ananse",
  "what does ananse do",
  "ananse mean",
  "name mean",
  "philosophy",
  "your approach",
  "how do you work",
  "what do you do",
];

// Hand-curated keyword sets per service pillar -- broader than just the
// title, so realistic phrasing actually matches.
const SERVICE_KEYWORDS: Record<string, string[]> = {
  "data-analytics": [
    "data",
    "analytics",
    "dashboard",
    "report",
    "reporting",
    "spreadsheet",
    "excel",
    "kpi",
    "sql",
    "business intelligence",
    " bi ",
    "insight",
  ],
  "ai-automation": [
    "automat",
    "workflow",
    " ai ",
    "artificial intelligence",
    "chatbot",
    "whatsapp",
    "customer service",
    "repetitive",
    "follow-up",
    "followup",
    "agent",
  ],
  "web-digital": [
    "website",
    " web ",
    "webpage",
    "site",
    "digital presence",
    "seo",
    "web app",
    "portal",
    "redesign",
  ],
  "custom-software": [
    "custom software",
    "saas",
    "custom system",
    "custom app",
    "internal tool",
    "integration",
    "application",
  ],
};

// Checked AFTER industries, so a general mention (e.g. "hotel") surfaces
// the broader operational context (and, where the industry data already
// references a product, that product) rather than jumping straight into a
// product pitch. Explicit brand-name mentions ("innexa", "innexa resume")
// still land here directly since industries don't match those.
const SOLUTION_KEYWORDS: Record<string, string[]> = {
  "innexa-hotel": ["innexa"],
  "innexa-resume": ["resume", "cv", "job search", "job seeker", "career", "innexa resume"],
  "tax-workflow": ["tax software", "tax platform", "tax practice"],
  "restaurant-platform": ["restaurant platform", "restaurant management platform"],
};

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  hospitality: ["hospitality", "hotel", "guesthouse", "guest house", "lodging"],
  "professional-services": [
    "professional services",
    "law firm",
    "lawyer",
    "consultant",
    "accounting practice",
    "consulting firm",
    "tax",
    "accountant",
    "cpa",
  ],
  "logistics-shipping": ["logistics", "shipping", "freight", "courier", "delivery business"],
  "restaurants-food-service": ["restaurant", "food service", "food business", "menu"],
  "retail-distribution": ["retail", "distribution", "wholesale", "distributor", "franchise"],
  "healthcare-human-services": ["healthcare", "human services", "nonprofit program", "clinic operations"],
};

// Short, hand-written conversational framing per topic -- an
// acknowledgment (never a factual claim) and a clarifying question, so a
// matched reply reads like part of a conversation rather than a pasted
// FAQ entry. This is the only non-data-derived prose in this file besides
// the general-purpose replies further down.
const PILLAR_FOLLOWUPS: Record<string, { ack: string; question: string }> = {
  "data-analytics": {
    ack: "That's a common one -- a lot of the businesses we talk to are in exactly that position.",
    question: "What are you currently using to pull this together -- mostly spreadsheets, or a mix of different tools?",
  },
  "ai-automation": {
    ack: "That kind of repetitive, manual work is exactly what we look at first.",
    question: "What does that process look like today, and roughly how often does it come up?",
  },
  "web-digital": {
    ack: "That's one of the areas we work on often.",
    question: "What's not working about it today -- visibility, turning visitors into customers, or something else?",
  },
  "custom-software": {
    ack: "That's a common sign that off-the-shelf software has stopped fitting the business.",
    question: "What are you using to manage that today, and where does it fall short?",
  },
};

const SOLUTION_FOLLOWUPS: Record<string, { ack: string; question: string }> = {
  "innexa-hotel": {
    ack: "Reservations spread across WhatsApp, phone and notebooks is exactly the kind of problem independent hotels bring to us.",
    question: "How are you currently handling bookings day to day -- mostly WhatsApp, phone, walk-ins, or a mix?",
  },
  "innexa-resume": {
    ack: "A lot of job seekers run into exactly that.",
    question: "What's been the hardest part -- tailoring your resume to each role, or something else?",
  },
  "tax-workflow": {
    ack: "That's a familiar pattern for tax practices.",
    question: "What's eating the most time right now -- chasing documents, status updates, or something else?",
  },
  "restaurant-platform": {
    ack: "That's a common day-to-day headache for independent restaurants.",
    question: "What's the biggest daily friction -- orders, inventory, staff coordination, or something else?",
  },
};

const INDUSTRY_FOLLOWUPS: Record<string, { ack: string; question: string }> = {
  hospitality: {
    ack: "Juggling reservations across WhatsApp, phone calls and notebooks is exactly the kind of thing we hear from independent hotels.",
    question: "How are you currently handling bookings day to day?",
  },
  "professional-services": {
    ack: "That kind of administrative load is common in professional-services firms.",
    question: "What's taking up the most time -- client intake, follow-ups, or reporting?",
  },
  "logistics-shipping": {
    ack: "Constant status questions can take over a logistics operation fast.",
    question: "Are most of those questions coming in by phone, WhatsApp, or something else?",
  },
  "restaurants-food-service": {
    ack: "That's a familiar pattern for restaurants.",
    question: "What's the biggest daily friction -- orders, inventory, or something else?",
  },
  "retail-distribution": {
    ack: "Not knowing what's selling or moving in real time is a common retail problem.",
    question: "Is the visibility gap mostly around inventory, sales, or across multiple locations?",
  },
  "healthcare-human-services": {
    ack: "Reporting and data visibility come up a lot for programs like this.",
    question: "Is the challenge mostly around collecting the data, or reporting on it once you have it?",
  },
};

/**
 * Maps a matched topic id to the contact form's real `HelpTopic` taxonomy
 * (lib/contact-validation.ts) -- used so lead capture can suggest a
 * relevant service area from context already established in the
 * conversation, rather than asking the visitor to categorize their own
 * problem from a blank list. Never invents a category outside the
 * existing taxonomy.
 */
export const TOPIC_HELP_TOPIC_HINTS: Record<string, HelpTopic[]> = {
  "data-analytics": ["Data & Analytics"],
  "ai-automation": ["AI & Automation"],
  "web-digital": ["Website / Digital"],
  "custom-software": ["Custom Software"],
  "innexa-hotel": ["Custom Software", "AI & Automation"],
  "innexa-resume": ["Custom Software"],
  "tax-workflow": ["Business Process Improvement", "AI & Automation"],
  "restaurant-platform": ["Custom Software"],
  hospitality: ["Custom Software", "AI & Automation"],
  "professional-services": ["Business Process Improvement", "AI & Automation"],
  "logistics-shipping": ["AI & Automation", "AI Customer Service / AI Agent"],
  "restaurants-food-service": ["Custom Software", "AI & Automation"],
  "retail-distribution": ["Data & Analytics", "Custom Software"],
  "healthcare-human-services": ["Data & Analytics"],
};

function pillarReply(id: string): string {
  const pillar = servicePillars.find((p) => p.id === id)!;
  const { ack, question } = PILLAR_FOLLOWUPS[id];
  return `${ack} ${pillar.positioning} This can include: ${pillar.capabilities.slice(0, 6).join(", ")}. ${question} ${HANDOFF_QUESTION}`;
}

function solutionReply(id: string): string {
  const solution = featuredSolutions.find((s) => s.id === id)!;
  const { ack, question } = SOLUTION_FOLLOWUPS[id];
  const statusNote =
    solution.status === "Planned"
      ? "It's currently a planned product, not yet available."
      : solution.status === "Early Access"
        ? "It's currently in early access."
        : "It's currently in development, not yet commercially launched.";
  return `${ack} ${solution.name}: ${solution.description.join(" ")} ${statusNote} ${solution.capabilitiesLabel}: ${solution.capabilities.slice(0, 6).join(", ")}. ${question} ${HANDOFF_QUESTION}`;
}

function industryReply(id: string): string {
  const industry = industries.find((i) => i.id === id)!;
  const { ack, question } = INDUSTRY_FOLLOWUPS[id];
  const capLabel = industry.capabilitiesLabel ?? "How Ananse can help";
  // Reuses the industry's own `note` field (already real, already published
  // on /industries) -- this is how a product like Innexa gets mentioned
  // here, never as a separate invented claim.
  const noteText = industry.note ? ` ${industry.note.text}` : "";
  return `${ack} ${industry.headline} Common challenges we see there: ${industry.challenges.slice(0, 5).join(", ")}. ${capLabel}: ${industry.capabilities.slice(0, 5).join(", ")}.${noteText} ${question} ${HANDOFF_QUESTION}`;
}

const ABOUT_REPLY = `Ananse Automation is a technology consulting and software development company that helps small and mid-sized businesses solve operational problems using data, automation, AI, websites and custom software. The approach: understand how the business actually operates first, then recommend the right technology -- never the other way around. (The name comes from Akan folklore -- Ananse is associated with wisdom and intricate, connected webs, the same idea behind connecting the different parts of a business into one system instead of leaving them scattered.)`;

const GREETING_REPLY = `Hi! I can tell you about Ananse's services, the products we're building, or the industries we work with -- or just tell me what's slowing your business down and I'll try to point you in the right direction.`;

const HUMAN_HANDOFF_REPLY = `I'd be glad to help connect you. Want me to collect a few quick details so someone from Ananse can follow up directly?`;

const PRICING_REPLY = `We don't publish set pricing -- every engagement is scoped to the specific problem, so the right fix (and its cost) depends on what we find. I can't give you a number here, but I can have someone from Ananse follow up with a proper estimate for your situation.`;

const TIMELINE_REPLY = `Timelines depend on the scope of the problem, so I don't have a general answer here -- but our team can give you a realistic timeline once they understand what you need. Want me to pass this along?`;

const FALLBACK_REPLY = `I'm not confident I can answer that accurately from what's on our site. Would you like me to connect you with someone from Ananse who can help directly?`;

const TOPICS: TopicSource[] = [
  { id: "human-handoff", keywords: HUMAN_HANDOFF_KEYWORDS, reply: () => HUMAN_HANDOFF_REPLY, prioritizeHandoff: true },
  { id: "pricing", keywords: PRICING_KEYWORDS, reply: () => PRICING_REPLY, prioritizeHandoff: true },
  { id: "timeline", keywords: TIMELINE_KEYWORDS, reply: () => TIMELINE_REPLY, prioritizeHandoff: true },
  ...Object.entries(INDUSTRY_KEYWORDS).map(([id, keywords]) => ({
    id,
    keywords,
    reply: () => industryReply(id),
    prioritizeHandoff: true,
  })),
  ...Object.entries(SOLUTION_KEYWORDS).map(([id, keywords]) => ({
    id,
    keywords,
    reply: () => solutionReply(id),
    prioritizeHandoff: true,
  })),
  ...Object.entries(SERVICE_KEYWORDS).map(([id, keywords]) => ({
    id,
    keywords,
    reply: () => pillarReply(id),
    prioritizeHandoff: true,
  })),
  { id: "about", keywords: ABOUT_KEYWORDS, reply: () => ABOUT_REPLY },
  { id: "greeting", keywords: GREETING_KEYWORDS, reply: () => GREETING_REPLY },
];

/** Matches the latest visitor message against known topics. Always
 * returns something -- an honest "I'm not sure" fallback if nothing
 * matches, never a guess. */
export function matchTopic(message: string): TopicMatch {
  const normalized = ` ${message.toLowerCase()} `;

  for (const topic of TOPICS) {
    if (includesAny(normalized, topic.keywords)) {
      return {
        id: topic.id,
        reply: topic.reply(),
        prioritizeHandoff: Boolean(topic.prioritizeHandoff),
      };
    }
  }

  return { id: "fallback", reply: FALLBACK_REPLY, prioritizeHandoff: true };
}
