import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import NetworkMesh from "@/components/graphics/NetworkMesh";

export default function FinalCta({
  eyebrow,
  headline = "There’s Probably a Better Way to Run It.",
  copy = "Tell us what’s slowing your business down. We’ll help you determine whether better data, automation, AI, a website or custom software can solve it.",
  buttonLabel = "Let’s Discuss Your Business",
  // Every page except /contact itself uses this default. It used to be
  // "#contact" -- a self-referencing anchor to the section this very
  // button lives in, which visibly did nothing when clicked. It now sends
  // the visitor to the real contact form on the dedicated Contact page.
  buttonHref = "/contact#inquiry-form",
}: {
  eyebrow?: string;
  headline?: ReactNode;
  copy?: ReactNode;
  buttonLabel?: ReactNode;
  buttonHref?: string;
}) {
  return (
    <section id="contact" className="bg-paper py-20 sm:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-16 sm:px-14 sm:py-20">
          <NetworkMesh
            tone="dark"
            className="pointer-events-none absolute -right-20 -top-20 h-[26rem] w-[26rem] opacity-60"
          />

          <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex max-w-xl flex-col gap-5">
              {eyebrow ? <Eyebrow tone="dark">{eyebrow}</Eyebrow> : null}
              <h2 className="text-3xl font-semibold tracking-tight text-balance text-paper sm:text-4xl">
                {headline}
              </h2>
              <p className="text-base leading-relaxed text-pretty text-slate-invert sm:text-lg">
                {copy}
              </p>
            </div>

            <Button href={buttonHref} tone="dark" className="shrink-0">
              {buttonLabel}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
