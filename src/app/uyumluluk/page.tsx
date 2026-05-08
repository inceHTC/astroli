"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { calculateSunSign } from "@/lib/astrology";
import { ZODIAC_SIGNS, ELEMENT_LABELS, type Element } from "@/data/zodiac";

function getTodayLocalYYYYMMDD(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

type ElementKey = Element;
type PairKey = string;

interface CategoryScores {
  love: number;
  friendship: number;
  communication: number;
  longTerm: number;
}

interface PairData {
  categories: CategoryScores;
  description: string;
  strengths: string[];
  challenges: string[];
}

function pairKey(e1: ElementKey, e2: ElementKey): PairKey {
  return [e1, e2].sort().join("-");
}

const PAIR_DATA: Record<PairKey, PairData> = {
  "fire-fire": {
    categories: { love: 80, friendship: 78, communication: 68, longTerm: 62 },
    description: "İki ateş burcu bir araya gelince alev alev yanıyor! Ortak tutku ve enerji sizi hızla yakınlaştırır — ama bu alevler bazen birbirinizi de yakabilir. Rekabet ve ego dengesini korumak ilişkinin anahtarı.",
    strengths: ["Sonsuz enerji ve ortak coşku", "Birbirini motive etme gücü", "Macera ve yenilik tutkusu"],
    challenges: ["Ego ve üstünlük çatışmaları", "İkisi de lider olmak ister", "Sabırsızlık ve ani kararlar"],
  },
  "earth-fire": {
    categories: { love: 58, friendship: 55, communication: 52, longTerm: 60 },
    description: "Ateş ve toprak; biri alev, diğeri zemin. Farklı ritimleriniz başlangıçta çatışma yaratabilir, ancak birbirinizi dengeleme potansiyeliniz gerçekten güçlü. Sabır bu ilişkinin altın anahtarı.",
    strengths: ["Toprağın istikrarı ateşi dengeler", "Pratiklik ve heyecanın birleşimi", "Birbirinden öğrenme"],
    challenges: ["Çok farklı hayat tempoları", "Ateş aceleci, toprak temkinli", "Ortak karar almak zorlaşabilir"],
  },
  "air-fire": {
    categories: { love: 85, friendship: 88, communication: 90, longTerm: 70 },
    description: "Ateş ve hava mükemmel bir ikili oluşturur — hava ateşi körükler, ateş havayı hareketlendirir. Aranızdaki zeka kıvılcımı ve coşku sizi sürekli canlı ve heyecanlı tutar.",
    strengths: ["Coşku ve zekanın harika harmanı", "Hiç bitmez sohbetler", "Birbirinize özgürlük tanırsınız"],
    challenges: ["Duygusal derinlikten ikisi de kaçabilir", "Taahhüt vermek zorlaşabilir", "Sürdürülebilirlik sorunu"],
  },
  "fire-water": {
    categories: { love: 58, friendship: 42, communication: 45, longTerm: 48 },
    description: "Ateş ve su zıt kutuplardır — su ateşi söndürebilir, ateş suyu buharlaştırabilir. Bu gerilim hem güçlü bir çekim hem de derin bir sürtüşme kaynağı olabilir. Anlayış ve empati şart.",
    strengths: ["Güçlü fiziksel ve duygusal çekim", "Birbirinin eksiklerini kapatma", "Derin ve yoğun deneyimler"],
    challenges: ["Çok farklı duygusal ihtiyaçlar", "Özgürlük vs. güvenlik gerilimi", "İletişimde sık çıkmaz"],
  },
  "earth-earth": {
    categories: { love: 78, friendship: 82, communication: 72, longTerm: 90 },
    description: "İki toprak burcu sabırlı, pratik ve güvenilirdir. Birlikte sağlam bir temel kurabilirsiniz. Uzun vadede güçlenen bu ilişki, zamanla taşa kazınmış bir bağa dönüşür.",
    strengths: ["Derin güven ve istikrar", "Ortak hayat hedefleri", "Uzun vadeli bağlılık ve sadakat"],
    challenges: ["Değişime karşı direnç", "Rutinin monotonluğu", "Spontane olmak her ikisi için de zor"],
  },
  "air-earth": {
    categories: { love: 50, friendship: 56, communication: 62, longTerm: 54 },
    description: "Toprak ve hava; biri kökleri, diğeri kanatları temsil eder. Pratiklik ile yaratıcılık arasındaki denge zaman zaman gerilim yaratsa da birbirinizi tamamlama potansiyeliniz var.",
    strengths: ["Birbirini tamamlayan bakış açıları", "Havanın fikirleri, toprağın uygulaması", "Entelektüel etkileşim"],
    challenges: ["Farklı öncelikler ve değerler", "Toprak çok katı, hava çok dağınık bulabilir", "Duygusal bağ kurmak zaman alır"],
  },
  "earth-water": {
    categories: { love: 82, friendship: 76, communication: 70, longTerm: 88 },
    description: "Toprak ve su harika bir uyum içindedir — su toprağı besler, toprak suya yön verir. Bu ikilinin ilişkisi derin, sıcak ve destekleyicidir. Zamanla olgunlaşan bir bağ.",
    strengths: ["Duygusal güvenlik ve derin destek", "Sezgi ve sağduyu bir arada", "Uzun vadede güçlenen bağ"],
    challenges: ["Toprak çok rasyonel, su duygusal bulabilir", "Su burcunun duygu dalgalanmaları", "Değişime uyum sağlamak"],
  },
  "air-air": {
    categories: { love: 78, friendship: 90, communication: 95, longTerm: 68 },
    description: "İki hava burcu bir arada; sohbet hiç bitmez, fikirler uçuşur! Entelektüel uyumunuz neredeyse kusursuz. Ancak ilişkiyi zemine indirgemek ve duygusal derinlik yaratmak biraz çaba gerektirir.",
    strengths: ["Mükemmel iletişim ve anlayış", "Ortak merak ve öğrenme isteği", "Birbirinize özgürlük tanırsınız"],
    challenges: ["Duygusal derinlik eksik kalabilir", "Kararsızlık ve taahhütten kaçınma", "Hayaller gerçeğe dönüşmeyebilir"],
  },
  "air-water": {
    categories: { love: 65, friendship: 65, communication: 62, longTerm: 64 },
    description: "Hava ve su; düşünceler ile duygular arasında bir köprü. İkiniz birbirini anlayabilir ama yaklaşım tarzınızdaki fark bazen anlaşmazlık yaratır. Empati bu ilişkinin yapıştırıcısı.",
    strengths: ["Duygu ve mantığın dengesi", "Derin empati ve anlayış", "Birbirini tamamlayan nitelikler"],
    challenges: ["Su çok duygusal, hava mesafeli bulabilir", "Farklı iletişim tarzları", "Yüzeysellik vs. derinlik gerginliği"],
  },
  "water-water": {
    categories: { love: 85, friendship: 80, communication: 72, longTerm: 80 },
    description: "İki su burcu; derin, sezgisel ve duygusal bir bağ kurar. Birbirinizi kelimesiz anlayabilirsiniz. Ama duygu yoğunluğu zaman zaman boğucu hale gelebilir — nefes almayı unutmayın.",
    strengths: ["Sezgisel ve derin anlayış", "Tam anlamıyla hissedilmek", "Güçlü duygusal bağ"],
    challenges: ["Duygusal aşırı yük riski", "İkisi de hassas — çatışmalar derin yarar", "Nesnel karar almak güçleşir"],
  },
};

const SIGN_INDEX: Record<string, number> = {
  aries: 0, taurus: 1, gemini: 2, cancer: 3,
  leo: 4, virgo: 5, libra: 6, scorpio: 7,
  sagittarius: 8, capricorn: 9, aquarius: 10, pisces: 11,
};

function getRelationModifier(id1: string, id2: string): Partial<CategoryScores> {
  if (id1 === id2) return { longTerm: 8, love: -5 };
  const i1 = SIGN_INDEX[id1] ?? 0;
  const i2 = SIGN_INDEX[id2] ?? 0;
  const diff = Math.min(Math.abs(i1 - i2), 12 - Math.abs(i1 - i2));
  if (diff === 6) return { love: 10, communication: 5 };        // karşıt
  if (diff === 4) return { love: 6, friendship: 6, communication: 6, longTerm: 6 }; // trine
  if (diff === 2) return { love: 4, friendship: 4, communication: 4, longTerm: 4 }; // sextile
  if (diff === 3) return { love: -6, communication: -8, longTerm: -6 }; // kare
  return {};
}

function clamp(v: number) { return Math.max(10, Math.min(99, v)); }

function getCompatibility(sign1: (typeof ZODIAC_SIGNS)[0], sign2: (typeof ZODIAC_SIGNS)[0]) {
  const key = pairKey(sign1.element, sign2.element);
  const data = PAIR_DATA[key];
  const mod = getRelationModifier(sign1.id, sign2.id);

  const categories: CategoryScores = {
    love: clamp((data?.categories.love ?? 65) + (mod.love ?? 0)),
    friendship: clamp((data?.categories.friendship ?? 65) + (mod.friendship ?? 0)),
    communication: clamp((data?.categories.communication ?? 65) + (mod.communication ?? 0)),
    longTerm: clamp((data?.categories.longTerm ?? 65) + (mod.longTerm ?? 0)),
  };

  const score = clamp(Math.round((categories.love + categories.friendship + categories.communication + categories.longTerm) / 4));

  return {
    score,
    categories,
    description: data?.description ?? "Birbirinizden öğrenecek çok şey var. Bu ilişki büyüme ve dönüşüm getirir.",
    strengths: data?.strengths ?? [],
    challenges: data?.challenges ?? [],
  };
}

function ScoreBar({ value, color = "#ffc552" }: { value: number; color?: string }) {
  return (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}

const CATEGORY_META = [
  { key: "love" as const, label: "Aşk & Romantizm", icon: "♥" },
  { key: "friendship" as const, label: "Arkadaşlık", icon: "☀" },
  { key: "communication" as const, label: "İletişim", icon: "◎" },
  { key: "longTerm" as const, label: "Uzun Vade", icon: "⬡" },
];

function scoreColor(v: number) {
  if (v >= 80) return "#4ade80";
  if (v >= 65) return "#fbbf24";
  return "#f87171";
}

export default function UyumlulukPage() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    sign1: (typeof ZODIAC_SIGNS)[0];
    sign2: (typeof ZODIAC_SIGNS)[0];
    label1: string;
    label2: string;
    compat: ReturnType<typeof getCompatibility>;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!date1 || !date2) return;
    const maxDate = getTodayLocalYYYYMMDD();
    if (date1 > maxDate || date2 > maxDate) {
      setError("Doğum tarihleri bugün veya geçmiş bir tarih olmalıdır.");
      return;
    }
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
      label1: name1.trim() || sign1.nameTr,
      label2: name2.trim() || sign2.nameTr,
      compat: getCompatibility(sign1, sign2),
    });
  };

  return (
    <div className="bg-[#070B12] pb-28">
      <section className="relative overflow-hidden bg-[#070B12]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(91,63,255,0.06),transparent_60%)]" />
        <Container size="md">
          <div className="relative py-16 text-center">
            <Link href="/" className="mb-8 inline-block text-sm text-[#ffc552] hover:underline">
              ← Ana sayfa
            </Link>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#EDE9DF]">
              Burç Uyumluluğu
            </h1>
            <p className="mt-4 text-[#8494B2]">
              İki kişinin doğum tarihini gir, kozmik uyumunuzu keşfet.
            </p>
          </div>
        </Container>
      </section>

      <section className="mt-4">
        <Container size="sm">
          <form onSubmit={handleSubmit} className="rounded-2xl bg-[#0E1523] border border-white/[0.07] p-8 space-y-5">
            {error && (
              <p className="text-sm text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#8494B2]">1. Kişi</p>
                <input
                  type="text"
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  placeholder="Adı (isteğe bağlı)"
                  className="w-full rounded-xl border border-white/[0.10] bg-[#0C1220] px-4 py-3 text-[#EDE9DF] placeholder-white/25 focus:border-[#ffc552] focus:ring-1 focus:ring-[#ffc552]/20 outline-none"
                />
                <input
                  type="date"
                  value={date1}
                  onChange={(e) => setDate1(e.target.value)}
                  max={getTodayLocalYYYYMMDD()}
                  required
                  className="w-full rounded-xl border border-white/[0.10] bg-[#0C1220] px-4 py-3 text-[#EDE9DF] focus:border-[#ffc552] focus:ring-1 focus:ring-[#ffc552]/20 outline-none"
                />
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#8494B2]">2. Kişi</p>
                <input
                  type="text"
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  placeholder="Adı (isteğe bağlı)"
                  className="w-full rounded-xl border border-white/[0.10] bg-[#0C1220] px-4 py-3 text-[#EDE9DF] placeholder-white/25 focus:border-[#ffc552] focus:ring-1 focus:ring-[#ffc552]/20 outline-none"
                />
                <input
                  type="date"
                  value={date2}
                  onChange={(e) => setDate2(e.target.value)}
                  max={getTodayLocalYYYYMMDD()}
                  required
                  className="w-full rounded-xl border border-white/[0.10] bg-[#0C1220] px-4 py-3 text-[#EDE9DF] focus:border-[#ffc552] focus:ring-1 focus:ring-[#ffc552]/20 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#ffc552] px-6 py-3.5 font-medium text-white shadow-[0_0_20px_rgba(255,197,82,0.25)] transition-all hover:bg-[#ffd47a] active:scale-95"
            >
              ✦ Uyumu Hesapla
            </button>
          </form>
        </Container>
      </section>

      {result && (
        <section className="mt-12">
          <Container size="md">
            <div className="rounded-2xl bg-[#0E1523] border border-white/[0.07] overflow-hidden">

              {/* Üst — kimlik */}
              <div className="p-8 text-center border-b border-white/[0.07]">
                <div className="flex items-center justify-center gap-5 mb-3">
                  <div className="text-center">
                    <span className="block text-5xl">{result.sign1.symbol}</span>
                    <span className="mt-1 block text-sm font-medium text-[#EDE9DF]">{result.label1}</span>
                    <span className="block text-xs text-[#6B7A99]">{result.sign1.nameTr} · {ELEMENT_LABELS[result.sign1.element]}</span>
                  </div>
                  <span className="text-2xl text-[#ffc552]">♥</span>
                  <div className="text-center">
                    <span className="block text-5xl">{result.sign2.symbol}</span>
                    <span className="mt-1 block text-sm font-medium text-[#EDE9DF]">{result.label2}</span>
                    <span className="block text-xs text-[#6B7A99]">{result.sign2.nameTr} · {ELEMENT_LABELS[result.sign2.element]}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-6xl font-bold text-[#ffc552]">%{result.compat.score}</p>
                  <p className="mt-1 text-sm text-[#6B7A99]">Genel Uyum</p>
                  <div className="mt-3 mx-auto max-w-xs">
                    <ScoreBar value={result.compat.score} color={scoreColor(result.compat.score)} />
                  </div>
                </div>

                <p className="mt-6 text-[#C4C0BA] leading-relaxed text-sm max-w-md mx-auto">
                  {result.compat.description}
                </p>
              </div>

              {/* Kategori puanları */}
              <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.07]">
                {CATEGORY_META.map(({ key, label, icon }) => {
                  const val = result.compat.categories[key];
                  return (
                    <div key={key} className="p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#8494B2]">
                          {icon} {label}
                        </span>
                        <span className="text-sm font-bold text-[#EDE9DF]">%{val}</span>
                      </div>
                      <ScoreBar value={val} color={scoreColor(val)} />
                    </div>
                  );
                })}
              </div>

              {/* Güçlü yönler & zorluklar */}
              <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.07] border-t border-white/[0.07]">
                <div className="p-6 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Güçlü Yönler</p>
                  <ul className="space-y-2">
                    {result.compat.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#C4C0BA]">
                        <span className="mt-0.5 text-emerald-400 shrink-0">✓</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-rose-400">Dikkat Edilmesi Gerekenler</p>
                  <ul className="space-y-2">
                    {result.compat.challenges.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#C4C0BA]">
                        <span className="mt-0.5 text-rose-400 shrink-0">!</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
