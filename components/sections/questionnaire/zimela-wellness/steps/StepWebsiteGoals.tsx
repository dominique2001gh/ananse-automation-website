"use client";

import { useId } from "react";
import { TextField, TextAreaField, MultiSelectField, StepHeading } from "../../fields";
import { ZIMELA_WEBSITE_GOAL_OPTIONS } from "@/lib/questionnaire-zimela-wellness";
import type { StepProps } from "./types";

export default function StepWebsiteGoals({ draft, update }: StepProps) {
  const urlId = useId();
  const likesId = useId();
  const dislikesId = useId();
  const designId = useId();

  return (
    <div className="flex flex-col gap-7">
      <StepHeading
        title="Website & Online Presence"
        description="What should the redesigned website accomplish for Zimela Wellness Center?"
      />

      <TextField
        id={urlId}
        label="Current website"
        type="url"
        value={draft.currentWebsiteUrl}
        onChange={() => {}}
        disabled
      />

      <TextAreaField
        id={likesId}
        label="What do you like about the current site?"
        value={draft.currentWebsiteLikes}
        onChange={(v) => update("currentWebsiteLikes", v)}
      />

      <TextAreaField
        id={dislikesId}
        label="What would you like improved?"
        value={draft.currentWebsiteDislikes}
        onChange={(v) => update("currentWebsiteDislikes", v)}
      />

      <MultiSelectField
        legend="What are your main goals for the new website?"
        options={ZIMELA_WEBSITE_GOAL_OPTIONS}
        values={draft.websiteGoals}
        onChange={(v) => update("websiteGoals", v)}
        otherText={draft.websiteGoalsOtherText}
        onOtherTextChange={(v) => update("websiteGoalsOtherText", v)}
      />

      <TextAreaField
        id={designId}
        label="Any design preferences, or sites you like the look of?"
        value={draft.designPreferences}
        onChange={(v) => update("designPreferences", v)}
      />
    </div>
  );
}
