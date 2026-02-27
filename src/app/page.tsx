import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/layout/Container";
import { ZODIAC_SIGNS } from "@/data/zodiac";
import { TESTS } from "@/data/tests";
import { getFeaturedArticles } from "@/lib/getArticles";
import Image from "next/image";

const ELEMENT_LABELS: Record<string, string> = {
  fire: "Ateş",
  earth: "Toprak",
  air: "Hava",
  water: "Su",
};

const randomTests = [...TESTS]
  .sort(() => 0.5 - Math.random())
  .slice(0, 3);
  
function getCurrentZodiac() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  return ZODIAC_SIGNS.find((sign) => {
    const { start, end } = sign.dateRange;

    // Normal aralık
    if (start.month < end.month) {
      return (
        (month === start.month && day >= start.day) ||
        (month === end.month && day <= end.day) ||
        (month > start.month && month < end.month)
      );
    }

    // Yıl atlayan aralık (Oğlak)
    return (
      (month === start.month && day >= start.day) ||
      (month === end.month && day <= end.day) ||
      month > start.month ||
      month < end.month
    );
  });
}

export default async function HomePage() {
  const featuredZodiac = getCurrentZodiac();
  const featuredArticles = await getFeaturedArticles(6);

  return (
    <div className="bg-[#F7F8FC] pb-28">

{/* HERO */}
<section className="relative overflow-hidden bg-[#0F1020] text-white">

  {/* Arka plan katmanlı glow */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(91,63,255,0.25),transparent_60%)]" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(120,80,255,0.15),transparent_70%)]" />

  <Container size="lg">
    <div className="relative grid items-center gap-16 py-28 lg:grid-cols-2">

      {/* SOL */}
      <div>
        <p className="mb-6 inline-block rounded-full border border-[#5B3FFF]/40 bg-[#5B3FFF]/10 px-4 py-1 text-sm text-[#8C7BFF]">
          ✦ Astroli ile Kendini Keşfet
        </p>

        <h1 className="text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
          Burcunu Öğren,
          <br />
          <span className="bg-gradient-to-r from-[#6C5BFF] to-indigo-400 bg-clip-text text-transparent">
            Kişiliğini Keşfet
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-gray-300">
          Doğum tarihini gir, güneş, yükselen ve ay burcunu anında öğren.
          Eğlenceli ve modern testlerle kendini daha yakından tanı.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/burc-hesapla">
            <Button
              size="lg"
              className="bg-[#5B3FFF] hover:bg-[#4A32E0] shadow-lg shadow-[#5B3FFF]/40 transition-all duration-300 hover:scale-[1.03]"
            >
              Burcunu Öğren
            </Button>
          </Link>

          <Link
            href="/testler"
            className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 backdrop-blur hover:bg-white/10 transition"
          >
            Testleri Keşfet →
          </Link>
        </div>
      </div>

{/* SAĞ */}
<div className="relative mt-12 lg:mt-0">

  <div className="-mx-4 sm:-mx-6 lg:mx-0 lg:w-[125%] lg:-mr-32">
    <Image
      src="/hero4.png"
      alt="Astroli Hero"
      width={1600}
      height={1100}
      priority
      className="w-full h-auto object-cover"
    />
  </div>

  {/* Fade sadece desktop */}
  <div className="hidden lg:block pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#0F1020] to-transparent" />

</div>



    </div>
  </Container>
</section>

{/* ================= DÖRT KART: GÜNLÜK / HAFTALIK / ÜNLÜLER / MESLEKLER ================= */}
<section className="mt-24">
  <Container size="lg">
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    

      {/* 1. Günlük burç yorumları */}
      <Link
        href="/gunluk-burc"
        className="group block rounded-2xl overflow-hidden bg-white border border-gray-200 hover:shadow-lg transition"
      >
        <div className="relative h-40 w-full overflow-hidden sm:h-44 bg-gradient-to-br from-[#5B3FFF]/10 to-[#5B3FFF]/5">
           <div className="relative h-40 w-full overflow-hidden sm:h-44">
          <Image
            src="/gunluk.png"
            alt="Hangi ünlü hangi burç?"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        </div>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-black">Günlük Burç Yorumları</h2>
          <p className="mt-1 text-sm text-gray-500">Bugün burcun ne söylüyor? →</p>
        </div>
      </Link>

      {/* 2. Haftalık burç yorumu */}
      <Link
        href="/haftalik-burc"
        className="group block rounded-2xl overflow-hidden bg-white border border-gray-200 hover:shadow-lg transition"
      >
        <div className="relative h-40 w-full overflow-hidden sm:h-44 bg-gradient-to-br from-amber-100 to-orange-50">
           <div className="relative h-40 w-full overflow-hidden sm:h-44">
          <Image
            src="/haftalik.png"
            alt="Hangi ünlü hangi burç?"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        </div>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-black">Haftalık Burç Yorumu</h2>
          <p className="mt-1 text-sm text-gray-500">Bu hafta sağlık, aşk, para, iş →</p>
        </div>
      </Link>

  {/* 3. Burçlara Göre Meslekler */}
      <Link
        href="/burclar/meslekler"
        className="group block rounded-2xl overflow-hidden bg-white border border-gray-200 hover:shadow-lg transition"
      >
       <div className="relative h-40 w-full overflow-hidden sm:h-44">
          <Image
            src="/meslek.png"
            alt="Hangi ünlü hangi burç?"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-black">Burçlara Göre Meslekler</h2>
          <p className="mt-1 text-sm text-gray-500">Burcuna uygun kariyeri keşfet →</p>
        </div>
      </Link>
      
        {/* 4. Hangi Ünlü Hangi Burç */}
      <Link
        href="/unluler"
        className="group block rounded-2xl overflow-hidden bg-white border border-gray-200 hover:shadow-lg transition"
      >
        <div className="relative h-40 w-full overflow-hidden sm:h-44">
          <Image
            src="/dergi/unlu.png"
            alt="Hangi ünlü hangi burç?"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-black">Hangi Ünlü Hangi Burç?</h2>
          <p className="mt-1 text-sm text-gray-500">Ünlülerin burçlarını keşfet →</p>
        </div>
      </Link>

    
    </div>
  </Container>
</section>


      
      {/* FEATURED – Üç kart: Kozmik Enerji / Bugünün Burcu / Retro Merkezi */}
      <section className="mt-24">
        <Container size="lg">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="min-w-0">

                 <div className="min-w-0">
            <Link href="/retro" className="block h-full">
              <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#5B3FFF]/30 transition h-full flex flex-col">
                <h2 className="mb-4 text-2xl font-semibold text-black">
                  Retro Merkezi
                </h2>
                <p className="text-[#444] leading-relaxed flex-1">
                  Merkür, Venüs, Mars ve Satürn retrolarını takvim, kişisel analiz ve karar desteğiyle takip et. Korku değil, farkındalık.
                </p>
                <span className="mt-6 inline-block text-[#5B3FFF] font-medium">
                  Retro Merkezi&apos;ne git →
                </span>
              </div>
            </Link>
            </div>

          
            </div>

            {featuredZodiac && (
              <div className="min-w-0">
              <Link href={`/burc/${featuredZodiac.id}`} className="block h-full">
                <div className="h-full rounded-2xl bg-[#11121A] p-8 text-white hover:shadow-lg transition">
                  <h2 className="mb-6 text-2xl font-semibold">
                    Bugünün Burcu
                  </h2>

                  <div className="flex items-center gap-6">
                    <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-[#1A1C2B]">
                      <Image
                        src={`/zodiac/${featuredZodiac.id}.png`}
                        alt={featuredZodiac.nameTr}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold">
                        {featuredZodiac.nameTr}
                      </h3>
                      <p className="mt-1 text-gray-400">
                        {featuredZodiac.dates}
                      </p>
                      <span className="mt-3 inline-block rounded-full bg-[#5B3FFF]/20 px-3 py-1 text-xs text-[#5B3FFF]">
                        {ELEMENT_LABELS[featuredZodiac.element]}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
              </div>
            )}
           
             <div className="h-full rounded-2xl bg-white p-8 shadow-sm border border-gray-200">
              <h2 className="mb-4 text-2xl font-semibold text-black">
                Haftalık Kozmik Enerji
              </h2>
              <p className="text-[#444] leading-relaxed">
                Bu hafta Merkür retrosu sona eriyor. İletişimde netlik artacak.
                Özellikle toprak burçları için verimli bir dönem.
              </p>
              <Link
                href="/dergi/haftalik-burc-enerjisi"
                className="mt-6 inline-block text-[#5B3FFF] font-medium hover:underline"
              >
                Devamını oku →
              </Link>
            </div>
         

          </div>
        </Container>
      </section>

     
{/* ================= DOĞUM HARİTASI CTA ================= */}
<section className="mt-28">
  <Container size="lg">
    <div className="relative overflow-hidden rounded-3xl bg-[#11121A] text-white p-10 lg:p-14">

      {/* Glow */}
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#5B3FFF]/30 blur-3xl" />

      <div className="relative grid items-center gap-10 lg:grid-cols-2">

        {/* TEXT */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Doğum Haritanı
            <br />
            Detaylı Analiz Et
          </h2>

          <p className="mt-6 text-gray-300 leading-relaxed">
            Sadece güneş burcun değil.
            Yükselen, ay burcu ve gezegen yerleşimlerinle
            gerçek karakter analizini keşfet.
          </p>

          <Link
            href="/birth-chart"
            className="mt-8 inline-block rounded-xl bg-[#5B3FFF] px-6 py-3 font-medium hover:bg-[#3E2BCB] transition"
          >
            Haritayı Hesapla
          </Link>
        </div>

        {/* IMAGE */}
        <div className="relative">
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl shadow-xl">
            <Image
              src="/dogum.png"
              alt="Doğum Haritası"
              fill
              className="object-cover"
            />
          </div>
        </div>

      </div>
    </div>
  </Container>
</section>




{/* POPULAR TESTS */}
<section className="mt-24">
  <Container size="lg">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-2xl font-semibold text-black sm:text-3xl">
        Popüler Kişilik Testleri
      </h2>

      <Link
        href="/testler"
        className="text-sm font-medium text-[#5B3FFF] hover:underline"
      >
        Tümünü Gör →
      </Link>
    </div>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
     {TESTS.slice(0, 3).map((test) => (
    <Link key={test.id} href={`/test/${test.slug}`}>
    <Card className="bg-white hover:shadow-lg transition overflow-hidden group">
      
      {/* Görsel */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={test.image}
          alt={test.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* İçerik */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-black mb-2">
          {test.title}
        </h2>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {test.description}
        </p>

        <p className="text-sm text-[#5B3FFF] font-medium">
          {test.duration}
        </p>
      </div>

    </Card>
  </Link>
))}

    </div>
     </Container>
</section>




{/* ================= DERGİ SECTION – Öne çıkan makaleler ================= */}
<section className="mt-24">
  <Container size="lg">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-2xl font-semibold text-black sm:text-3xl">
        Dergiden Öne Çıkanlar
      </h2>
      <Link href="/dergi" className="text-sm font-medium text-[#5B3FFF] hover:underline">
        Tümünü Gör →
      </Link>
    </div>
    {featuredArticles.length === 0 ? (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white/50 py-12 text-center text-gray-500">
        Öne çıkan makale henüz yok. Dergi sayfasından tüm makalelere ulaşabilirsiniz.
      </div>
    ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredArticles.map((article) => (
          <Link
            key={article.id}
            href={`/dergi/${article.slug}`}
            className="group rounded-2xl overflow-hidden bg-white border border-gray-200 hover:shadow-lg transition block"
          >
            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
              {article.image ? (
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                  {article.tag}
                </div>
              )}
            </div>
            <div className="p-6">
              <span className="text-xs font-medium uppercase tracking-wider text-[#5B3FFF]">
                {article.tag}
              </span>
              <h3 className="mt-1 font-semibold text-black line-clamp-2">
                {article.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                {article.excerpt || article.title}
              </p>
              {article.readTime != null && (
                <p className="mt-3 text-xs text-gray-400">{article.readTime} dk okuma</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    )}
  </Container>
</section>




    </div>
  );
}
