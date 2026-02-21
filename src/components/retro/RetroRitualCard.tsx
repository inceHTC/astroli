interface RetroRitualCardProps {
  title: string;
  description: string;
  duration: string;
  focus: string;
}

export function RetroRitualCard({
  title,
  description,
  duration,
  focus,
}: RetroRitualCardProps) {
  return (
    <article className="group relative flex flex-col justify-between rounded-3xl border-2 border-gray-200 bg-white p-4 text-xs shadow-md transition hover:border-purple-300 hover:shadow-lg">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="text-[13px] leading-relaxed text-gray-700">
          {description}
        </p>
      </div>

      <div className="relative mt-3 flex items-center justify-between text-[11px] text-gray-600">
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-700">
          ⏱ {duration}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-[10px] font-medium text-purple-700">
          Odak: {focus}
        </span>
      </div>
    </article>
  );
}

