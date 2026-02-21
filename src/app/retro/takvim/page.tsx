import type { Metadata } from "next";
import Link from "next/link";
import { RetroCalendar } from "@/components/retro/RetroCalendar";
import { getBaseUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Retro Takvimi 2026 – Merkür, Venüs, Mars ve Satürn Retroları | Astroli",
  description:
    "Merkür, Venüs, Mars ve Satürn retrolarının 2026 tarihleri, gölge dönemleri ve psikolojik temalarıyla birlikte modern, etkileşimli retro takvimi.",
  openGraph: {
    title: "Retro Takvimi 2026 – Astroli",
    description:
      "Yaklaşan ve aktif retroları, gün sayacı ve psikolojik odaklarıyla takip et. Korkutucu değil, planlamaya yardımcı bir takvim.",
    url: `${getBaseUrl()}/retro/takvim`,
    type: "website",
  },
  alternates: {
    canonical: `${getBaseUrl()}/retro/takvim`,
  },
};

export default function RetroTakvimPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-10 text-gray-900">
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500">
            Retro merkezi
          </p>
          <h1 className="bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 bg-clip-text text-2xl font-semibold text-transparent sm:text-3xl">
            2026 Retro Takvimi
          </h1>
          <p className="max-w-2xl text-sm text-gray-700">
            Bu takvim, retro dönemlerini “hayat durmalı” baskısıyla değil,{" "}
            <span className="font-semibold text-gray-900">farkındalık ve planlama</span>{" "}
            perspektifiyle sunar. Hangi gezegen gerilerse gerilesin; amaç, kriz
            değil{" "}
            <span className="font-semibold text-gray-900">
              ritmini yavaşlatan bir kontrol noktası
            </span>
            .
          </p>
        </header>

        <RetroCalendar />

        <section className="space-y-2 rounded-3xl border-2 border-gray-200 bg-white p-5 text-xs text-gray-700 shadow-lg">
          <h2 className="text-sm font-semibold text-gray-900">
            Bu takvimi nasıl kullanmalısın?
          </h2>
          <ul className="space-y-1.5 text-gray-700 leading-relaxed">
            <li>
              · Büyük kararları yasaklamak yerine,{" "}
              <span className="font-semibold text-gray-900">netleştirme ve tekrar kontrol</span>{" "}
              dönemleri olarak düşün.
            </li>
            <li>
              · Sadece dış olaylara değil,{" "}
              <span className="font-semibold text-gray-900">
                iç dünyandaki tekrar eden döngülere
              </span>{" "}
              de bak.
            </li>
            <li>
              · Karar alırken, zaman baskısı altında kaldığını fark edersen; bu
              takvimi{" "}
              <span className="text-gray-900">
                “mola ver, bir kez daha düşün” hatırlatıcısı
              </span>{" "}
              olarak kullan.
            </li>
          </ul>
        </section>

        <p className="border-t border-gray-200 pt-6">
          <Link
            href="/retro"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-purple-600"
          >
            <span aria-hidden>←</span>
            Retro Merkezi&apos;ne dön
          </Link>
        </p>
      </main>
    </div>
  );
}

