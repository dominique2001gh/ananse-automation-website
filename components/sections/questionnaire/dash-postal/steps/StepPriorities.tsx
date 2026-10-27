"use client";

import { useId } from "react";
import { TextAreaField, SingleSelectField, StepHeading } from "../../fields";
import { LAUNCH_TIMEFRAME_OPTIONS } from "@/lib/questionnaire-dash-postal";
import type { StepProps } from "./types";

export default function StepPriorities({ draft, update }: StepProps) {
  const prioritiesId = useId();
  const anythingElseId = useId();

  return (
    <div className="flex flex-col gap-7">
      <StepHeading title="Project Priorities" />

      <SingleSelectField
        legend="When would you like your website launched?"
        name="launchTimeframe"
        options={LAUNCH_TIMEFRAME_OPTIONS}
        value={draft.launchTimeframe}
        onChange={(v) => update("launchTimeframe", v)}
      />

      <TextAreaField
        id={prioritiesId}
        label="What are your three most important priorities for this project?"
        value={draft.topPriorities}
        onChange={(v) => update("topPriorities", v)}
      />

      <TextAreaField
        id={anythingElseId}
        label="Is there anything else you would like us to know before our consultation?"
        value={draft.anythingElse}
        onChange={(v) => update("anythingElse", v)}
        rows={5}
      />
    </div>
  );
}
