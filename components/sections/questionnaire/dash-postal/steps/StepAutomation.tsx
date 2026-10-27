"use client";

import { useId } from "react";
import { TextAreaField, MultiSelectField, SingleSelectField, StepHeading } from "../../fields";
import {
  CUSTOMER_CONTACT_METHOD_OPTIONS,
  CRM_INTEREST_OPTIONS,
  DASH_AUTOMATION_INTEREST_OPTIONS,
} from "@/lib/questionnaire-dash-postal";
import type { StepProps } from "./types";

export default function StepAutomation({ draft, update }: StepProps) {
  const managementId = useId();

  return (
    <div className="flex flex-col gap-7">
      <StepHeading
        title="CRM and Business Automation"
        description={
          'A "CRM" (Customer Relationship Management system) is a shared digital system for keeping track of leads, inquiries, appointments, and customer relationships, instead of scattered notes, email, or memory.'
        }
      />

      <MultiSelectField
        legend="How do customers currently contact you?"
        options={CUSTOMER_CONTACT_METHOD_OPTIONS}
        values={draft.customerContactMethods}
        onChange={(v) => update("customerContactMethods", v)}
        otherText={draft.customerContactMethodsOtherText}
        onOtherTextChange={(v) => update("customerContactMethodsOtherText", v)}
      />

      <TextAreaField
        id={managementId}
        label="How do you currently manage customer information, appointments, and follow-ups?"
        value={draft.currentManagementDescription}
        onChange={(v) => update("currentManagementDescription", v)}
        placeholder="e.g. a notebook, spreadsheets, memory, another piece of software…"
        rows={5}
      />

      <SingleSelectField
        legend="Would you be interested in a CRM to manage leads, inquiries, appointments, customer relationships, and business reports?"
        name="crmInterest"
        options={CRM_INTEREST_OPTIONS}
        value={draft.crmInterest}
        onChange={(v) => update("crmInterest", v)}
      />

      <MultiSelectField
        legend="Which automations would help?"
        options={DASH_AUTOMATION_INTEREST_OPTIONS}
        values={draft.automationInterests}
        onChange={(v) => update("automationInterests", v)}
        otherText={draft.automationInterestsOtherText}
        onOtherTextChange={(v) => update("automationInterestsOtherText", v)}
      />
    </div>
  );
}
