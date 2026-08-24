import Container from "@/components/ui/Container";
import { servicePillars } from "@/lib/services-data";

export default function ServiceDetails() {
  return (
    <>
      {servicePillars.map((pillar, i) => {
        const isEven = i % 2 === 0;
        const sectionTone = isEven ? "bg-paper" : "bg-paper-dim";
        const cardTone = isEven ? "bg-paper-dim" : "bg-paper";
        const introOrder = isEven ? "lg:order-1" : "lg:order-2";
        const provideOrder = isEven ? "lg:order-2" : "lg:order-1";
        const Icon = pillar.icon;

        return (
          <section key={pillar.id} id={pillar.id} className={`${sectionTone} py-20 sm:py-28`}>
            <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className={`flex flex-col gap-6 lg:col-span-5 ${introOrder}`}>
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-gold-bright">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-mono text-xs text-slate/60">
                    {pillar.index} / 04
                  </span>
                </div>

                <h2 className="text-2xl font-semibold tracking-tight text-balance text-ink sm:text-3xl">
                  {pillar.title}
                </h2>

                <p className="text-base leading-relaxed text-pretty text-slate sm:text-lg">
                  {pillar.positioning}
                </p>

                <div className="flex flex-col gap-3">
                  <p className="font-mono text-xs font-medium tracking-[0.2em] text-slate/70 uppercase">
                    Sound Familiar?
                  </p>
                  <ul className="flex flex-col gap-3">
                    {pillar.problems.map((problem) => (
                      <li
                        key={problem}
                        className="border-l-2 border-line pl-4 text-sm leading-relaxed text-slate italic"
                      >
                        &ldquo;{problem}&rdquo;
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={`flex flex-col gap-8 lg:col-span-7 ${provideOrder}`}>
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-xs font-medium tracking-[0.2em] text-slate/70 uppercase">
                    What We Provide
                  </p>
                  <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                    {pillar.capabilities.map((capability) => (
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

                <div className={`rounded-2xl border border-line ${cardTone} p-6 sm:p-7`}>
                  <p className="font-mono text-xs font-medium tracking-[0.2em] text-gold uppercase">
                    Business Outcome
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-pretty text-ink sm:text-lg">
                    {pillar.outcome}
                  </p>
                </div>
              </div>
            </Container>
          </section>
        );
      })}
    </>
  );
}
