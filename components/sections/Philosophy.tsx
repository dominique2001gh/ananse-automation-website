import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import NetworkMesh from "@/components/graphics/NetworkMesh";

export default function Philosophy() {
  return (
    <section id="philosophy" className="relative overflow-hidden bg-ink py-20 sm:py-28">
      <NetworkMesh
        tone="dark"
        className="pointer-events-none absolute -left-32 -bottom-32 h-[34rem] w-[34rem] opacity-60"
      />

      <Container className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="flex flex-col gap-5">
          <Eyebrow tone="dark">Our Philosophy</Eyebrow>
          <h2 className="text-3xl font-semibold tracking-tight text-balance text-paper sm:text-4xl">
            We Don&rsquo;t Sell Technology for Technology&rsquo;s Sake.
          </h2>
          <p className="text-lg font-medium text-gold-bright">
            We start with the problem.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <p className="max-w-xl text-base leading-relaxed text-pretty text-slate-invert sm:text-lg">
            Many of the businesses we work with are managing daily operations
            in spreadsheets, preparing reports by hand, struggling to keep up
            with customer communication, or running on software that was
            never built for how they actually work. The technology exists —
            it just hasn&rsquo;t been applied to their problem yet.
          </p>

          <p className="max-w-xl border-l-2 border-gold pl-6 text-xl leading-relaxed font-medium text-balance text-paper sm:text-2xl">
            We analyze the problem, design the solution, and build the
            technology around your business.
          </p>
        </div>
      </Container>
    </section>
  );
}
