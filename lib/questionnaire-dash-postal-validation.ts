import {
  createEmptyDashPostalDraft,
  DASH_POSTAL_BUSINESS_NAME,
  CURRENT_SERVICE_OPTIONS,
  CUSTOMER_TYPE_OPTIONS,
  DASH_WEBSITE_GOAL_OPTIONS,
  HAS_WEBSITE_OPTIONS,
  DESIRED_WEBSITE_FEATURE_OPTIONS,
  BRAND_ASSET_OPTIONS,
  DESIGN_STYLE_OPTIONS,
  CUSTOMER_CONTACT_METHOD_OPTIONS,
  CRM_INTEREST_OPTIONS,
  DASH_AUTOMATION_INTEREST_OPTIONS,
  LAUNCH_TIMEFRAME_OPTIONS,
  DASH_CONTACT_METHOD_OPTIONS,
  type DashPostalQuestionnaireDraft,
  type DashPostalFieldErrors,
} from "./questionnaire-dash-postal";

/**
 * Pure, dependency-free validation for the Dash Postal and Tax Services
 * questionnaire -- same shared-source-of-truth pattern as
 * lib/questionnaire-validation.ts (safe to import from the client for
 * instant feedback or the server route handler, which is the actual
 * source of truth). Kept as its own module rather than extending the
 * generic validator, mirroring the separate-types decision in
 * lib/questionnaire-dash-postal.ts.
 *
 * Only the contact name and email are required, per the product brief:
 * every business question is optional free text or a multi-select, so
 * Ana is never blocked by a question that doesn't apply. The business
 * name is fixed (this is a dedicated, single-prospect link) so it can
 * never fail validation.
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

export function validateDashPostalQuestionnaire(
  input: Record<string, unknown>
):
  | { valid: true; data: DashPostalQuestionnaireDraft }
  | { valid: false; errors: DashPostalFieldErrors } {
  const errors: DashPostalFieldErrors = {};
  const empty = createEmptyDashPostalDraft();

  const data: DashPostalQuestionnaireDraft = {
    ...empty,
    // Never trust a client-supplied business name on this dedicated
    // link -- always the fixed value, regardless of what was posted.
    businessName: DASH_POSTAL_BUSINESS_NAME,

    currentServices: manyOf(input.currentServices, CURRENT_SERVICE_OPTIONS),
    currentServicesOtherText: str(input.currentServicesOtherText, SHORT_MAX),
    servicesToPromote: str(input.servicesToPromote, MEDIUM_MAX),
    customerTypes: manyOf(input.customerTypes, CUSTOMER_TYPE_OPTIONS),
    customerTypesOtherText: str(input.customerTypesOtherText, SHORT_MAX),
    differentiators: str(input.differentiators, MEDIUM_MAX),

    websiteGoals: manyOf(input.websiteGoals, DASH_WEBSITE_GOAL_OPTIONS),
    websiteGoalsOtherText: str(input.websiteGoalsOtherText, SHORT_MAX),
    hasWebsite: oneOf(input.hasWebsite, HAS_WEBSITE_OPTIONS),
    currentWebsiteUrl: str(input.currentWebsiteUrl, SHORT_MAX),
    desiredFeatures: manyOf(input.desiredFeatures, DESIRED_WEBSITE_FEATURE_OPTIONS),
    desiredFeaturesOtherText: str(input.desiredFeaturesOtherText, SHORT_MAX),
    designInspiration: str(input.designInspiration, MEDIUM_MAX),

    brandAssets: manyOf(input.brandAssets, BRAND_ASSET_OPTIONS),
    designStyle: oneOf(input.designStyle, DESIGN_STYLE_OPTIONS),
    socialMediaProfiles: str(input.socialMediaProfiles, MEDIUM_MAX),

    customerContactMethods: manyOf(input.customerContactMethods, CUSTOMER_CONTACT_METHOD_OPTIONS),
    customerContactMethodsOtherText: str(input.customerContactMethodsOtherText, SHORT_MAX),
    currentManagementDescription: str(input.currentManagementDescription, LONG_MAX),
    crmInterest: oneOf(input.crmInterest, CRM_INTEREST_OPTIONS),
    automationInterests: manyOf(input.automationInterests, DASH_AUTOMATION_INTEREST_OPTIONS),
    automationInterestsOtherText: str(input.automationInterestsOtherText, SHORT_MAX),

    launchTimeframe: oneOf(input.launchTimeframe, LAUNCH_TIMEFRAME_OPTIONS),
    topPriorities: str(input.topPriorities, MEDIUM_MAX),
    anythingElse: str(input.anythingElse, LONG_MAX),

    contactName: str(input.contactName, SHORT_MAX),
    contactEmail: str(input.contactEmail, 320),
    contactPhone: str(input.contactPhone, SHORT_MAX),
    preferredContactMethod: oneOf(input.preferredContactMethod, DASH_CONTACT_METHOD_OPTIONS),
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
