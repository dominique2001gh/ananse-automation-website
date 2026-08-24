import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import { customSolutionCategories } from "@/lib/solutions-data";

export default function CustomSolutionsSection() {
  return (
    <section className="bg-paper py-20 sm:py-28">
      <Container className="flex flex-col gap-14">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <Eyebrow>Beyond Our Products</Eyebrow>
          <h2 className="text-3xl font-semibold tracking-tight text-balance text-ink sm:text-4xl">
            Your Business Doesn&rsquo;t Need to Fit Our Software.
            <br />
            Our Software Can Fit Your Business.
          </h2>
          <p className="text-base leading-relaxed text-pretty text-slate sm:text-lg">
            The products above demonstrate the kinds of systems we build —
            but Ananse Automation is not limited to those industries. If
            your business has an operational problem that existing software
            doesn&rsquo;t solve well, we can assess the workflow and
            determine whether a custom application, automation, AI agent,
            data solution or connected system makes sense.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
          {customSolutionCategories.map((category, i) => (
            <div
              key={category}
              className="flex flex-col gap-3 bg-paper px-6 py-8 transition-colors duration-200 hover:bg-paper-dim"
            >
              <span className="font-mono text-xs text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-medium text-balance text-ink">
                {category}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
