import Link from "next/link";
import Image from "next/image";
import { ZODIAC_SIGNS } from "@/data/zodiac";
import { ELEMENT_COLORS } from "@/data/zodiac";
import type { Element } from "@/data/zodiac";

export type CelebrityItem = {
  id: string;
  name: string;
  slug: string;
  job: string;
  zodiac: string;
  image: string | null;
};

function getZodiacInfo(zodiacId: string) {
  const sign = ZODIAC_SIGNS.find((z) => z.id === zodiacId);
  return sign ? { nameTr: sign.nameTr, element: sign.element as Element } : { nameTr: zodiacId, element: "fire" as Element };
}

export function CelebrityCard({ celebrity }: { celebrity: CelebrityItem }) {
  const { nameTr, element } = getZodiacInfo(celebrity.zodiac);
  const color = ELEMENT_COLORS[element] ?? "#6b7280";

  return (
    <Link
      href={`/unluler/${celebrity.slug}`}
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        {celebrity.image ? (
          <Image
            src={celebrity.image}
            alt={celebrity.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-gray-300">
            ♈
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-[#5B3FFF] transition">
          {celebrity.name}
        </h3>
        <p className="mt-0.5 text-sm text-gray-500">{celebrity.job}</p>
        <span
          className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
          style={{ backgroundColor: color }}
        >
          {nameTr}
        </span>
      </div>
    </Link>
  );
}
