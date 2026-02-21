"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/utils/content";

type ArticleTOCProps = {
  toc: TocItem[];
};

export function ArticleTOC({ toc }: ArticleTOCProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const els = toc.map((t) => document.getElementById(t.id)).filter(Boolean);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActiveId(e.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    els.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [toc]);

  return (
    <nav
      className="editorial-toc sticky top-24 rounded-xl border border-gray-200 bg-gray-50/80 p-4 backdrop-blur-sm"
      aria-label="İçindekiler"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        İçindekiler
      </p>
      <ul className="space-y-1.5">
        {toc.map((item) => (
          <li
            key={item.id}
            className={item.level === 3 ? "pl-3" : ""}
          >
            <a
              href={`#${item.id}`}
              className={`block rounded-md py-1 text-sm transition hover:text-[#5B3FFF] ${
                activeId === item.id
                  ? "font-medium text-[#5B3FFF]"
                  : "text-gray-600"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
