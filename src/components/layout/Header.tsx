"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type NavItem = { href: string; label: string; desc: string };
type NavGroup = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Burçlar",
    items: [
      { href: "/burclar",           label: "Burç Rehberi",   desc: "12 burç detaylı analizi"      },
      { href: "/gunluk-burc",       label: "Günlük Burç",    desc: "Bugükü kozmik yorumlar"      },
      { href: "/haftalik-burc",     label: "Haftalık Burç",  desc: "Bu haftanın enerjisi"         },
      { href: "/burclar/meslekler", label: "Burç & Meslek",  desc: "Kariyer ve iş uyumu"          },
    ],
  },
  {
    label: "Araçlar",
    items: [
      { href: "/retro",       label: "Retro Merkezi",    desc: "Retrograd analizleri"   },
      { href: "/testler",     label: "Kişilik Testleri", desc: "Kendinizi keşfedin"     },
      { href: "/uyumluluk",   label: "Uyumluluk",        desc: "Burç uyum analizi"      },
      { href: "/birth-chart", label: "Doğum Haritası",   desc: "Natal harita"           },
      { href: "/unluler",     label: "Ünlüler",          desc: "Ünlülerin burçları"     },
    ],
  },
];

const STANDALONE = [{ href: "/iletisim", label: "İletişim" }];

function isActive(href: string, pathname: string | null) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Header({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExp, setMobileExp] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => { setMobileOpen(false); setMobileExp(null); }, [pathname]);

  if (pathname?.startsWith("/admin")) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#070B12]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/admin" className="text-base font-semibold text-[#A78BFA]">Astroli Admin</Link>
          <Link href="/" className="text-sm text-[#C4C0BA] hover:text-[#EDE9DF] transition">Siteye Dön</Link>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        <div className="absolute inset-0 bg-[#070B12]/95 backdrop-blur-xl border-b border-white/[0.06]" />

        <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 md:px-6">
          <Link href="/" className="flex flex-shrink-0 items-center">
            <Image src="/logo1.png" alt="Astroli" width={100} height={100} priority className="h-10 w-auto object-contain" />
          </Link>

          <nav ref={navRef} className="hidden md:flex flex-1 items-center justify-center gap-0.5">
            {NAV_GROUPS.map((group) => {
              const groupActive = group.items.some(i => isActive(i.href, pathname));
              const isOpen = open === group.label;
              return (
                <div key={group.label} className="relative" onMouseEnter={() => setOpen(group.label)} onMouseLeave={() => setOpen(null)}>
                  <button className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                    groupActive || isOpen ? "text-[#EDE9DF] bg-white/[0.07]" : "text-[#C4C0BA] hover:text-[#EDE9DF] hover:bg-white/[0.04]"
                  }`}>
                    {group.label}
                    <svg className={`h-3.5 w-3.5 opacity-50 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 z-50">
                      <div className="h-2" />
                      <div className="w-64 rounded-2xl bg-[#0C1220]/98 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/60 p-1.5">
                        {group.items.map((item) => {
                          const active = isActive(item.href, pathname);
                          return (
                            <Link key={item.href} href={item.href}
                              className={`flex flex-col rounded-xl px-4 py-3 transition-colors ${
                                active ? "bg-[#A78BFA]/10 text-[#A78BFA]" : "text-[#C4C0BA] hover:bg-white/[0.05] hover:text-[#EDE9DF]"
                              }`}
                            >
                              <span className="text-sm font-medium leading-none">{item.label}</span>
                              <span className="mt-1 text-xs text-[#7A8090] leading-tight">{item.desc}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {STANDALONE.map(link => (
              <Link key={link.href} href={link.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                  pathname === link.href ? "text-[#EDE9DF] bg-white/[0.07]" : "text-[#C4C0BA] hover:text-[#EDE9DF] hover:bg-white/[0.04]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-shrink-0 items-center gap-3 ml-auto md:ml-0">
            <div className="hidden md:flex items-center gap-2.5">
              {isAdmin && (
                <Link href="/admin" className="rounded-lg border border-[#A78BFA]/30 px-3 py-1.5 text-xs font-medium text-[#A78BFA] hover:bg-[#A78BFA]/8 transition">
                  Admin Panel
                </Link>
              )}
              <Link href="/burc-hesapla"
                className="group inline-flex items-center gap-2 rounded-full bg-[#5C44D0] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#5C44D0]/25 transition-all hover:bg-[#4934B8] hover:scale-[1.03]"
              >
                Burç Hesapla
                <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-[#C4C0BA] hover:text-[#EDE9DF] hover:bg-white/[0.07] md:hidden transition" aria-label="Menu">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />}

      <div className={`fixed top-0 right-0 z-50 h-full w-80 bg-[#070B12] border-l border-white/[0.06] shadow-2xl transition-transform duration-300 md:hidden flex flex-col ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <Link href="/" onClick={() => setMobileOpen(false)}>
            <Image src="/logo1.png" alt="Astroli" width={80} height={80} className="h-8 w-auto" />
          </Link>
          <button onClick={() => setMobileOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#C4C0BA] hover:text-[#EDE9DF] hover:bg-white/[0.07] transition">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <button onClick={() => setMobileExp(mobileExp === group.label ? null : group.label)}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-[#EDE9DF] hover:bg-white/[0.05] transition">
                {group.label}
                <svg className={`h-4 w-4 text-[#7A8090] transition-transform ${mobileExp === group.label ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileExp === group.label && (
                <div className="mt-0.5 ml-3 pl-3 border-l border-white/[0.06] space-y-0.5">
                  {group.items.map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                      className={`flex flex-col rounded-lg px-3 py-2.5 transition ${
                        isActive(item.href, pathname) ? "bg-[#A78BFA]/10 text-[#A78BFA]" : "text-[#C4C0BA] hover:bg-white/[0.05] hover:text-[#EDE9DF]"
                      }`}>
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-xs text-[#7A8090] mt-0.5">{item.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {STANDALONE.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                pathname === link.href ? "bg-[#A78BFA]/10 text-[#A78BFA]" : "text-[#EDE9DF] hover:bg-white/[0.05]"
              }`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/[0.06] space-y-2">
          {isAdmin && (
            <Link href="/admin" onClick={() => setMobileOpen(false)} className="block rounded-xl border border-[#A78BFA]/30 px-4 py-3 text-center text-sm font-semibold text-[#A78BFA] hover:bg-[#A78BFA]/8 transition">
              Admin Panel
            </Link>
          )}
          <Link href="/burc-hesapla" onClick={() => setMobileOpen(false)}
            className="block rounded-xl bg-[#5C44D0] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[#4934B8] transition">
            Burç Hesapla
          </Link>
        </div>
      </div>
    </>
  );
}
