import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Burç Uyumluluğu | Astroli",
  description:
    "İki doğum tarihi gir, burç uyum skorunu ve ilişki analizini öğren.",
  alternates: { canonical: `${getBaseUrl()}/uyumluluk` },
};

export default function UyumlulukLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
