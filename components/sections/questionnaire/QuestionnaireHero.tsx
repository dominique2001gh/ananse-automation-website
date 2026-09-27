import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import NetworkMesh from "@/components/graphics/NetworkMesh";

export default function QuestionnaireHero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <NetworkMesh
        tone="light"
        className="pointer-events-none absolute -right-24 -top-24 h-[24rem] w-[24rem] opacity-70 lg:h-[28rem] lg:w-[28rem]"
      />

      <Container className="relative flex flex-col gap-6 py-16 sm:py-20 lg:py-24">
        <Eyebrow>Project Discovery</Eyebrow>

        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-ink sm:text-5xl">
          Tell Us About Your Project.
        </h1>

        <p className="max-w-xl text-lg leading-relaxed text-pretty text-slate">
          A few minutes of detail about your business and what you need helps
          us design the right solution the first time — whether that&rsquo;s
          a website, a CRM, analytics, automation, AI, or a combination.
          Answer only what&rsquo;s relevant to you.
        </p>
      </Container>
    </section>
  );
}
