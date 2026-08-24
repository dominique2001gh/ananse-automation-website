import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export default function OurPhilosophy() {
  return (
    <section id="philosophy" className="bg-paper-dim py-20 sm:py-28">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Our Philosophy"
          title="Understand First. Build Second."
          align="center"
          className="mx-auto"
        />

        <div className="mx-auto flex max-w-2xl flex-col gap-8 text-center">
          <div className="flex flex-col gap-1 text-lg leading-relaxed text-ink">
            <p>We don&rsquo;t lead with AI.</p>
            <p>We don&rsquo;t lead with automation.</p>
            <p>We don&rsquo;t lead with software.</p>
          </div>

          <p className="text-base leading-relaxed text-pretty text-slate sm:text-lg">
            We lead with a question: what is making this business harder to
            run than it needs to be? The answer determines whether the
            right fix is better data, a simpler workflow, an AI assistant,
            a website, or software built from scratch.
          </p>

          <p className="text-base leading-relaxed text-pretty text-slate sm:text-lg">
            That&rsquo;s the discipline behind everything we build —
            including our own products.
          </p>
        </div>
      </Container>
    </section>
  );
}
