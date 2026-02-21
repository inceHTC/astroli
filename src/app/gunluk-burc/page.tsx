import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { ZODIAC_SIGNS } from "@/data/zodiac";
import { getAllDailyHoroscopes, getDailyHoroscopeAvailableDates } from "@/lib/db/repositories/horoscope";
import { DailyHoroscopeToolbar } from "@/components/horoscope/DailyHoroscopeToolbar";
import { Suspense } from "react";

const ELEMENT_COLORS: Record<string, string> = {
  fire: "border-red-200 bg-red-50/50",
  earth: "border-emerald-200 bg-emerald-50/50",
  air: "border-violet-200 bg-violet-50/50",
  water: "border-blue-200 bg-blue-50/50",
};

function todayStr(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function parseDateParam(tarih: string | null): string {
  if (!tarih || !/^\d{4}-\d{2}-\d{2}$/.test(tarih)) return todayStr();
  return tarih;
}

export const metadata = {
  title: "Günlük Burç Yorumları | Astroli",
  description:
    "12 burcun günlük yorumları. Bugün burcunuz ne söylüyor? Genel rehber niteliğinde günlük burç değerlendirmeleri.",
};

type SearchParams = Record<string, string | string[] | undefined>;
type PageProps = { searchParams?: Promise<SearchParams> };

export default async function GunlukBurcPage(props: PageProps) {
  const searchParams: SearchParams = await (props.searchParams ?? Promise.resolve({} as SearchParams));
  const tarih = typeof searchParams.tarih === "string" ? searchParams.tarih : null;
  const currentDate = parseDateParam(tarih);

  const [dailies, availableDates] = await Promise.all([
    getAllDailyHoroscopes(currentDate),
    getDailyHoroscopeAvailableDates(60),
  ]);

  const dbHoroscopes: Record<string, string> = {};
  dailies.forEach((h: { zodiacId: string; text: string }) => {
    dbHoroscopes[h.zodiacId.toLowerCase()] = h.text;
  });

  const hasContent = dailies.length > 0;
  const today = todayStr();

  return (
    <div className="bg-[#F7F8FC] pb-28">
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(91,63,255,0.06),transparent_60%)]" />
        <Container size="lg">
          <div className="relative py-16 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-black">
              Günlük Burç Yorumları
            </h1>
            <p className="mt-4 text-lg text-[#444]">
              Burcunuz için o güne ait yorum. Geçmiş günleri arşivden seçebilirsiniz.
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
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-center">
              <p className="text-gray-700">Bu yorum geçmiş tarihlidir.</p>
              <p className="mt-1 text-sm text-gray-600">
                Güncel yorum için{" "}
                <Link href="/gunluk-burc" className="font-semibold text-[#5B3FFF] underline hover:no-underline">
                  buraya tıklayın
                </Link>
                .
              </p>
            </div>
          )}
          {!hasContent ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-lg text-gray-600">
                Bu tarih için günlük yorum henüz yayınlanmadı.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Arşivden yayınlanmış bir tarih seçebilir veya daha sonra tekrar bakabilirsiniz.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ZODIAC_SIGNS.map((sign) => {
                const text = dbHoroscopes[sign.id] ?? "";
                const colorClass = ELEMENT_COLORS[sign.element] ?? "border-gray-200 bg-gray-50/50";
                return (
                  <div
                    key={sign.id}
                    className={`rounded-2xl border p-6 bg-white ${colorClass}`}
                  >
                    <Link href={`/burc/${sign.id}`} className="flex items-center gap-4 mb-4">
                      <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-[#1A1C2B] flex-shrink-0">
                        <Image
                          src={sign.image}
                          alt={sign.nameTr}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-black">{sign.nameTr}</h2>
                        <p className="text-sm text-gray-500">{sign.dates}</p>
                      </div>
                    </Link>
                    <p className="text-gray-700 leading-relaxed text-sm">
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
