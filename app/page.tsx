import Hero from "@/components/sections/Hero";
import ProblemCards from "@/components/sections/ProblemCards";
import Services from "@/components/sections/Services";
import Philosophy from "@/components/sections/Philosophy";
import Solutions from "@/components/sections/Solutions";
import Industries from "@/components/sections/Industries";
import Process from "@/components/sections/Process";
import WhyAnanse from "@/components/sections/WhyAnanse";
import FinalCta from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemCards />
      <Services />
      <Philosophy />
      <Solutions />
      <Industries />
      <Process />
      <WhyAnanse />
      <FinalCta />
    </>
  );
}
