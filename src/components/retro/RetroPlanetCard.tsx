import Link from "next/link";
import type { RetroPlanet, RetroEvent } from "@/lib/retro-data";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

const PLANET_META: Record<RetroPlanet, {
  label: string; symbol: string; color: string; accent: string; glow: string; desc: string;
}> = {
  mercury: {
    label: "Merkür", symbol: "☿",
    color: "border-sky-500/30 hover:border-sky-400/50",
    accent: "text-sky-400", glow: "bg-sky-500/8",
    desc: "İletişim, veri akışı ve zihinsel tempo.",
  },
  venus: {
    label: "Venüs", symbol: "♀",
    color: "border-rose-500/30 hover:border-rose-400/50",
    accent: "text-rose-400", glow: "bg-rose-500/8",
    desc: "İlişkiler, öz-değer ve zevk alanları.",
  },
  mars: {
    label: "Mars", symbol: "♂",
    color: "border-orange-500/30 hover:border-orange-400/50",
    accent: "text-orange-400", glow: "bg-orange-500/8",
    desc: "Enerji, motivasyon ve eylem biçimleri.",
  },
  saturn: {
    label: "Satürn", symbol: "♄",
    color: "border-indigo-500/30 hover:border-indigo-400/50",
    accent: "text-indigo-400", glow: "bg-indigo-500/8",
    desc: "Sorumluluklar, sınırlar ve uzun vadeli yapılar.",
  },
};

interface RetroPlanetCardProps {
  planet: RetroPlanet;
  nextEvent?: RetroEvent | null;
}

export function RetroPlanetCard({ planet, nextEvent }: RetroPlanetCardProps) {
  const meta = PLANET_META[planet];

  return (
    <Link
      href={`/retro/${planet}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-[#0E1523] p-6 transition-all duration-200 ${meta.color}`}
    >
      {/* arka plan glow */}
      <div className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${meta.glow}`} />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${meta.accent}`}>
            {meta.label} Retrosu
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#C4C0BA]">
            {meta.desc}
          </p>
        </div>
        <span className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-3xl ${meta.accent}`}>
          {meta.symbol}
        </span>
      </div>

      {nextEvent && (
        <div className="relative mt-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 text-[11px]">
          <p className="mb-1 font-semibold text-[#EDE9DF]">Yaklaşan dönem</p>
          <p className="text-[#7A8090]">
            {format(new Date(nextEvent.startDate), "d MMM", { locale: tr })} –{" "}
            {format(new Date(nextEvent.endDate), "d MMM yyyy", { locale: tr })}
          </p>
          <p className="mt-1 text-[#7A8090]">
            Odak:{" "}
            <span className="text-[#C4C0BA] font-medium">
              {nextEvent.psychologicalFocus.split(".")[0]}.
            </span>
          </p>
        </div>
      )}

      <div className="relative mt-4 flex items-center justify-between text-[11px]">
        <span className="text-[#7A8090]">Checklist & karar analizi</span>
        <span className={`font-semibold transition-transform group-hover:translate-x-0.5 ${meta.accent}`}>
          İncele →
        </span>
      </div>
    </Link>
  );
}
