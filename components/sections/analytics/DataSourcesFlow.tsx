import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  IconUsers,
  IconGlobe,
  IconCalendar,
  IconBag,
  IconReceipt,
  IconSpreadsheet,
  IconDatabase,
  IconCube,
  IconChartBar,
  IconRepeat,
  IconChatClock,
  IconTrendUp,
} from "@/components/graphics/icons";
import type { ComponentType, SVGProps } from "react";

type FlowItem = { label: string; icon: ComponentType<SVGProps<SVGSVGElement>> };

const SOURCES: FlowItem[] = [
  { label: "CRM", icon: IconUsers },
  { label: "Website", icon: IconGlobe },
  { label: "Booking System", icon: IconCalendar },
  { label: "POS / Sales", icon: IconBag },
  { label: "Accounting", icon: IconReceipt },
  { label: "Excel / CSV", icon: IconSpreadsheet },
  { label: "Databases", icon: IconDatabase },
  { label: "Other Systems", icon: IconCube },
];

const OUTPUTS: { label: string; description: string; icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { label: "Custom Dashboards", description: "Built around the metrics your team actually checks.", icon: IconChartBar },
  { label: "Automated Reporting", description: "The reports you build by hand every week, generated for you.", icon: IconRepeat },
  { label: "AI Data Analyst", description: "Ask a plain-English question, get a grounded answer.", icon: IconChatClock },
  { label: "Business Insights", description: "Patterns and trends surfaced before you have to go looking.", icon: IconTrendUp },
];

function FlowCard({ label, icon: Icon }: FlowItem) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-paper px-4 py-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_12px_32px_-16px_rgba(23,20,15,0.25)]">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-gold-bright">
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-sm font-medium text-ink">{label}</span>
    </div>
  );
}

function FlowConnector() {
  return (
    <div aria-hidden className="relative mx-auto h-10 w-px bg-line sm:h-12">
      <span className="motion-safe:animate-bounce absolute -left-[3px] top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-gold" />
    </div>
  );
}

export default function DataSourcesFlow() {
  return (
    <section className="bg-paper-dim py-20 sm:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="How It Works"
          title="The Data You Already Have, Finally Connected"
          description="Whatever you run your business on today, it's likely already generating the information management needs — it just isn't connected to answer the questions you're asking."
          align="center"
          className="mx-auto"
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {SOURCES.map((item) => (
            <FlowCard key={item.label} {...item} />
          ))}
        </div>

        <FlowConnector />

        <div className="mx-auto inline-flex items-center gap-3 rounded-2xl bg-ink px-8 py-5 text-paper shadow-[0_20px_48px_-20px_rgba(23,20,15,0.5)]">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-ink">
            <IconChartBar className="h-5 w-5" />
          </span>
          <span className="font-mono text-sm font-semibold tracking-[0.18em] uppercase">Ananse Analytics</span>
        </div>

        <FlowConnector />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {OUTPUTS.map(({ label, description, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_12px_32px_-16px_rgba(23,20,15,0.25)]"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold">
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-base font-semibold text-ink">{label}</h3>
                <p className="text-sm leading-relaxed text-slate">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
