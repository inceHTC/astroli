import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { Container } from "@/components/layout/Container";
import { ArticleScrollProgress } from "@/components/article/ArticleScrollProgress";
import { ArticleShare } from "@/components/article/ArticleShare";
import { ZODIAC_SIGNS } from "@/data/zodiac";
import { getWeekRange } from "@/data/weeklyHoroscope";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

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

export const metadata = {
  title: "Haftalık Kozmik Enerji | Astroli Dergi",
  description:
    "Bu haftanın astrolojik enerjisi, gezegen hareketleri ve burçlar üzerindeki genel etkiler. Kozmik enerji rehberi.",
};

export default async function HaftalikKozmikEnerjiPage() {
  const { start, end } = getWeekRange(new Date());
  const today = new Date();
  const weekNumber = Math.ceil((today.getDate() + new Date(today.getFullYear(), today.getMonth(), 1).getDay()) / 7);

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;

  // Element gruplarına göre burçları grupla
  const byElement = {
    fire: ZODIAC_SIGNS.filter((z) => z.element === "fire"),
    earth: ZODIAC_SIGNS.filter((z) => z.element === "earth"),
    air: ZODIAC_SIGNS.filter((z) => z.element === "air"),
    water: ZODIAC_SIGNS.filter((z) => z.element === "water"),
  };

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

        {/* Kapak görseli */}
        <div className="editorial-cover mb-14 overflow-hidden rounded-2xl bg-gradient-to-br from-[#5B3FFF]/10 via-purple-50 to-blue-50">
          <div className="relative aspect-[16/9] w-full">
            <div className="absolute inset-0 flex items-center justify-center">
           
                 
                          <Image
                            src="/kozmik.png"
                            alt="Hangi ünlü hangi burç?"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, 33vw"
                          />
                    
              
              </div>
          
          </div>
        </div>

        {/* Ana içerik */}
        <div className="editorial-body space-y-12">
          {/* Genel Değerlendirme */}
          <section>
            <h2 className="editorial-h2 font-serif text-2xl font-semibold text-black mb-4">
              Bu Haftanın Genel Enerjisi
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-black/80 leading-relaxed">
                Bu hafta kozmik enerjilerde denge ve uyum ön planda olabilir. Gezegen hareketleri 
                iletişim ve planlama konularında destekleyici olabilir. Özellikle toprak ve su 
                elementleri bu hafta daha güçlü hissedebilir; ateş ve hava elementleri ise yeni 
                fırsatlar ve hareketlilik arayışında olabilir.
              </p>
              <p className="text-black/80 leading-relaxed mt-4">
                Genel olarak bu hafta sabır ve planlama önemli olabilir. Aceleci kararlar yerine 
                düşünülmüş adımlar daha sağlıklı sonuçlar verebilir. İlişkilerde iletişim ve 
                anlayış öne çıkabilir; iş hayatında ise detay ve organizasyon faydalı olabilir.
              </p>
            </div>
          </section>

          {/* Element Enerjileri */}
          <section>
            <h2 className="editorial-h2 font-serif text-2xl font-semibold text-black mb-6">
              Element Enerjileri
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {(["fire", "earth", "air", "water"] as const).map((element) => {
                const signs = byElement[element];
                const colors = ELEMENT_COLORS[element];
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
                      {element === "fire" &&
                        "Bu hafta ateş elementinde hareket ve cesaret enerjisi yüksek olabilir. Yeni projeler ve girişimler için uygun bir dönem olabilir."}
                      {element === "earth" &&
                        "Bu hafta toprak elementinde istikrar ve planlama ön planda olabilir. Pratik adımlar ve uzun vadeli hedefler için verimli bir dönem olabilir."}
                      {element === "air" &&
                        "Bu hafta hava elementinde iletişim ve fikir alışverişi güçlü olabilir. Öğrenme ve sosyal bağlar için uygun bir dönem olabilir."}
                      {element === "water" &&
                        "Bu hafta su elementinde duygusal derinlik ve sezgi öne çıkabilir. İlişkiler ve içsel gelişim için verimli bir dönem olabilir."}
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

          {/* Gezegen Hareketleri */}
          <section>
            <h2 className="editorial-h2 font-serif text-2xl font-semibold text-black mb-6">
              Gezegen Hareketleri ve Etkileri
            </h2>
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-black mb-2">Merkür</h3>
                <p className="text-black/70 leading-relaxed text-sm">
                  Bu hafta Merkür iletişim ve düşünce konularında destekleyici olabilir. 
                  Net ifade ve planlama için uygun bir dönem olabilir. Özellikle yazılı 
                  iletişim ve öğrenme konularında verimli olabilir.
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-black mb-2">Venüs</h3>
                <p className="text-black/70 leading-relaxed text-sm">
                  Bu hafta Venüs ilişkiler ve estetik konularında denge arayışında olabilir. 
                  İlişkilerde uyum ve anlayış önemli olabilir. Yaratıcı projeler ve güzellik 
                  konularında ilerleme olabilir.
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-black mb-2">Mars</h3>
                <p className="text-black/70 leading-relaxed text-sm">
                  Bu hafta Mars enerji ve aksiyon konularında dengeli bir seyir izleyebilir. 
                  Harekete geçmek için uygun zamanlar olabilir; ancak sabır ve planlama da 
                  önemli olabilir.
                </p>
              </div>
            </div>
          </section>

          {/* Tavsiyeler */}
          <section className="rounded-xl bg-gradient-to-br from-[#5B3FFF]/5 to-purple-50/50 border border-[#5B3FFF]/20 p-8">
            <h2 className="editorial-h2 font-serif text-2xl font-semibold text-black mb-4">
              Bu Hafta İçin Genel Tavsiyeler
            </h2>
            <ul className="space-y-3 text-black/80">
              <li className="flex items-start gap-3">
                <span className="text-[#5B3FFF] mt-1">✦</span>
                <span>İletişim konularında netlik ve açıklık önemli olabilir. Önemli konuları 
                ertelememek faydalı olabilir.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#5B3FFF] mt-1">✦</span>
                <span>Planlama ve organizasyon bu hafta güçlü olabilir. Uzun vadeli hedefler 
                için adım atmak uygun olabilir.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#5B3FFF] mt-1">✦</span>
                <span>İlişkilerde denge ve anlayış önemli olabilir. Karşılıklı saygı ve 
                iletişim güçlendirilebilir.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#5B3FFF] mt-1">✦</span>
                <span>Yeni projeler için hazırlık yapmak ve adım adım ilerlemek daha sağlıklı 
                sonuçlar verebilir.</span>
              </li>
            </ul>
          </section>

          {/* Burçlara Göre Genel Bakış */}
          <section>
            <h2 className="editorial-h2 font-serif text-2xl font-semibold text-black mb-6">
              Burçlara Göre Genel Bakış
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ZODIAC_SIGNS.map((sign) => {
                const colors = ELEMENT_COLORS[sign.element];
                return (
                  <Link
                    key={sign.id}
                    href={`/burc/${sign.id}`}
                    className={`rounded-lg border p-4 transition hover:shadow-md ${colors.bg} ${colors.border}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-[#1A1C2B] flex-shrink-0">
                        <Image
                          src={sign.image}
                          alt={sign.nameTr}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-black">{sign.nameTr}</h3>
                        <p className="text-xs text-black/50">{sign.dates}</p>
                      </div>
                    </div>
                    <p className="text-xs text-black/60 leading-relaxed">
                      {sign.element === "fire" &&
                        "Bu hafta enerji ve hareket ön planda olabilir. Yeni girişimler için uygun bir dönem."}
                      {sign.element === "earth" &&
                        "Bu hafta istikrar ve planlama güçlü olabilir. Pratik adımlar için verimli bir dönem."}
                      {sign.element === "air" &&
                        "Bu hafta iletişim ve fikir alışverişi öne çıkabilir. Sosyal bağlar için uygun bir dönem."}
                      {sign.element === "water" &&
                        "Bu hafta duygusal derinlik ve sezgi güçlü olabilir. İçsel gelişim için verimli bir dönem."}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        {/* Paylaş */}
        <div className="mt-12">
          <ArticleShare
            title="Haftalık Kozmik Enerji"
            slug="haftalik-burc-enerjisi"
            baseUrl={baseUrl}
          />
        </div>

        {/* İlgili Sayfalar */}
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
