export type ZodiacSign =
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

const SIGN_ORDER: ZodiacSign[] = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
];

const DATE_RANGES: { sign: ZodiacSign; start: [number, number]; end: [number, number] }[] = [
  { sign: "capricorn", start: [12, 22], end: [1, 19] },
  { sign: "aries", start: [3, 21], end: [4, 19] },
  { sign: "taurus", start: [4, 20], end: [5, 20] },
  { sign: "gemini", start: [5, 21], end: [6, 20] },
  { sign: "cancer", start: [6, 21], end: [7, 22] },
  { sign: "leo", start: [7, 23], end: [8, 22] },
  { sign: "virgo", start: [8, 23], end: [9, 22] },
  { sign: "libra", start: [9, 23], end: [10, 22] },
  { sign: "scorpio", start: [10, 23], end: [11, 21] },
  { sign: "sagittarius", start: [11, 22], end: [12, 21] },
  { sign: "aquarius", start: [1, 20], end: [2, 18] },
  { sign: "pisces", start: [2, 19], end: [3, 20] },
];

function inRange(month: number, day: number, start: [number, number], end: [number, number]): boolean {
  if (start[0] > end[0]) {
    return (month === start[0] && day >= start[1]) || (month === end[0] && day <= end[1]);
  }
  return (
    (month === start[0] && day >= start[1]) ||
    (month === end[0] && day <= end[1])
  );
}

export function calculateSunSign(month: number, day: number): ZodiacSign | null {
  for (const { sign, start, end } of DATE_RANGES) {
    if (inRange(month, day, start, end)) return sign;
  }
  return null;
}

export function getRisingSign(
  month: number,
  day: number,
  hour: number,
  minute: number
): ZodiacSign {
  const sunSign = calculateSunSign(month, day) ?? "aries";
  const sunIndex = SIGN_ORDER.indexOf(sunSign);
  const totalMinutes = hour * 60 + minute;
  const hoursFrom6 = (totalMinutes - 6 * 60) / 60;
  const offset = Math.max(0, Math.floor(hoursFrom6 / 2));
  const risingIndex = (sunIndex + offset + 12) % 12;
  return SIGN_ORDER[risingIndex];
}

function getDayOfYear(month: number, day: number): number {
  const days = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  return days[month - 1] + day;
}

export function getMoonSign(month: number, day: number): ZodiacSign {
  const dayOfYear = getDayOfYear(month, day);
  const index = Math.floor((dayOfYear % 28) / 2.33) % 12;
  return SIGN_ORDER[index];
}

export interface ChartResult {
  sun: string;
  rising: string;
  moon: string;
}

export function calculateChart(date: string, time: string): ChartResult | null {
  const [year, monthStr, dayStr] = date.split("-").map(Number);
  const [hourStr, minuteStr] = time.split(":").map(Number);
  const month = monthStr;
  const day = dayStr;
  const hour = hourStr ?? 12;
  const minute = minuteStr ?? 0;

  const sun = calculateSunSign(month, day);
  if (!sun) return null;

  const rising = getRisingSign(month, day, hour, minute);
  const moon = getMoonSign(month, day);

  return { sun, rising, moon };
}
