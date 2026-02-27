import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { getWeeklyHoroscopeAvailableWeeks } from "@/lib/db/repositories/horoscope";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { getWeekRange } from "@/data/weeklyHoroscope";

const DATE_FMT = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const metadata = {
  title: "Haftalık Burç Arşivi | Astroli",
  description:
    "Geçmiş haftalara ait haftalık burç yorumları arşivi. İstediğiniz haftayı seçerek o dönemin burç yorumlarını görüntüleyin.",
};

function formatWeekRangeLabel(weekStartStr: string): string {
  const start = new Date(weekStartStr + "T12:00:00");
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return `${DATE_FMT.format(start)} – ${DATE_FMT.format(end)}`;
}

export default async function HaftalikBurcArsivPage() {
  const availableWeeks = await getWeeklyHoroscopeAvailableWeeks(104);

  const grouped = new Map<
    number,
    {
      weekStart: string;
      label: string;
    }[]
  >();

  availableWeeks.forEach((weekStart) => {
    const d = new Date(weekStart + "T12:00:00");
    const year = d.getFullYear();
    if (!grouped.has(year)) {
      grouped.set(year, []);
    }
    grouped.get(year)!.push({
      weekStart,
      label: formatWeekRangeLabel(weekStart),
    });
  });

  return (
    <div className="bg-[#F7F8FC] pb-24">
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(91,63,255,0.06),transparent_60%)]" />
        <Container size="lg">
          <div className="relative py-14 text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-black">
              Haftalık Burç Arşivi
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#444]">
              Geçmiş haftalara ait haftalık burç yorumlarını buradan
              seçebilirsiniz.
            </p>
            <p className="mt-2 text-sm text-[#666]">
              Bir haftayı tıkladığınızda, ilgili haftanın yorumları ana
              haftalık burç sayfasında açılır.
            </p>
          </div>
        </Container>
      </section>

      <section className="mt-8">
        <Container size="lg">
          {availableWeeks.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <p className="text-gray-600">
                Henüz arşivde gösterilecek bir haftalık burç kaydı bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Array.from(grouped.entries())
                .sort(([a], [b]) => b - a)
                .map(([year, weeks]) => (
                  <div key={year} className="space-y-3">
                    <h2 className="text-xl font-semibold text-black">
                      {year}
                    </h2>
                    <div className="rounded-2xl border border-gray-100 bg-white p-4">
                      <div className="flex flex-wrap gap-2">
                        {weeks.map(({ weekStart, label }) => (
                          <Link
                            key={weekStart}
                            href={`/haftalik-burc?hafta=${weekStart}`}
                            className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-200"
                          >
                            {label}
                          </Link>
                        ))}
                      </div>
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

