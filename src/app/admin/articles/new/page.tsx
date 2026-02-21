import Link from "next/link";
import { ArticleFormLoader } from "../ArticleFormLoader";

export default function NewArticlePage() {
  return (
    <div className="min-h-screen bg-white px-6 pb-16 pt-8 lg:px-10">
      <Link
        href="/admin/articles"
        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
      >
        ← Makalelere dön (Vazgeç)
      </Link>
      <h1 className="mt-6 text-xl font-semibold text-gray-900">Yeni makale</h1>
      <div className="mt-8 w-full max-w-6xl">
        <ArticleFormLoader />
      </div>
    </div>
  );
}
