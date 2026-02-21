import type { Metadata } from "next";
import { RetroHero } from "@/components/retro/RetroHero";
import { RetroCalendar } from "@/components/retro/RetroCalendar";
import { RetroPlanetCard } from "@/components/retro/RetroPlanetCard";
import { RetroRitualCard } from "@/components/retro/RetroRitualCard";
import { RetroNotification } from "@/components/retro/RetroNotification";
import { getRetroByPlanet } from "@/lib/retro-data";
import { getBaseUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Retro Merkezi – Astroli | Korkusuz, psikoloji temelli retro rehberi",
  description:
    "Merkür, Venüs, Mars ve Satürn retrolarını korku değil farkındalıkla yorumlayan, takvim, kişisel analiz ve karar desteği sunan modern Retro Merkezi.",
  openGraph: {
    title: "Retro Merkezi – Astroli",
    description:
      "Klasik retro korkusunun ötesinde, bilimsel denge ve psikolojik yaklaşımla hazırlanmış interaktif Retro Merkezi.",
    url: `${getBaseUrl()}/retro`,
    type: "website",
  },
  alternates: {
    canonical: `${getBaseUrl()}/retro`,
  },
};

export default function RetroPage() {
  const mercuryNext = getRetroByPlanet("mercury")[0];
  const venusNext = getRetroByPlanet("venus")[0];
  const marsNext = getRetroByPlanet("mars")[0];
  const saturnNext = getRetroByPlanet("saturn")[0];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 text-gray-900">
      <RetroNotification />
      <RetroHero />

      <main className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <RetroCalendar />
          <div className="space-y-3 rounded-3xl border-2 border-gray-200 bg-white p-5 text-xs shadow-lg">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500">
              Neden Retro Merkezi?
            </p>
            <p className="text-[13px] leading-relaxed text-gray-700">
              Burada retro; “kriz modu” değil,{" "}
              <span className="font-semibold text-gray-900">
                zihinsel ve duygusal check-in
              </span>{" "}
              dönemi olarak ele alınır. Astroloji dilini; psikoloji, davranış
              bilimi ve modern yaşam pratikleriyle harmanlayarak korku
              pazarlamasından uzak duruyoruz.
            </p>
            <p className="text-[13px] leading-relaxed text-gray-600">
              Her retro için checklist, karar analizi ve kişisel analiz
              modülleri;{" "}
              <span className="font-semibold text-gray-800">
                yasak koymak yerine, seçeneklerini netleştirmeyi
              </span>{" "}
              hedefler.
            </p>
          </div>
        </section>

        <section className="mt-4 space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500">
                Gezegenlere göre rehberlik
              </p>
              <h2 className="bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
                Hangi retroya hazırlanmak istiyorsun?
              </h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <RetroPlanetCard planet="mercury" nextEvent={mercuryNext} />
            <RetroPlanetCard planet="venus" nextEvent={venusNext} />
            <RetroPlanetCard planet="mars" nextEvent={marsNext} />
            <RetroPlanetCard planet="saturn" nextEvent={saturnNext} />
          </div>
        </section>

        <section className="mt-6 space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500">
                Ritüel değil, mikro pratikler
              </p>
              <h2 className="bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
                Retro dönemlerinde sinematik ama uygulanabilir mikro ritüeller
              </h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <RetroRitualCard
              title="15 dakikalık zihinsel sadeleşme"
              description="Ekranlardan uzak, telefon uçak modunda; sadece nefesine ve zihninden geçen cümlelere alan aç. Not almak serbest, yargılamak yasak."
              duration="15 dakika"
              focus="Bilişsel yükü hafifletme"
            />
            <RetroRitualCard
              title="Geri bildirim ritüeli"
              description="Güvendiğin birine, üzerinde düşündüğün kararı anlat ve sadece 'nasıl duyuluyor?' diye sor. Onay değil, farklı bakış açısı hedefle."
              duration="20 dakika"
              focus="Bakış açısı genişletme"
            />
            <RetroRitualCard
              title="Dijital arşiv nefesi"
              description="E-posta, klasör veya notlarındaki dağınık alanlardan birini seç; sadece 20 dakikalık düzenleme yap. Bitirmek değil, ilerlemek önemli."
              duration="20 dakika"
              focus="Düzen ve güven hissi"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

