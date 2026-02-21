import Link from "next/link";
import { SAMPLE_TEST } from "@/data/tests";

export default function AdminTestsPage() {
  return (
    <div className="px-8 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">
            Kişilik Testleri
          </h1>
          <p className="mt-2 text-zinc-500">
            Testleri yönetin, soru ve cevap ekleyin.
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-white">{SAMPLE_TEST.title}</h3>
              <p className="mt-1 text-sm text-zinc-500">{SAMPLE_TEST.description}</p>
              <div className="mt-3 flex gap-2">
                <span className="rounded-full bg-[#d4af37]/10 px-2 py-0.5 text-xs text-[#d4af37]">
                  {SAMPLE_TEST.questionCount} soru
                </span>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-zinc-500">
                  {SAMPLE_TEST.duration}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/test/${SAMPLE_TEST.slug}`}
                target="_blank"
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                Önizle
              </Link>
              <button
                type="button"
                className="rounded-lg bg-[#d4af37] px-4 py-2 text-sm font-medium text-black hover:bg-[#e8c547]"
              >
                Düzenle
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
          <p className="text-zinc-500">Yeni test eklemek için veritabanı entegrasyonu gereklidir.</p>
          <p className="mt-2 text-sm text-zinc-600">
            Phase 2&apos;de CRUD işlemleri eklenecek.
          </p>
        </div>
      </div>
    </div>
  );
}
