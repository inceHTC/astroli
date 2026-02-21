"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

type CareerItem = {
  sign: string;
  best: string[];
  avoid: string[];
  tags: string[];
};

const CAREER_DATA: CareerItem[] = [
  {
    sign: "Koç",
    best: [
      "Girişimci", "Startup kurucusu", "Sporcu", "Antrenör", "Yönetici", "CEO", "Satış direktörü",
      "Pazarlama müdürü", "Asker / Polis", "İtfaiyeci", "Avukat (dava)", "Yönetim danışmanı",
      "Proje lideri", "Growth hacker", "E-ticaret girişimcisi", "Fitness koçu", "Etkinlik organizatörü",
      "Politikacı", "Satış temsilcisi", "Reklam yönetmeni",
    ],
    avoid: ["Rutin masa başı işler", "Tekrarlayan ofis işleri", "Arka planda kalan roller"],
    tags: ["lider", "enerjik"],
  },
  {
    sign: "Boğa",
    best: [
      "Bankacı", "Mimar", "İç mimar", "Şef", "Pastacı", "Finans uzmanı", "Yatırım danışmanı",
      "Gayrimenkul danışmanı", "Muhasebeci", "Sigortacı", "Tarım / bahçe uzmanı", "Sanat galerisi yöneticisi",
      "Lüks marka yöneticisi", "Emlak geliştirici", "Gastronomi işletmecisi", "Wellness merkezi sahibi",
      "Varlık yöneticisi", "Koleksiyoncu / danışman", "Mobilya tasarımcı", "Organik ürün girişimcisi",
    ],
    avoid: ["Aşırı riskli yatırımlar", "Sürekli değişen roller", "Belirsiz gelirli işler"],
    tags: ["istikrar", "finans"],
  },
  {
    sign: "İkizler",
    best: [
      "Gazeteci", "Yazar", "İçerik üretici", "Sosyal medya yöneticisi", "Pazarlama uzmanı",
      "Podcast sunucusu", "YouTuber", "Influencer", "Halkla ilişkiler", "Çevirmen", "Editör",
      "Eğitmen / eğitim tasarımcısı", "Satış ve müşteri ilişkileri", "Araştırmacı", "Blog yazarı",
      "Community manager", "Copywriter", "SEO uzmanı", "Etkinlik moderatörü", "Danışman",
    ],
    avoid: ["Tekdüze, tekrarlayan işler", "Uzun süre odak gerektiren tek konu", "Sessiz ortamlar"],
    tags: ["iletişim", "yaratıcı"],
  },
  {
    sign: "Yengeç",
    best: [
      "Psikolog", "Terapist", "Öğretmen", "Kreş / anaokulu öğretmeni", "Sosyal hizmet uzmanı",
      "İnsan kaynakları", "Ev dekoratörü", "Aşçı (ev yemekleri)", "Bakım koordinatörü",
      "Aile danışmanı", "Hemşire", "Yaşlı / çocuk bakımı", "İç mimar (konfor odaklı)",
      "Yemek blog yazarı", "Parenting koçu", "Restoran işletmecisi", "Otelcilik",
      "Etkinlik planlayıcı (düğün, doğum günü)", "Müze / kültür rehberi", "Danışmanlık",
    ],
    avoid: ["Soğuk, duygusuz ortamlar", "Aşırı rekabetçi alanlar", "Sürekli seyahat gerektiren işler"],
    tags: ["empati", "istikrar"],
  },
  {
    sign: "Aslan",
    best: [
      "Oyuncu", "Yönetmen", "Lider", "CEO", "Reklamcı", "Marka yöneticisi", "Organizatör",
      "Etkinlik yöneticisi", "Influencer", "Sunucu", "Radyo / TV programcı", "Moda tasarımcısı",
      "Lüks satış", "Politikacı", "Eğitmen (sahne)", "Sahne sanatları", "Sosyal medya yıldızı",
      "Kurumsal eğitmen", "Koç (kariyer / liderlik)", "Galeri sahibi", "Restoran / mekân sahibi",
    ],
    avoid: ["Görünmez, arka planda kalınan pozisyonlar", "Küçük detaylara boğulma", "Tek başına çalışma"],
    tags: ["lider", "yaratıcı"],
  },
  {
    sign: "Başak",
    best: [
      "Doktor", "Hemşire", "Eczacı", "Analist", "Veri analisti", "Yazılım geliştirici",
      "Kalite kontrol uzmanı", "Proje yöneticisi", "Editör", "Arşivci", "Kütüphaneci",
      "Diyetisyen", "Fizyoterapist", "Laborant", "Muhasebeci", "İnsan kaynakları (prosedür)",
      "UX researcher", "Süreç iyileştirme uzmanı", "İçerik editörü", "Araştırma asistanı",
    ],
    avoid: ["Düzensiz, kaotik ortamlar", "Belirsiz talimatlar", "Detaysız, yüzeysel işler"],
    tags: ["analitik", "istikrar"],
  },
  {
    sign: "Terazi",
    best: [
      "Avukat", "Hakim", "Hukuk danışmanı", "Diplomat", "Halkla ilişkiler", "Mediator",
      "İç mimar", "Moda danışmanı", "Marka stratejisti", "Sanat danışmanı", "Galeri yöneticisi",
      "Etkinlik planlayıcı", "İnsan kaynakları", "Müşteri deneyimi uzmanı", "Pazarlama (estetik)",
      "Evlilik / ilişki danışmanı", "Kurumsal iletişim", "Lüks danışman", "Estetisyen / güzellik uzmanı",
      "Sosyal girişimci",
    ],
    avoid: ["Adaletsiz ortamlar", "Tek başına karar verme baskısı", "Çirkin / düzensiz iş ortamı"],
    tags: ["iletişim", "yaratıcı"],
  },
  {
    sign: "Akrep",
    best: [
      "Araştırmacı", "Dedektif", "Psikolog", "Terapist", "Strateji danışmanı", "Kriz yöneticisi",
      "Güvenlik uzmanı", "Siber güvenlik", "Forensik", "Gazeteci (araştırmacı)", "Yatırımcı",
      "VC / private equity", "HR (dönüşüm)", "Pazarlama (veri odaklı)", "İstihbarat analisti",
      "Content strategist", "SEO / growth uzmanı", "Hayat koçu", "Hipnoterapist", "Yazar (polisiye)",
    ],
    avoid: ["Yüzeysel ilişkiler", "Şeffaf olmayan yapılar", "Etkisiz hissettiren roller"],
    tags: ["analitik", "lider"],
  },
  {
    sign: "Yay",
    best: [
      "Öğretmen", "Eğitmen", "Yazar", "Yayıncı", "Seyahat rehberi", "Tur operatörü",
      "Felsefe / din bilimci", "Uluslararası ilişkiler", "İhracat / ithalat", "Spor yorumcusu",
      "Podcast / video içerik üreticisi", "Dil öğretmeni", "Kültür danışmanı", "Girişimci (global)",
      "Üniversite hocası", "Danışman", "Coaching", "Blog / vlog (seyahat)", "Etkinlik konuşmacısı",
      "Yayıncılık / medya",
    ],
    avoid: ["Dar, kısıtlayıcı ortamlar", "Rutin ofis işi", "Felsefesiz, anlamsız işler"],
    tags: ["iletişim", "enerjik"],
  },
  {
    sign: "Oğlak",
    best: [
      "Yönetici", "CEO", "Finans müdürü", "Muhasebeci", "Mimar", "Mühendis", "Hukukçu",
      "Politikacı", "Kamu yöneticisi", "Proje direktörü", "Operasyon müdürü", "Gayrimenkul",
      "İnşaat yöneticisi", "Strateji danışmanı", "Denetçi", "Bankacı", "Sigortacı",
      "Üretim müdürü", "Kariyer koçu (kurumsal)", "Eğitim yöneticisi", "Dernek / vakıf yöneticisi",
    ],
    avoid: ["Belirsiz kariyer yolu", "Disiplinsiz ortamlar", "Kısa vadeli, güvencesiz işler"],
    tags: ["lider", "istikrar"],
  },
  {
    sign: "Kova",
    best: [
      "Yazılımcı", "UX/UI tasarımcı", "Sosyal girişimci", "İnovasyon danışmanı", "Bilim insanı",
      "Araştırmacı", "İnsan kaynakları (DEI)", "Community builder", "NFT / Web3", "Yapay zeka etiği",
      "Sürdürülebilirlik uzmanı", "İklim / çevre danışmanı", "Teknoloji yazarı", "Podcast yapımcısı",
      "Açık kaynak geliştirici", "Startup ekosistem danışmanı", "Future of work danışmanı",
      "Uzaktan çalışma uzmanı", "Dijital dönüşüm", "İnsanlık odaklı tasarım",
    ],
    avoid: ["Katı hiyerarşi", "Gelenekçi, değişime kapalı ortamlar", "Sadece para odaklı işler"],
    tags: ["yaratıcı", "analitik"],
  },
  {
    sign: "Balık",
    best: [
      "Sanatçı", "Müzisyen", "Yazar", "Şair", "Terapist", "Psikolog", "Rehber / spiritüel danışman",
      "Hemşire", "Sosyal hizmet", "Film yönetmeni", "Fotoğrafçı", "Grafik tasarımcı",
      "Oyuncu", "Dansçı", "Masaj / alternatif terapist", "Hayır kurumu çalışanı",
      "İçerik yaratıcı (duygusal)", "Müze / sanat rehberi", "Müzik prodüktörü", "Yaşam koçu",
    ],
    avoid: ["Katı sistemler", "Duygusuz, sadece sayı odaklı işler", "Aşırı rekabetçi ortamlar"],
    tags: ["yaratıcı", "empati"],
  },
];

function CareerCard({ item }: { item: CareerItem }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200 hover:shadow-lg transition">
      <h2 className="text-lg font-semibold text-black">
        {item.sign} Burcu
      </h2>

      <div className="mt-4">
        <p className="text-sm font-medium text-[#5B3FFF]">
          ⭐ Uygun Meslekler
        </p>
        <ul className="mt-2 space-y-1 text-sm text-gray-700">
          {item.best.map((job) => (
            <li key={job}>• {job}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-red-500">
          ⚠️ Uzak Durmalı
        </p>
        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          {item.avoid.map((job) => (
            <li key={job}>• {job}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function MesleklerPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const [miniResult, setMiniResult] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    return CAREER_DATA.filter((item) => {
      const matchSearch =
        item.sign.toLowerCase().includes(search.toLowerCase()) ||
        item.best.some((job) =>
          job.toLowerCase().includes(search.toLowerCase())
        );

      const matchFilter = filter
        ? item.tags.includes(filter)
        : true;

      return matchSearch && matchFilter;
    });
  }, [search, filter]);

  const handleMiniTest = () => {
    const random = CAREER_DATA.sort(() => 0.5 - Math.random()).slice(0, 3);
    setMiniResult(random.map((r) => r.best[0]));
  };

  return (
    <div className="bg-[#F7F8FC] pb-28">
      {/* HERO */}
      <section className="bg-white py-20 text-center border-b border-gray-200">
        <Container size="md">
          <Link href="/burclar" className="inline-block text-sm text-[#5B3FFF] hover:underline mb-6">
            ← Burçlar
          </Link>
          <h1 className="text-4xl font-bold text-black">
            Burçlara Göre Meslekler
          </h1>
          <p className="mt-4 text-[#444]">
            Ara, filtrele ve burcuna en uygun kariyeri keşfet.
          </p>
        </Container>
      </section>

      {/* SEARCH + FILTER */}
      <section className="mt-12">
        <Container size="lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <input
              type="text"
              placeholder="Meslek veya burç ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-1/2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B3FFF]/40"
            />

            <div className="flex gap-2 flex-wrap">
              {[
                { id: "lider", label: "Lider" },
                { id: "yaratıcı", label: "Yaratıcı" },
                { id: "analitik", label: "Analitik" },
                { id: "iletişim", label: "İletişim" },
                { id: "istikrar", label: "İstikrar" },
                { id: "finans", label: "Finans" },
                { id: "empati", label: "Empati" },
                { id: "enerjik", label: "Enerjik" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setFilter(filter === id ? null : id)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                    filter === id
                      ? "bg-[#5B3FFF] text-white"
                      : "bg-white border border-gray-200 text-black"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* GRID */}
      <section className="mt-12">
        <Container size="lg">
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredData.map((item) => (
              <CareerCard key={item.sign} item={item} />
            ))}
          </div>
        </Container>
      </section>

      {/* MINI TEST */}
      <section className="mt-20">
        <Container size="md">
          <div className="rounded-2xl bg-white p-8 shadow border text-center">
            <h2 className="text-2xl font-semibold text-black">
              Sana En Uygun 3 Meslek
            </h2>
            <p className="mt-2 text-gray-600">
              Rastgele öneri al ve enerjini keşfet.
            </p>

            <div className="mt-6">
              <Button onClick={handleMiniTest}>
                Meslek Öner
              </Button>
            </div>

            {miniResult.length > 0 && (
              <div className="mt-6 space-y-2 text-[#5B3FFF] font-medium">
                {miniResult.map((m, i) => (
                  <p key={i}>• {m}</p>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
