import Link from "next/link";

export function RetroHero() {
  return (
    <section className="relative overflow-hidden bg-[#070B12]">
      {/* arka plan ışıkları */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/8 blur-[100px]" />
        <div className="absolute right-1/4 top-20 h-72 w-72 rounded-full bg-indigo-500/6 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#A78BFA]/20 bg-[#A78BFA]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#A78BFA]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A78BFA]" />
            Retro Merkezi · 2026
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-[1.1] tracking-tight text-[#EDE9DF] sm:text-6xl lg:text-7xl">
            Retro, kriz değil —
            <span className="block text-[#A78BFA]">yavaşlama daveti.</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-[#C4C0BA] max-w-2xl mx-auto">
            Merkür, Venüs, Mars ve Satürn retrolarını korku değil{" "}
            <span className="font-semibold text-[#EDE9DF]">farkındalıkla</span> yorumlayan,
            psikoloji temelli modern rehber.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/retro/mercury"
              className="inline-flex items-center gap-2 rounded-full bg-[#5C44D0] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[#5C44D0]/30 transition hover:bg-[#4934B8] hover:shadow-[#5C44D0]/40 hover:scale-[1.02]"
            >
              Retroları Keşfet
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="#takvim"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-7 py-3 text-sm font-medium text-[#C4C0BA] transition hover:bg-white/[0.08] hover:text-[#EDE9DF]"
            >
              Takvimi Gör
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-[#7A8090]">
            {[
              { dot: "bg-emerald-400", label: "Bilinçli karar desteği" },
              { dot: "bg-sky-400",     label: "Psikoloji temelli yorumlar" },
              { dot: "bg-[#A78BFA]",   label: "Korku pazarlaması yok" },
            ].map(({ dot, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* alt çizgi */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    </section>
  );
}
