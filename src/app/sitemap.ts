import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/site-url";
import { ZODIAC_SIGNS } from "@/data/zodiac";
import { TESTS } from "@/data/tests";
import { listPublishedSlugs } from "@/lib/db/repositories/article";
import { listCelebritySlugs } from "@/lib/db/repositories/celebrity";

const RETRO_PLANETS = ["mercury", "venus", "mars", "saturn"] as const;

function url(path: string) {
  return `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: url("/burc-hesapla"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/burclar"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/testler"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: url("/birth-chart"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/dergi"), lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: url("/gunluk-burc"), lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: url("/haftalik-burc"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: url("/uyumluluk"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/unluler"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: url("/retro"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: url("/retro/takvim"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: url("/retro/kisisel-analiz"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const burcEntries: MetadataRoute.Sitemap = ZODIAC_SIGNS.map((sign) => ({
    url: url(`/burc/${sign.id}`),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const testEntries: MetadataRoute.Sitemap = TESTS.map((t) => ({
    url: url(`/test/${t.slug}`),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const retroPlanetEntries: MetadataRoute.Sitemap = RETRO_PLANETS.map((planet) => ({
    url: url(`/retro/${planet}`),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  let dergiEntries: MetadataRoute.Sitemap = [];
  try {
    const articles = await listPublishedSlugs();
    dergiEntries = articles.map((a) => ({
      url: url(`/dergi/${a.slug}`),
      lastModified: a.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB yoksa veya hata varsa sadece statik sitemap
  }

  let unlulerEntries: MetadataRoute.Sitemap = [];
  try {
    const celebrities = await listCelebritySlugs();
    unlulerEntries = [
      ...ZODIAC_SIGNS.map((sign) => ({
        url: url(`/unluler/${sign.id}`),
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
      ...celebrities.map((c) => ({
        url: url(`/unluler/${c.slug}`),
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    unlulerEntries = ZODIAC_SIGNS.map((sign) => ({
      url: url(`/unluler/${sign.id}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  }

  return [
    ...staticEntries,
    ...burcEntries,
    ...testEntries,
    ...retroPlanetEntries,
    ...dergiEntries,
    ...unlulerEntries,
  ];
}
