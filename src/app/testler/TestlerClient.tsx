"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { TESTS } from "@/data/tests";
import type { PersonalityTest } from "@/data/tests";

const CATEGORY_IMAGES: Record<string, string> = {
  love: "/tests/love.png",
  career: "/tests/career.png",
  psychology: "/tests/mind.png",
  spiritual: "/tests/aura.png",
  personality: "/tests/personality.png",
};

const CATEGORY_LABELS: Record<string, string> = {
  all: "Tümü",
  love: "Aşk & İlişki",
  spiritual: "Ruhsal",
  psychology: "Psikoloji",
  career: "Kariyer",
  personality: "Kişilik",
};

const CATEGORY_ICONS: Record<string, string> = {
  all: "✦",
  love: "♥",
  spiritual: "☽",
  psychology: "◈",
  career: "◆",
  personality: "◉",
};

const NEW_SLUGS = new Set([
  "ruh-esin-burcu",
  "onceki-yasam",
  "gezegen-enerjin",
  "enerji-2025",
  "tarot-kartin",
  "astrolojik-karanlik-yan",
  "ask-dili",
  "muzik-enerjisi",
  "sosyal-medya-kisilik",
  "baski-altinda",
  "arkadaslik-tarzi",
]);

const VIRAL_SLUGS = new Set([
  "ruh-esin-burcu",
  "enerji-2025",
  "ask-dili",
  "baski-altinda",
]);

const FAQ_ITEMS = [
  {
    q: "Astroloji kişilik testleri ne kadar güvenilir?",
    a: "Bu testler eğlence ve öz keşif amaçlıdır. Element enerjileri (Ateş, Toprak, Hava, Su) Batı astrolojisinin temel yapıtaşlarıdır ve binlerce yıllık gözlemlere dayanır. Sonuçlar kişisel farkındalık için yol gösterici bir ayna olarak kullanılabilir.",
  },
  {
    q: "Hangi testi önce çözmeliyim?",
    a: "'Ruh Eşin Hangi Burçtan?' ve '2025'te Seni Ne Bekliyor?' testleri başlangıç için idealdir. Daha derin bir keşif için 'Bir Önceki Yaşamında Kimdin?' ve 'Astrolojik Karanlık Yanın Ne?' testlerini deneyebilirsin.",
  },
  {
    q: "Testlerde hangi astroloji sistemi kullanılıyor?",
    a: "Testlerde Batı astrolojisinin dört elementi kullanılır: Ateş (Koç, Aslan, Yay), Toprak (Boğa, Başak, Oğlak), Hava (İkizler, Terazi, Kova) ve Su (Yengeç, Akrep, Balık). Her sorunun cevabı bu dört profil arasında puan dağılımı yaparak kişisel profilini belirler.",
  },
  {
    q: "Sonuçlar değişebilir mi?",
    a: "Evet. Astroloji enerjileri sabittir ama senin hayat dönemin değişkendir. Farklı zamanlarda aynı testi çözersen farklı sonuçlar gelebilir — bu aslında gelişimin ve değişimin işareti.",
  },
];

export function TestlerClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filtered: PersonalityTest[] =
    activeCategory === "all"
      ? TESTS
      : TESTS.filter((t) => t.category === activeCategory);

  const viralTests = TESTS.filter((t) => VIRAL_SLUGS.has(t.slug)).slice(0, 2);

  return (
    <div className="bg-[#070B12] pb-28">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(91,63,255,0.12),transparent_65%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#ffc552]/20 to-transparent" />
        <Container size="md">
          <div className="relative py-20 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ffc552]/30 bg-[#ffc552]/10 px-4 py-1.5 text-xs font-medium text-[#ffc552]">
              <span>✦</span>
              <span>{TESTS.length} Test · Ücretsiz · Hemen Çöz</span>
            </div>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-[#EDE9DF] leading-tight">
              Astroloji & Kişilik
              <span className="block text-[#ffc552]">Testleri</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-[#8494B2] max-w-xl mx-auto leading-relaxed">
              Ruh eşin hangi burçtan? Tarot kartın hangisi? Önceki hayatında kimdin?
              Burç enerjileriyle kendinle yüzleş.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-[#6B7A99]">
              <span className="flex items-center gap-1.5"><span className="text-[#ffc552]">✦</span> Ücretsiz</span>
              <span className="flex items-center gap-1.5"><span className="text-[#ffc552]">✦</span> 3–6 dakika</span>
              <span className="flex items-center gap-1.5"><span className="text-[#ffc552]">✦</span> Paylaşılabilir</span>
              <span className="flex items-center gap-1.5"><span className="text-[#ffc552]">✦</span> Element analizi</span>
            </div>
          </div>
        </Container>
      </section>

      {/* CATEGORY FILTER */}
      <section className="sticky top-0 z-20 border-b border-white/[0.05] bg-[#070B12]/95 backdrop-blur-md">
        <Container size="lg">
          <div className="flex gap-1 overflow-x-auto py-3">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
              const count = key === "all" ? TESTS.length : TESTS.filter((t) => t.category === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    activeCategory === key
                      ? "bg-[#ffc552] text-[#070B12]"
                      : "text-[#8494B2] hover:text-[#EDE9DF] hover:bg-white/[0.05]"
                  }`}
                >
                  <span>{CATEGORY_ICONS[key]}</span>
                  {label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs ${
                      activeCategory === key ? "bg-black/20 text-[#070B12]" : "bg-white/10 text-[#6B7A99]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      {/* TEST GRID */}
      <section className="mt-10">
        <Container size="lg">
          {/* VIRAL SPOTLIGHT */}
          {activeCategory === "all" && (
            <div className="mb-10">
              <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-[#ffc552]">
                🔥 Çok Konuşulanlar
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                {viralTests.map((test) => {
                  const image = test.image || CATEGORY_IMAGES[test.category] || "/tests/default.png";
                  return (
                    <Link key={test.id} href={`/test/${test.slug}`}>
                      <div className="group relative overflow-hidden rounded-2xl border border-[#ffc552]/20 bg-gradient-to-br from-[#ffc552]/8 via-[#11121A] to-[#0E1523] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(212,175,114,0.12)]">
                        <div className="absolute top-3 left-3 z-10 flex gap-2">
                          <span className="rounded-full bg-[#ffc552] px-2.5 py-1 text-[10px] font-bold text-[#070B12] uppercase tracking-wide">
                            Viral
                          </span>
                          <span className="rounded-full bg-[#5B3FFF]/80 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wide">
                            Yeni
                          </span>
                        </div>
                        <div className="relative aspect-[21/9] w-full overflow-hidden">
                          <Image
                            src={image}
                            alt={test.title}
                            fill
                            className="object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#11121A] via-[#11121A]/40 to-transparent" />
                        </div>
                        <div className="p-5">
                          <h2 className="text-xl font-bold text-[#EDE9DF] leading-tight">{test.title}</h2>
                          <p className="mt-2 text-sm text-[#8494B2] line-clamp-2">{test.description}</p>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex gap-2">
                              <span className="rounded-full bg-[#ffc552]/20 px-3 py-1 text-xs text-[#ffc552]">{test.duration}</span>
                              <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-[#8494B2]">{test.questionCount} soru</span>
                            </div>
                            <span className="text-sm font-medium text-[#ffc552] group-hover:translate-x-0.5 transition-transform">
                              Başla →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {activeCategory === "all" && (
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-[#8494B2]">
              ✦ Tüm Testler
            </p>
          )}

          {/* MAIN GRID */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((test) => {
              const image = test.image || CATEGORY_IMAGES[test.category] || "/tests/default.png";
              const isNew = NEW_SLUGS.has(test.slug);
              const isViral = VIRAL_SLUGS.has(test.slug);

              return (
                <Link key={test.id} href={`/test/${test.slug}`}>
                  <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0E1523] transition-all duration-300 hover:-translate-y-1 hover:border-[#ffc552]/25 hover:shadow-lg hover:shadow-black/40 h-full flex flex-col">
                    {(isNew || isViral) && (
                      <div className="absolute top-3 left-3 z-10 flex gap-1.5">
                        {isViral && (
                          <span className="rounded-full bg-[#ffc552] px-2 py-0.5 text-[9px] font-bold text-[#070B12] uppercase tracking-wide">
                            Viral
                          </span>
                        )}
                        {isNew && !isViral && (
                          <span className="rounded-full bg-[#5B3FFF] px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wide">
                            Yeni
                          </span>
                        )}
                      </div>
                    )}

                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <Image
                        src={image}
                        alt={test.title}
                        fill
                        className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0E1523] via-transparent to-transparent" />
                    </div>

                    <div className="flex flex-col flex-1 p-5">
                      <h2 className="text-base font-semibold text-[#EDE9DF] leading-snug group-hover:text-white transition-colors">
                        {test.title}
                      </h2>
                      <p className="mt-2 text-sm text-[#6B7A99] line-clamp-2 flex-1">
                        {test.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex gap-1.5">
                          <span className="rounded-full bg-[#ffc552]/15 px-2.5 py-1 text-xs text-[#ffc552]">
                            {test.duration}
                          </span>
                          <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-xs text-[#6B7A99]">
                            {test.questionCount} soru
                          </span>
                        </div>
                        <span className="text-xs text-[#5B3FFF] opacity-0 group-hover:opacity-100 transition-opacity">
                          Başla →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center text-[#6B7A99]">
              Bu kategoride henüz test yok.
            </div>
          )}
        </Container>
      </section>

      {/* WHY SECTION */}
      <section className="mt-20">
        <Container size="md">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0E1523] p-8 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold text-[#EDE9DF] text-center">
              Neden Bu Testler Farklı?
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: "☽",
                  title: "Astroloji Temelli",
                  desc: "Sonuçlar Batı astrolojisinin dört elementi üzerine kurulu — yüzlerce yıllık bilgelik.",
                },
                {
                  icon: "◈",
                  title: "Kişisel Dil",
                  desc: "Kuru psikoloji raporları değil — sana özel, akıcı ve dürüst bir ayna.",
                },
                {
                  icon: "✦",
                  title: "Paylaşılabilir",
                  desc: "Sonuçlarını arkadaşlarınla paylaş, karşılaştır. Viral çünkü gerçek.",
                },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className="text-3xl text-[#ffc552]">{item.icon}</div>
                  <h3 className="mt-3 font-semibold text-[#EDE9DF]">{item.title}</h3>
                  <p className="mt-2 text-sm text-[#6B7A99] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="mt-16">
        <Container size="md">
          <h2 className="mb-6 text-xl sm:text-2xl font-bold text-[#EDE9DF]">
            Sık Sorulan Sorular
          </h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/[0.06] bg-[#0E1523] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-[#EDE9DF] pr-4 text-sm sm:text-base">
                    {item.q}
                  </span>
                  <span
                    className={`flex-shrink-0 text-[#ffc552] text-xl transition-transform duration-200 leading-none ${
                      openFaq === i ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-[#8494B2] leading-relaxed border-t border-white/[0.04] pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* INTERNAL LINKS */}
      <section className="mt-16">
        <Container size="md">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0E1523] p-6 sm:p-8">
            <h2 className="text-base font-semibold text-[#EDE9DF] mb-4">
              Daha Fazla Keşfet
            </h2>
            <div className="flex flex-wrap gap-3">
              {[
                { href: "/uyumluluk", label: "Burç Uyumluluğu" },
                { href: "/birth-chart", label: "Doğum Haritası" },
                { href: "/burc-hesapla", label: "Burç Hesapla" },
                { href: "/burclar", label: "Tüm Burçlar" },
                { href: "/gunluk-burc", label: "Günlük Burç" },
                { href: "/unluler", label: "Ünlülerin Burçları" },
                { href: "/retro", label: "Retro Merkezi" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-[#8494B2] hover:border-[#ffc552]/40 hover:text-[#ffc552] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

