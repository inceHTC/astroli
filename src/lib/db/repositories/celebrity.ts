import { prisma } from "../client";

const DEFAULT_LIMIT = 50;

export async function listCelebrities(limit = DEFAULT_LIMIT) {
  return prisma.celebrity.findMany({
    orderBy: { name: "asc" },
    take: limit,
  });
}

/** Sadece slug; sitemap için hafif liste. */
export async function listCelebritySlugs() {
  return prisma.celebrity.findMany({
    orderBy: { name: "asc" },
    select: { slug: true },
  });
}

/** For @mention replacement in articles: slug, name, image. */
export async function listCelebritiesForMentions(limit = 1000) {
  return prisma.celebrity.findMany({
    select: { slug: true, name: true, image: true },
    orderBy: { name: "asc" },
    take: limit,
  });
}

export async function listCelebritiesFeatured(limit = 8) {
  const featured = await prisma.celebrity.findMany({
    where: { featured: true },
    orderBy: { name: "asc" },
    take: limit,
  });
  if (featured.length >= limit) return featured;
  const rest = await prisma.celebrity.findMany({
    where: { id: { notIn: featured.map((c) => c.id) } },
    orderBy: { name: "asc" },
    take: limit - featured.length,
  });
  return [...featured, ...rest];
}

export async function listCelebritiesByZodiac(zodiac: string, limit = DEFAULT_LIMIT) {
  return prisma.celebrity.findMany({
    where: { zodiac },
    orderBy: { name: "asc" },
    take: limit,
  });
}

export async function getCelebrityBySlug(slug: string) {
  return prisma.celebrity.findUnique({
    where: { slug },
  });
}

export async function getCelebritiesByZodiacExcluding(zodiac: string, excludeId: string, limit = 4) {
  return prisma.celebrity.findMany({
    where: { zodiac, id: { not: excludeId } },
    orderBy: { name: "asc" },
    take: limit,
  });
}

export async function getCelebrityById(id: string) {
  return prisma.celebrity.findUnique({
    where: { id },
  });
}

export async function createCelebrity(data: {
  name: string;
  slug: string;
  job: string;
  zodiac: string;
  image?: string | null;
  birthDate?: Date | null;
  bio?: string | null;
  featured: boolean;
}) {
  return prisma.celebrity.create({
    data,
  });
}

export async function updateCelebrity(
  id: string,
  data: {
    name?: string;
    slug?: string;
    job?: string;
    zodiac?: string;
    image?: string | null;
    birthDate?: Date | null;
    bio?: string | null;
    featured?: boolean;
  }
) {
  return prisma.celebrity.update({
    where: { id },
    data,
  });
}

export async function deleteCelebrity(id: string) {
  return prisma.celebrity.delete({
    where: { id },
  });
}

export async function searchCelebritiesByName(query: string, limit = DEFAULT_LIMIT) {
  return prisma.celebrity.findMany({
    where: {
      name: { contains: query, mode: "insensitive" },
    },
    orderBy: { name: "asc" },
    take: limit,
  });
}
