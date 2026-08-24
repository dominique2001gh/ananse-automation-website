import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { servicePillars } from "@/lib/services-data";

export default function ServicesOverview() {
  return (
    <section className="bg-paper-dim py-20 sm:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Four Pillars"
          title="Technology Built Around Your Business"
          description="Four ways we help small and mid-sized businesses close the gap between how they operate today and how they could be operating. Jump to any of them below."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {servicePillars.map(({ id, index, title, positioning, icon: Icon }) => (
            <Link
              key={id}
              href={`#${id}`}
              className="group flex flex-col gap-5 rounded-2xl border border-line bg-paper p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_12px_32px_-16px_rgba(23,20,15,0.25)]"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-gold-bright">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-xs text-slate/60">{index}</span>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-ink">{title}</h3>
                <p className="text-sm leading-relaxed text-slate">
                  {positioning}
                </p>
              </div>

              <span className="mt-auto inline-flex items-center gap-2 border-t border-line pt-4 text-xs font-medium tracking-wide text-gold uppercase">
                Learn more
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
