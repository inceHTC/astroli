import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { ZODIAC_SIGNS } from "@/data/zodiac";
import { DAILY_TEXTS } from "@/data/dailyHoroscope";
import { getAllDailyHoroscopes } from "@/lib/db/repositories/horoscope";
import type { ZodiacSign } from "@/data/zodiac";

const ELEMENT_COLORS: Record<string, string> = {
  fire: "border-red-200 bg-red-50/50",
  earth: "border-emerald-200 bg-emerald-50/50",
  air: "border-violet-200 bg-violet-50/50",
  water: "border-blue-200 bg-blue-50/50",
};

export const metadata = {
  title: "Günlük Burç Yorumları | Astroli",
  description:
    "12 burcun günlük yorumları. Bugün burcunuz ne söylüyor? Genel rehber niteliğinde günlük burç değerlendirmeleri.",
};

export default async function GunlukBurcPage() {
  // Database'den bugünün yorumlarını çek, yoksa static data kullan
  const dbHoroscopes: Record<string, string> = {};
  try {
    const dailies = await getAllDailyHoroscopes(new Date());
    dailies.forEach((h: { zodiacId: string; text: string }) => {
      dbHoroscopes[h.zodiacId.toLowerCase()] = h.text;
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
              Günlük Burç Yorumları
            </h1>
            <p className="mt-4 text-lg text-[#444]">
              Bugün burcunuz için genel bir rehber. Olasılıklar ve farkındalık üzerine yorumlar.
            </p>
          </div>
        </Container>
      </section>

      <section className="mt-12">
        <Container size="lg">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ZODIAC_SIGNS.map((sign) => {
              // Önce database'den, yoksa static data'dan
              const text = dbHoroscopes[sign.id] || DAILY_TEXTS[sign.id as ZodiacSign];
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
                    {text}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </div>
  );
}
