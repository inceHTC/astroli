import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ZODIAC_SIGNS } from "@/data/zodiac";
import { ZodiacCard } from "./ZodiacCard";
import { getBaseUrl } from "@/lib/site-url";

export function generateStaticParams() {
  return ZODIAC_SIGNS.map((z) => ({ sign: z.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sign: string }>;
}): Promise<Metadata> {
  const { sign } = await params;
  const zodiac = ZODIAC_SIGNS.find((z) => z.id === sign);
  if (!zodiac) return {};

  const base = getBaseUrl();
  const title = `${zodiac.nameTr} Burcu ${zodiac.symbol} – Özellikleri ve Analizi | Astroli`;
  const description = zodiac.generalOverview.split("\n\n")[0].slice(0, 155);

  return {
    title,
    description,
    alternates: { canonical: `${base}/burc/${sign}` },
    openGraph: {
      title,
      description,
      url: `${base}/burc/${sign}`,
      type: "website",
    },
  };
}

export default async function BurcPage({
  params,
}: {
  params: Promise<{ sign: string }>;
}) {
  const { sign } = await params;

  const zodiac = ZODIAC_SIGNS.find((z) => z.id === sign);

  if (!zodiac) {
    notFound();
  }

  return (
    <div className="bg-[#070B12] min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-6">
        <ZodiacCard zodiac={zodiac} />
        <p className="mt-8 text-center">
          <Link
            href="/burclar"
            className="text-[#ffc552] font-medium hover:underline"
          >
            ← Tüm burçlara dön
          </Link>
        </p>
      </div>
    </div>
  );
}
