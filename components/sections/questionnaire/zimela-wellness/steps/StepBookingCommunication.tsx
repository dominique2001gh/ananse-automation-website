"use client";

import { useId } from "react";
import { TextField, TextAreaField, MultiSelectField, SingleSelectField, StepHeading } from "../../fields";
import {
  BOOKING_METHOD_OPTIONS,
  DESIRED_BOOKING_FEATURE_OPTIONS,
  YES_NO_NOT_SURE_OPTIONS,
  GENERAL_INQUIRY_CONTACT_METHOD_OPTIONS,
} from "@/lib/questionnaire-zimela-wellness";
import type { StepProps } from "./types";

export default function StepBookingCommunication({ draft, update }: StepProps) {
  const telehealthPlatformId = useId();
  const portalNotesId = useId();

  return (
    <div className="flex flex-col gap-7">
      <StepHeading
        title="Booking & Patient Communication"
        description="How patients reach you and book today, and what you'd like the new site to handle."
      />

      <SingleSelectField
        legend="How do patients currently book appointments?"
        name="currentBookingMethod"
        options={BOOKING_METHOD_OPTIONS}
        value={draft.currentBookingMethod}
        onChange={(v) => update("currentBookingMethod", v)}
      />

      <MultiSelectField
        legend="Which booking features would you like on the new site?"
        options={DESIRED_BOOKING_FEATURE_OPTIONS}
        values={draft.desiredBookingFeatures}
        onChange={(v) => update("desiredBookingFeatures", v)}
        otherText={draft.desiredBookingFeaturesOtherText}
        onOtherTextChange={(v) => update("desiredBookingFeaturesOtherText", v)}
      />

      <SingleSelectField
        legend="Do you currently offer telehealth visits?"
        name="telehealthOffered"
        options={YES_NO_NOT_SURE_OPTIONS}
        value={draft.telehealthOffered}
        onChange={(v) => update("telehealthOffered", v)}
      />

      {draft.telehealthOffered === "Yes" ? (
        <TextField
          id={telehealthPlatformId}
          label="Which telehealth platform do you use?"
          value={draft.telehealthPlatform}
          onChange={(v) => update("telehealthPlatform", v)}
        />
      ) : null}

      <SingleSelectField
        legend="Do you have a patient portal today?"
        name="hasPatientPortal"
        options={YES_NO_NOT_SURE_OPTIONS}
        value={draft.hasPatientPortal}
        onChange={(v) => update("hasPatientPortal", v)}
      />

      <TextAreaField
        id={portalNotesId}
        label="If so, which one -- and should the new website simply link out to it?"
        hint="We're not looking to replace or integrate with your portal at this stage, just link to it if that's useful."
        value={draft.patientPortalNotes}
        onChange={(v) => update("patientPortalNotes", v)}
      />

      <SingleSelectField
        legend="How should general, non-clinical inquiries reach you?"
        name="generalInquiryContactMethod"
        options={GENERAL_INQUIRY_CONTACT_METHOD_OPTIONS}
        value={draft.generalInquiryContactMethod}
        onChange={(v) => update("generalInquiryContactMethod", v)}
      />
    </div>
  );
}
