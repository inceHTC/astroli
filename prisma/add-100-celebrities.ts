/**
 * Listede olmayan 100 dünyaca ünlü isim ekler.
 * Çalıştırma: npx tsx prisma/add-100-celebrities.ts
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
  const [y, m, d] = dateStr.split("-").map(Number);
  const month = m;
  const day = d;
  for (const { sign, start, end } of SIGN_RANGES) {
    if (start[0] > end[0]) {
      if ((month === start[0] && day >= start[1]) || (month === end[0] && day <= end[1])) return sign;
    } else {
      if ((month === start[0] && day >= start[1]) || (month === end[0] && day <= end[1])) return sign;
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
  { name: "Cillian Murphy", job: "Oyuncu", birthDate: "1976-05-25" },
  { name: "Emma Stone", job: "Oyuncu", birthDate: "1988-11-06" },
  { name: "Timothée Chalamet", job: "Oyuncu", birthDate: "1995-12-27" },
  { name: "Zendaya", job: "Oyuncu, Şarkıcı", birthDate: "1996-09-01" },
  { name: "Florence Pugh", job: "Oyuncu", birthDate: "1996-01-03" },
  { name: "Austin Butler", job: "Oyuncu", birthDate: "1991-08-17" },
  { name: "Saoirse Ronan", job: "Oyuncu", birthDate: "1994-04-12" },
  { name: "Daniel Kaluuya", job: "Oyuncu", birthDate: "1989-02-24" },
  { name: "Lupita Nyong'o", job: "Oyuncu", birthDate: "1983-03-01" },
  { name: "Michael B. Jordan", job: "Oyuncu", birthDate: "1987-02-09" },
  { name: "Billie Eilish", job: "Şarkıcı", birthDate: "2001-12-18" },
  { name: "Dua Lipa", job: "Şarkıcı", birthDate: "1995-08-22" },
  { name: "The Weeknd", job: "Şarkıcı", birthDate: "1990-02-16" },
  { name: "Harry Styles", job: "Şarkıcı, Oyuncu", birthDate: "1994-02-01" },
  { name: "Olivia Rodrigo", job: "Şarkıcı, Oyuncu", birthDate: "2003-02-20" },
  { name: "Bad Bunny", job: "Şarkıcı", birthDate: "1994-03-10" },
  { name: "Rosalía", job: "Şarkıcı", birthDate: "1992-09-25" },
  { name: "Kendrick Lamar", job: "Rapçi", birthDate: "1987-06-17" },
  { name: "Lizzo", job: "Şarkıcı", birthDate: "1988-04-27" },
  { name: "Post Malone", job: "Şarkıcı", birthDate: "1995-07-04" },
  { name: "Lionel Messi", job: "Futbolcu", birthDate: "1987-06-24" },
  { name: "Cristiano Ronaldo", job: "Futbolcu", birthDate: "1985-02-05" },
  { name: "Kylian Mbappé", job: "Futbolcu", birthDate: "1998-12-20" },
  { name: "Serena Williams", job: "Tenisçi", birthDate: "1981-09-26" },
  { name: "Roger Federer", job: "Tenisçi", birthDate: "1981-08-08" },
  { name: "Rafael Nadal", job: "Tenisçi", birthDate: "1986-06-03" },
  { name: "Novak Djokovic", job: "Tenisçi", birthDate: "1987-05-22" },
  { name: "LeBron James", job: "Basketbolcu", birthDate: "1984-12-30" },
  { name: "Stephen Curry", job: "Basketbolcu", birthDate: "1988-03-14" },
  { name: "Simone Biles", job: "Jimnastikçi", birthDate: "1997-03-14" },
  { name: "Usain Bolt", job: "Atlet", birthDate: "1986-08-21" },
  { name: "Lewis Hamilton", job: "Formula 1 Pilotu", birthDate: "1985-01-07" },
  { name: "Max Verstappen", job: "Formula 1 Pilotu", birthDate: "1997-09-30" },
  { name: "Elon Musk", job: "İş İnsanı, Girişimci", birthDate: "1971-06-28" },
  { name: "Jeff Bezos", job: "İş İnsanı", birthDate: "1964-01-12" },
  { name: "Mark Zuckerberg", job: "İş İnsanı", birthDate: "1984-05-14" },
  { name: "Oprah Winfrey", job: "Sunucu, İş İnsanı", birthDate: "1954-01-29" },
  { name: "Taylor Swift", job: "Şarkıcı", birthDate: "1989-12-13" },
  { name: "Beyoncé", job: "Şarkıcı", birthDate: "1981-09-04" },
  { name: "Lady Gaga", job: "Şarkıcı, Oyuncu", birthDate: "1986-03-28" },
  { name: "Rihanna", job: "Şarkıcı, İş İnsanı", birthDate: "1988-02-20" },
  { name: "Adele", job: "Şarkıcı", birthDate: "1988-05-05" },
  { name: "Bruno Mars", job: "Şarkıcı", birthDate: "1985-10-08" },
  { name: "Drake", job: "Rapçi, Şarkıcı", birthDate: "1986-10-24" },
  { name: "Ariana Grande", job: "Şarkıcı", birthDate: "1993-06-26" },
  { name: "Ed Sheeran", job: "Şarkıcı", birthDate: "1990-02-17" },
  { name: "Justin Bieber", job: "Şarkıcı", birthDate: "1994-03-01" },
  { name: "Eminem", job: "Rapçi", birthDate: "1972-10-17" },
  { name: "Tom Hanks", job: "Oyuncu", birthDate: "1956-07-09" },
  { name: "Meryl Streep", job: "Oyuncu", birthDate: "1949-06-22" },
  { name: "Leonardo DiCaprio", job: "Oyuncu", birthDate: "1974-11-11" },
  { name: "Jennifer Lawrence", job: "Oyuncu", birthDate: "1990-08-15" },
  { name: "Denzel Washington", job: "Oyuncu", birthDate: "1954-12-28" },
  { name: "Morgan Freeman", job: "Oyuncu", birthDate: "1937-06-01" },
  { name: "Robert Downey Jr.", job: "Oyuncu", birthDate: "1965-04-04" },
  { name: "Scarlett Johansson", job: "Oyuncu", birthDate: "1984-11-22" },
  { name: "Brad Pitt", job: "Oyuncu", birthDate: "1963-12-18" },
  { name: "Johnny Depp", job: "Oyuncu", birthDate: "1963-06-09" },
  { name: "Will Smith", job: "Oyuncu, Şarkıcı", birthDate: "1968-09-25" },
  { name: "Nicole Kidman", job: "Oyuncu", birthDate: "1967-06-20" },
  { name: "Cate Blanchett", job: "Oyuncu", birthDate: "1969-05-14" },
  { name: "Anthony Hopkins", job: "Oyuncu", birthDate: "1937-12-31" },
  { name: "Samuel L. Jackson", job: "Oyuncu", birthDate: "1948-12-21" },
  { name: "Viola Davis", job: "Oyuncu", birthDate: "1965-08-11" },
  { name: "Idris Elba", job: "Oyuncu", birthDate: "1972-09-06" },
  { name: "Margot Robbie", job: "Oyuncu", birthDate: "1990-07-02" },
  { name: "Ryan Gosling", job: "Oyuncu", birthDate: "1980-11-12" },
  { name: "Christian Bale", job: "Oyuncu", birthDate: "1974-01-30" },
  { name: "Matt Damon", job: "Oyuncu", birthDate: "1970-10-08" },
  { name: "George Clooney", job: "Oyuncu, Yönetmen", birthDate: "1961-05-06" },
  { name: "Sandra Bullock", job: "Oyuncu", birthDate: "1964-07-26" },
  { name: "Chris Hemsworth", job: "Oyuncu", birthDate: "1983-08-11" },
  { name: "Chris Evans", job: "Oyuncu", birthDate: "1981-06-13" },
  { name: "Gal Gadot", job: "Oyuncu", birthDate: "1985-04-30" },
  { name: "Dwayne Johnson", job: "Oyuncu, Sporcu", birthDate: "1972-05-02" },
  { name: "Keanu Reeves", job: "Oyuncu", birthDate: "1964-09-02" },
  { name: "Natalie Portman", job: "Oyuncu", birthDate: "1981-06-09" },
  { name: "Anne Hathaway", job: "Oyuncu", birthDate: "1982-11-12" },
  { name: "Joaquin Phoenix", job: "Oyuncu", birthDate: "1974-10-28" },
  { name: "Adam Driver", job: "Oyuncu", birthDate: "1983-11-19" },
  { name: "Barack Obama", job: "Eski ABD Başkanı", birthDate: "1961-08-04" },
  { name: "Angela Merkel", job: "Eski Almanya Şansölyesi", birthDate: "1954-07-17" },
  { name: "Malala Yousafzai", job: "Aktivist, Nobel Ödülü", birthDate: "1997-07-12" },
  { name: "Greta Thunberg", job: "İklim Aktivistı", birthDate: "2003-01-03" },
  { name: "Bill Gates", job: "İş İnsanı, Hayırsever", birthDate: "1955-10-28" },
  { name: "Warren Buffett", job: "Yatırımcı", birthDate: "1930-08-30" },
  { name: "Steve Jobs", job: "Apple Kurucusu", birthDate: "1955-02-24" },
  { name: "Stephen Hawking", job: "Fizikçi", birthDate: "1942-01-08" },
  { name: "Neil deGrasse Tyson", job: "Astrofizikçi", birthDate: "1958-10-05" },
  { name: "Jane Goodall", job: "Primatolog, Çevreci", birthDate: "1934-04-03" },
  { name: "David Attenborough", job: "Doğa Belgeselcisi", birthDate: "1926-05-08" },
  { name: "J.K. Rowling", job: "Yazar", birthDate: "1965-07-31" },
  { name: "Stephen King", job: "Yazar", birthDate: "1947-09-21" },
  { name: "Dan Brown", job: "Yazar", birthDate: "1964-06-22" },
  { name: "Margaret Atwood", job: "Yazar", birthDate: "1939-11-18" },
  { name: "Martin Scorsese", job: "Yönetmen", birthDate: "1942-11-17" },
  { name: "Steven Spielberg", job: "Yönetmen", birthDate: "1946-12-18" },
  { name: "Christopher Nolan", job: "Yönetmen", birthDate: "1970-07-30" },
  { name: "Quentin Tarantino", job: "Yönetmen", birthDate: "1963-03-27" },
  { name: "Guillermo del Toro", job: "Yönetmen", birthDate: "1964-10-09" },
  { name: "Bong Joon-ho", job: "Yönetmen", birthDate: "1969-09-14" },
  { name: "David Fincher", job: "Yönetmen", birthDate: "1962-08-28" },
  { name: "Ridley Scott", job: "Yönetmen", birthDate: "1937-11-30" },
  { name: "Jimmy Fallon", job: "Sunucu, Komedyen", birthDate: "1974-09-19" },
  { name: "Ellen DeGeneres", job: "Sunucu, Komedyen", birthDate: "1958-01-26" },
  { name: "Trevor Noah", job: "Sunucu, Komedyen", birthDate: "1984-02-20" },
  { name: "John Oliver", job: "Sunucu, Komedyen", birthDate: "1977-04-23" },
  { name: "Dave Chappelle", job: "Komedyen", birthDate: "1973-08-24" },
  { name: "Kevin Hart", job: "Komedyen, Oyuncu", birthDate: "1979-07-06" },
  { name: "Amy Schumer", job: "Komedyen", birthDate: "1981-06-01" },
  { name: "David Beckham", job: "Eski Futbolcu, İş İnsanı", birthDate: "1975-05-02" },
  { name: "Tiger Woods", job: "Golfçü", birthDate: "1975-12-30" },
  { name: "Michael Phelps", job: "Yüzücü", birthDate: "1985-06-30" },
  { name: "Shaquille O'Neal", job: "Eski Basketbolcu, Sunucu", birthDate: "1972-03-06" },
];

const ALL = CELEBRITIES;

async function main() {
  const existing = await prisma.celebrity.findMany({ select: { slug: true } });
  const existingSlugs = new Set(existing.map((c) => c.slug));

  let added = 0;
  let skipped = 0;
  const usedInThisRun = new Set<string>();

  for (const p of ALL) {
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
