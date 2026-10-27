import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import NetworkMesh from "@/components/graphics/NetworkMesh";

export default function DashPostalQuestionnaireHero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <NetworkMesh
        tone="light"
        className="pointer-events-none absolute -right-24 -top-24 h-[24rem] w-[24rem] opacity-70 lg:h-[28rem] lg:w-[28rem]"
      />

      <Container className="relative flex flex-col gap-6 py-16 sm:py-20 lg:py-24">
        <Eyebrow>Project Discovery</Eyebrow>

        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-ink sm:text-5xl">
          Dash Postal and Tax Services — Project Discovery
        </h1>

        <p className="max-w-xl text-lg leading-relaxed text-pretty text-slate">
          Ahead of our consultation, a few minutes of detail about your business
          and what you&rsquo;d like your new website and systems to do helps us
          come prepared with the right recommendations. This takes about 5–7
          minutes, and you can skip anything that doesn&rsquo;t apply — nothing
          here asks for tax documents, account numbers, Social Security
          numbers, or any other sensitive customer records.
        </p>
      </Container>
    </section>
  );
}
