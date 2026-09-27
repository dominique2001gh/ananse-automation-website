import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import {
  IconUsers,
  IconGlobe,
  IconCalendar,
  IconBag,
  IconReceipt,
  IconSpreadsheet,
  IconDatabase,
  IconCube,
} from "@/components/graphics/icons";
import type { ComponentType, SVGProps } from "react";

const SYSTEMS: { label: string; icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { label: "CRM", icon: IconUsers },
  { label: "Website", icon: IconGlobe },
  { label: "Booking System", icon: IconCalendar },
  { label: "POS / Sales", icon: IconBag },
  { label: "Accounting Software", icon: IconReceipt },
  { label: "Spreadsheets", icon: IconSpreadsheet },
  { label: "Databases", icon: IconDatabase },
  { label: "Other Systems", icon: IconCube },
];

export default function AlreadyHaveSoftware() {
  return (
    <section className="bg-paper py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <Eyebrow>No Rip-and-Replace</Eyebrow>
          <h2 className="text-3xl font-semibold tracking-tight text-balance text-ink sm:text-4xl">
            Already Have Software? That&rsquo;s Fine.
          </h2>
          <p className="text-base leading-relaxed text-pretty text-slate sm:text-lg">
            Ananse can work with information from the systems you already
            run — your CRM, booking system, point of sale, accounting
            software, spreadsheets, website, or an internal database. You
            don&rsquo;t need to replace anything to get better answers out
            of it.
          </p>
          <p className="rounded-2xl border border-line bg-paper-dim p-6 text-base leading-relaxed text-ink sm:text-lg">
            We build analytics around your questions — not the other way
            around.
          </p>
        </div>

        <div className="flex flex-col gap-5 lg:col-span-7">
          <p className="font-mono text-xs font-medium tracking-[0.2em] text-slate/70 uppercase">
            Works With What You Already Use
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {SYSTEMS.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-paper-dim px-4 py-5 text-center"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-gold-bright">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium text-ink">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
