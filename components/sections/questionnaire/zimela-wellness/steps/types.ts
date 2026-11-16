import type {
  ZimelaWellnessQuestionnaireDraft,
  ZimelaWellnessFieldErrors,
} from "@/lib/questionnaire-zimela-wellness";

/** Shared prop shape for every Zimela Wellness Center questionnaire step component. */
export type StepProps = {
  draft: ZimelaWellnessQuestionnaireDraft;
  update: <K extends keyof ZimelaWellnessQuestionnaireDraft>(
    key: K,
    value: ZimelaWellnessQuestionnaireDraft[K]
  ) => void;
  errors: ZimelaWellnessFieldErrors;
};

export type StepId =
  | "practice"
  | "website"
  | "booking"
  | "systems"
  | "ai"
  | "security"
  | "priorities"
  | "contact";
