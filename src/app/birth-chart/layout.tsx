import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doğum Haritası | Astroli",
  description:
    "Doğum tarihi, saati ve yerine göre gezegen konumları, yükselen ve açılar. Güneş, Ay, Merkür ve tüm gezegenlerin burç analizi.",
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
