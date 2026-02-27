\"use client\";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

const DATE_FMT = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

type Props = {
  currentWeekStart: string; // YYYY-MM-DD
  availableWeeks: string[];
  currentWeekOfToday: string;
};

function formatWeekRangeLabel(weekStartStr: string): string {
  const start = new Date(weekStartStr + "T12:00:00");
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return `${DATE_FMT.format(start)} – ${DATE_FMT.format(end)}`;
}

export function WeeklyHoroscopeToolbar({
  currentWeekStart,
  availableWeeks,
  currentWeekOfToday,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const setWeek = useCallback(
    (weekStartStr: string) => {
      const next = new URLSearchParams(searchParams.toString());
      next.set("hafta", weekStartStr);
      startTransition(() => {
        router.push(`/haftalik-burc?${next.toString()}`);
      });
    },
    [router, searchParams]
  );

  const showThisWeek = currentWeekStart !== currentWeekOfToday;
  const label = formatWeekRangeLabel(currentWeekStart);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Hafta:</span>
          <span className="text-sm font-semibold text-black">{label}</span>
        </div>
        {showThisWeek && (
          <button
            type="button"
            onClick={() => setWeek(currentWeekOfToday)}
            className="inline-flex items-center justify-center rounded-lg bg-[#5B3FFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#4A2FDD] disabled:opacity-50"
            disabled={isPending}
          >
            Bu hafta
          </button>
        )}
      </div>

      {availableWeeks.length > 0 && (
        <div className="w-full border-t border-gray-100 pt-4 mt-2">
          <p className="mb-2 text-sm font-medium text-gray-700">
            Arşiv – Geçmiş haftalık yorumlar
          </p>
          <div className="flex flex-wrap gap-2">
            {availableWeeks.map((weekStart) => {
              const isActive = weekStart === currentWeekStart;
              return (
                <button
                  key={weekStart}
                  type="button"
                  onClick={() => setWeek(weekStart)}
                  className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "bg-[#5B3FFF] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  disabled={isPending}
                >
                  {formatWeekRangeLabel(weekStart)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

