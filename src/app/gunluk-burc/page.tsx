import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { ZODIAC_SIGNS, ELEMENT_CARD_CLASSES } from "@/data/zodiac";
import type { Element } from "@/data/zodiac";
import { getAllDailyHoroscopes, getDailyHoroscopeAvailableDates } from "@/lib/db/repositories/horoscope";
import { DailyHoroscopeToolbar } from "@/components/horoscope/DailyHoroscopeToolbar";
import { Suspense } from "react";
import { getBaseUrl } from "@/lib/site-url";

function todayStr(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Istanbul" });
}

function parseDateParam(tarih: string | null): string {
  const today = todayStr();
  if (!tarih || !/^\d{4}-\d{2}-\d{2}$/.test(tarih)) return today;
  return tarih > today ? today : tarih;
}

export const metadata: Metadata = {
  title: "Günlük Burç Yorumları | Astroli",
  description:
    "12 burcun günlük yorumları. Bugün burcunuz ne söylüyor? Genel rehber niteliğinde günlük burç değerlendirmeleri.",
  alternates: { canonical: `${getBaseUrl()}/gunluk-burc` },
};

type SearchParams = Record<string, string | string[] | undefined>;
type PageProps = { searchParams?: Promise<SearchParams> | SearchParams };

export default async function GunlukBurcPage(props: PageProps) {
  let searchParams: SearchParams = {};
  try {
    const raw = props?.searchParams;
    searchParams = raw instanceof Promise ? await raw : (raw ?? {});
  } catch {
    searchParams = {};
  }
  const tarih = typeof searchParams?.tarih === "string" ? searchParams.tarih : null;
  const currentDate = parseDateParam(tarih);

  const weekDate = new Date(currentDate + "T12:00:00");
  let dailies: { zodiacId: string; text: string }[] = [];
  let availableDates: string[] = [];
  try {
    const [d, a] = await Promise.all([
      getAllDailyHoroscopes(weekDate),
      getDailyHoroscopeAvailableDates(60),
    ]);
    dailies = Array.isArray(d) ? d : [];
    availableDates = Array.isArray(a) ? a : [];
  } catch {
    dailies = [];
    availableDates = [];
  }

  const dbHoroscopes: Record<string, string> = {};
  dailies.forEach((h: { zodiacId: string; text: string }) => {
    dbHoroscopes[h.zodiacId.toLowerCase()] = h.text;
  });

  const hasContent = dailies.length > 0;
  const today = todayStr();

  return (
    <div className="bg-[#070B12] pb-28">
      <section className="relative overflow-hidden bg-[#070B12]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(91,63,255,0.06),transparent_60%)]" />
        <Container size="lg">
          <div className="pt-8">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[#EDE9DF]" style={{ color: "var(--text-4)" }}>
              ← Ana Sayfa
            </Link>
          </div>
          <div className="relative py-16 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#EDE9DF]">
              Günlük Burç Yorumları
            </h1>
            <p className="mt-4 text-lg text-[#C4C0BA]">
              Geçmiş günleri arşivden seçebilirsiniz.
            </p>
          </div>
        </Container>
      </section>

      <section className="mt-8">
        <Container size="lg">
          <Suspense fallback={null}>
            <DailyHoroscopeToolbar
              currentDate={currentDate}
              availableDates={availableDates}
              todayStr={today}
            />
          </Suspense>
        </Container>
      </section>

      <section className="mt-12">
        <Container size="lg">
          {hasContent && currentDate !== today && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-900/20 p-4 text-center">
              <p className="text-[#C4C0BA]">Bu yorum geçmiş tarihlidir.</p>
              <p className="mt-1 text-sm text-[#C4C0BA]">
                Güncel yorum için{" "}
                <Link href="/gunluk-burc" className="font-semibold text-[#5C44D0] underline hover:no-underline">
                  buraya tıklayın
                </Link>
                .
              </p>
            </div>
          )}
          {!hasContent ? (
            <div className="rounded-2xl border border-black/[0.07] bg-[#F9F5EF] p-12 text-center">
              <p className="text-lg text-[#6E6660]">
                Bu tarih için günlük yorum henüz yayınlanmadı.
              </p>
              <p className="mt-2 text-sm text-[#A09890]">
                Arşivden yayınlanmış bir tarih seçebilir veya daha sonra tekrar bakabilirsiniz.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ZODIAC_SIGNS.map((sign) => {
                const text = dbHoroscopes[sign.id] ?? "";
                const el = ELEMENT_CARD_CLASSES[sign.element as Element];
                return (
                  <div
                    key={sign.id}
                    className={`rounded-2xl border bg-[#F9F5EF] p-6 ${el.border}`}
                  >
                    <Link href={`/burc/${sign.id}`} className="flex items-center gap-4 mb-4 group">
                      <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-[#EDE8DF] flex-shrink-0">
                        <Image
                          src={sign.image}
                          alt={sign.nameTr}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-[#1A1714] group-hover:text-[#5C44D0] transition-colors">{sign.nameTr}</h2>
                        <p className="text-xs text-[#6E6660]">{sign.dates}</p>
                      </div>
                    </Link>
                    <p className="text-[#44403C] leading-relaxed text-sm whitespace-pre-line">
                      {text || "—"}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
