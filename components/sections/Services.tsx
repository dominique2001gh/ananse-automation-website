import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  IconChartBar,
  IconNetwork,
  IconGlobe,
  IconCode,
} from "@/components/graphics/icons";
import type { ComponentType, SVGProps } from "react";

type Service = {
  index: string;
  title: string;
  description: string;
  capabilities: string[];
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const services: Service[] = [
  {
    index: "01",
    title: "Data & Analytics",
    description: "Turn the information you already have into clear, usable insight.",
    capabilities: ["Dashboards & reporting", "Data pipelines & integration", "Business intelligence"],
    icon: IconChartBar,
  },
  {
    index: "02",
    title: "AI & Automation",
    description: "Automate repetitive work and put AI to use where it actually helps.",
    capabilities: ["Workflow automation", "AI agents & assistants", "Process optimization"],
    icon: IconNetwork,
  },
  {
    index: "03",
    title: "Web & Digital",
    description: "Websites and digital experiences built to represent and perform.",
    capabilities: ["Business & marketing sites", "Web applications", "SEO-minded builds"],
    icon: IconGlobe,
  },
  {
    index: "04",
    title: "Custom Software",
    description: "Software shaped around how your business actually operates.",
    capabilities: ["Internal tools & portals", "SaaS products", "System integrations"],
    icon: IconCode,
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-paper py-20 sm:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="What We Do"
          title="Technology Built Around Your Business"
          description="Four pillars that cover how businesses actually run into technology limitations — and how we solve them."
        />

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ index, title, description, capabilities, icon: Icon }) => (
            <div
              key={title}
              className="flex flex-col gap-5 bg-paper p-8 transition-colors duration-200 hover:bg-paper-dim"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line text-gold">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-xs text-slate/60">{index}</span>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-ink">{title}</h3>
                <p className="text-sm leading-relaxed text-slate">{description}</p>
              </div>

              <ul className="mt-auto flex flex-col gap-1.5 border-t border-line pt-4">
                {capabilities.map((item) => (
                  <li key={item} className="text-xs text-slate">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
