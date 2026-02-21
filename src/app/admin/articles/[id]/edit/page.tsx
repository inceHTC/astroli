import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleById } from "@/lib/db/repositories/article";
import { ArticleFormLoader } from "../../ArticleFormLoader";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();

  const initial = {
    id: article.id,
    title: article.title,
    slug: article.slug,
    tag: article.tag,
    image: article.image,
    excerpt: article.excerpt,
    content: typeof article.content === "string" ? article.content : "",
    readTime: article.readTime,
    toc: article.toc as { id: string; text: string; level: number }[] | null,
    published: article.published,
    featured: article.featured,
  };

  return (
    <div className="min-h-screen bg-white px-6 pb-16 pt-8 lg:px-10">
      <Link
        href="/admin/articles"
        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
      >
        ← Makalelere dön (Vazgeç)
      </Link>
      <h1 className="mt-6 text-xl font-semibold text-gray-900">Makaleyi düzenle</h1>
      <p className="mt-1 text-sm text-gray-500">{article.slug}</p>
      <div className="mt-8 w-full max-w-6xl">
        <ArticleFormLoader initial={initial} />
      </div>
    </div>
  );
}
