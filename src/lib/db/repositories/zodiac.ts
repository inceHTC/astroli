import { prisma } from "../client";
import { ZODIAC_SIGNS } from "@/data/zodiac";

export async function getZodiacById(id: string) {
  return prisma.zodiac.findUnique({
    where: { id: id.toLowerCase() },
  });
}

export async function getAllZodiacs() {
  return prisma.zodiac.findMany({
    orderBy: { id: "asc" },
  });
}

/** Günlük/haftalık burç kaydetmeden önce 12 burç kaydının var olduğundan emin olur. Hata yutulur. */
export async function ensureZodiacSignsExist(): Promise<void> {
  try {
    for (const sign of ZODIAC_SIGNS) {
      await prisma.zodiac.upsert({
        where: { id: sign.id },
        create: {
          id: sign.id,
          slug: sign.id,
          name: sign.name,
          nameTr: sign.nameTr,
          symbol: sign.symbol,
          element: sign.element,
          dates: sign.dates,
          overview: sign.generalOverview.slice(0, 2000),
          strengths: sign.male.strengths,
          weaknesses: sign.male.weaknesses,
          loveStyle: sign.male.love.slice(0, 500),
          career: sign.male.career.slice(0, 1000),
          money: "Maddi konularda bilinçli.",
          published: true,
        },
        update: {},
      });
    }
  } catch (e) {
    console.error("ensureZodiacSignsExist:", e);
  }
}
