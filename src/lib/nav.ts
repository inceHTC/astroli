export const NAV_LINKS = [
  { href: "/burclar", label: "Burçlar" },
  { href: "/gunluk-burc", label: "Günlük Burç" },
  { href: "/haftalik-burc", label: "Haftalık Burç" },
    { href: "/burclar/meslekler", label: "Burç & Meslek" },
  { href: "/dergi/haftalik-burc-enerjisi", label: "Kozmik Enerji" },
  { href: "/retro", label: "Retro Merkezi" },
  { href: "/testler", label: "Testler" },
  { href: "/dergi", label: "Dergi" },
  { href: "/uyumluluk", label: "Uyumluluk" },
  { href: "/birth-chart", label: "Doğum Haritası" },
  { href: "/iletisim", label: "İletişim" },
] as const;

/** Footer'da menü linklerine ek olarak gösterilecek linkler */
export const FOOTER_EXTRA_LINKS = [
  { href: "/burc-hesapla", label: "Burç Hesapla" },
] as const;
