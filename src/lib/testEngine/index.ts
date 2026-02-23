import { computeScoring } from "@/lib/testScoring";

export type ElementKey = "fire" | "earth" | "air" | "water";

export interface SubmitAnswer {
  questionId: string;
  optionId: string;
}

export interface SubmitResult {
  primaryType: string;
  elements: Record<string, number>;
  description: string;
  subtitle?: string;
  strengths: string[];
  shadowSide: string;
  elementData: Record<string, number>;
  /** Yarı-profesyonel puanlama */
  primaryProfile?: string;
  secondaryProfile?: string;
  isMixed?: boolean;
  isBalanced?: boolean;
  dominanceLevel?: "yüksek_baskın" | "baskın" | "dengeli";
}

export interface TestOption {
  id: string;
  text?: string;
  weights?: unknown;
  scores?: Record<string, number>;
}

export interface TestQuestion {
  id: string;
  options: TestOption[];
}

export interface TestResultTemplate {
  primaryKey: string;
  minScore: number;
  maxScore: number;
  primaryLabel: string;
  description: string;
  subtitle: string | null;
  /** Prisma returns JsonValue; at runtime we normalize to string[] */
  strengths: string[] | null | unknown;
  shadowSide: string;
  elementData: unknown;
}

export interface TestWithRelations {
  questions: TestQuestion[];
  results: TestResultTemplate[];
}

export function computeResult(
  test: TestWithRelations,
  answers: SubmitAnswer[]
): SubmitResult | null {
  const optionByQuestionId: Record<string, { id: string; text: string; scores?: Record<string, number>; weight?: Record<string, number> }> = {};
  for (const ans of answers) {
    const q = test.questions.find((x) => x.id === ans.questionId);
    if (!q) continue;
    const opt = q.options.find((o) => o.id === ans.optionId);
    if (!opt) continue;
    const weights = opt.weights as Record<string, number> | undefined;
    const scores = opt.scores as Record<string, number> | undefined;
    optionByQuestionId[ans.questionId] = {
      id: opt.id,
      text: (opt as { text?: string }).text ?? "",
      scores,
      weight: weights && typeof weights === "object" ? weights : undefined,
    };
  }
  const scoring = computeScoring(optionByQuestionId, test.questions.length);

  const primary = scoring.primaryProfile;
  let template = test.results.find((r) => r.primaryKey === primary);
  if (!template) template = test.results[0];
  if (!template) return null;

  const elements = scoring.percentages as Record<string, number>;
  const elementData = template.elementData as Record<string, number>;
  const strengths = Array.isArray(template.strengths) ? template.strengths : [];
  return {
    primaryType: template.primaryLabel,
    elements,
    description: template.description,
    subtitle: template.subtitle ?? undefined,
    strengths,
    shadowSide: template.shadowSide ?? "",
    elementData: elementData && typeof elementData === "object" ? elementData : elements,
    primaryProfile: scoring.primaryProfile,
    secondaryProfile: scoring.secondaryProfile,
    isMixed: scoring.isMixed,
    isBalanced: scoring.isBalanced,
    dominanceLevel: scoring.dominanceLevel,
  };
}

export function validateAnswers(
  test: TestWithRelations,
  answers: SubmitAnswer[]
): { valid: boolean; error?: string } {
  const questionIds = new Set(test.questions.map((q) => q.id));
  const answeredIds = new Set<string>();

  for (const ans of answers) {
    if (answeredIds.has(ans.questionId)) {
      return { valid: false, error: "Duplicate question answer" };
    }
    const q = test.questions.find((x) => x.id === ans.questionId);
    if (!q) {
      return { valid: false, error: "Invalid question" };
    }
    const optExists = q.options.some((o) => o.id === ans.optionId);
    if (!optExists) {
      return { valid: false, error: "Invalid option" };
    }
    answeredIds.add(ans.questionId);
  }

  if (answeredIds.size !== questionIds.size) {
    return { valid: false, error: "Missing answers" };
  }

  return { valid: true };
}
