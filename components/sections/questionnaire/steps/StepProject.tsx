"use client";

import { useId } from "react";
import { MultiSelectField, TextAreaField, SingleSelectField, StepHeading } from "../fields";
import { SERVICE_INTEREST_OPTIONS, PROJECT_TIMEFRAME_OPTIONS } from "@/lib/questionnaire";
import type { StepProps } from "./types";

export default function StepProject({ draft, update, errors }: StepProps) {
  const problemId = useId();
  const successId = useId();

  return (
    <div className="flex flex-col gap-7">
      <StepHeading
        title="Your Project"
        description="What would you like Ananse Automation to help you with? Select everything that applies."
      />

      <MultiSelectField
        legend="What would you like help with?"
        required
        options={SERVICE_INTEREST_OPTIONS}
        values={draft.servicesNeeded}
        onChange={(v) => update("servicesNeeded", v)}
        otherText={draft.servicesNeededOtherText}
        onOtherTextChange={(v) => update("servicesNeededOtherText", v)}
        error={errors.servicesNeeded}
      />

      <TextAreaField
        id={problemId}
        label="What is the primary problem you want this project to solve?"
        value={draft.primaryProblem}
        onChange={(v) => update("primaryProblem", v)}
      />

      <TextAreaField
        id={successId}
        label="What would a successful solution look like to you?"
        value={draft.successDefinition}
        onChange={(v) => update("successDefinition", v)}
      />

      <SingleSelectField
        legend="Desired timeframe"
        name="timeframe"
        options={PROJECT_TIMEFRAME_OPTIONS}
        value={draft.timeframe}
        onChange={(v) => update("timeframe", v)}
      />
    </div>
  );
}
