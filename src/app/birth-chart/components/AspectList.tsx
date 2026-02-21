"use client";

import { motion } from "framer-motion";
import type { Aspect } from "@/lib/astrology/aspects";

const ASPECT_LABELS: Record<string, string> = {
  conjunction: "Kavuşum",
  opposition: "Karşıt",
  trine: "Trine",
  square: "Kare",
};

const BODY_LABELS: Record<string, string> = {
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

interface AspectListProps {
  aspects: Aspect[];
}

export function AspectList({ aspects }: AspectListProps) {
  if (aspects.length === 0) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {aspects.map((a, i) => (
        <motion.div
          key={`${a.body1}-${a.body2}-${a.type}`}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl"
        >
          <span className="font-medium text-white">
            {BODY_LABELS[a.body1] ?? a.body1} – {BODY_LABELS[a.body2] ?? a.body2}
          </span>
          <span className="ml-2 text-white/60">
            {ASPECT_LABELS[a.type] ?? a.type} ({a.orb.toFixed(1)}°)
          </span>
        </motion.div>
      ))}
    </div>
  );
}
