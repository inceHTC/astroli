import { ArticlesClient } from "./ArticlesClient";

export default function AdminArticlesPage() {
  return (
    <div className="min-h-screen bg-white px-8 pb-16 pt-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">Dergi Makaleleri</h1>
        <p className="mt-1 text-sm text-gray-500">
          Makaleleri ekleyin, düzenleyin veya silin. Sadece yayında olanlar sitede görünür.
        </p>
        <div className="mt-8">
          <ArticlesClient />
        </div>
      </div>
    </div>
  );
}
