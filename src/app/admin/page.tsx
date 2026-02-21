import Link from "next/link";
import { ZODIAC_SIGNS } from "@/data/zodiac";
import { SAMPLE_TEST } from "@/data/tests";
import { prisma } from "@/lib/db/client";

export default async function AdminDashboard() {
  let articleCount = 0;
  let celebrityCount = 0;
  try {
    articleCount = await prisma.article.count();
    celebrityCount = await prisma.celebrity.count();
  } catch {
    articleCount = 0;
    celebrityCount = 0;
  }
  const stats = [
    { label: "Aktif Test", value: "1", href: "/admin/tests" },
    { label: "Burç Sayfası", value: String(ZODIAC_SIGNS.length), href: "/admin/zodiac" },
    { label: "Dergi Makalesi", value: String(articleCount), href: "/admin/articles" },
    { label: "Ünlü", value: String(celebrityCount), href: "/admin/celebrities" },
  ];

  return (
    <div className="px-8 pb-16">
      <h1 className="font-display text-2xl font-semibold text-white">
        Dashboard
      </h1>
      <p className="mt-2 text-zinc-500">
        Astroli yönetim paneline hoş geldiniz.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-colors hover:border-[#d4af37]/20 hover:bg-white/[0.04]">
              <p className="text-sm text-zinc-500">{stat.label}</p>
              <p className="mt-2 font-display text-3xl font-semibold text-[#d4af37]">
                {stat.value}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="font-display text-lg font-semibold text-white">
          Hızlı Erişim
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/test/${SAMPLE_TEST.slug}`}
            target="_blank"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-400 hover:bg-white/10 hover:text-blue-900"
          >
            Test Önizleme
          </Link>
          <Link
            href="/burclar"
            target="_blank"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-400 hover:bg-white/10 hover:text-blue-900"
          >
            Burçlar
          </Link>
          <Link
            href="/dergi"
            target="_blank"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-400 hover:bg-white/10 hover:text-blue-900"
          >
            Dergi
          </Link>
        </div>
      </div>
    </div>
  );
}
