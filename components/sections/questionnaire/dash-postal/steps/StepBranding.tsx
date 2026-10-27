"use client";

import { useId } from "react";
import { TextAreaField, MultiSelectField, SingleSelectField, StepHeading } from "../../fields";
import { BRAND_ASSET_OPTIONS, DESIGN_STYLE_OPTIONS } from "@/lib/questionnaire-dash-postal";
import type { StepProps } from "./types";

export default function StepBranding({ draft, update }: StepProps) {
  const socialId = useId();

  return (
    <div className="flex flex-col gap-7">
      <StepHeading
        title="Branding and Content"
        description="What we have to work with, and the look and feel you're going for."
      />

      <MultiSelectField
        legend="Do you have a logo, brand colors, photographs, and business descriptions?"
        hint="Select everything you already have ready to share."
        options={BRAND_ASSET_OPTIONS}
        values={draft.brandAssets}
        onChange={(v) => update("brandAssets", v)}
      />

      <SingleSelectField
        legend="What design style do you prefer?"
        name="designStyle"
        options={DESIGN_STYLE_OPTIONS}
        value={draft.designStyle}
        onChange={(v) => update("designStyle", v)}
      />

      <TextAreaField
        id={socialId}
        label="Do you have existing social media pages or a Google Business Profile?"
        value={draft.socialMediaProfiles}
        onChange={(v) => update("socialMediaProfiles", v)}
        placeholder="Share links if you have them (e.g. Facebook, Instagram, Google Business Profile)"
      />
    </div>
  );
}
