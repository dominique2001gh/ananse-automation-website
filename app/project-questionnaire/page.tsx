import QuestionnaireHero from "@/components/sections/questionnaire/QuestionnaireHero";
import QuestionnaireWizard from "@/components/sections/questionnaire/QuestionnaireWizard";
import { buildPageMetadata } from "@/lib/page-metadata";

// Deliberately not linked from the main navigation (lib/nav.ts) yet -- this
// link is sent directly to prospects. It's still a normal public page (no
// auth, no noindex) using the same Header/Footer/AI widget as every other
// page, mounted globally from app/layout.tsx.
export const metadata = buildPageMetadata({
  path: "/project-questionnaire",
  title: "Project Questionnaire | Ananse Automation",
  description:
    "Tell Ananse Automation about your business and your project so we can design the right website, CRM, analytics, automation, or AI solution for you.",
});

export default function ProjectQuestionnairePage() {
  return (
    <>
      <QuestionnaireHero />
      <QuestionnaireWizard />
    </>
  );
}
