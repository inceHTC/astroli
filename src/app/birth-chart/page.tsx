"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BirthForm, type BirthFormValues } from "./components/BirthForm";
import { ChartWheel } from "./components/ChartWheel";
import { PlanetCardList } from "./components/PlanetCard";
import { AspectList } from "./components/AspectList";
import type { BirthChartResult } from "@/lib/astrology/calculateChart";

const LOADING_STEPS = [
  "Yıldızlar hizalanıyor…",
  "Gezegen konumları hesaplanıyor…",
  "Kozmik desenler analiz ediliyor…",
];

const PLANET_ORDER = [
  "sun",
  "moon",
  "rising",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
];

export default function BirthChartPage() {
  const [result, setResult] = useState<BirthChartResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (values: BirthFormValues) => {
    setLoading(true);
    setResult(null);
    setError(null);
    setLoadingStep(0);

    for (let i = 0; i < LOADING_STEPS.length; i++) {
      setLoadingStep(i);
      await new Promise((r) => setTimeout(r, 400));
    }

    try {
      const res = await fetch("/api/birth-chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const errData = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((errData.error as string) ?? "Hesaplama başarısız.");
        return;
      }
      setResult(errData as BirthChartResult);
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
      setLoadingStep(0);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background */}
      <div
        className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(91,63,255,0.15),transparent_50%)]"
        aria-hidden
      />
      <div
        className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_60%_80%_at_80%_50%,rgba(140,123,255,0.08),transparent_50%)]"
        aria-hidden
      />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/" className="mb-8 inline-block text-sm text-[#5B3FFF] hover:underline">
              ← Ana sayfa
            </Link>

        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Doğum Haritası
          </h1>
          <p className="mt-3 text-white/70">
            Doğum tarihi, saati ve yerine göre gezegen konumları, yükselen ve açılar.
          </p>
        </motion.header>

        <section className="mb-14">
          <BirthForm onSubmit={handleSubmit} isLoading={loading} />
        </section>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-rose-200">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {loading && (
            <motion.section
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-14 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-16 backdrop-blur-xl"
            >
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[#8C7BFF]" />
              <p className="mt-4 text-sm text-white/80">
                {LOADING_STEPS[loadingStep]}
              </p>
            </motion.section>
          )}

          {!loading && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-14"
            >
              {result.meta.isApproximate && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-200 text-sm font-medium">
                  Yaklaşık doğum saati modu — Yükselen burç ve ev konumları değişken olabilir.
                </div>
              )}

              <section>
                <h2 className="mb-6 text-xl font-semibold text-white">
                  Harita Çarkı
                </h2>
                <ChartWheel planets={result.planets} rising={result.rising} />
              </section>

              <section>
                <h2 className="mb-6 text-xl font-semibold text-white">
                  Gezegen Konumları
                </h2>
                <PlanetCardList
                  planets={result.planets}
                  rising={result.rising}
                  order={PLANET_ORDER}
                />
              </section>

              {result.aspects.length > 0 && (
                <section>
                  <h2 className="mb-6 text-xl font-semibold text-white">
                    Açılar (Aspects)
                  </h2>
                  <AspectList aspects={result.aspects} />
                </section>
              )}

              <section>
                <h2 className="mb-6 text-xl font-semibold text-white">
                  Özet
                </h2>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8"
                >
                  <p className="whitespace-pre-line text-[15px] leading-relaxed text-white/85">
                    {result.summary}
                  </p>
                </motion.div>
              </section>

              <section className="flex justify-center">
                <Link
                  href="/burclar"
                  className="rounded-xl bg-[#5B3FFF] px-6 py-3 text-sm font-medium text-white hover:bg-[#4A2FDD] transition"
                >
                  Burcunun özelliklerini incele →
                </Link>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
