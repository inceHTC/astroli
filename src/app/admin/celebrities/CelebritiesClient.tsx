"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type CelebrityRow = {
  id: string;
  name: string;
  slug: string;
  job: string;
  zodiac: string;
  featured: boolean;
};

const inputClass = "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-400";

function useDebounce<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

export function CelebritiesClient() {
  const [list, setList] = useState<CelebrityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const url = debouncedSearch
        ? `/api/admin/celebrities?q=${encodeURIComponent(debouncedSearch)}`
        : "/api/admin/celebrities";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Liste alınamadı");
      const data = await res.json();
      setList(data);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  async function toggleFeatured(id: string, featured: boolean) {
    const res = await fetch(`/api/admin/celebrities/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !featured }),
    });
    if (!res.ok) return;
    setList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, featured: !featured } : c))
    );
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" silinsin mi?`)) return;
    const res = await fetch(`/api/admin/celebrities/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      alert((d.error as string) ?? "Silinemedi.");
      return;
    }
    setList((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="İsimle ara..."
          className={`${inputClass} max-w-xs`}
        />
        <Link
          href="/admin/celebrities/new"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Yeni ünlü
        </Link>
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 py-12 text-center text-gray-500">
          Yükleniyor…
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 py-12 text-center text-gray-500">
          {debouncedSearch ? "Arama sonucu yok." : "Henüz ünlü yok. Yeni ekleyin."}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-5 py-3 font-medium text-gray-700">Ad</th>
                <th className="px-5 py-3 font-medium text-gray-700">Meslek</th>
                <th className="px-5 py-3 font-medium text-gray-700">Burç</th>
                <th className="px-5 py-3 font-medium text-gray-700">Öne çıkan</th>
                <th className="px-5 py-3 font-medium text-gray-700 w-0" />
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-5 py-3 text-gray-600">{c.job}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
                      {c.zodiac}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      onClick={() => toggleFeatured(c.id, c.featured)}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        c.featured ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {c.featured ? "Öne çıkan" : "Hayır"}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/celebrities/${c.id}/edit`}
                      className="mr-2 text-gray-700 hover:underline"
                    >
                      Düzenle
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id, c.name)}
                      className="text-red-600 hover:underline"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
