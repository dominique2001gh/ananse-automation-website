"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import Container from "@/components/ui/Container";
import { getButtonClassName } from "@/components/ui/Button";
import { submitContactInquiry, type HelpTopic, type PreferredContact } from "@/lib/contact";
import {
  validateContactInquiry,
  HELP_TOPICS,
  PREFERRED_CONTACT_OPTIONS,
  type ContactFieldErrors,
} from "@/lib/contact-validation";

type FormState = {
  fullName: string;
  organization: string;
  email: string;
  phone: string;
  helpTopic: HelpTopic | "";
  message: string;
  preferredContact: PreferredContact | "";
};

const initialState: FormState = {
  fullName: "",
  organization: "",
  email: "",
  phone: "",
  helpTopic: "",
  message: "",
  preferredContact: "",
};

type Status = "idle" | "submitting" | "delivered" | "captured" | "error";

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Spam-prevention fields. `honeypot` must stay empty -- a real visitor
  // never sees or fills this in. `startedAt` is captured once, on first
  // render, so the server can reject implausibly-fast "submissions."
  const [honeypot, setHoneypot] = useState("");
  const [startedAt] = useState(() => Date.now());

  const nameId = useId();
  const orgId = useId();
  const emailId = useId();
  const phoneId = useId();
  const messageId = useId();
  const honeypotId = useId();

  const confirmationHeadingRef = useRef<HTMLHeadingElement>(null);
  // Whether the just-submitted inquiry included a preferred contact
  // method -- read by the confirmation copy below so it never claims
  // "your preferred contact method" when none was actually given.
  const [submittedPreferredContact, setSubmittedPreferredContact] =
    useState<PreferredContact | null>(null);

  // Move focus (and, if needed, scroll) to the confirmation the moment it
  // appears, so it's unmistakable that the submission landed -- both for
  // sighted visitors whose scroll position doesn't otherwise change, and
  // for screen-reader/keyboard users who need the focus moved explicitly.
  useEffect(() => {
    if (status !== "delivered" && status !== "captured") return;
    const heading = confirmationHeadingRef.current;
    if (!heading) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    heading.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "center",
    });
    heading.focus();
  }, [status]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Belt-and-suspenders duplicate-submission guard -- the submit button
    // is already disabled while "submitting", but this makes it impossible
    // to trigger a second in-flight request no matter how it's fired.
    if (status === "submitting") return;

    const validation = validateContactInquiry(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setStatus("submitting");
    setStatusMessage(null);
    setSubmittedPreferredContact(validation.data.preferredContact);

    const result = await submitContactInquiry({
      ...validation.data,
      honeypot,
      startedAt,
    });

    if (result.ok) {
      setStatus("delivered");
      return;
    }

    switch (result.error) {
      case "not_configured":
        // Expected right now -- no email/CRM service is wired up yet.
        // Honest soft-confirmation, not a claim of delivery.
        setStatus("captured");
        return;
      case "validation_failed":
        setErrors(result.fieldErrors ?? {});
        setStatus("idle");
        return;
      case "rate_limited":
        setStatus("error");
        setStatusMessage(
          "You’ve sent a few of these recently — please wait a few minutes and try again."
        );
        return;
      default:
        setStatus("error");
        setStatusMessage("Something went wrong sending this. Please try again in a moment.");
    }
  }

  if (status === "delivered" || status === "captured") {
    const preferredContactLabel =
      status === "delivered" && submittedPreferredContact
        ? "your preferred contact method"
        : "the contact details you shared";

    return (
      <section id="inquiry-form" className="bg-paper-dim py-20 sm:py-28">
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
            <h2
              ref={confirmationHeadingRef}
              tabIndex={-1}
              className="text-2xl font-semibold text-ink focus:outline-none"
            >
              {status === "delivered"
                ? "Thank you — your message has been received."
                : "Thank You"}
            </h2>
            <p className="text-base leading-relaxed text-slate">
              {status === "delivered" ? (
                <>
                  We&rsquo;ve received your inquiry and will review the
                  details you provided. We&rsquo;ll follow up using{" "}
                  {preferredContactLabel}.
                </>
              ) : (
                <>
                  We&rsquo;ve captured the details you shared here.
                  We&rsquo;re finishing the connection that delivers
                  inquiries like this straight to our team — thank you for
                  your patience while we complete that setup.
                </>
              )}
            </p>
            <button
              type="button"
              onClick={() => {
                setForm(initialState);
                setErrors({});
                setStatus("idle");
                setStatusMessage(null);
                setSubmittedPreferredContact(null);
              }}
              className="mt-2 text-sm font-medium text-gold hover:text-gold-bright"
            >
              Send another inquiry
            </button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id="inquiry-form" className="bg-paper-dim py-20 sm:py-28">
      <Container className="flex flex-col gap-10">
        <div className="mx-auto flex max-w-xl flex-col gap-3 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-balance text-ink sm:text-4xl">
            Tell Us About Your Business
          </h2>
          <p className="text-base leading-relaxed text-slate">
            A few details will help us understand what you&rsquo;re trying
            to solve.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mx-auto flex w-full max-w-2xl flex-col gap-8 rounded-3xl border border-line bg-paper p-6 sm:p-10"
        >
          {/* Honeypot: invisible and unreachable for real visitors, tab-
              skipped and hidden from assistive tech. Bots that blindly fill
              every field trip this and are silently ignored server-side. */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor={honeypotId}>Leave this field blank</label>
            <input
              id={honeypotId}
              type="text"
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field id={nameId} label="Full Name" required error={errors.fullName}>
              <input
                id={nameId}
                type="text"
                autoComplete="name"
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                aria-invalid={Boolean(errors.fullName)}
                className={inputClass}
              />
            </Field>

            <Field id={orgId} label="Business / Organization">
              <input
                id={orgId}
                type="text"
                autoComplete="organization"
                value={form.organization}
                onChange={(e) => updateField("organization", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field id={emailId} label="Email Address" required error={errors.email}>
              <input
                id={emailId}
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                aria-invalid={Boolean(errors.email)}
                className={inputClass}
              />
            </Field>

            <Field id={phoneId} label="Phone Number">
              <input
                id={phoneId}
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium text-ink">
              What can we help you with?{" "}
              <span aria-hidden className="text-gold">
                *
              </span>
            </legend>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {HELP_TOPICS.map((topic) => {
                const checked = form.helpTopic === topic;
                return (
                  <label
                    key={topic}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-3 text-sm transition-colors duration-150 ${
                      checked
                        ? "border-gold bg-gold/10 text-ink"
                        : "border-line text-slate hover:border-ink/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="helpTopic"
                      value={topic}
                      checked={checked}
                      onChange={() => updateField("helpTopic", topic)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden
                      className={`h-3.5 w-3.5 shrink-0 rounded-full border ${
                        checked ? "border-gold bg-gold" : "border-line"
                      }`}
                    />
                    {topic}
                  </label>
                );
              })}
            </div>
            {errors.helpTopic ? (
              <p role="alert" className="text-xs text-terracotta">
                {errors.helpTopic}
              </p>
            ) : null}
          </fieldset>

          <Field
            id={messageId}
            label="Tell us about the problem or project"
            required
            error={errors.message}
          >
            <textarea
              id={messageId}
              rows={5}
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              aria-invalid={Boolean(errors.message)}
              placeholder="Tell us what you're currently doing, what isn't working well, and what you'd like to improve."
              className={`${inputClass} resize-y`}
            />
          </Field>

          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium text-ink">
              Preferred way to contact me
            </legend>
            <div className="flex flex-wrap gap-2.5">
              {PREFERRED_CONTACT_OPTIONS.map((option) => {
                const checked = form.preferredContact === option;
                return (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-150 ${
                      checked
                        ? "border-gold bg-gold/10 text-ink"
                        : "border-line text-slate hover:border-ink/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="preferredContact"
                      value={option}
                      checked={checked}
                      onChange={() => updateField("preferredContact", option)}
                      className="sr-only"
                    />
                    {option}
                  </label>
                );
              })}
            </div>
          </fieldset>

          {status === "error" && statusMessage ? (
            <p role="alert" className="text-sm text-terracotta">
              {statusMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === "submitting"}
            className={getButtonClassName({
              className: "w-full disabled:pointer-events-none disabled:opacity-60",
            })}
          >
            {status === "submitting" ? "Sending…" : "Send My Inquiry"}
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </button>
        </form>
      </Container>
    </section>
  );
}

const inputClass =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-slate/50 transition-colors duration-150 focus:border-gold focus:outline-none";

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}{" "}
        {required ? (
          <span aria-hidden className="text-gold">
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-xs text-terracotta">
          {error}
        </p>
      ) : null}
    </div>
  );
}
