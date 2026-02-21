/**
 * Ünlüler listesine 100 kişi daha ekler (bilim, yazar, sporcu, rapçi, oyuncu, gazeteci, YouTuber – yerli/yabancı).
 * Sadece listede olmayanlar eklenir.
 * Çalıştırma: npx tsx prisma/add-100-celebrities-batch2.ts
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
  const [ , m, d] = dateStr.split("-").map(Number);
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
  // Bilim insanları
  { name: "Aziz Sancar", job: "Bilim İnsanı, Nobel Ödülü", birthDate: "1946-09-08" },
  { name: "Neil deGrasse Tyson", job: "Astrofizikçi", birthDate: "1958-10-05" },
  { name: "Brian Cox", job: "Fizikçi, Sunucu", birthDate: "1968-03-03" },
  { name: "Michio Kaku", job: "Fizikçi", birthDate: "1947-01-24" },
  { name: "Richard Dawkins", job: "Biyolog, Yazar", birthDate: "1941-03-26" },
  { name: "Jane Goodall", job: "Primatolog", birthDate: "1934-04-03" },
  { name: "Carl Sagan", job: "Astronom, Yazar", birthDate: "1934-11-09" },
  { name: "Lisa Randall", job: "Fizikçi", birthDate: "1962-06-18" },
  { name: "Celal Şengör", job: "Jeolog, Akademisyen", birthDate: "1955-03-24" },
  { name: "İlber Ortaylı", job: "Tarihçi, Akademisyen", birthDate: "1947-05-21" },
  // Yazarlar
  { name: "Orhan Pamuk", job: "Yazar, Nobel Ödülü", birthDate: "1952-06-07" },
  { name: "Elif Şafak", job: "Yazar", birthDate: "1971-10-25" },
  { name: "Haruki Murakami", job: "Yazar", birthDate: "1949-01-12" },
  { name: "Zadie Smith", job: "Yazar", birthDate: "1975-10-25" },
  { name: "Chimamanda Ngozi Adichie", job: "Yazar", birthDate: "1977-09-15" },
  { name: "Colleen Hoover", job: "Yazar", birthDate: "1979-12-11" },
  { name: "John Green", job: "Yazar, YouTuber", birthDate: "1977-08-24" },
  { name: "Paulo Coelho", job: "Yazar", birthDate: "1947-08-24" },
  { name: "Ahmet Ümit", job: "Yazar", birthDate: "1960-09-30" },
  { name: "Buket Uzuner", job: "Yazar", birthDate: "1955-10-03" },
  // Sporcular
  { name: "Neymar Jr.", job: "Futbolcu", birthDate: "1992-02-05" },
  { name: "Kevin De Bruyne", job: "Futbolcu", birthDate: "1991-06-28" },
  { name: "Erling Haaland", job: "Futbolcu", birthDate: "2000-07-21" },
  { name: "Jude Bellingham", job: "Futbolcu", birthDate: "2003-06-29" },
  { name: "Arda Güler", job: "Futbolcu", birthDate: "2005-02-25" },
  { name: "Hakan Şükür", job: "Eski Futbolcu", birthDate: "1971-09-01" },
  { name: "Emre Belözoğlu", job: "Eski Futbolcu, Teknik Direktör", birthDate: "1980-09-07" },
  { name: "Anthony Joshua", job: "Boksör", birthDate: "1989-10-15" },
  { name: "Naomi Osaka", job: "Tenisçi", birthDate: "1997-10-16" },
  { name: "Coco Gauff", job: "Tenisçi", birthDate: "2004-03-13" },
  // Rapçiler
  { name: "Jay-Z", job: "Rapçi, İş İnsanı", birthDate: "1969-12-04" },
  { name: "Kanye West", job: "Rapçi, Prodüktör", birthDate: "1977-06-08" },
  { name: "Nicki Minaj", job: "Rapçi, Şarkıcı", birthDate: "1982-12-08" },
  { name: "Cardi B", job: "Rapçi", birthDate: "1992-10-11" },
  { name: "Travis Scott", job: "Rapçi, Prodüktör", birthDate: "1991-04-30" },
  { name: "50 Cent", job: "Rapçi, İş İnsanı", birthDate: "1975-07-06" },
  { name: "Snoop Dogg", job: "Rapçi", birthDate: "1971-10-20" },
  { name: "Ice Cube", job: "Rapçi, Oyuncu", birthDate: "1969-06-15" },
  { name: "Megan Thee Stallion", job: "Rapçi", birthDate: "1995-02-15" },
  { name: "Tarkan", job: "Şarkıcı", birthDate: "1972-10-17" },
  // Oyuncular (yerli ve yabancı)
  { name: "Haluk Bilginer", job: "Oyuncu", birthDate: "1954-06-05" },
  { name: "Beren Saat", job: "Oyuncu", birthDate: "1984-02-26" },
  { name: "Kenan İmirzalıoğlu", job: "Oyuncu", birthDate: "1974-06-18" },
  { name: "Nuri Bilge Ceylan", job: "Yönetmen, Oyuncu", birthDate: "1959-01-26" },
  { name: "Cem Yılmaz", job: "Komedyen, Oyuncu", birthDate: "1973-04-23" },
  { name: "Jake Gyllenhaal", job: "Oyuncu", birthDate: "1980-12-19" },
  { name: "Adam Sandler", job: "Oyuncu, Komedyen", birthDate: "1966-09-09" },
  { name: "Javier Bardem", job: "Oyuncu", birthDate: "1969-03-01" },
  { name: "Pedro Pascal", job: "Oyuncu", birthDate: "1975-04-02" },
  { name: "Oscar Isaac", job: "Oyuncu", birthDate: "1979-03-09" },
  { name: "Anya Taylor-Joy", job: "Oyuncu", birthDate: "1996-04-16" },
  { name: "Sydney Sweeney", job: "Oyuncu", birthDate: "1997-09-12" },
  { name: "Jacob Elordi", job: "Oyuncu", birthDate: "1997-06-26" },
  { name: "Kıvanç Tatlıtuğ", job: "Oyuncu", birthDate: "1983-10-27" },
  // Gazeteciler
  { name: "Can Dündar", job: "Gazeteci, Yönetmen", birthDate: "1961-06-16" },
  { name: "Sedef Kabaş", job: "Gazeteci, Sunucu", birthDate: "1968-03-15" },
  { name: "Christiane Amanpour", job: "Gazeteci", birthDate: "1958-01-12" },
  { name: "Anderson Cooper", job: "Gazeteci, Sunucu", birthDate: "1967-06-03" },
  { name: "Rachel Maddow", job: "Gazeteci, Sunucu", birthDate: "1973-04-01" },
  { name: "Murat Bardakçı", job: "Tarihçi, Gazeteci", birthDate: "1955-12-25" },
  { name: "Ezgi Mola", job: "Oyuncu", birthDate: "1978-04-29" },
  { name: "Fatih Portakal", job: "Sunucu, Gazeteci", birthDate: "1961-10-15" },
  { name: "Cüneyt Özdemir", job: "Sunucu, Gazeteci", birthDate: "1970-01-01" },
  { name: "Güneri Cıvaoğlu", job: "Gazeteci", birthDate: "1946-08-15" },
  // YouTuber'lar
  { name: "MrBeast", job: "YouTuber", birthDate: "1998-05-07" },
  { name: "PewDiePie", job: "YouTuber", birthDate: "1989-10-24" },
  { name: "Mark Rober", job: "YouTuber, Mühendis", birthDate: "1980-03-11" },
  { name: "Derek Muller", job: "YouTuber (Veritasium)", birthDate: "1982-11-09" },
  { name: "Lilly Singh", job: "YouTuber, Komedyen", birthDate: "1988-09-26" },
  { name: "David Dobrik", job: "YouTuber", birthDate: "1996-07-23" },
  { name: "Emma Chamberlain", job: "YouTuber", birthDate: "2001-05-22" },
  { name: "Barış Özcan", job: "YouTuber", birthDate: "1975-01-01" },
  { name: "Enes Batur", job: "YouTuber", birthDate: "1996-10-28" },
  { name: "Orkun Işıtmak", job: "YouTuber", birthDate: "1993-06-15" },
  { name: "Linus Sebastian", job: "YouTuber (Linus Tech Tips)", birthDate: "1986-08-20" },
  { name: "MKBHD", job: "YouTuber (Teknoloji)", birthDate: "1993-12-03" },
  { name: "Jacksepticeye", job: "YouTuber", birthDate: "1990-02-07" },
  { name: "Markiplier", job: "YouTuber", birthDate: "1989-06-28" },
  { name: "Jenna Marbles", job: "YouTuber", birthDate: "1986-09-15" },
  // Ek oyuncu, müzisyen, sunucu
  { name: "Beyazıt Öztürk", job: "Sunucu, Komedyen", birthDate: "1969-03-12" },
  { name: "Acun Ilıcalı", job: "Sunucu, İş İnsanı", birthDate: "1969-05-01" },
  { name: "Sertab Erener", job: "Şarkıcı", birthDate: "1964-12-04" },
  { name: "Sezen Aksu", job: "Şarkıcı, Söz Yazarı", birthDate: "1954-07-13" },
  { name: "Morrissey", job: "Şarkıcı", birthDate: "1959-05-22" },
  { name: "Thom Yorke", job: "Şarkıcı (Radiohead)", birthDate: "1968-10-07" },
  { name: "Björk", job: "Şarkıcı", birthDate: "1965-11-21" },
  { name: "Phoebe Bridgers", job: "Şarkıcı", birthDate: "1994-08-17" },
  { name: "Lana Del Rey", job: "Şarkıcı", birthDate: "1985-06-21" },
  { name: "Frank Ocean", job: "Şarkıcı", birthDate: "1987-10-28" },
  { name: "Tyler the Creator", job: "Rapçi, Prodüktör", birthDate: "1991-03-06" },
  { name: "Doja Cat", job: "Şarkıcı, Rapçi", birthDate: "1995-10-21" },
  { name: "Miley Cyrus", job: "Şarkıcı, Oyuncu", birthDate: "1992-11-23" },
  { name: "Selena Gomez", job: "Şarkıcı, Oyuncu", birthDate: "1992-07-22" },
  { name: "Demi Lovato", job: "Şarkıcı", birthDate: "1992-08-20" },
  { name: "Jonas Brothers", job: "Müzik Grubu", birthDate: "1989-08-15" },
  { name: "Nick Jonas", job: "Şarkıcı, Oyuncu", birthDate: "1992-09-16" },
  { name: "Joe Jonas", job: "Şarkıcı", birthDate: "1989-08-15" },
  { name: "Kevin Jonas", job: "Şarkıcı", birthDate: "1987-11-05" },
  { name: "Hugh Jackman", job: "Oyuncu", birthDate: "1968-10-12" },
  { name: "Ryan Reynolds", job: "Oyuncu", birthDate: "1976-10-23" },
  { name: "Jason Momoa", job: "Oyuncu", birthDate: "1979-08-01" },
  { name: "Chadwick Boseman", job: "Oyuncu", birthDate: "1976-11-29" },
  { name: "John Boyega", job: "Oyuncu", birthDate: "1992-03-17" },
  { name: "Daniel Craig", job: "Oyuncu", birthDate: "1968-03-02" },
  { name: "Tom Hardy", job: "Oyuncu", birthDate: "1977-09-15" },
  { name: "Eddie Redmayne", job: "Oyuncu", birthDate: "1982-01-06" },
  { name: "Benedict Cumberbatch", job: "Oyuncu", birthDate: "1976-07-19" },
  { name: "Andrew Garfield", job: "Oyuncu", birthDate: "1983-08-20" },
  { name: "Emma Watson", job: "Oyuncu", birthDate: "1990-04-15" },
  { name: "Daniel Radcliffe", job: "Oyuncu", birthDate: "1989-07-23" },
  { name: "Rupert Grint", job: "Oyuncu", birthDate: "1988-08-24" },
  { name: "Tom Holland", job: "Oyuncu", birthDate: "1996-06-01" },
  { name: "Zac Efron", job: "Oyuncu", birthDate: "1987-10-18" },
  { name: "Willow Smith", job: "Şarkıcı, Oyuncu", birthDate: "2000-10-31" },
];

async function main() {
  const existing = await prisma.celebrity.findMany({ select: { slug: true } });
  const existingSlugs = new Set(existing.map((c) => c.slug));

  let added = 0;
  let skipped = 0;
  const usedInThisRun = new Set<string>();

  const toAdd = CELEBRITIES.slice(0, 100);
  for (const p of toAdd) {
    const baseSlug = slugify(p.name);
    if (existingSlugs.has(baseSlug) || usedInThisRun.has(baseSlug)) {
      skipped++;
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
      console.log(`Eklendi: ${p.name} (${p.job}) – ${zodiac}`);
    } catch (e) {
      skipped++;
      console.warn(`Atlandı: ${p.name}`, e);
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
