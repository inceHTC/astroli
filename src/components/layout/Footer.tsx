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
    <footer className="border-t border-white/[0.06] bg-[#040710]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-4 self-start sm:self-auto">
            <Link href="/">
              <Image src="/logo1.png" alt="Astroli" width={120} height={25} priority className="h-14 w-auto" />
            </Link>
            <p className="max-w-[200px] text-xs leading-relaxed text-[#7A8090]">
              Natal haritandan retrograd takibine, gökyüzünü oku.
            </p>
          </div>

          <nav className="grid w-full grid-cols-2 gap-x-6 gap-y-3 sm:w-auto sm:grid-cols-4 sm:gap-x-10">
            {columns.map((colLinks, i) => (
              <div key={i} className="flex flex-col gap-3">
                {colLinks.map((link) => (
                  <Link key={link.href} href={link.href}
                    className="text-sm text-[#C4C0BA] hover:text-[#A78BFA] transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex justify-center border-t border-white/[0.06] pt-8">
          <p className="text-xs text-[#7A8090]">
            &copy; {new Date().getFullYear()} Astroli. Tum haklari saklidir.
          </p>
        </div>
      </div>
    </footer>
  );
}
