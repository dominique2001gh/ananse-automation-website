import Container from "@/components/ui/Container";
import Button, { getButtonClassName } from "@/components/ui/Button";
import StatusPill from "@/components/ui/StatusPill";
import { featuredSolutions } from "@/lib/solutions-data";

export default function FeaturedSolutions() {
  return (
    <>
      {featuredSolutions.map((solution, i) => {
        const isEven = i % 2 === 0;
        const sectionTone = isEven ? "bg-paper" : "bg-paper-dim";
        const cardTone = isEven ? "bg-paper-dim" : "bg-paper";
        const introOrder = isEven ? "lg:order-1" : "lg:order-2";
        const detailOrder = isEven ? "lg:order-2" : "lg:order-1";
        const hasProblemOrOutcome = solution.businessProblem || solution.outcome;

        return (
          <section
            key={solution.id}
            id={i === 0 ? "featured" : undefined}
            className={`${sectionTone} py-20 sm:py-28`}
          >
            <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className={`flex flex-col gap-6 lg:col-span-6 ${introOrder}`}>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusPill status={solution.status} />
                  <span className="font-mono text-xs tracking-[0.1em] text-slate/70 uppercase">
                    {solution.category}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="font-mono text-xs font-semibold tracking-[0.2em] text-gold uppercase">
                    {solution.name}
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-balance text-ink sm:text-3xl">
                    {solution.headline}
                  </h2>
                </div>

                <div className="flex flex-col gap-4">
                  {solution.description.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-base leading-relaxed text-pretty text-slate sm:text-lg"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {solution.cta && solution.ctaHref ? (
                  <div className="mt-2 flex flex-col items-start gap-2">
                    <a
                      href={solution.ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={getButtonClassName()}
                    >
                      {solution.cta}
                      <span
                        aria-hidden
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </a>
                  </div>
                ) : solution.cta ? (
                  <div className="mt-2 flex flex-col items-start gap-2">
                    <Button href="#" disabled>
                      {solution.cta}
                    </Button>
                    <span className="text-xs text-slate/70">
                      Live preview coming soon
                    </span>
                  </div>
                ) : null}
              </div>

              <div className={`flex flex-col gap-8 lg:col-span-6 ${detailOrder}`}>
                {solution.businessProblem ? (
                  <div className="flex flex-col gap-3">
                    <p className="font-mono text-xs font-medium tracking-[0.2em] text-slate/70 uppercase">
                      Business Problem
                    </p>
                    <p className="border-l-2 border-line pl-4 text-sm leading-relaxed text-slate italic">
                      &ldquo;{solution.businessProblem}&rdquo;
                    </p>
                  </div>
                ) : null}

                <div className="flex flex-col gap-4">
                  <p className="font-mono text-xs font-medium tracking-[0.2em] text-slate/70 uppercase">
                    {solution.capabilitiesLabel}
                  </p>
                  <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                    {solution.capabilities.map((capability) => (
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

                {solution.outcome ? (
                  <div className={`rounded-2xl border border-line ${cardTone} p-6 sm:p-7`}>
                    <p className="font-mono text-xs font-medium tracking-[0.2em] text-gold uppercase">
                      Outcome
                    </p>
                    <p className="mt-3 text-base leading-relaxed text-pretty text-ink sm:text-lg">
                      {solution.outcome}
                    </p>
                  </div>
                ) : null}

                {!hasProblemOrOutcome ? (
                  <p className="text-xs text-slate/60">
                    Details for this product will be shared as development
                    progresses.
                  </p>
                ) : null}
              </div>
            </Container>
          </section>
        );
      })}
    </>
  );
}
