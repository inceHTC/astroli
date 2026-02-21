import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Burçlara Göre Meslekler | Astroli",
  description:
    "Burcuna göre hangi mesleklerde başarılı olabilirsin? Filtrele, ara ve keşfet.",
};

export default function MesleklerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
