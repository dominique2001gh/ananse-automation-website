"use client";

import { useId } from "react";
import { TextAreaField, MultiSelectField, SingleSelectField, StepHeading } from "../../fields";
import { STAFF_ACCESS_OPTIONS, CRM_FEATURE_OPTIONS } from "@/lib/questionnaire";
import type { StepProps } from "../../steps/types";

export default function StepOperations({ draft, update }: StepProps) {
  const managementId = useId();
  const infoId = useId();
  const stagesId = useId();

  return (
    <div className="flex flex-col gap-7">
      <StepHeading
        title="Field Operations & CRM"
        description={
          'A "CRM" (Customer Relationship Management system) is just a shared digital system for keeping track of clients, projects, and field visits -- so your team always knows what stage something is in, without digging through spreadsheets or email. Tell us how this works at Xmine Consult today.'
        }
      />

      <TextAreaField
        id={managementId}
        label="How do you currently manage clients, projects, field visits, site reports, staff assignments, documents and communications?"
        value={draft.currentManagementDescription}
        onChange={(v) => update("currentManagementDescription", v)}
        placeholder="e.g. spreadsheets, paper field notes, email, another piece of software…"
        rows={5}
      />

      <TextAreaField
        id={infoId}
        label="What information do you need to keep about each client or project?"
        value={draft.customerInfoNeeded}
        onChange={(v) => update("customerInfoNeeded", v)}
      />

      <TextAreaField
        id={stagesId}
        label="What stages does a typical project or site visit move through?"
        value={draft.stagesStatuses}
        onChange={(v) => update("stagesStatuses", v)}
        placeholder="e.g. Inquiry → Site Visit Scheduled → Fieldwork → Report Drafted → Delivered"
      />

      <SingleSelectField
        legend="Do office staff and field staff need different access levels?"
        name="staffAccessLevels"
        options={STAFF_ACCESS_OPTIONS}
        value={draft.staffAccessLevels}
        onChange={(v) => update("staffAccessLevels", v)}
      />

      <MultiSelectField
        legend="Which of these would be useful for managing clients and field operations?"
        options={CRM_FEATURE_OPTIONS}
        values={draft.crmFeatures}
        onChange={(v) => update("crmFeatures", v)}
        otherText={draft.crmFeaturesOtherText}
        onOtherTextChange={(v) => update("crmFeaturesOtherText", v)}
      />
    </div>
  );
}
