"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_COLORS, axisTickStyle, tooltipContentStyle, tooltipItemStyle, tooltipLabelStyle } from "./chartTheme";

export default function TrendLineChart({
  data,
  dataKey,
  name,
  color = CHART_COLORS.gold,
  formatValue,
  height = 280,
}: {
  data: Array<Record<string, string | number>>;
  dataKey: string;
  name: string;
  color?: string;
  formatValue: (value: number) => string;
  height?: number;
}) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={CHART_COLORS.line} vertical={false} />
          <XAxis dataKey="label" tick={axisTickStyle} axisLine={{ stroke: CHART_COLORS.line }} tickLine={false} interval="preserveStartEnd" />
          <YAxis
            tick={axisTickStyle}
            axisLine={false}
            tickLine={false}
            width={64}
            tickFormatter={(v: number) => formatValue(v)}
          />
          <Tooltip
            contentStyle={tooltipContentStyle}
            labelStyle={tooltipLabelStyle}
            itemStyle={tooltipItemStyle}
            formatter={(value) => [formatValue(Number(value)), name]}
            cursor={{ stroke: CHART_COLORS.line }}
          />
          <Line type="monotone" dataKey={dataKey} name={name} stroke={color} strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
