"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

type DailyArchiveRow = {
  date: string;
};

export function DailyHoroscopeArchiveClient() {
  const [rows, setRows] = useState<DailyArchiveRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/horoscope/daily/archive?limit=365")
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          throw new Error(typeof data?.error === "string" ? data.error : "Arşiv alınamadı");
        }
        setRows(Array.isArray(data) ? data : []);
      })
      .catch((e) => setError(e?.message ?? "Arşiv yüklenemedi."))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(date: string) {
    if (!confirm(`${format(new Date(date), "d MMMM yyyy", { locale: tr })} tarihli tüm günlük yorumları silmek istediğinize emin misiniz?`)) {
      return;
    }
    const res = await fetch("/api/admin/horoscope/daily/archive", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert((data.error as string) ?? "Silinemedi.");
      return;
    }
    setRows((prev) => prev.filter((r) => r.date !== date));
  }

  if (loading) {
    return (
      <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
        Arşiv yükleniyor…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-gray-900">Günlük Burç Arşivi</h2>
        <p className="text-xs text-gray-500">
          Toplam {rows.length} tarih
        </p>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">Henüz kayıtlı günlük burç tarihi yok.</p>
      ) : (
        <div className="max-h-80 overflow-y-auto rounded-lg border border-gray-100">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-2 font-medium text-gray-700">Tarih</th>
                <th className="px-4 py-2 w-0" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.date} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {format(new Date(row.date), "d MMMM yyyy EEEE", { locale: tr })}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      href={`/admin/horoscope/daily?date=${row.date}`}
                      className="mr-3 text-xs font-medium text-gray-700 hover:underline"
                    >
                      Düzenle
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(row.date)}
                      className="text-xs font-medium text-red-600 hover:underline"
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

