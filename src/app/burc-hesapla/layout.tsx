import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Burç Hesapla | Güneş, Yükselen, Ay Burcu | Astroli",
  description:
    "Doğum tarihi ve saatiyle güneş, yükselen ve ay burcunu hesapla. Ücretsiz ve anında.",
  alternates: { canonical: `${getBaseUrl()}/burc-hesapla` },
};

export default function BurcHesaplaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
