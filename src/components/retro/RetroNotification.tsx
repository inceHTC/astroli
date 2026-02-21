"use client";

import { useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import { getUpcomingRetros, type RetroEvent } from "@/lib/retro-data";

function getPlanetLabel(planet: RetroEvent["planet"]) {
  switch (planet) {
    case "mercury":
      return "Merkür Retrosu";
    case "venus":
      return "Venüs Retrosu";
    case "mars":
      return "Mars Retrosu";
    case "saturn":
      return "Satürn Retrosu";
    default:
      return "Retro";
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
      const dismissKey = `astroli-retro-notification-dismissed-${next.id}`;
      const dismissed = window.localStorage.getItem(dismissKey);
      if (!dismissed) {
        setEvent(next);
      }
    }
  }, []);

  if (!event || hidden) return null;

  const dismissKey = `astroli-retro-notification-dismissed-${event.id}`;
  const days = differenceInCalendarDays(new Date(event.startDate), new Date());

  const handleClose = () => {
    setHidden(true);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(dismissKey, "1");
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="max-w-xl rounded-2xl border-2 border-purple-300 bg-white px-4 py-3 text-xs shadow-xl">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-sky-500 text-[13px] text-white shadow-md">
            ☄
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
              Yaklaşan farkındalık dönemi
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {getPlanetLabel(event.planet)}{" "}
              {days === 0
                ? "bugün başlıyor."
                : `${days} gün içinde başlıyor.`}
            </p>
            <p className="mt-1 text-[11px] text-gray-600 leading-relaxed">
              Panik yaratmak yerine; kararlarını, iletişimini ve beklentilerini{" "}
              <span className="font-semibold text-gray-800">sakince gözden geçirmek</span>{" "}
              için doğru zaman olabilir.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="ml-2 mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full border-2 border-gray-300 text-[11px] text-gray-500 hover:border-gray-400 hover:text-gray-700"
            aria-label="Bildirimi kapat"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

