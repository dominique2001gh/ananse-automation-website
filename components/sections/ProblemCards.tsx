import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  IconGlobe,
  IconRepeat,
  IconChartBar,
  IconCube,
  IconChatClock,
} from "@/components/graphics/icons";
import type { ComponentType, SVGProps } from "react";

type Problem = {
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const problems: Problem[] = [
  {
    title: "My business needs a better website",
    description:
      "A site that loads fast, reflects your brand, and actually turns visitors into customers.",
    icon: IconGlobe,
  },
  {
    title: "We're doing too much work manually",
    description:
      "Repetitive tasks are eating hours every week that could go toward growing the business.",
    icon: IconRepeat,
  },
  {
    title: "We have data but don't know what it means",
    description:
      "Information is scattered across spreadsheets and systems with no clear picture to act on.",
    icon: IconChartBar,
  },
  {
    title: "We need software built around our business",
    description:
      "Off-the-shelf tools don't fit how you actually operate, so your team works around them instead.",
    icon: IconCube,
  },
  {
    title: "Customers need answers when we're unavailable",
    description:
      "Questions come in outside business hours, and slow responses cost you trust and business.",
    icon: IconChatClock,
  },
];

export default function ProblemCards() {
  return (
    <section className="bg-paper-dim py-20 sm:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Start Here"
          title="What Can We Help You Solve?"
          align="center"
          className="mx-auto"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_12px_32px_-16px_rgba(23,20,15,0.25)]"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-gold-bright">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold text-balance text-ink">
                {title}
              </h3>
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
