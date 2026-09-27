"use client";

import { useId } from "react";
import { TextField, TextAreaField, MultiSelectField, SingleSelectField, StepHeading } from "../fields";
import { ANALYTICS_INTEREST_OPTIONS, DATA_SOURCE_OPTIONS, REPORT_FREQUENCY_OPTIONS } from "@/lib/questionnaire";
import type { StepProps } from "./types";

export default function StepAnalytics({ draft, update }: StepProps) {
  const accessId = useId();
  const decisionsId = useId();

  return (
    <div className="flex flex-col gap-7">
      <StepHeading
        title="Analytics & Reporting"
        description="Optional for every prospect — useful if any part of your business is hard to see clearly today."
      />

      <MultiSelectField
        legend="What would you like to understand about your business that is difficult to see today?"
        options={ANALYTICS_INTEREST_OPTIONS}
        values={draft.analyticsInterests}
        onChange={(v) => update("analyticsInterests", v)}
        otherText={draft.analyticsInterestsOtherText}
        onOtherTextChange={(v) => update("analyticsInterestsOtherText", v)}
      />

      <MultiSelectField
        legend="Where does your data currently live?"
        options={DATA_SOURCE_OPTIONS}
        values={draft.dataSources}
        onChange={(v) => update("dataSources", v)}
      />

      <TextField
        id={accessId}
        label="Who needs access to reports or a dashboard?"
        value={draft.reportAccess}
        onChange={(v) => update("reportAccess", v)}
      />

      <SingleSelectField
        legend="How often do you need reporting?"
        name="reportFrequency"
        options={REPORT_FREQUENCY_OPTIONS}
        value={draft.reportFrequency}
        onChange={(v) => update("reportFrequency", v)}
      />

      <TextAreaField
        id={decisionsId}
        label="What decisions would you like the analytics to help you make?"
        value={draft.analyticsDecisions}
        onChange={(v) => update("analyticsDecisions", v)}
      />
    </div>
  );
}
