import { prisma } from "../client";
import { getWeekRange } from "@/data/weeklyHoroscope";

function toDateOnly(d: Date): Date {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

export type CosmicEnergyData = {
  generalEnergy: string;
  elementFire: string;
  elementEarth: string;
  elementAir: string;
  elementWater: string;
  planetMercury: string;
  planetVenus: string;
  planetMars: string;
  advice: string;
  overviewFire: string;
  overviewEarth: string;
  overviewAir: string;
  overviewWater: string;
};

/** Belirtilen hafta için kozmik enerji kaydını getirir */
export async function getCosmicEnergyForWeek(
  date: Date = new Date()
): Promise<(CosmicEnergyData & { weekStart: Date; weekEnd: Date }) | null> {
  try {
    const { start, end } = getWeekRange(date);
    const weekStart = toDateOnly(start);
    const weekEnd = toDateOnly(end);
    const row = await prisma.weeklyCosmicEnergy.findUnique({
      where: { weekStart },
    });
    if (!row) return null;
    return {
      weekStart: row.weekStart,
      weekEnd: row.weekEnd,
      generalEnergy: row.generalEnergy,
      elementFire: row.elementFire,
      elementEarth: row.elementEarth,
      elementAir: row.elementAir,
      elementWater: row.elementWater,
      planetMercury: row.planetMercury,
      planetVenus: row.planetVenus,
      planetMars: row.planetMars,
      advice: row.advice,
      overviewFire: row.overviewFire,
      overviewEarth: row.overviewEarth,
      overviewAir: row.overviewAir,
      overviewWater: row.overviewWater,
    };
  } catch {
    return null;
  }
}

/** Arşiv için: Kayıtlı hafta başlangıç tarihlerini (en yeniden eskiye) döner */
export async function getCosmicEnergyAvailableWeeks(limit = 52): Promise<string[]> {
  try {
    const rows = await prisma.weeklyCosmicEnergy.findMany({
      select: { weekStart: true },
      orderBy: { weekStart: "desc" },
      take: limit,
    });
    return rows.map((r) => r.weekStart.toISOString().slice(0, 10));
  } catch {
    return [];
  }
}

/** Haftalık kozmik enerji kaydı oluşturur veya günceller */
export async function upsertCosmicEnergy(
  weekStart: Date,
  weekEnd: Date,
  data: CosmicEnergyData
): Promise<void> {
  const start = toDateOnly(weekStart);
  const end = toDateOnly(weekEnd);
  await prisma.weeklyCosmicEnergy.upsert({
    where: { weekStart: start },
    update: {
      weekEnd: end,
      generalEnergy: data.generalEnergy,
      elementFire: data.elementFire,
      elementEarth: data.elementEarth,
      elementAir: data.elementAir,
      elementWater: data.elementWater,
      planetMercury: data.planetMercury,
      planetVenus: data.planetVenus,
      planetMars: data.planetMars,
      advice: data.advice,
      overviewFire: data.overviewFire,
      overviewEarth: data.overviewEarth,
      overviewAir: data.overviewAir,
      overviewWater: data.overviewWater,
      updatedAt: new Date(),
    },
    create: {
      weekStart: start,
      weekEnd: end,
      generalEnergy: data.generalEnergy,
      elementFire: data.elementFire,
      elementEarth: data.elementEarth,
      elementAir: data.elementAir,
      elementWater: data.elementWater,
      planetMercury: data.planetMercury,
      planetVenus: data.planetVenus,
      planetMars: data.planetMars,
      advice: data.advice,
      overviewFire: data.overviewFire,
      overviewEarth: data.overviewEarth,
      overviewAir: data.overviewAir,
      overviewWater: data.overviewWater,
    },
  });
}
