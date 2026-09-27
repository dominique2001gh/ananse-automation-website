"use client";

import { useId } from "react";
import { TextAreaField, StepHeading } from "../fields";
import type { StepProps } from "./types";

export default function StepAdditional({ draft, update }: StepProps) {
  const detailsId = useId();
  const examplesId = useId();
  const integrationsId = useId();
  const dislikesId = useId();

  return (
    <div className="flex flex-col gap-7">
      <StepHeading title="Additional Requirements" />

      <TextAreaField
        id={detailsId}
        label="Tell us anything else about what you would like us to build."
        hint="Describe your ideal website, CRM, dashboard, automation, AI solution, or business system in your own words. Include anything we may not have asked about."
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
        label="Are there existing tools or systems the new solution must integrate with?"
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
