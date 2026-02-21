import { prisma } from "../client";
import type { TocItem } from "@/lib/utils/content";

const ARTICLE_SELECT = {
  id: true,
  title: true,
  slug: true,
  tag: true,
  image: true,
  excerpt: true,
  content: true,
  readTime: true,
  toc: true,
  published: true,
  featured: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function listPublishedArticles() {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: { updatedAt: "desc" },
    select: ARTICLE_SELECT,
  });
}

/** Sadece slug ve updatedAt; sitemap için hafif liste. */
export async function listPublishedSlugs() {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: { updatedAt: "desc" },
    select: { slug: true, updatedAt: true },
  });
}

export async function listFeaturedArticles(limit = 6) {
  return prisma.article.findMany({
    where: { published: true, featured: true },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: ARTICLE_SELECT,
  });
}

export async function listAllArticles() {
  return prisma.article.findMany({
    orderBy: { updatedAt: "desc" },
    select: ARTICLE_SELECT,
  });
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findFirst({
    where: { slug, published: true },
    select: ARTICLE_SELECT,
  });
}

export async function getArticleById(id: string) {
  return prisma.article.findUnique({
    where: { id },
    select: ARTICLE_SELECT,
  });
}

export async function getArticleBySlugForAdmin(slug: string) {
  return prisma.article.findUnique({
    where: { slug },
    select: ARTICLE_SELECT,
  });
}

export async function getRelatedArticles(slug: string, tag: string, limit = 3) {
  return prisma.article.findMany({
    where: { published: true, slug: { not: slug }, tag },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: ARTICLE_SELECT,
  });
}

export async function createArticle(data: {
  title: string;
  slug: string;
  tag: string;
  image?: string | null;
  excerpt?: string | null;
  content: string;
  readTime?: number | null;
  toc?: TocItem[] | null;
  published: boolean;
  featured?: boolean;
}) {
  return prisma.article.create({
    data: {
      ...data,
      featured: data.featured ?? false,
    },
    select: ARTICLE_SELECT,
  });
}

export async function updateArticle(
  id: string,
  data: {
    title?: string;
    slug?: string;
    tag?: string;
    image?: string | null;
    excerpt?: string | null;
    content?: string;
    readTime?: number | null;
    toc?: TocItem[] | null;
    published?: boolean;
    featured?: boolean;
  }
) {
  return prisma.article.update({
    where: { id },
    data,
    select: ARTICLE_SELECT,
  });
}

export async function deleteArticle(id: string) {
  return prisma.article.delete({
    where: { id },
  });
}
