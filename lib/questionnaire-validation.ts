import {
  createEmptyDraft,
  BUSINESS_SIZE_OPTIONS,
  SERVICE_INTEREST_OPTIONS,
  PROJECT_TIMEFRAME_OPTIONS,
  HAS_WEBSITE_OPTIONS,
  WEBSITE_GOAL_OPTIONS,
  WEBSITE_ASSET_OPTIONS,
  STAFF_ACCESS_OPTIONS,
  CRM_FEATURE_OPTIONS,
  ANALYTICS_INTEREST_OPTIONS,
  DATA_SOURCE_OPTIONS,
  REPORT_FREQUENCY_OPTIONS,
  REPETITIVE_TASK_OPTIONS,
  AUTOMATION_INTEREST_OPTIONS,
  QUESTIONNAIRE_CONTACT_METHOD_OPTIONS,
  type QuestionnaireDraft,
  type QuestionnaireFieldErrors,
} from "./questionnaire";

/**
 * Pure, dependency-free validation for the Client Discovery Questionnaire --
 * same shared-source-of-truth pattern as lib/contact-validation.ts. Safe to
 * import from either the client (for instant feedback) or the server route
 * handler (app/api/project-questionnaire/route.ts), which is the actual
 * source of truth and never trusts client-side validation alone.
 *
 * Deliberately light on required fields per the product brief: only the
 * business name, at least one requested service, and the contact name/email
 * are required. Everything else is optional free text or a multi-select,
 * so a prospect is never blocked by an irrelevant question.
 */

const SHORT_MAX = 300;
const MEDIUM_MAX = 2000;
const LONG_MAX = 6000;
const MAX_SELECTIONS = 20;

function str(input: unknown, maxLen: number): string {
  return typeof input === "string" ? input.trim().slice(0, maxLen) : "";
}

function oneOf<T extends string>(input: unknown, options: readonly T[]): T | "" {
  return typeof input === "string" && (options as readonly string[]).includes(input)
    ? (input as T)
    : "";
}

function manyOf<T extends string>(input: unknown, options: readonly T[]): T[] {
  if (!Array.isArray(input)) return [];
  const allowed = new Set<string>(options);
  const seen = new Set<T>();
  for (const item of input) {
    if (typeof item === "string" && allowed.has(item)) seen.add(item as T);
    if (seen.size >= MAX_SELECTIONS) break;
  }
  return [...seen];
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateQuestionnaire(
  input: Record<string, unknown>
): { valid: true; data: QuestionnaireDraft } | { valid: false; errors: QuestionnaireFieldErrors } {
  const errors: QuestionnaireFieldErrors = {};
  const empty = createEmptyDraft();

  const data: QuestionnaireDraft = {
    ...empty,

    businessName: str(input.businessName, SHORT_MAX),
    industry: str(input.industry, SHORT_MAX),
    businessDescription: str(input.businessDescription, LONG_MAX),
    businessLocation: str(input.businessLocation, SHORT_MAX),
    businessSize: oneOf(input.businessSize, BUSINESS_SIZE_OPTIONS),
    typicalCustomers: str(input.typicalCustomers, MEDIUM_MAX),
    businessGoals: str(input.businessGoals, MEDIUM_MAX),
    currentChallenges: str(input.currentChallenges, MEDIUM_MAX),

    servicesNeeded: manyOf(input.servicesNeeded, SERVICE_INTEREST_OPTIONS),
    servicesNeededOtherText: str(input.servicesNeededOtherText, SHORT_MAX),
    primaryProblem: str(input.primaryProblem, MEDIUM_MAX),
    successDefinition: str(input.successDefinition, MEDIUM_MAX),
    timeframe: oneOf(input.timeframe, PROJECT_TIMEFRAME_OPTIONS),

    hasWebsite: oneOf(input.hasWebsite, HAS_WEBSITE_OPTIONS),
    currentWebsiteUrl: str(input.currentWebsiteUrl, SHORT_MAX),
    currentWebsiteLikes: str(input.currentWebsiteLikes, MEDIUM_MAX),
    currentWebsiteDislikes: str(input.currentWebsiteDislikes, MEDIUM_MAX),
    websiteGoals: manyOf(input.websiteGoals, WEBSITE_GOAL_OPTIONS),
    websiteGoalsOtherText: str(input.websiteGoalsOtherText, SHORT_MAX),
    websiteAssets: manyOf(input.websiteAssets, WEBSITE_ASSET_OPTIONS),
    designPreferences: str(input.designPreferences, MEDIUM_MAX),

    currentManagementDescription: str(input.currentManagementDescription, LONG_MAX),
    customerInfoNeeded: str(input.customerInfoNeeded, MEDIUM_MAX),
    stagesStatuses: str(input.stagesStatuses, MEDIUM_MAX),
    staffAccessLevels: oneOf(input.staffAccessLevels, STAFF_ACCESS_OPTIONS),
    crmFeatures: manyOf(input.crmFeatures, CRM_FEATURE_OPTIONS),
    crmFeaturesOtherText: str(input.crmFeaturesOtherText, SHORT_MAX),

    analyticsInterests: manyOf(input.analyticsInterests, ANALYTICS_INTEREST_OPTIONS),
    analyticsInterestsOtherText: str(input.analyticsInterestsOtherText, SHORT_MAX),
    dataSources: manyOf(input.dataSources, DATA_SOURCE_OPTIONS),
    reportAccess: str(input.reportAccess, MEDIUM_MAX),
    reportFrequency: oneOf(input.reportFrequency, REPORT_FREQUENCY_OPTIONS),
    analyticsDecisions: str(input.analyticsDecisions, MEDIUM_MAX),

    repetitiveTasks: manyOf(input.repetitiveTasks, REPETITIVE_TASK_OPTIONS),
    repetitiveTasksOtherText: str(input.repetitiveTasksOtherText, SHORT_MAX),
    automationInterests: manyOf(input.automationInterests, AUTOMATION_INTEREST_OPTIONS),
    manualProcessDescription: str(input.manualProcessDescription, MEDIUM_MAX),

    additionalDetails: str(input.additionalDetails, LONG_MAX),
    likedExamples: str(input.likedExamples, MEDIUM_MAX),
    integrationRequirements: str(input.integrationRequirements, MEDIUM_MAX),
    dislikedThings: str(input.dislikedThings, MEDIUM_MAX),

    contactName: str(input.contactName, SHORT_MAX),
    contactRole: str(input.contactRole, SHORT_MAX),
    contactEmail: str(input.contactEmail, 320),
    contactPhone: str(input.contactPhone, SHORT_MAX),
    preferredContactMethod: oneOf(input.preferredContactMethod, QUESTIONNAIRE_CONTACT_METHOD_OPTIONS),
    bestTimeToContact: str(input.bestTimeToContact, SHORT_MAX),
  };

  if (!data.businessName) {
    errors.businessName = "Please share your business or organization name.";
  }

  if (data.servicesNeeded.length === 0) {
    errors.servicesNeeded = "Please select at least one area you'd like help with.";
  }

  if (!data.contactName) {
    errors.contactName = "Please share a contact name.";
  }

  if (!data.contactEmail) {
    errors.contactEmail = "Please share an email address.";
  } else if (!isValidEmail(data.contactEmail)) {
    errors.contactEmail = "That email address doesn’t look right.";
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data };
}
