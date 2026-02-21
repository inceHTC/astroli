import Link from "next/link";
import type { RetroPlanet, RetroEvent } from "@/lib/retro-data";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

function getPlanetMeta(planet: RetroPlanet) {
  switch (planet) {
    case "mercury":
      return {
        label: "Merkür",
        color: "from-sky-400 via-purple-400 to-indigo-500",
        description: "İletişim, veri akışı ve zihinsel tempo üzerinde farkındalık.",
      };
    case "venus":
      return {
        label: "Venüs",
        color: "from-rose-400 via-pink-400 to-purple-500",
        description: "İlişkiler, öz-değer algısı ve estetikle ilgili yumuşak bir reset.",
      };
    case "mars":
      return {
        label: "Mars",
        color: "from-orange-400 via-red-400 to-rose-500",
        description: "Enerji, motivasyon ve eylem biçimlerinde yeniden kalibrasyon.",
      };
    case "saturn":
      return {
        label: "Satürn",
        color: "from-slate-300 via-blue-300 to-indigo-400",
        description: "Sorumluluklar, sınırlar ve uzun vadeli yapıların testi.",
      };
    default:
      return {
        label: "Retro",
        color: "from-slate-400 via-slate-300 to-slate-500",
        description: "",
      };
  }
}

interface RetroPlanetCardProps {
  planet: RetroPlanet;
  nextEvent?: RetroEvent | null;
}

export function RetroPlanetCard({ planet, nextEvent }: RetroPlanetCardProps) {
  const meta = getPlanetMeta(planet);

  return (
    <Link
      href={`/retro/${planet}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border-2 border-gray-200 bg-white p-5 text-gray-900 shadow-md transition hover:border-purple-300 hover:shadow-lg"
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gray-500">
            {meta.label} Retrosu
          </p>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">{meta.description}</p>
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-50 border-2 border-gray-200">
          <span
            className={`inline-block h-7 w-7 rounded-full bg-gradient-to-br ${meta.color}`}
          />
        </span>
      </div>

      {nextEvent && (
        <div className="relative mt-4 rounded-2xl border-2 border-gray-200 bg-gray-50 p-3 text-[11px]">
          <p className="mb-1 font-semibold text-gray-800">Yaklaşan dönem</p>
          <p className="text-gray-600">
            {format(new Date(nextEvent.startDate), "d MMM", { locale: tr })} –{" "}
            {format(new Date(nextEvent.endDate), "d MMM yyyy", { locale: tr })}
          </p>
          <p className="mt-1 text-gray-500">
            Psikolojik odak:{" "}
            <span className="text-gray-700 font-medium">
              {nextEvent.psychologicalFocus.split(".")[0]}.
            </span>
          </p>
        </div>
      )}

      <div className="relative mt-4 flex items-center justify-between text-[11px] text-gray-600">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Kişisel checklist & karar analizi
        </span>
        <span className="inline-flex items-center gap-1 text-gray-700 font-semibold">
          İncele
          <span className="translate-y-[1px] transition group-hover:translate-x-0.5">
            ↗
          </span>
        </span>
      </div>
    </Link>
  );
}

