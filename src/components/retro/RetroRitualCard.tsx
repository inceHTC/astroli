interface RetroRitualCardProps {
  title: string;
  description: string;
  duration: string;
  focus: string;
}

export function RetroRitualCard({ title, description, duration, focus }: RetroRitualCardProps) {
  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-[#0E1523] p-5 transition hover:border-[#5C44D0]/30 hover:bg-[#121929]">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-[#EDE9DF]">{title}</h3>
        <p className="text-[13px] leading-relaxed text-[#C4C0BA]">{description}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium text-[#7A8090]">
          ⏱ {duration}
        </span>
        <span className="inline-flex items-center rounded-full border border-[#A78BFA]/20 bg-[#A78BFA]/8 px-2.5 py-1 text-[10px] font-medium text-[#A78BFA]">
          {focus}
        </span>
      </div>
    </article>
  );
}
