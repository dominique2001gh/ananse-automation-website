import SolutionsHero from "@/components/sections/solutions/SolutionsHero";
import WhatWeBuild from "@/components/sections/solutions/WhatWeBuild";
import FeaturedSolutions from "@/components/sections/solutions/FeaturedSolutions";
import CustomSolutionsSection from "@/components/sections/solutions/CustomSolutionsSection";
import OurApproach from "@/components/sections/solutions/OurApproach";
import FinalCta from "@/components/sections/FinalCta";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata = buildPageMetadata({
  path: "/solutions",
  title: "Solutions | Ananse Automation",
  description:
    "Products and platforms Ananse Automation is designing and building — from hotel operations software to AI career tools and industry-specific business systems.",
});

export default function SolutionsPage() {
  return (
    <>
      <SolutionsHero />
      <WhatWeBuild />
      <FeaturedSolutions />
      <CustomSolutionsSection />
      <OurApproach />
      <FinalCta
        eyebrow="Have an Idea?"
        headline={
          <>
            Your Business Problem Could Become
            <br />
            Our Next Solution.
          </>
        }
        copy="Tell us what is difficult, repetitive or inefficient in your business. We’ll help determine whether software, automation, AI or better data can solve it."
        buttonLabel="Discuss Your Business"
      />
    </>
  );
}
