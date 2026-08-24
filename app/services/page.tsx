import ServicesHero from "@/components/sections/services/ServicesHero";
import ServicesOverview from "@/components/sections/services/ServicesOverview";
import ServiceDetails from "@/components/sections/services/ServiceDetails";
import NotSureSection from "@/components/sections/services/NotSureSection";
import EngagementSteps from "@/components/sections/services/EngagementSteps";
import FinalCta from "@/components/sections/FinalCta";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata = buildPageMetadata({
  path: "/services",
  title: "Services | Ananse Automation",
  description:
    "Data & analytics, AI & automation, web & digital, and custom software & SaaS — practical technology services Ananse Automation builds around how your business actually operates.",
});

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesOverview />
      <ServiceDetails />
      <NotSureSection />
      <EngagementSteps />
      <FinalCta />
    </>
  );
}
