import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { ZODIAC_SIGNS, ELEMENT_CARD_CLASSES } from "@/data/zodiac";
import type { Element, ZodiacSign } from "@/data/zodiac";
import { getBaseUrl } from "@/lib/site-url";
import { getWeekRange, WEEKLY_CONTENT } from "@/data/weeklyHoroscope";
import {
  getAllWeeklyHoroscopes,
  getWeeklyHoroscopeAvailableWeeks,
} from "@/lib/db/repositories/horoscope";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { WeeklyHoroscopeToolbar } from "@/components/horoscope/WeeklyHoroscopeToolbar";

const CATEGORY_ORDER: { key: "love" | "work" | "money" | "health"; label: string }[] = [
  { key: "love", label: "Aşk" },
  { key: "work", label: "İş" },
  { key: "money", label: "Para" },
  { key: "health", label: "Sağlık" },
];

type SearchParams = Record<string, string | string[] | undefined>;
type PageProps = { searchParams?: Promise<SearchParams> | SearchParams };

function weekStartStrFromDate(date: Date): string {
  const { start } = getWeekRange(date);
  return `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;
}

function parseWeekParam(hafta: string | null, fallbackWeekStart: string): string {
  if (!hafta || !/^\d{4}-\d{2}-\d{2}$/.test(hafta)) return fallbackWeekStart;
  // Gelecek haftayı gösterme isteği olursa, bugünün haftasına sabitlenir
  return hafta > fallbackWeekStart ? fallbackWeekStart : hafta;
}

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

export const metadata: Metadata = {
  title: "Haftalık Burç Yorumu | Astroli",
  description:
    "Bu hafta 12 burç için sağlık, aşk, para ve iş alanlarında genel değerlendirme; olasılıklar ve farkındalık üzerine haftalık rehber.",
  alternates: { canonical: `${getBaseUrl()}/haftalik-burc` },
};

export default async function HaftalikBurcPage(props: PageProps) {
  let searchParams: SearchParams = {};
  try {
    const raw = props?.searchParams;
    searchParams = raw instanceof Promise ? await raw : (raw ?? {});
  } catch {
    searchParams = {};
  }

  const todayWeekStartStr = weekStartStrFromDate(new Date());
  const haftaParam = typeof searchParams?.hafta === "string" ? searchParams.hafta : null;
  const currentWeekStartStr = parseWeekParam(haftaParam, todayWeekStartStr);
  const baseDate = new Date(currentWeekStartStr + "T12:00:00");
  const { start, end } = getWeekRange(baseDate);

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
  let availableWeeks: string[] = [];
  try {
    const [weeklies, weeks] = await Promise.all([
      getAllWeeklyHoroscopes(baseDate),
      getWeeklyHoroscopeAvailableWeeks(60),
    ]);
    availableWeeks = Array.isArray(weeks) ? weeks : [];

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
    // Database hatası varsa static data ve boş arşiv kullanılacak
    availableWeeks = [];
  }

  return (
    <div className="bg-[#070B12] pb-28">
      <section className="relative overflow-hidden bg-[#070B12]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(91,63,255,0.06),transparent_60%)]" />
        <Container size="lg">
          <div className="pt-8">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7A8090] hover:text-[#EDE9DF] transition-colors">
              ← Ana Sayfa
            </Link>
          </div>
          <div className="relative py-16 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#EDE9DF]">
              Haftalık Burç Yorumu
            </h1>
            <p className="mt-4 text-lg text-[#C4C0BA]">
              Bu hafta burcunuz için sağlık, aşk, para ve iş alanlarında genel bir rehber. Olasılıklar ve farkındalık üzerine yorumlar.
            </p>
            <p className="mt-3 text-sm font-medium text-[#A78BFA]">
              {format(start, "d MMMM", { locale: tr })} – {format(end, "d MMMM yyyy", { locale: tr })}
            </p>
            <p className="mt-2 text-sm text-[#7A8090]">
              Geçmiş haftaları arşivden seçebilirsiniz.
            </p>
          </div>
        </Container>
      </section>

      <section className="mt-8">
        <Container size="lg">
          <WeeklyHoroscopeToolbar
            currentWeekStart={currentWeekStartStr}
            availableWeeks={availableWeeks}
            currentWeekOfToday={todayWeekStartStr}
          />
        </Container>
      </section>

      <section className="mt-12">
        <Container size="lg">
          {currentWeekStartStr !== todayWeekStartStr && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-900/20 p-4 text-center">
              <p className="text-[#6E6660]">Bu yorum geçmiş haftaya aittir.</p>
              <p className="mt-1 text-sm text-[#6E6660]">
                Güncel hafta için{" "}
                <Link
                  href="/haftalik-burc"
                  className="font-semibold text-[#5C44D0] underline hover:no-underline"
                >
                  buraya tıklayın
                </Link>
                .
              </p>
            </div>
          )}
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
              const el = ELEMENT_CARD_CLASSES[sign.element as Element];
              return (
                <article
                  key={sign.id}
                  className={`rounded-2xl border p-6 sm:p-8 bg-[#F9F5EF] ${el.border}`}
                >
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <Link href={`/burc/${sign.id}`} className="flex items-center gap-3 group">
                      <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-[#EDE8DF] flex-shrink-0">
                        <Image
                          src={sign.image}
                          alt={sign.nameTr}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-[#1A1714] group-hover:text-[#5C44D0] transition-colors">{sign.nameTr}</h2>
                        <p className="text-sm text-[#6E6660]">{sign.dates}</p>
                      </div>
                    </Link>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-[#5C44D0] mb-2">Genel Değerlendirme</h3>
                      <p className="text-[#3D3830] leading-relaxed text-sm">{content.summary}</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                          <div key={key} className="rounded-xl bg-black/[0.03] border border-black/[0.06] p-3 flex flex-col gap-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#5C44D0]">{label}</span>
                            <StarRating value={content[key]} />
                            {text && <span className="text-xs text-[#44403C] leading-relaxed mt-0.5">{text}</span>}
                          </div>
                        );
                      })}
                    </div>

                    <div className="rounded-xl bg-[#5C44D0]/[0.06] p-4 border border-[#5C44D0]/20 mt-2">
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-[#5C44D0] mb-2">Tavsiye</h3>
                      <p className="text-[#3D3830] leading-relaxed text-sm">{content.advice}</p>
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
