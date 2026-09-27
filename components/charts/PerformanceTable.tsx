export type PerformanceColumn<T> = {
  key: string;
  label: string;
  align?: "left" | "right";
  render: (row: T) => string;
};

export default function PerformanceTable<T>({
  rows,
  columns,
  getRowKey,
  emptyMessage = "No results for the current filter.",
}: {
  rows: T[];
  columns: PerformanceColumn<T>[];
  getRowKey: (row: T) => string;
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return <p className="rounded-2xl border border-line bg-paper p-6 text-sm text-slate">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-paper">
      <table className="w-full min-w-[480px] text-sm">
        <thead>
          <tr className="border-b border-line">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-5 py-3 font-mono text-[0.65rem] font-medium tracking-[0.12em] text-slate/70 uppercase ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="border-b border-line last:border-b-0">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-5 py-3 text-ink ${col.align === "right" ? "text-right font-mono text-xs" : ""}`}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
