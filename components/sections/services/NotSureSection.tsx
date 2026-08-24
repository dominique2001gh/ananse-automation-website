import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import NetworkMesh from "@/components/graphics/NetworkMesh";
import { servicePillars } from "@/lib/services-data";

export default function NotSureSection() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 sm:py-28">
      <NetworkMesh
        tone="dark"
        className="pointer-events-none absolute -right-32 -top-24 h-[32rem] w-[32rem] opacity-50"
      />

      <Container className="relative flex flex-col items-center gap-8 text-center">
        <Eyebrow tone="dark">Not Sure What You Need?</Eyebrow>

        <h2 className="max-w-2xl text-2xl leading-snug font-semibold text-balance text-paper sm:text-3xl">
          You don&rsquo;t need to know what technology you need. Start with
          the problem.
        </h2>

        <p className="max-w-xl text-base leading-relaxed text-pretty text-slate-invert sm:text-lg">
          Most businesses we work with don&rsquo;t come to us asking for AI,
          automation, analytics or custom software by name — they come with
          a problem. We start by understanding how your business actually
          operates, then recommend the right mix of solutions to fix it.
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {servicePillars.map(({ id, title, icon: Icon }) => (
            <div
              key={id}
              className="flex items-center gap-2 text-slate-invert/80"
            >
              <Icon className="h-4 w-4 text-gold-bright" />
              <span className="text-xs font-medium tracking-wide">
                {title}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
