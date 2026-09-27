"use client";

import { useId } from "react";
import { TextField, SingleSelectField, StepHeading } from "../fields";
import { QUESTIONNAIRE_CONTACT_METHOD_OPTIONS, type QuestionnaireDraft } from "@/lib/questionnaire";
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

function buildReviewSections(d: QuestionnaireDraft): ReviewSection[] {
  const raw: ReviewSection[] = [
    {
      stepId: "business",
      title: "About Your Business",
      rows: [
        { label: "Business name", value: d.businessName },
        { label: "Industry", value: d.industry },
        { label: "What the business does", value: d.businessDescription },
        { label: "Location(s)", value: d.businessLocation },
        { label: "Business size", value: d.businessSize },
        { label: "Typical customers", value: d.typicalCustomers },
        { label: "Business goals", value: d.businessGoals },
        { label: "Current challenges", value: d.currentChallenges },
      ],
    },
    {
      stepId: "project",
      title: "Your Project",
      rows: [
        { label: "Services requested", value: joined(d.servicesNeeded, d.servicesNeededOtherText) },
        { label: "Primary problem to solve", value: d.primaryProblem },
        { label: "What success looks like", value: d.successDefinition },
        { label: "Desired timeframe", value: d.timeframe },
      ],
    },
    {
      stepId: "website",
      title: "Website",
      rows: [
        { label: "Currently has a website", value: d.hasWebsite },
        { label: "Current site URL", value: d.currentWebsiteUrl },
        { label: "Likes about current site", value: d.currentWebsiteLikes },
        { label: "Wants improved", value: d.currentWebsiteDislikes },
        { label: "Visitors should be able to", value: joined(d.websiteGoals, d.websiteGoalsOtherText) },
        { label: "Assets already available", value: joined(d.websiteAssets) },
        { label: "Design preferences", value: d.designPreferences },
      ],
    },
    {
      stepId: "operations",
      title: "CRM & Business Operations",
      rows: [
        { label: "How they're managed today", value: d.currentManagementDescription },
        { label: "Customer info needed", value: d.customerInfoNeeded },
        { label: "Stages/statuses", value: d.stagesStatuses },
        { label: "Different staff access levels", value: d.staffAccessLevels },
        { label: "Useful features", value: joined(d.crmFeatures, d.crmFeaturesOtherText) },
      ],
    },
    {
      stepId: "analytics",
      title: "Analytics & Reporting",
      rows: [
        { label: "Wants to understand", value: joined(d.analyticsInterests, d.analyticsInterestsOtherText) },
        { label: "Where data lives", value: joined(d.dataSources) },
        { label: "Who needs access", value: d.reportAccess },
        { label: "Reporting frequency", value: d.reportFrequency },
        { label: "Decisions to inform", value: d.analyticsDecisions },
      ],
    },
    {
      stepId: "automation",
      title: "Automation & AI",
      rows: [
        { label: "Repetitive work", value: joined(d.repetitiveTasks, d.repetitiveTasksOtherText) },
        { label: "Interested in", value: joined(d.automationInterests) },
        { label: "Manual process to automate", value: d.manualProcessDescription },
      ],
    },
    {
      stepId: "additional",
      title: "Additional Requirements",
      rows: [
        { label: "Anything else to build", value: d.additionalDetails },
        { label: "Liked examples", value: d.likedExamples },
        { label: "Must integrate with", value: d.integrationRequirements },
        { label: "Does not want", value: d.dislikedThings },
      ],
    },
    {
      stepId: "contact",
      title: "Contact",
      rows: [
        { label: "Name", value: d.contactName },
        { label: "Role/title", value: d.contactRole },
        { label: "Email", value: d.contactEmail },
        { label: "Phone", value: d.contactPhone },
        { label: "Preferred contact method", value: d.preferredContactMethod },
        { label: "Best time to contact", value: d.bestTimeToContact },
      ],
    },
  ];

  return raw
    .map((section) => ({ ...section, rows: section.rows.filter((r) => r.value) }))
    .filter((section) => section.rows.length > 0);
}

export default function StepContactReview({
  draft,
  update,
  errors,
  onEditStep,
}: StepProps & { onEditStep: (stepId: StepId) => void }) {
  const nameId = useId();
  const roleId = useId();
  const emailId = useId();
  const phoneId = useId();
  const bestTimeId = useId();

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
          id={roleId}
          label="Role / title"
          value={draft.contactRole}
          onChange={(v) => update("contactRole", v)}
          autoComplete="organization-title"
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
          label="Phone"
          type="tel"
          value={draft.contactPhone}
          onChange={(v) => update("contactPhone", v)}
          autoComplete="tel"
        />
      </div>

      <SingleSelectField
        legend="Preferred contact method"
        name="preferredContactMethod"
        options={QUESTIONNAIRE_CONTACT_METHOD_OPTIONS}
        value={draft.preferredContactMethod}
        onChange={(v) => update("preferredContactMethod", v)}
        columns={2}
      />

      <TextField
        id={bestTimeId}
        label="Best time to contact (optional)"
        value={draft.bestTimeToContact}
        onChange={(v) => update("bestTimeToContact", v)}
        placeholder="e.g. weekday mornings"
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
