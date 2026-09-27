"use client";

import { useId } from "react";
import { TextAreaField, MultiSelectField, SingleSelectField, StepHeading } from "../fields";
import { STAFF_ACCESS_OPTIONS, CRM_FEATURE_OPTIONS } from "@/lib/questionnaire";
import type { StepProps } from "./types";

export default function StepOperations({ draft, update }: StepProps) {
  const managementId = useId();
  const infoId = useId();
  const stagesId = useId();

  return (
    <div className="flex flex-col gap-7">
      <StepHeading
        title="CRM & Business Operations"
        description="Help us understand how leads, customers, jobs and day-to-day work move through your business today."
      />

      <TextAreaField
        id={managementId}
        label="How do you currently manage leads, customers, appointments, jobs/orders, notes, follow-ups, staff assignments, documents, payments and communications?"
        value={draft.currentManagementDescription}
        onChange={(v) => update("currentManagementDescription", v)}
        placeholder="e.g. spreadsheets, paper, email, sticky notes, another piece of software…"
        rows={5}
      />

      <TextAreaField
        id={infoId}
        label="What information do you need to keep about each customer?"
        value={draft.customerInfoNeeded}
        onChange={(v) => update("customerInfoNeeded", v)}
      />

      <TextAreaField
        id={stagesId}
        label="What stages or statuses do your customers, jobs, orders, or projects normally move through?"
        value={draft.stagesStatuses}
        onChange={(v) => update("stagesStatuses", v)}
        placeholder="e.g. New Lead → Quoted → Scheduled → In Progress → Complete"
      />

      <SingleSelectField
        legend="Do different staff members need different access levels?"
        name="staffAccessLevels"
        options={STAFF_ACCESS_OPTIONS}
        value={draft.staffAccessLevels}
        onChange={(v) => update("staffAccessLevels", v)}
      />

      <MultiSelectField
        legend="Which features would be useful?"
        options={CRM_FEATURE_OPTIONS}
        values={draft.crmFeatures}
        onChange={(v) => update("crmFeatures", v)}
        otherText={draft.crmFeaturesOtherText}
        onOtherTextChange={(v) => update("crmFeaturesOtherText", v)}
      />
    </div>
  );
}
