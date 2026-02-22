"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { NAV_LINKS } from "@/lib/nav";

export function Header({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Admin header ayrı
  if (pathname?.startsWith("/admin")) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#11121A]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/admin" className="text-lg font-semibold text-[#5B3FFF]">
            Astroli Admin
          </Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition">
            Siteye Dön
          </Link>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-[#1A163E] backdrop-blur-md">
        <div className="mx-auto flex h-14 md:h-16 max-w-7xl items-center gap-2 pl-3 pr-3 md:pl-4 md:pr-4 md:gap-4">
          {/* SOL: Logo – dar ve sabit, sola yaslı */}
          <Link href="/" className="flex flex-shrink-0 items-center py-2">
            <Image
              src="/logo1.png"
              alt="Astroli Logo"
              width={100}
              height={100}
              priority
              className="h-8 w-auto md:h-9 object-contain object-left"
            />
          </Link>

          {/* ORTA: Menü linkleri – kalan alanda tek satır, küçük gap; taşarsa yatay kaydırma */}
          <nav className="hidden md:flex flex-1 min-w-0 items-center justify-center overflow-x-auto overflow-y-hidden py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center gap-1.5 md:gap-2 flex-nowrap">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative rounded px-2 py-1.5 text-xs font-medium text-gray-100 hover:text-[#5B3FFF] hover:bg-white/5 transition whitespace-nowrap flex-shrink-0"
                  >
                    {link.label}
                    {active && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#5B3FFF] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* SAĞ: Butonlar – her zaman görünür, taşmaz */}
          <div className="flex flex-shrink-0 items-center gap-2 md:gap-3 ml-auto">
            <div className="hidden md:flex items-center gap-2">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center rounded-lg border border-[#5B3FFF] bg-transparent px-3 py-1.5 text-xs font-medium text-[#8C7BFF] hover:bg-[#5B3FFF]/10 transition whitespace-nowrap"
                >
                  Admin Panel
                </Link>
              )}
              <Link
                href="/burc-hesapla"
                className="inline-flex items-center justify-center rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-[#1A163E] hover:bg-gray-100 transition whitespace-nowrap"
              >
                Burç Hesapla
              </Link>
            </div>

            {/* MOBILE: Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded text-white hover:bg-white/10 md:hidden transition"
              aria-label="Menü"
            >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* MOBILE PANEL */}
      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-72 flex-col bg-[#1A163E] border-l border-white/10 shadow-xl transition-transform duration-300 md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-1 flex-col min-h-0 p-4">
          <div className="flex flex-shrink-0 items-center justify-between">
            <span></span>
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded p-2 text-gray-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Kapat"
            >
              ✕
            </button>
          </div>

          <nav className="mt-3 flex flex-col gap-0.5">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded px-4 py-2 text-base transition ${
                    active
                      ? "bg-[#5B3FFF]/20 text-[#faf9fc]"
                      : "text-gray-100 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-shrink-0 flex-col gap-2 pt-3 mt-3 border-t border-white/10">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="block rounded border border-[#5B3FFF] px-4 py-2.5 text-center text-sm font-medium text-[#8C7BFF] hover:bg-[#5B3FFF]/10 transition"
              >
                Admin Panel
              </Link>
            )}
            <Link
              href="/burc-hesapla"
              onClick={() => setMobileOpen(false)}
              className="block rounded border border-transparent bg-white px-4 py-2.5 text-center text-sm font-medium text-[#1A163E] hover:bg-gray-100 transition"
            >
              Burç Hesapla
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
