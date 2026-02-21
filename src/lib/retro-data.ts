export type RetroPlanet = "mercury" | "venus" | "mars" | "saturn";

export interface RetroEvent {
  id: string;
  planet: RetroPlanet;
  startDate: string; // ISO date (YYYY-MM-DD)
  endDate: string; // ISO date (YYYY-MM-DD)
  shadowStart?: string;
  shadowEnd?: string;
  themes: string[];
  doList: string[];
  avoidList: string[];
  psychologicalFocus: string;
}

export const retroEvents: RetroEvent[] = [
  {
    id: "mercury-2026-spring",
    planet: "mercury",
    startDate: "2026-03-18",
    endDate: "2026-04-08",
    shadowStart: "2026-03-05",
    shadowEnd: "2026-04-20",
    themes: [
      "iletişim ve ifade tarzını gözden geçirme",
      "dijital altyapı, veri ve dosya düzenini iyileştirme",
      "geçmişte yarım kalan konuşmaları yeniden ele alma",
      "bilişsel yükü azaltma ve odak yönetimi",
    ],
    doList: [
      "Önemli mailleri ve mesajları göndermeden önce ikinci kez kontrol et.",
      "Takvimini, hatırlatıcılarını ve görev yöneticini sadeleştir.",
      "İletişimde olduğun kişilerle netlik sağlamak için açık sorular sor.",
      "Yarım kalan eğitimleri, kursları veya okumaları tamamlamak için zaman ayır.",
      "Cihazlarının yedeklerini al ve önemli belgeleri bulutta güvenceye al.",
    ],
    avoidList: [
      "Aceleden doğan imla hatalarını ve yanlış anlaşılmalara açık mesajları.",
      "Tek seferde, konuşulmadan dayatılan büyük kararları.",
      "Sadece anlık duygu dalgalanmasıyla yazılan uzun mesajları.",
      "Sözleşmeleri detay okumadan, “sonra bakarım” diyerek imzalamayı.",
    ],
    psychologicalFocus:
      "Merkür retrosu, zihinsel hızını düşürüp, düşünce süreçlerini daha bilinçli hale getirmek için bir davet. Bu dönem; bilişsel farkındalık, iletişim kalitesi ve dikkat yönetimi üzerinde çalışmak için güçlü bir fırsattır.",
  },
  {
    id: "venus-2026-summer",
    planet: "venus",
    startDate: "2026-07-02",
    endDate: "2026-07-26",
    shadowStart: "2026-06-20",
    shadowEnd: "2026-08-08",
    themes: [
      "ilişki dinamiklerini gözden geçirme",
      "öz-değer algısı ve sınırlar",
      "harcama alışkanlıklarını dengeleme",
    ],
    doList: [
      "İlişkilerde beklentilerini yazıya dök ve netleştir.",
      "Harcamalarını kategorilere ayır ve farkındalık kazan.",
      "Aynı döngülerin tekrar ettiği ilişkileri sakin bir gözle yeniden değerlendir.",
    ],
    avoidList: [
      "Salt yalnızlık korkusuyla ilişki başlatmak.",
      "Kısa süreli duygusal yükselişle büyük estetik kararlar almak.",
    ],
    psychologicalFocus:
      "Venüs retrosu, öz-değer algını ve ilişkideki ihtiyaçlarını yeniden tanımlamak için yumuşak ama derin bir içe dönüş sürecidir.",
  },
  {
    id: "mars-2026-autumn",
    planet: "mars",
    startDate: "2026-10-10",
    endDate: "2026-11-25",
    shadowStart: "2026-09-25",
    shadowEnd: "2026-12-10",
    themes: [
      "enerji yönetimi ve öfke regülasyonu",
      "motivasyon kaynaklarını gözden geçirme",
      "fiziksel bedenle ilişkiyi iyileştirme",
    ],
    doList: [
      "Günlük kısa hareket/egzersiz rutini oluştur.",
      "Öfkelendiğinde mola verip beden duyumlarına odaklan.",
      "Ertelediğin projeler için küçük ama somut adımlar planla.",
    ],
    avoidList: [
      "Refleksif tepkiler ve düşünmeden geri dönüşü zor adımlar atmak.",
      "Tükenmişken kendini zorlama pahasına performansı artırmaya çalışmak.",
    ],
    psychologicalFocus:
      "Mars retrosu, enerjini nereye ve nasıl harcadığını yeniden kalibre etmen için bir reset zamanı gibidir.",
  },
  {
    id: "saturn-2026",
    planet: "saturn",
    startDate: "2026-06-15",
    endDate: "2026-11-02",
    themes: [
      "sorumluluklar, sınırlar ve uzun vadeli yapılandırmalar",
      "kişisel otorite ve olgunlaşma süreçleri",
      "sürdürülebilir disiplin kurma",
    ],
    doList: [
      "Uzun vadeli hedeflerini 3 ana başlıkta toparla.",
      "Rutinlerini gerçekçi ve sürdürülebilir şekilde sadeleştir.",
      "Seni zorlayan sorumlulukların ardındaki öğrenme alanını not al.",
    ],
    avoidList: [
      "Kendini sadece performans ve üretkenlik üzerinden tanımlamak.",
      "Süreç odaklı değil, sadece sonuç odaklı olmak.",
    ],
    psychologicalFocus:
      "Satürn retrosu, hayatındaki yapıların sana gerçekten hizmet edip etmediğini test eden bir bilinçlenme dönemidir; krizden çok, uzun vadeli olgunlaşma süreci olarak görülebilir.",
  },
];

export function getUpcomingRetros(referenceDate: Date = new Date()): RetroEvent[] {
  return retroEvents
    .filter((event) => new Date(event.endDate) >= referenceDate)
    .sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
}

export function getActiveRetro(referenceDate: Date = new Date()): RetroEvent | null {
  return (
    retroEvents.find((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      return referenceDate >= start && referenceDate <= end;
    }) ?? null
  );
}

export function getRetroByPlanet(planet: RetroPlanet): RetroEvent[] {
  return retroEvents
    .filter((event) => event.planet === planet)
    .sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
}

