import Link from "next/link";
import Image from "next/image";
import type { ArticlePublic } from "@/lib/getArticles";

type RelatedArticlesProps = {
  articles: ArticlePublic[];
  className?: string;
};

export function RelatedArticles({ articles, className = "" }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className={`border-t border-gray-200 pt-12 ${className}`}>
      <h2 className="mb-6 text-xl font-semibold text-black">İlgili yazılar</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/dergi/${article.slug}`}
            className="group overflow-hidden rounded-xl border border-gray-200 transition hover:shadow-lg"
          >
            {article.image && (
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
            )}
            <div className="p-4">
              <span className="text-xs uppercase tracking-wider text-[#5B3FFF]">
                {article.tag}
              </span>
              <h3 className="mt-2 font-medium text-gray-900 line-clamp-2 group-hover:text-[#5B3FFF]">
                {article.title}
              </h3>
              {article.readTime != null && (
                <span className="mt-1 block text-xs text-gray-500">
                  {article.readTime} dk
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
