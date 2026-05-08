"use client";

import { useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import { getUpcomingRetros, type RetroEvent } from "@/lib/retro-data";

function getPlanetLabel(planet: RetroEvent["planet"]) {
  switch (planet) {
    case "mercury": return "Merkür Retrosu";
    case "venus":   return "Venüs Retrosu";
    case "mars":    return "Mars Retrosu";
    case "saturn":  return "Satürn Retrosu";
    default:        return "Retro";
  }
}

export function RetroNotification() {
  const [event, setEvent] = useState<RetroEvent | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const now = new Date();
    const upcoming = getUpcomingRetros(now);
    const next = upcoming[0];
    if (!next) return;
    const days = differenceInCalendarDays(new Date(next.startDate), now);
    if (days <= 3 && days >= 0) {
      const key = `astroli-retro-notification-dismissed-${next.id}`;
      if (!window.localStorage.getItem(key)) setEvent(next);
    }
  }, []);

  if (!event || hidden) return null;

  const days = differenceInCalendarDays(new Date(event.startDate), new Date());
  const handleClose = () => {
    setHidden(true);
    try {
      window.localStorage.setItem(`astroli-retro-notification-dismissed-${event.id}`, "1");
    } catch { /* ignore */ }
  };

  return (
    <div className="fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-[#A78BFA]/20 bg-[#0C1220]/95 px-4 py-3 shadow-2xl shadow-black/60 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full border border-[#A78BFA]/20 bg-[#A78BFA]/10 text-base">
            ☄
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A78BFA]">
              Yaklaşan farkındalık dönemi
            </p>
            <p className="mt-1 text-sm font-semibold text-[#EDE9DF]">
              {getPlanetLabel(event.planet)}{" "}
              {days === 0 ? "bugün başlıyor." : `${days} gün içinde başlıyor.`}
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[#7A8090]">
              Kararlarını ve beklentilerini{" "}
              <span className="text-[#C4C0BA]">sakince gözden geçirmek</span> için iyi bir an.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="ml-1 mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full border border-white/[0.10] text-[#7A8090] transition hover:border-white/[0.20] hover:text-[#EDE9DF]"
            aria-label="Kapat"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
