import type { QuestionnaireDraft, QuestionnaireFieldErrors } from "@/lib/questionnaire";

/** Shared prop shape for every questionnaire step component. A single
 * generic `update` covers every field type in QuestionnaireDraft (plain
 * strings, enum strings, and string arrays alike), so each step only ever
 * needs this one setter. */
export type StepProps = {
  draft: QuestionnaireDraft;
  update: <K extends keyof QuestionnaireDraft>(key: K, value: QuestionnaireDraft[K]) => void;
  errors: QuestionnaireFieldErrors;
};

export type StepId =
  | "business"
  | "project"
  | "website"
  | "operations"
  | "analytics"
  | "automation"
  | "additional"
  | "contact";
