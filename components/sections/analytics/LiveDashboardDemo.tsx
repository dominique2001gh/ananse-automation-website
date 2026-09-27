"use client";

import { useMemo, useState } from "react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import DashboardFilters from "@/components/charts/DashboardFilters";
import KpiCard, { type DeltaTone } from "@/components/charts/KpiCard";
import TrendLineChart from "@/components/charts/TrendLineChart";
import LocationBarChart from "@/components/charts/LocationBarChart";
import ServiceDonutChart from "@/components/charts/ServiceDonutChart";
import PerformanceTable, { type PerformanceColumn } from "@/components/charts/PerformanceTable";
import { DEMO_BUSINESS_NAME, TEAM_MEMBERS, type TeamMember } from "@/lib/analytics-demo-data";
import {
  presetToRange,
  computeSummary,
  mostPopularServices,
  teamPerformance,
  locationPerformance,
  monthlyTrend,
  quarterlyTrend,
  formatCurrency,
  formatPercent,
  type AnalyticsFilters,
  type CustomerType,
  type DateRangePresetId,
  type TeamPerformanceRow,
} from "@/lib/analytics-demo-engine";

const compactCurrency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });

const teamColumns: PerformanceColumn<TeamPerformanceRow>[] = [
  { key: "name", label: "Team Member", render: (row) => row.name },
  { key: "location", label: "Location", render: (row) => row.locationName },
  { key: "completed", label: "Completed", align: "right", render: (row) => row.completed.toLocaleString("en-US") },
  { key: "revenue", label: "Revenue", align: "right", render: (row) => formatCurrency(row.revenue) },
];

export default function LiveDashboardDemo() {
  const [datePreset, setDatePreset] = useState<DateRangePresetId>("last6");
  const [locationId, setLocationId] = useState("all");
  const [serviceId, setServiceId] = useState("all");
  const [teamMemberId, setTeamMemberId] = useState("all");
  const [customerType, setCustomerType] = useState<CustomerType>("all");
  const [trendView, setTrendView] = useState<"monthly" | "quarterly">("monthly");

  const teamOptions: TeamMember[] = useMemo(
    () => (locationId === "all" ? TEAM_MEMBERS : TEAM_MEMBERS.filter((tm) => tm.locationId === locationId)),
    [locationId]
  );

  function handleLocationChange(next: string) {
    setLocationId(next);
    if (next !== "all" && !TEAM_MEMBERS.some((tm) => tm.id === teamMemberId && tm.locationId === next)) {
      setTeamMemberId("all");
    }
  }

  const filters: AnalyticsFilters = useMemo(
    () => ({ ...presetToRange(datePreset), locationId, serviceId, teamMemberId, customerType }),
    [datePreset, locationId, serviceId, teamMemberId, customerType]
  );

  const summary = useMemo(() => computeSummary(filters), [filters]);
  const popularServices = useMemo(() => mostPopularServices(filters), [filters]);
  const teamRows = useMemo(() => teamPerformance(filters), [filters]);
  const locationRows = useMemo(() => locationPerformance(filters), [filters]);
  const trendData = useMemo(() => {
    const points = trendView === "monthly" ? monthlyTrend(filters) : quarterlyTrend(filters);
    return points.map((p) => ({ label: p.label, revenue: p.revenue }));
  }, [filters, trendView]);

  const revenueTone: DeltaTone = summary.revenueGrowthPct === null ? "neutral" : summary.revenueGrowthPct >= 0 ? "positive" : "negative";
  const cancellationTone: DeltaTone = summary.cancellationRatePct > 15 ? "negative" : summary.cancellationRatePct < 8 ? "positive" : "neutral";

  return (
    <section id="live-demo" className="bg-paper py-20 sm:py-28">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <SectionHeading
            eyebrow="Live Demo"
            title="A Real, Filterable Dashboard"
            description={`Every number below is computed live from the filters you choose — try changing them. This runs on a fictional sample business, ${DEMO_BUSINESS_NAME}, so you can see exactly how this would work for yours.`}
          />
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-paper-dim px-3 py-1 font-mono text-[0.65rem] font-medium tracking-[0.12em] text-slate uppercase">
            <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
            Fictional demo data
          </span>
        </div>

        <DashboardFilters
          datePreset={datePreset}
          onDatePresetChange={setDatePreset}
          locationId={locationId}
          onLocationChange={handleLocationChange}
          serviceId={serviceId}
          onServiceChange={setServiceId}
          teamMemberId={teamMemberId}
          onTeamMemberChange={setTeamMemberId}
          teamOptions={teamOptions}
          customerType={customerType}
          onCustomerTypeChange={setCustomerType}
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard
            label="Revenue"
            value={formatCurrency(summary.revenue)}
            deltaLabel={summary.revenueGrowthPct !== null ? `${formatPercent(summary.revenueGrowthPct)} vs prior period` : undefined}
            deltaTone={revenueTone}
          />
          <KpiCard label="Customers Served" value={summary.customersServed.toLocaleString("en-US")} helpText="in selected period" />
          <KpiCard label="New Customers" value={summary.newCustomers.toLocaleString("en-US")} helpText="first visit in period" />
          <KpiCard label="Returning Customers" value={summary.returningCustomers.toLocaleString("en-US")} helpText="in selected period" />
          <KpiCard
            label="Customer Retention"
            value={summary.retentionRatePct !== null ? `${summary.retentionRatePct.toFixed(0)}%` : "—"}
            helpText="vs prior period's customers"
          />
          <KpiCard label="Avg. Customer Value" value={formatCurrency(summary.avgCustomerValue)} helpText="revenue per customer" />
          <KpiCard label="Services Completed" value={summary.servicesCompleted.toLocaleString("en-US")} helpText="in selected period" />
          <KpiCard
            label="Cancellation Rate"
            value={`${summary.cancellationRatePct.toFixed(1)}%`}
            deltaTone={cancellationTone}
            deltaLabel="cancellations + no-shows"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-5 rounded-2xl border border-line bg-paper-dim p-6 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-ink">Revenue Trend</h3>
              <div className="inline-flex rounded-full border border-line bg-paper p-1 text-xs font-medium">
                {(["monthly", "quarterly"] as const).map((view) => (
                  <button
                    key={view}
                    type="button"
                    onClick={() => setTrendView(view)}
                    className={`rounded-full px-3 py-1.5 capitalize transition-colors ${
                      trendView === view ? "bg-ink text-paper" : "text-slate hover:text-ink"
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>
            <TrendLineChart data={trendData} dataKey="revenue" name="Revenue" formatValue={compactCurrency} />
          </div>

          <div className="flex flex-col gap-5 rounded-2xl border border-line bg-paper-dim p-6">
            <h3 className="text-base font-semibold text-ink">Most Popular Services</h3>
            <ServiceDonutChart
              data={popularServices.map((s) => ({ name: s.name, value: s.revenue, sharePct: s.sharePct }))}
              formatValue={compactCurrency}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-5 rounded-2xl border border-line bg-paper-dim p-6">
            <h3 className="text-base font-semibold text-ink">Revenue by Location</h3>
            <LocationBarChart
              data={locationRows.map((l) => ({ name: l.name, revenue: l.revenue }))}
              dataKey="revenue"
              name="Revenue"
              formatValue={compactCurrency}
            />
          </div>

          <div className="flex flex-col gap-5">
            <h3 className="text-base font-semibold text-ink">Team Performance</h3>
            <PerformanceTable rows={teamRows} columns={teamColumns} getRowKey={(row) => row.teamMemberId} />
          </div>
        </div>
      </Container>
    </section>
  );
}
