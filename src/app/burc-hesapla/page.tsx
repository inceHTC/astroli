"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import {
  calculateSunSign,
  getRisingSign,
  getMoonSign,
} from "@/lib/astrology";
import { ZODIAC_SIGNS, ELEMENT_LABELS } from "@/data/zodiac";
import { ShareCard } from "@/components/share/ShareCard";

function getTodayLocalYYYYMMDD(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function BurcHesaplaPage() {
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("12:00");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    sun: (typeof ZODIAC_SIGNS)[0];
    rising: (typeof ZODIAC_SIGNS)[0];
    moon: (typeof ZODIAC_SIGNS)[0];
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!birthDate) return;
    const maxDate = getTodayLocalYYYYMMDD();
    if (birthDate > maxDate) {
      setError("Doğum tarihi bugün veya geçmiş bir tarih olmalıdır.");
      return;
    }

    const [year, month, day] = birthDate.split("-").map(Number);
    const [hour, minute] = birthTime.split(":").map(Number);

    const sunSign = calculateSunSign(month, day);
    if (!sunSign) return;

    const risingSign = getRisingSign(month, day, hour, minute);
    const moonSign = getMoonSign(month, day);

    const sunInfo = ZODIAC_SIGNS.find((z) => z.id === sunSign)!;
    const risingInfo = ZODIAC_SIGNS.find((z) => z.id === risingSign)!;
    const moonInfo = ZODIAC_SIGNS.find((z) => z.id === moonSign)!;

    setResult({ sun: sunInfo, rising: risingInfo, moon: moonInfo });
  };

  return (
    <div className="bg-[#070B12] pb-28">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#070B12]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(91,63,255,0.06),transparent_60%)]" />

        <Container size="md">
          <div className="relative py-16 text-center">

            <Link
              href="/"
              className="mb-8 inline-block text-sm text-[#D4AF72] hover:underline"
            >
              ← Ana sayfa
            </Link>

            <h1 className="text-4xl sm:text-5xl font-bold text-[#EDE9DF]">
              Burç Hesaplayıcı
            </h1>

            <p className="mt-4 text-[#8494B2]">
              Doğum tarihini gir, güneş, yükselen ve ay burcunu öğren.
            </p>

          </div>
        </Container>
      </section>

      {/* FORM */}
      <section className="mt-12">
        <Container size="sm">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-[#0E1523] border border-white/[0.07] p-8 "
          >

            <div className="space-y-6">

              {error && (
                <p className="text-sm text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
              )}
              <div>
                <label className="block text-sm font-medium text-[#EDE9DF]">
                  Doğum Tarihi
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={getTodayLocalYYYYMMDD()}
                  className="mt-2 w-full rounded-xl border border-white/[0.10] bg-[#0C1220] px-4 py-3 text-[#EDE9DF] focus:border-[#D4AF72] focus:ring-1 focus:ring-[#D4AF72]/20 outline-none"
                  required
                />
                <p className="mt-1 text-xs text-[#6B7A99]">Gelecek tarih seçilemez.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#EDE9DF]">
                  Doğum Saati (Yükselen için)
                </label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/[0.10] bg-[#0C1220] px-4 py-3 text-[#EDE9DF] focus:border-[#D4AF72] focus:ring-1 focus:ring-[#D4AF72]/20 outline-none"
                />
              </div>

              <Button type="submit" fullWidth size="lg">
                Hesapla
              </Button>

            </div>
          </form>
        </Container>
      </section>

      {/* RESULT */}
      {result && (
        <section className="mt-16">
          <Container size="md">

            <div className="rounded-2xl bg-[#11121A] text-white p-10 shadow-lg">

              <h2 className="text-2xl font-semibold">
                Senin Astro Haritan
              </h2>

              <div className="mt-10 grid gap-6 sm:grid-cols-3">

                {[
                  { label: "Güneş", sign: result.sun },
                  { label: "Yükselen", sign: result.rising },
                  { label: "Ay", sign: result.moon },
                ].map(({ label, sign }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-[#1A1C2B] text-4xl">
                      {sign.symbol}
                    </div>

                    <p className="text-sm text-[#6B7A99]">{label} Burcu</p>
                    <p className="mt-1 text-lg font-semibold">
                      {sign.nameTr}
                    </p>
                    <p className="mt-1 text-xs text-[#6B7A99]">
                      {ELEMENT_LABELS[sign.element]}
                    </p>
                  </div>
                ))}

              </div>

            </div>

            <div className="mt-10 flex flex-col items-center gap-4">
        
              <Link
                href="/burclar"
                className="rounded-xl bg-[#D4AF72] px-6 py-3 text-sm font-medium text-white hover:bg-[#C9A96E] transition"
              >
                Burcunun özelliklerini incele →
              </Link>
            </div>

          </Container>
        </section>
      )}
    </div>
  );
}
