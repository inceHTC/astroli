/**
 * Zodiac sign from ecliptic longitude (0–360°).
 * Tropical zodiac: 12 signs, 30° each, Aries starts at 0° (vernal equinox).
 */

export type ZodiacSignId =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

export const SIGN_IDS: ZodiacSignId[] = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];

const SIGN_SYMBOLS: Record<ZodiacSignId, string> = {
  aries: "♈",
  taurus: "♉",
  gemini: "♊",
  cancer: "♋",
  leo: "♌",
  virgo: "♍",
  libra: "♎",
  scorpio: "♏",
  sagittarius: "♐",
  capricorn: "♑",
  aquarius: "♒",
  pisces: "♓",
};

const SIGN_DEGREE_STARTS: Record<ZodiacSignId, number> = {
  aries: 0,
  taurus: 30,
  gemini: 60,
  cancer: 90,
  leo: 120,
  virgo: 150,
  libra: 180,
  scorpio: 210,
  sagittarius: 240,
  capricorn: 270,
  aquarius: 300,
  pisces: 330,
};

export interface ZodiacPosition {
  sign: ZodiacSignId;
  symbol: string;
  degreeInSign: number;
  longitude: number;
}

/**
 * Normalize longitude to [0, 360).
 */
function normalizeLongitude(lon: number): number {
  let x = lon % 360;
  if (x < 0) x += 360;
  return x;
}

/**
 * Convert ecliptic longitude (degrees) to zodiac sign and degree within sign.
 */
export function longitudeToZodiac(longitude: number): ZodiacPosition {
  const lon = normalizeLongitude(longitude);
  const signIndex = Math.floor(lon / 30) % 12;
  const sign = SIGN_IDS[signIndex];
  const degreeInSign = lon - signIndex * 30;

  return {
    sign,
    symbol: SIGN_SYMBOLS[sign],
    degreeInSign: Math.round(degreeInSign * 100) / 100,
    longitude: Math.round(lon * 100) / 100,
  };
}

/**
 * Get the start longitude of a sign (for aspect / house math).
 */
export function signToStartLongitude(sign: ZodiacSignId): number {
  return SIGN_DEGREE_STARTS[sign];
}

/**
 * Convert sign + degree-in-sign back to absolute longitude.
 */
export function zodiacToLongitude(sign: ZodiacSignId, degreeInSign: number): number {
  return normalizeLongitude(SIGN_DEGREE_STARTS[sign] + degreeInSign);
}
