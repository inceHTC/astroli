import type { Metadata } from "next";
import Link from "next/link";
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
  alternates: { canonical: `${getBaseUrl()}/retro` },
};

const FEATURES = [
  { icon: "✓", text: "Korku pazarlaması yok" },
  { icon: "✓", text: "Psikoloji temelli yorumlar" },
  { icon: "✓", text: "Kişisel checklist ve karar analizi" },
  { icon: "✓", text: "Bilimsel & astrolojik denge" },
];

export default function RetroPage() {
  const mercuryNext = getRetroByPlanet("mercury")[0];
  const venusNext   = getRetroByPlanet("venus")[0];
  const marsNext    = getRetroByPlanet("mars")[0];
  const saturnNext  = getRetroByPlanet("saturn")[0];

  return (
    <div className="min-h-screen bg-[#070B12]">
      <RetroNotification />
      <RetroHero />

      <main className="mx-auto max-w-6xl px-4 pb-28 sm:px-6 lg:px-8">

        {/* Özellikler şeridi */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.text} className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs text-[#C4C0BA]">
              <span className="text-[#A78BFA] font-bold">{f.icon}</span>
              {f.text}
            </div>
          ))}
        </div>

        {/* Gezegen kartları */}
        <section className="mt-16">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A78BFA]">
              Gezegenlere göre rehberlik
            </p>
            <h2 className="mt-1.5 text-2xl font-bold text-[#EDE9DF] sm:text-3xl">
              Hangi retroya hazırlanmak istiyorsun?
            </h2>
            <p className="mt-2 text-sm text-[#7A8090] max-w-xl">
              Her gezegen retrosu farklı yaşam alanlarını etkiler. Checklist, karar analizi ve psikolojik rehberlik için gezegeni seç.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <RetroPlanetCard planet="mercury" nextEvent={mercuryNext} />
            <RetroPlanetCard planet="venus"   nextEvent={venusNext}   />
            <RetroPlanetCard planet="mars"    nextEvent={marsNext}    />
            <RetroPlanetCard planet="saturn"  nextEvent={saturnNext}  />
          </div>
        </section>

        {/* Takvim */}
        <section className="mt-16">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A78BFA]">
              Planlama
            </p>
            <h2 className="mt-1.5 text-2xl font-bold text-[#EDE9DF] sm:text-3xl">
              Yılın Retro Takvimi
            </h2>
          </div>
          <RetroCalendar />
        </section>

        {/* Neden Retro Merkezi */}
        <section className="mt-16">
          <div className="rounded-2xl border border-white/[0.07] bg-[#0E1523] p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A78BFA]">
                  Felsefemiz
                </p>
                <h2 className="mt-2 text-xl font-bold text-[#EDE9DF] sm:text-2xl">
                  Neden Retro Merkezi?
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#C4C0BA]">
                  Burada retro; "kriz modu" değil,{" "}
                  <span className="font-semibold text-[#EDE9DF]">zihinsel ve duygusal check-in</span>{" "}
                  dönemi olarak ele alınır. Astroloji dilini; psikoloji, davranış bilimi ve modern yaşam
                  pratikleriyle harmanlayarak korku pazarlamasından uzak duruyoruz.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#C4C0BA]">
                  Her retro için checklist, karar analizi ve kişisel analiz modülleri;{" "}
                  <span className="font-semibold text-[#EDE9DF]">
                    yasak koymak yerine seçeneklerini netleştirmeyi
                  </span>{" "}
                  hedefler.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { dot: "bg-emerald-400", title: "Adım adım rehberlik", text: "Kişisel checklist ile retroyu küçük, uygulanabilir adımlara böl." },
                  { dot: "bg-sky-400",     title: "Karar kategorisi analizi", text: "İş, ilişki, estetik veya yatırım — kararını doğru çerçevele." },
                  { dot: "bg-[#A78BFA]",   title: "Psikoloji temelli yaklaşım", text: "Korku ve yasak yerine farkındalık ve netlik odaklı içerikler." },
                ].map(({ dot, title, text }) => (
                  <div key={title} className="flex gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                    <span className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${dot}`} />
                    <div>
                      <p className="text-sm font-semibold text-[#EDE9DF]">{title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-[#7A8090]">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mikro pratikler */}
        <section className="mt-16">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A78BFA]">
              Ritüel değil, mikro pratikler
            </p>
            <h2 className="mt-1.5 text-2xl font-bold text-[#EDE9DF] sm:text-3xl">
              Retro dönemlerinde uygulanabilir adımlar
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <RetroRitualCard
              title="15 dk zihinsel sadeleşme"
              description="Ekranlardan uzak, telefon uçak modunda; sadece nefesine ve zihninden geçen cümlelere alan aç."
              duration="15 dakika"
              focus="Bilişsel yük azaltma"
            />
            <RetroRitualCard
              title="Geri bildirim ritüeli"
              description="Güvendiğin birine üzerinde düşündüğün kararı anlat. Onay değil, farklı bakış açısı hedefle."
              duration="20 dakika"
              focus="Bakış açısı genişletme"
            />
            <RetroRitualCard
              title="Dijital arşiv nefesi"
              description="E-posta veya notlarındaki dağınık alanlardan birini seç; 20 dakikalık düzenleme yap."
              duration="20 dakika"
              focus="Düzen ve güven hissi"
            />
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16">
          <div className="relative overflow-hidden rounded-2xl border border-[#5C44D0]/25 bg-[#5C44D0]/8 p-8 text-center sm:p-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(92,68,208,0.15),transparent_70%)]" />
            <p className="relative text-xs font-semibold uppercase tracking-[0.24em] text-[#A78BFA]">
              Kişiselleştirilmiş rehberlik
            </p>
            <h2 className="relative mt-2 text-2xl font-bold text-[#EDE9DF] sm:text-3xl">
              Hangi retro seni en çok etkiliyor?
            </h2>
            <p className="relative mt-3 text-sm text-[#C4C0BA] max-w-md mx-auto">
              Gezegen sayfalarında checklist, karar analizi ve psikolojik odak noktalarını keşfet.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              {[
                { href: "/retro/mercury", label: "Merkür ☿", cls: "border-sky-500/30 bg-sky-500/8 text-sky-300 hover:bg-sky-500/15" },
                { href: "/retro/venus",   label: "Venüs ♀",  cls: "border-rose-500/30 bg-rose-500/8 text-rose-300 hover:bg-rose-500/15" },
                { href: "/retro/mars",    label: "Mars ♂",   cls: "border-orange-500/30 bg-orange-500/8 text-orange-300 hover:bg-orange-500/15" },
                { href: "/retro/saturn",  label: "Satürn ♄", cls: "border-indigo-500/30 bg-indigo-500/8 text-indigo-300 hover:bg-indigo-500/15" },
              ].map(({ href, label, cls }) => (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${cls}`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
