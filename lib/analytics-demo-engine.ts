/**
 * Pure aggregation/filtering layer over the fictional dataset in
 * lib/analytics-demo-data.ts. Every function here derives its output from
 * the raw bookings array given a filter state -- nothing is pre-baked per
 * filter combination, which is what makes the live dashboard demo and the
 * "Ask Your Data" answers (lib/ai-analytics-demo.ts) actually respond to
 * the controls instead of swapping between static screenshots.
 */

import {
  BOOKINGS,
  LOCATIONS,
  SERVICES,
  TEAM_MEMBERS,
  MONTH_KEYS,
  type Booking,
} from "./analytics-demo-data";

export type CustomerType = "all" | "new" | "returning";

export type AnalyticsFilters = {
  startMonth: string;
  endMonth: string;
  locationId: string; // "all" | Location["id"]
  serviceId: string; // "all" | Service["id"]
  teamMemberId: string; // "all" | TeamMember["id"]
  customerType: CustomerType;
};

export type DateRangePresetId = "last3" | "last6" | "last12" | "all";

export const DATE_RANGE_PRESETS: { id: DateRangePresetId; label: string }[] = [
  { id: "last3", label: "Last 3 Months" },
  { id: "last6", label: "Last 6 Months" },
  { id: "last12", label: "Last 12 Months" },
  { id: "all", label: "All Time" },
];

export function presetToRange(preset: DateRangePresetId): { startMonth: string; endMonth: string } {
  const endMonth = MONTH_KEYS[MONTH_KEYS.length - 1];
  const span = preset === "last3" ? 3 : preset === "last6" ? 6 : preset === "last12" ? 12 : MONTH_KEYS.length;
  const startIndex = Math.max(0, MONTH_KEYS.length - span);
  return { startMonth: MONTH_KEYS[startIndex], endMonth };
}

export const DEFAULT_FILTERS: AnalyticsFilters = {
  ...presetToRange("last6"),
  locationId: "all",
  serviceId: "all",
  teamMemberId: "all",
  customerType: "all",
};

export const LATEST_DATE = BOOKINGS[BOOKINGS.length - 1].date;

export function monthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function matchesDims(b: Booking, filters: Pick<AnalyticsFilters, "locationId" | "serviceId" | "teamMemberId" | "customerType">): boolean {
  if (filters.locationId !== "all" && b.locationId !== filters.locationId) return false;
  if (filters.serviceId !== "all" && b.serviceId !== filters.serviceId) return false;
  if (filters.teamMemberId !== "all" && b.teamMemberId !== filters.teamMemberId) return false;
  if (filters.customerType === "new" && !b.isFirstVisit) return false;
  if (filters.customerType === "returning" && b.isFirstVisit) return false;
  return true;
}

export function filterBookings(filters: AnalyticsFilters): Booking[] {
  return BOOKINGS.filter(
    (b) => b.monthKey >= filters.startMonth && b.monthKey <= filters.endMonth && matchesDims(b, filters)
  );
}

/** Same-length window immediately preceding the given range, or null if
 * the dataset doesn't extend far enough back for a fair comparison. */
export function previousRange(startMonth: string, endMonth: string): { startMonth: string; endMonth: string } | null {
  const startIdx = MONTH_KEYS.indexOf(startMonth);
  const endIdx = MONTH_KEYS.indexOf(endMonth);
  if (startIdx === -1 || endIdx === -1) return null;
  const length = endIdx - startIdx + 1;
  const prevEndIdx = startIdx - 1;
  const prevStartIdx = prevEndIdx - length + 1;
  if (prevStartIdx < 0) return null;
  return { startMonth: MONTH_KEYS[prevStartIdx], endMonth: MONTH_KEYS[prevEndIdx] };
}

function completedRevenue(bookings: Booking[]): number {
  return bookings.reduce((sum, b) => (b.status === "completed" ? sum + b.revenue : sum), 0);
}

function servedCustomerSet(bookings: Booking[]): Set<string> {
  const set = new Set<string>();
  for (const b of bookings) if (b.status === "completed") set.add(b.customerId);
  return set;
}

function newCustomerSet(bookings: Booking[]): Set<string> {
  const set = new Set<string>();
  for (const b of bookings) if (b.status === "completed" && b.isFirstVisit) set.add(b.customerId);
  return set;
}

export type KpiSummary = {
  revenue: number;
  revenueGrowthPct: number | null;
  customersServed: number;
  newCustomers: number;
  returningCustomers: number;
  retentionRatePct: number | null;
  avgCustomerValue: number;
  servicesCompleted: number;
  cancellationRatePct: number;
  attemptedBookings: number;
};

export function computeSummary(filters: AnalyticsFilters): KpiSummary {
  const current = filterBookings(filters);
  const prevRange = previousRange(filters.startMonth, filters.endMonth);
  const previous = prevRange ? filterBookings({ ...filters, ...prevRange }) : [];

  const revenue = completedRevenue(current);
  const prevRevenue = completedRevenue(previous);
  const revenueGrowthPct = prevRange && prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : null;

  const servedSet = servedCustomerSet(current);
  const newSet = newCustomerSet(current);
  const customersServed = servedSet.size;
  const newCustomers = newSet.size;
  const returningCustomers = customersServed - newCustomers;

  let retentionRatePct: number | null = null;
  if (prevRange) {
    const retentionFilters = { ...filters, customerType: "all" as CustomerType };
    const prevServed = servedCustomerSet(filterBookings({ ...retentionFilters, ...prevRange }));
    const currServedAll = servedCustomerSet(filterBookings(retentionFilters));
    if (prevServed.size > 0) {
      let retained = 0;
      for (const id of prevServed) if (currServedAll.has(id)) retained++;
      retentionRatePct = (retained / prevServed.size) * 100;
    }
  }

  const servicesCompleted = current.filter((b) => b.status === "completed").length;
  const attemptedBookings = current.length;
  const nonCompleted = current.filter((b) => b.status !== "completed").length;
  const cancellationRatePct = attemptedBookings > 0 ? (nonCompleted / attemptedBookings) * 100 : 0;
  const avgCustomerValue = customersServed > 0 ? revenue / customersServed : 0;

  return {
    revenue,
    revenueGrowthPct,
    customersServed,
    newCustomers,
    returningCustomers,
    retentionRatePct,
    avgCustomerValue,
    servicesCompleted,
    cancellationRatePct,
    attemptedBookings,
  };
}

export type ServiceRanking = { serviceId: string; name: string; revenue: number; count: number; sharePct: number };

export function mostPopularServices(filters: AnalyticsFilters): ServiceRanking[] {
  const current = filterBookings(filters).filter((b) => b.status === "completed");
  const totalRevenue = completedRevenue(current) || 1;
  return SERVICES.map((service) => {
    const rows = current.filter((b) => b.serviceId === service.id);
    const revenue = completedRevenue(rows);
    return {
      serviceId: service.id,
      name: service.name,
      revenue,
      count: rows.length,
      sharePct: (revenue / totalRevenue) * 100,
    };
  }).sort((a, b) => b.revenue - a.revenue);
}

export type TeamPerformanceRow = {
  teamMemberId: string;
  name: string;
  locationName: string;
  completed: number;
  revenue: number;
};

export function teamPerformance(filters: AnalyticsFilters): TeamPerformanceRow[] {
  const current = filterBookings(filters).filter((b) => b.status === "completed");
  return TEAM_MEMBERS.filter((tm) => filters.teamMemberId === "all" || tm.id === filters.teamMemberId)
    .filter((tm) => filters.locationId === "all" || tm.locationId === filters.locationId)
    .map((tm) => {
      const rows = current.filter((b) => b.teamMemberId === tm.id);
      const location = LOCATIONS.find((l) => l.id === tm.locationId)!;
      return {
        teamMemberId: tm.id,
        name: tm.name,
        locationName: location.name,
        completed: rows.length,
        revenue: completedRevenue(rows),
      };
    })
    .sort((a, b) => b.revenue - a.revenue);
}

export type LocationPerformanceRow = {
  locationId: string;
  name: string;
  revenue: number;
  completed: number;
  cancellationRatePct: number;
};

export function locationPerformance(filters: AnalyticsFilters): LocationPerformanceRow[] {
  return LOCATIONS.filter((loc) => filters.locationId === "all" || loc.id === filters.locationId).map((loc) => {
    const rows = filterBookings({ ...filters, locationId: loc.id });
    const completedRows = rows.filter((b) => b.status === "completed");
    const nonCompleted = rows.length - completedRows.length;
    return {
      locationId: loc.id,
      name: loc.name,
      revenue: completedRevenue(completedRows),
      completed: completedRows.length,
      cancellationRatePct: rows.length > 0 ? (nonCompleted / rows.length) * 100 : 0,
    };
  });
}

export type TrendPoint = { monthKey: string; label: string; revenue: number; completed: number; customers: number };

/** Ignores the date-range portion of `filters` on purpose -- the trend
 * chart always shows the full history for context, even while KPI cards
 * above it are scoped to a narrower window. */
export function monthlyTrend(filters: AnalyticsFilters): TrendPoint[] {
  return MONTH_KEYS.map((monthKey) => {
    const rows = BOOKINGS.filter((b) => b.monthKey === monthKey && matchesDims(b, filters));
    const completedRows = rows.filter((b) => b.status === "completed");
    return {
      monthKey,
      label: monthLabel(monthKey),
      revenue: completedRevenue(completedRows),
      completed: completedRows.length,
      customers: servedCustomerSet(completedRows).size,
    };
  });
}

function quarterKeyForMonth(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  const quarter = Math.ceil(month / 3);
  return `${year}-Q${quarter}`;
}

export type QuarterPoint = { quarterKey: string; label: string; revenue: number; completed: number; customers: number };

export function quarterlyTrend(filters: AnalyticsFilters): QuarterPoint[] {
  const months = monthlyTrend(filters);
  const byQuarter = new Map<string, QuarterPoint>();
  for (const m of months) {
    const quarterKey = quarterKeyForMonth(m.monthKey);
    const existing = byQuarter.get(quarterKey);
    if (existing) {
      existing.revenue += m.revenue;
      existing.completed += m.completed;
      existing.customers += m.customers; // approximate: sums monthly uniques
    } else {
      byQuarter.set(quarterKey, { quarterKey, label: quarterKey, revenue: m.revenue, completed: m.completed, customers: m.customers });
    }
  }
  return Array.from(byQuarter.values());
}

export type ServicePairing = { serviceA: string; serviceB: string; count: number };

export function servicePairings(filters: AnalyticsFilters, limit = 3): ServicePairing[] {
  const current = filterBookings(filters).filter((b) => b.status === "completed");
  const baskets = new Map<string, Set<string>>();
  for (const b of current) {
    const key = `${b.customerId}|${b.monthKey}`;
    if (!baskets.has(key)) baskets.set(key, new Set());
    baskets.get(key)!.add(b.serviceId);
  }
  const pairCounts = new Map<string, number>();
  for (const services of baskets.values()) {
    const ids = Array.from(services);
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const [a, b] = [ids[i], ids[j]].sort();
        const key = `${a}|${b}`;
        pairCounts.set(key, (pairCounts.get(key) ?? 0) + 1);
      }
    }
  }
  const nameOf = (id: string) => SERVICES.find((s) => s.id === id)!.name;
  return Array.from(pairCounts.entries())
    .map(([key, count]) => {
      const [a, b] = key.split("|");
      return { serviceA: nameOf(a), serviceB: nameOf(b), count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export type BusiestDayRow = { day: string; count: number; revenue: number };
const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function busiestDays(filters: AnalyticsFilters): BusiestDayRow[] {
  const current = filterBookings(filters).filter((b) => b.status === "completed");
  const counts = new Array(7).fill(0);
  const revenues = new Array(7).fill(0);
  for (const b of current) {
    const weekday = new Date(`${b.date}T00:00:00`).getDay();
    counts[weekday]++;
    revenues[weekday] += b.revenue;
  }
  return WEEKDAY_NAMES.map((day, i) => ({ day, count: counts[i], revenue: revenues[i] })).sort(
    (a, b) => b.count - a.count
  );
}

export type LapsedCustomerSummary = {
  thresholdDays: number;
  lapsedCount: number;
  totalActiveCustomers: number;
  avgHistoricalSpend: number;
};

export function lapsedCustomers(filters: AnalyticsFilters, thresholdDays = 60): LapsedCustomerSummary {
  const dims = { locationId: filters.locationId, serviceId: filters.serviceId, teamMemberId: filters.teamMemberId, customerType: "all" as CustomerType };
  const relevant = BOOKINGS.filter((b) => b.status === "completed" && matchesDims(b, dims));
  const lastVisit = new Map<string, string>();
  const totalSpend = new Map<string, number>();
  for (const b of relevant) {
    const prev = lastVisit.get(b.customerId);
    if (!prev || b.date > prev) lastVisit.set(b.customerId, b.date);
    totalSpend.set(b.customerId, (totalSpend.get(b.customerId) ?? 0) + b.revenue);
  }
  const latest = new Date(`${LATEST_DATE}T00:00:00`).getTime();
  const msPerDay = 86400000;
  let lapsedCount = 0;
  let lapsedSpendTotal = 0;
  for (const [customerId, date] of lastVisit.entries()) {
    const daysSince = Math.round((latest - new Date(`${date}T00:00:00`).getTime()) / msPerDay);
    if (daysSince >= thresholdDays) {
      lapsedCount++;
      lapsedSpendTotal += totalSpend.get(customerId) ?? 0;
    }
  }
  return {
    thresholdDays,
    lapsedCount,
    totalActiveCustomers: lastVisit.size,
    avgHistoricalSpend: lapsedCount > 0 ? lapsedSpendTotal / lapsedCount : 0,
  };
}

export type ServiceGrowthRow = { serviceId: string; name: string; currentRevenue: number; previousRevenue: number; growthPct: number | null };

/** Compares the most recent calendar quarter in the dataset against the
 * one before it, per service -- ignores `filters`' own date range so "this
 * quarter" always means the dataset's actual latest quarter. */
export function fastestGrowingServices(filters: AnalyticsFilters): ServiceGrowthRow[] {
  const quarters = quarterlyTrendBoundaries();
  const current = quarters[quarters.length - 1];
  const previous = quarters[quarters.length - 2];
  return SERVICES.map((service) => {
    const svcFilters = { ...filters, serviceId: service.id };
    const currentRevenue = completedRevenue(filterBookings({ ...svcFilters, ...current }));
    const previousRevenue = completedRevenue(filterBookings({ ...svcFilters, ...previous }));
    const growthPct = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : null;
    return { serviceId: service.id, name: service.name, currentRevenue, previousRevenue, growthPct };
  }).sort((a, b) => (b.growthPct ?? -Infinity) - (a.growthPct ?? -Infinity));
}

function quarterlyTrendBoundaries(): { startMonth: string; endMonth: string }[] {
  const byQuarter = new Map<string, string[]>();
  for (const monthKey of MONTH_KEYS) {
    const q = quarterKeyForMonth(monthKey);
    if (!byQuarter.has(q)) byQuarter.set(q, []);
    byQuarter.get(q)!.push(monthKey);
  }
  return Array.from(byQuarter.values()).map((months) => ({ startMonth: months[0], endMonth: months[months.length - 1] }));
}

export type QuarterComparison = {
  currentLabel: string;
  previousLabel: string;
  current: KpiSummary;
  previous: KpiSummary;
};

export function compareQuarters(filters: AnalyticsFilters): QuarterComparison | null {
  const quarters = quarterlyTrendBoundaries();
  if (quarters.length < 2) return null;
  const current = quarters[quarters.length - 1];
  const previous = quarters[quarters.length - 2];
  return {
    currentLabel: quarterKeyForMonth(current.endMonth),
    previousLabel: quarterKeyForMonth(previous.endMonth),
    current: computeSummary({ ...filters, ...current }),
    previous: computeSummary({ ...filters, ...previous }),
  };
}

export type LocationCancellationRow = { locationId: string; name: string; cancellationRatePct: number };

export function cancellationByLocation(filters: AnalyticsFilters): LocationCancellationRow[] {
  return locationPerformance({ ...filters, locationId: "all" })
    .map((row) => ({ locationId: row.locationId, name: row.name, cancellationRatePct: row.cancellationRatePct }))
    .sort((a, b) => b.cancellationRatePct - a.cancellationRatePct);
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function formatPercent(value: number | null, digits = 1): string {
  if (value === null) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}
