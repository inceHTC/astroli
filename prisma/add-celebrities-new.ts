/**
 * Güncel ve popüler yeni ünlüler ekler (önceki batch'lerde olmayanlar).
 * Türkiye ve dünyadan; müzik, sinema, spor, sosyal medya, teknoloji alanları.
 * Çalıştırma: npx tsx prisma/add-celebrities-new.ts
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
  // ─── TÜRK MÜZİSYENLER ───
  { name: "Hadise", job: "Şarkıcı", birthDate: "1985-06-18" },
  { name: "Gülşen", job: "Şarkıcı", birthDate: "1975-02-12" },
  { name: "Hande Yener", job: "Şarkıcı", birthDate: "1974-08-08" },
  { name: "Murat Boz", job: "Şarkıcı", birthDate: "1979-11-09" },
  { name: "Zeynep Bastık", job: "Şarkıcı", birthDate: "1996-11-29" },
  { name: "Ezhel", job: "Rapçi, Şarkıcı", birthDate: "1990-12-30" },
  { name: "Reynmen", job: "Şarkıcı", birthDate: "1998-02-27" },
  { name: "Semicenk", job: "Şarkıcı", birthDate: "1992-09-14" },
  { name: "Tuğçe Kandemir", job: "Şarkıcı", birthDate: "1991-04-12" },
  { name: "Bengü", job: "Şarkıcı", birthDate: "1978-10-21" },
  { name: "İbrahim Tatlıses", job: "Şarkıcı, Sanatçı", birthDate: "1952-01-01" },
  { name: "Oğuzhan Koç", job: "Şarkıcı", birthDate: "1984-11-26" },
  { name: "Emre Aydın", job: "Şarkıcı", birthDate: "1981-09-06" },
  { name: "Müslüm Gürses", job: "Şarkıcı", birthDate: "1953-11-17" },
  { name: "Sıla", job: "Şarkıcı", birthDate: "1984-05-07" },
  { name: "Şebnem Ferah", job: "Şarkıcı", birthDate: "1970-06-03" },
  { name: "Gazapizm", job: "Rapçi", birthDate: "1989-10-13" },
  { name: "Ben Fero", job: "Rapçi", birthDate: "1994-04-03" },
  { name: "Norm Ender", job: "Rapçi", birthDate: "1989-05-01" },
  { name: "Uzi", job: "Rapçi", birthDate: "1999-09-02" },
  { name: "Gökhan Türkmen", job: "Şarkıcı", birthDate: "1978-09-15" },
  { name: "Alişan", job: "Şarkıcı", birthDate: "1976-08-29" },
  { name: "Sezen Aksu", job: "Şarkıcı, Söz Yazarı", birthDate: "1954-07-13" },
  // ─── TÜRK OYUNCULARI ───
  { name: "Demet Özdemir", job: "Oyuncu", birthDate: "1992-06-26" },
  { name: "Kerem Bürsin", job: "Oyuncu", birthDate: "1987-06-04" },
  { name: "Halit Ergenç", job: "Oyuncu", birthDate: "1970-11-30" },
  { name: "Tuba Büyüküstün", job: "Oyuncu", birthDate: "1982-07-05" },
  { name: "Fahriye Evcen", job: "Oyuncu", birthDate: "1986-06-04" },
  { name: "Bergüzar Korel", job: "Oyuncu", birthDate: "1982-08-27" },
  { name: "Serenay Sarıkaya", job: "Oyuncu", birthDate: "1992-07-01" },
  { name: "Tolga Sarıtaş", job: "Oyuncu", birthDate: "1993-03-11" },
  { name: "Aras Bulut İynemli", job: "Oyuncu", birthDate: "1990-02-10" },
  { name: "Hazal Kaya", job: "Oyuncu", birthDate: "1990-10-01" },
  { name: "Şükrü Özyıldız", job: "Oyuncu", birthDate: "1988-07-01" },
  { name: "İbrahim Çelikkol", job: "Oyuncu", birthDate: "1981-12-10" },
  { name: "Engin Altan Düzyatan", job: "Oyuncu", birthDate: "1979-07-26" },
  { name: "Birkan Sokullu", job: "Oyuncu", birthDate: "1986-11-06" },
  { name: "Burak Deniz", job: "Oyuncu", birthDate: "1991-12-17" },
  { name: "Can Yaman", job: "Oyuncu", birthDate: "1989-11-08" },
  { name: "İrem Helvacıoğlu", job: "Oyuncu", birthDate: "2002-04-26" },
  { name: "Berk Atan", job: "Oyuncu", birthDate: "1996-04-08" },
  { name: "Ebru Şahin", job: "Oyuncu", birthDate: "1995-01-14" },
  { name: "Şahan Gökbakar", job: "Komedyen, Oyuncu", birthDate: "1978-02-02" },
  { name: "Barış Arduç", job: "Oyuncu", birthDate: "1987-06-07" },
  { name: "Neslihan Atagül", job: "Oyuncu", birthDate: "1992-08-20" },
  { name: "Merve Dizdar", job: "Oyuncu", birthDate: "1985-11-28" },
  { name: "Mert Fırat", job: "Oyuncu", birthDate: "1982-02-21" },
  { name: "Kaan Urgancıoğlu", job: "Oyuncu", birthDate: "1982-11-10" },
  { name: "Necati Şaşmaz", job: "Oyuncu", birthDate: "1974-05-05" },
  { name: "Ahmet Kural", job: "Oyuncu, Komedyen", birthDate: "1981-07-15" },
  { name: "Murat Cemcir", job: "Oyuncu, Komedyen", birthDate: "1976-06-04" },
  { name: "Keremcem", job: "Oyuncu", birthDate: "1989-08-11" },
  { name: "Uraz Kaygılaroğlu", job: "Oyuncu", birthDate: "1985-06-06" },
  { name: "Serkan Çayoğlu", job: "Oyuncu", birthDate: "1989-06-07" },
  // ─── TÜRK SPORCULAR ───
  { name: "Hakan Çalhanoğlu", job: "Futbolcu", birthDate: "1994-02-08" },
  { name: "Kenan Yıldız", job: "Futbolcu", birthDate: "2005-05-04" },
  { name: "Cengiz Ünder", job: "Futbolcu", birthDate: "1997-07-26" },
  { name: "Merih Demiral", job: "Futbolcu", birthDate: "1998-03-03" },
  { name: "Alperen Şengün", job: "Basketbolcu", birthDate: "2002-07-25" },
  { name: "Furkan Korkmaz", job: "Basketbolcu", birthDate: "1997-07-24" },
  // ─── TÜRK SOSYAL MEDYA ───
  { name: "Danla Bilic", job: "Sosyal Medya Fenomeni", birthDate: "1992-10-19" },
  { name: "Pelin Akil", job: "YouTuber, Sunucu", birthDate: "1985-05-24" },
  // ─── DÜNYA MÜZİSYENLER ───
  { name: "Sabrina Carpenter", job: "Şarkıcı, Oyuncu", birthDate: "1999-05-11" },
  { name: "Chappell Roan", job: "Şarkıcı", birthDate: "2001-02-19" },
  { name: "SZA", job: "Şarkıcı", birthDate: "1989-11-08" },
  { name: "Rose (BLACKPINK)", job: "Şarkıcı", birthDate: "1997-02-11" },
  { name: "Jungkook", job: "Şarkıcı (BTS)", birthDate: "1997-09-01" },
  { name: "Jennie (BLACKPINK)", job: "Şarkıcı", birthDate: "1996-01-16" },
  { name: "Lisa (BLACKPINK)", job: "Şarkıcı", birthDate: "1997-03-27" },
  { name: "V (BTS)", job: "Şarkıcı", birthDate: "1995-12-30" },
  { name: "Peso Pluma", job: "Şarkıcı", birthDate: "1999-06-15" },
  { name: "Ice Spice", job: "Rapçi", birthDate: "2000-01-23" },
  { name: "Doechii", job: "Rapçi, Şarkıcı", birthDate: "2000-08-14" },
  { name: "Charli XCX", job: "Şarkıcı", birthDate: "1992-08-02" },
  { name: "Teddy Swims", job: "Şarkıcı", birthDate: "1992-03-26" },
  { name: "Noah Kahan", job: "Şarkıcı", birthDate: "1997-01-01" },
  { name: "Hozier", job: "Şarkıcı", birthDate: "1990-03-17" },
  { name: "Gracie Abrams", job: "Şarkıcı", birthDate: "2000-09-07" },
  { name: "Tate McRae", job: "Şarkıcı", birthDate: "2003-07-01" },
  { name: "Conan Gray", job: "Şarkıcı", birthDate: "1998-12-05" },
  // ─── DÜNYA SPORCULAR ───
  { name: "Vinicius Jr.", job: "Futbolcu", birthDate: "2000-07-12" },
  { name: "Pedri", job: "Futbolcu", birthDate: "2002-11-25" },
  { name: "Phil Foden", job: "Futbolcu", birthDate: "2000-05-28" },
  { name: "Bukayo Saka", job: "Futbolcu", birthDate: "2001-09-05" },
  { name: "Lamine Yamal", job: "Futbolcu", birthDate: "2007-07-16" },
  { name: "Gavi", job: "Futbolcu", birthDate: "2004-08-05" },
  { name: "Carlos Alcaraz", job: "Tenisçi", birthDate: "2003-05-05" },
  { name: "Iga Swiatek", job: "Tenisçi", birthDate: "2001-05-31" },
  { name: "Jannik Sinner", job: "Tenisçi", birthDate: "2001-08-16" },
  { name: "Anthony Edwards", job: "Basketbolcu", birthDate: "2001-08-05" },
  { name: "Victor Wembanyama", job: "Basketbolcu", birthDate: "2004-01-04" },
  { name: "Caitlin Clark", job: "Basketbolcu", birthDate: "2002-01-22" },
  { name: "Alexia Putellas", job: "Futbolcu", birthDate: "1994-02-04" },
  { name: "Neymar Jr.", job: "Futbolcu", birthDate: "1992-02-05" },
  // ─── DÜNYA SİNEMA/TV ───
  { name: "Ana de Armas", job: "Oyuncu", birthDate: "1988-04-30" },
  { name: "Paul Mescal", job: "Oyuncu", birthDate: "1996-02-02" },
  { name: "Barry Keoghan", job: "Oyuncu", birthDate: "1992-10-18" },
  { name: "Millie Bobby Brown", job: "Oyuncu", birthDate: "2004-02-19" },
  { name: "Brendan Fraser", job: "Oyuncu", birthDate: "1968-12-03" },
  { name: "Michelle Yeoh", job: "Oyuncu", birthDate: "1962-08-06" },
  { name: "Pedro Almodovar", job: "Yönetmen", birthDate: "1949-09-24" },
  { name: "Jeremy Allen White", job: "Oyuncu", birthDate: "1991-02-17" },
  { name: "Bella Ramsey", job: "Oyuncu", birthDate: "2003-09-25" },
  { name: "Pedro Pascal", job: "Oyuncu", birthDate: "1975-04-02" },
  // ─── SOSYAL MEDYA ───
  { name: "Charli D'Amelio", job: "TikToker", birthDate: "2004-05-01" },
  { name: "Khaby Lame", job: "TikToker", birthDate: "2000-03-09" },
  { name: "Addison Rae", job: "TikToker, Oyuncu", birthDate: "2000-10-06" },
  { name: "KSI", job: "YouTuber, Boksör", birthDate: "1993-06-19" },
  // ─── TEKNOLOJİ / İŞ DÜNYASI ───
  { name: "Sam Altman", job: "Girişimci, OpenAI CEO", birthDate: "1985-04-22" },
  { name: "Sundar Pichai", job: "Girişimci, Google CEO", birthDate: "1972-07-10" },
  { name: "Tim Cook", job: "İş İnsanı, Apple CEO", birthDate: "1960-11-01" },
  { name: "Jensen Huang", job: "Girişimci, NVIDIA CEO", birthDate: "1963-02-17" },
];

async function main() {
  const existing = await prisma.celebrity.findMany({ select: { slug: true } });
  const existingSlugs = new Set(existing.map((c) => c.slug));

  let added = 0;
  let skipped = 0;
  const usedInThisRun = new Set<string>();

  for (const p of CELEBRITIES) {
    const baseSlug = slugify(p.name);
    if (existingSlugs.has(baseSlug) || usedInThisRun.has(baseSlug)) {
      skipped++;
      console.log(`Atlandı (zaten var): ${p.name}`);
      continue;
    }
    usedInThisRun.add(baseSlug);
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
      console.log(`✓ Eklendi: ${p.name} (${p.job}) – ${zodiac}`);
    } catch (e) {
      skipped++;
      console.warn(`✗ Atlandı: ${p.name}`, e);
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
