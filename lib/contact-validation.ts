import type { ContactInquiry, HelpTopic, PreferredContact } from "./contact";

export const HELP_TOPICS: HelpTopic[] = [
  "Data & Analytics",
  "AI & Automation",
  "Website / Digital",
  "Custom Software",
  "Business Process Improvement",
  "AI Customer Service / AI Agent",
  "Not Sure Yet",
];

export const PREFERRED_CONTACT_OPTIONS: PreferredContact[] = [
  "Email",
  "Phone",
  "Either",
];

export type ContactFieldErrors = Partial<
  Record<"fullName" | "email" | "helpTopic" | "message", string>
>;

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Pure, dependency-free validation shared by the client form (for instant
 * feedback) and the server route handler (the actual source of truth --
 * never trust client-side validation alone). Safe to import from either.
 */
export function validateContactInquiry(
  input: Record<string, unknown>
): { valid: true; data: ContactInquiry } | { valid: false; errors: ContactFieldErrors } {
  const errors: ContactFieldErrors = {};

  const fullName = typeof input.fullName === "string" ? input.fullName.trim() : "";
  const organization =
    typeof input.organization === "string" ? input.organization.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  const helpTopicRaw = typeof input.helpTopic === "string" ? input.helpTopic : "";
  const message = typeof input.message === "string" ? input.message.trim() : "";
  const preferredContactRaw =
    typeof input.preferredContact === "string" ? input.preferredContact : null;

  if (!fullName) {
    errors.fullName = "Please share your name.";
  } else if (fullName.length > 200) {
    errors.fullName = "That name looks too long.";
  }

  if (!email) {
    errors.email = "Please share an email address.";
  } else if (!isValidEmail(email) || email.length > 320) {
    errors.email = "That email address doesn’t look right.";
  }

  const helpTopic = HELP_TOPICS.includes(helpTopicRaw as HelpTopic)
    ? (helpTopicRaw as HelpTopic)
    : null;
  if (!helpTopic) {
    errors.helpTopic = "Please choose the area closest to your need.";
  }

  if (!message) {
    errors.message = "Tell us a little about the problem or project.";
  } else if (message.length > 5000) {
    errors.message = "That message is a bit long — please shorten it.";
  }

  if (Object.keys(errors).length > 0 || !helpTopic) {
    return { valid: false, errors };
  }

  const preferredContact = PREFERRED_CONTACT_OPTIONS.includes(
    preferredContactRaw as PreferredContact
  )
    ? (preferredContactRaw as PreferredContact)
    : null;

  return {
    valid: true,
    data: { fullName, organization, email, phone, helpTopic, message, preferredContact },
  };
}
