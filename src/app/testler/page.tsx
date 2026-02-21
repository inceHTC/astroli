import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/layout/Container";
import { TESTS } from "@/data/tests";

export const metadata = {
  title: "Kişilik Testleri | Astroli",
  description:
    "Astroloji temalı kişilik testleri. Eğlenceli ama düşündüren testlerle kendini keşfet.",
};

const CATEGORY_IMAGES: Record<string, string> = {
  love: "/tests/love.png",
  career: "/tests/career.png",
  psychology: "/tests/mind.png",
  spiritual: "/tests/aura.png",
  personality: "/tests/personality.png",
};

export default function TestlerPage() {
  return (
    <div className="bg-[#F7F8FC] pb-28">

      {/* HERO */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(91,63,255,0.06),transparent_60%)]" />
        <Container size="md">
          <div className="relative py-16 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-black">
              Kişilik Testleri
            </h1>
            <p className="mt-4 text-[#444]">
              Kendini keşfetmek için eğlenceli ama düşündüren testler.
            </p>
          </div>
        </Container>
      </section>

      {/* TEST GRID */}
      <section className="mt-16">
        <Container size="lg">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

            {TESTS.map((test) => {
              const image =
                test.image ||
                CATEGORY_IMAGES[test.category] ||
                "/tests/default.png";

              return (
                <Link key={test.id} href={`/test/${test.slug}`}>
                  <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                    {/* Görsel */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <Image
                        src={image}
                        alt={test.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* İçerik */}
                    <div className="p-6">
                      <h2 className="text-lg font-semibold text-black">
                        {test.title}
                      </h2>

                      <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                        {test.description}
                      </p>

                      <div className="mt-4 flex gap-2">
                        <span className="rounded-full bg-[#5B3FFF]/20 px-3 py-1 text-xs text-[#5B3FFF]">
                          {test.duration}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                          {test.questionCount} soru
                        </span>
                      </div>
                    </div>

                  </Card>
                </Link>
              );
            })}

          </div>
        </Container>
      </section>
    </div>
  );
}
