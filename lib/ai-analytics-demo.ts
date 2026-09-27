/**
 * Deterministic "Ask Your Data" matcher for the /analytics demo section.
 *
 * Same philosophy as lib/ai-topics.ts: this is NOT an LLM and doesn't
 * pretend to be one. Every answer is computed live from
 * lib/analytics-demo-engine.ts against the fictional dataset and the
 * dashboard's current filter state -- never a hardcoded string dressed up
 * as an insight. That's what lets this run entirely client-side today
 * while staying honest, and it's also why swapping in a real backend
 * later only means replacing `answerQuestion()`'s body: the call site
 * (components/sections/analytics/AskYourData.tsx) just awaits a
 * { text } answer and doesn't know or care how it was produced.
 */

import { MONTH_KEYS } from "./analytics-demo-data";
import {
  type AnalyticsFilters,
  computeSummary,
  monthLabel,
  locationPerformance,
  cancellationByLocation,
  lapsedCustomers,
  busiestDays,
  servicePairings,
  compareQuarters,
  fastestGrowingServices,
  formatCurrency,
  formatPercent,
} from "./analytics-demo-engine";

export type DemoAnswer = { id: string; text: string };

export type ExampleQuestion = { id: string; question: string };

export const EXAMPLE_QUESTIONS: ExampleQuestion[] = [
  { id: "revenue-decrease", question: "Why did revenue decrease last month?" },
  { id: "fastest-growing", question: "What were our fastest-growing services this quarter?" },
  { id: "cancellation-location", question: "Which location has the highest cancellation rate?" },
  { id: "lapsed-customers", question: "Which customers haven't returned recently?" },
  { id: "busiest-days", question: "What are our busiest days?" },
  { id: "pairings", question: "Which services are commonly purchased together?" },
  { id: "quarter-compare", question: "Compare this quarter with last quarter." },
  { id: "attention", question: "What should management pay attention to this month?" },
];

function monthOverMonthRevenue(filters: AnalyticsFilters) {
  const lastKey = MONTH_KEYS[MONTH_KEYS.length - 1];
  const prevKey = MONTH_KEYS[MONTH_KEYS.length - 2];
  const last = computeSummary({ ...filters, startMonth: lastKey, endMonth: lastKey });
  const prev = computeSummary({ ...filters, startMonth: prevKey, endMonth: prevKey });
  const deltaPct = prev.revenue > 0 ? ((last.revenue - prev.revenue) / prev.revenue) * 100 : null;
  return { lastKey, prevKey, last, prev, deltaPct };
}

function revenueDecreaseAnswer(filters: AnalyticsFilters): string {
  const { lastKey, prevKey, last, prev, deltaPct } = monthOverMonthRevenue(filters);
  const lastLabel = monthLabel(lastKey);
  const prevLabel = monthLabel(prevKey);

  if (last.revenue >= prev.revenue) {
    return `Revenue actually held steady or grew: ${lastLabel} came in at ${formatCurrency(last.revenue)}, ${
      last.revenue === prev.revenue ? "flat" : `up ${formatPercent(deltaPct)}`
    } versus ${prevLabel} (${formatCurrency(prev.revenue)}) for the current filter. No decline to explain here.`;
  }

  let contributor = "";
  if (filters.locationId === "all") {
    const lastLocs = locationPerformance({ ...filters, startMonth: lastKey, endMonth: lastKey });
    const prevLocs = locationPerformance({ ...filters, startMonth: prevKey, endMonth: prevKey });
    let worst: { name: string; delta: number; prevCancel: number; currCancel: number; prevCompleted: number; currCompleted: number } | null = null;
    for (const loc of lastLocs) {
      const prevLoc = prevLocs.find((p) => p.locationId === loc.locationId);
      if (!prevLoc) continue;
      const delta = loc.revenue - prevLoc.revenue;
      if (!worst || delta < worst.delta) {
        worst = {
          name: loc.name,
          delta,
          prevCancel: prevLoc.cancellationRatePct,
          currCancel: loc.cancellationRatePct,
          prevCompleted: prevLoc.completed,
          currCompleted: loc.completed,
        };
      }
    }
    if (worst && worst.delta < 0) {
      contributor = ` Most of the decline was concentrated at ${worst.name} (${formatCurrency(Math.abs(worst.delta))} lower than ${prevLabel}), where the cancellation/no-show rate moved from ${worst.prevCancel.toFixed(1)}% to ${worst.currCancel.toFixed(1)}% and completed appointments fell from ${worst.prevCompleted} to ${worst.currCompleted}.`;
    }
  } else {
    contributor = ` Within this filter, the cancellation/no-show rate moved from ${prev.cancellationRatePct.toFixed(1)}% to ${last.cancellationRatePct.toFixed(1)}%, and completed appointments fell from ${prev.servicesCompleted} to ${last.servicesCompleted}.`;
  }

  return `Revenue in ${lastLabel} was ${formatCurrency(last.revenue)}, down ${formatCurrency(prev.revenue - last.revenue)} (${formatPercent(deltaPct)}) from ${prevLabel} (${formatCurrency(prev.revenue)}).${contributor}`;
}

function fastestGrowingAnswer(filters: AnalyticsFilters): string {
  const rows = fastestGrowingServices(filters).filter((r) => r.growthPct !== null);
  if (rows.length === 0) {
    return "There isn't enough quarter-over-quarter history yet in the current filter to compare service growth.";
  }
  const top = rows.slice(0, 3);
  const lines = top.map(
    (r) => `${r.name}: ${formatPercent(r.growthPct)} (${formatCurrency(r.previousRevenue)} → ${formatCurrency(r.currentRevenue)})`
  );
  return `Fastest-growing services this quarter versus last quarter:\n${lines.join("\n")}`;
}

function cancellationLocationAnswer(filters: AnalyticsFilters): string {
  const ranked = cancellationByLocation(filters);
  if (ranked.length === 0) return "No location data available for the current filter.";
  const top = ranked[0];
  const rest = ranked.slice(1);
  const restText = rest.length > 0 ? ` For comparison: ${rest.map((r) => `${r.name} ${r.cancellationRatePct.toFixed(1)}%`).join(", ")}.` : "";
  return `${top.name} has the highest cancellation/no-show rate at ${top.cancellationRatePct.toFixed(1)}% over the selected period.${restText}`;
}

function lapsedCustomersAnswer(filters: AnalyticsFilters): string {
  const result = lapsedCustomers(filters, 60);
  if (result.totalActiveCustomers === 0) return "No customer history available for the current filter.";
  const sharePct = (result.lapsedCount / result.totalActiveCustomers) * 100;
  return `${result.lapsedCount} of ${result.totalActiveCustomers} customers (${sharePct.toFixed(0)}%) haven't returned in over ${result.thresholdDays} days. Historically, that group averaged ${formatCurrency(result.avgHistoricalSpend)} in total spend each -- a reasonable re-engagement target.`;
}

function busiestDaysAnswer(filters: AnalyticsFilters): string {
  const ranked = busiestDays(filters);
  const busiest = ranked.slice(0, 2);
  const quietest = ranked[ranked.length - 1];
  if (busiest.every((d) => d.count === 0)) return "Not enough completed appointments in the current filter to identify a pattern.";
  return `Busiest days are ${busiest.map((d) => `${d.day} (${d.count} appointments)`).join(" and ")}. ${quietest.day} is the quietest, with ${quietest.count} completed appointments over the selected period.`;
}

function pairingsAnswer(filters: AnalyticsFilters): string {
  const pairs = servicePairings(filters, 3);
  if (pairs.length === 0) {
    return "Not enough overlapping purchases in the current filter to identify a reliable pattern -- try widening the date range or clearing a filter.";
  }
  const lines = pairs.map((p) => `${p.serviceA} + ${p.serviceB} (${p.count} shared customer-months)`);
  return `Commonly purchased together in the current filter:\n${lines.join("\n")}`;
}

function quarterCompareAnswer(filters: AnalyticsFilters): string {
  const comparison = compareQuarters(filters);
  if (!comparison) return "Not enough quarterly history yet in the current filter to compare.";
  const { current, previous, currentLabel, previousLabel } = comparison;
  const revenueDeltaPct = previous.revenue > 0 ? ((current.revenue - previous.revenue) / previous.revenue) * 100 : null;
  return [
    `${currentLabel} vs ${previousLabel}:`,
    `Revenue: ${formatCurrency(current.revenue)} vs ${formatCurrency(previous.revenue)} (${formatPercent(revenueDeltaPct)})`,
    `Customers served: ${current.customersServed} vs ${previous.customersServed}`,
    `Avg. customer value: ${formatCurrency(current.avgCustomerValue)} vs ${formatCurrency(previous.avgCustomerValue)}`,
    `Cancellation rate: ${current.cancellationRatePct.toFixed(1)}% vs ${previous.cancellationRatePct.toFixed(1)}%`,
  ].join("\n");
}

function managementAttentionAnswer(filters: AnalyticsFilters): string {
  const bullets: string[] = [];

  const mom = monthOverMonthRevenue(filters);
  if (mom.deltaPct !== null && mom.deltaPct < -3) {
    bullets.push(`Revenue dipped ${formatPercent(mom.deltaPct)} in ${monthLabel(mom.lastKey)} versus the month before -- worth a closer look at what changed.`);
  }

  const cancelRanking = cancellationByLocation(filters);
  if (cancelRanking.length > 0 && cancelRanking[0].cancellationRatePct > 20) {
    bullets.push(`${cancelRanking[0].name} has an elevated cancellation/no-show rate of ${cancelRanking[0].cancellationRatePct.toFixed(1)}%, well above the other locations.`);
  }

  const lapsed = lapsedCustomers(filters, 60);
  if (lapsed.totalActiveCustomers > 0 && lapsed.lapsedCount / lapsed.totalActiveCustomers > 0.15) {
    const sharePct = (lapsed.lapsedCount / lapsed.totalActiveCustomers) * 100;
    bullets.push(`${lapsed.lapsedCount} customers (${sharePct.toFixed(0)}% of the active base) haven't returned in over 60 days.`);
  }

  const declining = fastestGrowingServices(filters)
    .filter((r) => r.growthPct !== null && r.growthPct < 0)
    .sort((a, b) => (a.growthPct ?? 0) - (b.growthPct ?? 0))[0];
  if (declining) {
    bullets.push(`${declining.name} revenue is down ${formatPercent(declining.growthPct)} quarter-over-quarter.`);
  }

  if (bullets.length === 0) {
    return "No major red flags this period -- revenue, retention, and cancellations are all tracking within a normal range for the current filter.";
  }
  return bullets.join("\n");
}

function overviewFallback(filters: AnalyticsFilters): string {
  const summary = computeSummary(filters);
  return [
    `I can only answer from the sample data above, but here's the current snapshot for your filter:`,
    `Revenue: ${formatCurrency(summary.revenue)} (${formatPercent(summary.revenueGrowthPct)} vs the prior period)`,
    `Customers served: ${summary.customersServed}, ${summary.newCustomers} new / ${summary.returningCustomers} returning`,
    `Cancellation rate: ${summary.cancellationRatePct.toFixed(1)}%`,
    `Try one of the example questions below, or ask about revenue, retention, cancellations, team or location performance, or trends.`,
  ].join("\n");
}

type Handler = { id: string; keywords: string[]; run: (filters: AnalyticsFilters) => string };

const HANDLERS: Handler[] = [
  { id: "quarter-compare", keywords: ["compare", "this quarter", "last quarter", "quarter over quarter", "q/q"], run: quarterCompareAnswer },
  { id: "attention", keywords: ["pay attention", "should i know", "should management", "watch out", "focus on", "worry about"], run: managementAttentionAnswer },
  { id: "revenue-decrease", keywords: ["revenue decrease", "revenue drop", "revenue down", "why did revenue", "sales decrease", "sales drop"], run: revenueDecreaseAnswer },
  { id: "fastest-growing", keywords: ["fastest-growing", "fastest growing", "growing service", "growth this quarter"], run: fastestGrowingAnswer },
  { id: "cancellation-location", keywords: ["cancellation rate", "highest cancellation", "no-show rate", "no show rate"], run: cancellationLocationAnswer },
  { id: "lapsed-customers", keywords: ["haven't returned", "havent returned", "lapsed", "not come back", "stopped coming", "churn"], run: lapsedCustomersAnswer },
  { id: "busiest-days", keywords: ["busiest day", "busiest days", "slowest day", "quietest day"], run: busiestDaysAnswer },
  { id: "pairings", keywords: ["purchased together", "bought together", "bundle", "commonly purchased", "pair well"], run: pairingsAnswer },
];

export function answerQuestion(question: string, filters: AnalyticsFilters): DemoAnswer {
  const normalized = question.toLowerCase();
  for (const handler of HANDLERS) {
    if (handler.keywords.some((k) => normalized.includes(k))) {
      return { id: handler.id, text: handler.run(filters) };
    }
  }
  return { id: "fallback", text: overviewFallback(filters) };
}

export function answerExampleQuestion(id: string, filters: AnalyticsFilters): DemoAnswer {
  const handler = HANDLERS.find((h) => h.id === id);
  if (!handler) return { id: "fallback", text: overviewFallback(filters) };
  return { id: handler.id, text: handler.run(filters) };
}
