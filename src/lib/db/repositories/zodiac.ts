import { prisma } from "../client";

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
