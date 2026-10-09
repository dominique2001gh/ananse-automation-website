import ServicesHero from "@/components/sections/services/ServicesHero";
import ServicesOverview from "@/components/sections/services/ServicesOverview";
import ServiceDetails from "@/components/sections/services/ServiceDetails";
import NotSureSection from "@/components/sections/services/NotSureSection";
import EngagementSteps from "@/components/sections/services/EngagementSteps";
import FinalCta from "@/components/sections/FinalCta";
import { buildPageMetadata } from "@/lib/page-metadata";
import { servicePillars } from "@/lib/services-data";
import { serviceJsonLd, jsonLdScriptProps } from "@/lib/structured-data";

export const metadata = buildPageMetadata({
  path: "/services",
  title: "Services | Ananse Automation",
  description:
    "Data & analytics, AI & automation, web & digital, and custom software & SaaS — practical technology services Ananse Automation builds around how your business actually operates.",
});

export default function ServicesPage() {
  return (
    <>
      {servicePillars.map((pillar) => (
        <script
          key={pillar.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScriptProps(
            serviceJsonLd({
              name: pillar.title,
              description: pillar.positioning,
              path: `/services#${pillar.id}`,
              serviceType: pillar.title,
            })
          )}
        />
      ))}
      <ServicesHero />
      <ServicesOverview />
      <ServiceDetails />
      <NotSureSection />
      <EngagementSteps />
      <FinalCta />
    </>
  );
}
