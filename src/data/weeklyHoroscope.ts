import type { ZodiacSign } from "./zodiac";

export type WeekCategory = "health" | "love" | "money" | "work";

export interface WeeklySignContent {
  health: number;
  love: number;
  money: number;
  work: number;
  summary: string;
  advice: string;
}

/** Haftanın pazartesi tarihi (her hafta güncellenecek içerik için benzersiz anahtar) */
export function getWeekKey(date: Date = new Date()): string {
  const { start } = getWeekRange(date);
  return `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;
}

/** Bu haftanın başlangıç ve bitiş tarihleri */
export function getWeekRange(date: Date = new Date()): { start: Date; end: Date } {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(d);
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

/** Haftalık burç içeriği – her burç için 1–5 yıldız ve "olabilir" tarzı metin. Haftalık güncelleme için bu nesneyi değiştirebilirsiniz. */
export const WEEKLY_CONTENT: Record<ZodiacSign, WeeklySignContent> = {
  aries: {
    health: 4,
    love: 4,
    money: 3,
    work: 5,
    summary:
      "Bu hafta enerji ve odak iş hayatında öne çıkabilir. Sosyal ilişkilerde yeni açılımlar olabilir; iletişime açık olmak faydalı olabilir.",
    advice:
      "Hızlı karar vermek yerine önemli konularda birkaç gün düşünmek dengenize katkı sağlayabilir.",
  },
  taurus: {
    health: 4,
    love: 5,
    money: 4,
    work: 3,
    summary:
      "Bu hafta duygusal bağlar ve güven ön planda olabilir. Finansal konularda istikrar sürdürülebilir; işte tempo biraz yavaşlayabilir.",
    advice:
      "Kendinize ayırdığınız küçük molalar hem bedensel hem zihinsel yenilenmeye yardımcı olabilir.",
  },
  gemini: {
    health: 3,
    love: 4,
    money: 4,
    work: 4,
    summary:
      "İletişim ve fikir alışverişi bu hafta güçlü olabilir. Yeni projeler veya işbirlikleri gündeme gelebilir; sağlık için dinlenmeye dikkat edebilirsiniz.",
    advice:
      "Birden fazla konuya aynı anda yayılmak yerine birkaç ana maddeye odaklanmak verimliliği artırabilir.",
  },
  cancer: {
    health: 4,
    love: 5,
    money: 3,
    work: 4,
    summary:
      "Aile ve yakın ilişkiler bu hafta öne çıkabilir. Duygusal tatmin ve güven hissi artabilir; para harcamalarında ölçülü olmak faydalı olabilir.",
    advice:
      "İç sesinize kulak vermek ve gerektiğinde sınır koymak sizi daha rahat hissettirebilir.",
  },
  leo: {
    health: 5,
    love: 4,
    money: 4,
    work: 4,
    summary:
      "Enerji ve özgüven bu hafta yüksek seyredebilir. Yaratıcı projeler veya liderlik gerektiren işler öne çıkabilir; ilişkilerde denge korunabilir.",
    advice:
      "Başkalarının fikirlerine alan açmak hem iş hem ilişkilerde uzlaşmayı kolaylaştırabilir.",
  },
  virgo: {
    health: 4,
    love: 3,
    money: 5,
    work: 5,
    summary:
      "Detay ve planlama bu hafta iş ve finansal konularda işinize yarayabilir. İlişkilerde net iletişim önemli olabilir.",
    advice:
      "Mükemmeliyetçilik yerine “yeterince iyi” kabul etmek stresi azaltabilir.",
  },
  libra: {
    health: 4,
    love: 5,
    money: 3,
    work: 4,
    summary:
      "İlişkiler ve ortaklıklar bu hafta ön planda olabilir. Sosyal ortamlar size iyi gelebilir; harcamalarda dengeye dikkat edebilirsiniz.",
    advice:
      "Karar verirken hem mantığınızı hem de hislerinizi dikkate almak size uygun bir yol olabilir.",
  },
  scorpio: {
    health: 4,
    love: 4,
    money: 4,
    work: 4,
    summary:
      "Bu hafta derinleşme ve dönüşüm temaları gündeme gelebilir. Gizli kalan konular netleşebilir; hem iş hem özel hayatta denge korunabilir.",
    advice:
      "Güvenmediğiniz konularda acele etmemek ve zaman tanımak daha sağlıklı sonuçlara yol açabilir.",
  },
  sagittarius: {
    health: 5,
    love: 3,
    money: 4,
    work: 4,
    summary:
      "Hareket ve öğrenme isteği bu hafta artabilir. Seyahat veya yeni bilgiler gündeme gelebilir; ilişkilerde sabır faydalı olabilir.",
    advice:
      "Söz verirken gerçekten yapabileceğiniz şeylere sınır koymak güveni korur.",
  },
  capricorn: {
    health: 3,
    love: 4,
    money: 5,
    work: 5,
    summary:
      "Kariyer ve sorumluluklar bu hafta ağırlık kazanabilir. Uzun vadeli planlar netleşebilir; sağlık ve dinlenmeye de zaman ayırmak iyi olabilir.",
    advice:
      "Küçük molalar ve kendinize ayırdığınız anlar verimliliği düşürmez; tam aksine destekleyebilir.",
  },
  aquarius: {
    health: 4,
    love: 4,
    money: 3,
    work: 4,
    summary:
      "Sosyal çevre ve grup projeleri bu hafta öne çıkabilir. Yenilikçi fikirler hayata geçirilebilir; maddi konularda planlı olmak faydalı olabilir.",
    advice:
      "Farklı bakış açılarına açık olmak hem iş hem ilişkilerde yeni kapılar açabilir.",
  },
  pisces: {
    health: 4,
    love: 5,
    money: 3,
    work: 3,
    summary:
      "Sezgi ve hayal gücü bu hafta güçlü olabilir. İlişkilerde derinlik ve anlayış artabilir; işte hayal ile gerçeği dengelemek önemli olabilir.",
    advice:
      "Pratik adımları atlamadan, yaratıcı fikirlerinizi adım adım hayata geçirmek sizi rahatlatabilir.",
  },
};
