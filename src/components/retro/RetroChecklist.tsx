"use client";

import { useEffect, useState } from "react";

interface RetroChecklistProps {
  planetLabel: string;
  planetKey: string;
  items: string[];
}

export function RetroChecklist({ planetLabel, planetKey, items }: RetroChecklistProps) {
  const storageKey = `astroli-retro-checklist-${planetKey}`;
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as boolean[];
        if (Array.isArray(parsed) && parsed.length === items.length) setChecked(parsed);
      }
    } catch { /* ignore */ }
  }, [storageKey, items.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(storageKey, JSON.stringify(checked)); } catch { /* ignore */ }
  }, [checked, storageKey]);

  const toggle = (index: number) => {
    setChecked((prev) => { const next = [...prev]; next[index] = !next[index]; return next; });
  };
  const reset = () => setChecked(items.map(() => false));
  const doneCount = checked.filter(Boolean).length;

  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#0E1523] p-6 sm:p-7">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A78BFA]">
            Bu retroda odaklan
          </p>
          <h2 className="mt-1 text-xl font-bold text-[#EDE9DF] sm:text-2xl">
            {planetLabel} için kişisel checklist
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-[#7A8090]">
            Tamamladığın adımlar tarayıcında saklanır —{" "}
            <span className="text-[#C4C0BA]">sadece sen görürsün</span>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#A78BFA]">
            {doneCount}/{items.length}
          </span>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-white/[0.10] bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-[#7A8090] transition hover:border-white/[0.20] hover:text-[#C4C0BA]"
          >
            Sıfırla
          </button>
        </div>
      </div>

      <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#5C44D0] to-[#A78BFA] transition-all duration-500"
          style={{ width: items.length ? `${(doneCount / items.length) * 100}%` : "0%" }}
        />
      </div>

      <ul className="mt-4 space-y-2">
        {items.map((item, index) => (
          <li
            key={item}
            className="group flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 transition hover:border-[#A78BFA]/25"
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.04] transition group-hover:border-[#A78BFA]/40"
              aria-pressed={checked[index]}
            >
              <span
                className={`inline-flex h-4 w-4 items-center justify-center rounded text-[10px] font-bold transition ${
                  checked[index] ? "bg-emerald-500 text-white scale-100" : "scale-75 text-transparent"
                }`}
              >
                ✓
              </span>
            </button>
            <div className="space-y-0.5">
              <p
                className={`text-sm leading-relaxed transition ${
                  checked[index] ? "text-[#7A8090] line-through" : "font-medium text-[#C4C0BA]"
                }`}
              >
                {item}
              </p>
              <p className="text-[10px] text-[#7A8090]">
                {checked[index]
                  ? "Tamamlandı — küçük adımlar sürdürülebilir büyüme sağlar."
                  : "Yavaş, küçük ve gerçekçi adımlar her zaman daha kalıcıdır."}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
