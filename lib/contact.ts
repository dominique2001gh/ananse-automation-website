/**
 * Client-safe contact form types + submission call. No secrets live here --
 * this just POSTs to `/api/contact` (see `app/api/contact/route.ts`) and
 * relays whatever it says. The actual validation, spam checks and delivery
 * logic live server-side in `lib/contact-validation.ts` and
 * `lib/contact-delivery.ts`.
 */

export type HelpTopic =
  | "Data & Analytics"
  | "AI & Automation"
  | "Website / Digital"
  | "Custom Software"
  | "Business Process Improvement"
  | "AI Customer Service / AI Agent"
  | "Not Sure Yet";

export type PreferredContact = "Email" | "Phone" | "Either";

export type ContactInquiry = {
  fullName: string;
  organization: string;
  email: string;
  phone: string;
  helpTopic: HelpTopic;
  message: string;
  preferredContact: PreferredContact | null;
};

export type ContactFieldErrors = Partial<
  Record<"fullName" | "email" | "helpTopic" | "message", string>
>;

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: ContactFieldErrors };

export type ContactSubmission = ContactInquiry & {
  /** Honeypot field. Must stay empty -- a bot filling it in is how the
   * server recognizes non-human submissions. */
  honeypot: string;
  /** `Date.now()` captured when the form first rendered, used server-side
   * as a minimum-fill-time spam heuristic. */
  startedAt: number;
};

export async function submitContactInquiry(
  submission: ContactSubmission
): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });
    const data = await res.json().catch(() => null);

    if (res.ok && data?.ok) return { ok: true };

    return {
      ok: false,
      error: typeof data?.error === "string" ? data.error : "unknown_error",
      fieldErrors: data?.fieldErrors,
    };
  } catch {
    return { ok: false, error: "network_error" };
  }
}
