"use client";

import { useId } from "react";
import { TextField, TextAreaField, MultiSelectField, SingleSelectField, StepHeading } from "../../fields";
import {
  DASH_WEBSITE_GOAL_OPTIONS,
  HAS_WEBSITE_OPTIONS,
  DESIRED_WEBSITE_FEATURE_OPTIONS,
} from "@/lib/questionnaire-dash-postal";
import type { StepProps } from "./types";

export default function StepWebsiteGoals({ draft, update }: StepProps) {
  const urlId = useId();
  const inspirationId = useId();

  return (
    <div className="flex flex-col gap-7">
      <StepHeading
        title="Website Goals"
        description="What should the new website accomplish for Dash Postal and Tax Services?"
      />

      <MultiSelectField
        legend="What are your main goals for the website?"
        options={DASH_WEBSITE_GOAL_OPTIONS}
        values={draft.websiteGoals}
        onChange={(v) => update("websiteGoals", v)}
        otherText={draft.websiteGoalsOtherText}
        onOtherTextChange={(v) => update("websiteGoalsOtherText", v)}
      />

      <SingleSelectField
        legend="Do you currently own a domain name or have an existing website?"
        name="hasWebsite"
        options={HAS_WEBSITE_OPTIONS}
        value={draft.hasWebsite}
        onChange={(v) => update("hasWebsite", v)}
      />

      {draft.hasWebsite === "Yes" ? (
        <TextField
          id={urlId}
          label="Current website URL"
          type="url"
          value={draft.currentWebsiteUrl}
          onChange={(v) => update("currentWebsiteUrl", v)}
          placeholder="https://"
          autoComplete="url"
        />
      ) : null}

      <MultiSelectField
        legend="Which website features would you like?"
        options={DESIRED_WEBSITE_FEATURE_OPTIONS}
        values={draft.desiredFeatures}
        onChange={(v) => update("desiredFeatures", v)}
        otherText={draft.desiredFeaturesOtherText}
        onOtherTextChange={(v) => update("desiredFeaturesOtherText", v)}
      />

      <TextAreaField
        id={inspirationId}
        label="Are there any websites you like for design inspiration?"
        value={draft.designInspiration}
        onChange={(v) => update("designInspiration", v)}
        placeholder="Share a link or two, or describe what you like about them"
      />
    </div>
  );
}
