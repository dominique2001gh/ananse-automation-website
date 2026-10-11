"use client";

import { useId } from "react";
import {
  TextField,
  TextAreaField,
  MultiSelectField,
  SingleSelectField,
  StepHeading,
} from "../../fields";
import { HAS_WEBSITE_OPTIONS, WEBSITE_GOAL_OPTIONS, WEBSITE_ASSET_OPTIONS } from "@/lib/questionnaire";
import type { StepProps } from "../../steps/types";

export default function StepWebsite({ draft, update }: StepProps) {
  const urlId = useId();
  const likesId = useId();
  const dislikesId = useId();
  const designId = useId();

  return (
    <div className="flex flex-col gap-7">
      <StepHeading
        title="Website Redesign"
        description="This section is about Xmine Consult's new or redesigned website — skip anything that doesn't apply."
      />

      <SingleSelectField
        legend="Do you currently have a website?"
        name="hasWebsite"
        options={HAS_WEBSITE_OPTIONS}
        value={draft.hasWebsite}
        onChange={(v) => update("hasWebsite", v)}
      />

      {draft.hasWebsite === "Yes" ? (
        <>
          <TextField
            id={urlId}
            label="Current website URL"
            type="url"
            value={draft.currentWebsiteUrl}
            onChange={(v) => update("currentWebsiteUrl", v)}
            placeholder="https://"
            autoComplete="url"
          />
          <TextAreaField
            id={likesId}
            label="What do you like about the current website?"
            value={draft.currentWebsiteLikes}
            onChange={(v) => update("currentWebsiteLikes", v)}
          />
          <TextAreaField
            id={dislikesId}
            label="What do you dislike or want improved?"
            value={draft.currentWebsiteDislikes}
            onChange={(v) => update("currentWebsiteDislikes", v)}
          />
        </>
      ) : null}

      <MultiSelectField
        legend="What should visitors be able to do on the new website?"
        options={WEBSITE_GOAL_OPTIONS}
        values={draft.websiteGoals}
        onChange={(v) => update("websiteGoals", v)}
        otherText={draft.websiteGoalsOtherText}
        onOtherTextChange={(v) => update("websiteGoalsOtherText", v)}
      />

      <MultiSelectField
        legend="Do you already have any of these?"
        options={WEBSITE_ASSET_OPTIONS}
        values={draft.websiteAssets}
        onChange={(v) => update("websiteAssets", v)}
      />

      <TextAreaField
        id={designId}
        label="Any specific design or style preferences?"
        value={draft.designPreferences}
        onChange={(v) => update("designPreferences", v)}
        placeholder="Colors, tone (e.g. professional, technical, approachable), sites you like the feel of, anything to avoid…"
      />
    </div>
  );
}
