"use client";

import { useId } from "react";
import { TextAreaField, MultiSelectField, StepHeading } from "../../fields";
import { SERVICE_OFFERED_OPTIONS, PATIENT_POPULATION_OPTIONS } from "@/lib/questionnaire-zimela-wellness";
import type { StepProps } from "./types";

export default function StepPracticeOverview({ draft, update }: StepProps) {
  const locationsId = useId();

  return (
    <div className="flex flex-col gap-7">
      <StepHeading
        title="Practice Overview"
        description="A little context on Zimela Wellness Center's locations and services today."
      />

      <TextAreaField
        id={locationsId}
        label="Practice location(s) or address(es)"
        value={draft.practiceLocations}
        onChange={(v) => update("practiceLocations", v)}
        placeholder="e.g. a single office address, or multiple locations"
      />

      <MultiSelectField
        legend="Which services does the practice currently offer?"
        options={SERVICE_OFFERED_OPTIONS}
        values={draft.servicesOffered}
        onChange={(v) => update("servicesOffered", v)}
        otherText={draft.servicesOfferedOtherText}
        onOtherTextChange={(v) => update("servicesOfferedOtherText", v)}
      />

      <MultiSelectField
        legend="Who do you typically serve?"
        hint="A general category only -- not specific patients."
        options={PATIENT_POPULATION_OPTIONS}
        values={draft.patientPopulation}
        onChange={(v) => update("patientPopulation", v)}
        otherText={draft.patientPopulationOtherText}
        onOtherTextChange={(v) => update("patientPopulationOtherText", v)}
      />
    </div>
  );
}
