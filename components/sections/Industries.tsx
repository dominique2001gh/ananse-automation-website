import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const industries = [
  "Hospitality",
  "Restaurants",
  "Logistics",
  "Professional Services",
  "Accounting & Tax",
  "Legal Services",
  "Retail",
  "Healthcare & Human Services",
];

export default function Industries() {
  return (
    <section id="industries" className="bg-paper py-20 sm:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Who We Serve"
          title="Industries We Understand"
          description="Small and mid-sized businesses across sectors where day-to-day operations still run on manual work and disconnected tools."
          align="center"
          className="mx-auto"
        />

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
          {industries.map((industry, i) => (
            <div
              key={industry}
              className="flex flex-col gap-3 bg-paper px-6 py-8 transition-colors duration-200 hover:bg-paper-dim"
            >
              <span className="font-mono text-xs text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-medium text-balance text-ink">
                {industry}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
