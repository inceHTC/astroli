import { prisma } from "../client";
import { getWeekRange } from "@/data/weeklyHoroscope";

/** Günlük burç yorumunu tarihe göre getir */
export async function getDailyHoroscope(zodiacId: string, date: Date = new Date()) {
  const dateOnly = toDateOnly(date);

  return prisma.dailyHoroscope.findFirst({
    where: {
      zodiacId: zodiacId.toLowerCase(),
      date: dateOnly,
    },
    orderBy: { createdAt: "desc" },
  });
}

/** Tüm burçlar için bugünün günlük yorumlarını getir. Tablo yoksa veya hata olursa boş dizi (build/CI uyumlu). Join yok, public sayfa için güvenli. */
export async function getAllDailyHoroscopes(date: Date | string = new Date()) {
  try {
    const dateOnly = toDateOnly(date);
    return prisma.dailyHoroscope.findMany({
      where: { date: dateOnly },
      select: { zodiacId: true, text: true },
      orderBy: { zodiacId: "asc" },
    });
  } catch {
    return [];
  }
}

/** Admin API için: Zodiac join olmadan sadece günlük yorumları getirir (FK/join hatası riski yok). */
export async function getDailyHoroscopesForAdmin(date: Date | string) {
  try {
    const dateOnly = toDateOnly(date);
    return prisma.dailyHoroscope.findMany({
      where: { date: dateOnly },
      select: { zodiacId: true, text: true, date: true },
      orderBy: { zodiacId: "asc" },
    });
  } catch (e) {
    console.error("getDailyHoroscopesForAdmin error:", e);
    return [];
  }
}

/** Arşiv için: Yorum girilmiş tarihleri (en yeniden eskiye) döner. */
export async function getDailyHoroscopeAvailableDates(limit = 60): Promise<string[]> {
  try {
    const rows = await prisma.dailyHoroscope.findMany({
      select: { date: true },
      orderBy: { date: "desc" },
      distinct: ["date"],
      take: limit,
    });
    return rows.map((r) => r.date.toISOString().slice(0, 10));
  } catch {
    return [];
  }
}

/** Admin dashboard: Günlük burç girilmiş gün sayısı (kaç tarih için yorum var). */
export async function getDailyHoroscopeDatesCount(): Promise<number> {
  try {
    const result = await prisma.dailyHoroscope.groupBy({
      by: ["date"],
      _count: { date: true },
    });
    return result.length;
  } catch {
    return 0;
  }
}

/** Admin dashboard: Haftalık burç girilmiş hafta sayısı (kaç hafta için yorum var). */
export async function getWeeklyHoroscopeWeeksCount(): Promise<number> {
  try {
    const result = await prisma.weeklyHoroscope.groupBy({
      by: ["weekStart"],
      _count: { weekStart: true },
    });
    return result.length;
  } catch {
    return 0;
  }
}

/** Haftalık burç yorumunu hafta aralığına göre getir */
export async function getWeeklyHoroscope(zodiacId: string, date: Date = new Date()) {
  const { start, end } = getWeekRange(date);
  
  return prisma.weeklyHoroscope.findFirst({
    where: {
      zodiacId: zodiacId.toLowerCase(),
      weekStart: { lte: end },
      weekEnd: { gte: start },
    },
    orderBy: { createdAt: "desc" },
  });
}

/** Tüm burçlar için bu haftanın yorumlarını getir. Tablo yoksa veya hata olursa boş dizi (build/CI uyumlu). */
export async function getAllWeeklyHoroscopes(date: Date = new Date()) {
  try {
    const { start, end } = getWeekRange(date);
    return prisma.weeklyHoroscope.findMany({
      where: {
        weekStart: { lte: end },
        weekEnd: { gte: start },
      },
      include: { zodiac: true },
      orderBy: { zodiac: { id: "asc" } },
    });
  } catch {
    return [];
  }
}

/** Admin API: Haftalık yorumları Zodiac join olmadan getirir (FK/join hatası riski azalır). */
export async function getWeeklyHoroscopesForAdmin(weekStart: Date | string) {
  try {
    const start = toWeekDateOnly(weekStart);
    return prisma.weeklyHoroscope.findMany({
      where: { weekStart: start },
      select: {
        zodiacId: true,
        health: true,
        love: true,
        money: true,
        work: true,
        healthText: true,
        loveText: true,
        moneyText: true,
        workText: true,
        summary: true,
        advice: true,
        weekStart: true,
        weekEnd: true,
      },
      orderBy: { zodiacId: "asc" },
    });
  } catch (e) {
    console.error("getWeeklyHoroscopesForAdmin error:", e);
    return [];
  }
}

/** Tarihi takvim günü olarak UTC'de normalize eder (timezone hatası önlenir). */
function toDateOnly(date: Date | string): Date {
  if (typeof date === "string") {
    const [y, m, d] = date.split("-").map(Number);
    return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  }
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();
  return new Date(Date.UTC(y, m, d));
}

/** Günlük burç yorumu oluştur veya güncelle */
export async function upsertDailyHoroscope(
  zodiacId: string,
  date: Date | string,
  text: string
) {
  const dateOnly = toDateOnly(date);
  const id = zodiacId.toLowerCase().trim();

  return prisma.dailyHoroscope.upsert({
    where: {
      zodiacId_date: {
        zodiacId: id,
        date: dateOnly,
      },
    },
    update: { text, updatedAt: new Date() },
    create: {
      zodiacId: id,
      date: dateOnly,
      text,
    },
  });
}

/** Hafta başı/sonu tarihlerini DATE (UTC gün) olarak normalize eder. */
function toWeekDateOnly(date: Date | string): Date {
  if (typeof date === "string") {
    const [y, m, d] = date.split("-").map(Number);
    return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  }
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/** Haftalık burç yorumu oluştur veya güncelle */
export async function upsertWeeklyHoroscope(
  zodiacId: string,
  weekStart: Date | string,
  weekEnd: Date | string,
  data: {
    health: number;
    love: number;
    money: number;
    work: number;
    healthText?: string | null;
    loveText?: string | null;
    moneyText?: string | null;
    workText?: string | null;
    summary: string;
    advice: string;
  }
) {
  const start = toWeekDateOnly(weekStart);
  const end = toWeekDateOnly(weekEnd);

  return prisma.weeklyHoroscope.upsert({
    where: {
      zodiacId_weekStart: {
        zodiacId: zodiacId.toLowerCase(),
        weekStart: start,
      },
    },
    update: {
      health: data.health,
      love: data.love,
      money: data.money,
      work: data.work,
      healthText: data.healthText ?? null,
      loveText: data.loveText ?? null,
      moneyText: data.moneyText ?? null,
      workText: data.workText ?? null,
      summary: data.summary,
      advice: data.advice,
      weekEnd: end,
      updatedAt: new Date(),
    },
    create: {
      zodiacId: zodiacId.toLowerCase(),
      weekStart: start,
      weekEnd: end,
      health: data.health,
      love: data.love,
      money: data.money,
      work: data.work,
      healthText: data.healthText ?? null,
      loveText: data.loveText ?? null,
      moneyText: data.moneyText ?? null,
      workText: data.workText ?? null,
      summary: data.summary,
      advice: data.advice,
    },
  });
}
