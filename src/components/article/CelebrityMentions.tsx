"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Celebrity = { slug: string; name: string; image?: string | null };

type CelebrityMentionsProps = {
  celebrities: Celebrity[];
  children: React.ReactNode;
};

export function CelebrityMentions({ celebrities, children }: CelebrityMentionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ slug: string; name: string; image?: string | null; x: number; y: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const links = el.querySelectorAll<HTMLAnchorElement>("a[data-celebrity-slug]");
    const show = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[data-celebrity-slug]") as HTMLAnchorElement | null;
      if (!a) return;
      const slug = a.getAttribute("data-celebrity-slug");
      const name = a.getAttribute("data-celebrity-name");
      const img = a.getAttribute("data-celebrity-image");
      if (slug && name) {
        setHover({ slug, name, image: img ?? null, x: e.clientX, y: e.clientY });
      }
    };
    const hide = () => setHover(null);
    links.forEach((a) => {
      a.addEventListener("mouseenter", show);
      a.addEventListener("mouseleave", hide);
    });
    return () => {
      links.forEach((a) => {
        a.removeEventListener("mouseenter", show);
        a.removeEventListener("mouseleave", hide);
      });
    };
  }, [children]);

  return (
    <div ref={containerRef} className="relative">
      {children}
      {hover && (
        <div
          className="pointer-events-none fixed z-50 w-56 rounded-xl border border-gray-200 bg-white p-3 shadow-xl"
          style={{
            left: Math.min(hover.x, typeof window !== "undefined" ? window.innerWidth - 240 : hover.x),
            top: hover.y + 16,
          }}
        >
          <Link
            href={`/unluler/${hover.slug}`}
            className="flex items-center gap-3"
            onClick={(e) => e.preventDefault()}
          >
            {hover.image && (
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={hover.image}
                  alt={hover.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
            )}
            <span className="font-medium text-gray-900">{hover.name}</span>
          </Link>
          <p className="mt-1 text-xs text-gray-500">Profil →</p>
        </div>
      )}
    </div>
  );
}
