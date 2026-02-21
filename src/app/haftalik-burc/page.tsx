import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { ZODIAC_SIGNS } from "@/data/zodiac";
import { getWeekRange, WEEKLY_CONTENT } from "@/data/weeklyHoroscope";
import { getAllWeeklyHoroscopes } from "@/lib/db/repositories/horoscope";
import type { ZodiacSign } from "@/data/zodiac";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

const ELEMENT_COLORS: Record<string, string> = {
  fire: "border-red-200 bg-red-50/30",
  earth: "border-emerald-200 bg-emerald-50/30",
  air: "border-violet-200 bg-violet-50/30",
  water: "border-blue-200 bg-blue-50/30",
};

const CATEGORY_LABELS: Record<string, string> = {
  health: "Sağlık",
  love: "Aşk",
  money: "Para",
  work: "İş",
};

function StarRating({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} yıldız`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={i <= value ? "text-amber-400" : "text-gray-200"}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export const metadata = {
  title: "Haftalık Burç Yorumu | Astroli",
  description:
    "Bu hafta 12 burç için sağlık, aşk, para ve iş alanlarında genel değerlendirme; olasılıklar ve farkındalık üzerine haftalık rehber.",
};

export default async function HaftalikBurcPage() {
  const { start, end } = getWeekRange(new Date());

  // Database'den bu haftanın yorumlarını çek, yoksa static data kullan
  const dbHoroscopes: Record<string, typeof WEEKLY_CONTENT.aries> = {};
  try {
    const weeklies = await getAllWeeklyHoroscopes(new Date());
    weeklies.forEach((h) => {
      // Database'den gelen değerleri kontrol et ve dönüştür
      // Prisma'dan gelen değerler number | null olabilir
      // Type assertion kullanarak Prisma tipini kullanıyoruz
      const horoscope = h as unknown as {
        zodiacId: string;
        health: number | null;
        love: number | null;
        money: number | null;
        work: number | null;
        summary: string | null;
        advice: string | null;
      };
      
      const health = horoscope.health != null ? horoscope.health : 3;
      const love = horoscope.love != null ? horoscope.love : 3;
      const money = horoscope.money != null ? horoscope.money : 3;
      const work = horoscope.work != null ? horoscope.work : 3;
      
      dbHoroscopes[horoscope.zodiacId.toLowerCase()] = {
        health,
        love,
        money,
        work,
        summary: horoscope.summary || "",
        advice: horoscope.advice || "",
      };
    });
  } catch {
    // Database hatası varsa static data kullanılacak
  }

  return (
    <div className="bg-[#F7F8FC] pb-28">
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(91,63,255,0.06),transparent_60%)]" />
        <Container size="lg">
          <div className="relative py-16 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-black">
              Haftalık Burç Yorumu
            </h1>
            <p className="mt-4 text-lg text-[#444]">
              Bu hafta burcunuz için sağlık, aşk, para ve iş alanlarında genel bir rehber. Olasılıklar ve farkındalık üzerine yorumlar.
            </p>
            <p className="mt-3 text-sm font-medium text-[#5B3FFF]">
              {format(start, "d MMMM", { locale: tr })} – {format(end, "d MMMM yyyy", { locale: tr })}
            </p>
          </div>
        </Container>
      </section>

      <section className="mt-12">
        <Container size="lg">
          <div className="space-y-10">
            {ZODIAC_SIGNS.map((sign) => {
              // Önce database'den, yoksa static data'dan
              const content = dbHoroscopes[sign.id] || WEEKLY_CONTENT[sign.id as ZodiacSign];
              const colorClass = ELEMENT_COLORS[sign.element] ?? "border-gray-200 bg-gray-50/30";
              return (
                <article
                  key={sign.id}
                  className={`rounded-2xl border p-6 sm:p-8 bg-white ${colorClass}`}
                >
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <Link href={`/burc/${sign.id}`} className="flex items-center gap-3">
                      <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-[#1A1C2B] flex-shrink-0">
                        <Image
                          src={sign.image}
                          alt={sign.nameTr}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-black">{sign.nameTr}</h2>
                        <p className="text-sm text-gray-500">{sign.dates}</p>
                      </div>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {(["health", "love", "money", "work"] as const).map((key) => (
                      <div key={key} className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {CATEGORY_LABELS[key]}
                        </span>
                        <StarRating value={content[key]} />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Genel değerlendirme</h3>
                      <p className="text-gray-700 leading-relaxed">{content.summary}</p>
                    </div>
                    <div className="rounded-xl bg-white/80 p-4 border border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Tavsiye</h3>
                      <p className="text-gray-700 leading-relaxed">{content.advice}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>
    </div>
  );
}
