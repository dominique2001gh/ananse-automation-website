"use client";

import { useId } from "react";
import { TextAreaField, SingleSelectField, StepHeading } from "../../fields";
import { YES_NO_NOT_SURE_OPTIONS } from "@/lib/questionnaire-zimela-wellness";
import type { StepProps } from "./types";

export default function StepSecurityCompliance({ draft, update }: StepProps) {
  const vendorsId = useId();
  const standardsId = useId();
  const dataHandlingId = useId();

  return (
    <div className="flex flex-col gap-7">
      <StepHeading
        title="Security & Compliance"
        description="A few questions about your existing compliance posture -- business context only."
      />

      <div className="rounded-2xl border border-gold/40 bg-gold/5 p-4 text-sm leading-relaxed text-ink">
        This questionnaire, and any website or CRM built from it, do not collect, store, or
        process patient records or protected health information (PHI), and are not represented
        as HIPAA compliant. Any future functionality that would involve patient data requires a
        separate technical and legal compliance assessment before implementation.
      </div>

      <SingleSelectField
        legend="Do you currently have HIPAA policies or Business Associate Agreements (BAAs) in place for your existing systems?"
        name="hipaaPoliciesInPlace"
        options={YES_NO_NOT_SURE_OPTIONS}
        value={draft.hipaaPoliciesInPlace}
        onChange={(v) => update("hipaaPoliciesInPlace", v)}
      />

      <TextAreaField
        id={vendorsId}
        label="Any vendors or platforms you've already vetted or approved under a BAA?"
        value={draft.approvedVendors}
        onChange={(v) => update("approvedVendors", v)}
      />

      <TextAreaField
        id={standardsId}
        label="Any required security certifications or standards for new vendors?"
        value={draft.requiredSecurityStandards}
        onChange={(v) => update("requiredSecurityStandards", v)}
      />

      <TextAreaField
        id={dataHandlingId}
        label="If a future phase were to address patient-data handling, what would you expect from it?"
        hint="Optional -- this does not commit either of us to building that now."
        value={draft.dataHandlingExpectations}
        onChange={(v) => update("dataHandlingExpectations", v)}
      />
    </div>
  );
}
