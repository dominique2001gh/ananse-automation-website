import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Understand the Operation",
    description: "We learn how the business runs day to day, in its own terms.",
  },
  {
    number: "02",
    title: "Identify the Friction",
    description: "We pinpoint where manual work, gaps or delays are costing time.",
  },
  {
    number: "03",
    title: "Design the Right Solution",
    description: "We match the fix to the problem — not the other way around.",
  },
  {
    number: "04",
    title: "Build and Improve",
    description: "We build it, then keep refining it as the business grows.",
  },
];

export default function IndustriesApproach() {
  return (
    <section className="bg-paper py-20 sm:py-28">
      <Container className="flex flex-col gap-16">
        <SectionHeading
          eyebrow="Our Approach"
          title="We Learn the Business Before We Recommend the Technology."
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
              <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper font-mono text-sm text-gold">
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
