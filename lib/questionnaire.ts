/**
 * Client-safe Client Discovery Questionnaire types + submission call.
 *
 * Mirrors the pattern in lib/contact.ts: no secrets live here, this just
 * POSTs to /api/project-questionnaire (see app/api/project-questionnaire/
 * route.ts) and relays whatever it says. Validation, spam checks and
 * delivery logic live server-side in lib/questionnaire-validation.ts and
 * lib/questionnaire-delivery.ts.
 *
 * This is a separate data model from the main contact form (lib/contact.ts)
 * on purpose -- the questionnaire captures far more structured detail than
 * a single "help topic" + message, and reuses none of the contact form's
 * types so neither can accidentally drift the other.
 */

export type BusinessSize =
  | "Just me"
  | "2–10 people"
  | "11–50 people"
  | "51–200 people"
  | "200+ people";

export const BUSINESS_SIZE_OPTIONS: BusinessSize[] = [
  "Just me",
  "2–10 people",
  "11–50 people",
  "51–200 people",
  "200+ people",
];

export type ServiceInterest =
  | "New website"
  | "Website redesign"
  | "CRM / customer management"
  | "Business management system"
  | "Data analytics / dashboard"
  | "Business automation"
  | "AI chat agent"
  | "AI voice agent"
  | "Custom software/application"
  | "SaaS platform"
  | "Not sure — I need guidance"
  | "Other";

export const SERVICE_INTEREST_OPTIONS: ServiceInterest[] = [
  "New website",
  "Website redesign",
  "CRM / customer management",
  "Business management system",
  "Data analytics / dashboard",
  "Business automation",
  "AI chat agent",
  "AI voice agent",
  "Custom software/application",
  "SaaS platform",
  "Not sure — I need guidance",
  "Other",
];

export type ProjectTimeframe =
  | "As soon as possible"
  | "Within 1 month"
  | "1–3 months"
  | "3–6 months"
  | "Flexible / exploring options";

export const PROJECT_TIMEFRAME_OPTIONS: ProjectTimeframe[] = [
  "As soon as possible",
  "Within 1 month",
  "1–3 months",
  "3–6 months",
  "Flexible / exploring options",
];

export type HasWebsite = "Yes" | "No";
export const HAS_WEBSITE_OPTIONS: HasWebsite[] = ["Yes", "No"];

export type WebsiteGoal =
  | "Learn about the business"
  | "View services"
  | "Request a quote"
  | "Contact the business"
  | "Book appointments"
  | "Make payments"
  | "Purchase products/services"
  | "Create/login to an account"
  | "Track an order/service/request"
  | "Upload documents"
  | "Chat with AI"
  | "Other";

export const WEBSITE_GOAL_OPTIONS: WebsiteGoal[] = [
  "Learn about the business",
  "View services",
  "Request a quote",
  "Contact the business",
  "Book appointments",
  "Make payments",
  "Purchase products/services",
  "Create/login to an account",
  "Track an order/service/request",
  "Upload documents",
  "Chat with AI",
  "Other",
];

export type WebsiteAsset =
  | "Logo"
  | "Brand colors"
  | "Photos"
  | "Videos"
  | "Written website content"
  | "Domain name";

export const WEBSITE_ASSET_OPTIONS: WebsiteAsset[] = [
  "Logo",
  "Brand colors",
  "Photos",
  "Videos",
  "Written website content",
  "Domain name",
];

export type StaffAccessLevels = "Yes" | "No" | "Not sure";
export const STAFF_ACCESS_OPTIONS: StaffAccessLevels[] = ["Yes", "No", "Not sure"];

export type CrmFeature =
  | "Customer profiles"
  | "Lead pipeline"
  | "Appointment management"
  | "Task management"
  | "Staff assignments"
  | "Notes/history"
  | "Document storage"
  | "Estimates/quotes"
  | "Invoices/payments"
  | "Customer portal"
  | "Notifications/reminders"
  | "Search/filtering"
  | "Reporting"
  | "Other";

export const CRM_FEATURE_OPTIONS: CrmFeature[] = [
  "Customer profiles",
  "Lead pipeline",
  "Appointment management",
  "Task management",
  "Staff assignments",
  "Notes/history",
  "Document storage",
  "Estimates/quotes",
  "Invoices/payments",
  "Customer portal",
  "Notifications/reminders",
  "Search/filtering",
  "Reporting",
  "Other",
];

export type AnalyticsInterest =
  | "Revenue"
  | "Sales"
  | "Leads"
  | "Conversion rate"
  | "Customers"
  | "New vs returning customers"
  | "Appointments/bookings"
  | "Services/products"
  | "Staff performance"
  | "Location performance"
  | "Marketing sources"
  | "Outstanding payments"
  | "Operational performance"
  | "Trends over time"
  | "Custom KPIs"
  | "Other";

export const ANALYTICS_INTEREST_OPTIONS: AnalyticsInterest[] = [
  "Revenue",
  "Sales",
  "Leads",
  "Conversion rate",
  "Customers",
  "New vs returning customers",
  "Appointments/bookings",
  "Services/products",
  "Staff performance",
  "Location performance",
  "Marketing sources",
  "Outstanding payments",
  "Operational performance",
  "Trends over time",
  "Custom KPIs",
  "Other",
];

export type DataSource =
  | "Excel/spreadsheets"
  | "CRM"
  | "Accounting software"
  | "POS"
  | "Website"
  | "Database"
  | "Multiple systems"
  | "Not sure";

export const DATA_SOURCE_OPTIONS: DataSource[] = [
  "Excel/spreadsheets",
  "CRM",
  "Accounting software",
  "POS",
  "Website",
  "Database",
  "Multiple systems",
  "Not sure",
];

export type ReportFrequency =
  | "Daily"
  | "Weekly"
  | "Monthly"
  | "Quarterly"
  | "On demand / as needed"
  | "Not sure";

export const REPORT_FREQUENCY_OPTIONS: ReportFrequency[] = [
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "On demand / as needed",
  "Not sure",
];

export type RepetitiveTask =
  | "Lead follow-up"
  | "Appointment scheduling"
  | "Appointment reminders"
  | "Customer notifications"
  | "Email responses"
  | "SMS communication"
  | "Data entry"
  | "Invoice/payment reminders"
  | "Report generation"
  | "Document processing"
  | "Staff notifications"
  | "Customer support"
  | "Lead qualification"
  | "Other";

export const REPETITIVE_TASK_OPTIONS: RepetitiveTask[] = [
  "Lead follow-up",
  "Appointment scheduling",
  "Appointment reminders",
  "Customer notifications",
  "Email responses",
  "SMS communication",
  "Data entry",
  "Invoice/payment reminders",
  "Report generation",
  "Document processing",
  "Staff notifications",
  "Customer support",
  "Lead qualification",
  "Other",
];

export type AutomationInterest =
  | "AI chat agent"
  | "AI voice agent"
  | "Workflow automation"
  | "Email automation"
  | "SMS automation"
  | "WhatsApp integration"
  | "Not sure / would like recommendations";

export const AUTOMATION_INTEREST_OPTIONS: AutomationInterest[] = [
  "AI chat agent",
  "AI voice agent",
  "Workflow automation",
  "Email automation",
  "SMS automation",
  "WhatsApp integration",
  "Not sure / would like recommendations",
];

/** Distinct from lib/contact.ts's PreferredContact ("Email"|"Phone"|"Either")
 * -- the questionnaire's Step 8 asks a different, more granular question. */
export type QuestionnaireContactMethod = "Phone" | "Email" | "Text" | "WhatsApp";

export const QUESTIONNAIRE_CONTACT_METHOD_OPTIONS: QuestionnaireContactMethod[] = [
  "Phone",
  "Email",
  "Text",
  "WhatsApp",
];

export type QuestionnaireDraft = {
  // Step 1 -- About Your Business
  businessName: string;
  industry: string;
  businessDescription: string;
  businessLocation: string;
  businessSize: BusinessSize | "";
  typicalCustomers: string;
  businessGoals: string;
  currentChallenges: string;

  // Step 2 -- Your Project
  servicesNeeded: ServiceInterest[];
  servicesNeededOtherText: string;
  primaryProblem: string;
  successDefinition: string;
  timeframe: ProjectTimeframe | "";

  // Step 3 -- Website
  hasWebsite: HasWebsite | "";
  currentWebsiteUrl: string;
  currentWebsiteLikes: string;
  currentWebsiteDislikes: string;
  websiteGoals: WebsiteGoal[];
  websiteGoalsOtherText: string;
  websiteAssets: WebsiteAsset[];
  designPreferences: string;

  // Step 4 -- CRM & Business Operations
  currentManagementDescription: string;
  customerInfoNeeded: string;
  stagesStatuses: string;
  staffAccessLevels: StaffAccessLevels | "";
  crmFeatures: CrmFeature[];
  crmFeaturesOtherText: string;

  // Step 5 -- Analytics & Reporting
  analyticsInterests: AnalyticsInterest[];
  analyticsInterestsOtherText: string;
  dataSources: DataSource[];
  reportAccess: string;
  reportFrequency: ReportFrequency | "";
  analyticsDecisions: string;

  // Step 6 -- Automation & AI
  repetitiveTasks: RepetitiveTask[];
  repetitiveTasksOtherText: string;
  automationInterests: AutomationInterest[];
  manualProcessDescription: string;

  // Step 7 -- Additional Requirements
  additionalDetails: string;
  likedExamples: string;
  integrationRequirements: string;
  dislikedThings: string;

  // Step 8 -- Contact & Review
  contactName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
  preferredContactMethod: QuestionnaireContactMethod | "";
  bestTimeToContact: string;
};

/** Fresh, independent draft object -- never a shared mutable reference. */
export function createEmptyDraft(): QuestionnaireDraft {
  return {
    businessName: "",
    industry: "",
    businessDescription: "",
    businessLocation: "",
    businessSize: "",
    typicalCustomers: "",
    businessGoals: "",
    currentChallenges: "",

    servicesNeeded: [],
    servicesNeededOtherText: "",
    primaryProblem: "",
    successDefinition: "",
    timeframe: "",

    hasWebsite: "",
    currentWebsiteUrl: "",
    currentWebsiteLikes: "",
    currentWebsiteDislikes: "",
    websiteGoals: [],
    websiteGoalsOtherText: "",
    websiteAssets: [],
    designPreferences: "",

    currentManagementDescription: "",
    customerInfoNeeded: "",
    stagesStatuses: "",
    staffAccessLevels: "",
    crmFeatures: [],
    crmFeaturesOtherText: "",

    analyticsInterests: [],
    analyticsInterestsOtherText: "",
    dataSources: [],
    reportAccess: "",
    reportFrequency: "",
    analyticsDecisions: "",

    repetitiveTasks: [],
    repetitiveTasksOtherText: "",
    automationInterests: [],
    manualProcessDescription: "",

    additionalDetails: "",
    likedExamples: "",
    integrationRequirements: "",
    dislikedThings: "",

    contactName: "",
    contactRole: "",
    contactEmail: "",
    contactPhone: "",
    preferredContactMethod: "",
    bestTimeToContact: "",
  };
}

export type QuestionnaireFieldErrors = Partial<
  Record<"businessName" | "servicesNeeded" | "contactName" | "contactEmail", string>
>;

export type QuestionnaireSubmission = QuestionnaireDraft & {
  /** Honeypot field. Must stay empty -- a bot filling it in is how the
   * server recognizes non-human submissions. */
  honeypot: string;
  /** `Date.now()` captured when the questionnaire first rendered, used
   * server-side as a minimum-fill-time spam heuristic. */
  startedAt: number;
};

export type QuestionnaireSubmitResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: QuestionnaireFieldErrors };

export async function submitQuestionnaire(
  submission: QuestionnaireSubmission
): Promise<QuestionnaireSubmitResult> {
  try {
    const res = await fetch("/api/project-questionnaire", {
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
