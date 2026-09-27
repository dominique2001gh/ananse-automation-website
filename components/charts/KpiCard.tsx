export type DeltaTone = "positive" | "negative" | "neutral";

const deltaStyles: Record<DeltaTone, string> = {
  positive: "text-forest",
  negative: "text-terracotta",
  neutral: "text-slate",
};

export default function KpiCard({
  label,
  value,
  deltaLabel,
  deltaTone = "neutral",
  helpText,
}: {
  label: string;
  value: string;
  deltaLabel?: string;
  deltaTone?: DeltaTone;
  helpText?: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-line bg-paper p-5">
      <p className="font-mono text-[0.65rem] font-medium tracking-[0.14em] text-slate/70 uppercase">{label}</p>
      <p className="text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]">{value}</p>
      {deltaLabel ? (
        <p className={`text-xs font-medium ${deltaStyles[deltaTone]}`}>{deltaLabel}</p>
      ) : helpText ? (
        <p className="text-xs text-slate">{helpText}</p>
      ) : null}
    </div>
  );
}
