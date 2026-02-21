import type { ZodiacSign } from "./zodiac";

/** Günlük burç metinleri – "olabilir" tarzında, falcılık yok. İçerik günlük güncellenebilir. */
export const DAILY_TEXTS: Record<ZodiacSign, string> = {
  aries:
    "Bugün hareket ve iletişim ön planda olabilir. Önemli kararları aceleye getirmemek sizin için faydalı olabilir.",
  taurus:
    "Bugün duygusal konularda sakin kalmak ve dinlemek ilişkilere iyi gelebilir. Küçük bir öz bakım molası enerjinizi toplayabilir.",
  gemini:
    "Bugün fikir alışverişi ve kısa toplantılar verimli olabilir. Tek bir konuya odaklanmak dağınıklığı azaltabilir.",
  cancer:
    "Bugün ev ve yakın çevrenizle ilgilenmek sizi rahatlatabilir. Duygusal konularda kendinize zaman tanımak iyi gelebilir.",
  leo:
    "Bugün yaratıcı veya liderlik gerektiren işler öne çıkabilir. Başkalarının fikirlerine alan açmak işbirliğini güçlendirebilir.",
  virgo:
    "Bugün detaylara dikkat etmek iş ve planlama konularında faydalı olabilir. Mükemmeliyetçilik yerine ilerlemek sizi rahatlatabilir.",
  libra:
    "Bugün ilişkiler ve ortak kararlar gündeme gelebilir. Denge kurmak ve net iletişim önemli olabilir.",
  scorpio:
    "Bugün derinlemesine düşünmek veya gizli kalan bir konuyu netleştirmek gündeme gelebilir. Acele etmemek daha sağlıklı sonuç verebilir.",
  sagittarius:
    "Bugün öğrenme veya hareket isteği artabilir. Söz verirken gerçekten yapabileceğiniz şeylere sınır koymak güveni korur.",
  capricorn:
    "Bugün sorumluluklar ve uzun vadeli planlar öne çıkabilir. Kısa molalar verimliliği düşürmez; tam aksine destekleyebilir.",
  aquarius:
    "Bugün sosyal çevre veya grup projeleri size iyi gelebilir. Farklı bakış açılarına açık olmak yeni fırsatlar getirebilir.",
  pisces:
    "Bugün sezgi ve hayal gücü güçlü olabilir. Pratik bir adım atarak yaratıcı fikrinizi somutlaştırmak sizi tatmin edebilir.",
};
