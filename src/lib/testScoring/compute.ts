import type { ProfileKey, OptionScores, ScoringResult } from "./types";
import { PROFILE_KEYS } from "./types";

const EMPTY_TOTALS: Record<ProfileKey, number> = {
  fire: 0,
  earth: 0,
  air: 0,
  water: 0,
};

function getScores(option: { scores?: OptionScores | Record<string, number>; weight?: Record<string, number> }): OptionScores | null {
  if (option.scores && typeof option.scores === "object") {
    const s = option.scores as Record<string, number>;
    if (PROFILE_KEYS.every((k) => typeof s[k] === "number")) {
      return { fire: s.fire ?? 0, earth: s.earth ?? 0, air: s.air ?? 0, water: s.water ?? 0 };
    }
  }
  if (option.weight && typeof option.weight === "object") {
    const w = option.weight as Record<string, number>;
    return {
      fire: Math.min(2, w.fire ?? 0),
      earth: Math.min(2, w.earth ?? 0),
      air: Math.min(2, w.air ?? 0),
      water: Math.min(2, w.water ?? 0),
    };
  }
  return null;
}

/**
 * Kullanıcı cevaplarından skor hesaplar.
 * @param optionByQuestionId questionId -> seçilen option (id, text, scores veya weight)
 * @param numQuestions soru sayısı (max puan = 2 * numQuestions)
 */
export function computeScoring(
  optionByQuestionId: Record<string, { id: string; text: string; scores?: OptionScores | Record<string, number>; weight?: Record<string, number> }>,
  numQuestions: number
): ScoringResult {
  const totals = { ...EMPTY_TOTALS };

  for (const option of Object.values(optionByQuestionId)) {
    const scores = getScores(option);
    if (!scores) continue;
    for (const k of PROFILE_KEYS) {
      totals[k] += scores[k] ?? 0;
    }
  }

  const totalScore = (PROFILE_KEYS as readonly string[]).reduce((s, k) => s + totals[k as ProfileKey], 0) as number;
  const percentages: Record<ProfileKey, number> = { ...EMPTY_TOTALS };
  if (totalScore > 0) {
    for (const k of PROFILE_KEYS) {
      percentages[k] = Math.round((totals[k] / totalScore) * 100);
    }
  }

  const sorted: { profile: ProfileKey; raw: number; percent: number }[] = PROFILE_KEYS.map((profile) => ({
    profile,
    raw: totals[profile],
    percent: percentages[profile],
  })).sort((a, b) => b.raw - a.raw);

  const primaryProfile = sorted[0]?.profile ?? "fire";
  const secondaryProfile = sorted[1]?.profile ?? "earth";
  const primaryScore = totals[primaryProfile] ?? 0;
  const secondaryScore = totals[secondaryProfile] ?? 0;
  const diff = primaryScore - secondaryScore;
  const isMixed = diff >= 0 && diff < 1;
  const range = (sorted[0]?.raw ?? 0) - (sorted[3]?.raw ?? 0);
  const isBalanced = range <= 2 && totalScore > 0;

  const maxPossiblePerProfile = numQuestions * 2;
  const maxActual = Math.max(...PROFILE_KEYS.map((k) => totals[k]), 0);
  const ratio = maxPossiblePerProfile > 0 ? maxActual / maxPossiblePerProfile : 0;
  let dominanceLevel: ScoringResult["dominanceLevel"] = "dengeli";
  if (ratio > 0.6) dominanceLevel = "yüksek_baskın";
  else if (ratio > 0.4) dominanceLevel = "baskın";

  return {
    totals,
    totalScore,
    percentages,
    sorted,
    primaryProfile,
    secondaryProfile,
    primaryScore,
    secondaryScore,
    isMixed,
    isBalanced,
    dominanceLevel,
    maxPossiblePerProfile,
  };
}
