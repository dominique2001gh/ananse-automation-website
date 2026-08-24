import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import NetworkMesh from "@/components/graphics/NetworkMesh";

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <NetworkMesh
        tone="light"
        className="pointer-events-none absolute -right-24 -top-24 h-[24rem] w-[24rem] opacity-70 lg:h-[28rem] lg:w-[28rem]"
      />

      <Container className="relative flex flex-col gap-7 py-16 sm:py-20 lg:py-24">
        <Eyebrow>Let&rsquo;s Talk</Eyebrow>

        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-ink sm:text-5xl">
          Tell Us What&rsquo;s Slowing Your Business Down.
        </h1>

        <p className="max-w-xl text-lg leading-relaxed text-pretty text-slate">
          You don&rsquo;t need to know which technology you need. Tell us
          what you&rsquo;re trying to improve, automate, understand, or
          build — and we&rsquo;ll help determine the right approach.
        </p>

        <div className="mt-2">
          <Button href="#inquiry-form">Start the Conversation</Button>
        </div>
      </Container>
    </section>
  );
}
