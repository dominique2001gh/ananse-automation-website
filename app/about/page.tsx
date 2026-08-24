import AboutHero from "@/components/sections/about/AboutHero";
import WhyTheName from "@/components/sections/about/WhyTheName";
import OurPhilosophy from "@/components/sections/about/OurPhilosophy";
import WhatWeValue from "@/components/sections/about/WhatWeValue";
import WhatWereBuilding from "@/components/sections/about/WhatWereBuilding";
import FinalCta from "@/components/sections/FinalCta";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata = buildPageMetadata({
  path: "/about",
  title: "About | Ananse Automation",
  description:
    "Ananse Automation is a technology consulting and software development company built on one idea: understand the business first, then build the technology around it.",
});

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <WhyTheName />
      <OurPhilosophy />
      <WhatWeValue />
      <WhatWereBuilding />
      <FinalCta
        eyebrow="Let’s Talk"
        headline="We’d Like to Understand Your Business."
        copy="Every engagement starts with a conversation about how your business actually operates — not a sales pitch about technology you don’t need."
        buttonLabel="Discuss Your Business"
      />
    </>
  );
}
