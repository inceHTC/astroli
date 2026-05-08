import { differenceInCalendarDays, format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  getActiveRetro,
  getUpcomingRetros,
  type RetroEvent,
} from "@/lib/retro-data";

function getProgress(event: RetroEvent, now: Date) {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const total = end.getTime() - start.getTime();
  const passed = Math.min(Math.max(now.getTime() - start.getTime(), 0), total);
  if (total <= 0) return 0;
  return (passed / total) * 100;
}

function getPlanetLabel(planet: RetroEvent["planet"]) {
  switch (planet) {
    case "mercury": return "Merkür Retrosu";
    case "venus":   return "Venüs Retrosu";
    case "mars":    return "Mars Retrosu";
    case "saturn":  return "Satürn Retrosu";
    default:        return "Retro";
  }
}

const PLANET_ACCENT: Record<string, string> = {
  mercury: "text-sky-400 bg-sky-500/10 border-sky-500/25",
  venus:   "text-rose-400 bg-rose-500/10 border-rose-500/25",
  mars:    "text-orange-400 bg-orange-500/10 border-orange-500/25",
  saturn:  "text-indigo-400 bg-indigo-500/10 border-indigo-500/25",
};

const PLANET_BAR: Record<string, string> = {
  mercury: "from-sky-500 to-sky-300",
  venus:   "from-rose-500 to-rose-300",
  mars:    "from-orange-500 to-orange-300",
  saturn:  "from-indigo-500 to-indigo-300",
};

export function RetroCalendar() {
  const now = new Date();
  const active = getActiveRetro(now);
  const upcoming = getUpcomingRetros(now);

  return (
    <section id="takvim" className="rounded-2xl border border-white/[0.07] bg-[#0E1523] p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A78BFA]">
            Retro takvimi
          </p>
          <h2 className="mt-1 text-xl font-bold text-[#EDE9DF] sm:text-2xl">
            2026 Retro Görünümü
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1.5 text-xs font-medium text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {format(now, "d MMMM yyyy", { locale: tr })}
        </div>
      </div>

      {/* Aktif retro */}
      {active && (
        <div className="mb-5 rounded-xl border border-amber-500/20 bg-amber-500/8 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10 text-base">
                ⚡
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400">
                  Şu an aktif
                </p>
                <p className="text-sm font-semibold text-[#EDE9DF]">
                  {getPlanetLabel(active.planet)}
                </p>
              </div>
            </div>
            <div className="text-right text-[11px]">
              <p className="text-[#7A8090]">Kalan gün</p>
              <p className="text-lg font-bold text-[#EDE9DF]">
                {differenceInCalendarDays(new Date(active.endDate), now) + 1}
              </p>
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-300"
              style={{ width: `${getProgress(active, now)}%` }}
            />
          </div>
        </div>
      )}

      {/* Tablo başlığı */}
      <div className="hidden rounded-lg bg-white/[0.03] px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#7A8090] sm:grid sm:grid-cols-[1fr_1.4fr_0.7fr_1.2fr] sm:gap-3">
        <span>Gezegen</span>
        <span>Tarih aralığı</span>
        <span>Durum</span>
        <span>Odak</span>
      </div>

      <div className="mt-2 space-y-2">
        {upcoming.map((event) => {
          const start = new Date(event.startDate);
          const end = new Date(event.endDate);
          const isCurrent = active?.id === event.id;
          const daysToStart = differenceInCalendarDays(start, now);
          const daysLeft = differenceInCalendarDays(end, now) + 1;
          const accentCls = PLANET_ACCENT[event.planet] ?? "text-[#A78BFA] bg-[#A78BFA]/10 border-[#A78BFA]/25";
          const barCls = PLANET_BAR[event.planet] ?? "from-[#5C44D0] to-[#A78BFA]";

          return (
            <div
              key={event.id}
              className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 transition hover:border-white/[0.10] sm:grid sm:grid-cols-[1fr_1.4fr_0.7fr_1.2fr] sm:items-center sm:gap-3"
            >
              <div className="mb-2 sm:mb-0">
                <p className="text-xs font-semibold text-[#EDE9DF]">
                  {getPlanetLabel(event.planet)}
                </p>
                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/[0.04]">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${barCls}`}
                    style={{ width: `${getProgress(event, now)}%` }}
                  />
                </div>
              </div>

              <div className="mb-2 text-[11px] text-[#7A8090] sm:mb-0">
                <p>
                  <span className="text-[#C4C0BA]">Başlangıç:</span>{" "}
                  {format(start, "d MMM yyyy, EEE", { locale: tr })}
                </p>
                <p>
                  <span className="text-[#C4C0BA]">Bitiş:</span>{" "}
                  {format(end, "d MMM yyyy, EEE", { locale: tr })}
                </p>
              </div>

              <div className="mb-2 sm:mb-0">
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${accentCls}`}>
                  {isCurrent
                    ? `Aktif · ${daysLeft} gün`
                    : daysToStart < 0
                    ? "Tamamlandı"
                    : daysToStart === 0
                    ? "Bugün"
                    : `${daysToStart} gün sonra`}
                </span>
              </div>

              <div className="border-t border-white/[0.04] pt-2 text-[11px] sm:border-none sm:pt-0">
                <p className="font-medium text-[#C4C0BA]">
                  {event.psychologicalFocus.split(".")[0]}.
                </p>
                <p className="mt-0.5 text-[10px] text-[#7A8090]">
                  {event.themes.slice(0, 2).join(" · ")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
