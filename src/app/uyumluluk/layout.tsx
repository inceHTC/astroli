import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Burç Uyumluluğu | Astroli",
  description:
    "İki doğum tarihi gir, burç uyum skorunu ve ilişki analizini öğren.",
};

export default function UyumlulukLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
