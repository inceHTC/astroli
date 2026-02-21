import type { Metadata } from "next";
import Link from "next/link";
import { RetroPersonalAnalyzer } from "@/components/retro/RetroPersonalAnalyzer";
import { getBaseUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Kişisel Retro Analizi – Kararlarına Psikolojik Destek | Astroli",
  description:
    "Doğum tarihin, burcun ve karar türüne göre 3 öneri, 2 dikkat noktası ve 1 psikolojik içgörü ile kişisel retro analizi. Yasaklayıcı değil, destekleyici dil.",
  openGraph: {
    title: "Kişisel Retro Analizi – Astroli",
    description:
      "Retro dönemlerini kriz değil, farkındalık ve psikolojik denge dönemi olarak ele alan kişisel analiz modülü.",
    url: `${getBaseUrl()}/retro/kisisel-analiz`,
    type: "website",
  },
  alternates: {
    canonical: `${getBaseUrl()}/retro/kisisel-analiz`,
  },
};

export default function RetroKisiselAnalizPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-10 text-gray-900">
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="mb-6">
          <Link
            href="/retro"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-purple-600"
          >
            <span aria-hidden>←</span>
            Retro Merkezi&apos;ne dön
          </Link>
        </p>
        <RetroPersonalAnalyzer />
        <p className="mt-10 border-t border-gray-200 pt-6">
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

