/**
 * Rule-based personality summary from Sun, Moon, Rising and strongest aspect.
 * No external AI; synthesis only from predefined traits.
 * Turkish language output.
 */

import type { PlanetPosition } from "./calculateChart";
import type { RisingResult } from "./calculateChart";
import type { Aspect } from "./aspects";
import type { ZodiacSignId } from "./zodiac";

const SIGN_NAMES_TR: Record<ZodiacSignId, string> = {
  aries: "Koç",
  taurus: "Boğa",
  gemini: "İkizler",
  cancer: "Yengeç",
  leo: "Aslan",
  virgo: "Başak",
  libra: "Terazi",
  scorpio: "Akrep",
  sagittarius: "Yay",
  capricorn: "Oğlak",
  aquarius: "Kova",
  pisces: "Balık",
};

const ELEMENT_BY_SIGN: Record<ZodiacSignId, "fire" | "earth" | "air" | "water"> = {
  aries: "fire",
  taurus: "earth",
  gemini: "air",
  cancer: "water",
  leo: "fire",
  virgo: "earth",
  libra: "air",
  scorpio: "water",
  sagittarius: "fire",
  capricorn: "earth",
  aquarius: "air",
  pisces: "water",
};

const SUN_TRAITS: Record<ZodiacSignId, string[]> = {
  aries: ["girişken", "öncü", "doğrudan", "enerjik", "rekabetçi"],
  taurus: ["istikrarlı", "ayakları yere basan", "duyusal", "sebatlı", "güven odaklı"],
  gemini: ["meraklı", "iletişim odaklı", "uyum sağlayan", "esprili", "çok yönlü"],
  cancer: ["koruyucu", "sezgisel", "duygusal", "evine bağlı"],
  leo: ["özgüvenli", "yaratıcı", "cömert", "etkileyici", "sıcak kalpli"],
  virgo: ["analitik", "titiz", "hizmet odaklı", "mütevazı", "pratik"],
  libra: ["diplomatik", "uyum arayan", "adil", "zarif", "sosyal"],
  scorpio: ["yoğun", "dönüştürücü", "algılı", "dayanıklı", "özel"],
  sagittarius: ["felsefi", "maceraperest", "iyimser", "dürüst", "özgürlükçü"],
  capricorn: ["hırslı", "disiplinli", "sorumlu", "sabırlı", "yapılandırılmış"],
  aquarius: ["yenilikçi", "bağımsız", "insancıl", "alışılmadık", "mesafeli"],
  pisces: ["şefkatli", "hayalperest", "uyumlu", "sanatçı ruhlu", "hassas"],
};

const MOON_TRAITS: Record<ZodiacSignId, string[]> = {
  aries: ["duygularda hızlı tepki", "duygusal bağımsızlık ihtiyacı", "yakınlıkta sabırsızlık"],
  taurus: ["konfor ve istikrar ihtiyacı", "ilişkilerde kararlılık", "duyguları duyusal ifade"],
  gemini: ["duyguları konuşarak yaşama ihtiyacı", "değişken ruh hali", "başkalarının duygularına merak"],
  cancer: ["derin güvenlik ihtiyacı", "aileye güçlü bağ", "sevdiklerini koruma"],
  leo: ["takdir ve sıcaklık ihtiyacı", "sevgiyle cömert", "duygusal hayatta gurur"],
  virgo: ["faydalı olma ihtiyacı", "duyguları analiz etme", "hizmetle ilgi gösterme"],
  libra: ["ortaklık ve denge ihtiyacı", "çatışmadan kaçınma", "estetik duygusal ihtiyaçlar"],
  scorpio: ["yoğun duygusal derinlik", "güven ve dönüşüm ihtiyacı", "kırılganlığı gizleme"],
  sagittarius: ["anlam ve özgürlük ihtiyacı", "iyimser bakış", "duygulara felsefi yaklaşım"],
  capricorn: ["başarı ve saygı ihtiyacı", "duygularda temkinli", "güvenilir duygusal destek"],
  aquarius: ["dostluk ve ideal ihtiyacı", "mesafeli ama ilgili", "alışılmadık duygusal tarz"],
  pisces: ["aşkınlık ve bağ ihtiyacı", "empatik", "sınırlar akıcı olabilir"],
};

const RISING_TRAITS: Record<ZodiacSignId, string[]> = {
  aries: ["cesur ve hareketli görünür", "ilk izlenim enerjiktir"],
  taurus: ["sakin ve olgun görünür", "ilk izlenim güven vericidir"],
  gemini: ["tetikte ve iletişime açık görünür", "ilk izlenim hızlı ve meraklıdır"],
  cancer: ["yumuşak ve ulaşılabilir görünür", "ilk izlenim koruyucudur"],
  leo: ["özgüvenli ve sıcak görünür", "ilk izlenim çarpıcıdır"],
  virgo: ["düzenli ve yetkin görünür", "ilk izlenim mütevazı ve yardımseverdir"],
  libra: ["hoş ve dengeli görünür", "ilk izlenim çekicidir"],
  scorpio: ["yoğun ve manyetik görünür", "ilk izlenim akılda kalıcıdır"],
  sagittarius: ["açık ve neşeli görünür", "ilk izlenim geniş kapsamlıdır"],
  capricorn: ["ciddi ve becerikli görünür", "ilk izlenim sorumludur"],
  aquarius: ["benzersiz ve samimi görünür", "ilk izlenim alışılmadıktır"],
  pisces: ["nazik ve hayalperest görünür", "ilk izlenim yumuşak ve sanatsaldır"],
};

const ASPECT_MEANINGS: Record<string, string> = {
  conjunction: "Haritanızdaki kavuşumlar enerjileri birleştirir ve o alanlarda odak artar.",
  opposition: "Karşıt açılar iki güdü arasında gerilim yaratır; dengeyle büyümeye götürebilir.",
  trine: "Trine açıları ilgili gezegenler arasında doğal akış ve kolaylık gösterir.",
  square: "Kare açılar sürtünme yaratır; motivasyon ve zamanla ustalaşmayı besleyebilir.",
};

const ELEMENT_PHRASES: Record<"fire" | "earth" | "air" | "water", string> = {
  fire: "Güçlü bir ateş vurgusu genelde hırs, cesaret ve takdir görme ihtiyacı olarak kendini gösterir.",
  earth: "Toprak vurgusu sizi pratik ve maddi dünyaya bağlar.",
  air: "Hava vurgusu düşünce, iletişim ve sosyal bağları destekler.",
  water: "Su vurgusu duygu, sezgi ve empatiyi derinleştirir.",
};

const BODY_NAMES_TR: Record<string, string> = {
  sun: "Güneş",
  moon: "Ay",
  mercury: "Merkür",
  venus: "Venüs",
  mars: "Mars",
  jupiter: "Jüpiter",
  saturn: "Satürn",
  uranus: "Uranüs",
  neptune: "Neptün",
  pluto: "Plüton",
};

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(Math.floor(seed)) % arr.length];
}

function elementBalance(sun: ZodiacSignId, moon: ZodiacSignId, rising: ZodiacSignId): "fire" | "earth" | "air" | "water" {
  const counts = { fire: 0, earth: 0, air: 0, water: 0 };
  for (const sign of [sun, moon, rising]) {
    counts[ELEMENT_BY_SIGN[sign]]++;
  }
  const max = Math.max(counts.fire, counts.earth, counts.air, counts.water);
  if (counts.fire === max) return "fire";
  if (counts.earth === max) return "earth";
  if (counts.air === max) return "air";
  return "water";
}

export interface SummaryInput {
  sun: PlanetPosition;
  moon: PlanetPosition;
  rising: RisingResult;
  aspects: Aspect[];
  isApproximate?: boolean;
}

export function generateSummary(input: SummaryInput): string {
  const { sun, moon, rising, aspects, isApproximate } = input;
  const paragraphs: string[] = [];

  const sunTrait = pick(SUN_TRAITS[sun.sign], sun.degreeInSign * 10);
  const moonTrait = pick(MOON_TRAITS[moon.sign], moon.degreeInSign * 10);
  const risingTrait = pick(RISING_TRAITS[rising.sign], rising.degreeInSign * 10);
  const sunTr = SIGN_NAMES_TR[sun.sign];
  const moonTr = SIGN_NAMES_TR[moon.sign];
  const risingTr = SIGN_NAMES_TR[rising.sign];

  paragraphs.push(
    `${sunTr} burcundaki Güneş’iniz, ${sunTrait} bir çekirdek kimliğe işaret eder. Bu, hedeflerinize nasıl yöneldiğinizi ve kendinizi nasıl ifade ettiğinizi sıklıkla şekillendirir.`
  );
  paragraphs.push(
    `Ay’ınızın ${moonTr} burcunda olması, duygusal dünyanızın ${moonTrait} ile karakterize olduğunu gösterir. İç ihtiyaçlarınız ve tepkileriniz bu yerleşimle renklenir.`
  );
  paragraphs.push(
    `${risingTr} yükseleniniz, ${risingTrait} anlamına gelir. Başkaları sizi daha derin tanımadan önce genelde böyle algılar.`
  );

  if (isApproximate) {
    paragraphs.push(
      "Doğum saatiniz yaklaşık bir aralık olarak verildiği için yükselen burcunuz ve ev konumlarınız, kesin saatle hesaplanan bir haritadan farklı olabilir. Daha kesin bir yükselen için resmî kayıtlardan tam doğum saatini kullanabilirsiniz."
    );
  }

  const dominantElement = elementBalance(sun.sign, moon.sign, rising.sign);
  paragraphs.push(ELEMENT_PHRASES[dominantElement]);

  const strongestAspect = aspects.length > 0
    ? aspects.reduce((a, b) => (a.orb <= b.orb ? a : b))
    : null;
  if (strongestAspect) {
    const meaning = ASPECT_MEANINGS[strongestAspect.type] ?? "";
    const b1 = BODY_NAMES_TR[strongestAspect.body1] ?? strongestAspect.body1;
    const b2 = BODY_NAMES_TR[strongestAspect.body2] ?? strongestAspect.body2;
    paragraphs.push(
      `Haritanızda ${b1} ile ${b2} arasındaki belirgin bir açı (orb ${strongestAspect.orb.toFixed(1)}°) öne çıkıyor. ${meaning}`
    );
  }

  paragraphs.push(
    "Bu yorum, yerleşimlerinizden üretilen kural tabanlı bir sentezdir ve yalnızca düşünmek içindir. Bireysel deneyim her zaman farklılık gösterir."
  );

  return paragraphs.join("\n\n");
}
