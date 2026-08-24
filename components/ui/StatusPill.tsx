export type SolutionStatus =
  | "In Development"
  | "Early Access"
  | "Planned"
  | "Concept";

const styles: Record<SolutionStatus, string> = {
  "In Development": "border-gold/30 bg-gold/10 text-gold",
  "Early Access": "border-transparent bg-gold text-ink",
  Planned: "border-line bg-transparent text-slate",
  Concept: "border-dashed border-line bg-transparent text-slate/70",
};

export default function StatusPill({
  status,
  className = "",
}: {
  status: SolutionStatus;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[0.65rem] font-medium tracking-[0.12em] uppercase ${styles[status]} ${className}`}
    >
      <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      {status}
    </span>
  );
}
