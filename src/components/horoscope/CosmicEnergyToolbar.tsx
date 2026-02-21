"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

const DATE_FMT = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

type Props = {
  currentWeekStart: string;
  availableWeeks: string[];
  thisWeekStart: string;
};

export function CosmicEnergyToolbar({
  currentWeekStart,
  availableWeeks,
  thisWeekStart,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const setWeek = useCallback(
    (weekStr: string) => {
      const next = new URLSearchParams(searchParams.toString());
      next.set("hafta", weekStr);
      startTransition(() => {
        router.push(`/dergi/haftalik-burc-enerjisi?${next.toString()}`);
      });
    },
    [router, searchParams]
  );

  const isArchive = currentWeekStart !== thisWeekStart;
  const label =
    currentWeekStart === thisWeekStart
      ? "Bu hafta"
      : DATE_FMT.format(new Date(currentWeekStart + "T12:00:00"));

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm mb-8">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">Hafta:</span>
        <input
          type="date"
          value={currentWeekStart}
          onChange={(e) => setWeek(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#5B3FFF] focus:outline-none focus:ring-1 focus:ring-[#5B3FFF]"
          disabled={isPending}
        />
        {isArchive && (
          <button
            type="button"
            onClick={() => setWeek(thisWeekStart)}
            className="rounded-lg bg-[#5B3FFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#4A2FDD] disabled:opacity-50"
            disabled={isPending}
          >
            Bu hafta
          </button>
        )}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">Görüntülenen:</span>
        <span className="text-sm font-semibold text-black">{label}</span>
      </div>
      {availableWeeks.length > 0 && (
        <div className="w-full border-t border-gray-100 pt-4 mt-2">
          <p className="mb-2 text-sm font-medium text-gray-700">Arşiv – Geçmiş haftalar</p>
          <div className="flex flex-wrap gap-2">
            {availableWeeks.map((w) => {
              const active = w === currentWeekStart;
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWeek(w)}
                  className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    active ? "bg-[#5B3FFF] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  disabled={isPending}
                >
                  {DATE_FMT.format(new Date(w + "T12:00:00"))}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
