import type { Metadata } from "next";
import { TESTS } from "@/data/tests";
import { TestlerClient } from "./TestlerClient";

export const metadata: Metadata = {
  title: "Astroloji & Kişilik Testleri | Ruh Eşin, Tarot Kartın, Önceki Yaşamın | Astroli",
  description:
    "Ruh eşin hangi burçtan? Tarot kartın hangisi? Önceki hayatında kimdin? 2025 enerjin ne? 26 ücretsiz astroloji kişilik testiyle kendinle yüzleş. Eğlenceli, paylaşılabilir ve gerçek.",
  keywords: [
    "astroloji testi",
    "kişilik testi",
    "burç testi",
    "ruh eşi testi",
    "tarot kartı testi",
    "önceki yaşam testi",
    "2025 burç yorumu",
    "element testi",
    "hangi burçsun",
    "burç uyumu testi",
  ],
  openGraph: {
    title: "Astroloji & Kişilik Testleri | Astroli",
    description: `${TESTS.length} ücretsiz astroloji testi — Ruh eşin, tarot kartın, önceki yaşamın ve 2025 enerjini keşfet.`,
    type: "website",
  },
  alternates: {
    canonical: "/testler",
  },
};

export default function TestlerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Astroloji Kişilik Testleri",
            description:
              "Burç ve element enerjilerine dayalı kişilik testleri. Ruh eşin, tarot kartın, önceki yaşamın ve 2025 enerjini keşfet.",
            hasPart: TESTS.map((t) => ({
              "@type": "Quiz",
              name: t.title,
              description: t.description,
              url: `/test/${t.slug}`,
            })),
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "/" },
                { "@type": "ListItem", position: 2, name: "Kişilik Testleri", item: "/testler" },
              ],
            },
          }),
        }}
      />
      <TestlerClient />
    </>
  );
}
