import {
  createEmptyZimelaWellnessDraft,
  ZIMELA_WELLNESS_BUSINESS_NAME,
  ZIMELA_WELLNESS_CURRENT_WEBSITE_URL,
  SERVICE_OFFERED_OPTIONS,
  PATIENT_POPULATION_OPTIONS,
  ZIMELA_WEBSITE_GOAL_OPTIONS,
  BOOKING_METHOD_OPTIONS,
  DESIRED_BOOKING_FEATURE_OPTIONS,
  YES_NO_NOT_SURE_OPTIONS,
  GENERAL_INQUIRY_CONTACT_METHOD_OPTIONS,
  DESIRED_CRM_FEATURE_OPTIONS,
  STAFF_ACCESS_ROLE_OPTIONS,
  ZIMELA_AUTOMATION_INTEREST_OPTIONS,
  REPORTING_INTEREST_OPTIONS,
  ZIMELA_LAUNCH_TIMEFRAME_OPTIONS,
  ZIMELA_CONTACT_METHOD_OPTIONS,
  type ZimelaWellnessQuestionnaireDraft,
  type ZimelaWellnessFieldErrors,
} from "./questionnaire-zimela-wellness";

/**
 * Pure, dependency-free validation for Zimela Wellness Center's
 * questionnaire -- same shared-source-of-truth pattern as
 * lib/questionnaire-tax-office-texas-validation.ts and lib/questionnaire-
 * dash-postal-validation.ts (safe to import from the client for instant
 * feedback or the server route handler, which is the actual source of
 * truth).
 *
 * Only the contact name and email are required, per the same product
 * brief used for the other dedicated questionnaires: every practice
 * question is optional free text or a multi-select, so the contact is
 * never blocked by a question that doesn't apply. The business name and
 * current website are fixed (this is a dedicated, single-prospect link)
 * so neither can ever fail validation or be overridden by client input.
 *
 * Healthcare scope boundary: nothing accepted here is a patient name,
 * diagnosis, medical record, or other protected health information --
 * every field maps to a business/operational question defined in
 * lib/questionnaire-zimela-wellness.ts.
 */

const SHORT_MAX = 300;
const MEDIUM_MAX = 2000;
const LONG_MAX = 4000;
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

export function validateZimelaWellnessQuestionnaire(
  input: Record<string, unknown>
):
  | { valid: true; data: ZimelaWellnessQuestionnaireDraft }
  | { valid: false; errors: ZimelaWellnessFieldErrors } {
  const errors: ZimelaWellnessFieldErrors = {};
  const empty = createEmptyZimelaWellnessDraft();

  const data: ZimelaWellnessQuestionnaireDraft = {
    ...empty,
    // Never trust a client-supplied business name or current website on
    // this dedicated link -- always the fixed values, regardless of what
    // was posted.
    businessName: ZIMELA_WELLNESS_BUSINESS_NAME,
    currentWebsiteUrl: ZIMELA_WELLNESS_CURRENT_WEBSITE_URL,

    practiceLocations: str(input.practiceLocations, MEDIUM_MAX),
    servicesOffered: manyOf(input.servicesOffered, SERVICE_OFFERED_OPTIONS),
    servicesOfferedOtherText: str(input.servicesOfferedOtherText, SHORT_MAX),
    patientPopulation: manyOf(input.patientPopulation, PATIENT_POPULATION_OPTIONS),
    patientPopulationOtherText: str(input.patientPopulationOtherText, SHORT_MAX),

    currentWebsiteLikes: str(input.currentWebsiteLikes, MEDIUM_MAX),
    currentWebsiteDislikes: str(input.currentWebsiteDislikes, MEDIUM_MAX),
    websiteGoals: manyOf(input.websiteGoals, ZIMELA_WEBSITE_GOAL_OPTIONS),
    websiteGoalsOtherText: str(input.websiteGoalsOtherText, SHORT_MAX),
    designPreferences: str(input.designPreferences, MEDIUM_MAX),

    currentBookingMethod: oneOf(input.currentBookingMethod, BOOKING_METHOD_OPTIONS),
    desiredBookingFeatures: manyOf(input.desiredBookingFeatures, DESIRED_BOOKING_FEATURE_OPTIONS),
    desiredBookingFeaturesOtherText: str(input.desiredBookingFeaturesOtherText, SHORT_MAX),
    telehealthOffered: oneOf(input.telehealthOffered, YES_NO_NOT_SURE_OPTIONS),
    telehealthPlatform: str(input.telehealthPlatform, SHORT_MAX),
    hasPatientPortal: oneOf(input.hasPatientPortal, YES_NO_NOT_SURE_OPTIONS),
    patientPortalNotes: str(input.patientPortalNotes, MEDIUM_MAX),
    generalInquiryContactMethod: oneOf(
      input.generalInquiryContactMethod,
      GENERAL_INQUIRY_CONTACT_METHOD_OPTIONS
    ),

    currentEhrSystem: str(input.currentEhrSystem, SHORT_MAX),
    currentCrmOrScheduling: str(input.currentCrmOrScheduling, SHORT_MAX),
    desiredIntegrations: str(input.desiredIntegrations, MEDIUM_MAX),
    crmInterest: oneOf(input.crmInterest, YES_NO_NOT_SURE_OPTIONS),
    desiredCrmFeatures: manyOf(input.desiredCrmFeatures, DESIRED_CRM_FEATURE_OPTIONS),
    desiredCrmFeaturesOtherText: str(input.desiredCrmFeaturesOtherText, SHORT_MAX),
    staffAccessRoles: manyOf(input.staffAccessRoles, STAFF_ACCESS_ROLE_OPTIONS),
    staffAccessRolesOtherText: str(input.staffAccessRolesOtherText, SHORT_MAX),

    aiChatInterest: oneOf(input.aiChatInterest, YES_NO_NOT_SURE_OPTIONS),
    aiVoiceInterest: oneOf(input.aiVoiceInterest, YES_NO_NOT_SURE_OPTIONS),
    automationInterests: manyOf(input.automationInterests, ZIMELA_AUTOMATION_INTEREST_OPTIONS),
    automationInterestsOtherText: str(input.automationInterestsOtherText, SHORT_MAX),
    reportingInterests: manyOf(input.reportingInterests, REPORTING_INTEREST_OPTIONS),
    reportingInterestsOtherText: str(input.reportingInterestsOtherText, SHORT_MAX),

    hipaaPoliciesInPlace: oneOf(input.hipaaPoliciesInPlace, YES_NO_NOT_SURE_OPTIONS),
    approvedVendors: str(input.approvedVendors, MEDIUM_MAX),
    requiredSecurityStandards: str(input.requiredSecurityStandards, MEDIUM_MAX),
    dataHandlingExpectations: str(input.dataHandlingExpectations, MEDIUM_MAX),

    launchTimeframe: oneOf(input.launchTimeframe, ZIMELA_LAUNCH_TIMEFRAME_OPTIONS),
    topPriorities: str(input.topPriorities, MEDIUM_MAX),
    budgetRange: str(input.budgetRange, SHORT_MAX),
    anythingElse: str(input.anythingElse, LONG_MAX),

    contactName: str(input.contactName, SHORT_MAX),
    contactEmail: str(input.contactEmail, 320),
    contactPhone: str(input.contactPhone, SHORT_MAX),
    preferredContactMethod: oneOf(input.preferredContactMethod, ZIMELA_CONTACT_METHOD_OPTIONS),
  };

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
