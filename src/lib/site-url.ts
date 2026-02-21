const CANONICAL_SITE_URL = "https://www.astroli.com.tr";

/**
 * Tek merkezden site URL'i. SEO (canonical, sitemap, OG) için kullan.
 * Vercel'de vercel.app adresi dönmesin diye; sitemap her zaman canonical domain kullanır.
 */
export function getBaseUrl(): string {
  if (typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  const vercelUrl = process.env.VERCEL_URL;
  if (typeof vercelUrl === "string" && vercelUrl && vercelUrl.includes("vercel.app")) {
    return CANONICAL_SITE_URL;
  }
  if (typeof vercelUrl === "string" && vercelUrl) {
    return `https://${vercelUrl}`;
  }
  return CANONICAL_SITE_URL;
}
