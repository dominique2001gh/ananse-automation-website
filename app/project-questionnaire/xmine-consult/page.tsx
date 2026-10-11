import type { Metadata } from "next";
import XmineQuestionnaireHero from "@/components/sections/questionnaire/xmine/XmineQuestionnaireHero";
import XmineQuestionnaireWizard from "@/components/sections/questionnaire/xmine/XmineQuestionnaireWizard";
import { buildPageMetadata } from "@/lib/page-metadata";

// Dedicated Project Discovery link for Xmine Consult (Samuel), sent
// directly to him -- not linked from the main navigation (lib/nav.ts) and,
// unlike the generic /project-questionnaire page, deliberately excluded
// from search engines entirely (see `robots` below): this URL only exists
// so he can be sent it directly. It is also not listed in
// app/sitemap.ts's hardcoded `routes` array, so it's already excluded from
// the sitemap by default -- nothing to add there.
//
// Reuses the exact same submission pipeline as the generic questionnaire
// (/api/project-questionnaire, lib/questionnaire*.ts, lib/leads.ts) -- only
// the presentation (components/sections/questionnaire/xmine/) differs. The
// generic page and its components are completely untouched by this route.
export const metadata: Metadata = {
  ...buildPageMetadata({
    path: "/project-questionnaire/xmine-consult",
    title: "Xmine Consult — Website Redesign & CRM Project Discovery",
    description:
      "A dedicated project discovery questionnaire for Xmine Consult, covering company information, website redesign, field operations and client management (CRM), analytics, automation, and future requirements.",
  }),
  robots: { index: false, follow: false },
};

export default function XmineConsultQuestionnairePage() {
  return (
    <>
      <XmineQuestionnaireHero />
      <XmineQuestionnaireWizard />
    </>
  );
}
