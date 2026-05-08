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

const ELEMENT_STYLE: Record<string, { border: string; label: string; dot: string }> = {
  fire:  { border: "border-orange-500/30", label: "text-orange-400", dot: "bg-orange-400" },
  earth: { border: "border-emerald-500/30", label: "text-emerald-400", dot: "bg-emerald-400" },
  air:   { border: "border-sky-500/30",    label: "text-sky-400",    dot: "bg-sky-400"    },
  water: { border: "border-indigo-500/30", label: "text-indigo-400", dot: "bg-indigo-400" },
};

const ELEMENT_LABELS: Record<string, string> = {
  fire: "Ateş", earth: "Toprak", air: "Hava", water: "Su",
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
    fire:  ZODIAC_SIGNS.filter((z) => z.element === "fire"),
    earth: ZODIAC_SIGNS.filter((z) => z.element === "earth"),
    air:   ZODIAC_SIGNS.filter((z) => z.element === "air"),
    water: ZODIAC_SIGNS.filter((z) => z.element === "water"),
  };

  const adviceItems = data?.advice
    ? data.advice.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
    : [];

  const overviewByElement = data
    ? {
        fire:  data.overviewFire,
        earth: data.overviewEarth,
        air:   data.overviewAir,
        water: data.overviewWater,
      }
    : null;

  return (
    <div className="bg-[#070B12] min-h-screen">
      <ArticleScrollProgress />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#070B12] border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(91,63,255,0.07),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-6 pt-24 pb-14">
          <Link href="/dergi" className="inline-flex items-center gap-1.5 text-sm text-[#C4C0BA] hover:text-[#EDE9DF] transition mb-8">
            <span aria-hidden>←</span> Dergi
          </Link>
          <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-[#A78BFA] mb-3">
            Kozmik Enerji
          </span>
          <h1 className="text-4xl font-bold text-[#EDE9DF] sm:text-5xl leading-tight">
            Haftalık Kozmik Enerji
          </h1>
          <p className="mt-4 text-lg text-[#C4C0BA] leading-relaxed max-w-2xl">
            Bu haftanın astrolojik enerjisi ve gezegen hareketlerinin burçlar üzerindeki genel etkileri.
          </p>
          <p className="mt-3 text-sm font-medium text-[#A78BFA]">
            {format(start, "d MMMM", { locale: tr })} – {format(end, "d MMMM yyyy", { locale: tr })}
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-6 pb-28 pt-10">
        <Suspense fallback={null}>
          <CosmicEnergyToolbar
            currentWeekStart={currentWeekStart}
            availableWeeks={availableWeeks}
            thisWeekStart={thisWeek}
          />
        </Suspense>

        {!data ? (
          <div className="mt-8 rounded-2xl border border-white/[0.07] bg-[#0E1523] p-12 text-center">
            <p className="text-lg text-[#C4C0BA]">
              Bu hafta için kozmik enerji içeriği henüz eklenmedi.
            </p>
            <p className="mt-2 text-sm text-[#7A8090]">
              Arşivden yayınlanmış bir hafta seçebilir veya daha sonra tekrar bakabilirsiniz.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-12">
            {isArchive && (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/8 p-4 text-center">
                <p className="text-[#C4C0BA]">Bu içerik geçmiş bir haftaya aittir.</p>
                <p className="mt-1 text-sm text-[#C4C0BA]">
                  Güncel içerik için{" "}
                  <Link href="/dergi/haftalik-burc-enerjisi" className="font-semibold text-[#A78BFA] underline hover:no-underline">
                    buraya tıklayın
                  </Link>
                  .
                </p>
              </div>
            )}

            {/* Kapak görseli */}
            <div className="overflow-hidden rounded-2xl border border-white/[0.07]">
              <div className="relative aspect-[16/9] w-full bg-[#0C1220]">
                <Image
                  src="/kozmik.png"
                  alt="Haftalık Kozmik Enerji"
                  fill
                  className="object-cover opacity-90"
                  sizes="(max-width: 896px) 100vw, 896px"
                />
              </div>
            </div>

            {/* Genel enerji */}
            <section className="rounded-2xl border border-white/[0.07] bg-[#0E1523] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A78BFA] mb-2">
                Genel bakış
              </p>
              <h2 className="text-xl font-bold text-[#EDE9DF] mb-5 sm:text-2xl">
                Bu Haftanın Genel Enerjisi
              </h2>
              <div className="space-y-4">
                {data.generalEnergy.split(/\n\n+/).map((p, i) => (
                  <p key={i} className="text-[#C4C0BA] leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </section>

            {/* Element enerjileri */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A78BFA] mb-2">
                Element bazlı
              </p>
              <h2 className="text-xl font-bold text-[#EDE9DF] mb-5 sm:text-2xl">
                Element Enerjileri
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                {(["fire", "earth", "air", "water"] as const).map((element) => {
                  const signs = byElement[element];
                  const style = ELEMENT_STYLE[element];
                  const text =
                    element === "fire"  ? data.elementFire  :
                    element === "earth" ? data.elementEarth :
                    element === "air"   ? data.elementAir   : data.elementWater;
                  return (
                    <div key={element} className={`rounded-2xl border bg-[#0E1523] p-6 ${style.border}`}>
                      <div className="flex items-center gap-2.5 mb-4">
                        <span className={`h-2 w-2 rounded-full flex-shrink-0 ${style.dot}`} />
                        <h3 className={`text-base font-semibold ${style.label}`}>
                          {ELEMENT_LABELS[element]} Elementi
                        </h3>
                      </div>
                      <p className="text-[#C4C0BA] text-sm leading-relaxed mb-4">{text || "—"}</p>
                      <div className="flex flex-wrap gap-2 border-t border-white/[0.05] pt-3">
                        {signs.map((sign) => (
                          <Link
                            key={sign.id}
                            href={`/burc/${sign.id}`}
                            className="text-xs text-[#7A8090] hover:text-[#EDE9DF] transition"
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

            {/* Gezegen hareketleri */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A78BFA] mb-2">
                Gezegen hareketleri
              </p>
              <h2 className="text-xl font-bold text-[#EDE9DF] mb-5 sm:text-2xl">
                Gezegen Etkileri
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Merkür", text: data.planetMercury },
                  { label: "Venüs",  text: data.planetVenus  },
                  { label: "Mars",   text: data.planetMars   },
                ].map(({ label, text }) => (
                  <div key={label} className="rounded-2xl border border-white/[0.07] bg-[#0E1523] p-5">
                    <h3 className="text-sm font-semibold text-[#EDE9DF] mb-2">{label}</h3>
                    <p className="text-[#C4C0BA] leading-relaxed text-sm">{text || "—"}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Tavsiyeler */}
            {adviceItems.length > 0 && (
              <section className="rounded-2xl border border-[#5C44D0]/25 bg-[#5C44D0]/8 p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A78BFA] mb-2">
                  Haftalık notlar
                </p>
                <h2 className="text-xl font-bold text-[#EDE9DF] mb-5 sm:text-2xl">
                  Bu Hafta İçin Genel Tavsiyeler
                </h2>
                <ul className="space-y-3">
                  {adviceItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-[5px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#A78BFA]" />
                      <span className="text-[#C4C0BA] leading-relaxed text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Element bazlı genel bakış */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A78BFA] mb-2">
                Burçlara göre
              </p>
              <h2 className="text-xl font-bold text-[#EDE9DF] mb-5 sm:text-2xl">
                Element Bazlı Genel Bakış
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                {ELEMENT_KEYS.map((elementKey) => {
                  const style = ELEMENT_STYLE[elementKey];
                  const overview = overviewByElement?.[elementKey] ?? "";
                  const label = ELEMENT_LABELS[elementKey];
                  const signNames = ELEMENT_SIGN_NAMES[elementKey];
                  return (
                    <div key={elementKey} className={`rounded-2xl border bg-[#0E1523] p-5 ${style.border}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
                        <h3 className={`text-sm font-semibold ${style.label}`}>{label}</h3>
                      </div>
                      <p className="text-xs text-[#7A8090] mb-3">{signNames}</p>
                      <p className="text-[#C4C0BA] leading-relaxed text-sm whitespace-pre-line">
                        {overview || "—"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        <div className="mt-12">
          <ArticleShare
            title="Haftalık Kozmik Enerji"
            slug="haftalik-burc-enerjisi"
            baseUrl={baseUrl}
          />
        </div>

        <div className="mt-12 pt-10 border-t border-white/[0.07]">
          <h3 className="text-base font-semibold text-[#EDE9DF] mb-4">İlgili Sayfalar</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/haftalik-burc"
              className="rounded-2xl border border-white/[0.08] bg-[#0E1523] p-5 hover:border-[#5C44D0]/40 transition group"
            >
              <h4 className="font-semibold text-[#EDE9DF] group-hover:text-[#A78BFA] transition-colors">Haftalık Burç Yorumu</h4>
              <p className="mt-1 text-sm text-[#7A8090]">
                Her burç için detaylı haftalık yorumlar ve yıldız değerlendirmeleri
              </p>
            </Link>
            <Link
              href="/gunluk-burc"
              className="rounded-2xl border border-white/[0.08] bg-[#0E1523] p-5 hover:border-[#5C44D0]/40 transition group"
            >
              <h4 className="font-semibold text-[#EDE9DF] group-hover:text-[#A78BFA] transition-colors">Günlük Burç Yorumları</h4>
              <p className="mt-1 text-sm text-[#7A8090]">
                Bugün burcunuz için genel rehber ve farkındalık notları
              </p>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
