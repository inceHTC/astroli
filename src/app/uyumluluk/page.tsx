"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { calculateSunSign } from "@/lib/astrology";
import { ZODIAC_SIGNS, ELEMENT_LABELS, type Element } from "@/data/zodiac";

const ELEMENT_COMPAT: Record<Element, Record<Element, number>> = {
  fire: { fire: 80, earth: 60, air: 90, water: 40 },
  earth: { fire: 60, earth: 85, air: 50, water: 75 },
  air: { fire: 90, air: 85, earth: 50, water: 65 },
  water: { fire: 40, earth: 75, air: 65, water: 80 },
};

function getCompatibilityScore(
  sign1: (typeof ZODIAC_SIGNS)[0],
  sign2: (typeof ZODIAC_SIGNS)[0]
): { score: number; description: string; risk: "low" | "medium" | "high" } {
  const base = ELEMENT_COMPAT[sign1.element][sign2.element];
  const sameSign = sign1.id === sign2.id ? 5 : 0;
  const score = Math.min(100, base + sameSign);

  let description: string;
  let risk: "low" | "medium" | "high" = "medium";

  if (score >= 85) {
    description = "Kozmik bir uyum! İkiniz birbirinizi tamamlıyorsunuz.";
    risk = "low";
  } else if (score >= 70) {
    description = "Güzel bir uyum var. Sabır ve iletişimle daha da güçlenir.";
    risk = "low";
  } else if (score >= 55) {
    description = "Orta seviye uyum. Farklılıklarınızı kucaklayın.";
    risk = "medium";
  } else {
    description = "Zorlu ama imkansız değil. Çaba ve anlayış şart.";
    risk = "high";
  }

  return { score, description, risk };
}

export default function UyumlulukPage() {
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [result, setResult] = useState<{
    sign1: (typeof ZODIAC_SIGNS)[0];
    sign2: (typeof ZODIAC_SIGNS)[0];
    compatibility: ReturnType<typeof getCompatibilityScore>;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date1 || !date2) return;

    const [, m1, d1] = date1.split("-").map(Number);
    const [, m2, d2] = date2.split("-").map(Number);

    const sign1Id = calculateSunSign(m1, d1);
    const sign2Id = calculateSunSign(m2, d2);

    if (!sign1Id || !sign2Id) return;

    const sign1 = ZODIAC_SIGNS.find((z) => z.id === sign1Id)!;
    const sign2 = ZODIAC_SIGNS.find((z) => z.id === sign2Id)!;

    setResult({
      sign1,
      sign2,
      compatibility: getCompatibilityScore(sign1, sign2),
    });
  };

  return (
    <div className="bg-[#F7F8FC] pb-28">
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(91,63,255,0.06),transparent_60%)]" />
        <Container size="md">
          <div className="relative py-16 text-center">
            <Link href="/" className="mb-8 inline-block text-sm text-[#5B3FFF] hover:underline">
              ← Ana sayfa
            </Link>
            <h1 className="text-4xl sm:text-5xl font-bold text-black">
              Burç Uyumluluğu
            </h1>
            <p className="mt-4 text-[#444]">
              İki doğum tarihi gir, burç uyumunu keşfet.
            </p>
          </div>
        </Container>
      </section>

      <section className="mt-12">
        <Container size="sm">
          <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-gray-200 p-8 shadow-sm">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black">İlk Kişi</label>
                <input
                  type="date"
                  value={date1}
                  onChange={(e) => setDate1(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-black focus:border-[#5B3FFF] focus:ring-1 focus:ring-[#5B3FFF]/30 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">İkinci Kişi</label>
                <input
                  type="date"
                  value={date2}
                  onChange={(e) => setDate2(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-black focus:border-[#5B3FFF] focus:ring-1 focus:ring-[#5B3FFF]/30 outline-none"
                  required
                />
              </div>
              <Button type="submit" fullWidth size="lg">
                Hesapla
              </Button>
            </div>
          </form>
        </Container>
      </section>

      {result && (
        <section className="mt-16">
          <Container size="md">
            <div className="rounded-2xl bg-[#11121A] text-white p-10 shadow-lg">
              <div className="flex items-center justify-center gap-6">
                <span className="text-5xl">{result.sign1.symbol}</span>
                <span className="text-2xl text-gray-500">+</span>
                <span className="text-5xl">{result.sign2.symbol}</span>
              </div>
              <p className="mt-4 text-center font-semibold">
                {result.sign1.nameTr} & {result.sign2.nameTr}
              </p>
              <div className="mt-8 text-center">
                <p className="text-5xl font-bold text-[#5B3FFF] sm:text-6xl">
                  %{result.compatibility.score}
                </p>
                <p className="mt-1 text-sm text-gray-400">Uyum Skoru</p>
              </div>
              <p className="mt-6 text-center text-gray-300 leading-relaxed">
                {result.compatibility.description}
              </p>
              <div className="mt-6 flex justify-center">
                <span
                  className={`rounded-full px-4 py-1.5 text-sm ${
                    result.compatibility.risk === "low"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : result.compatibility.risk === "medium"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-rose-500/20 text-rose-400"
                  }`}
                >
                  {result.compatibility.risk === "low" && "Düşük risk"}
                  {result.compatibility.risk === "medium" && "Orta risk"}
                  {result.compatibility.risk === "high" && "Yüksek risk"}
                </span>
              </div>
              <div className="mt-8 flex justify-between rounded-xl bg-[#1A1C2B] p-5">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Element</p>
                  <p className="mt-1 font-medium">{ELEMENT_LABELS[result.sign1.element]}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Element</p>
                  <p className="mt-1 font-medium">{ELEMENT_LABELS[result.sign2.element]}</p>
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
