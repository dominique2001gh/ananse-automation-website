import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "We dig into how your business actually operates, and where the friction really is.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "We map out the right solution for the problem — not the most complex one available.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "We build and implement the technology, fitted into how your team already works.",
  },
  {
    number: "04",
    title: "Improve",
    description:
      "We refine based on real use, so the solution keeps getting better with your business.",
  },
];

export default function Process() {
  return (
    <section className="bg-paper-dim py-20 sm:py-28">
      <Container className="flex flex-col gap-16">
        <SectionHeading
          eyebrow="How We Work"
          title="From Business Problem to Working Solution"
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
              className="relative flex flex-col items-center gap-4 text-center lg:items-center"
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
