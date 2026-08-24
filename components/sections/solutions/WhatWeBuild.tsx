import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export default function WhatWeBuild() {
  return (
    <section className="bg-paper-dim py-20 sm:py-28">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="What We Build"
          title="From Business Problem to Working Product"
          align="center"
          className="mx-auto"
        />

        <div className="mx-auto flex max-w-2xl flex-col gap-8 text-center">
          <div className="flex flex-col gap-1 text-lg leading-relaxed text-ink">
            <p>Some businesses need better data.</p>
            <p>Some need automation.</p>
            <p>Others need an entirely new system.</p>
          </div>

          <p className="text-base leading-relaxed text-pretty text-slate sm:text-lg">
            Our solutions begin with the same question: what is making the
            business harder to run than it should be?
          </p>

          <p className="text-base leading-relaxed text-pretty text-slate sm:text-lg">
            We design technology around that problem — from focused internal
            tools to full SaaS platforms.
          </p>
        </div>
      </Container>
    </section>
  );
}
