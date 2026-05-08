import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Doğum Haritası | Astroli",
  description:
    "Doğum tarihi, saati ve yerine göre gezegen konumları, yükselen ve açılar. Güneş, Ay, Merkür ve tüm gezegenlerin burç analizi.",
  alternates: { canonical: `${getBaseUrl()}/birth-chart` },
  openGraph: {
    title: "Doğum Haritası | Astroli",
    description: "Doğum haritanı hesapla. Gezegen konumları, yükselen ve açılar.",
  },
};

export default function BirthChartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
