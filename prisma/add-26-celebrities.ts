/**
 * 26 ek ünlü ekler (önceki batch'lerde atlananlar yerine – listede olmayanlar).
 * Çalıştırma: npx tsx prisma/add-26-celebrities.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ZodiacId =
  | "aries" | "taurus" | "gemini" | "cancer" | "leo" | "virgo"
  | "libra" | "scorpio" | "sagittarius" | "capricorn" | "aquarius" | "pisces";

const SIGN_RANGES: { sign: ZodiacId; start: [number, number]; end: [number, number] }[] = [
  { sign: "capricorn", start: [12, 22], end: [1, 19] },
  { sign: "aries", start: [3, 21], end: [4, 19] },
  { sign: "taurus", start: [4, 20], end: [5, 20] },
  { sign: "gemini", start: [5, 21], end: [6, 20] },
  { sign: "cancer", start: [6, 21], end: [7, 22] },
  { sign: "leo", start: [7, 23], end: [8, 22] },
  { sign: "virgo", start: [8, 23], end: [9, 22] },
  { sign: "libra", start: [9, 23], end: [10, 22] },
  { sign: "scorpio", start: [10, 23], end: [11, 21] },
  { sign: "sagittarius", start: [11, 22], end: [12, 21] },
  { sign: "aquarius", start: [1, 20], end: [2, 18] },
  { sign: "pisces", start: [2, 19], end: [3, 20] },
];

function getZodiacFromDate(dateStr: string): ZodiacId {
  const [, m, d] = dateStr.split("-").map(Number);
  for (const { sign, start, end } of SIGN_RANGES) {
    if (start[0] > end[0]) {
      if ((m === start[0] && d >= start[1]) || (m === end[0] && d <= end[1])) return sign;
    } else {
      if ((m === start[0] && d >= start[1]) || (m === end[0] && d <= end[1])) return sign;
    }
  }
  return "aries";
}

function slugify(name: string): string {
  const tr: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u" };
  let s = name.trim().toLowerCase();
  for (const [k, v] of Object.entries(tr)) s = s.split(k).join(v);
  return s.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const CELEBRITIES: { name: string; job: string; birthDate: string }[] = [
  { name: "Sabahattin Ali", job: "Yazar", birthDate: "1907-02-25" },
  { name: "Yaşar Kemal", job: "Yazar", birthDate: "1923-10-06" },
  { name: "Oğuz Atay", job: "Yazar", birthDate: "1934-10-12" },
  { name: "Latife Tekin", job: "Yazar", birthDate: "1957-01-01" },
  { name: "Murat Gülsoy", job: "Yazar", birthDate: "1967-04-15" },
  { name: "Tuna Kiremitçi", job: "Yazar, Şarkıcı", birthDate: "1973-06-01" },
  { name: "Gökhan Özoğuz", job: "Müzisyen (Athena)", birthDate: "1976-10-08" },
  { name: "Sagopa Kajmer", job: "Rapçi", birthDate: "1978-08-17" },
  { name: "Ceza", job: "Rapçi", birthDate: "1977-11-10" },
  { name: "Norman Reedus", job: "Oyuncu", birthDate: "1969-01-06" },
  { name: "Jeff Goldblum", job: "Oyuncu", birthDate: "1952-10-22" },
  { name: "Willem Dafoe", job: "Oyuncu", birthDate: "1955-07-22" },
  { name: "Tilda Swinton", job: "Oyuncu", birthDate: "1960-11-05" },
  { name: "Werner Herzog", job: "Yönetmen", birthDate: "1942-09-05" },
  { name: "Aslı Enver", job: "Oyuncu", birthDate: "1984-08-08" },
  { name: "Çağatay Ulusoy", job: "Oyuncu", birthDate: "1990-09-23" },
  { name: "Hande Erçel", job: "Oyuncu", birthDate: "1993-11-24" },
  { name: "Burak Özçivit", job: "Oyuncu", birthDate: "1984-12-24" },
  { name: "Alperen Duymaz", job: "Oyuncu", birthDate: "1991-09-23" },
  { name: "İbrahim Selim", job: "YouTuber", birthDate: "1994-05-12" },
  { name: "Ruhi Çenet", job: "YouTuber", birthDate: "1992-03-15" },
  { name: "Cemre Melis Çiçek", job: "YouTuber", birthDate: "1995-08-20" },
  { name: "Casey Neistat", job: "YouTuber", birthDate: "1981-03-25" },
  { name: "Ali Spagnola", job: "YouTuber, Müzisyen", birthDate: "1985-06-18" },
  { name: "Michelle Phan", job: "YouTuber", birthDate: "1987-04-11" },
  { name: "Hakan Günday", job: "Yazar", birthDate: "1976-05-30" },
];

async function main() {
  const existing = await prisma.celebrity.findMany({ select: { slug: true } });
  const existingSlugs = new Set(existing.map((c) => c.slug));
  let added = 0;
  let skipped = 0;

  for (const p of CELEBRITIES) {
    const baseSlug = slugify(p.name);
    if (existingSlugs.has(baseSlug)) {
      skipped++;
      continue;
    }
    const zodiac = getZodiacFromDate(p.birthDate);
    try {
      await prisma.celebrity.create({
        data: {
          name: p.name,
          slug: baseSlug,
          job: p.job,
          zodiac,
          birthDate: new Date(p.birthDate),
          featured: false,
        },
      });
      existingSlugs.add(baseSlug);
      added++;
      console.log(`Eklendi: ${p.name} (${p.job}) – ${zodiac}`);
    } catch (e) {
      skipped++;
      console.warn(`Atlandı: ${p.name}`);
    }
  }
  console.log(`\nToplam ${added} kişi eklendi, ${skipped} atlandı.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
