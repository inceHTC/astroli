import Link from "next/link";
import { notFound } from "next/navigation";
import { ZODIAC_SIGNS } from "@/data/zodiac";
import { ZodiacCard } from "./ZodiacCard";

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
    <div className="bg-[#F7F8FC] min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-6">
        <ZodiacCard zodiac={zodiac} />
        <p className="mt-8 text-center">
          <Link
            href="/burclar"
            className="text-[#5B3FFF] font-medium hover:underline"
          >
            ← Tüm burçlara dön
          </Link>
        </p>
      </div>
    </div>
  );
}
