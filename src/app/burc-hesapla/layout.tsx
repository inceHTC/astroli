import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Burç Hesapla | Güneş, Yükselen, Ay Burcu | Astroli",
  description:
    "Doğum tarihi ve saatiyle güneş, yükselen ve ay burcunu hesapla. Ücretsiz ve anında.",
};

export default function BurcHesaplaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
