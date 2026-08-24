export default function Eyebrow({
  children,
  tone = "light",
}: {
  children: string;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-xs font-medium tracking-[0.2em] uppercase ${
        tone === "dark" ? "text-gold-bright" : "text-gold"
      }`}
    >
      <span aria-hidden className="h-px w-6 bg-current" />
      {children}
    </span>
  );
}
