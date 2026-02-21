import {
  listPublishedArticles,
  getArticleBySlug as getBySlug,
  listFeaturedArticles,
  getRelatedArticles,
} from "@/lib/db/repositories/article";

export type ArticlePublic = Awaited<ReturnType<typeof listPublishedArticles>>[number];

export async function getArticles(): Promise<ArticlePublic[]> {
  try {
    return await listPublishedArticles();
  } catch {
    return [];
  }
}

export async function getFeaturedArticles(limit = 6): Promise<ArticlePublic[]> {
  try {
    return await listFeaturedArticles(limit);
  } catch {
    return [];
  }
}

export async function getArticleBySlug(
  slug: string
): Promise<ArticlePublic | null> {
  try {
    return await getBySlug(slug);
  } catch {
    return null;
  }
}

export async function getRelated(slug: string, tag: string, limit = 3): Promise<ArticlePublic[]> {
  try {
    return await getRelatedArticles(slug, tag, limit);
  } catch {
    return [];
  }
}
