"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

const DATE_FMT = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

type Props = {
  currentDate: string; // YYYY-MM-DD
  availableDates: string[];
  todayStr: string;
};

export function DailyHoroscopeToolbar({
  currentDate,
  availableDates,
  todayStr,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const setDate = useCallback(
    (dateStr: string) => {
      const next = new URLSearchParams(searchParams.toString());
      next.set("tarih", dateStr);
      startTransition(() => {
        router.push(`/gunluk-burc?${next.toString()}`);
      });
    },
    [router, searchParams]
  );

  const showToday = currentDate !== todayStr;
  const label = currentDate === todayStr ? "Bugün" : DATE_FMT.format(new Date(currentDate + "T12:00:00"));

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">Tarih:</span>
        <input
          type="date"
          value={currentDate}
          onChange={(e) => setDate(e.target.value)}
          max={todayStr}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#5B3FFF] focus:outline-none focus:ring-1 focus:ring-[#5B3FFF]"
          disabled={isPending}
        />
        {showToday && (
          <button
            type="button"
            onClick={() => setDate(todayStr)}
            className="rounded-lg bg-[#5B3FFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#4A2FDD] disabled:opacity-50"
            disabled={isPending}
          >
            Bugün
          </button>
        )}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">Görüntülenen:</span>
        <span className="text-sm font-semibold text-black">{label}</span>
      </div>
      {availableDates.length > 0 && (
        <div className="w-full border-t border-gray-100 pt-4 mt-2">
          <p className="mb-2 text-sm font-medium text-gray-700">Arşiv – Geçmiş günlük yorumlar</p>
          <div className="flex flex-wrap gap-2">
            {availableDates.map((d) => {
              const isActive = d === currentDate;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDate(d)}
                  className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "bg-[#5B3FFF] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  disabled={isPending}
                >
                  {DATE_FMT.format(new Date(d + "T12:00:00"))}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
