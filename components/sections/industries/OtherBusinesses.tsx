import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import { otherBusinessExamples } from "@/lib/industries-data";

export default function OtherBusinesses() {
  return (
    <section className="bg-paper py-20 sm:py-28">
      <Container className="flex flex-col gap-14">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <Eyebrow>Don&rsquo;t See Your Industry?</Eyebrow>
          <h2 className="text-3xl font-semibold tracking-tight text-balance text-ink sm:text-4xl">
            We Start With the Workflow,
            <br />
            Not the Industry Label.
          </h2>
          <p className="text-base leading-relaxed text-pretty text-slate sm:text-lg">
            The industries above are examples, not limitations. If your
            business relies on people, processes, spreadsheets, customer
            communication, data or disconnected software, there may be an
            opportunity to improve how the operation works.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
          {otherBusinessExamples.map((example, i) => (
            <div
              key={example}
              className="flex flex-col gap-3 bg-paper px-6 py-8 transition-colors duration-200 hover:bg-paper-dim"
            >
              <span className="font-mono text-xs text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-medium text-balance text-ink">
                {example}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
