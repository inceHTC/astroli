"use client";

import { useMemo, useState, useEffect } from "react";
import { CelebrityFilter } from "./CelebrityFilter";
import { ZODIAC_SIGNS } from "@/data/zodiac";
import { ELEMENT_COLORS } from "@/data/zodiac";
import type { Element } from "@/data/zodiac";
import type { CelebrityItem } from "./CelebrityCard";

const PAGE_SIZE = 20;

function useDebounce<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

function getZodiacNameTr(zodiacId: string): string {
  const sign = ZODIAC_SIGNS.find((z) => z.id === zodiacId);
  return sign?.nameTr ?? zodiacId;
}

function getZodiacColor(zodiacId: string): string {
  const sign = ZODIAC_SIGNS.find((z) => z.id === zodiacId);
  const element = sign?.element as Element | undefined;
  return element ? (ELEMENT_COLORS[element] ?? "#6b7280") : "#6b7280";
}

type CelebrityGridProps = {
  celebrities: CelebrityItem[];
};

export function CelebrityGrid({ celebrities }: CelebrityGridProps) {
  const [search, setSearch] = useState("");
  const [zodiacFilter, setZodiacFilter] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    let list = celebrities;
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.job.toLowerCase().includes(q)
      );
    }
    if (zodiacFilter) {
      list = list.filter((c) => c.zodiac === zodiacFilter);
    }
    return list;
  }, [celebrities, debouncedSearch, zodiacFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageList = useMemo(
    () => filtered.slice(start, start + PAGE_SIZE),
    [filtered, start]
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, zodiacFilter]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  return (
    <div className="space-y-6">
      <CelebrityFilter
        celebrities={celebrities}
        search={search}
        onSearchChange={setSearch}
        zodiacFilter={zodiacFilter}
        onZodiacFilterChange={setZodiacFilter}
      />
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white py-12 text-center text-gray-500">
          {search || zodiacFilter ? "Arama kriterlerine uygun ünlü bulunamadı." : "Henüz ünlü eklenmemiş."}
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <ul className="divide-y divide-gray-100">
              {pageList.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6"
                >
                  <span className="font-medium text-gray-900">{c.name}</span>
                  <span className="text-sm text-gray-500">{c.job}</span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                    style={{ backgroundColor: getZodiacColor(c.zodiac) }}
                  >
                    {getZodiacNameTr(c.zodiac)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        {totalPages > 1 && (
  <div className="flex items-center justify-end gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 sm:px-6">
    <button
      type="button"
      onClick={() => setPage((p) => Math.max(1, p - 1))}
      disabled={page <= 1}
      className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
    >
      Geri
    </button>

    <button
      type="button"
      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
      disabled={page >= totalPages}
      className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
    >
      İleri
    </button>
  </div>
)}
        </>
      )}
    </div>
  );
}
