import AnalyticsHero from "@/components/sections/analytics/AnalyticsHero";
import DataSourcesFlow from "@/components/sections/analytics/DataSourcesFlow";
import LiveDashboardDemo from "@/components/sections/analytics/LiveDashboardDemo";
import AskYourData from "@/components/sections/analytics/AskYourData";
import AlreadyHaveSoftware from "@/components/sections/analytics/AlreadyHaveSoftware";
import FinalCta from "@/components/sections/FinalCta";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata = buildPageMetadata({
  path: "/analytics",
  title: "Data Analytics & Business Intelligence | Ananse Automation",
  description:
    "Custom dashboards, automated reporting, and an AI data analyst built around the questions your management team actually asks — using the CRM, POS, booking, accounting, and spreadsheet data you already have.",
});

export default function AnalyticsPage() {
  return (
    <>
      <AnalyticsHero />
      <DataSourcesFlow />
      <LiveDashboardDemo />
      <AskYourData />
      <AlreadyHaveSoftware />
      <FinalCta
        eyebrow="Let's Talk Data"
        headline="Show Me What My Data Can Do"
        copy="Tell us what you want to know about your business — we'll show you what's possible with the systems you already run on."
        buttonLabel="Request a Free Analytics Demo"
        buttonHref="/contact#inquiry-form"
      />
    </>
  );
}
