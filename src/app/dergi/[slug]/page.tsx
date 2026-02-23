import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { getArticleBySlug, getRelated } from "@/lib/getArticles";
import { getSanitizedArticleHtml } from "@/lib/utils/getSanitizedArticleHtml";
import { injectHeadingIds, replaceCelebrityMentions } from "@/lib/utils/content";
import { listCelebritiesForMentions } from "@/lib/db/repositories/celebrity";
import { ArticleRenderer } from "@/components/article/ArticleRenderer";
import { ArticleScrollProgress } from "@/components/article/ArticleScrollProgress";
import { ArticleTOC } from "@/components/article/ArticleTOC";
import { ArticleShare } from "@/components/article/ArticleShare";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { CelebrityMentions } from "@/components/article/CelebrityMentions";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export async function generateStaticParams() {
  try {
    const { getArticles } = await import("@/lib/getArticles");
    const articles = await getArticles();
    return articles.map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  const description =
    (article.excerpt ?? article.title).slice(0, 160) || article.title;
  return {
    title: `${article.title} | Astroli Dergi`,
    description,
  };
}

export default async function DergiArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;

  const toc = (article.toc as { id: string; text: string; level: number }[]) ?? [];
  const [celebrities, related] = await Promise.all([
    listCelebritiesForMentions(),
    getRelated(slug, article.tag, 3),
  ]);
  let safeHtml = injectHeadingIds(getSanitizedArticleHtml(article.content), toc);
  safeHtml = replaceCelebrityMentions(safeHtml, celebrities);

  return (
    <div className="bg-white text-black relative">
      <ArticleScrollProgress />
      <article className="editorial-article mx-auto max-w-4xl px-6 py-28">
        <Link
          href="/dergi"
          className="text-sm text-black/50 transition hover:text-black"
        >
          ← Dergi
        </Link>

        <header className="mt-10 mb-12">
          <div className="meta flex flex-wrap items-center gap-3 text-sm text-black/60">
            <span className="uppercase tracking-wider text-[#5B3FFF]">
              {article.tag}
            </span>
            {article.readTime != null && (
              <span>{article.readTime} dk okuma</span>
            )}
            <time dateTime={article.updatedAt.toISOString()}>
              {format(article.updatedAt, "d MMMM yyyy", { locale: tr })}
            </time>
          </div>
          <h1 className="editorial-title mt-3 font-serif text-4xl leading-[1.15] tracking-tight font-semibold text-black md:text-5xl">
            {article.title}
          </h1>
        </header>

        {article.image && (
          <div className="editorial-cover editorial-cover--compact mb-14 overflow-hidden rounded-2xl">
            <Image
              src={article.image}
              alt={article.title}
              width={560}
              height={360}
              className="w-full object-cover shadow-md"
              priority
            />
          </div>
        )}

        <div className="editorial-body relative grid gap-12 lg:grid-cols-[1fr_240px]">
          <div className="min-w-0">
            <CelebrityMentions celebrities={celebrities}>
              <ArticleRenderer content={article.content} sanitized={safeHtml} />
            </CelebrityMentions>
                 
            <ArticleShare title={article.title} slug={slug} baseUrl={baseUrl} />
          </div>
          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <ArticleTOC toc={toc} />
            </aside>
          )}
        </div>

        {related.length > 0 && (
          <RelatedArticles articles={related} className="mt-20" />
        )}
<br /><br />
        <Link
          href="/dergi"
          className="text-sm text-black/50 transition hover:text-black "
        >
          ← Dergiye dön
        </Link>
      </article>

    
    </div>
  );
}
