import Link from "next/link";
import Container from "@/components/ui/Container";
import { industries } from "@/lib/industries-data";

export default function IndustryDetails() {
  return (
    <div id="industry-list">
      {industries.map((industry, i) => {
        const isEven = i % 2 === 0;
        const sectionTone = isEven ? "bg-paper" : "bg-paper-dim";
        const noteTone = isEven ? "bg-paper-dim" : "bg-paper";
        const introOrder = isEven ? "lg:order-1" : "lg:order-2";
        const detailOrder = isEven ? "lg:order-2" : "lg:order-1";
        const Icon = industry.icon;

        return (
          <section key={industry.id} id={industry.id} className={`${sectionTone} py-20 sm:py-28`}>
            <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className={`flex flex-col gap-6 lg:col-span-5 ${introOrder}`}>
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-gold-bright">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-mono text-xs text-slate/60">
                    {industry.index} / 06
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="font-mono text-xs font-semibold tracking-[0.2em] text-gold uppercase">
                    {industry.name}
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-balance text-ink sm:text-3xl">
                    {industry.headline}
                  </h2>
                </div>

                {industry.businessTypes ? (
                  <div className="flex flex-wrap gap-2">
                    {industry.businessTypes.map((type) => (
                      <span
                        key={type}
                        className="rounded-full border border-line px-3 py-1 text-xs text-slate"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                ) : null}

                {industry.note ? (
                  <p
                    className={`border-l-2 pl-4 text-sm leading-relaxed text-slate ${
                      industry.note.tone === "reference"
                        ? "border-gold/40"
                        : "border-line"
                    }`}
                  >
                    {industry.note.text}
                    {industry.note.linkHref ? (
                      <>
                        {" "}
                        <Link
                          href={industry.note.linkHref}
                          className="font-medium text-gold hover:text-gold-bright"
                        >
                          {industry.note.linkLabel} →
                        </Link>
                      </>
                    ) : null}
                  </p>
                ) : null}
              </div>

              <div className={`flex flex-col gap-8 lg:col-span-7 ${detailOrder}`}>
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-xs font-medium tracking-[0.2em] text-slate/70 uppercase">
                    {industry.challengesLabel ?? "Common Challenges"}
                  </p>
                  <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                    {industry.challenges.map((challenge) => (
                      <li
                        key={challenge}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-slate"
                      >
                        <span
                          aria-hidden
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-line"
                        />
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`rounded-2xl border border-line ${noteTone} p-6 sm:p-7`}>
                  <p className="font-mono text-xs font-medium tracking-[0.2em] text-gold uppercase">
                    {industry.capabilitiesLabel ?? "How Ananse Can Help"}
                  </p>
                  <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                    {industry.capabilities.map((capability) => (
                      <li
                        key={capability}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-ink"
                      >
                        <span
                          aria-hidden
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                        />
                        {capability}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Container>
          </section>
        );
      })}
    </div>
  );
}
