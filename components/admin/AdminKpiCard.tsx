export default function AdminKpiCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-6">
      <p className="font-mono text-xs font-medium tracking-[0.15em] text-slate uppercase">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-ink">{value.toLocaleString()}</p>
    </div>
  );
}
