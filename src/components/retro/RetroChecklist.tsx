"use client";

import { useEffect, useState } from "react";

interface RetroChecklistProps {
  planetLabel: string;
  planetKey: string;
  items: string[];
}

export function RetroChecklist({
  planetLabel,
  planetKey,
  items,
}: RetroChecklistProps) {
  const storageKey = `astroli-retro-checklist-${planetKey}`;
  const [checked, setChecked] = useState<boolean[]>(() =>
    items.map(() => false),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as boolean[];
        if (Array.isArray(parsed) && parsed.length === items.length) {
          setChecked(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, [storageKey, items.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch {
      // ignore
    }
  }, [checked, storageKey]);

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const reset = () => {
    setChecked(items.map(() => false));
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg sm:p-7">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500">
            Bu retroda odaklan
          </p>
          <h2 className="mt-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
            {planetLabel} için kişisel checklist
          </h2>
          <p className="mt-1 text-xs text-gray-600 leading-relaxed">
            Tamamladığın adımlar, tarayıcında saklanır;{" "}
            <span className="font-semibold text-gray-800">sadece sen görürsün</span>.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="rounded-2xl border-2 border-gray-300 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-700 transition hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700"
        >
          Listeyi sıfırla
        </button>
      </div>

      <ul className="relative mt-2 space-y-2">
        {items.map((item, index) => (
          <li
            key={item}
            className="group flex items-start gap-3 rounded-2xl border-2 border-gray-200 bg-gray-50 p-3 text-xs transition hover:border-purple-300 hover:bg-purple-50/30"
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-xl border-2 border-gray-300 bg-white transition group-hover:border-purple-400"
              aria-pressed={checked[index]}
            >
              <span
                className={`inline-flex h-4 w-4 items-center justify-center rounded-lg text-[11px] font-semibold transition ${
                  checked[index]
                    ? "scale-100 bg-gradient-to-br from-emerald-500 to-sky-500 text-white"
                    : "scale-75 bg-transparent text-gray-400"
                }`}
              >
                ✓
              </span>
            </button>
            <div className="space-y-0.5">
              <p
                className={`leading-relaxed transition ${
                  checked[index]
                    ? "text-gray-500 line-through decoration-gray-400 decoration-2"
                    : "text-gray-800 font-medium"
                }`}
              >
                {item}
              </p>
              <p className="text-[10px] text-gray-500">
                {checked[index]
                  ? "Tamamlandı · küçük ama sürdürülebilir adımlar ruh sağlığını destekler."
                  : "Yavaş, küçük ve gerçekçi adımlar her zaman daha sürdürülebilirdir."}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

