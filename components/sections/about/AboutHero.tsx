import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import NetworkMesh from "@/components/graphics/NetworkMesh";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <Container className="relative grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-32">
        <div className="flex flex-col gap-7">
          <Eyebrow>About</Eyebrow>

          <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance text-ink sm:text-5xl lg:text-6xl">
            We Start With the Problem.
            <br />
            Not the Technology.
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-pretty text-slate">
            Ananse Automation is a technology consulting and software
            development company built for one purpose: helping small and
            mid-sized businesses replace manual, disconnected work with
            technology that actually fits how they operate.
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button href="/contact#inquiry-form">Discuss Your Business</Button>
            <Button href="#philosophy" variant="secondary">
              Read Our Philosophy
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
