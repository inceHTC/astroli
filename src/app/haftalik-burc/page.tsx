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

const CATEGORY_ORDER: { key: "love" | "work" | "money" | "health"; label: string }[] = [
  { key: "love", label: "Aşk" },
  { key: "work", label: "İş" },
  { key: "money", label: "Para" },
  { key: "health", label: "Sağlık" },
];

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

  type WeeklyEntry = {
    health: number;
    love: number;
    money: number;
    work: number;
    healthText: string;
    loveText: string;
    moneyText: string;
    workText: string;
    summary: string;
    advice: string;
  };

  const dbHoroscopes: Record<string, WeeklyEntry> = {};
  try {
    const weeklies = await getAllWeeklyHoroscopes(new Date());
    weeklies.forEach((h) => {
      const row = h as unknown as {
        zodiacId: string;
        health: number | null;
        love: number | null;
        money: number | null;
        work: number | null;
        healthText: string | null;
        loveText: string | null;
        moneyText: string | null;
        workText: string | null;
        summary: string | null;
        advice: string | null;
      };
      dbHoroscopes[row.zodiacId.toLowerCase()] = {
        health: row.health ?? 3,
        love: row.love ?? 3,
        money: row.money ?? 3,
        work: row.work ?? 3,
        healthText: row.healthText ?? "",
        loveText: row.loveText ?? "",
        moneyText: row.moneyText ?? "",
        workText: row.workText ?? "",
        summary: row.summary ?? "",
        advice: row.advice ?? "",
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
              const fromDb = dbHoroscopes[sign.id];
              const fallback = WEEKLY_CONTENT[sign.id as ZodiacSign];
              const content: WeeklyEntry = fromDb
                ? fromDb
                : {
                    health: fallback.health,
                    love: fallback.love,
                    money: fallback.money,
                    work: fallback.work,
                    healthText: "",
                    loveText: "",
                    moneyText: "",
                    workText: "",
                    summary: fallback.summary,
                    advice: fallback.advice,
                  };
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

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Genel Değerlendirme</h3>
                      <p className="text-gray-700 leading-relaxed">{content.summary}</p>
                    </div>

                    {CATEGORY_ORDER.map(({ key, label }) => {
                      const text =
                        key === "love"
                          ? content.loveText
                          : key === "work"
                            ? content.workText
                            : key === "money"
                              ? content.moneyText
                              : content.healthText;
                      return (
                        <div key={key} className="flex flex-wrap items-baseline gap-2">
                          <span className="text-sm font-semibold text-gray-700">{label}:</span>
                          {text && <span className="text-gray-700">{text}</span>}
                          <StarRating value={content[key]} />
                        </div>
                      );
                    })}

                    <div className="rounded-xl bg-white/80 p-4 border border-gray-100 mt-4">
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
