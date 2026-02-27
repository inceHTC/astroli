"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

type WeeklyArchiveRow = {
  weekStart: string;
};

function formatWeekLabel(weekStart: string): string {
  const start = new Date(weekStart);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return `${format(start, "d MMM", { locale: tr })} – ${format(end, "d MMM yyyy", {
    locale: tr,
  })}`;
}

export function WeeklyHoroscopeArchiveClient() {
  const [rows, setRows] = useState<WeeklyArchiveRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/horoscope/weekly/archive?limit=208")
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

  async function handleDelete(weekStart: string) {
    if (
      !confirm(
        `${formatWeekLabel(
          weekStart
        )} haftasına ait tüm haftalık yorumları silmek istediğinize emin misiniz?`
      )
    ) {
      return;
    }
    const res = await fetch("/api/admin/horoscope/weekly/archive", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weekStart }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert((data.error as string) ?? "Silinemedi.");
      return;
    }
    setRows((prev) => prev.filter((r) => r.weekStart !== weekStart));
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
        <h2 className="text-sm font-semibold text-gray-900">Haftalık Burç Arşivi</h2>
        <p className="text-xs text-gray-500">Toplam {rows.length} hafta</p>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">Henüz kayıtlı haftalık burç haftası yok.</p>
      ) : (
        <div className="max-h-80 overflow-y-auto rounded-lg border border-gray-100">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-2 font-medium text-gray-700">Hafta</th>
                <th className="px-4 py-2 w-0" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.weekStart} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-2">{formatWeekLabel(row.weekStart)}</td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      href={`/admin/horoscope/weekly?weekStart=${row.weekStart}`}
                      className="mr-3 text-xs font-medium text-gray-700 hover:underline"
                    >
                      Düzenle
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(row.weekStart)}
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

