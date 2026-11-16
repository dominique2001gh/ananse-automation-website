"use client";

import { useId } from "react";
import { TextField, TextAreaField, MultiSelectField, SingleSelectField, StepHeading } from "../../fields";
import {
  YES_NO_NOT_SURE_OPTIONS,
  DESIRED_CRM_FEATURE_OPTIONS,
  STAFF_ACCESS_ROLE_OPTIONS,
} from "@/lib/questionnaire-zimela-wellness";
import type { StepProps } from "./types";

export default function StepSystemsAccess({ draft, update }: StepProps) {
  const ehrId = useId();
  const crmToolId = useId();
  const integrationsId = useId();

  return (
    <div className="flex flex-col gap-7">
      <StepHeading
        title="Systems, CRM & Staff Access"
        description="What you use today for business operations, and what internal tools might help. Nothing here connects to or changes your EHR."
      />

      <TextField
        id={ehrId}
        label="Current EHR / practice management system"
        value={draft.currentEhrSystem}
        onChange={(v) => update("currentEhrSystem", v)}
        hint="For context only -- we will not connect to or integrate with this system at this stage."
      />

      <TextField
        id={crmToolId}
        label="Current CRM or scheduling tool, if separate from your EHR"
        value={draft.currentCrmOrScheduling}
        onChange={(v) => update("currentCrmOrScheduling", v)}
      />

      <TextAreaField
        id={integrationsId}
        label="Any future integrations you'd eventually want to explore?"
        hint="Informational only -- no connection would be made as part of this project."
        value={draft.desiredIntegrations}
        onChange={(v) => update("desiredIntegrations", v)}
      />

      <SingleSelectField
        legend="Would you be interested in an internal CRM for tracking prospective-patient inquiries and leads?"
        name="crmInterest"
        options={YES_NO_NOT_SURE_OPTIONS}
        value={draft.crmInterest}
        onChange={(v) => update("crmInterest", v)}
      />

      <MultiSelectField
        legend="Which CRM features would be useful?"
        hint="Business/front-office tracking only -- not clinical charting."
        options={DESIRED_CRM_FEATURE_OPTIONS}
        values={draft.desiredCrmFeatures}
        onChange={(v) => update("desiredCrmFeatures", v)}
        otherText={draft.desiredCrmFeaturesOtherText}
        onOtherTextChange={(v) => update("desiredCrmFeaturesOtherText", v)}
      />

      <MultiSelectField
        legend="Which staff roles would need access?"
        options={STAFF_ACCESS_ROLE_OPTIONS}
        values={draft.staffAccessRoles}
        onChange={(v) => update("staffAccessRoles", v)}
        otherText={draft.staffAccessRolesOtherText}
        onOtherTextChange={(v) => update("staffAccessRolesOtherText", v)}
      />
    </div>
  );
}
