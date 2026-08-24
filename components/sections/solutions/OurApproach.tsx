import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Understand",
    description:
      "We learn how the business currently operates and where the friction exists.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "We determine the simplest technology solution that can meaningfully improve the workflow.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "We develop and test the solution around real business requirements.",
  },
  {
    number: "04",
    title: "Improve",
    description:
      "The system can evolve as the business grows and new needs emerge.",
  },
];

export default function OurApproach() {
  return (
    <section className="bg-paper-dim py-20 sm:py-28">
      <Container className="flex flex-col gap-16">
        <SectionHeading
          eyebrow="Our Approach"
          title="We Build Around the Operation."
          align="center"
          className="mx-auto"
        />

        <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div
            aria-hidden
            className="absolute top-6 right-[12.5%] left-[12.5%] hidden h-px bg-line lg:block"
          />

          {steps.map(({ number, title, description }) => (
            <div
              key={number}
              className="relative flex flex-col items-center gap-4 text-center"
            >
              <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper-dim font-mono text-sm text-gold">
                {number}
              </span>
              <h3 className="text-lg font-semibold text-ink">{title}</h3>
              <p className="max-w-[16rem] text-sm leading-relaxed text-slate">
                {description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
