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

export function RetroCalendar() {
  const now = new Date();
  const active = getActiveRetro(now);
  const upcoming = getUpcomingRetros(now);

  return (
    <section className="relative rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
            Retro Takvimi
          </h2>
          <p className="mt-1 text-sm text-gray-600 leading-relaxed">
            Astrolojik takvimi korkuyla değil,{" "}
            <span className="font-semibold text-gray-800">
              planlama ve farkındalık
            </span>{" "}
            için kullan.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700 font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>
            {format(now, "d MMMM yyyy, EEEE", {
              locale: tr,
            })}
          </span>
        </div>
      </div>

      {active && (
        <div className="relative mb-6 rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 text-xs shadow-md sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-200 text-amber-900 text-lg">
              ⚡
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
                Şu anda aktif retro
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {getPlanetLabel(active.planet)} ·{" "}
                {format(new Date(active.startDate), "d MMM", { locale: tr })} –{" "}
                {format(new Date(active.endDate), "d MMM yyyy", { locale: tr })}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3 sm:mt-0">
            <div className="h-2 w-32 overflow-hidden rounded-full bg-amber-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400"
                style={{ width: `${getProgress(active, now)}%` }}
              />
            </div>
            <div className="text-right text-[11px] text-gray-700">
              <p className="font-medium">Kalan gün</p>
              <p className="text-sm font-bold text-gray-900">
                {differenceInCalendarDays(new Date(active.endDate), now) + 1}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="relative mt-2 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
          Yılın retro görünümü
        </p>

        <div className="hidden rounded-2xl border border-gray-200 bg-gray-50/60 p-3 text-[11px] text-gray-600 shadow-sm sm:grid sm:grid-cols-[minmax(110px,0.9fr)_minmax(150px,1.1fr)_minmax(90px,0.7fr)_minmax(130px,1.1fr)] sm:items-center sm:gap-3">
          <span className="font-semibold text-gray-700">Gezegen</span>
          <span className="font-semibold text-gray-700">Tarih aralığı</span>
          <span className="font-semibold text-gray-700">Durum</span>
          <span className="font-semibold text-gray-700">Psikolojik odak</span>
        </div>

        <div className="space-y-2">
          {upcoming.map((event) => {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            const isCurrent = active?.id === event.id;
            const daysToStart = differenceInCalendarDays(start, now);
            const daysLeft = differenceInCalendarDays(end, now) + 1;

            return (
              <article
                key={event.id}
                className="rounded-2xl border border-gray-200 bg-white p-3 text-[11px] shadow-sm transition hover:border-purple-300 hover:shadow-md sm:grid sm:grid-cols-[minmax(110px,0.9fr)_minmax(150px,1.1fr)_minmax(90px,0.7fr)_minmax(130px,1.1fr)] sm:items-center sm:gap-3"
              >
                {/* Gezegen + mini progress */}
                <div className="mb-2 sm:mb-0">
                  <p className="text-xs font-semibold text-gray-800">
                    {getPlanetLabel(event.planet)}
                  </p>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-400 via-indigo-400 to-sky-400"
                      style={{ width: `${getProgress(event, now)}%` }}
                    />
                  </div>
                </div>

                {/* Tarihler */}
                <div className="mb-2 text-[11px] text-gray-600 sm:mb-0">
                  <p>
                    <span className="font-medium text-gray-700">Başlangıç:</span>{" "}
                    {format(start, "d MMM yyyy, EEE", { locale: tr })}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Bitiş:</span>{" "}
                    {format(end, "d MMM yyyy, EEE", { locale: tr })}
                  </p>
                </div>

                {/* Durum etiketi */}
                <div className="mb-2 flex items-center gap-2 sm:mb-0 sm:justify-start">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      isCurrent
                        ? "bg-emerald-100 text-emerald-700"
                        : daysToStart <= 7
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isCurrent
                      ? `Aktif · ${daysLeft} gün kaldı`
                      : daysToStart < 0
                      ? "Yeni tamamlandı"
                      : daysToStart === 0
                      ? "Bugün başlıyor"
                      : `${daysToStart} gün sonra`}
                  </span>
                </div>

                {/* Psikolojik odak / tema */}
                <div className="border-t border-dashed border-gray-200 pt-2 text-[11px] text-gray-600 sm:border-none sm:pt-0">
                  <p className="font-medium text-gray-700">
                    {event.psychologicalFocus.split(".")[0]}.
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-500">
                    Odak temalar:{" "}
                    {event.themes.slice(0, 2).join(" · ")}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

