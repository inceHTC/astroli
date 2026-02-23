/**
 * Yarı-profesyonel test puanlama: 4 profil, her seçenek max 2 puan (tek profile 2, veya 1+1 iki profile, veya ters kodlu).
 */
export type ProfileKey = "fire" | "earth" | "air" | "water";

export const PROFILE_KEYS: ProfileKey[] = ["fire", "earth", "air", "water"];

/** Her seçenek: scores[profil] = 0 | 1 | 2, toplam 2 olmalı (tek 2, veya 1+1). */
export interface OptionScores {
  fire: number;
  earth: number;
  air: number;
  water: number;
}

export interface ScoredOption {
  id: string;
  text: string;
  /** Yeni sistem: her seçenek max 2 puan dağıtır (2 tek profile, veya 1+1). */
  scores: OptionScores;
}

/** Eski weight formatından scores üretir (weight tek key'de 3 ise → o profile 2). */
export function weightToScores(weight: Record<string, number>): OptionScores {
  const s: OptionScores = { fire: 0, earth: 0, air: 0, water: 0 };
  const entries = Object.entries(weight).filter(([, v]) => typeof v === "number" && v > 0);
  if (entries.length === 0) return s;
  if (entries.length === 1) {
    const [k, v] = entries[0];
    if (k in s) (s as unknown as Record<string, number>)[k] = v >= 2 ? 2 : 1;
    return s;
  }
  entries.slice(0, 2).forEach(([k]) => {
    if (k in s) (s as unknown as Record<string, number>)[k] = 1;
  });
  return s;
}

export interface ProfilePercent {
  profile: ProfileKey;
  raw: number;
  percent: number;
}

export interface ScoringResult {
  totals: Record<ProfileKey, number>;
  totalScore: number;
  percentages: Record<ProfileKey, number>;
  sorted: ProfilePercent[];
  primaryProfile: ProfileKey;
  secondaryProfile: ProfileKey;
  primaryScore: number;
  secondaryScore: number;
  /** İlk iki skor farkı 1 puandan az → karma profil. */
  isMixed: boolean;
  /** Tüm skorlar birbirine yakın → dengeli profil. */
  isBalanced: boolean;
  /** Bir profil max puanın %60'ından fazlasını aldıysa. */
  dominanceLevel: "yüksek_baskın" | "baskın" | "dengeli";
  maxPossiblePerProfile: number;
}
