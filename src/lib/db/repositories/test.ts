import { prisma } from "../client";

export async function getPublishedTests() {
  return prisma.test.findMany({
    where: { published: true },
    include: {
      questions: { orderBy: { order: "asc" }, include: { options: { orderBy: { order: "asc" } } } },
      results: true,
    },
  });
}

/** Admin: tüm testler (yayında olanlar dahil). */
export async function listAllTestsForAdmin() {
  return prisma.test.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { questions: true } },
    },
  });
}

export async function getTestBySlugForAdmin(slug: string) {
  return prisma.test.findUnique({
    where: { slug },
  });
}

export async function createTest(data: {
  slug: string;
  title: string;
  description: string;
  duration: string;
  image?: string | null;
  category?: string | null;
  published?: boolean;
}) {
  return prisma.test.create({
    data: {
      slug: data.slug,
      title: data.title,
      description: data.description,
      duration: data.duration,
      image: data.image ?? undefined,
      category: data.category ?? undefined,
      published: data.published ?? false,
    },
  });
}

export async function getTestBySlug(slug: string) {
  return prisma.test.findFirst({
    where: { slug, published: true },
    include: {
      questions: { orderBy: { order: "asc" }, include: { options: { orderBy: { order: "asc" } } } },
      results: true,
    },
  });
}

export async function getTestById(id: string) {
  return prisma.test.findUnique({
    where: { id },
    include: {
      questions: { orderBy: { order: "asc" }, include: { options: { orderBy: { order: "asc" } } } },
      results: true,
    },
  });
}

export async function createTestCompletion(testId: string, device?: string | null) {
  return prisma.testCompletion.create({
    data: { testId, device: device ?? undefined },
  });
}

export async function getCompletionsByTestId(testId: string) {
  return prisma.testCompletion.count({
    where: { testId },
  });
}

export async function getTodayCompletions() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  return prisma.testCompletion.count({
    where: { createdAt: { gte: startOfDay } },
  });
}

export async function getTotalCompletions() {
  return prisma.testCompletion.count();
}

export async function getMostPopularTest() {
  const grouped = await prisma.testCompletion.groupBy({
    by: ["testId"],
    _count: { testId: true },
    orderBy: { _count: { testId: "desc" } },
    take: 1,
  });
  if (grouped.length === 0) return null;
  return prisma.test.findUnique({
    where: { id: grouped[0].testId },
  });
}
