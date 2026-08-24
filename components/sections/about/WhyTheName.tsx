import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import NetworkMesh from "@/components/graphics/NetworkMesh";

export default function WhyTheName() {
  return (
    <section id="our-name" className="relative overflow-hidden bg-ink py-20 sm:py-28">
      <NetworkMesh
        tone="dark"
        className="pointer-events-none absolute -right-32 -bottom-32 h-[34rem] w-[34rem] opacity-60"
      />

      <Container className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="flex flex-col gap-5">
          <Eyebrow tone="dark">Our Name</Eyebrow>
          <h2 className="text-3xl font-semibold tracking-tight text-balance text-paper sm:text-4xl">
            Why Ananse?
          </h2>
          <p className="text-lg font-medium text-gold-bright">
            A name about connection, not coincidence.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <p className="max-w-xl text-base leading-relaxed text-pretty text-slate-invert sm:text-lg">
            In Akan folklore, Ananse is known as a figure of wisdom,
            cleverness and storytelling — closely associated with
            intricate, interconnected webs.
          </p>

          <p className="max-w-xl border-l-2 border-gold pl-6 text-xl leading-relaxed font-medium text-balance text-paper sm:text-2xl">
            We took the name as a reminder of what good technology should
            do: connect the different parts of a business — its data, its
            workflows and its customers — into one coherent system, instead
            of leaving them scattered across spreadsheets and disconnected
            tools.
          </p>
        </div>
      </Container>
    </section>
  );
}
