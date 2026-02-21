import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RetroChecklist } from "@/components/retro/RetroChecklist";
import { RetroDecisionAssistant } from "@/components/retro/RetroDecisionAssistant";
import { RetroFAQ } from "@/components/retro/RetroFAQ";
import {
  getRetroByPlanet,
  type RetroPlanet,
} from "@/lib/retro-data";
import { getBaseUrl } from "@/lib/site-url";

const PLANETS: RetroPlanet[] = ["mercury", "venus", "mars", "saturn"];

const PLANET_LABELS: Record<RetroPlanet, string> = {
  mercury: "Merkür Retrosu",
  venus: "Venüs Retrosu",
  mars: "Mars Retrosu",
  saturn: "Satürn Retrosu",
};

function getPlanetExplainer(planet: RetroPlanet) {
  if (planet === "mercury") {
    return {
      title: "Merkür Retrosu 2026 – İletişim, Zihin ve Veri Akışı",
      description:
        "Merkür retrosu; iletişim, düşünme biçimi ve bilgi akışıyla ilgili süreçleri yavaşlatan, zihinsel farkındalık için güçlü bir dönemdir.",
      heroBody:
        "Astrolojide Merkür; zihnimiz, iletişim tarzımız, veri akışı ve gündelik planlama becerilerimizle ilişkilendirilir. Retroya girdiğinde ise hayatı durdurmak yerine, otomatik pilotta yaptığımız işleri daha görünür kılar. Bilimsel açıdan; karar verme süreçlerinde aceleci davranmamak, metinleri ikinci kez okumak ve dikkat yönetimini güçlendirmek bu dönemde ekstra değer kazanır.",
      psychology:
        "Psikolojik perspektiften Merkür retrosu, bilişsel yükünü ve iletişim kaliteni gözden geçirmek için bir davet gibidir. Zihninin hızına değil; netliğine odaklanmanı, ertelediğin konuşmaları daha olgun bir dille yeniden ele almanı destekler.",
    };
  }

  if (planet === "venus") {
    return {
      title: "Venüs Retrosu – İlişkiler, Öz-değer ve Zevk Alanları",
      description:
        "Venüs retrosu; ilişkiler, öz-değer algısı ve harcama/zevk alışkanlıklarını nazikçe sorgulaman için bir içe dönüş dönemidir.",
      heroBody:
        "Astrolojide Venüs, ilişki kurma biçimimizi, estetik algımızı ve zevk aldığımız alanları temsil eder. Retro sürecinde; ilişkilerdeki tekrar eden dinamikler, para ile kurduğun bağ ve kendine verdiğin değer daha görünür hale gelir.",
      psychology:
        "Psikolojik açıdan Venüs retrosu, bağlanma stillerini, öz-değer algını ve sınırlarını fark etmen için yumuşak ama derin bir odaklanma alanı sunar.",
    };
  }

  if (planet === "mars") {
    return {
      title: "Mars Retrosu – Enerji, Öfke ve Eylem Biçimi",
      description:
        "Mars retrosu; enerjini nasıl kullandığını, öfkeyle nasıl başa çıktığını ve eyleme geçme motivasyonunu yeniden kalibre etmen için bir duraklama alanıdır.",
      heroBody:
        "Astrolojide Mars; motivasyon, cesaret ve 'harekete geçme' tuşumuzla ilişkilendirilir. Retro olduğunda; dürtüsel tepkiler, bastırılmış öfke ve tükenmişlik döngüleri daha görünür olabilir.",
      psychology:
        "Psikolojik açıdan Mars retrosu, öfkeni bastırmadan ama kimseyi yaralamadan ifade etmeyi öğrenmen için önemli bir egzersiz alanı yaratır.",
    };
  }

  return {
    title: "Satürn Retrosu – Sorumluluk, Sınırlar ve Olgunlaşma",
    description:
      "Satürn retrosu; sorumluluklarını, uzun vadeli yapılarını ve içsel otorite algını test eden olgunlaştırıcı bir dönemdir.",
    heroBody:
      "Astrolojide Satürn; zaman, sorumluluk, disiplin ve sınırlar gezegeni olarak bilinir. Retrosu; hayatındaki yapıları, hedeflerini ve taşıdığın yükleri gerçekçi bir gözle değerlendirmen için güçlü bir duraklama fırsatıdır.",
    psychology:
      "Psikolojik perspektiften Satürn retrosu, 'yeterince iyi miyim?' sorusunu yeniden çerçeveleyip, kendini sadece performans ve üretkenlik üzerinden tanımlamaktan uzaklaştırman için alan açar.",
  };
}

function getFaq(planet: RetroPlanet) {
  if (planet === "mercury") {
    return [
      {
        question: "Merkür retrosunda hiçbir şekilde sözleşme imzalamamalı mıyım?",
        answer:
          "Hayır. Astroli yaklaşımına göre Merkür retrosu, imza atmayı yasaklayan bir dönem değildir. Sadece; metni iki kez okumak, anlamadığın maddeleri sormak ve mümkünse bir gece düşünüp karar vermek gibi sağlıklı karar süreçlerini teşvik eder.",
      },
      {
        question: "Merkür retrosu gerçekten teknolojik arızaları artırır mı?",
        answer:
          "Bu dönemde dikkat dağınıklığı ve acelecilik arttığı için, cihaz ve veri yönetiminde daha fazla hata yaşanabilir. Bunu doğrudan “gezegen yaptı” demektense; dikkat yönetimi ve planlama hatalarına işaret eden sembolik bir çerçeve olarak düşünebilirsin.",
      },
      {
        question: "Eski ilişkiler Merkür retrosunda neden geri döner?",
        answer:
          "Retro dönemleri, zihinsel ve duygusal olarak yarım kalmış konuları hatırlatabilir. Bu, illa geri dönmen gerektiği anlamına gelmez; çoğunlukla o deneyimden ne öğrendiğini yeniden tanımlama fırsatıdır.",
      },
    ];
  }

  if (planet === "venus") {
    return [
      {
        question: "Venüs retrosunda ilişkiye başlamak kötü mü?",
        answer:
          "Mutlak bir 'kötü' ya da 'yasak' yoktur. Ancak bu dönem, ilişki dinamiklerinin daha hızlı test edilebildiği bir süreç gibi çalışabilir. Başladığın ilişkiyi, daha yüksek farkındalık ve açık iletişimle yürütmek önemli hale gelir.",
      },
      {
        question: "Venüs retrosunda estetik operasyon yaptırmamalı mıyım?",
        answer:
          "Kesin bir yasak olarak görmek yerine; beden algın, öz-değerin ve dış onay ihtiyacın arasındaki dengeyi daha dikkatli incelemen için bir hatırlatıcı gibi görebilirsin. Büyük, geri dönüşü zor adımlarda ek düşünme payı bırakmak sağlıklı olabilir.",
      },
    ];
  }

  if (planet === "mars") {
    return [
      {
        question: "Mars retrosu sadece öfke patlamalarıyla mı ilgilidir?",
        answer:
          "Hayır. Bu dönem aynı zamanda motivasyon düşüşü, yorgunluk ve 'hiçbir şey yapmak istemiyorum' hissiyle de ilişkilendirilebilir. Önemli olan, enerjini nasıl doldurduğunu ve nerede tükendiğini fark etmektir.",
      },
    ];
  }

  return [
    {
      question: "Satürn retrosu neden ağır hissedilebilir?",
      answer:
        "Satürn, sorumluluk ve yapı gezegenidir; retrosu sırasında eksik ya da gevşek kalan alanlar daha görünür hale gelebilir. Bu, 'başarısızlık' göstergesi değil; sistemini güçlendirme çağrısı olarak okunabilir.",
    },
  ];
}

type Params = {
  planet: string;
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { planet: planetParam } = await params;
  const planet = planetParam as RetroPlanet;

  if (!PLANETS.includes(planet)) {
    return {};
  }

  const explainer = getPlanetExplainer(planet);
  const yearSegment = "2026";

  const title =
    planet === "mercury"
      ? `Merkür Retrosu ${yearSegment} – Tarihleri, Etkileri ve Yapılması Gerekenler | Astroli`
      : `${PLANET_LABELS[planet]} – Etkileri ve Psikolojik Yaklaşım | Astroli`;

  return {
    title,
    description: explainer.description,
    openGraph: {
      title,
      description: explainer.description,
      url: `${getBaseUrl()}/retro/${planet}`,
      type: "article",
    },
    alternates: {
      canonical: `${getBaseUrl()}/retro/${planet}`,
    },
  };
}

export function generateStaticParams() {
  return PLANETS.map((planet) => ({ planet }));
}

export default async function RetroPlanetPage({ params }: { params: Promise<Params> }) {
  const { planet: planetParam } = await params;
  const planet = planetParam as RetroPlanet;

  if (!PLANETS.includes(planet)) {
    notFound();
  }

  const explainer = getPlanetExplainer(planet);
  const events = getRetroByPlanet(planet);
  const current = events[0];
  const faq = getFaq(planet);
  const planetName = PLANET_LABELS[planet];
  const canonicalUrl = `${getBaseUrl()}/retro/${planet}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 text-gray-900">
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <p className="mb-6">
          <Link
            href="/retro"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-purple-600"
          >
            <span aria-hidden>←</span>
            Retro Merkezi&apos;ne dön
          </Link>
        </p>
        <section className="relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500">
                Retro merkezi · {planetName}
              </p>
              <h1 className="mt-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 bg-clip-text text-2xl font-semibold text-transparent sm:text-3xl">
                {explainer.title}
              </h1>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">{explainer.heroBody}</p>

              <div className="mt-4 rounded-2xl border-2 border-gray-200 bg-gray-50 p-4 text-xs">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                  Psikolojik yaklaşım
                </p>
                <p className="mt-1 leading-relaxed text-gray-700">
                  {explainer.psychology}
                </p>
              </div>
            </div>

            {current && (
              <aside className="space-y-3 rounded-3xl border-2 border-gray-200 bg-gray-50 p-4 text-xs">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                  Yaklaşan / güncel dönem
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {PLANET_LABELS[planet]}
                </p>
                <p className="text-[13px] text-gray-600">
                  Odak temalar:{" "}
                  {current.themes.slice(0, 3).join(" · ")}
                </p>
                <ul className="mt-2 space-y-1 text-[12px] text-gray-700">
                  {current.doList.slice(0, 2).map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-[11px] text-gray-500">
                  Bu bilgiler{" "}
                  <span className="font-semibold text-gray-800">
                    psikolojik farkındalık
                  </span>{" "}
                  amaçlıdır; kesin hüküm veya korku dili içermez.
                </p>
              </aside>
            )}
          </div>
        </section>

        {current && (
          <div className="mt-8">
            <RetroChecklist
              planetLabel={planetName}
              planetKey={planet}
              items={current.doList}
            />
          </div>
        )}

        <div className="mt-8">
          <RetroDecisionAssistant planetName={planetName} />
        </div>

        <RetroFAQ
          planetName={planetName}
          faq={faq}
          canonicalUrl={canonicalUrl}
        />

        <p className="mt-10 border-t border-gray-200 pt-6">
          <Link
            href="/retro"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-purple-600"
          >
            <span aria-hidden>←</span>
            Retro Merkezi&apos;ne dön
          </Link>
        </p>
      </main>
    </div>
  );
}

