"use client";

import { ZODIAC_SIGNS } from "@/data/zodiac";
import { ELEMENT_COLORS } from "@/data/zodiac";
import type { Element } from "@/data/zodiac";
import { CelebritySearchBox } from "./CelebritySearchBox";
import type { CelebrityItem } from "./CelebrityCard";

type CelebrityFilterProps = {
  celebrities: CelebrityItem[];
  search: string;
  onSearchChange: (v: string) => void;
  zodiacFilter: string;
  onZodiacFilterChange: (v: string) => void;
};

export function CelebrityFilter({
  celebrities,
  search,
  onSearchChange,
  zodiacFilter,
  onZodiacFilterChange,
}: CelebrityFilterProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <CelebritySearchBox
          celebrities={celebrities}
          value={search}
          onChange={onSearchChange}
          placeholder="İsim veya meslek yazın ..."
          className="w-full"
        />
        <p className="mt-3 text-center text-sm text-gray-500">
          Yazmaya başlayın veya bir öneri seçin, liste buna göre filtrelenir.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="mr-1 text-sm text-gray-500">Burç:</span>
        <button
          type="button"
          onClick={() => onZodiacFilterChange("")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            !zodiacFilter
              ? "bg-[#5B3FFF] text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Tümü
        </button>
        {ZODIAC_SIGNS.map((z) => {
          const color = (ELEMENT_COLORS[z.element as Element] ?? "#6b7280") as string;
          const isActive = zodiacFilter === z.id;
          return (
            <button
              key={z.id}
              type="button"
              onClick={() => onZodiacFilterChange(isActive ? "" : z.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive ? "text-white shadow-sm" : "hover:opacity-90"
              }`}
              style={
                isActive
                  ? { backgroundColor: color }
                  : { backgroundColor: `${color}20`, color }
              }
            >
              {z.nameTr}
            </button>
          );
        })}
      </div>
    </div>
  );
}
