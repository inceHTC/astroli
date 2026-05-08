import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Burçlara Göre Meslekler | Astroli",
  description:
    "Burcuna göre hangi mesleklerde başarılı olabilirsin? Filtrele, ara ve keşfet.",
  alternates: { canonical: `${getBaseUrl()}/burclar/meslekler` },
};

export default function MesleklerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
