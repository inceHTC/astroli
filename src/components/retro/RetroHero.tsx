import Link from "next/link";

export function RetroHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-indigo-50/30 to-sky-50/50 text-gray-900">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="absolute -right-24 top-40 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:py-20 lg:px-8">
        <div className="flex-1 space-y-6">
          <p className="inline-flex items-center rounded-full border border-purple-300 bg-purple-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-purple-700">
            Retro Merkezi · Farkındalık Dönemi
          </p>
          <h1 className="bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 bg-clip-text text-4xl font-semibold leading-tight text-transparent sm:text-5xl lg:text-6xl">
            Retro, kriz değil
            <span className="block text-gray-800">bilinçli yavaşlama daveti.</span>
          </h1>
          <p className="max-w-xl text-base text-gray-700 sm:text-lg leading-relaxed">
            Astroloji, psikoloji ve modern yaşam ritmini birleştiren interaktif bir{" "}
            <span className="font-semibold text-purple-700">
              Retro Merkezi
            </span>
            . Korku pazarlaması olmadan, bilimsel dengeyle, kararlarını sakinleştiren rehberlik.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/retro/kisisel-analiz"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:translate-y-0.5 hover:shadow-xl hover:shadow-purple-300"
            >
              Kişisel Retro Analizi Yap
            </Link>
            <Link
              href="/retro/takvim"
              className="inline-flex items-center justify-center rounded-2xl border-2 border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700"
            >
              Retro Takvimini Gör
            </Link>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Bilinçli karar desteği</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              <span>Psikoloji temelli yorumlar</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              <span>Astrolojik & bilimsel denge</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-1 justify-center lg:mt-0">
          <div className="relative h-72 w-full max-w-sm rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-xl">
            <div className="relative flex h-full flex-col justify-between">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.24em] text-gray-500 font-medium">
                  Aktif / Yaklaşan Retrolar
                </p>
                <p className="text-sm font-medium text-gray-800 leading-relaxed">
                  Takvimini retro korkusuna göre değil,{" "}
                  <span className="text-purple-600 font-semibold">bilinçli farkındalığa göre</span>{" "}
                  planla.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-gray-600">
                  <span className="font-medium">Merkür Retrosu</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-700 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Farkındalık dönemi
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-purple-400" />
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  İletişim, kontratlar ve zihinsel tempo için{" "}
                  <span className="font-medium text-gray-800">yeniden gözden geçirme</span>{" "}
                  zamanı.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-0 py-3 text-[11px] text-gray-700">
                <span className="font-medium">Bugünden itibaren rehberlik al.</span>
                <span className="rounded-full bg-purple-100 px-3 py-1 text-[10px] font-medium text-purple-700">
                  3 adımlı karar analizi
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

