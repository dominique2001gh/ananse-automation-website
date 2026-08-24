import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Tell Us What's Slowing You Down",
    description:
      "Share the problem in plain language — no need to know what technology might solve it.",
  },
  {
    number: "02",
    title: "We Assess the Problem",
    description:
      "We look at how your business actually operates to understand the real opportunity.",
  },
  {
    number: "03",
    title: "We Recommend & Build",
    description:
      "We propose the right mix — data, automation, AI, web or custom software — and build it.",
  },
];

export default function EngagementSteps() {
  return (
    <section id="engagement" className="bg-paper-dim py-20 sm:py-28">
      <Container className="flex flex-col gap-16">
        <SectionHeading
          eyebrow="How We Work"
          title="How Engagement Starts"
          align="center"
          className="mx-auto"
        />

        <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div
            aria-hidden
            className="absolute top-6 right-[16.6%] left-[16.6%] hidden h-px bg-line sm:block"
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
              <p className="max-w-[18rem] text-sm leading-relaxed text-slate">
                {description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
