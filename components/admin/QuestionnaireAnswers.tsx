import type { QuestionnaireDraft } from "@/lib/questionnaire";

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

/** Same section groupings as lib/questionnaire-delivery.ts's email
 * formatter, rendered here for the admin lead detail view instead of
 * plain text -- one canonical set of questions, two presentations. */
function buildSections(a: QuestionnaireDraft): Section[] {
  const raw: Section[] = [
    {
      title: "About the Business",
      rows: [
        row("Business name", a.businessName),
        row("Industry / business type", a.industry),
        row("What the business does", a.businessDescription),
        row("Location(s)", a.businessLocation),
        row("Business size", a.businessSize),
        row("Typical customers/clients", a.typicalCustomers),
        row("Main business goals", a.businessGoals),
        row("Current major challenges", a.currentChallenges),
      ].filter((r): r is Row => r !== null),
    },
    {
      title: "The Project",
      rows: [
        row("Services requested", joined(a.servicesNeeded, a.servicesNeededOtherText)),
        row("Primary problem to solve", a.primaryProblem),
        row("What success looks like", a.successDefinition),
        row("Desired timeframe", a.timeframe),
      ].filter((r): r is Row => r !== null),
    },
    {
      title: "Website",
      rows: [
        row("Currently has a website", a.hasWebsite),
        row("Current site URL", a.currentWebsiteUrl),
        row("Likes about current site", a.currentWebsiteLikes),
        row("Wants improved", a.currentWebsiteDislikes),
        row("Visitors should be able to", joined(a.websiteGoals, a.websiteGoalsOtherText)),
        row("Assets already available", joined(a.websiteAssets)),
        row("Design preferences", a.designPreferences),
      ].filter((r): r is Row => r !== null),
    },
    {
      title: "CRM & Business Operations",
      rows: [
        row("How they're managed today", a.currentManagementDescription),
        row("Customer info needed", a.customerInfoNeeded),
        row("Stages/statuses", a.stagesStatuses),
        row("Different staff access levels", a.staffAccessLevels),
        row("Useful features", joined(a.crmFeatures, a.crmFeaturesOtherText)),
      ].filter((r): r is Row => r !== null),
    },
    {
      title: "Analytics & Reporting",
      rows: [
        row("Wants to understand", joined(a.analyticsInterests, a.analyticsInterestsOtherText)),
        row("Where data lives", joined(a.dataSources)),
        row("Who needs access", a.reportAccess),
        row("Reporting frequency", a.reportFrequency),
        row("Decisions to inform", a.analyticsDecisions),
      ].filter((r): r is Row => r !== null),
    },
    {
      title: "Automation & AI",
      rows: [
        row("Repetitive work to hand off", joined(a.repetitiveTasks, a.repetitiveTasksOtherText)),
        row("Interested in", joined(a.automationInterests)),
        row("Manual process to automate", a.manualProcessDescription),
      ].filter((r): r is Row => r !== null),
    },
    {
      title: "Additional Notes",
      rows: [
        row("Anything else to build", a.additionalDetails),
        row("Liked examples", a.likedExamples),
        row("Must integrate with", a.integrationRequirements),
        row("Does not want", a.dislikedThings),
      ].filter((r): r is Row => r !== null),
    },
    {
      title: "Contact Details (from questionnaire)",
      rows: [
        row("Role/title", a.contactRole),
        row("Preferred contact method", a.preferredContactMethod),
        row("Best time to contact", a.bestTimeToContact),
      ].filter((r): r is Row => r !== null),
    },
  ];

  return raw.filter((s) => s.rows.length > 0);
}

export default function QuestionnaireAnswers({ answers }: { answers: QuestionnaireDraft }) {
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
