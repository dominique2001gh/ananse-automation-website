"use client";

import { useId } from "react";
import { TextField, TextAreaField, SingleSelectField, StepHeading } from "../fields";
import { BUSINESS_SIZE_OPTIONS } from "@/lib/questionnaire";
import type { StepProps } from "./types";

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
        title="About Your Business"
        description="A little context helps us understand how your business actually operates before we recommend anything."
      />

      <TextField
        id={nameId}
        label="Business / organization name"
        required
        value={draft.businessName}
        onChange={(v) => update("businessName", v)}
        autoComplete="organization"
        error={errors.businessName}
      />

      <TextField
        id={industryId}
        label="Industry / business type"
        value={draft.industry}
        onChange={(v) => update("industry", v)}
        placeholder="e.g. dog grooming & spa, contracting, retail, professional services"
      />

      <TextAreaField
        id={descriptionId}
        label="What does your business do?"
        value={draft.businessDescription}
        onChange={(v) => update("businessDescription", v)}
        placeholder="A short description in your own words is perfect."
      />

      <TextField
        id={locationId}
        label="Business location(s)"
        value={draft.businessLocation}
        onChange={(v) => update("businessLocation", v)}
        placeholder="City/state, or 'online only'"
      />

      <SingleSelectField
        legend="Approximate business size"
        name="businessSize"
        options={BUSINESS_SIZE_OPTIONS}
        value={draft.businessSize}
        onChange={(v) => update("businessSize", v)}
      />

      <TextAreaField
        id={customersId}
        label="Who are your typical customers/clients?"
        value={draft.typicalCustomers}
        onChange={(v) => update("typicalCustomers", v)}
      />

      <TextAreaField
        id={goalsId}
        label="What are your main business goals right now?"
        value={draft.businessGoals}
        onChange={(v) => update("businessGoals", v)}
      />

      <TextAreaField
        id={challengesId}
        label="What are your current major challenges or problems?"
        value={draft.currentChallenges}
        onChange={(v) => update("currentChallenges", v)}
      />
    </div>
  );
}
