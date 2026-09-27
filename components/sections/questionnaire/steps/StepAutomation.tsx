"use client";

import { useId } from "react";
import { TextAreaField, MultiSelectField, StepHeading } from "../fields";
import { REPETITIVE_TASK_OPTIONS, AUTOMATION_INTEREST_OPTIONS } from "@/lib/questionnaire";
import type { StepProps } from "./types";

export default function StepAutomation({ draft, update }: StepProps) {
  const manualId = useId();

  return (
    <div className="flex flex-col gap-7">
      <StepHeading
        title="Automation & AI"
        description="What repetitive or time-consuming work would you like technology to handle for you?"
      />

      <MultiSelectField
        legend="Repetitive or time-consuming work"
        options={REPETITIVE_TASK_OPTIONS}
        values={draft.repetitiveTasks}
        onChange={(v) => update("repetitiveTasks", v)}
        otherText={draft.repetitiveTasksOtherText}
        onOtherTextChange={(v) => update("repetitiveTasksOtherText", v)}
      />

      <MultiSelectField
        legend="Are you interested in any of these?"
        options={AUTOMATION_INTEREST_OPTIONS}
        values={draft.automationInterests}
        onChange={(v) => update("automationInterests", v)}
      />

      <TextAreaField
        id={manualId}
        label="Describe any process you currently do manually that you wish could happen automatically."
        value={draft.manualProcessDescription}
        onChange={(v) => update("manualProcessDescription", v)}
        rows={5}
      />
    </div>
  );
}
