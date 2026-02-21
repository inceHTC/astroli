import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateBirthChart, TURKEY_TIMEZONE_OFFSET_MINUTES } from "@/lib/astrology/calculateChart";
import { getCoordinates, getProvinces, getDistrictNames } from "@/lib/location";

const TIME_RANGES = [
  { value: "00:00-04:00", label: "00:00–04:00 (Night)", midpoint: "02:00" },
  { value: "04:00-08:00", label: "04:00–08:00 (Early Morning)", midpoint: "06:00" },
  { value: "08:00-12:00", label: "08:00–12:00 (Morning)", midpoint: "10:00" },
  { value: "12:00-16:00", label: "12:00–16:00 (Afternoon)", midpoint: "14:00" },
  { value: "16:00-20:00", label: "16:00–20:00 (Evening)", midpoint: "18:00" },
  { value: "20:00-24:00", label: "20:00–24:00 (Late Night)", midpoint: "22:00" },
] as const;

function getMidpointTime(rangeValue: string): string {
  const found = TIME_RANGES.find((r) => r.value === rangeValue);
  return found?.midpoint ?? "12:00";
}

const schemaExact = z.object({
  fullName: z.string().min(1, "Full name is required"),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  birthTime: z.string().regex(/^\d{1,2}:\d{2}$/),
  isApproximate: z.literal(false),
  province: z.string().min(1, "Province is required"),
  district: z.string().min(1, "District is required"),
});

const schemaApproximate = z.object({
  fullName: z.string().min(1, "Full name is required"),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeRange: z.enum([
    "00:00-04:00",
    "04:00-08:00",
    "08:00-12:00",
    "12:00-16:00",
    "16:00-20:00",
    "20:00-24:00",
  ]),
  isApproximate: z.literal(true),
  province: z.string().min(1, "Province is required"),
  district: z.string().min(1, "District is required"),
});

const schema = z.union([schemaExact, schemaApproximate]);

export async function GET() {
  try {
    const provinces = getProvinces();
    const districts: Record<string, string[]> = {};
    for (const p of provinces) {
      districts[p] = getDistrictNames(p);
    }
    return NextResponse.json({ provinces, districts });
  } catch {
    return NextResponse.json({ error: "Konumlar yüklenemedi." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz giriş.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const coords = getCoordinates(data.province, data.district);
    if (!coords) {
      return NextResponse.json(
        { error: "Seçilen il ve ilçe için konum bulunamadı." },
        { status: 400 }
      );
    }

    const timeLocal =
      data.isApproximate === true
        ? getMidpointTime(data.timeRange)
        : data.birthTime;

    const result = calculateBirthChart({
      name: data.fullName.trim(),
      dateLocal: data.birthDate,
      timeLocal,
      timezoneOffsetMinutes: TURKEY_TIMEZONE_OFFSET_MINUTES,
      latitude: coords.latitude,
      longitude: coords.longitude,
      isApproximate: data.isApproximate,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Harita hesaplanamadı. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
