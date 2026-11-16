/**
 * Client-safe types + submission call for Zimela Wellness Center's
 * dedicated Project Discovery Questionnaire.
 *
 * A third, fully isolated copy of the Dash Postal / Tax Office Texas
 * pattern (lib/questionnaire-dash-postal.ts, lib/questionnaire-tax-office-
 * texas.ts) for a different prospect at a different URL -- the question
 * set doesn't fit the generic questionnaire's shape, so this is its own
 * module rather than an extension of it. lib/questionnaire.ts, lib/
 * questionnaire-dash-postal.ts, lib/questionnaire-tax-office-texas.ts, and
 * every existing page/route are completely unaffected by anything here.
 *
 * Posts to a dedicated route (/api/project-questionnaire/zimela-wellness,
 * see app/api/project-questionnaire/zimela-wellness/route.ts).
 *
 * Healthcare scope boundary: this module intentionally has no field for
 * patient names, diagnoses, medical records, or any other protected
 * health information (PHI). Every question here is about the practice's
 * business, website, and operational/administrative needs -- never about
 * an individual patient. See the Hero and the Security & Compliance step
 * for the explicit disclaimer shown to the respondent.
 */

export type ServiceOffered =
  | "Primary care"
  | "Women's health"
  | "Chronic disease management"
  | "Preventive/wellness visits"
  | "Telehealth visits"
  | "Other";

export const SERVICE_OFFERED_OPTIONS: ServiceOffered[] = [
  "Primary care",
  "Women's health",
  "Chronic disease management",
  "Preventive/wellness visits",
  "Telehealth visits",
  "Other",
];

export type PatientPopulation = "Adults" | "Families" | "Seniors" | "Other";

export const PATIENT_POPULATION_OPTIONS: PatientPopulation[] = [
  "Adults",
  "Families",
  "Seniors",
  "Other",
];

export type ZimelaWebsiteGoal =
  | "Attract new patients"
  | "Explain services clearly"
  | "Enable online booking"
  | "Build trust/credibility"
  | "Improve Google visibility"
  | "Mobile-friendly"
  | "Other";

export const ZIMELA_WEBSITE_GOAL_OPTIONS: ZimelaWebsiteGoal[] = [
  "Attract new patients",
  "Explain services clearly",
  "Enable online booking",
  "Build trust/credibility",
  "Improve Google visibility",
  "Mobile-friendly",
  "Other",
];

export type BookingMethod = "Phone" | "Online scheduler" | "Walk-in" | "Through your EHR/portal" | "Other";
export const BOOKING_METHOD_OPTIONS: BookingMethod[] = [
  "Phone",
  "Online scheduler",
  "Walk-in",
  "Through your EHR/portal",
  "Other",
];

export type DesiredBookingFeature =
  | "Online self-scheduling"
  | "Appointment reminders"
  | "Waitlist"
  | "New-patient intake request form"
  | "Other";

export const DESIRED_BOOKING_FEATURE_OPTIONS: DesiredBookingFeature[] = [
  "Online self-scheduling",
  "Appointment reminders",
  "Waitlist",
  "New-patient intake request form",
  "Other",
];

export type YesNoNotSure = "Yes" | "No" | "Not sure";
export const YES_NO_NOT_SURE_OPTIONS: YesNoNotSure[] = ["Yes", "No", "Not sure"];

export type GeneralInquiryContactMethod = "Phone" | "Email" | "Contact form" | "Other";
export const GENERAL_INQUIRY_CONTACT_METHOD_OPTIONS: GeneralInquiryContactMethod[] = [
  "Phone",
  "Email",
  "Contact form",
  "Other",
];

export type DesiredCrmFeature =
  | "Inquiry/lead tracking"
  | "Appointment reminders"
  | "Task management"
  | "Business document storage"
  | "Reporting"
  | "Other";

export const DESIRED_CRM_FEATURE_OPTIONS: DesiredCrmFeature[] = [
  "Inquiry/lead tracking",
  "Appointment reminders",
  "Task management",
  "Business document storage",
  "Reporting",
  "Other",
];

export type StaffAccessRole = "Front desk" | "Office manager" | "Billing" | "Clinician" | "Other";
export const STAFF_ACCESS_ROLE_OPTIONS: StaffAccessRole[] = [
  "Front desk",
  "Office manager",
  "Billing",
  "Clinician",
  "Other",
];

export type ZimelaAutomationInterest =
  | "Appointment reminders"
  | "Follow-up emails"
  | "Review requests"
  | "Front-office task routing"
  | "Other";

export const ZIMELA_AUTOMATION_INTEREST_OPTIONS: ZimelaAutomationInterest[] = [
  "Appointment reminders",
  "Follow-up emails",
  "Review requests",
  "Front-office task routing",
  "Other",
];

export type ReportingInterest =
  | "Appointment volume trends"
  | "No-show rates"
  | "Revenue overview"
  | "Marketing source tracking"
  | "Other";

export const REPORTING_INTEREST_OPTIONS: ReportingInterest[] = [
  "Appointment volume trends",
  "No-show rates",
  "Revenue overview",
  "Marketing source tracking",
  "Other",
];

export type ZimelaLaunchTimeframe = "As soon as possible" | "2–4 weeks" | "1–2 months" | "Flexible";
export const ZIMELA_LAUNCH_TIMEFRAME_OPTIONS: ZimelaLaunchTimeframe[] = [
  "As soon as possible",
  "2–4 weeks",
  "1–2 months",
  "Flexible",
];

/** Distinct from lib/questionnaire.ts's QuestionnaireContactMethod -- kept
 * local so this module never needs to import from the generic one. */
export type ZimelaContactMethod = "Phone" | "Email" | "Text";
export const ZIMELA_CONTACT_METHOD_OPTIONS: ZimelaContactMethod[] = ["Phone", "Email", "Text"];

/** Fixed for this dedicated link -- see
 * components/sections/questionnaire/zimela-wellness/ZimelaWellnessQuestionnaireWizard.tsx. */
export const ZIMELA_WELLNESS_BUSINESS_NAME = "Zimela Wellness Center, LLC";

/** Shown read-only in the Website & Online Presence step -- this is the
 * prospect's actual existing site, not something the respondent can edit. */
export const ZIMELA_WELLNESS_CURRENT_WEBSITE_URL = "https://zimelawellness.com/";

export type ZimelaWellnessQuestionnaireDraft = {
  businessName: string;

  // Step 1 -- Practice Overview
  practiceLocations: string;
  servicesOffered: ServiceOffered[];
  servicesOfferedOtherText: string;
  patientPopulation: PatientPopulation[];
  patientPopulationOtherText: string;

  // Step 2 -- Website & Online Presence
  currentWebsiteUrl: string;
  currentWebsiteLikes: string;
  currentWebsiteDislikes: string;
  websiteGoals: ZimelaWebsiteGoal[];
  websiteGoalsOtherText: string;
  designPreferences: string;

  // Step 3 -- Booking & Patient Communication
  currentBookingMethod: BookingMethod | "";
  desiredBookingFeatures: DesiredBookingFeature[];
  desiredBookingFeaturesOtherText: string;
  telehealthOffered: YesNoNotSure | "";
  telehealthPlatform: string;
  hasPatientPortal: YesNoNotSure | "";
  patientPortalNotes: string;
  generalInquiryContactMethod: GeneralInquiryContactMethod | "";

  // Step 4 -- Systems, CRM & Staff Access
  currentEhrSystem: string;
  currentCrmOrScheduling: string;
  desiredIntegrations: string;
  crmInterest: YesNoNotSure | "";
  desiredCrmFeatures: DesiredCrmFeature[];
  desiredCrmFeaturesOtherText: string;
  staffAccessRoles: StaffAccessRole[];
  staffAccessRolesOtherText: string;

  // Step 5 -- AI Assistant & Automation
  aiChatInterest: YesNoNotSure | "";
  aiVoiceInterest: YesNoNotSure | "";
  automationInterests: ZimelaAutomationInterest[];
  automationInterestsOtherText: string;
  reportingInterests: ReportingInterest[];
  reportingInterestsOtherText: string;

  // Step 6 -- Security & Compliance
  hipaaPoliciesInPlace: YesNoNotSure | "";
  approvedVendors: string;
  requiredSecurityStandards: string;
  dataHandlingExpectations: string;

  // Step 7 -- Priorities & Timeline
  launchTimeframe: ZimelaLaunchTimeframe | "";
  topPriorities: string;
  budgetRange: string;
  anythingElse: string;

  // Step 8 -- Contact & Review
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  preferredContactMethod: ZimelaContactMethod | "";
};

/** Fresh, independent draft object -- never a shared mutable reference. */
export function createEmptyZimelaWellnessDraft(): ZimelaWellnessQuestionnaireDraft {
  return {
    businessName: ZIMELA_WELLNESS_BUSINESS_NAME,

    practiceLocations: "",
    servicesOffered: [],
    servicesOfferedOtherText: "",
    patientPopulation: [],
    patientPopulationOtherText: "",

    currentWebsiteUrl: ZIMELA_WELLNESS_CURRENT_WEBSITE_URL,
    currentWebsiteLikes: "",
    currentWebsiteDislikes: "",
    websiteGoals: [],
    websiteGoalsOtherText: "",
    designPreferences: "",

    currentBookingMethod: "",
    desiredBookingFeatures: [],
    desiredBookingFeaturesOtherText: "",
    telehealthOffered: "",
    telehealthPlatform: "",
    hasPatientPortal: "",
    patientPortalNotes: "",
    generalInquiryContactMethod: "",

    currentEhrSystem: "",
    currentCrmOrScheduling: "",
    desiredIntegrations: "",
    crmInterest: "",
    desiredCrmFeatures: [],
    desiredCrmFeaturesOtherText: "",
    staffAccessRoles: [],
    staffAccessRolesOtherText: "",

    aiChatInterest: "",
    aiVoiceInterest: "",
    automationInterests: [],
    automationInterestsOtherText: "",
    reportingInterests: [],
    reportingInterestsOtherText: "",

    hipaaPoliciesInPlace: "",
    approvedVendors: "",
    requiredSecurityStandards: "",
    dataHandlingExpectations: "",

    launchTimeframe: "",
    topPriorities: "",
    budgetRange: "",
    anythingElse: "",

    contactName: "",
    contactEmail: "",
    contactPhone: "",
    preferredContactMethod: "",
  };
}

export type ZimelaWellnessFieldErrors = Partial<Record<"contactName" | "contactEmail", string>>;

export type ZimelaWellnessQuestionnaireSubmission = ZimelaWellnessQuestionnaireDraft & {
  /** Honeypot field. Must stay empty -- a bot filling it in is how the
   * server recognizes non-human submissions. */
  honeypot: string;
  /** `Date.now()` captured when the questionnaire first rendered, used
   * server-side as a minimum-fill-time spam heuristic. */
  startedAt: number;
  /** Stable id generated once per wizard session (see
   * ZimelaWellnessQuestionnaireWizard.tsx), unchanged across Back/Next and
   * across a retry after a failed submit -- only regenerated when
   * starting a new questionnaire. Lets the server recognize a
   * double-click or a browser/network retry of the exact same submission
   * and avoid writing a duplicate lead or sending a duplicate email. See
   * app/api/project-questionnaire/zimela-wellness/route.ts and
   * lib/questionnaire-zimela-wellness-outcome.ts. */
  submissionId: string;
};

export type ZimelaWellnessQuestionnaireSubmitResult =
  | { ok: true; crmSaved: boolean }
  | { ok: false; error: string; fieldErrors?: ZimelaWellnessFieldErrors; retryable?: boolean };

export async function submitZimelaWellnessQuestionnaire(
  submission: ZimelaWellnessQuestionnaireSubmission
): Promise<ZimelaWellnessQuestionnaireSubmitResult> {
  try {
    const res = await fetch("/api/project-questionnaire/zimela-wellness", {
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
