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
const ELEMENT_COLOR: Record<string, string> = {
  fire: "#FB923C", earth: "#A3E635", air: "#818CF8", water: "#38BDF8",
};
const ELEMENT_GLOW: Record<string, string> = {
  fire: "rgba(249,115,22,0.18)", earth: "rgba(132,204,22,0.18)",
  air: "rgba(99,102,241,0.18)", water: "rgba(14,165,233,0.18)",
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

// Deterministic star positions – SSR-safe, no Math.random()
const STARS = Array.from({ length: 75 }, (_, i) => ({
  id: i,
  left: ((i * 1317 + 237) % 1000) / 10,
  top: ((i * 741 + 83) % 1000) / 10,
  size: i % 7 === 0 ? 2.8 : i % 4 === 0 ? 2 : 1.3,
  duration: 2 + ((i * 7) % 8) * 0.45,
  delay: (i * 23 % 600) / 100,
  isGold: i % 10 === 0,
}));

const ELEMENT_GROUPS = [
  { element: "fire",  label: "Ateş",   color: "#FB923C", border: "rgba(249,115,22,0.18)", bg: "rgba(249,115,22,0.07)", badge: "badge-fire"  },
  { element: "earth", label: "Toprak", color: "#A3E635", border: "rgba(132,204,22,0.18)", bg: "rgba(132,204,22,0.07)", badge: "badge-earth" },
  { element: "air",   label: "Hava",   color: "#818CF8", border: "rgba(99,102,241,0.18)", bg: "rgba(99,102,241,0.07)", badge: "badge-air"   },
  { element: "water", label: "Su",     color: "#38BDF8", border: "rgba(14,165,233,0.18)", bg: "rgba(14,165,233,0.07)", badge: "badge-water" },
] as const;

const QUICK_ACCESS = [
  { href: "/gunluk-burc",       src: "/gunluk.png",      title: "Günlük Burç",    desc: "Bugün burcun ne söylüyor?", symbol: "☀", accent: "#ffc552" },
  { href: "/haftalik-burc",     src: "/haftalik.png",    title: "Haftalık Yorum", desc: "Sağlık, aşk, para, iş",    symbol: "☽", accent: "#7B5EFF" },
  { href: "/burclar/meslekler", src: "/meslek.png",      title: "Kariyer & Meslek", desc: "Burcuna uygun yol",      symbol: "♃", accent: "#38BDF8" },
  { href: "/unluler",           src: "/dergi/unlu.png",  title: "Ünlü Burçları",  desc: "Kim hangi burçtan?",       symbol: "★", accent: "#FB923C" },
];

export default function HomePage() {
  const featuredZodiac = getCurrentZodiac();
  const today = new Date();
  const dateStr = today.toLocaleDateString("tr-TR", { day: "numeric", month: "long" });

  return (
    <div style={{ background: "var(--bg)" }}>

      {/* ══════════════ HERO ══════════════ */}
      <section
        className="relative overflow-hidden flex items-center"
        style={{ minHeight: "100svh", background: "var(--bg)" }}
      >
        {/* Starfield */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {STARS.map((s) => (
            <div
              key={s.id}
              className="absolute rounded-full"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: s.size,
                height: s.size,
                background: s.isGold ? "var(--gold)" : "#fff",
                animation: `astroli-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Nebula gradients */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full"
            style={{
              top: "-15%",
              height: "80vh",
              width: "130vw",
              background: "radial-gradient(ellipse, rgba(123,94,255,0.22) 0%, rgba(123,94,255,0.06) 38%, transparent 68%)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              top: "20%", right: "-20%",
              height: "70vh", width: "60vw",
              background: "radial-gradient(ellipse at right, rgba(212,168,83,0.09) 0%, transparent 65%)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              bottom: "-5%", left: "-10%",
              height: "50vh", width: "50vw",
              background: "radial-gradient(ellipse at left, rgba(56,189,248,0.06) 0%, transparent 60%)",
            }}
          />
        </div>

        {/* Rotating decorative rings – desktop only */}
        <div
          className="pointer-events-none absolute hidden lg:flex items-center justify-center"
          aria-hidden="true"
          style={{ right: "-5%", top: "50%", transform: "translateY(-50%)", width: "55vw", height: "55vw" }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: "1px solid rgba(123,94,255,0.07)", animation: "astroli-rotate 90s linear infinite" }}
          />
          <div
            className="absolute rounded-full"
            style={{ inset: "10%", border: "1px solid rgba(212,168,83,0.05)", animation: "astroli-rotate 60s linear infinite reverse" }}
          />
          <div
            className="absolute rounded-full"
            style={{ inset: "22%", border: "1px solid rgba(123,94,255,0.04)", animation: "astroli-rotate 40s linear infinite" }}
          />
        </div>

        <Container size="lg">
          <div className="relative z-10 grid items-center gap-12 py-36 lg:grid-cols-2 lg:py-32">

            {/* ── Left: Text content ── */}
            <div>
              {/* Date + active sign pill */}
              <div
                className="mb-8 inline-flex items-center gap-3 rounded-full"
                style={{
                  padding: "10px 20px",
                  background: "rgba(123,94,255,0.08)",
                  border: "1px solid rgba(123,94,255,0.18)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <span style={{ color: "var(--gold)", fontSize: 13 }}>✦</span>
                <span
                  className="font-semibold uppercase"
                  style={{ fontSize: 11, letterSpacing: "0.16em", color: "var(--text-3)" }}
                >
                  {dateStr}
                </span>
                {featuredZodiac && (
                  <>
                    <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 8 }}>●</span>
                    <span className="text-xs font-medium" style={{ color: "var(--text-3)" }}>
                      {featuredZodiac.symbol} {featuredZodiac.nameTr} mevsimi
                    </span>
                  </>
                )}
              </div>

              {/* Main heading */}
              <h1
                className="leading-[0.90] tracking-[-0.03em]"
                style={{ fontSize: "clamp(3.2rem, 7.5vw, 6rem)" }}
              >
                <span className="block" style={{ color: "var(--text)" }}>Yıldızların</span>
                <span className="block gradient-text" style={{ paddingBottom: "0.06em" }}>Sırlarını</span>
                <span className="block" style={{ color: "var(--text)" }}>Keşfet</span>
              </h1>

              <p
                className="mt-8 max-w-[420px] leading-relaxed"
                style={{ fontSize: 17, color: "var(--text-3)" }}
              >
                Doğum tarihinle güneş, yükselen ve ay burcunu anında öğren.
                Doğum haritası ve kişilik testleriyle gerçek karakterini tanı.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/burc-hesapla"
                  className="btn btn-violet"
                  style={{ fontSize: 15, padding: "14px 32px" }}
                >
                  Burcunu Hesapla →
                </Link>
                <Link
                  href="/birth-chart"
                  className="btn btn-ghost"
                  style={{ fontSize: 15, padding: "14px 32px" }}
                >
                  Doğum Haritası
                </Link>
              </div>

              {/* Stats bar */}
              <div
                className="mt-14 grid grid-cols-3 gap-6 pt-8"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                {[
                  { n: "12",      l: "Burç Analizi" },
                  { n: "10+",     l: "Kişilik Testi" },
                  { n: "Günlük",  l: "Kozmik Yorum" },
                ].map((s) => (
                  <div key={s.l}>
                    <p
                      className="font-bold"
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                        color: "var(--text)",
                        lineHeight: 1,
                      }}
                    >
                      {s.n}
                    </p>
                    <p className="mt-2 text-xs tracking-wide" style={{ color: "var(--text-4)" }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Hero image ── */}
            <div className="relative">
              <div
                className="pointer-events-none absolute inset-0 -m-10"
                aria-hidden="true"
                style={{ background: "radial-gradient(ellipse at center, rgba(123,94,255,0.18) 0%, transparent 65%)" }}
              />
              <Image
                src="/hero4.png"
                alt="Astroli – Kozmik Astroloji"
                width={1600}
                height={1100}
                priority
                className="relative z-10 w-full h-auto"
                style={{ filter: "drop-shadow(0 0 60px rgba(123,94,255,0.30))" }}
              />
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-20 hidden lg:block"
                style={{ width: "7rem", background: "linear-gradient(to right, var(--bg), transparent)" }}
              />
            </div>

          </div>
        </Container>

        {/* Bottom fade-out */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{ height: "10rem", background: "linear-gradient(to bottom, transparent, var(--bg))" }}
        />
      </section>

      {/* ══════════════ HIZLI ERİŞİM ══════════════ */}
      <section className="py-24" style={{ background: "var(--bg-2)" }}>
        <Container size="lg">

          <div className="mb-14 flex items-end justify-between">
            <div>
              <p className="eyebrow mb-3">
                <span style={{ color: "var(--gold)" }}>✦</span>
                <span>Keşfet</span>
              </p>
              <h2 className="text-4xl sm:text-5xl">Nereye Gitmek İstersin?</h2>
            </div>
            <Link
              href="/burclar"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:gap-3"
              style={{ color: "var(--violet)" }}
            >
              Tüm İçerikler →
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_ACCESS.map((item) => (
              <Link key={item.href} href={item.href} className="group block">
                <div
                  className="relative overflow-hidden rounded-2xl transition-all duration-300 group-hover:-translate-y-1.5"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(5,4,15,0.92) 20%, transparent 65%)" }}
                    />
                    {/* Symbol badge */}
                    <div
                      className="absolute top-4 right-4 flex items-center justify-center rounded-xl text-lg"
                      style={{
                        width: 38, height: 38,
                        background: "rgba(8,6,18,0.78)",
                        backdropFilter: "blur(8px)",
                        border: `1px solid ${item.accent}44`,
                        color: item.accent,
                      }}
                    >
                      {item.symbol}
                    </div>
                  </div>
                  {/* Text */}
                  <div className="p-5">
                    <h3
                      className="text-base font-bold mb-1"
                      style={{ fontFamily: "var(--font-serif)", color: "var(--text)" }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-4)" }}>{item.desc}</p>
                    <div
                      className="flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 group-hover:gap-2.5"
                      style={{ color: item.accent }}
                    >
                      <span>Keşfet</span><span>→</span>
                    </div>
                  </div>
                  {/* Hover glow border */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ border: `1px solid ${item.accent}44` }}
                  />
                </div>
              </Link>
            ))}
          </div>

        </Container>
      </section>


   {/* ══════════════ DOĞUM HARİTASI + UYUMLULUK ══════════════ */}
      <section className="py-6">
        <Container size="lg">
          <div className="grid gap-5 lg:grid-cols-5">

            {/* Birth chart – wider */}
            <div
              className="relative overflow-hidden rounded-3xl lg:col-span-3"
              style={{ background: "linear-gradient(135deg, #0D0B24 0%, #150E35 50%, #0A0820 100%)" }}
            >
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div
                  className="absolute rounded-full"
                  style={{ top: "-15%", right: "-15%", width: "60%", height: "120%",
                    background: "radial-gradient(circle, rgba(123,94,255,0.22) 0%, transparent 65%)" }}
                />
                <div
                  className="absolute rounded-full"
                  style={{ bottom: "-15%", left: "-10%", width: "45%", height: "80%",
                    background: "radial-gradient(circle, rgba(212,168,83,0.10) 0%, transparent 65%)" }}
                />
                <div className="absolute inset-0 rounded-3xl" style={{ border: "1px solid rgba(123,94,255,0.20)" }} />
              </div>

              <div className="relative p-7 sm:p-10 lg:p-14">
                <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">

                  <div>
                    <p className="eyebrow mb-4">
                      <span style={{ color: "var(--gold)" }}>✦</span>
                      <span>Kişisel Harita</span>
                    </p>
                    {/* Başlık + thumbnail aynı satırda – sadece mobilde */}
                    <div className="flex items-center gap-1 lg:block">
                      <h2 className="flex-1 text-3xl sm:text-4xl lg:text-5xl">
                        Doğum<br />
                        <span className="gold-text">Haritanı</span><br />
                        Analiz Et
                      </h2>
                      <div
                        className="lg:hidden relative flex-shrink-0 rounded-2xl overflow-hidden"
                        style={{
                          width: 120, height: 120,
                          boxShadow: "0 8px 32px rgba(123,94,255,0.30)",
                          border: "1px solid rgba(123,94,255,0.25)",
                        }}
                      >
                        <Image src="/dogum.png" alt="Doğum Haritası" fill className="object-cover" />
                      </div>
                    </div>

                    <p className="mt-5 text-[15px] leading-relaxed" style={{ color: "var(--text-3)" }}>
                      Sadece güneş burcun değil — yükselen, ay burcu ve tüm gezegen
                      yerleşimlerin ile tam karakter analizini keşfet.
                    </p>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <Link href="/birth-chart" className="btn btn-gold">Haritayı Hesapla →</Link>
                      
                    </div>
                  </div>

                  {/* Tam görsel – sadece desktop */}
                  <div className="hidden lg:block relative w-full">
                    <div
                      className="relative aspect-square rounded-2xl overflow-hidden"
                      style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.65), 0 0 60px rgba(123,94,255,0.22)" }}
                    >
                      <Image src="/dogum.png" alt="Doğum Haritası" fill className="object-cover" />
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Compatibility – narrower */}
            <Link href="/uyumluluk" className="group block lg:col-span-2">
              <div
                className="relative overflow-hidden rounded-3xl h-full flex flex-col p-10"
                style={{
                  minHeight: 300,
                  background: "linear-gradient(145deg, #080F28 0%, #0C1435 100%)",
                  border: "1px solid rgba(56,189,248,0.16)",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "radial-gradient(ellipse at top left, rgba(56,189,248,0.10) 0%, transparent 60%)" }}
                />

                <p className="eyebrow mb-6" style={{ color: "#38BDF8" }}>
                  <span>♥</span>
                  <span>Çift Analizi</span>
                </p>

                <div className="flex items-center justify-center gap-5 mb-8">
                  <div
                    className="flex items-center justify-center rounded-full text-3xl"
                    style={{
                      width: 64, height: 64,
                      background: "rgba(56,189,248,0.08)",
                      border: "1px solid rgba(56,189,248,0.22)",
                      animation: "astroli-float 3.5s ease-in-out infinite",
                    }}
                  >
                    ♈
                  </div>
                  <span style={{ color: "rgba(56,189,248,0.45)", fontSize: 22 }}>⟷</span>
                  <div
                    className="flex items-center justify-center rounded-full text-3xl"
                    style={{
                      width: 64, height: 64,
                      background: "rgba(123,94,255,0.08)",
                      border: "1px solid rgba(123,94,255,0.22)",
                      animation: "astroli-float 3.5s ease-in-out 1.75s infinite",
                    }}
                  >
                    ♎
                  </div>
                </div>

                <h3 className="text-3xl mb-4 flex-1" style={{ fontFamily: "var(--font-serif)" }}>
                  Aşk<br />
                  <span style={{ color: "#38BDF8" }}>Uyumu</span>
                </h3>
                <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-3)" }}>
                  İki doğum tarihi gir, kozmik uyumluluğunu keşfet.
                  Hangi burçlar birbirini tamamlar?
                </p>
                <div
                  className="flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all"
                  style={{ color: "#38BDF8" }}
                >
                  Uyumluluk Testi →
                </div>
              </div>
            </Link>

          </div>
        </Container>
      </section>

   {/* ══════════════ KİŞİLİK TESTLERİ ══════════════ */}
      <section className="py-28" style={{ background: "var(--bg-2)" }}>
        <Container size="lg">

          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="eyebrow mb-3">
                <span style={{ color: "var(--gold)" }}>✦</span>
                <span>Testler</span>
              </p>
              <h2 className="text-4xl sm:text-5xl">Kendini Keşfet</h2>
            </div>
            <Link
              href="/testler"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:gap-3"
              style={{ color: "var(--violet)" }}
            >
              Tümünü Gör →
            </Link>
          </div>

          {/* Featured test – large */}
          {TESTS[0] && (
            <Link href={`/test/${TESTS[0].slug}`} className="group block mb-5">
              <div
                className="relative overflow-hidden rounded-2xl transition-all duration-300 group-hover:-translate-y-1"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <div className="grid lg:grid-cols-[1fr_1.25fr]">
                  <div className="relative h-64 lg:h-auto overflow-hidden">
                    <Image
                      src={TESTS[0].image}
                      alt={TESTS[0].title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 45vw"
                    />
                    <div
                      className="absolute inset-0 hidden lg:block"
                      style={{ background: "linear-gradient(to right, transparent 55%, var(--bg-card) 100%)" }}
                    />
                    <div
                      className="absolute inset-0 lg:hidden"
                      style={{ background: "linear-gradient(to top, var(--bg-card) 0%, transparent 60%)" }}
                    />
                  </div>
                  <div className="p-10 flex flex-col justify-center">
                    <p className="eyebrow mb-5">
                      <span style={{ color: "var(--gold)" }}>✦</span>
                      <span>Öne Çıkan</span>
                    </p>
                    <h3 className="text-3xl mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                      {TESTS[0].title}
                    </h3>
                    <p className="text-[15px] leading-relaxed mb-8" style={{ color: "var(--text-3)" }}>
                      {TESTS[0].description}
                    </p>
                    <div className="flex items-center gap-6 flex-wrap">
                      <span className="btn btn-violet">Testi Başlat →</span>
                      <span className="text-xs" style={{ color: "var(--text-4)" }}>
                        ⏱ {TESTS[0].duration} · {TESTS[0].questionCount} soru
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Smaller tests */}
          <div className="grid gap-4 sm:grid-cols-2">
            {TESTS.slice(1, 3).map((test) => (
              <Link key={test.id} href={`/test/${test.slug}`} className="group block">
                <div
                  className="flex gap-5 rounded-2xl p-5 transition-all duration-300 group-hover:-translate-y-1"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                >
                  <div className="relative flex-shrink-0 rounded-xl overflow-hidden" style={{ width: 72, height: 72 }}>
                    <Image src={test.image} alt={test.title} fill className="object-cover" sizes="72px" />
                  </div>
                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <h3 className="text-sm font-bold truncate" style={{ color: "var(--text)" }}>{test.title}</h3>
                    <p className="text-xs line-clamp-2 leading-relaxed mt-1 mb-2" style={{ color: "var(--text-3)" }}>
                      {test.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: "var(--text-4)" }}>⏱ {test.duration}</span>
                      <span className="text-xs font-semibold" style={{ color: "var(--violet)" }}>Başla →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </Container>
      </section>
      {/* ══════════════ KOZMOSTA NELER VAR ══════════════ */}
      <section className="py-28 relative overflow-hidden" style={{ background: "var(--bg)" }}>

        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{ background: "radial-gradient(ellipse at 25% 60%, rgba(123,94,255,0.05) 0%, transparent 55%)" }}
        />

        <Container size="lg">
          <div className="mb-14">
            <p className="eyebrow mb-3">
              <span style={{ color: "var(--gold)" }}>✦</span>
              <span>Bu Hafta</span>
            </p>
            <h2 className="text-4xl sm:text-5xl">Kozmosta Neler Var?</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {/* Retro Merkezi */}
            <Link href="/retro" className="group block">
              <div
                className="h-full min-h-[320px] rounded-2xl p-8 flex flex-col relative overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <div
                  className="pointer-events-none absolute -top-14 -right-14 h-52 w-52 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(circle, rgba(123,94,255,0.14) 0%, transparent 70%)" }}
                />
                <div
                  className="mb-6 inline-flex items-center justify-center rounded-2xl text-2xl"
                  style={{
                    width: 56, height: 56,
                    background: "var(--violet-soft)",
                    border: "1px solid var(--violet-border)",
                  }}
                >
                  ☿
                </div>
                <h3 className="text-2xl mb-3" style={{ fontFamily: "var(--font-serif)" }}>Retro Merkezi</h3>
                <p className="text-sm leading-loose flex-1" style={{ color: "var(--text-3)" }}>
                  Merkür, Venüs, Mars ve Satürn retrolarını takvim, kişisel analiz
                  ve karar desteğiyle takip et.
                </p>
                <div
                  className="mt-8 pt-5 flex items-center justify-between"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <span
                    className="font-semibold uppercase"
                    style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--text-4)" }}
                  >
                    Gezegen Takibi
                  </span>
                  <span
                    className="text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all"
                    style={{ color: "var(--violet)" }}
                  >
                    Git →
                  </span>
                </div>
              </div>
            </Link>

            {/* Featured zodiac */}
            {featuredZodiac && (
              <Link href={`/burc/${featuredZodiac.id}`} className="group block">
                <div
                  className="h-full min-h-[320px] rounded-2xl p-8 flex flex-col relative overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5"
                  style={{
                    background: "linear-gradient(135deg, rgba(123,94,255,0.14) 0%, rgba(123,94,255,0.04) 100%)",
                    border: "1px solid var(--violet-border)",
                    animation: "astroli-pulse-border 4s ease-in-out infinite",
                  }}
                >
                  <div
                    className="pointer-events-none absolute top-0 right-0 h-56 w-56"
                    style={{ background: "radial-gradient(circle at top right, rgba(123,94,255,0.16) 0%, transparent 65%)" }}
                  />
                  <p className="eyebrow mb-6">Aktif Burç</p>
                  <div className="flex items-center gap-5 flex-1">
                    <div
                      className="relative flex-shrink-0 rounded-2xl overflow-hidden"
                      style={{
                        width: 90, height: 90,
                        border: "1px solid var(--violet-border)",
                        boxShadow: "0 0 32px rgba(123,94,255,0.28)",
                      }}
                    >
                      <Image src={featuredZodiac.image} alt={featuredZodiac.nameTr} fill className="object-cover" />
                    </div>
                    <div>
                      <h3
                        className="leading-tight"
                        style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem" }}
                      >
                        {featuredZodiac.nameTr}
                      </h3>
                      <p className="mt-2 text-xs" style={{ color: "var(--text-3)" }}>{featuredZodiac.dates}</p>
                      <div className="flex items-center gap-2.5 mt-3">
                        <span className={`badge ${ELEMENT_BADGE[featuredZodiac.element] ?? "badge-air"}`}>
                          {ELEMENT_LABELS[featuredZodiac.element]}
                        </span>
                        <span className="text-xs" style={{ color: "var(--text-4)" }}>
                          {featuredZodiac.rulingPlanet}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="mt-8 pt-5 flex items-center justify-between"
                    style={{ borderTop: "1px solid rgba(123,94,255,0.16)" }}
                  >
                    <span
                      className="font-medium"
                      style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-4)" }}
                    >
                      {featuredZodiac.symbol} Karakter Analizi
                    </span>
                    <span
                      className="text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all"
                      style={{ color: "var(--violet)" }}
                    >
                      İncele →
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* 12 Zodiac signs */}
            <Link href="/burclar" className="group block">
              <div
                className="h-full min-h-[320px] rounded-2xl p-8 flex flex-col relative overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <div
                  className="pointer-events-none absolute top-0 right-0 h-56 w-56"
                  style={{ background: "radial-gradient(circle at top right, rgba(212,168,83,0.07) 0%, transparent 65%)" }}
                />

                <h3 className="text-xl mb-1" style={{ fontFamily: "var(--font-serif)" }}>12 Zodyak Burcu</h3>
                <p className="text-sm mb-6" style={{ color: "var(--text-4)" }}>
                  Element enerjisi, güç ve kariyer rehberi
                </p>

                {/* Element grupları */}
                <div className="flex flex-col gap-2.5 flex-1">
                  {ELEMENT_GROUPS.map(({ element, label, color, border, bg, badge }) => {
                    const signs = ZODIAC_SIGNS.filter((s) => s.element === element);
                    return (
                      <div
                        key={element}
                        className="flex items-center gap-3 rounded-xl px-4 py-3"
                        style={{ background: bg, border: `1px solid ${border}` }}
                      >
                        <span className={`badge flex-shrink-0 ${badge}`} style={{ fontSize: 10 }}>
                          {label}
                        </span>
                        <div className="flex gap-3 flex-1 justify-end">
                          {signs.map((s) => (
                            <span
                              key={s.id}
                              className="leading-none"
                              style={{ fontSize: 20, color }}
                              title={s.nameTr}
                            >
                              {s.symbol}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div
                  className="mt-6 pt-5 flex items-center justify-between"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <span
                    className="font-medium uppercase"
                    style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--text-4)" }}
                  >
                    Tüm Burçlar
                  </span>
                  <span
                    className="text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all"
                    style={{ color: "var(--gold)" }}
                  >
                    Keşfet →
                  </span>
                </div>
              </div>
            </Link>

          </div>
        </Container>
      </section>

  

      {/* ══════════════ 12 BURCUN SERGİSİ ══════════════ */}
      <section className="py-24 relative overflow-hidden" style={{ background: "var(--bg)" }}>
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{ background: "radial-gradient(ellipse at center top, rgba(123,94,255,0.05) 0%, transparent 55%)" }}
        />

        <Container size="lg">

          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="eyebrow mb-3">
                <span style={{ color: "var(--gold)" }}>✦</span>
                <span>Zodyak Rehberi</span>
              </p>
              <h2 className="text-4xl sm:text-5xl">12 Burç, 12 Karakter</h2>
            </div>
            <Link
              href="/burclar"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:gap-3"
              style={{ color: "var(--violet)" }}
            >
              Tümünü Gör →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {ZODIAC_SIGNS.map((sign) => {
              const color = ELEMENT_COLOR[sign.element] ?? "#818CF8";
              const glow = ELEMENT_GLOW[sign.element] ?? "rgba(99,102,241,0.18)";
              return (
                <Link key={sign.id} href={`/burc/${sign.id}`} className="group block">
                  <div
                    className="relative overflow-hidden rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-300 group-hover:-translate-y-2"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(ellipse at top, ${glow} 0%, transparent 65%)` }}
                    />
                    <div
                      className="relative mb-3 rounded-2xl overflow-hidden"
                      style={{ width: 64, height: 64, border: `1px solid ${color}30` }}
                    >
                      <Image src={sign.image} alt={sign.nameTr} fill className="object-cover" sizes="64px" />
                    </div>
                    <span className="mb-1.5 leading-none" style={{ fontSize: 22, color }}>{sign.symbol}</span>
                    <h3 className="text-sm font-bold" style={{ color: "var(--text)" }}>{sign.nameTr}</h3>
                    <p className="mt-1 mb-3" style={{ fontSize: 10, color: "var(--text-4)" }}>{sign.dates}</p>
                    <span className={`badge ${ELEMENT_BADGE[sign.element] ?? "badge-air"}`} style={{ fontSize: 10 }}>
                      {ELEMENT_LABELS[sign.element]}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link href="/burclar" className="btn btn-ghost">Tüm Burçları İncele</Link>
          </div>

        </Container>
      </section>

    </div>
  );
}
