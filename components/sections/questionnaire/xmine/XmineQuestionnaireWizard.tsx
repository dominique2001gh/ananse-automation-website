"use client";

/**
 * Xmine Consult's dedicated Project Discovery questionnaire.
 *
 * Same wizard mechanics, validation, and submission pipeline as the generic
 * questionnaire (components/sections/questionnaire/QuestionnaireWizard.tsx,
 * which this deliberately leaves untouched) -- same `QuestionnaireDraft`
 * shape, same `validateQuestionnaire`/`submitQuestionnaire`
 * (lib/questionnaire.ts, lib/questionnaire-validation.ts), same
 * `/api/project-questionnaire` route, same CRM storage and email delivery.
 * Only the presentation differs: mining-consultancy-tailored step copy
 * (./steps/) and a business name pre-filled to "Xmine Consult" and locked
 * (see StepBusiness) so this link stays dedicated to this one prospect.
 */

import { useEffect, useRef, useState, type ComponentType } from "react";
import Container from "@/components/ui/Container";
import { getButtonClassName } from "@/components/ui/Button";
import {
  createEmptyDraft,
  submitQuestionnaire,
  type QuestionnaireDraft,
} from "@/lib/questionnaire";
import { validateQuestionnaire } from "@/lib/questionnaire-validation";
import type { QuestionnaireFieldErrors } from "@/lib/questionnaire";
import type { StepId, StepProps } from "../steps/types";
import StepBusiness from "./steps/StepBusiness";
import StepProject from "./steps/StepProject";
import StepWebsite from "./steps/StepWebsite";
import StepOperations from "./steps/StepOperations";
import StepAnalytics from "./steps/StepAnalytics";
import StepAutomation from "./steps/StepAutomation";
import StepAdditional from "./steps/StepAdditional";
import StepContactReview from "./steps/StepContactReview";

const XMINE_BUSINESS_NAME = "Xmine Consult";

function createXmineDraft(): QuestionnaireDraft {
  return { ...createEmptyDraft(), businessName: XMINE_BUSINESS_NAME };
}

type StepConfig = {
  id: StepId;
  title: string;
  isRelevant: (draft: QuestionnaireDraft) => boolean;
};

const WEBSITE_TRIGGERS = ["New website", "Website redesign"];
const OPERATIONS_TRIGGERS = [
  "CRM / customer management",
  "Business management system",
  "Custom software/application",
  "SaaS platform",
];
const AUTOMATION_TRIGGERS = ["Business automation", "AI chat agent", "AI voice agent"];

const STEPS: StepConfig[] = [
  { id: "business", title: "About Xmine Consult", isRelevant: () => true },
  { id: "project", title: "Your Project", isRelevant: () => true },
  {
    id: "website",
    title: "Website Redesign",
    isRelevant: (d) => d.servicesNeeded.some((s) => WEBSITE_TRIGGERS.includes(s)),
  },
  {
    id: "operations",
    title: "Field Operations & CRM",
    isRelevant: (d) => d.servicesNeeded.some((s) => OPERATIONS_TRIGGERS.includes(s)),
  },
  // Always available -- per the brief, analytics questions stay useful to
  // prospects who didn't explicitly select "Data analytics / dashboard".
  { id: "analytics", title: "Analytics & Reporting", isRelevant: () => true },
  {
    id: "automation",
    title: "Automation & AI",
    isRelevant: (d) => d.servicesNeeded.some((s) => AUTOMATION_TRIGGERS.includes(s)),
  },
  { id: "additional", title: "Additional & Future Requirements", isRelevant: () => true },
  { id: "contact", title: "Contact & Review", isRelevant: () => true },
];

/** Every step except "contact" (rendered separately below -- it needs the
 * extra onEditStep prop the others don't have). */
const STEP_COMPONENTS: Record<Exclude<StepId, "contact">, ComponentType<StepProps>> = {
  business: StepBusiness,
  project: StepProject,
  website: StepWebsite,
  operations: StepOperations,
  analytics: StepAnalytics,
  automation: StepAutomation,
  additional: StepAdditional,
};

const STEP_REQUIRED_KEYS: Partial<Record<StepId, (keyof QuestionnaireFieldErrors)[]>> = {
  business: ["businessName"],
  project: ["servicesNeeded"],
  contact: ["contactName", "contactEmail"],
};

type Status = "idle" | "submitting" | "delivered" | "captured" | "error";

export default function XmineQuestionnaireWizard() {
  const [draft, setDraft] = useState<QuestionnaireDraft>(() => createXmineDraft());
  const [currentStepId, setCurrentStepId] = useState<StepId>("business");
  const [errors, setErrors] = useState<QuestionnaireFieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Spam-prevention fields -- same contract as the main contact form (see
  // components/sections/contact/ContactForm.tsx and lib/contact-delivery.ts).
  const [honeypot, setHoneypot] = useState("");
  const [startedAt] = useState(() => Date.now());

  const cardRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const visibleSteps = STEPS.filter((s) => s.isRelevant(draft));
  const currentIndex = Math.max(
    0,
    visibleSteps.findIndex((s) => s.id === currentStepId)
  );
  const currentStep = visibleSteps[currentIndex];
  const isLastStep = currentIndex === visibleSteps.length - 1;
  const progressPercent = Math.round(((currentIndex + 1) / visibleSteps.length) * 100);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cardRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [currentStepId]);

  function update<K extends keyof QuestionnaireDraft>(key: K, value: QuestionnaireDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function stepErrors(stepId: StepId, allErrors: QuestionnaireFieldErrors): QuestionnaireFieldErrors {
    const keys = STEP_REQUIRED_KEYS[stepId];
    if (!keys) return {};
    const result: QuestionnaireFieldErrors = {};
    for (const key of keys) {
      if (allErrors[key]) result[key] = allErrors[key];
    }
    return result;
  }

  function handleBack() {
    if (currentIndex === 0) return;
    setErrors({});
    setCurrentStepId(visibleSteps[currentIndex - 1].id);
  }

  function handleNext() {
    const validation = validateQuestionnaire(draft as unknown as Record<string, unknown>);
    const allErrors = validation.valid ? {} : validation.errors;
    const blocking = stepErrors(currentStep.id, allErrors);

    if (Object.keys(blocking).length > 0) {
      setErrors(blocking);
      return;
    }

    setErrors({});
    if (!isLastStep) {
      setCurrentStepId(visibleSteps[currentIndex + 1].id);
    }
  }

  function handleEditStep(stepId: StepId) {
    setErrors({});
    setCurrentStepId(stepId);
  }

  async function handleSubmit() {
    if (status === "submitting") return;

    const validation = validateQuestionnaire(draft as unknown as Record<string, unknown>);
    if (!validation.valid) {
      setErrors(validation.errors);
      // Land wherever the first missing required field actually lives.
      if (validation.errors.businessName) setCurrentStepId("business");
      else if (validation.errors.servicesNeeded) setCurrentStepId("project");
      else setCurrentStepId("contact");
      return;
    }

    setErrors({});
    setStatus("submitting");
    setStatusMessage(null);

    const result = await submitQuestionnaire({ ...validation.data, honeypot, startedAt });

    if (result.ok) {
      setStatus("delivered");
      return;
    }

    switch (result.error) {
      case "not_configured":
        setStatus("captured");
        return;
      case "validation_failed":
        setErrors(result.fieldErrors ?? {});
        setCurrentStepId("contact");
        setStatus("idle");
        return;
      case "rate_limited":
        setStatus("error");
        setStatusMessage(
          "You’ve submitted a few of these recently — please wait a few minutes and try again."
        );
        return;
      default:
        setStatus("error");
        setStatusMessage("Something went wrong sending this. Please try again in a moment.");
    }
  }

  function resetAll() {
    setDraft(createXmineDraft());
    setCurrentStepId("business");
    setErrors({});
    setStatus("idle");
    setStatusMessage(null);
  }

  if (status === "delivered" || status === "captured") {
    return (
      <section className="bg-paper-dim py-20 sm:py-28">
        <Container>
          <div
            role="status"
            className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl border border-line bg-paper p-10 text-center sm:p-14"
          >
            <span
              aria-hidden="true"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink text-gold-bright"
            >
              ✓
            </span>
            <h2 className="text-2xl font-semibold text-ink">Thank You</h2>
            <p className="text-base leading-relaxed text-slate">
              {status === "delivered" ? (
                <>
                  Thank you for telling us about Xmine Consult&rsquo;s project. We&rsquo;ve
                  received your information and will review your requirements. Someone from
                  Ananse Automation will follow up with you.
                </>
              ) : (
                <>
                  We&rsquo;ve captured everything you shared here. We&rsquo;re finishing the
                  connection that delivers questionnaires like this straight to our team —
                  thank you for your patience while we complete that setup.
                </>
              )}
            </p>
            <button
              type="button"
              onClick={resetAll}
              className="mt-2 text-sm font-medium text-gold hover:text-gold-bright"
            >
              Start another questionnaire
            </button>
          </div>
        </Container>
      </section>
    );
  }

  const StepComponent =
    currentStep.id === "contact" ? null : STEP_COMPONENTS[currentStep.id as Exclude<StepId, "contact">];

  return (
    <section className="bg-paper-dim py-16 sm:py-24">
      <Container>
        <div
          ref={cardRef}
          className="mx-auto flex w-full max-w-3xl scroll-mt-24 flex-col gap-8 rounded-3xl border border-line bg-paper p-6 sm:p-10"
        >
          {/* Honeypot: invisible and unreachable for real visitors -- see
              components/sections/contact/ContactForm.tsx for the identical
              pattern. */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor="xmine-questionnaire-company-website">Leave this field blank</label>
            <input
              id="xmine-questionnaire-company-website"
              type="text"
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <ProgressIndicator
            stepNumber={currentIndex + 1}
            totalSteps={visibleSteps.length}
            title={currentStep.title}
            percent={progressPercent}
          />

          {currentStep.id === "contact" || !StepComponent ? (
            <StepContactReview draft={draft} update={update} errors={errors} onEditStep={handleEditStep} />
          ) : (
            <StepComponent draft={draft} update={update} errors={errors} />
          )}

          {status === "error" && statusMessage ? (
            <p role="alert" className="text-sm text-terracotta">
              {statusMessage}
            </p>
          ) : null}

          <div className="flex items-center justify-between gap-3 border-t border-line pt-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentIndex === 0}
              className={getButtonClassName({
                variant: "secondary",
                className: "disabled:pointer-events-none disabled:opacity-40",
              })}
            >
              Back
            </button>

            {isLastStep ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={status === "submitting"}
                className={getButtonClassName({
                  className: "disabled:pointer-events-none disabled:opacity-60",
                })}
              >
                {status === "submitting" ? "Sending…" : "Submit Questionnaire"}
              </button>
            ) : (
              <button type="button" onClick={handleNext} className={getButtonClassName()}>
                Next
              </button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

function ProgressIndicator({
  stepNumber,
  totalSteps,
  title,
  percent,
}: {
  stepNumber: number;
  totalSteps: number;
  title: string;
  percent: number;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs font-medium tracking-[0.15em] text-gold uppercase">
          Step {stepNumber} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-ink">{title}</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Questionnaire progress: step ${stepNumber} of ${totalSteps}`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-line"
      >
        <div
          className="h-full rounded-full bg-gold transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
