import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export default function IndustriesIntro() {
  return (
    <section className="bg-paper-dim py-20 sm:py-28">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Who We Serve"
          title={
            <>
              Different Businesses.
              <br />
              Similar Operational Problems.
            </>
          }
          align="center"
          className="mx-auto"
        />

        <div className="mx-auto flex max-w-2xl flex-col gap-8 text-center">
          <div className="flex flex-col gap-1 text-lg leading-relaxed text-ink">
            <p>A hotel may struggle with reservations and room operations.</p>
            <p>A tax practice may spend hours chasing documents.</p>
            <p>A logistics company may be overwhelmed by customer inquiries.</p>
            <p>A retailer may have inventory data scattered across different systems.</p>
          </div>

          <p className="text-base leading-relaxed text-pretty text-slate sm:text-lg">
            The industries are different, but the underlying problem is
            often the same: too much manual work, disconnected information,
            and technology that does not fit the operation.
          </p>

          <p className="text-base leading-relaxed text-pretty text-slate sm:text-lg">
            Ananse Automation helps businesses identify those problems and
            build better ways to work.
          </p>
        </div>
      </Container>
    </section>
  );
}
