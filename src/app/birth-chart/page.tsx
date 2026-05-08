"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BirthForm, type BirthFormValues } from "./components/BirthForm";
import { ChartWheel } from "./components/ChartWheel";
import { PlanetCardList } from "./components/PlanetCard";
import { AspectList } from "./components/AspectList";
import type { BirthChartResult } from "@/lib/astrology/calculateChart";
import { ZODIAC_SIGNS } from "@/data/zodiac";

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
  const [submittedName, setSubmittedName] = useState<string>("");
  const resultsRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading && loadingRef.current) {
      loadingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [loading]);

  useEffect(() => {
    if (result && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [result]);

  const handleSubmit = useCallback(async (values: BirthFormValues) => {
    setLoading(true);
    setResult(null);
    setError(null);
    setLoadingStep(0);
    setSubmittedName(values.fullName);

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
      <Link href="/" className="mb-8 inline-block text-sm text-[#ffc552] hover:underline">
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
              ref={loadingRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-14 flex flex-col items-center justify-center gap-4 rounded-2xl border border-[#8C7BFF]/30 bg-[#8C7BFF]/10 py-16 backdrop-blur-xl"
            >
              <div className="relative h-14 w-14">
                <div className="absolute inset-0 animate-spin rounded-full border-2 border-white/10 border-t-[#8C7BFF]" />
                <div className="absolute inset-2 animate-spin rounded-full border border-white/10 border-t-[#ffc552]" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
              </div>
              <div className="text-center">
                <p className="text-base font-medium text-white">
                  {LOADING_STEPS[loadingStep]}
                </p>
                <p className="mt-1 text-sm text-white/50">Lütfen bekleyin</p>
              </div>
            </motion.section>
          )}

          {!loading && result && (
            <motion.div
              key="result"
              ref={resultsRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-10"
            >
              {/* Kimlik kartı — en önemli 3 bilgi */}
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-[#8C7BFF]/40 bg-gradient-to-br from-[#8C7BFF]/20 to-[#5B3FFF]/10 p-6 backdrop-blur-xl sm:p-8"
              >
                <p className="mb-5 text-center text-sm font-medium uppercase tracking-widest text-white/50">
                  Doğum Haritası Hazır
                </p>
                <h2 className="mb-6 text-center text-2xl font-bold text-white sm:text-3xl">
                  {submittedName}
                </h2>
                <div className="grid grid-cols-3 gap-3 sm:gap-5">
                  {[
                    { key: "sun", label: "Güneş Burcu", data: result.planets.sun },
                    { key: "moon", label: "Ay Burcu", data: result.planets.moon },
                    { key: "rising", label: "Yükselen", data: result.rising },
                  ].map(({ key, label, data }) => {
                    const signInfo = ZODIAC_SIGNS.find((z) => z.id === data?.sign);
                    return (
                      <div
                        key={key}
                        className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4 text-center"
                      >
                        <span className="text-3xl">{data?.symbol}</span>
                        <span className="text-xs font-medium uppercase tracking-wider text-white/50">
                          {label}
                        </span>
                        <span className="text-sm font-semibold text-white">
                          {signInfo?.nameTr ?? data?.sign}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.section>

              {result.meta.isApproximate && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-200 text-sm font-medium">
                  Yaklaşık doğum saati modu — Yükselen burç ve ev konumları değişken olabilir.
                </div>
              )}

              <section>
                <h2 className="mb-4 text-lg font-semibold text-white/90">
                  Yorumun
                </h2>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8"
                >
                  <p className="whitespace-pre-line text-[15px] leading-relaxed text-white/85">
                    {result.summary}
                  </p>
                </motion.div>
              </section>

              <section>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-white/90">Gezegen Konumları</h2>
                  <p className="mt-1 text-sm text-white/45">Doğduğun anda her gezegen hangi burçtaydı? Güneş genel kişiliğini, Ay duygularını, diğerleri de hayatının farklı alanlarını (iletişim, aşk, kariyer…) temsil eder.</p>
                </div>
                <PlanetCardList
                  planets={result.planets}
                  rising={result.rising}
                  order={PLANET_ORDER}
                />
              </section>

              <section>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-white/90">Gökyüzü Haritası</h2>
                  <p className="mt-1 text-sm text-white/45">Doğduğun andaki gökyüzünün dairesel görünümü. Gezegenler çark üzerinde nerede duruyorsa o burçtaydılar — görsel bir özet.</p>
                </div>
                <ChartWheel planets={result.planets} rising={result.rising} />
              </section>

              {result.aspects.length > 0 && (
                <section>
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-white/90">Gezegen Etkileşimleri</h2>
                    <p className="mt-1 text-sm text-white/45">İki gezegen birbirine belirli bir açıyla geldiğinde birbirini etkiler — uyum yaratabilir ya da gerilim doğurabilir. Bu liste o ilişkileri gösterir.</p>
                  </div>
                  <AspectList aspects={result.aspects} />
                </section>
              )}

              <section className="flex justify-center pb-8">
                <Link
                  href={`/burc/${result.planets.sun.sign}`}
                  className="rounded-xl bg-[#ffc552] px-6 py-3 text-sm font-medium text-white hover:bg-[#ffd47a] transition"
                >
                  {ZODIAC_SIGNS.find((z) => z.id === result.planets.sun.sign)?.nameTr ?? result.planets.sun.sign} burcunun özelliklerini incele →
                </Link>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

