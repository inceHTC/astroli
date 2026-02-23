import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/client";

export default async function EditTestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const test = await prisma.test.findUnique({
    where: { id },
    include: { _count: { select: { questions: true } } },
  });
  if (!test) notFound();

  return (
    <div className="px-8 pb-16">
      <Link
        href="/admin/tests"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-white"
      >
        ← Testlere dön
      </Link>
      <h1 className="mt-6 font-display text-2xl font-semibold text-white">
        Testi düzenle: {test.title}
      </h1>
      <p className="mt-2 text-zinc-500">
        {test._count.questions} soru · {test.duration}
      </p>
      <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-6 text-zinc-400">
        Soru, seçenek ve sonuç şablonu düzenleme arayüzü yakında eklenecek. Şimdilik testi yalnızca oluşturabilirsiniz.
      </div>
      <div className="mt-4 flex gap-3">
        <Link
          href={`/test/${test.slug}`}
          target="_blank"
          className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
        >
          Önizle
        </Link>
        <Link
          href="/admin/tests"
          className="rounded-lg bg-[#d4af37] px-4 py-2 text-sm font-medium text-black hover:bg-[#e8c547]"
        >
          Testlere dön
        </Link>
      </div>
    </div>
  );
}
