"use client";

import { useId } from "react";
import { TextAreaField, MultiSelectField, StepHeading } from "../../fields";
import { CURRENT_SERVICE_OPTIONS, CUSTOMER_TYPE_OPTIONS } from "@/lib/questionnaire-dash-postal";
import type { StepProps } from "./types";

export default function StepBusinessOverview({ draft, update }: StepProps) {
  const promoteId = useId();
  const differentiatorsId = useId();

  return (
    <div className="flex flex-col gap-7">
      <StepHeading
        title="Business Overview"
        description="A little context on what Dash Postal and Tax Services offers today and who you serve."
      />

      <MultiSelectField
        legend="What services does Dash Postal and Tax Services currently provide?"
        options={CURRENT_SERVICE_OPTIONS}
        values={draft.currentServices}
        onChange={(v) => update("currentServices", v)}
        otherText={draft.currentServicesOtherText}
        onOtherTextChange={(v) => update("currentServicesOtherText", v)}
      />

      <TextAreaField
        id={promoteId}
        label="Which services are most important to promote on the website?"
        value={draft.servicesToPromote}
        onChange={(v) => update("servicesToPromote", v)}
        placeholder="e.g. tax preparation during tax season, shipping and notary year-round"
      />

      <MultiSelectField
        legend="Who are your primary customers?"
        options={CUSTOMER_TYPE_OPTIONS}
        values={draft.customerTypes}
        onChange={(v) => update("customerTypes", v)}
        otherText={draft.customerTypesOtherText}
        onOtherTextChange={(v) => update("customerTypesOtherText", v)}
      />

      <TextAreaField
        id={differentiatorsId}
        label="What makes your business different from competitors?"
        value={draft.differentiators}
        onChange={(v) => update("differentiators", v)}
      />
    </div>
  );
}
