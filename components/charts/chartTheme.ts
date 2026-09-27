/**
 * Shared Recharts styling so every chart on the site reads as one system
 * instead of the library's own defaults -- literal hex values (not
 * Tailwind classes) because Recharts consumes them as SVG paint
 * attributes, but sourced from the same palette as app/globals.css.
 */

export const CHART_COLORS = {
  ink: "#17140f",
  slate: "#5c5648",
  slateInvert: "#c9c1ae",
  line: "#e6dfd0",
  paper: "#faf8f4",
  paperDim: "#f2ede4",
  gold: "#b3812f",
  goldBright: "#d3a355",
  terracotta: "#a65332",
  forest: "#4f6a4f",
};

/** Category order used across bar/donut charts so a given series (e.g. a
 * specific location or service) keeps the same color in every chart. */
export const CATEGORICAL_COLORS = [
  CHART_COLORS.gold,
  CHART_COLORS.forest,
  CHART_COLORS.terracotta,
  CHART_COLORS.goldBright,
  CHART_COLORS.slate,
];

const fontFamily = "var(--font-sans)";

export const axisTickStyle = { fontSize: 12, fill: CHART_COLORS.slate, fontFamily };

export const tooltipContentStyle = {
  background: CHART_COLORS.ink,
  border: "none",
  borderRadius: 12,
  color: CHART_COLORS.paper,
  fontSize: 13,
  fontFamily,
  padding: "10px 14px",
  boxShadow: "0 12px 32px -16px rgba(23,20,15,0.45)",
};

export const tooltipLabelStyle = { color: CHART_COLORS.slateInvert, marginBottom: 4, fontWeight: 500 };

export const tooltipItemStyle = { color: CHART_COLORS.paper };
