import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import NetworkMesh from "@/components/graphics/NetworkMesh";

export default function SolutionsHero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <Container className="relative grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-32">
        <div className="flex flex-col gap-7">
          <Eyebrow>Solutions</Eyebrow>

          <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance text-ink sm:text-5xl lg:text-6xl">
            Technology Built for
            <br />
            Real Businesses.
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-pretty text-slate">
            From hospitality operations and business automation to
            AI-powered career tools and industry-specific platforms, we
            design practical software around real operational problems.
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button href="/contact#inquiry-form">Discuss Your Business</Button>
            <Button href="#featured" variant="secondary">
              Explore Our Solutions
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
