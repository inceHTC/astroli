import { Container } from "@/components/layout/Container";

export const metadata = {
  title: "Hangi Ünlü Hangi Burç? | Astroli",
  description:
    "Oyuncular, futbolcular, müzisyenler ve siyasetçilerin burçlarını keşfet.",
};

const CELEBRITY_DATA = [
  {
    category: "🎭 Oyuncular",
    items: [
      { name: "Serenay Sarıkaya", sign: "Yengeç" },
      { name: "Kerem Bürsin", sign: "İkizler" },
      { name: "Kıvanç Tatlıtuğ", sign: "Akrep" },
      { name: "Hazal Kaya", sign: "Terazi" },
      { name: "Aras Bulut İynemli", sign: "Aslan" },
      { name: "Demet Özdemir", sign: "Balık" },
    ],
  },
  {
    category: "⚽ Futbolcular",
    items: [
      { name: "Cristiano Ronaldo", sign: "Kova" },
      { name: "Lionel Messi", sign: "Yengeç" },
      { name: "Arda Güler", sign: "Balık" },
      { name: "Neymar", sign: "Kova" },
      { name: "Erling Haaland", sign: "Yengeç" },
      { name: "Kylian Mbappé", sign: "Oğlak" },
    ],
  },
  {
    category: "🎵 Müzisyenler",
    items: [
      { name: "Sezen Aksu", sign: "Yengeç" },
      { name: "Tarkan", sign: "Terazi" },
      { name: "Billie Eilish", sign: "Yay" },
      { name: "The Weeknd", sign: "Kova" },
      { name: "Ezhel", sign: "Yengeç" },
      { name: "Dua Lipa", sign: "Aslan" },
    ],
  },
  {
    category: "🏛️ Siyasetçiler",
    items: [
      { name: "Recep Tayyip Erdoğan", sign: "Balık" },
      { name: "Kemal Kılıçdaroğlu", sign: "Yay" },
      { name: "Barack Obama", sign: "Aslan" },
      { name: "Angela Merkel", sign: "Yengeç" },
      { name: "Emmanuel Macron", sign: "Yay" },
      { name: "Volodimir Zelenski", sign: "Kova" },
    ],
  },
];

function CategoryCard({
  title,
  items,
}: {
  title: string;
  items: { name: string; sign: string }[];
}) {
  return (
    <div className="rounded-2xl bg-[#0E1523] p-6 border border-white/[0.10] hover:shadow-lg transition">
      <h2 className="text-lg font-semibold text-[#EDE9DF]">{title}</h2>
      <div className="mt-4 h-px w-full bg-gray-200" />

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item.name}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-[#EDE9DF] font-medium hover:text-[#ffc552] transition">
              {item.name}
            </span>
            <span className="rounded-full bg-[#ffc552]/10 px-3 py-1 text-xs font-medium text-[#ffc552]">
              {item.sign}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function UnluBurcPage() {
  return (
    <div className="bg-[#070B12] pb-28">
      {/* HERO */}
      <section className="bg-[#070B12] py-20 text-center border-b border-gray-200">
        <Container size="md">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#EDE9DF]">
            Hangi Ünlü Hangi Burç?
          </h1>
          <p className="mt-4 text-[#8494B2] max-w-2xl mx-auto">
            Sevdiğin oyuncuların, futbolcuların, müzisyenlerin ve
            siyasetçilerin burçlarını keşfet. Bakalım favori ünlün
            seninle aynı burç mu?
          </p>
        </Container>
      </section>

      {/* CATEGORY GRID */}
      <section className="mt-16">
        <Container size="lg">
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
            {CELEBRITY_DATA.map((group) => (
              <CategoryCard
                key={group.category}
                title={group.category}
                items={group.items}
              />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

