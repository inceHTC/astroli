import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ZODIAC_SIGNS } from "@/data/zodiac";
import { TESTS } from "@/data/tests";
import Image from "next/image";

const ELEMENT_LABELS: Record<string, string> = {
  fire: "Ateş", earth: "Toprak", air: "Hava", water: "Su",
};
const ELEMENT_BADGE: Record<string, string> = {
  fire: "badge-fire", earth: "badge-earth", air: "badge-air", water: "badge-water",
};

function getCurrentZodiac() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  return ZODIAC_SIGNS.find((sign) => {
    const { start, end } = sign.dateRange;
    if (start.month < end.month) {
      return (month === start.month && day >= start.day) ||
        (month === end.month && day <= end.day) ||
        (month > start.month && month < end.month);
    }
    return (month === start.month && day >= start.day) ||
      (month === end.month && day <= end.day) ||
      month > start.month || month < end.month;
  });
}

export default function HomePage() {
  const featuredZodiac = getCurrentZodiac();

  return (
    <div style={{ background: "var(--bg)" }}>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "var(--bg)" }}>

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(123,94,255,0.18) 0%, transparent 70%)" }} />
          <div className="absolute top-20 right-0 h-[400px] w-[500px]"
            style={{ background: "radial-gradient(ellipse at right, rgba(212,168,83,0.07) 0%, transparent 65%)" }} />
          <div className="absolute bottom-0 left-0 h-[300px] w-[400px]"
            style={{ background: "radial-gradient(ellipse at left bottom, rgba(123,94,255,0.1) 0%, transparent 65%)" }} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(123,94,255,0.3) 30%, rgba(212,168,83,0.2) 70%, transparent)" }} />

        <Container size="lg">
          <div className="relative grid items-center gap-12 py-24 lg:grid-cols-2 lg:py-32">

            <div className="relative z-10">
              <div className="eyebrow mb-6">
                <span style={{ color: "var(--gold)" }}>✦</span>
                <span>Premium Astroloji Platformu</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl">
                Burcunu
                <br />
                <span className="gradient-text">Öğren,</span>
                <br />
                Kişiliğini
                <br />
                <span className="gradient-text">Keşfet</span>
              </h1>

              <p className="mt-7 max-w-sm text-base leading-relaxed" style={{ color: "var(--text-3)" }}>
                Doğum tarihini gir, güneş, yükselen ve ay burcunu anında öğren.
                Doğum haritası ve kişilik testleriyle kendini derinlemesine tanı.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/burc-hesapla" className="btn btn-violet">
                  Burcunu Hesapla →
                </Link>
                <Link href="/birth-chart" className="btn btn-ghost">
                  Doğum Haritası
                </Link>
              </div>

              <div className="mt-12 flex gap-8 pt-8"
                style={{ borderTop: "1px solid var(--border)" }}>
                {[
                  { n: "12", l: "Burç Analizi" },
                  { n: "10+", l: "Kişilik Testi" },
                  { n: "Günlük", l: "Yorum" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif)" }}>{s.n}</p>
                    <p className="mt-1 text-xs" style={{ color: "var(--text-3)" }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="-mx-4 sm:-mx-6 lg:mx-0 lg:w-[115%] lg:-mr-20">
                <Image
                  src="/hero4.png"
                  alt="Astroli"
                  width={1600}
                  height={1100}
                  priority
                  className="w-full h-auto"
                />
              </div>
              <div className="hidden lg:block pointer-events-none absolute inset-y-0 left-0 w-28"
                style={{ background: "linear-gradient(to right, var(--bg), transparent)" }} />
            </div>

          </div>
        </Container>
      </section>

      {/* HIZLI ERİŞİM */}
      <section className="py-20" style={{ background: "var(--bg-2)" }}>
        <Container size="lg">

          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="eyebrow mb-3">Keşfet</p>
              <h2 className="text-3xl sm:text-4xl">Nereye Gitmek İstersin?</h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/gunluk-burc", src: "/gunluk.png", title: "Günlük Burç", desc: "Bugün burcun ne söylüyor?" },
              { href: "/haftalik-burc", src: "/haftalik.png", title: "Haftalık Yorum", desc: "Sağlık, aşk, para, iş" },
              { href: "/burclar/meslekler", src: "/meslek.png", title: "Kariyer & Meslek", desc: "Burcuna uygun yol" },
              { href: "/unluler", src: "/dergi/unlu.png", title: "Ünlü Burçları", desc: "Kim hangi burçtan?" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="group block">
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="25vw"
                    />
                    <div className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(5,4,15,0.7) 0%, transparent 60%)" }} />
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs" style={{ color: "var(--text-3)" }}>
                      {item.desc} →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </Container>
      </section>

      {/* BU HAFTA KOZMOSTA */}
      <section className="py-24" style={{ background: "var(--bg)" }}>
        <Container size="lg">

          <div className="mb-12">
            <p className="eyebrow mb-3">Bu Hafta</p>
            <h2 className="text-3xl sm:text-4xl">Kozmosta Neler Var?</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            <Link href="/retro" className="group block">
              <div className="glass h-full rounded-2xl p-7 flex flex-col min-h-[260px]">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                  style={{ background: "var(--violet-soft)", border: "1px solid var(--violet-border)" }}>
                  ☿
                </div>
                <h3 className="text-xl mb-3">Retro Merkezi</h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-3)" }}>
                  Merkür, Venüs, Mars ve Satürn retrolarını takvim, kişisel analiz
                  ve karar desteğiyle takip et.
                </p>
                <span className="mt-6 text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all duration-200"
                  style={{ color: "var(--violet)" }}>
                  Retroları Takip Et →
                </span>
              </div>
            </Link>

            {featuredZodiac && (
              <Link href={`/burc/${featuredZodiac.id}`} className="group block">
                <div className="h-full rounded-2xl p-7 flex flex-col min-h-[260px] transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "linear-gradient(135deg, rgba(123,94,255,0.12) 0%, rgba(123,94,255,0.05) 100%)",
                    border: "1px solid var(--violet-border)",
                    borderRadius: "var(--r-lg)",
                  }}>
                  <p className="eyebrow mb-5">Bugünün Burcu</p>

                  <div className="flex items-center gap-5 flex-1">
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-2xl overflow-hidden"
                      style={{ border: "1px solid var(--border-2)", background: "rgba(0,0,0,0.3)" }}>
                      <Image src={featuredZodiac.image} alt={featuredZodiac.nameTr} fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="text-2xl">{featuredZodiac.nameTr}</h3>
                      <p className="mt-1.5 text-xs" style={{ color: "var(--text-3)" }}>{featuredZodiac.dates}</p>
                      <span className={`badge mt-3 ${ELEMENT_BADGE[featuredZodiac.element] ?? "badge-air"}`}>
                        {ELEMENT_LABELS[featuredZodiac.element]}
                      </span>
                    </div>
                  </div>

                  <span className="mt-6 text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all duration-200"
                    style={{ color: "var(--violet)" }}>
                    Detaylı Analiz →
                  </span>
                </div>
              </Link>
            )}

            <Link href="/burclar" className="group block">
              <div className="glass h-full rounded-2xl p-7 flex flex-col min-h-[260px]"
                style={{
                  background: "linear-gradient(135deg, rgba(212,168,83,0.09) 0%, rgba(212,168,83,0.03) 100%)",
                  border: "1px solid var(--gold-border)",
                }}>
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                  style={{ background: "var(--gold-soft)", border: "1px solid var(--gold-border)" }}>
                  ♈
                </div>
                <h3 className="text-xl mb-3">12 Zodyak Burcu</h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-3)" }}>
                  Element enerjileri, güçlü ve zayıf yönler, aşk ve kariyer rehberi.
                  Burcunu seç, derinlemesine tanı.
                </p>
                <span className="mt-6 text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all duration-200"
                  style={{ color: "var(--gold)" }}>
                  Tüm Burçlara Bak →
                </span>
              </div>
            </Link>

          </div>
        </Container>
      </section>

      {/* DOĞUM HARİTASI CTA */}
      <section className="py-6">
        <Container size="lg">
          <div className="relative overflow-hidden rounded-3xl"
            style={{ background: "linear-gradient(135deg, #0D0B24 0%, #150E35 50%, #0A0820 100%)" }}>

            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full"
                style={{ background: "radial-gradient(circle, rgba(123,94,255,0.2) 0%, transparent 65%)" }} />
              <div className="absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full"
                style={{ background: "radial-gradient(circle, rgba(212,168,83,0.1) 0%, transparent 65%)" }} />
              <div className="absolute inset-0 rounded-3xl"
                style={{ border: "1px solid rgba(123,94,255,0.2)" }} />
            </div>

            <div className="relative grid items-center gap-10 p-10 lg:grid-cols-2 lg:p-16">

              <div>
                <p className="eyebrow mb-5">Kişisel Harita</p>
                <h2 className="text-4xl sm:text-5xl">
                  Doğum Haritanı
                  <br />
                  <span className="gold-text">Detaylı Analiz Et</span>
                </h2>
                <p className="mt-6 leading-relaxed" style={{ color: "var(--text-3)" }}>
                  Sadece güneş burcun değil. Yükselen, ay burcu ve
                  tüm gezegen yerleşimlerinle gerçek karakter analizini keşfet.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/birth-chart" className="btn btn-gold">
                    Haritayı Hesapla →
                  </Link>
                  <Link href="/uyumluluk" className="btn btn-ghost">
                    Uyumluluk Testi
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-xs lg:max-w-sm">
                <div className="relative aspect-square rounded-2xl overflow-hidden"
                  style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}>
                  <Image src="/dogum.png" alt="Doğum Haritası" fill className="object-cover" />
                </div>
              </div>

            </div>
          </div>
        </Container>
      </section>

      {/* KİŞİLİK TESTLERİ */}
      <section className="py-24" style={{ background: "var(--bg-2)" }}>
        <Container size="lg">

          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="eyebrow mb-3">Testler</p>
              <h2 className="text-3xl sm:text-4xl">Popüler Kişilik Testleri</h2>
            </div>
            <Link href="/testler" className="text-sm font-semibold flex items-center gap-1.5 hover:gap-3 transition-all duration-200"
              style={{ color: "var(--violet)" }}>
              Tümünü Gör →
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TESTS.slice(0, 3).map((test) => (
              <Link key={test.id} href={`/test/${test.slug}`} className="group block">
                <div className="glass rounded-2xl overflow-hidden">

                  <div className="relative h-52 overflow-hidden">
                    <Image src={test.image} alt={test.title} fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(5,4,15,0.75) 0%, transparent 55%)" }} />
                    <div className="absolute bottom-4 left-5">
                      <span className="eyebrow" style={{ color: "var(--gold)" }}>
                        {test.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base mb-2">{test.title}</h3>
                    <p className="text-sm line-clamp-2 leading-relaxed mb-4" style={{ color: "var(--text-3)" }}>
                      {test.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: "var(--text-4)" }}>
                        ⏱ {test.duration}
                      </span>
                      <span className="text-xs font-semibold" style={{ color: "var(--violet)" }}>
                        Başla →
                      </span>
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>

        </Container>
      </section>

    </div>
  );
}
