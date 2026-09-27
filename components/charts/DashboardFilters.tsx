import type { ReactNode } from "react";
import { DATE_RANGE_PRESETS, type CustomerType, type DateRangePresetId } from "@/lib/analytics-demo-engine";
import { LOCATIONS, SERVICES, type TeamMember } from "@/lib/analytics-demo-data";

const CUSTOMER_TYPE_OPTIONS: { id: CustomerType; label: string }[] = [
  { id: "all", label: "All Customers" },
  { id: "new", label: "New Only" },
  { id: "returning", label: "Returning Only" },
];

const selectClassName =
  "w-full rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 sm:w-auto";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[0.65rem] font-medium tracking-[0.14em] text-slate/70 uppercase">{label}</span>
      {children}
    </label>
  );
}

export default function DashboardFilters({
  datePreset,
  onDatePresetChange,
  locationId,
  onLocationChange,
  serviceId,
  onServiceChange,
  teamMemberId,
  onTeamMemberChange,
  teamOptions,
  customerType,
  onCustomerTypeChange,
}: {
  datePreset: DateRangePresetId;
  onDatePresetChange: (id: DateRangePresetId) => void;
  locationId: string;
  onLocationChange: (id: string) => void;
  serviceId: string;
  onServiceChange: (id: string) => void;
  teamMemberId: string;
  onTeamMemberChange: (id: string) => void;
  teamOptions: TeamMember[];
  customerType: CustomerType;
  onCustomerTypeChange: (value: CustomerType) => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-paper-dim p-5 sm:flex-row sm:flex-wrap sm:items-end sm:gap-5">
      <Field label="Date Range">
        <select
          className={selectClassName}
          value={datePreset}
          onChange={(e) => onDatePresetChange(e.target.value as DateRangePresetId)}
        >
          {DATE_RANGE_PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Location">
        <select className={selectClassName} value={locationId} onChange={(e) => onLocationChange(e.target.value)}>
          <option value="all">All Locations</option>
          {LOCATIONS.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Service">
        <select className={selectClassName} value={serviceId} onChange={(e) => onServiceChange(e.target.value)}>
          <option value="all">All Services</option>
          {SERVICES.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Team Member">
        <select className={selectClassName} value={teamMemberId} onChange={(e) => onTeamMemberChange(e.target.value)}>
          <option value="all">All Team Members</option>
          {teamOptions.map((tm) => (
            <option key={tm.id} value={tm.id}>
              {tm.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Customer Type">
        <select
          className={selectClassName}
          value={customerType}
          onChange={(e) => onCustomerTypeChange(e.target.value as CustomerType)}
        >
          {CUSTOMER_TYPE_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>
    </div>
  );
}
