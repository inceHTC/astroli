/**
 * Turkey province + district → latitude, longitude.
 * Local dataset only; no external API.
 */

import locationsData from "./turkeyLocations.json";

interface District {
  name: string;
  lat: number;
  lon: number;
}

interface Province {
  name: string;
  lat: number;
  lon: number;
  districts: District[];
}

const provinces = locationsData.provinces as Province[];

function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

function matchName(a: string, b: string): boolean {
  return normalize(a) === normalize(b);
}

export function getProvinces(): string[] {
  return provinces.map((p) => p.name).sort((a, b) => a.localeCompare(b, "tr"));
}

export function getDistricts(provinceName: string): District[] {
  const province = provinces.find((p) => matchName(p.name, provinceName));
  if (!province) return [];
  return province.districts;
}

export function getDistrictNames(provinceName: string): string[] {
  return getDistricts(provinceName).map((d) => d.name).sort((a, b) => a.localeCompare(b, "tr"));
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function getCoordinates(
  provinceName: string,
  districtName: string
): Coordinates | null {
  const province = provinces.find((p) => matchName(p.name, provinceName));
  if (!province) return null;

  const district = province.districts.find((d) =>
    matchName(d.name, districtName)
  );
  if (district) {
    return { latitude: district.lat, longitude: district.lon };
  }
  return {
    latitude: province.lat,
    longitude: province.lon,
  };
}
