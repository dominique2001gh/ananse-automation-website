import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  {
    number: "01",
    title: "We Listen",
    description:
      "We learn how your business currently operates and what is causing friction.",
  },
  {
    number: "02",
    title: "We Recommend",
    description:
      "We determine whether the right solution involves data, automation, AI, web technology, custom software, or a combination.",
  },
  {
    number: "03",
    title: "We Build",
    description:
      "If there is a good fit, we design and implement the solution around the way your business actually works.",
  },
];

export default function WhatHappensNext() {
  return (
    <section className="bg-paper py-20 sm:py-28">
      <Container className="flex flex-col gap-16">
        <SectionHeading
          eyebrow="After You Reach Out"
          title="What Happens Next?"
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
              <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper font-mono text-sm text-gold">
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
