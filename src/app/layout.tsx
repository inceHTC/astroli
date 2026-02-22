import type { Metadata, Viewport } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getAuthFromCookie } from "@/lib/auth";
import { getBaseUrl } from "@/lib/site-url";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const siteName = "Astroli";
const defaultTitle = "Astroli | Burcunu Keşfet, Kişiliğini Tanı";
const defaultDescription =
  "Premium astroloji platformu. Burcunu hesapla, kişilik testlerini çöz, burç uyumluluğunu keşfet. Günlük ve haftalık burç yorumları, retro merkezi, doğum haritası.";

export const metadata: Metadata = {
  
  metadataBase: new URL(getBaseUrl()),
  icons: {
  icon: "/favicon.png",
},
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    "astroloji",
    "burç",
    "burç hesaplama",
    "kişilik testi",
    "zodyak",
    "uyumluluk",
    "günlük burç",
    "haftalık burç",
    "doğum haritası",
    "retro",
    "Merkür retrosu",
  ],
  authors: [{ name: siteName, url: getBaseUrl() }],
  creator: siteName,
  publisher: siteName,
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: getBaseUrl(),
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: `${getBaseUrl()}/logo.png`,
        width: 512,
        height: 512,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [`${getBaseUrl()}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: getBaseUrl(),
  },
  category: "lifestyle",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

function getStructuredData() {
  const base = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: siteName,
        url: base,
        logo: { "@type": "ImageObject", url: `${base}/logo.png` },
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: siteName,
        description: defaultDescription,
        publisher: { "@id": `${base}/#organization` },
        inLanguage: "tr-TR",
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", url: `${base}/dergi?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getAuthFromCookie();
  const structuredData = getStructuredData();
  return (
    <html
      lang="tr"
      className={`${outfit.variable} ${playfair.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen antialiased bg-white text-black font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Header isAdmin={!!auth} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
