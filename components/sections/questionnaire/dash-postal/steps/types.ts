import type {
  DashPostalQuestionnaireDraft,
  DashPostalFieldErrors,
} from "@/lib/questionnaire-dash-postal";

/** Shared prop shape for every Dash Postal questionnaire step component. */
export type StepProps = {
  draft: DashPostalQuestionnaireDraft;
  update: <K extends keyof DashPostalQuestionnaireDraft>(
    key: K,
    value: DashPostalQuestionnaireDraft[K]
  ) => void;
  errors: DashPostalFieldErrors;
};

export type StepId =
  | "business"
  | "website"
  | "branding"
  | "automation"
  | "priorities"
  | "contact";
