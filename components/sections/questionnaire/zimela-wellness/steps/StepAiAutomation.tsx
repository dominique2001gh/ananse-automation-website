"use client";

import { MultiSelectField, SingleSelectField, StepHeading } from "../../fields";
import {
  YES_NO_NOT_SURE_OPTIONS,
  ZIMELA_AUTOMATION_INTEREST_OPTIONS,
  REPORTING_INTEREST_OPTIONS,
} from "@/lib/questionnaire-zimela-wellness";
import type { StepProps } from "./types";

export default function StepAiAutomation({ draft, update }: StepProps) {
  return (
    <div className="flex flex-col gap-7">
      <StepHeading
        title="AI Assistant & Automation"
        description="Any AI chat or voice assistant here would only answer general questions -- hours, services, insurance, location, booking help -- never medical advice or anything patient-specific."
      />

      <SingleSelectField
        legend="Would an AI chat agent on the website be useful for general, non-clinical questions?"
        name="aiChatInterest"
        options={YES_NO_NOT_SURE_OPTIONS}
        value={draft.aiChatInterest}
        onChange={(v) => update("aiChatInterest", v)}
      />

      <SingleSelectField
        legend="Would an AI voice agent for phone inquiries be useful, for the same kind of general questions?"
        name="aiVoiceInterest"
        options={YES_NO_NOT_SURE_OPTIONS}
        value={draft.aiVoiceInterest}
        onChange={(v) => update("aiVoiceInterest", v)}
      />

      <MultiSelectField
        legend="Which administrative tasks would you like automated?"
        options={ZIMELA_AUTOMATION_INTEREST_OPTIONS}
        values={draft.automationInterests}
        onChange={(v) => update("automationInterests", v)}
        otherText={draft.automationInterestsOtherText}
        onOtherTextChange={(v) => update("automationInterestsOtherText", v)}
      />

      <MultiSelectField
        legend="What would you like to see reporting/dashboards on?"
        hint="Operational metrics only -- not clinical data."
        options={REPORTING_INTEREST_OPTIONS}
        values={draft.reportingInterests}
        onChange={(v) => update("reportingInterests", v)}
        otherText={draft.reportingInterestsOtherText}
        onOtherTextChange={(v) => update("reportingInterestsOtherText", v)}
      />
    </div>
  );
}
