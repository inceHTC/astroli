import type { Metadata } from "next";
import Link from "next/link";
import { getBaseUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı",
  description: "Aradığınız sayfa mevcut değil veya taşınmış olabilir. Astroli ana sayfasına dönebilirsiniz.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Sayfa Bulunamadı | Astroli",
    url: `${getBaseUrl()}/404`,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-[#D4AF72]/20">404</p>
      <h1 className="mt-4 text-xl font-semibold text-[#EDE9DF] sm:text-2xl">
        Sayfa bulunamadı
      </h1>
      <p className="mt-2 max-w-md text-[#8494B2]">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#D4AF72] px-6 py-3 font-medium text-white hover:bg-[#4A32E0] transition"
      >
        Ana sayfaya dön
      </Link>
    </div>
  );
}
