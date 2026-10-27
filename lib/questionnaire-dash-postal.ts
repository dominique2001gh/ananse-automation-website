/**
 * Client-safe types + submission call for Dash Postal and Tax Services'
 * dedicated Project Discovery Questionnaire.
 *
 * This is a deliberately separate, self-contained data model from
 * lib/questionnaire.ts (the generic questionnaire shared with the Xmine
 * Consult dedicated page). That generic type asks what digital services a
 * prospect wants from Ananse (website/CRM/analytics/automation) -- the
 * right shape for most prospects. Dash Postal's brief instead asks about
 * the postal/tax business itself (services currently offered, customer
 * types, branding assets, postal-specific automations), which has no
 * clean mapping onto the generic fields. Bolting ~15 one-off,
 * industry-specific fields onto that shared type would permanently
 * clutter it for every future prospect that reuses it. Keeping this fully
 * separate means lib/questionnaire.ts, its validation/delivery, the
 * generic page, and the Xmine Consult page are completely unaffected by
 * anything here.
 *
 * Posts to a dedicated route (/api/project-questionnaire/dash-postal, see
 * app/api/project-questionnaire/dash-postal/route.ts) rather than the
 * existing /api/project-questionnaire, for the same reason: a different
 * validation shape needs its own route rather than overloading the
 * existing one with a second data contract.
 */

export type CurrentService =
  | "Tax preparation and filing"
  | "Shipping and package services"
  | "Notary services"
  | "Mailbox rental"
  | "Printing/scanning/copying/faxing"
  | "Other";

export const CURRENT_SERVICE_OPTIONS: CurrentService[] = [
  "Tax preparation and filing",
  "Shipping and package services",
  "Notary services",
  "Mailbox rental",
  "Printing/scanning/copying/faxing",
  "Other",
];

export type CustomerType =
  | "Individuals/families"
  | "Small businesses"
  | "Self-employed professionals"
  | "Online sellers"
  | "Other";

export const CUSTOMER_TYPE_OPTIONS: CustomerType[] = [
  "Individuals/families",
  "Small businesses",
  "Self-employed professionals",
  "Online sellers",
  "Other",
];

export type DashWebsiteGoal =
  | "Attract customers"
  | "Improve Google visibility"
  | "Showcase services"
  | "Online appointments"
  | "Answer customer questions"
  | "Generate inquiries"
  | "Other";

export const DASH_WEBSITE_GOAL_OPTIONS: DashWebsiteGoal[] = [
  "Attract customers",
  "Improve Google visibility",
  "Showcase services",
  "Online appointments",
  "Answer customer questions",
  "Generate inquiries",
  "Other",
];

export type HasWebsite = "Yes" | "No";
export const HAS_WEBSITE_OPTIONS: HasWebsite[] = ["Yes", "No"];

export type DesiredWebsiteFeature =
  | "Service pages"
  | "Online appointment scheduling"
  | "Inquiry forms"
  | "AI chatbot"
  | "Testimonials"
  | "Google Maps"
  | "Secure document submission"
  | "Other";

export const DESIRED_WEBSITE_FEATURE_OPTIONS: DesiredWebsiteFeature[] = [
  "Service pages",
  "Online appointment scheduling",
  "Inquiry forms",
  "AI chatbot",
  "Testimonials",
  "Google Maps",
  "Secure document submission",
  "Other",
];

export type BrandAsset =
  | "Logo"
  | "Brand colors"
  | "Photographs"
  | "Business description/write-up"
  | "None of these yet";

export const BRAND_ASSET_OPTIONS: BrandAsset[] = [
  "Logo",
  "Brand colors",
  "Photographs",
  "Business description/write-up",
  "None of these yet",
];

export type DesignStyle =
  | "Modern/professional"
  | "Friendly/welcoming"
  | "Simple/elegant"
  | "Open to recommendations";

export const DESIGN_STYLE_OPTIONS: DesignStyle[] = [
  "Modern/professional",
  "Friendly/welcoming",
  "Simple/elegant",
  "Open to recommendations",
];

export type CustomerContactMethod =
  | "Phone"
  | "Walk-ins"
  | "Email"
  | "Text"
  | "Social media"
  | "Existing booking software"
  | "Other";

export const CUSTOMER_CONTACT_METHOD_OPTIONS: CustomerContactMethod[] = [
  "Phone",
  "Walk-ins",
  "Email",
  "Text",
  "Social media",
  "Existing booking software",
  "Other",
];

export type CrmInterest = "Yes" | "No" | "Not sure";
export const CRM_INTEREST_OPTIONS: CrmInterest[] = ["Yes", "No", "Not sure"];

export type DashAutomationInterest =
  | "Appointment reminders"
  | "Inquiry follow-ups"
  | "Tax-season outreach"
  | "Staff notifications"
  | "Customer service chatbot"
  | "Business analytics"
  | "Other";

export const DASH_AUTOMATION_INTEREST_OPTIONS: DashAutomationInterest[] = [
  "Appointment reminders",
  "Inquiry follow-ups",
  "Tax-season outreach",
  "Staff notifications",
  "Customer service chatbot",
  "Business analytics",
  "Other",
];

export type LaunchTimeframe = "As soon as possible" | "2–4 weeks" | "1–2 months" | "Flexible";
export const LAUNCH_TIMEFRAME_OPTIONS: LaunchTimeframe[] = [
  "As soon as possible",
  "2–4 weeks",
  "1–2 months",
  "Flexible",
];

/** Distinct from lib/questionnaire.ts's QuestionnaireContactMethod -- kept
 * local so this module never needs to import from the generic one. */
export type DashContactMethod = "Phone" | "Email" | "Text";
export const DASH_CONTACT_METHOD_OPTIONS: DashContactMethod[] = ["Phone", "Email", "Text"];

/** Fixed for this dedicated link -- see
 * components/sections/questionnaire/dash-postal/DashPostalQuestionnaireWizard.tsx. */
export const DASH_POSTAL_BUSINESS_NAME = "Dash Postal and Tax Services";

export type DashPostalQuestionnaireDraft = {
  businessName: string;

  // Section 1 -- Business Overview
  currentServices: CurrentService[];
  currentServicesOtherText: string;
  servicesToPromote: string;
  customerTypes: CustomerType[];
  customerTypesOtherText: string;
  differentiators: string;

  // Section 2 -- Website Goals
  websiteGoals: DashWebsiteGoal[];
  websiteGoalsOtherText: string;
  hasWebsite: HasWebsite | "";
  currentWebsiteUrl: string;
  desiredFeatures: DesiredWebsiteFeature[];
  desiredFeaturesOtherText: string;
  designInspiration: string;

  // Section 3 -- Branding and Content
  brandAssets: BrandAsset[];
  designStyle: DesignStyle | "";
  socialMediaProfiles: string;

  // Section 4 -- CRM and Business Automation
  customerContactMethods: CustomerContactMethod[];
  customerContactMethodsOtherText: string;
  currentManagementDescription: string;
  crmInterest: CrmInterest | "";
  automationInterests: DashAutomationInterest[];
  automationInterestsOtherText: string;

  // Section 5 -- Project Priorities
  launchTimeframe: LaunchTimeframe | "";
  topPriorities: string;
  anythingElse: string;

  // Contact & Review
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  preferredContactMethod: DashContactMethod | "";
};

/** Fresh, independent draft object -- never a shared mutable reference. */
export function createEmptyDashPostalDraft(): DashPostalQuestionnaireDraft {
  return {
    businessName: DASH_POSTAL_BUSINESS_NAME,

    currentServices: [],
    currentServicesOtherText: "",
    servicesToPromote: "",
    customerTypes: [],
    customerTypesOtherText: "",
    differentiators: "",

    websiteGoals: [],
    websiteGoalsOtherText: "",
    hasWebsite: "",
    currentWebsiteUrl: "",
    desiredFeatures: [],
    desiredFeaturesOtherText: "",
    designInspiration: "",

    brandAssets: [],
    designStyle: "",
    socialMediaProfiles: "",

    customerContactMethods: [],
    customerContactMethodsOtherText: "",
    currentManagementDescription: "",
    crmInterest: "",
    automationInterests: [],
    automationInterestsOtherText: "",

    launchTimeframe: "",
    topPriorities: "",
    anythingElse: "",

    contactName: "",
    contactEmail: "",
    contactPhone: "",
    preferredContactMethod: "",
  };
}

export type DashPostalFieldErrors = Partial<
  Record<"contactName" | "contactEmail", string>
>;

export type DashPostalQuestionnaireSubmission = DashPostalQuestionnaireDraft & {
  /** Honeypot field. Must stay empty -- a bot filling it in is how the
   * server recognizes non-human submissions. */
  honeypot: string;
  /** `Date.now()` captured when the questionnaire first rendered, used
   * server-side as a minimum-fill-time spam heuristic. */
  startedAt: number;
  /** Stable id generated once per wizard session (see
   * DashPostalQuestionnaireWizard.tsx), unchanged across Back/Next and
   * across a retry after a failed submit -- only regenerated when
   * starting a new questionnaire. Lets the server recognize a
   * double-click or a browser/network retry of the exact same submission
   * and avoid writing a duplicate lead or sending a duplicate email. See
   * app/api/project-questionnaire/dash-postal/route.ts and
   * lib/questionnaire-dash-postal-outcome.ts. */
  submissionId: string;
};

export type DashPostalQuestionnaireSubmitResult =
  | { ok: true; crmSaved: boolean }
  | { ok: false; error: string; fieldErrors?: DashPostalFieldErrors; retryable?: boolean };

export async function submitDashPostalQuestionnaire(
  submission: DashPostalQuestionnaireSubmission
): Promise<DashPostalQuestionnaireSubmitResult> {
  try {
    const res = await fetch("/api/project-questionnaire/dash-postal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });
    const data = await res.json().catch(() => null);

    if (res.ok && data?.ok) return { ok: true, crmSaved: data?.crmSaved !== false };

    return {
      ok: false,
      error: typeof data?.error === "string" ? data.error : "unknown_error",
      fieldErrors: data?.fieldErrors,
      retryable: data?.retryable,
    };
  } catch {
    return { ok: false, error: "network_error", retryable: true };
  }
}
