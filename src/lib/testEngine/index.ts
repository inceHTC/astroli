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
}

export interface TestOption {
  id: string;
  weights: unknown;
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
  strengths: string[] | null;
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
  const elementTotals: Record<string, number> = {
    fire: 0,
    earth: 0,
    air: 0,
    water: 0,
  };

  const optionMap = new Map<string, { weights: Record<string, number> }>();
  for (const q of test.questions) {
    for (const opt of q.options) {
      const weights = opt.weights as Record<string, number>;
      if (weights && typeof weights === "object") {
        optionMap.set(opt.id, { weights });
      }
    }
  }

  for (const ans of answers) {
    const opt = optionMap.get(ans.optionId);
    if (!opt) continue;
    for (const [elem, val] of Object.entries(opt.weights)) {
      if (typeof val === "number" && elem in elementTotals) {
        elementTotals[elem] += val;
      }
    }
  }

  const sum = Object.values(elementTotals).reduce((a, b) => a + b, 0);
  const elements: Record<string, number> = {};
  for (const [k, v] of Object.entries(elementTotals)) {
    elements[k] = sum > 0 ? Math.round((v / sum) * 100) : 0;
  }

  const primary = (Object.entries(elements).sort((a, b) => b[1] - a[1])[0] ?? ["fire", 0])[0];
  const primaryScore = elements[primary] ?? 0;

  let template = test.results.find(
    (r) => r.primaryKey === primary && primaryScore >= r.minScore && primaryScore <= r.maxScore
  );
  if (!template) {
    template = test.results.find((r) => r.primaryKey === primary);
  }
  if (!template) {
    template = test.results[0];
  }
  if (!template) {
    return null;
  }

  const elementData = template.elementData as Record<string, number>;
  return {
    primaryType: template.primaryLabel,
    elements,
    description: template.description,
    subtitle: template.subtitle ?? undefined,
    strengths: template.strengths ?? [],
    shadowSide: template.shadowSide ?? "",
    elementData: elementData && typeof elementData === "object" ? elementData : elements,
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
