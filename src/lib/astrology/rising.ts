/**
 * Ascendant (Rising sign) from birth time and place.
 * Uses local sidereal time and obliquity from astronomy-engine.
 */

import { MakeTime, SiderealTime, e_tilt } from "astronomy-engine";

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

/**
 * Compute ecliptic longitude of the Ascendant (rising point on the ecliptic).
 * LST = Local Sidereal Time in degrees; phi = latitude; epsilon = obliquity.
 * Formula: tan(ASC) = sin(LST) / (cos(LST)*cos(epsilon) - tan(phi)*sin(epsilon))
 * Then ASC in 0–360.
 */
export function computeAscendantLongitude(
  dateUtc: Date,
  latitudeDeg: number,
  longitudeDeg: number
): number {
  const time = MakeTime(dateUtc);
  const gastHours = SiderealTime(time);
  const lstHours = gastHours + longitudeDeg / 15;
  const lstDeg = (lstHours * 15) % 360;
  const lst = (lstDeg < 0 ? lstDeg + 360 : lstDeg) * DEG2RAD;
  const phi = latitudeDeg * DEG2RAD;
  const { tobl } = e_tilt(time);
  const epsilon = tobl;

  const y = Math.sin(lst);
  const x = Math.cos(epsilon) * Math.cos(lst) - Math.tan(phi) * Math.sin(epsilon);
  let asc = Math.atan2(y, x) * RAD2DEG;
  if (asc < 0) asc += 360;
  return Math.round(asc * 100) / 100;
}
