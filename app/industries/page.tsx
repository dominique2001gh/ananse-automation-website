import IndustriesHero from "@/components/sections/industries/IndustriesHero";
import IndustriesIntro from "@/components/sections/industries/IndustriesIntro";
import IndustryDetails from "@/components/sections/industries/IndustryDetails";
import OtherBusinesses from "@/components/sections/industries/OtherBusinesses";
import CrossIndustryProblems from "@/components/sections/industries/CrossIndustryProblems";
import IndustriesApproach from "@/components/sections/industries/IndustriesApproach";
import FinalCta from "@/components/sections/FinalCta";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata = buildPageMetadata({
  path: "/industries",
  title: "Industries | Ananse Automation",
  description:
    "Hospitality, professional services, logistics, restaurants, retail and healthcare operations — the kinds of operational problems Ananse Automation understands and builds technology around.",
});

export default function IndustriesPage() {
  return (
    <>
      <IndustriesHero />
      <IndustriesIntro />
      <IndustryDetails />
      <OtherBusinesses />
      <CrossIndustryProblems />
      <IndustriesApproach />
      <FinalCta
        eyebrow="Your Industry. Your Workflow."
        headline="Tell Us How Your Business Works."
        copy="You do not need to know what software or technology you need. Show us the process, the bottleneck or the problem, and we’ll help determine what can improve it."
        buttonLabel="Discuss Your Business"
      />
    </>
  );
}
