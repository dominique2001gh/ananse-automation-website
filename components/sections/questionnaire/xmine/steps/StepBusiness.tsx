"use client";

import { useId } from "react";
import { TextField, TextAreaField, SingleSelectField, StepHeading } from "../../fields";
import { BUSINESS_SIZE_OPTIONS } from "@/lib/questionnaire";
import type { StepProps } from "../../steps/types";

export default function StepBusiness({ draft, update, errors }: StepProps) {
  const nameId = useId();
  const industryId = useId();
  const descriptionId = useId();
  const locationId = useId();
  const customersId = useId();
  const goalsId = useId();
  const challengesId = useId();

  return (
    <div className="flex flex-col gap-7">
      <StepHeading
        title="About Xmine Consult"
        description="A little context helps us understand how Xmine Consult operates today before we recommend anything."
      />

      <TextField
        id={nameId}
        label="Business / organization name"
        required
        value={draft.businessName}
        // Locked for this dedicated questionnaire -- see
        // components/sections/questionnaire/xmine/XmineQuestionnaireWizard.tsx.
        onChange={() => {}}
        disabled
        hint="Pre-filled for this Xmine Consult questionnaire."
        autoComplete="organization"
        error={errors.businessName}
      />

      <TextField
        id={industryId}
        label="Industry / type of consultancy"
        value={draft.industry}
        onChange={(v) => update("industry", v)}
        placeholder="e.g. mineral exploration, mine planning, geotechnical consulting, environmental compliance"
      />

      <TextAreaField
        id={descriptionId}
        label="What does Xmine Consult do?"
        value={draft.businessDescription}
        onChange={(v) => update("businessDescription", v)}
      />

      <TextField
        id={locationId}
        label="Where do you operate?"
        value={draft.businessLocation}
        onChange={(v) => update("businessLocation", v)}
        placeholder="Offices, project sites, regions you cover"
      />

      <SingleSelectField
        legend="Business size"
        name="businessSize"
        options={BUSINESS_SIZE_OPTIONS}
        value={draft.businessSize}
        onChange={(v) => update("businessSize", v)}
      />

      <TextAreaField
        id={customersId}
        label="Who are your typical clients?"
        value={draft.typicalCustomers}
        onChange={(v) => update("typicalCustomers", v)}
        placeholder="e.g. mining companies, government agencies, investors, landowners"
      />

      <TextAreaField
        id={goalsId}
        label="What are Xmine Consult's main business goals right now?"
        value={draft.businessGoals}
        onChange={(v) => update("businessGoals", v)}
      />

      <TextAreaField
        id={challengesId}
        label="What are the current major challenges?"
        value={draft.currentChallenges}
        onChange={(v) => update("currentChallenges", v)}
        placeholder="e.g. tracking field work, slow report turnaround, scattered client communication"
      />
    </div>
  );
}
