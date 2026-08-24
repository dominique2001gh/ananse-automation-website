import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import NetworkMesh from "@/components/graphics/NetworkMesh";
import {
  IconTarget,
  IconChartBar,
  IconGear,
  IconCode,
  IconNetwork,
  IconTrendUp,
} from "@/components/graphics/icons";
import type { ComponentType, SVGProps } from "react";

type Highlight = {
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const highlights: Highlight[] = [
  {
    title: "Business-first thinking",
    description: "We start with your operations, not a tech stack.",
    icon: IconTarget,
  },
  {
    title: "Data-driven solutions",
    description: "Decisions and dashboards grounded in your actual numbers.",
    icon: IconChartBar,
  },
  {
    title: "Automation expertise",
    description: "We know where automation saves real time — and where it doesn't.",
    icon: IconGear,
  },
  {
    title: "Custom development",
    description: "Software built to fit your business, not the other way around.",
    icon: IconCode,
  },
  {
    title: "Practical AI implementation",
    description: "AI applied where it solves a problem, not as a headline feature.",
    icon: IconNetwork,
  },
  {
    title: "Solutions for small and growing businesses",
    description: "Built for teams that need results without enterprise overhead.",
    icon: IconTrendUp,
  },
];

export default function WhyAnanse() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 sm:py-28">
      <NetworkMesh
        tone="dark"
        className="pointer-events-none absolute -right-32 top-0 h-[32rem] w-[32rem] opacity-50"
      />

      <Container className="relative flex flex-col gap-14">
        <SectionHeading
          eyebrow="Why Ananse"
          tone="dark"
          title="Technology Should Adapt to Your Business — Not the Other Way Around."
          align="center"
          className="mx-auto max-w-3xl"
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="flex flex-col gap-4 border-t border-paper/10 pt-6"
            >
              <Icon className="h-6 w-6 text-gold-bright" />
              <h3 className="text-base font-semibold text-paper">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-invert">
                {description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
