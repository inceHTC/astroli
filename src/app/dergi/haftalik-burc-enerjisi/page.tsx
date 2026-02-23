import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { Suspense } from "react";
import { Container } from "@/components/layout/Container";
import { ArticleScrollProgress } from "@/components/article/ArticleScrollProgress";
import { ArticleShare } from "@/components/article/ArticleShare";
import { ZODIAC_SIGNS } from "@/data/zodiac";
import { getWeekRange } from "@/data/weeklyHoroscope";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  getCosmicEnergyForWeek,
  getCosmicEnergyAvailableWeeks,
} from "@/lib/db/repositories/cosmicEnergy";
import { CosmicEnergyToolbar } from "@/components/horoscope/CosmicEnergyToolbar";

const ELEMENT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  fire: { bg: "bg-red-50/50", border: "border-red-200", text: "text-red-700" },
  earth: { bg: "bg-emerald-50/50", border: "border-emerald-200", text: "text-emerald-700" },
  air: { bg: "bg-violet-50/50", border: "border-violet-200", text: "text-violet-700" },
  water: { bg: "bg-blue-50/50", border: "border-blue-200", text: "text-blue-700" },
};

const ELEMENT_LABELS: Record<string, string> = {
  fire: "Ateş",
  earth: "Toprak",
  air: "Hava",
  water: "Su",
};

const ELEMENT_SIGN_NAMES: Record<string, string> = {
  fire: "Koç, Aslan, Yay",
  earth: "Boğa, Başak, Oğlak",
  air: "İkizler, Terazi, Kova",
  water: "Yengeç, Akrep, Balık",
};

const ELEMENT_KEYS = ["fire", "earth", "air", "water"] as const;

function thisWeekStart(): string {
  const { start } = getWeekRange(new Date());
  return format(start, "yyyy-MM-dd");
}

function parseWeekParam(hafta: string | null): string {
  if (!hafta || !/^\d{4}-\d{2}-\d{2}$/.test(hafta)) return thisWeekStart();
  return hafta;
}

export const metadata = {
  title: "Haftalık Kozmik Enerji | Astroli Dergi",
  description:
    "Bu haftanın astrolojik enerjisi, gezegen hareketleri ve burçlar üzerindeki genel etkiler. Kozmik enerji rehberi.",
};

type SearchParams = Record<string, string | string[] | undefined>;
type PageProps = { searchParams?: Promise<SearchParams> };

export default async function HaftalikKozmikEnerjiPage(props: PageProps) {
  const searchParams: SearchParams = await (props.searchParams ?? Promise.resolve({} as SearchParams));
  const hafta = typeof searchParams.hafta === "string" ? searchParams.hafta : null;
  const currentWeekStart = parseWeekParam(hafta);
  const weekDate = new Date(currentWeekStart + "T12:00:00");

  const [data, availableWeeks] = await Promise.all([
    getCosmicEnergyForWeek(weekDate),
    getCosmicEnergyAvailableWeeks(52),
  ]);

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;

  const { start, end } = getWeekRange(weekDate);
  const thisWeek = thisWeekStart();
  const isArchive = currentWeekStart !== thisWeek;

  const byElement = {
    fire: ZODIAC_SIGNS.filter((z) => z.element === "fire"),
    earth: ZODIAC_SIGNS.filter((z) => z.element === "earth"),
    air: ZODIAC_SIGNS.filter((z) => z.element === "air"),
    water: ZODIAC_SIGNS.filter((z) => z.element === "water"),
  };

  const adviceItems = data?.advice
    ? data.advice
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const overviewByElement = data
    ? {
        fire: data.overviewFire,
        earth: data.overviewEarth,
        air: data.overviewAir,
        water: data.overviewWater,
      }
    : null;

  return (
    <div className="bg-white text-black relative">
      <ArticleScrollProgress />
      <article className="editorial-article mx-auto max-w-4xl px-6 py-28">
        <Link
          href="/dergi"
          className="text-sm text-black/40 transition hover:text-black"
        >
          ← Dergi
        </Link>

        <header className="mt-10 mb-12">
          <div className="meta flex flex-wrap items-center gap-3 text-sm text-black/60">
            <span className="uppercase tracking-wider text-[#5B3FFF]">
              Kozmik Enerji
            </span>
            <time dateTime={start.toISOString()}>
              {format(start, "d MMMM", { locale: tr })} – {format(end, "d MMMM yyyy", { locale: tr })}
            </time>
          </div>
          <h1 className="editorial-title mt-3 font-serif text-4xl leading-[1.15] tracking-tight font-semibold text-black md:text-5xl">
            Haftalık Kozmik Enerji
          </h1>
          <p className="mt-4 text-lg text-black/70 leading-relaxed">
            Bu haftanın astrolojik enerjisi ve gezegen hareketlerinin burçlar üzerindeki genel etkileri.
            Kozmik enerji rehberi ve element dengeleri.
          </p>
        </header>

        <Suspense fallback={null}>
          <CosmicEnergyToolbar
            currentWeekStart={currentWeekStart}
            availableWeeks={availableWeeks}
            thisWeekStart={thisWeek}
          />
        </Suspense>

        {!data ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-12 text-center">
            <p className="text-lg text-gray-600">
              Bu hafta için kozmik enerji içeriği henüz eklenmedi.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Arşivden yayınlanmış bir hafta seçebilir veya daha sonra tekrar bakabilirsiniz.
            </p>
          </div>
        ) : (
          <>
            {isArchive && (
              <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-center">
                <p className="text-gray-700">Bu içerik geçmiş bir haftaya aittir.</p>
                <p className="mt-1 text-sm text-gray-600">
                  Güncel içerik için{" "}
                  <Link
                    href="/dergi/haftalik-burc-enerjisi"
                    className="font-semibold text-[#5B3FFF] underline hover:no-underline"
                  >
                    buraya tıklayın
                  </Link>
                  .
                </p>
              </div>
            )}

            {/* Kapak görseli */}
            <div className="editorial-cover mb-14 overflow-hidden rounded-2xl bg-gradient-to-br from-[#5B3FFF]/10 via-purple-50 to-blue-50">
              <div className="relative aspect-[16/9] w-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/kozmik.png"
                    alt="Haftalık Kozmik Enerji"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
              </div>
            </div>

            <div className="editorial-body space-y-12">
              <section>
                <h2 className="editorial-h2 font-serif text-2xl font-semibold text-black mb-4">
                  Bu Haftanın Genel Enerjisi
                </h2>
                <div className="prose prose-lg max-w-none">
                  {data.generalEnergy.split(/\n\n+/).map((p, i) => (
                    <p key={i} className="text-black/80 leading-relaxed mt-4 first:mt-0">
                      {p}
                    </p>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="editorial-h2 font-serif text-2xl font-semibold text-black mb-6">
                  Element Enerjileri
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {(["fire", "earth", "air", "water"] as const).map((element) => {
                    const signs = byElement[element];
                    const colors = ELEMENT_COLORS[element];
                    const text =
                      element === "fire"
                        ? data.elementFire
                        : element === "earth"
                          ? data.elementEarth
                          : element === "air"
                            ? data.elementAir
                            : data.elementWater;
                    return (
                      <div
                        key={element}
                        className={`rounded-xl border p-6 ${colors.bg} ${colors.border}`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <h3 className={`text-xl font-semibold ${colors.text}`}>
                            {ELEMENT_LABELS[element]} Elementi
                          </h3>
                        </div>
                        <p className="text-black/70 text-sm leading-relaxed mb-4">
                          {text || "—"}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {signs.map((sign) => (
                            <Link
                              key={sign.id}
                              href={`/burc/${sign.id}`}
                              className="text-sm text-black/60 hover:text-black transition"
                            >
                              {sign.nameTr}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section>
                <h2 className="editorial-h2 font-serif text-2xl font-semibold text-black mb-6">
                  Gezegen Hareketleri ve Etkileri
                </h2>
                <div className="space-y-6">
                  <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-black mb-2">Merkür</h3>
                    <p className="text-black/70 leading-relaxed text-sm">
                      {data.planetMercury || "—"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-black mb-2">Venüs</h3>
                    <p className="text-black/70 leading-relaxed text-sm">
                      {data.planetVenus || "—"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-black mb-2">Mars</h3>
                    <p className="text-black/70 leading-relaxed text-sm">
                      {data.planetMars || "—"}
                    </p>
                  </div>
                </div>
              </section>

              {adviceItems.length > 0 && (
                <section className="rounded-xl bg-gradient-to-br from-[#5B3FFF]/5 to-purple-50/50 border border-[#5B3FFF]/20 p-8">
                  <h2 className="editorial-h2 font-serif text-2xl font-semibold text-black mb-4">
                    Bu Hafta İçin Genel Tavsiyeler
                  </h2>
                  <ul className="space-y-3 text-black/80">
                    {adviceItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-[#5B3FFF] mt-1">✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section>
                <h2 className="editorial-h2 font-serif text-2xl font-semibold text-black mb-6">
                  Burçlara Göre Genel Bakış (element bazlı)
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {ELEMENT_KEYS.map((elementKey) => {
                    const colors = ELEMENT_COLORS[elementKey];
                    const overview = overviewByElement?.[elementKey] ?? "";
                    const label = ELEMENT_LABELS[elementKey];
                    const signNames = ELEMENT_SIGN_NAMES[elementKey];
                    return (
                      <div
                        key={elementKey}
                        className={`rounded-xl border p-6 ${colors.bg} ${colors.border}`}
                      >
                        <h3 className="font-semibold text-black mb-1">
                          {label} ({signNames})
                        </h3>
                        <p className="text-black/80 leading-relaxed whitespace-pre-line">
                          {overview || "—"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </>
        )}

        <div className="mt-12">
          <ArticleShare
            title="Haftalık Kozmik Enerji"
            slug="haftalik-burc-enerjisi"
            baseUrl={baseUrl}
          />
        </div>

        <div className="mt-12 pt-12 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-black mb-4">İlgili Sayfalar</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/haftalik-burc"
              className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition"
            >
              <h4 className="font-semibold text-black">Haftalık Burç Yorumu</h4>
              <p className="mt-1 text-sm text-gray-500">
                Her burç için detaylı haftalık yorumlar ve yıldız değerlendirmeleri
              </p>
            </Link>
            <Link
              href="/gunluk-burc"
              className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition"
            >
              <h4 className="font-semibold text-black">Günlük Burç Yorumları</h4>
              <p className="mt-1 text-sm text-gray-500">
                Bugün burcunuz için genel rehber ve farkındalık notları
              </p>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
