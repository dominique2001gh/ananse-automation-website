import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  IconTarget,
  IconCompass,
  IconCube,
  IconTrendUp,
  IconNetwork,
  IconGear,
} from "@/components/graphics/icons";
import type { ComponentType, SVGProps } from "react";

type Value = {
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const values: Value[] = [
  {
    title: "Problem Before Technology",
    description: "We don’t recommend a tool until we understand what’s actually broken.",
    icon: IconTarget,
  },
  {
    title: "Honesty About What’s Ready",
    description: "If something is still in development, we say so — not after you’ve signed up.",
    icon: IconCompass,
  },
  {
    title: "Built to Fit, Not to Impress",
    description: "The simplest solution that solves the problem beats the most sophisticated one that doesn’t.",
    icon: IconCube,
  },
  {
    title: "Small Business Economics",
    description: "We design for teams that need results without enterprise budgets or overhead.",
    icon: IconTrendUp,
  },
  {
    title: "Practical Over Trendy",
    description: "We use AI and automation where they solve a real problem — not because they’re fashionable.",
    icon: IconNetwork,
  },
  {
    title: "Long-Term Thinking",
    description: "Systems should be able to grow and change as the business does.",
    icon: IconGear,
  },
];

export default function WhatWeValue() {
  return (
    <section id="values" className="bg-paper py-20 sm:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="What We Value"
          title="Principles We Work By"
          align="center"
          className="mx-auto"
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {values.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="flex flex-col gap-4 border-t border-line pt-6"
            >
              <Icon className="h-6 w-6 text-gold" />
              <h3 className="text-base font-semibold text-ink">{title}</h3>
              <p className="text-sm leading-relaxed text-slate">
                {description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
