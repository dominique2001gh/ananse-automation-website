import type {
  TaxOfficeTexasQuestionnaireDraft,
  TaxOfficeTexasFieldErrors,
} from "@/lib/questionnaire-tax-office-texas";

/** Shared prop shape for every The Tax Office Texas questionnaire step component. */
export type StepProps = {
  draft: TaxOfficeTexasQuestionnaireDraft;
  update: <K extends keyof TaxOfficeTexasQuestionnaireDraft>(
    key: K,
    value: TaxOfficeTexasQuestionnaireDraft[K]
  ) => void;
  errors: TaxOfficeTexasFieldErrors;
};

export type StepId =
  | "business"
  | "website"
  | "branding"
  | "automation"
  | "priorities"
  | "contact";
