"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SIDEBAR_LINKS = [
  { href: "/admin", label: "Dashboard", icon: "◈" },
  { href: "/admin/tests", label: "Testler", icon: "✦" },
  { href: "/admin/zodiac", label: "Burçlar", icon: "♈" },
  { href: "/admin/horoscope/daily", label: "Günlük Burç", icon: "☀️" },
  { href: "/admin/horoscope/weekly", label: "Haftalık Burç", icon: "📅" },
  { href: "/admin/cosmic-energy", label: "Kozmik Enerji", icon: "☄" },
  { href: "/admin/celebrities", label: "Ünlüler", icon: "★" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-64 border-r border-white/[0.06] bg-[#0a0a0f] lg:block">
      <nav className="flex flex-col gap-1 p-4">
        {SIDEBAR_LINKS.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#ffc552]/10 text-[#ffc552]"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
