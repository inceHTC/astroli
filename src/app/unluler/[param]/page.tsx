import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ZODIAC_SIGNS } from "@/data/zodiac";
import { ELEMENT_COLORS } from "@/data/zodiac";
import type { Element } from "@/data/zodiac";
import {
  getCelebrityBySlug,
  getCelebritiesByZodiacExcluding,
  listCelebritiesByZodiac,
} from "@/lib/db/repositories/celebrity";

const ZODIAC_IDS = ZODIAC_SIGNS.map((z) => z.id);

function getZodiacInfo(zodiacId: string) {
  return ZODIAC_SIGNS.find((z) => z.id === zodiacId);
}

export async function generateStaticParams() {
  const zodiacParams = ZODIAC_IDS.map((zodiac) => ({ param: zodiac }));
  return zodiacParams;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ param: string }>;
}) {
  const { param } = await params;
  if (ZODIAC_IDS.includes(param)) {
    const sign = getZodiacInfo(param);
    return {
      title: `${sign?.nameTr ?? param} Burcu Ünlüler | Astroli`,
      description: `${sign?.nameTr ?? param} burcu ünlüleri listesi.`,
    };
  }
  const celebrity = await getCelebrityBySlug(param);
  if (!celebrity) return {};
  const desc = celebrity.bio?.slice(0, 160) ?? `${celebrity.name} - ${celebrity.job}. ${celebrity.zodiac} burcu.`;
  return {
    title: `${celebrity.name} | Astroli`,
    description: desc,
  };
}

export default async function UnlulerParamPage({
  params,
}: {
  params: Promise<{ param: string }>;
}) {
  const { param } = await params;

  if (ZODIAC_IDS.includes(param)) {
    const sign = getZodiacInfo(param);
    const celebrities = await listCelebritiesByZodiac(param);
    const list = celebrities.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      job: c.job,
      zodiac: c.zodiac,
      image: c.image,
    }));
    return (
      <div className="min-h-screen bg-[#F7F8FC] pb-28">
        <section className="border-b border-gray-200 bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link href="/unluler" className="text-sm text-[#5B3FFF] hover:underline">
              ← Ünlüler
            </Link>
            <h1 className="mt-4 text-4xl font-bold text-black sm:text-5xl">
              {sign?.nameTr ?? param} Burcu Ünlüler
            </h1>
            <p className="mt-4 text-gray-600">
              {sign?.nameTr ?? param} burcundaki ünlüler.
            </p>
          </div>
        </section>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {list.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white py-12 text-center text-gray-500">
              Bu burç için henüz ünlü eklenmemiş.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <ul className="divide-y divide-gray-100">
                {list.map((c) => {
                  const sign = ZODIAC_SIGNS.find((z) => z.id === c.zodiac);
                  const color = sign ? (ELEMENT_COLORS[sign.element as Element] ?? "#6b7280") : "#6b7280";
                  return (
                    <li key={c.id}>
                      <Link
                        href={`/unluler/${c.slug}`}
                        className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 transition hover:bg-gray-50 sm:px-6"
                      >
                        <span className="font-medium text-gray-900">{c.name}</span>
                        <span className="text-sm text-gray-500">{c.job}</span>
                        <span
                          className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                          style={{ backgroundColor: color }}
                        >
                          {sign?.nameTr ?? c.zodiac}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  const celebrity = await getCelebrityBySlug(param);
  if (!celebrity) notFound();

  const sign = getZodiacInfo(celebrity.zodiac);
  const elementColor = sign ? (ELEMENT_COLORS[sign.element as Element] ?? "#6b7280") : "#6b7280";
  const sameZodiac = await getCelebritiesByZodiacExcluding(celebrity.zodiac, celebrity.id, 4);
  const sameList = sameZodiac.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    job: c.job,
    zodiac: c.zodiac,
    image: c.image,
  }));

  return (
    <div className="min-h-screen bg-white pb-28">
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Link href="/unluler" className="text-sm text-gray-500 hover:text-black">
          ← Ünlüler
        </Link>

        <div className="mt-10">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100">
            {celebrity.image ? (
              <Image
                src={celebrity.image}
                alt={celebrity.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 672px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl text-gray-300">
                ♈
              </div>
            )}
          </div>
        </div>

        <header className="mt-10">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-black">
            {celebrity.name}
          </h1>
          <p className="mt-2 text-lg text-gray-600">{celebrity.job}</p>
          <span
            className="mt-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium text-white"
            style={{ backgroundColor: elementColor }}
          >
            {sign?.nameTr ?? celebrity.zodiac}
          </span>
        </header>

        {celebrity.birthDate && (
          <p className="mt-6 text-sm text-gray-500">
            Doğum tarihi:{" "}
            {new Date(celebrity.birthDate).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}

        {celebrity.bio && (
          <div className="mt-8">
            <h2 className="font-serif text-xl font-semibold text-black">Biyografi</h2>
            <p className="mt-4 leading-relaxed text-gray-700 whitespace-pre-line">
              {celebrity.bio}
            </p>
          </div>
        )}

        {sameList.length > 0 && (
          <section className="mt-16 border-t border-gray-200 pt-12">
            <h2 className="font-serif text-xl font-semibold text-black">
              Bu burcun diğer ünlüleri
            </h2>
            <ul className="mt-4 divide-y divide-gray-100 rounded-xl border border-gray-200 bg-gray-50/50 overflow-hidden">
              {sameList.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/unluler/${c.slug}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 transition hover:bg-gray-100 sm:px-5"
                  >
                    <span className="font-medium text-gray-900">{c.name}</span>
                    <span className="text-sm text-gray-500">{c.job}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </div>
  );
}
