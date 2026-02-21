/**
 * Birth chart calculation: planets, rising, aspects, summary.
 * Uses astronomy-engine for positions; all logic in /lib.
 */

import {
  Body,
  SunPosition,
  EclipticGeoMoon,
  GeoVector,
  Ecliptic,
} from "astronomy-engine";
import { longitudeToZodiac, type ZodiacSignId, type ZodiacPosition } from "./zodiac";
import { computeAspects, type Aspect } from "./aspects";
import { computeAscendantLongitude } from "./rising";
import { generateSummary } from "./summary";

export type PlanetId =
  | "sun"
  | "moon"
  | "mercury"
  | "venus"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "pluto";

export interface PlanetPosition {
  id: PlanetId;
  longitude: number;
  sign: ZodiacSignId;
  symbol: string;
  degreeInSign: number;
}

export interface RisingResult {
  longitude: number;
  sign: ZodiacSignId;
  symbol: string;
  degreeInSign: number;
}

/** Europe/Istanbul = UTC+3 → offset for conversion: local = UTC + 3h → UTC = local - 3h → -180 minutes */
export const TURKEY_TIMEZONE_OFFSET_MINUTES = -180;

export interface BirthChartInput {
  name: string;
  dateLocal: string;
  timeLocal: string;
  timezoneOffsetMinutes: number;
  latitude: number;
  longitude: number;
  isApproximate: boolean;
}

export interface BirthChartResult {
  meta: {
    name: string;
    isApproximate: boolean;
  };
  planets: Record<
    PlanetId,
    { sign: ZodiacSignId; degree: number; symbol: string; longitude: number }
  >;
  rising: {
    sign: ZodiacSignId;
    degree: number;
    symbol: string;
    longitude: number;
    isApproximate: boolean;
  };
  aspects: Aspect[];
  summary: string;
}

const BODY_MAP: { id: PlanetId; body: Body }[] = [
  { id: "mercury", body: Body.Mercury },
  { id: "venus", body: Body.Venus },
  { id: "mars", body: Body.Mars },
  { id: "jupiter", body: Body.Jupiter },
  { id: "saturn", body: Body.Saturn },
  { id: "uranus", body: Body.Uranus },
  { id: "neptune", body: Body.Neptune },
  { id: "pluto", body: Body.Pluto },
];

/**
 * Parse local date/time and timezone offset into a single UTC Date.
 * timezoneOffsetMinutes should be Date.getTimezoneOffset() (UTC - local in minutes).
 */
function toUtcDate(
  dateLocal: string,
  timeLocal: string,
  timezoneOffsetMinutes: number
): Date {
  const [y, m, d] = dateLocal.split("-").map(Number);
  const [hour, min] = timeLocal.split(":").map(Number);
  const localMinutes = (hour ?? 0) * 60 + (min ?? 0);
  const utcMinutes = localMinutes + timezoneOffsetMinutes;
  let day = d ?? 1;
  let remainder = utcMinutes;
  if (utcMinutes >= 24 * 60) {
    day += 1;
    remainder = utcMinutes - 24 * 60;
  } else if (utcMinutes < 0) {
    day -= 1;
    remainder = utcMinutes + 24 * 60;
  }
  const utcHour = Math.floor(remainder / 60);
  const utcMin = Math.floor(remainder % 60);
  return new Date(Date.UTC(y, (m ?? 1) - 1, day, utcHour, utcMin, 0, 0));
}

/**
 * Get geocentric ecliptic longitude for Sun.
 */
function getSunLongitude(date: Date): number {
  const pos = SunPosition(date);
  return pos.elon;
}

/**
 * Get geocentric ecliptic longitude for Moon.
 */
function getMoonLongitude(date: Date): number {
  const spherical = EclipticGeoMoon(date);
  return spherical.lon;
}

/**
 * Get geocentric ecliptic longitude for a planet (GeoVector in EQJ → Ecliptic gives ECT).
 */
function getPlanetLongitude(body: Body, date: Date): number {
  const vec = GeoVector(body, date, true);
  const ecl = Ecliptic(vec);
  return ecl.elon;
}

export function calculateBirthChart(input: BirthChartInput): BirthChartResult {
  const dateUtc = toUtcDate(
    input.dateLocal,
    input.timeLocal,
    input.timezoneOffsetMinutes
  );

  const planets: Record<PlanetId, PlanetPosition> = {} as Record<
    PlanetId,
    PlanetPosition
  >;

  const sunLon = getSunLongitude(dateUtc);
  planets.sun = toPlanetPosition("sun", sunLon);

  const moonLon = getMoonLongitude(dateUtc);
  planets.moon = toPlanetPosition("moon", moonLon);

  for (const { id, body } of BODY_MAP) {
    const lon = getPlanetLongitude(body, dateUtc);
    planets[id] = toPlanetPosition(id, lon);
  }

  const risingLon = computeAscendantLongitude(
    dateUtc,
    input.latitude,
    input.longitude
  );
  const risingPos = longitudeToZodiac(risingLon);
  const rising: RisingResult = {
    longitude: risingPos.longitude,
    sign: risingPos.sign,
    symbol: risingPos.symbol,
    degreeInSign: risingPos.degreeInSign,
  };

  const planetList = [
    { id: "sun", longitude: planets.sun.longitude },
    { id: "moon", longitude: planets.moon.longitude },
    ...BODY_MAP.map(({ id }) => ({ id, longitude: planets[id].longitude })),
  ];
  const aspects = computeAspects(planetList);

  const isApprox = input.isApproximate ?? false;
  const summary = generateSummary({
    sun: planets.sun,
    moon: planets.moon,
    rising,
    aspects,
    isApproximate: isApprox,
  });

  const planetEntries = Object.entries(planets) as [PlanetId, PlanetPosition][];
  const planetsOut: BirthChartResult["planets"] = {} as BirthChartResult["planets"];
  for (const [id, pos] of planetEntries) {
    planetsOut[id] = {
      sign: pos.sign,
      degree: Math.round(pos.degreeInSign * 100) / 100,
      symbol: pos.symbol,
      longitude: pos.longitude,
    };
  }

  return {
    meta: { name: input.name, isApproximate: isApprox },
    planets: planetsOut,
    rising: {
      sign: rising.sign,
      degree: Math.round(rising.degreeInSign * 100) / 100,
      symbol: rising.symbol,
      longitude: rising.longitude,
      isApproximate: isApprox,
    },
    aspects,
    summary,
  };
}

function toPlanetPosition(id: PlanetId, longitude: number): PlanetPosition {
  const pos = longitudeToZodiac(longitude);
  return {
    id,
    longitude: pos.longitude,
    sign: pos.sign,
    symbol: pos.symbol,
    degreeInSign: pos.degreeInSign,
  };
}
