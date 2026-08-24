import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { crossIndustryProblems } from "@/lib/industries-data";

export default function CrossIndustryProblems() {
  return (
    <section className="bg-paper-dim py-20 sm:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="A Familiar Pattern"
          title={
            <>
              Different Industries.
              <br />
              The Same Problems Keep Appearing.
            </>
          }
          description="This is the same starting point behind everything we build — regardless of industry, we start with the problem, not the technology."
          align="center"
          className="mx-auto"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {crossIndustryProblems.map(({ title, icon: Icon }) => (
            <div
              key={title}
              className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_12px_32px_-16px_rgba(23,20,15,0.25)]"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-gold-bright">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="text-base leading-snug font-semibold text-balance text-ink">
                {title}
              </h3>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
