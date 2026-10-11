"use client";

import { useId } from "react";
import { TextAreaField, StepHeading } from "../../fields";
import type { StepProps } from "../../steps/types";

export default function StepAdditional({ draft, update }: StepProps) {
  const detailsId = useId();
  const examplesId = useId();
  const integrationsId = useId();
  const dislikesId = useId();

  return (
    <div className="flex flex-col gap-7">
      <StepHeading title="Additional & Future Requirements" />

      <TextAreaField
        id={detailsId}
        label="Tell us anything else about what you would like us to build."
        hint="Describe your ideal website, CRM, dashboard, automation, or system in your own words. Include anything we may not have asked about, like GIS tools, survey equipment data, or compliance reporting."
        value={draft.additionalDetails}
        onChange={(v) => update("additionalDetails", v)}
        rows={7}
      />

      <TextAreaField
        id={examplesId}
        label="Are there websites, apps, or systems you like as examples?"
        value={draft.likedExamples}
        onChange={(v) => update("likedExamples", v)}
      />

      <TextAreaField
        id={integrationsId}
        label="Are there existing tools or systems (e.g. GIS software, accounting, survey equipment exports) the new solution must integrate with?"
        value={draft.integrationRequirements}
        onChange={(v) => update("integrationRequirements", v)}
      />

      <TextAreaField
        id={dislikesId}
        label="Is there anything you definitely do NOT want?"
        value={draft.dislikedThings}
        onChange={(v) => update("dislikedThings", v)}
      />
    </div>
  );
}
