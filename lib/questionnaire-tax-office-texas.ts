/**
 * Client-safe types + submission call for The Tax Office Texas'
 * dedicated Project Discovery Questionnaire.
 *
 * This is the same question set as Dash Postal and Tax Services'
 * dedicated questionnaire (lib/questionnaire-dash-postal.ts) -- a second,
 * fully isolated copy for a different prospect at a different URL, rather
 * than a shared/parameterized module, mirroring the isolated-module
 * precedent set by Dash Postal relative to the generic questionnaire. See
 * that file for the full rationale on why this doesn't fit the generic
 * questionnaire's data shape. lib/questionnaire.ts, lib/questionnaire-
 * dash-postal.ts, the generic page, Xmine Consult's page, and the Dash
 * Postal page are all completely unaffected by anything here.
 *
 * Posts to a dedicated route (/api/project-questionnaire/the-tax-office-
 * texas, see app/api/project-questionnaire/the-tax-office-texas/route.ts).
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

export type TaxOfficeWebsiteGoal =
  | "Attract customers"
  | "Improve Google visibility"
  | "Showcase services"
  | "Online appointments"
  | "Answer customer questions"
  | "Generate inquiries"
  | "Other";

export const TAX_OFFICE_WEBSITE_GOAL_OPTIONS: TaxOfficeWebsiteGoal[] = [
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

export type TaxOfficeAutomationInterest =
  | "Appointment reminders"
  | "Inquiry follow-ups"
  | "Tax-season outreach"
  | "Staff notifications"
  | "Customer service chatbot"
  | "Business analytics"
  | "Other";

export const TAX_OFFICE_AUTOMATION_INTEREST_OPTIONS: TaxOfficeAutomationInterest[] = [
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
export type TaxOfficeContactMethod = "Phone" | "Email" | "Text";
export const TAX_OFFICE_CONTACT_METHOD_OPTIONS: TaxOfficeContactMethod[] = ["Phone", "Email", "Text"];

/** Fixed for this dedicated link -- see
 * components/sections/questionnaire/tax-office-texas/TaxOfficeTexasQuestionnaireWizard.tsx. */
export const TAX_OFFICE_TEXAS_BUSINESS_NAME = "The Tax Office Texas";

export type TaxOfficeTexasQuestionnaireDraft = {
  businessName: string;

  // Section 1 -- Business Overview
  currentServices: CurrentService[];
  currentServicesOtherText: string;
  servicesToPromote: string;
  customerTypes: CustomerType[];
  customerTypesOtherText: string;
  differentiators: string;

  // Section 2 -- Website Goals
  websiteGoals: TaxOfficeWebsiteGoal[];
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
  automationInterests: TaxOfficeAutomationInterest[];
  automationInterestsOtherText: string;

  // Section 5 -- Project Priorities
  launchTimeframe: LaunchTimeframe | "";
  topPriorities: string;
  anythingElse: string;

  // Contact & Review
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  preferredContactMethod: TaxOfficeContactMethod | "";
};

/** Fresh, independent draft object -- never a shared mutable reference. */
export function createEmptyTaxOfficeTexasDraft(): TaxOfficeTexasQuestionnaireDraft {
  return {
    businessName: TAX_OFFICE_TEXAS_BUSINESS_NAME,

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

export type TaxOfficeTexasFieldErrors = Partial<
  Record<"contactName" | "contactEmail", string>
>;

export type TaxOfficeTexasQuestionnaireSubmission = TaxOfficeTexasQuestionnaireDraft & {
  /** Honeypot field. Must stay empty -- a bot filling it in is how the
   * server recognizes non-human submissions. */
  honeypot: string;
  /** `Date.now()` captured when the questionnaire first rendered, used
   * server-side as a minimum-fill-time spam heuristic. */
  startedAt: number;
  /** Stable id generated once per wizard session (see
   * TaxOfficeTexasQuestionnaireWizard.tsx), unchanged across Back/Next and
   * across a retry after a failed submit -- only regenerated when
   * starting a new questionnaire. Lets the server recognize a
   * double-click or a browser/network retry of the exact same submission
   * and avoid writing a duplicate lead or sending a duplicate email. See
   * app/api/project-questionnaire/the-tax-office-texas/route.ts and
   * lib/questionnaire-tax-office-texas-outcome.ts. */
  submissionId: string;
};

export type TaxOfficeTexasQuestionnaireSubmitResult =
  | { ok: true; crmSaved: boolean }
  | { ok: false; error: string; fieldErrors?: TaxOfficeTexasFieldErrors; retryable?: boolean };

export async function submitTaxOfficeTexasQuestionnaire(
  submission: TaxOfficeTexasQuestionnaireSubmission
): Promise<TaxOfficeTexasQuestionnaireSubmitResult> {
  try {
    const res = await fetch("/api/project-questionnaire/the-tax-office-texas", {
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
