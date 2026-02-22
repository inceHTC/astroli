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

export default function BurcHesaplaPage() {
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("12:00");
  const [result, setResult] = useState<{
    sun: (typeof ZODIAC_SIGNS)[0];
    rising: (typeof ZODIAC_SIGNS)[0];
    moon: (typeof ZODIAC_SIGNS)[0];
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;

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
    <div className="bg-[#F7F8FC] pb-28">

      {/* HERO */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(91,63,255,0.06),transparent_60%)]" />

        <Container size="md">
          <div className="relative py-16 text-center">

            <Link
              href="/"
              className="mb-8 inline-block text-sm text-[#5B3FFF] hover:underline"
            >
              ← Ana sayfa
            </Link>

            <h1 className="text-4xl sm:text-5xl font-bold text-black">
              Burç Hesaplayıcı
            </h1>

            <p className="mt-4 text-[#444]">
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
            className="rounded-2xl bg-white border border-gray-200 p-8 shadow-sm"
          >

            <div className="space-y-6">

              <div>
                <label className="block text-sm font-medium text-black">
                  Doğum Tarihi
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-black focus:border-[#5B3FFF] focus:ring-1 focus:ring-[#5B3FFF]/30 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black">
                  Doğum Saati (Yükselen için)
                </label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-black focus:border-[#5B3FFF] focus:ring-1 focus:ring-[#5B3FFF]/30 outline-none"
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

                    <p className="text-sm text-gray-400">{label} Burcu</p>
                    <p className="mt-1 text-lg font-semibold">
                      {sign.nameTr}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {ELEMENT_LABELS[sign.element]}
                    </p>
                  </div>
                ))}

              </div>

            </div>

            <div className="mt-10 flex flex-col items-center gap-4">
              <ShareCard
                title={`${result.sun.nameTr} · ${result.rising.nameTr} · ${result.moon.nameTr}`}
                subtitle="Güneş · Yükselen · Ay"
                type="chart"
              />
              <Link
                href="/burclar"
                className="rounded-xl bg-[#5B3FFF] px-6 py-3 text-sm font-medium text-white hover:bg-[#4A2FDD] transition"
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
