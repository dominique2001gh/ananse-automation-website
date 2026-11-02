import type { Metadata } from "next";
import TaxOfficeTexasQuestionnaireHero from "@/components/sections/questionnaire/tax-office-texas/TaxOfficeTexasQuestionnaireHero";
import TaxOfficeTexasQuestionnaireWizard from "@/components/sections/questionnaire/tax-office-texas/TaxOfficeTexasQuestionnaireWizard";
import { buildPageMetadata } from "@/lib/page-metadata";

// Dedicated Project Discovery link for The Tax Office Texas, sent
// directly ahead of our consultation -- not linked from the main
// navigation (lib/nav.ts) and, like the Dash Postal and Xmine Consult
// dedicated pages, deliberately excluded from search engines (see
// `robots` below). Not in app/sitemap.ts's hardcoded `routes` array
// either, so it's already excluded from the sitemap by default.
//
// Uses its own submission pipeline (/api/project-questionnaire/the-tax-
// office-texas, lib/questionnaire-tax-office-texas*.ts) -- a second,
// isolated copy of the Dash Postal questionnaire (lib/questionnaire-
// dash-postal*.ts, app/project-questionnaire/dash-postal/page.tsx) for a
// different prospect at a different URL, left completely untouched here.
// The generic page and Xmine Consult's page are also both untouched by
// this route.
export const metadata: Metadata = {
  ...buildPageMetadata({
    path: "/project-questionnaire/the-tax-office-texas",
    title: "The Tax Office Texas — Project Discovery",
    description:
      "A dedicated project discovery questionnaire for The Tax Office Texas, covering business overview, website goals, branding, CRM and automation, and project priorities.",
  }),
  robots: { index: false, follow: false },
};

export default function TaxOfficeTexasQuestionnairePage() {
  return (
    <>
      <TaxOfficeTexasQuestionnaireHero />
      <TaxOfficeTexasQuestionnaireWizard />
    </>
  );
}
