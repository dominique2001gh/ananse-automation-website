import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import NetworkMesh from "@/components/graphics/NetworkMesh";

export default function XmineQuestionnaireHero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <NetworkMesh
        tone="light"
        className="pointer-events-none absolute -right-24 -top-24 h-[24rem] w-[24rem] opacity-70 lg:h-[28rem] lg:w-[28rem]"
      />

      <Container className="relative flex flex-col gap-6 py-16 sm:py-20 lg:py-24">
        <Eyebrow>Project Discovery</Eyebrow>

        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-ink sm:text-5xl">
          Xmine Consult — Website Redesign &amp; CRM Project Discovery
        </h1>

        <p className="max-w-xl text-lg leading-relaxed text-pretty text-slate">
          A few minutes of detail about how Xmine Consult works today helps us
          design the right website and client/project tracking system the
          first time. One term below is &ldquo;CRM&rdquo; — that simply means
          a shared digital system for keeping track of clients, projects,
          site visits, and the people working on them, instead of
          spreadsheets or email. Answer only what&rsquo;s relevant to you.
        </p>
      </Container>
    </section>
  );
}
