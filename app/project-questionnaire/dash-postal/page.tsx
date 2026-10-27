import type { Metadata } from "next";
import DashPostalQuestionnaireHero from "@/components/sections/questionnaire/dash-postal/DashPostalQuestionnaireHero";
import DashPostalQuestionnaireWizard from "@/components/sections/questionnaire/dash-postal/DashPostalQuestionnaireWizard";
import { buildPageMetadata } from "@/lib/page-metadata";

// Dedicated Project Discovery link for Dash Postal and Tax Services (Ana),
// sent directly ahead of our Oct 30, 2026 consultation -- not linked from
// the main navigation (lib/nav.ts) and, like the Xmine Consult dedicated
// page, deliberately excluded from search engines (see `robots` below).
// Not in app/sitemap.ts's hardcoded `routes` array either, so it's already
// excluded from the sitemap by default.
//
// Uses its own submission pipeline (/api/project-questionnaire/dash-postal,
// lib/questionnaire-dash-postal*.ts) rather than the generic questionnaire's
// -- see lib/questionnaire-dash-postal.ts for why. The generic page and
// Xmine Consult's page are both untouched by this route.
export const metadata: Metadata = {
  ...buildPageMetadata({
    path: "/project-questionnaire/dash-postal",
    title: "Dash Postal and Tax Services — Project Discovery",
    description:
      "A dedicated project discovery questionnaire for Dash Postal and Tax Services, covering business overview, website goals, branding, CRM and automation, and project priorities.",
  }),
  robots: { index: false, follow: false },
};

export default function DashPostalQuestionnairePage() {
  return (
    <>
      <DashPostalQuestionnaireHero />
      <DashPostalQuestionnaireWizard />
    </>
  );
}
