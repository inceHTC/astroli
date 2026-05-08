import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ZODIAC_SIGNS, ELEMENT_LABELS } from "@/data/zodiac";
import type { Element } from "@/data/zodiac";
import { getBaseUrl } from "@/lib/site-url";

const ELEMENT_BADGE: Record<string, string> = {
  fire:  "bg-orange-500/15 text-orange-400",
  earth: "bg-emerald-500/15 text-emerald-400",
  air:   "bg-sky-500/15 text-sky-400",
  water: "bg-indigo-500/15 text-indigo-400",
};

export const metadata: Metadata = {
  title: "Burçlar | Astroli",
  description: "12 burcun özellikleri, güçlü yönleri ve zayıf yönleri.",
  alternates: { canonical: `${getBaseUrl()}/burclar` },
};

export default function BurclarPage() {
  return (
    <div className="bg-[#070B12] pb-28">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#070B12]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(91,63,255,0.06),transparent_60%)]" />
        <Container size="lg">
          <div className="relative py-20 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#EDE9DF]">
              12 Zodyak Burcu
            </h1>
            <p className="mt-6 text-lg text-[#C4C0BA]">
              Burcunun güçlü yönlerini, zayıf taraflarını ve element enerjini keşfet.
            </p>
          </div>
        </Container>
      </section>

      {/* GRID */}
      <section className="mt-16">
        <Container size="lg">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ZODIAC_SIGNS.map((sign) => (
              <Link key={sign.id} href={`/burc/${sign.id}`} className="group">
                <div className="bg-[#0E1523] rounded-2xl border border-white/[0.07] p-6 transition hover:-translate-y-1 hover:shadow-lg hover:border-[#5C44D0]/40">
                  <div className="mb-5 flex items-center justify-center rounded-2xl bg-[#151B2E] py-8">
                    <span className="text-7xl">{sign.symbol}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    {sign.nameTr}
                  </h2>
                  <p className="mt-1 text-sm text-[#A8A4A0]">
                    {sign.dates}
                  </p>
                  <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${ELEMENT_BADGE[sign.element] ?? "bg-white/10 text-white/60"}`}>
                    {ELEMENT_LABELS[sign.element as Element]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="mt-24">
        <Container size="lg">
          <div className="rounded-2xl bg-[#0E1523] border border-white/[0.07] p-10 text-center">
            <h2 className="text-2xl font-semibold text-[#EDE9DF]">
              Burcunla Uyumunu Öğrenmek İster misin?
            </h2>
            <p className="mt-4 text-[#C4C0BA]">
              Doğum tarihini gir ve yükselen burcunu keşfet.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/burc-hesapla"
                className="inline-flex items-center rounded-full bg-[#5C44D0] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#5C44D0]/25 transition hover:bg-[#4934B8]"
              >
                Hemen Hesapla
              </Link>
              <Link
                href="/burclar/meslekler"
                className="inline-flex items-center rounded-full border border-white/[0.12] bg-white/[0.04] px-6 py-3 text-sm font-medium text-[#C4C0BA] transition hover:bg-white/[0.07] hover:text-[#EDE9DF]"
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
