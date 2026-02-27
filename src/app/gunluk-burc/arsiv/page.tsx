import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { getDailyHoroscopeAvailableDates } from "@/lib/db/repositories/horoscope";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

const DATE_FMT = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const metadata = {
  title: "Günlük Burç Arşivi | Astroli",
  description:
    "Geçmiş günlere ait günlük burç yorumları arşivi. İstediğiniz tarihi seçerek o günün burç yorumlarını görüntüleyin.",
};

function groupByYearMonth(dates: string[]) {
  const map = new Map<
    number,
    Map<
      number,
      {
        key: string;
        dates: string[];
      }
    >
  >();

  dates.forEach((dateStr) => {
    const d = new Date(dateStr + "T12:00:00");
    const year = d.getFullYear();
    const month = d.getMonth(); // 0-11

    if (!map.has(year)) {
      map.set(year, new Map());
    }
    const monthMap = map.get(year)!;
    if (!monthMap.has(month)) {
      monthMap.set(month, {
        key: `${year}-${month + 1}`,
        dates: [],
      });
    }
    monthMap.get(month)!.dates.push(dateStr);
  });

  return map;
}

export default async function GunlukBurcArsivPage() {
  const availableDates = await getDailyHoroscopeAvailableDates(365);
  const grouped = groupByYearMonth(availableDates);

  return (
    <div className="bg-[#F7F8FC] pb-24">
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(91,63,255,0.06),transparent_60%)]" />
        <Container size="lg">
          <div className="relative py-14 text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-black">
              Günlük Burç Arşivi
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#444]">
              Geçmiş günlere ait günlük burç yorumlarını buradan seçebilirsiniz.
            </p>
            <p className="mt-2 text-sm text-[#666]">
              Bir tarihi tıkladığınızda, ilgili günün yorumları ana günlük burç
              sayfasında açılır.
            </p>
          </div>
        </Container>
      </section>

      <section className="mt-8">
        <Container size="lg">
          {availableDates.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <p className="text-gray-600">
                Henüz arşivde gösterilecek bir günlük burç kaydı bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Array.from(grouped.entries())
                .sort(([a], [b]) => b - a)
                .map(([year, months]) => (
                  <div key={year} className="space-y-4">
                    <h2 className="text-xl font-semibold text-black">{year}</h2>
                    <div className="space-y-3">
                      {Array.from(months.entries())
                        .sort(([a], [b]) => b - a)
                        .map(([month, { dates }]) => {
                          const sample = new Date(
                            dates[0] + "T12:00:00"
                          );
                          const monthLabel = format(sample, "MMMM", {
                            locale: tr,
                          });
                          return (
                            <div key={month} className="rounded-2xl border border-gray-100 bg-white p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-gray-800">
                                  {monthLabel}
                                </h3>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {dates.map((d) => (
                                  <Link
                                    key={d}
                                    href={`/gunluk-burc?tarih=${d}`}
                                    className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-200"
                                  >
                                    {DATE_FMT.format(
                                      new Date(d + "T12:00:00")
                                    )}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

