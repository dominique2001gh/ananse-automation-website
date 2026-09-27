"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CATEGORICAL_COLORS, CHART_COLORS, axisTickStyle, tooltipContentStyle, tooltipItemStyle, tooltipLabelStyle } from "./chartTheme";

export default function LocationBarChart({
  data,
  dataKey,
  name,
  formatValue,
  height = 280,
}: {
  data: Array<{ name: string } & Record<string, string | number>>;
  dataKey: string;
  name: string;
  formatValue: (value: number) => string;
  height?: number;
}) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={CHART_COLORS.line} vertical={false} />
          <XAxis dataKey="name" tick={axisTickStyle} axisLine={{ stroke: CHART_COLORS.line }} tickLine={false} />
          <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} width={64} tickFormatter={(v: number) => formatValue(v)} />
          <Tooltip
            contentStyle={tooltipContentStyle}
            labelStyle={tooltipLabelStyle}
            itemStyle={tooltipItemStyle}
            formatter={(value) => [formatValue(Number(value)), name]}
            cursor={{ fill: CHART_COLORS.paperDim }}
          />
          <Bar dataKey={dataKey} name={name} radius={[6, 6, 0, 0]} maxBarSize={56}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={CATEGORICAL_COLORS[index % CATEGORICAL_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
