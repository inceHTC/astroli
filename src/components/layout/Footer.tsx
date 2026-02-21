"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { NAV_LINKS, FOOTER_EXTRA_LINKS } from "@/lib/nav";

const FOOTER_COLUMNS = 4;

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  const allLinks = [...NAV_LINKS, ...FOOTER_EXTRA_LINKS];
  const perCol = Math.ceil(allLinks.length / FOOTER_COLUMNS);
  const columns = Array.from({ length: FOOTER_COLUMNS }, (_, i) =>
    allLinks.slice(i * perCol, (i + 1) * perCol)
  );

  return (
    <footer className="mt-24 border-t border-white/10 bg-[#1A163E]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <Link href="/" className="flex items-center self-center sm:self-auto">
            <Image
              src="/logo1.png"
              alt="Astroli Logo"
              width={120}
              height={25}
              priority
              className="h-16 w-auto sm:h-20"
            />
          </Link>
          <nav className="grid w-full grid-cols-2 gap-x-6 gap-y-4 px-6 sm:px-0 sm:w-auto sm:grid-cols-4 sm:flex-1 sm:justify-end sm:gap-x-10">
            {columns.map((colLinks, i) => (
              <div key={i} className="flex flex-col gap-3">
                {colLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-gray-100 hover:text-[#5B3FFF] transition"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-8 flex justify-center border-t border-white/10 pt-8">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Astroli. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
