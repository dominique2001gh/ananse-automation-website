"use client";

import { useId } from "react";
import { TextField, SingleSelectField, StepHeading } from "../../fields";
import {
  DASH_CONTACT_METHOD_OPTIONS,
  type DashPostalQuestionnaireDraft,
} from "@/lib/questionnaire-dash-postal";
import type { StepId, StepProps } from "./types";

function joined(values: string[], otherText?: string) {
  if (values.length === 0) return "";
  const hasOther = values.includes("Other") && otherText;
  const rendered = hasOther
    ? [...values.filter((v) => v !== "Other"), `Other (${otherText})`]
    : values;
  return rendered.join(", ");
}

type ReviewRow = { label: string; value: string };
type ReviewSection = { stepId: StepId; title: string; rows: ReviewRow[] };

function buildReviewSections(d: DashPostalQuestionnaireDraft): ReviewSection[] {
  const raw: ReviewSection[] = [
    {
      stepId: "business",
      title: "Business Overview",
      rows: [
        { label: "Services currently provided", value: joined(d.currentServices, d.currentServicesOtherText) },
        { label: "Services to promote", value: d.servicesToPromote },
        { label: "Primary customers", value: joined(d.customerTypes, d.customerTypesOtherText) },
        { label: "What makes you different", value: d.differentiators },
      ],
    },
    {
      stepId: "website",
      title: "Website Goals",
      rows: [
        { label: "Main goals", value: joined(d.websiteGoals, d.websiteGoalsOtherText) },
        { label: "Has existing website/domain", value: d.hasWebsite },
        { label: "Current website URL", value: d.currentWebsiteUrl },
        { label: "Desired features", value: joined(d.desiredFeatures, d.desiredFeaturesOtherText) },
        { label: "Design inspiration", value: d.designInspiration },
      ],
    },
    {
      stepId: "branding",
      title: "Branding and Content",
      rows: [
        { label: "Brand assets available", value: joined(d.brandAssets) },
        { label: "Design style", value: d.designStyle },
        { label: "Social media / Google Business Profile", value: d.socialMediaProfiles },
      ],
    },
    {
      stepId: "automation",
      title: "CRM and Business Automation",
      rows: [
        { label: "How customers contact you", value: joined(d.customerContactMethods, d.customerContactMethodsOtherText) },
        { label: "How you manage info/appointments today", value: d.currentManagementDescription },
        { label: "Interested in a CRM", value: d.crmInterest },
        { label: "Automations of interest", value: joined(d.automationInterests, d.automationInterestsOtherText) },
      ],
    },
    {
      stepId: "priorities",
      title: "Project Priorities",
      rows: [
        { label: "Desired launch timeframe", value: d.launchTimeframe },
        { label: "Top three priorities", value: d.topPriorities },
        { label: "Anything else", value: d.anythingElse },
      ],
    },
    {
      stepId: "contact",
      title: "Contact",
      rows: [
        { label: "Name", value: d.contactName },
        { label: "Email", value: d.contactEmail },
        { label: "Phone", value: d.contactPhone },
        { label: "Preferred contact method", value: d.preferredContactMethod },
      ],
    },
  ];

  return raw
    .map((s) => ({ ...s, rows: s.rows.filter((r) => r.value) }))
    .filter((s) => s.rows.length > 0);
}

export default function StepContactReview({
  draft,
  update,
  errors,
  onEditStep,
}: StepProps & { onEditStep: (stepId: StepId) => void }) {
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();

  const sections = buildReviewSections(draft);

  return (
    <div className="flex flex-col gap-8">
      <StepHeading
        title="Contact & Review"
        description="Last step — how should we reach you, and does everything below look right?"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <TextField
          id={nameId}
          label="Contact name"
          required
          value={draft.contactName}
          onChange={(v) => update("contactName", v)}
          autoComplete="name"
          error={errors.contactName}
        />
        <TextField
          id={emailId}
          label="Email"
          type="email"
          required
          value={draft.contactEmail}
          onChange={(v) => update("contactEmail", v)}
          autoComplete="email"
          error={errors.contactEmail}
        />
        <TextField
          id={phoneId}
          label="Phone (optional)"
          type="tel"
          value={draft.contactPhone}
          onChange={(v) => update("contactPhone", v)}
          autoComplete="tel"
        />
      </div>

      <SingleSelectField
        legend="Preferred contact method"
        name="preferredContactMethod"
        options={DASH_CONTACT_METHOD_OPTIONS}
        value={draft.preferredContactMethod}
        onChange={(v) => update("preferredContactMethod", v)}
        columns={2}
      />

      <div className="flex flex-col gap-4 border-t border-line pt-6">
        <h3 className="text-lg font-semibold text-ink">Review your answers</h3>
        {sections.length === 0 ? (
          <p className="text-sm text-slate">Nothing entered yet — fill in the steps above.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {sections.map((section) => (
              <div
                key={section.stepId}
                className="flex flex-col gap-3 rounded-2xl border border-line bg-paper-dim p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-ink">{section.title}</h4>
                  <button
                    type="button"
                    onClick={() => onEditStep(section.stepId)}
                    className="text-xs font-medium text-gold hover:text-gold-bright"
                  >
                    Edit
                  </button>
                </div>
                <dl className="flex flex-col gap-1.5">
                  {section.rows.map((row) => (
                    <div key={row.label} className="flex flex-col gap-0.5 text-sm sm:flex-row sm:gap-2">
                      <dt className="shrink-0 font-medium text-slate sm:w-48">{row.label}</dt>
                      <dd className="text-ink whitespace-pre-line">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
