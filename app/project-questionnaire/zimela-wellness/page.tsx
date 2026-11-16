import type { Metadata } from "next";
import ZimelaWellnessQuestionnaireHero from "@/components/sections/questionnaire/zimela-wellness/ZimelaWellnessQuestionnaireHero";
import ZimelaWellnessQuestionnaireWizard from "@/components/sections/questionnaire/zimela-wellness/ZimelaWellnessQuestionnaireWizard";
import { buildPageMetadata } from "@/lib/page-metadata";

// Dedicated Project Discovery link for Zimela Wellness Center, sent
// directly ahead of our consultation -- not linked from the main
// navigation (lib/nav.ts) and, like the Dash Postal, Tax Office Texas,
// and Xmine Consult dedicated pages, deliberately excluded from search
// engines (see `robots` below). Not in app/sitemap.ts's hardcoded
// `routes` array either, so it's already excluded from the sitemap by
// default.
//
// Uses its own submission pipeline (/api/project-questionnaire/zimela-
// wellness, lib/questionnaire-zimela-wellness*.ts) -- a third, isolated
// copy of the Dash Postal/Tax Office Texas pattern (lib/questionnaire-
// dash-postal*.ts, lib/questionnaire-tax-office-texas*.ts) for a
// different prospect at a different URL, left completely untouched here.
// The generic page, Xmine Consult's page, and Dash Postal's page are
// also all untouched by this route.
export const metadata: Metadata = {
  ...buildPageMetadata({
    path: "/project-questionnaire/zimela-wellness",
    title: "Zimela Wellness Center — Project Discovery",
    description:
      "A dedicated project discovery questionnaire for Zimela Wellness Center, covering practice overview, website goals, patient booking workflows, systems and CRM, AI assistant scope, security and compliance, and project priorities.",
  }),
  robots: { index: false, follow: false },
};

export default function ZimelaWellnessQuestionnairePage() {
  return (
    <>
      <ZimelaWellnessQuestionnaireHero />
      <ZimelaWellnessQuestionnaireWizard />
    </>
  );
}
