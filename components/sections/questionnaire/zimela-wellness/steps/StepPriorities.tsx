"use client";

import { useId } from "react";
import { TextField, TextAreaField, SingleSelectField, StepHeading } from "../../fields";
import { ZIMELA_LAUNCH_TIMEFRAME_OPTIONS } from "@/lib/questionnaire-zimela-wellness";
import type { StepProps } from "./types";

export default function StepPriorities({ draft, update }: StepProps) {
  const prioritiesId = useId();
  const budgetId = useId();
  const anythingElseId = useId();

  return (
    <div className="flex flex-col gap-7">
      <StepHeading title="Priorities & Timeline" />

      <SingleSelectField
        legend="When would you like the new website launched?"
        name="launchTimeframe"
        options={ZIMELA_LAUNCH_TIMEFRAME_OPTIONS}
        value={draft.launchTimeframe}
        onChange={(v) => update("launchTimeframe", v)}
      />

      <TextAreaField
        id={prioritiesId}
        label="What are your top three priorities for this project?"
        value={draft.topPriorities}
        onChange={(v) => update("topPriorities", v)}
      />

      <TextField
        id={budgetId}
        label="Budget range (optional)"
        value={draft.budgetRange}
        onChange={(v) => update("budgetRange", v)}
        placeholder="Entirely optional -- share a rough range if helpful"
      />

      <TextAreaField
        id={anythingElseId}
        label="Is there anything else you'd like us to know before our consultation?"
        value={draft.anythingElse}
        onChange={(v) => update("anythingElse", v)}
        rows={5}
      />
    </div>
  );
}
