import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ZODIAC_SIGNS } from "@/data/zodiac";


const ELEMENT_LABELS: Record<string, string> = {
  fire: "Ateş",
  earth: "Toprak",
  air: "Hava",
  water: "Su",
};

const ELEMENT_COLORS: Record<string, string> = {
  fire: "bg-red-500/10 text-red-500",
  earth: "bg-green-500/10 text-green-600",
  air: "bg-purple-500/10 text-purple-600",
  water: "bg-blue-500/10 text-blue-600",
};

export const metadata = {
  title: "Burçlar | Astroli",
  description: "12 burcun özellikleri, güçlü yönleri ve zayıf yönleri.",
};

export default function BurclarPage() {
  return (
    <div className="bg-[#F7F8FC] pb-28">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(91,63,255,0.06),transparent_60%)]" />

        <Container size="lg">
          <div className="relative py-20 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-black">
              12 Zodyak Burcu
            </h1>
            <p className="mt-6 text-lg text-[#444]">
              Burcunun güçlü yönlerini, zayıf taraflarını ve element enerjini keşfet.
            </p>
          </div>
        </Container>
      </section>

      {/* ================= GRID ================= */}
      <section className="mt-16">
        <Container size="lg">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ZODIAC_SIGNS.map((sign) => (
              <Link
                key={sign.id}
                href={`/burc/${sign.id}`}
                className="group"
              >
                <div className="bg-[#11121A] text-white rounded-2xl p-6 transition hover:-translate-y-1 hover:shadow-lg">

                  {/* Görsel Alanı */}
                <div className="mb-6 flex items-center justify-center rounded-2xl bg-[#1A1C2B] py-10">
  <span className="text-7xl md:text-8xl">
    {sign.symbol}
  </span>
</div>


                  <h2 className="text-xl font-semibold">
                    {sign.nameTr}
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    {sign.dates}
                  </p>

                  <span
                    className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-medium ${ELEMENT_COLORS[sign.element]}`}
                  >
                    {ELEMENT_LABELS[sign.element]}
                  </span>

                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="mt-24">
        <Container size="lg">
          <div className="rounded-2xl bg-white border border-gray-200 p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-black">
              Burcunla Uyumunu Öğrenmek İster misin?
            </h2>
            <p className="mt-4 text-[#444]">
              Doğum tarihini gir ve yükselen burcunu keşfet.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/burc-hesapla"
                className="inline-block rounded-xl bg-[#1A163E] px-6 py-3 text-white hover:bg-[#3b3278] transition"
              >
                Hemen Hesapla
              </Link>
              <Link
                href="/burclar/meslekler"
                className="inline-block rounded-xl border border-gray-200 px-6 py-3 text-black hover:bg-gray-50 transition"
              >
                Burçlara Göre Meslekler
              </Link>
            </div>
          </div>
        </Container>
      </section>

    </div>
  );
}
