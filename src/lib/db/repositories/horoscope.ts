import { prisma } from "../client";
import { getWeekRange } from "@/data/weeklyHoroscope";

/** Günlük burç yorumunu tarihe göre getir */
export async function getDailyHoroscope(zodiacId: string, date: Date = new Date()) {
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  
  return prisma.dailyHoroscope.findFirst({
    where: {
      zodiacId: zodiacId.toLowerCase(),
      date: dateOnly,
    },
    orderBy: { createdAt: "desc" },
  });
}

/** Tüm burçlar için bugünün günlük yorumlarını getir */
export async function getAllDailyHoroscopes(date: Date = new Date()) {
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  
  return prisma.dailyHoroscope.findMany({
    where: { date: dateOnly },
    include: { zodiac: true },
    orderBy: { zodiac: { id: "asc" } },
  });
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

/** Tüm burçlar için bu haftanın yorumlarını getir */
export async function getAllWeeklyHoroscopes(date: Date = new Date()) {
  const { start, end } = getWeekRange(date);
  
  return prisma.weeklyHoroscope.findMany({
    where: {
      weekStart: { lte: end },
      weekEnd: { gte: start },
    },
    include: { zodiac: true },
    orderBy: { zodiac: { id: "asc" } },
  });
}

/** Günlük burç yorumu oluştur veya güncelle */
export async function upsertDailyHoroscope(
  zodiacId: string,
  date: Date,
  text: string
) {
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  
  return prisma.dailyHoroscope.upsert({
    where: {
      zodiacId_date: {
        zodiacId: zodiacId.toLowerCase(),
        date: dateOnly,
      },
    },
    update: { text, updatedAt: new Date() },
    create: {
      zodiacId: zodiacId.toLowerCase(),
      date: dateOnly,
      text,
    },
  });
}

/** Haftalık burç yorumu oluştur veya güncelle */
export async function upsertWeeklyHoroscope(
  zodiacId: string,
  weekStart: Date,
  weekEnd: Date,
  data: {
    health: number;
    love: number;
    money: number;
    work: number;
    summary: string;
    advice: string;
  }
) {
  const start = new Date(weekStart);
  start.setHours(0, 0, 0, 0);
  const end = new Date(weekEnd);
  end.setHours(23, 59, 59, 999);
  
  return prisma.weeklyHoroscope.upsert({
    where: {
      zodiacId_weekStart: {
        zodiacId: zodiacId.toLowerCase(),
        weekStart: start,
      },
    },
    update: {
      ...data,
      weekEnd: end,
      updatedAt: new Date(),
    },
    create: {
      zodiacId: zodiacId.toLowerCase(),
      weekStart: start,
      weekEnd: end,
      ...data,
    },
  });
}
