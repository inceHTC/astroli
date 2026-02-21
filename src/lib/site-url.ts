/**
 * Tek merkezden site URL'i. SEO (canonical, sitemap, OG) için kullan.
 * Production: NEXT_PUBLIC_SITE_URL veya VERCEL_URL. Yoksa astroli.com.
 */
export function getBaseUrl(): string {
  if (typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (typeof process.env.VERCEL_URL === "string" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://astroli.com";
}
