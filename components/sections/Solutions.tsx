import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  IconBuilding,
  IconUtensils,
  IconBriefcase,
  IconChat,
  IconChartBar,
  IconTruck,
} from "@/components/graphics/icons";
import type { ComponentType, SVGProps } from "react";

type Solution = {
  title: string;
  description: string;
  status: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const solutions: Solution[] = [
  {
    title: "Hotel Operations",
    description:
      "Streamlining bookings, front-desk workflows, and guest communication for hospitality businesses.",
    status: "In Development",
    icon: IconBuilding,
  },
  {
    title: "Restaurant Management",
    description:
      "Tools for order flow, inventory, and the day-to-day operations behind a running kitchen.",
    status: "In Development",
    icon: IconUtensils,
  },
  {
    title: "Professional Services Automation",
    description:
      "Automating client intake, scheduling, and reporting for service-based firms.",
    status: "In Development",
    icon: IconBriefcase,
  },
  {
    title: "AI Customer Service",
    description:
      "AI-driven support that can answer customer questions when your team is unavailable.",
    status: "Early Access",
    icon: IconChat,
  },
  {
    title: "Reporting & Analytics",
    description:
      "Turning operational data into dashboards and reports business owners can actually use.",
    status: "In Development",
    icon: IconChartBar,
  },
  {
    title: "Logistics & Operations",
    description:
      "Coordinating routes, deliveries, and day-to-day workflows for logistics-driven businesses.",
    status: "Planned",
    icon: IconTruck,
  },
];

export default function Solutions() {
  return (
    <section id="solutions" className="bg-paper-dim py-20 sm:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="In Progress"
          title="Solutions We're Building"
          description="A growing set of industry-specific solutions, built from the same problem-first approach — at different stages of readiness."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map(({ title, description, status, icon: Icon }) => (
            <div
              key={title}
              className="flex flex-col gap-5 rounded-2xl border border-line bg-paper p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_12px_32px_-16px_rgba(23,20,15,0.25)]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-gold-bright">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="rounded-full border border-line px-3 py-1 font-mono text-[0.65rem] tracking-[0.12em] text-slate uppercase">
                  {status}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-ink">{title}</h3>
                <p className="text-sm leading-relaxed text-slate">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
