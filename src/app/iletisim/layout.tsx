import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "İletişim | Astroli",
  description: "Astroli iletişim formu. Soru ve önerileriniz için bize ulaşın.",
  alternates: { canonical: `${getBaseUrl()}/iletisim` },
};

export default function IletisimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
