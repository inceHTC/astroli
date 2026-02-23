"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type TestRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  published: boolean;
  questionCount: number;
};

export function TestsClient() {
  const [tests, setTests] = useState<TestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/tests")
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(typeof data?.error === "string" ? data.error : "Liste alınamadı");
        setTests(Array.isArray(data) ? data : []);
      })
      .catch((e) => setError(e?.message ?? "Testler yüklenemedi."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 text-center text-zinc-500">
        Yükleniyor…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{tests.length} test</p>
        <Link
          href="/admin/tests/new"
          className="rounded-lg bg-[#d4af37] px-4 py-2 text-sm font-medium text-black hover:bg-[#e8c547]"
        >
          Yeni test ekle
        </Link>
      </div>

      {tests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
          <p className="text-zinc-500">Henüz test yok.</p>
          <Link
            href="/admin/tests/new"
            className="mt-4 inline-block rounded-lg bg-[#d4af37] px-4 py-2 text-sm font-medium text-black hover:bg-[#e8c547]"
          >
            İlk testi ekle
          </Link>
        </div>
      ) : (
        tests.map((t) => (
          <div
            key={t.id}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-white">{t.title}</h3>
                <p className="mt-1 text-sm text-zinc-500">{t.description}</p>
                <div className="mt-3 flex gap-2">
                  <span className="rounded-full bg-[#d4af37]/10 px-2 py-0.5 text-xs text-[#d4af37]">
                    {t.questionCount} soru
                  </span>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-zinc-500">
                    {t.duration}
                  </span>
                  {t.published ? (
                    <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
                      Yayında
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">
                      Taslak
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/test/${t.slug}`}
                  target="_blank"
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
                >
                  Önizle
                </Link>
                <Link
                  href={`/admin/tests/${t.id}/edit`}
                  className="rounded-lg bg-[#d4af37] px-4 py-2 text-sm font-medium text-black hover:bg-[#e8c547]"
                >
                  Düzenle
                </Link>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
