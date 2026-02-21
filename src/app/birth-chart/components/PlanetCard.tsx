"use client";

import { motion } from "framer-motion";
import { ZODIAC_SIGNS, ELEMENT_LABELS, type Element } from "@/data/zodiac";
import type { BirthChartResult } from "@/lib/astrology/calculateChart";

const PLANET_LABELS: Record<string, string> = {
  sun: "Güneş",
  moon: "Ay",
  mercury: "Merkür",
  venus: "Venüs",
  mars: "Mars",
  jupiter: "Jüpiter",
  saturn: "Satürn",
  uranus: "Uranüs",
  neptune: "Neptün",
  pluto: "Plüton",
};

type PlanetDisplay = BirthChartResult["planets"][keyof BirthChartResult["planets"]];
type RisingDisplay = BirthChartResult["rising"];

interface PlanetCardProps {
  title: string;
  position: PlanetDisplay | RisingDisplay;
  index: number;
  isRising?: boolean;
  isApproximate?: boolean;
}

function getElement(sign: string): Element {
  const found = ZODIAC_SIGNS.find((z) => z.id === sign);
  return found?.element ?? "fire";
}

export function PlanetCard({
  title,
  position,
  index,
  isRising = false,
  isApproximate = false,
}: PlanetCardProps) {
  const signInfo = ZODIAC_SIGNS.find((z) => z.id === position.sign);
  const element = getElement(position.sign);
  const degree = "degree" in position ? position.degree : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-3xl shadow-[0_0_20px_rgba(255,255,255,0.08)]"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))`,
          }}
        >
          {position.symbol}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-white/50">
            {title}
          </p>
          <p className="mt-1 text-lg font-semibold text-white">
            {signInfo?.nameTr ?? position.sign}
          </p>
          <p className="mt-0.5 text-sm text-white/70">
            {degree.toFixed(1)}° {signInfo?.nameTr ?? position.sign}{" "}
            · {ELEMENT_LABELS[element]}
          </p>
          {isRising && isApproximate && (
            <span className="mt-2 inline-block rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">
              Yaklaşık
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function PlanetCardList({
  planets,
  rising,
  order,
}: {
  planets: BirthChartResult["planets"];
  rising: BirthChartResult["rising"];
  order: string[];
}) {
  const labels: Record<string, string> = { ...PLANET_LABELS, rising: "Yükselen" };
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {order.map((key, i) => {
        const position = key === "rising" ? rising : planets[key as keyof typeof planets];
        if (!position) return null;
        return (
          <PlanetCard
            key={key}
            title={labels[key] ?? key}
            position={position}
            index={i}
            isRising={key === "rising"}
            isApproximate={key === "rising" ? rising.isApproximate : false}
          />
        );
      })}
    </div>
  );
}
