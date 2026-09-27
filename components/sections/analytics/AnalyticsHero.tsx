import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import NetworkMesh from "@/components/graphics/NetworkMesh";

export default function AnalyticsHero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <Container className="relative grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-32">
        <div className="flex flex-col gap-7">
          <Eyebrow>Data &amp; Analytics</Eyebrow>

          <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance text-ink sm:text-5xl lg:text-6xl">
            Your Business Is Unique.
            <br />
            Your Analytics Should Be Too.
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-pretty text-slate">
            Turn the data you already have into answers you can use. We build
            custom dashboards and reporting around the specific questions
            your management team is asking — not a generic template.
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button href="/contact#inquiry-form">Request a Free Analytics Demo</Button>
            <Button href="#live-demo" variant="secondary">
              See It In Action
            </Button>
          </div>
        </div>

        <div className="relative hidden aspect-square w-full max-w-md justify-self-end lg:flex lg:items-center lg:justify-center">
          <NetworkMesh tone="light" className="h-full w-full" />
        </div>
      </Container>
    </section>
  );
}
