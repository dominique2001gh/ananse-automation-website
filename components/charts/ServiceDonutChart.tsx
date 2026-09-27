"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CATEGORICAL_COLORS, tooltipContentStyle, tooltipItemStyle, tooltipLabelStyle } from "./chartTheme";

export default function ServiceDonutChart({
  data,
  formatValue,
  height = 260,
}: {
  data: Array<{ name: string; value: number; sharePct: number }>;
  formatValue: (value: number) => string;
  height?: number;
}) {
  const hasData = data.some((d) => d.value > 0);

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
      <div style={{ height, width: height }} className="mx-auto shrink-0 sm:mx-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={hasData ? data : [{ name: "No data", value: 1, sharePct: 0 }]}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="100%"
              paddingAngle={hasData ? 2 : 0}
              stroke="none"
            >
              {(hasData ? data : [{ name: "No data" }]).map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={hasData ? CATEGORICAL_COLORS[index % CATEGORICAL_COLORS.length] : "#e6dfd0"}
                />
              ))}
            </Pie>
            {hasData ? (
              <Tooltip
                contentStyle={tooltipContentStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
                formatter={(value, _name, item) => {
                  const payload = item.payload as { name: string; sharePct: number };
                  return [`${formatValue(Number(value))} (${payload.sharePct.toFixed(0)}%)`, payload.name];
                }}
              />
            ) : null}
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="flex flex-1 flex-col gap-3">
        {data.map((entry, index) => (
          <li key={entry.name} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2.5 text-ink">
              <span
                aria-hidden
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: CATEGORICAL_COLORS[index % CATEGORICAL_COLORS.length] }}
              />
              {entry.name}
            </span>
            <span className="font-mono text-xs text-slate">{entry.sharePct.toFixed(0)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
