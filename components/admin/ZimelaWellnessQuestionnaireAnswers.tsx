import type { ZimelaWellnessQuestionnaireDraft } from "@/lib/questionnaire-zimela-wellness";

type Row = { label: string; value: string };
type Section = { title: string; rows: Row[] };

function joined(values: string[] | undefined, otherText?: string): string {
  if (!values || values.length === 0) return "";
  const hasOther = values.includes("Other") && otherText;
  const rendered = hasOther
    ? [...values.filter((v) => v !== "Other"), `Other (${otherText})`]
    : values;
  return rendered.join(", ");
}

function row(label: string, value: string | undefined | null): Row | null {
  return value ? { label, value } : null;
}

/**
 * Admin-only renderer for Zimela Wellness Center's answers shape --
 * components/admin/QuestionnaireAnswers.tsx only knows the generic
 * questionnaire's field names, so a dedicated-questionnaire answers blob
 * like this one would otherwise render as nearly empty in the lead
 * detail page. Additive, new file; QuestionnaireAnswers.tsx and every
 * other questionnaire's admin rendering are untouched.
 *
 * Same section groupings as lib/questionnaire-zimela-wellness-delivery.ts's
 * email formatter -- one canonical set of questions, two presentations.
 */
function buildSections(a: ZimelaWellnessQuestionnaireDraft): Section[] {
  const raw: Section[] = [
    {
      title: "Practice Overview",
      rows: [
        row("Practice location(s)", a.practiceLocations),
        row("Services offered", joined(a.servicesOffered, a.servicesOfferedOtherText)),
        row("Who they typically serve", joined(a.patientPopulation, a.patientPopulationOtherText)),
      ].filter((r): r is Row => r !== null),
    },
    {
      title: "Website & Online Presence",
      rows: [
        row("Current website", a.currentWebsiteUrl),
        row("Likes about current site", a.currentWebsiteLikes),
        row("Wants improved", a.currentWebsiteDislikes),
        row("Main goals", joined(a.websiteGoals, a.websiteGoalsOtherText)),
        row("Design preferences", a.designPreferences),
      ].filter((r): r is Row => r !== null),
    },
    {
      title: "Booking & Patient Communication",
      rows: [
        row("How patients currently book", a.currentBookingMethod),
        row(
          "Desired booking features",
          joined(a.desiredBookingFeatures, a.desiredBookingFeaturesOtherText)
        ),
        row("Offers telehealth", a.telehealthOffered),
        row("Telehealth platform", a.telehealthPlatform),
        row("Has a patient portal", a.hasPatientPortal),
        row("Patient portal notes", a.patientPortalNotes),
        row("General inquiry contact method", a.generalInquiryContactMethod),
      ].filter((r): r is Row => r !== null),
    },
    {
      title: "Systems, CRM & Staff Access",
      rows: [
        row("Current EHR / practice management system", a.currentEhrSystem),
        row("Current CRM or scheduling tool", a.currentCrmOrScheduling),
        row("Desired future integrations", a.desiredIntegrations),
        row("Interested in a CRM", a.crmInterest),
        row("Desired CRM features", joined(a.desiredCrmFeatures, a.desiredCrmFeaturesOtherText)),
        row("Staff roles needing access", joined(a.staffAccessRoles, a.staffAccessRolesOtherText)),
      ].filter((r): r is Row => r !== null),
    },
    {
      title: "AI Assistant & Automation",
      rows: [
        row("Interested in an AI chat agent", a.aiChatInterest),
        row("Interested in an AI voice agent", a.aiVoiceInterest),
        row("Automations of interest", joined(a.automationInterests, a.automationInterestsOtherText)),
        row("Reporting interests", joined(a.reportingInterests, a.reportingInterestsOtherText)),
      ].filter((r): r is Row => r !== null),
    },
    {
      title: "Security & Compliance",
      rows: [
        row("HIPAA policies/BAAs already in place", a.hipaaPoliciesInPlace),
        row("Approved/vetted vendors", a.approvedVendors),
        row("Required security standards", a.requiredSecurityStandards),
        row("Future patient-data handling expectations", a.dataHandlingExpectations),
      ].filter((r): r is Row => r !== null),
    },
    {
      title: "Priorities & Timeline",
      rows: [
        row("Desired launch timeframe", a.launchTimeframe),
        row("Top priorities", a.topPriorities),
        row("Budget range", a.budgetRange),
        row("Anything else", a.anythingElse),
      ].filter((r): r is Row => r !== null),
    },
    {
      title: "Contact Details (from questionnaire)",
      rows: [row("Preferred contact method", a.preferredContactMethod)].filter(
        (r): r is Row => r !== null
      ),
    },
  ];

  return raw.filter((s) => s.rows.length > 0);
}

export default function ZimelaWellnessQuestionnaireAnswers({
  answers,
}: {
  answers: ZimelaWellnessQuestionnaireDraft;
}) {
  const sections = buildSections(answers);

  if (sections.length === 0) {
    return <p className="text-sm text-slate">No questionnaire answers recorded.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section) => (
        <div key={section.title} className="rounded-xl border border-line bg-paper-dim p-4">
          <h3 className="mb-2 text-sm font-semibold text-ink">{section.title}</h3>
          <dl className="flex flex-col gap-1.5">
            {section.rows.map((r) => (
              <div key={r.label} className="flex flex-col gap-0.5 text-sm sm:flex-row sm:gap-2">
                <dt className="shrink-0 font-medium text-slate sm:w-56">{r.label}</dt>
                <dd className="text-ink whitespace-pre-line">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
