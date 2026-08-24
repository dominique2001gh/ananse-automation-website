import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";

export default function WhatWereBuilding() {
  return (
    <section id="building" className="bg-paper-dim py-20 sm:py-28">
      <Container className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <Eyebrow>Where We Are Today</Eyebrow>
        <h2 className="text-3xl font-semibold tracking-tight text-balance text-ink sm:text-4xl">
          We Build Our Own Products, Too.
        </h2>
        <p className="text-base leading-relaxed text-pretty text-slate sm:text-lg">
          Alongside client work, we&rsquo;re building Ananse&rsquo;s own
          suite of products — including Innexa, our hotel operations
          platform, and other tools for professional services and
          hospitality businesses. It&rsquo;s the same approach we bring to
          every engagement: understand the operation, then build the right
          system around it.
        </p>
        <Button href="/solutions" variant="secondary" className="mt-2">
          See What We&rsquo;re Building
        </Button>
      </Container>
    </section>
  );
}
