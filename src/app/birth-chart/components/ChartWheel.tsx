"use client";

import { motion } from "framer-motion";
import type { BirthChartResult } from "@/lib/astrology/calculateChart";
import { SIGN_IDS } from "@/lib/astrology/zodiac";

const RADIUS = 140;
const CENTER = 160;
const SEGMENTS = 12;

function polarToCartesian(angleDeg: number, r: number, cx: number, cy: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function getPlanetRadius(planetKey: string): number {
  const inner = RADIUS * 0.35;
  const outer = RADIUS * 0.85;
  const positions: Record<string, number> = {
    sun: 0.22,
    moon: 0.28,
    mercury: 0.34,
    venus: 0.40,
    mars: 0.46,
    jupiter: 0.52,
    saturn: 0.58,
    uranus: 0.64,
    neptune: 0.70,
    pluto: 0.76,
    rising: 0.92,
  };
  const t = positions[planetKey] ?? 0.5;
  return inner + (outer - inner) * t;
}

interface ChartWheelProps {
  planets: BirthChartResult["planets"];
  rising: BirthChartResult["rising"];
}

export function ChartWheel({ planets, rising }: ChartWheelProps) {
  const planetList: { key: string; longitude: number; symbol: string }[] = [
    { key: "sun", longitude: planets.sun.longitude, symbol: planets.sun.symbol },
    { key: "moon", longitude: planets.moon.longitude, symbol: planets.moon.symbol },
    { key: "mercury", longitude: planets.mercury.longitude, symbol: planets.mercury.symbol },
    { key: "venus", longitude: planets.venus.longitude, symbol: planets.venus.symbol },
    { key: "mars", longitude: planets.mars.longitude, symbol: planets.mars.symbol },
    { key: "jupiter", longitude: planets.jupiter.longitude, symbol: planets.jupiter.symbol },
    { key: "saturn", longitude: planets.saturn.longitude, symbol: planets.saturn.symbol },
    { key: "uranus", longitude: planets.uranus.longitude, symbol: planets.uranus.symbol },
    { key: "neptune", longitude: planets.neptune.longitude, symbol: planets.neptune.symbol },
    { key: "pluto", longitude: planets.pluto.longitude, symbol: planets.pluto.symbol },
    { key: "rising", longitude: rising.longitude, symbol: rising.symbol },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative mx-auto w-full max-w-[320px]"
    >
      <svg
        viewBox="0 0 320 320"
        className="w-full"
        aria-hidden
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="wheelStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(140,123,255,0.5)" />
            <stop offset="100%" stopColor="rgba(91,63,255,0.3)" />
          </linearGradient>
        </defs>

        {/* Outer circle */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS + 8}
          fill="none"
          stroke="url(#wheelStroke)"
          strokeWidth="1.5"
          opacity="0.8"
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />

        {/* 12 segments */}
        {Array.from({ length: SEGMENTS }, (_, i) => {
          const start = (i * 360) / SEGMENTS;
          const end = ((i + 1) * 360) / SEGMENTS;
          const startRad = ((start - 90) * Math.PI) / 180;
          const endRad = ((end - 90) * Math.PI) / 180;
          const x1 = CENTER + RADIUS * Math.cos(startRad);
          const y1 = CENTER + RADIUS * Math.sin(startRad);
          const x2 = CENTER + RADIUS * Math.cos(endRad);
          const y2 = CENTER + RADIUS * Math.sin(endRad);
          return (
            <line
              key={i}
              x1={CENTER}
              y1={CENTER}
              x2={(x1 + x2) / 2}
              y2={(y1 + y2) / 2}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          );
        })}

        {/* Sign symbols at segment midpoints (outer rim) */}
        {SIGN_IDS.map((_, i) => {
          const angle = (i * 30) + 15;
          const pos = polarToCartesian(angle, RADIUS - 14, CENTER, CENTER);
          const symbol = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"][i];
          return (
            <text
              key={i}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white/40"
              style={{ fontSize: "14px" }}
            >
              {symbol}
            </text>
          );
        })}

        {/* Planets */}
        {planetList.map(({ key, longitude, symbol }, i) => {
          const r = getPlanetRadius(key);
          const pos = polarToCartesian(longitude, r * RADIUS, CENTER, CENTER);
          return (
            <g key={key} filter="url(#glow)">
              <circle
                cx={pos.x}
                cy={pos.y}
                r={key === "rising" ? 12 : 10}
                fill="rgba(17,18,26,0.9)"
                stroke="rgba(140,123,255,0.5)"
                strokeWidth="1"
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white"
                style={{ fontSize: key === "rising" ? "10px" : "9px" }}
              >
                {symbol}
              </text>
            </g>
          );
        })}
      </svg>
    </motion.div>
  );
}
