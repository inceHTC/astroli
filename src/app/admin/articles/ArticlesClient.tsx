"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  tag: string;
  published: boolean;
  updatedAt: string;
};

export function ArticlesClient() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/articles")
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(typeof data?.error === "string" ? data.error : "Liste alınamadı");
        setArticles(Array.isArray(data) ? data : []);
      })
      .catch((e) => setError(e?.message ?? "Makaleler yüklenemedi."))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" makalesini silmek istediğinize emin misiniz?`)) return;
    const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert((data.error as string) ?? "Silinemedi.");
      return;
    }
    setArticles((prev) => prev.filter((a) => a.id !== id));
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
        Yükleniyor…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {articles.length} makale
        </p>
        <Link
          href="/admin/articles/new"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Yeni makale
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-5 py-3 font-medium text-gray-700">Başlık</th>
              <th className="px-5 py-3 font-medium text-gray-700">Slug</th>
              <th className="px-5 py-3 font-medium text-gray-700">Etiket</th>
              <th className="px-5 py-3 font-medium text-gray-700">Durum</th>
              <th className="px-5 py-3 font-medium text-gray-700 w-0" />
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                  Henüz makale yok. Yeni makale ekleyin.
                </td>
              </tr>
            ) : (
              articles.map((a) => (
                <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">{a?.title ?? ""}</td>
                  <td className="px-5 py-3 text-gray-500">{a?.slug ?? ""}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
                      {a?.tag ?? ""}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {a?.published ? (
                      <span className="text-green-600">Yayında</span>
                    ) : (
                      <span className="text-amber-600">Taslak</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/dergi/${a?.slug ?? ""}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mr-2 text-gray-500 hover:text-gray-700"
                    >
                      Önizle
                    </Link>
                    <Link
                      href={`/admin/articles/${a?.id ?? ""}/edit`}
                      className="mr-2 text-gray-700 hover:underline"
                    >
                      Düzenle
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(a?.id ?? "", a?.title ?? "")}
                      className="text-red-600 hover:underline"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
