/**
 * Aspect detection between two ecliptic longitudes.
 * Orb: ±6° for major aspects.
 */

export type AspectType = "conjunction" | "opposition" | "trine" | "square";

const ORB_DEGREES = 6;

const ASPECT_ANGLES: Record<AspectType, number> = {
  conjunction: 0,
  opposition: 180,
  trine: 120,
  square: 90,
};

export interface Aspect {
  type: AspectType;
  angle: number;
  orb: number;
  body1: string;
  body2: string;
}

function normalizeAngle(deg: number): number {
  let x = deg % 360;
  if (x < 0) x += 360;
  return x;
}

/**
 * Shortest angular separation between two longitudes (0–180°).
 */
export function angularSeparation(lon1: number, lon2: number): number {
  const d = Math.abs(normalizeAngle(lon1) - normalizeAngle(lon2));
  return d > 180 ? 360 - d : d;
}

/**
 * Difference for conjunction (0°) and opposition (180°) – signed for "exact" direction.
 * Returns the difference in [0, 360) for lon2 - lon1 (so we can check near 0 or 180).
 */
function separationForConjunctionOpposition(lon1: number, lon2: number): number {
  return normalizeAngle(normalizeAngle(lon2) - normalizeAngle(lon1));
}

/**
 * Check if two longitudes form the given aspect within orb.
 */
function hasAspect(
  lon1: number,
  lon2: number,
  aspectType: AspectType,
  orb: number = ORB_DEGREES
): { match: boolean; orb: number } {
  const target = ASPECT_ANGLES[aspectType];

  if (aspectType === "conjunction" || aspectType === "opposition") {
    const diff = separationForConjunctionOpposition(lon1, lon2);
    const near0 = Math.min(diff, 360 - diff);
    const near180 = Math.abs(diff - 180);
    const actualSep = aspectType === "conjunction" ? near0 : Math.min(near180, 180 - near180);
    const actualOrb = Math.abs(actualSep - target);
    return { match: actualOrb <= orb, orb: Math.round(actualOrb * 100) / 100 };
  }

  const sep = angularSeparation(lon1, lon2);
  const actualOrb = Math.abs(sep - target);
  return { match: actualOrb <= orb, orb: Math.round(actualOrb * 100) / 100 };
}

export interface PlanetLongitude {
  id: string;
  longitude: number;
}

/**
 * Find all major aspects between the given planets (pairs, no duplicate pairs).
 */
export function computeAspects(planets: PlanetLongitude[]): Aspect[] {
  const aspects: Aspect[] = [];
  const types: AspectType[] = ["conjunction", "opposition", "trine", "square"];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const a = planets[i];
      const b = planets[j];
      for (const type of types) {
        const { match, orb } = hasAspect(a.longitude, b.longitude, type);
        if (match) {
          aspects.push({
            type,
            angle: ASPECT_ANGLES[type],
            orb,
            body1: a.id,
            body2: b.id,
          });
        }
      }
    }
  }

  return aspects;
}
