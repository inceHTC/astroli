/* ================= TYPES ================= */

/** Her seçenek: scores kullanılıyorsa max 2 puan (tek profile 2 veya 1+1). Eski testler weight kullanabilir. */
export interface OptionScores {
  fire: number;
  earth: number;
  air: number;
  water: number;
}

export interface TestOption {
  id: string;
  text: string;
  /** Yeni sistem: her seçenek max 2 puan (2 tek profile veya 1+1 iki profile). */
  scores?: OptionScores;
  /** Eski sistem; scores yoksa kullanılır. */
  weight?: Record<string, number>;
}

export interface TestQuestion {
  id: string;
  text: string;
  options: TestOption[];
}

/** Profil metni: 5 bölüm, "sen böylesin" / kader dili kullanılmaz. */
export interface ResultProfileText {
  behaviorTendency: string;
  stressResponse: string;
  strength: string;
  riskArea: string;
  developmentSuggestion: string;
}

export interface TestResult {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  strengths: string[];
  shadowSide: string;
  elementBreakdown: Record<string, number>;
  /** Yarı-profesyonel: 5 parça metin (varsa öncelikli). */
  profileText?: ResultProfileText;
}

export interface PersonalityTest {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  questionCount: number;
  category: "love" | "career" | "psychology" | "spiritual" | "personality";
  image: string;
  questions: TestQuestion[];
  resultTemplates: TestResult[];
}

/* ================= ORTAK ELEMENT SONUÇ ŞABLONLARI ================= */

/** Mevcut açıklama/güçlü yan/gölge metninden 5 parça profil metni üretir (deterministik olmayan dil). */
function profileTextFrom(
  description: string,
  strengths: string[],
  shadowSide: string
): ResultProfileText {
  const tendency = description.slice(0, 220) + (description.length > 220 ? "…" : "");
  const strengthText = strengths.slice(0, 3).join(", ");
  return {
    behaviorTendency: tendency,
    stressResponse: "Stres altında bu eğilimler daha belirgin hale gelebilir; tepki tarzı bağlama göre değişebilir.",
    strength: strengthText + " güçlü yanlar arasında sayılabilir.",
    riskArea: shadowSide,
    developmentSuggestion: "Bu alanda küçük adımlarla dengeyi artırmak ve farkındalık geliştirmek faydalı olabilir.",
  };
}

function elementResult(
  id: string,
  title: string,
  subtitle: string,
  description: string,
  strengths: string[],
  shadowSide: string,
  profileText?: ResultProfileText
): TestResult {
  const breakdown: Record<string, number> = { fire: 25, earth: 25, air: 25, water: 25 };
  breakdown[id] = 70;
  const others = (["fire", "earth", "air", "water"] as const).filter((e) => e !== id);
  others.forEach((e) => (breakdown[e] = 10));
  const result: TestResult = { id, title, subtitle, description, strengths, shadowSide, elementBreakdown: breakdown };
  if (profileText) result.profileText = profileText;
  return result;
}

/* ================= TEST 1: HANGİ ELEMENT SENSİN? (5 parça metin, deterministik olmayan dil) ================= */

const ELEMENT_RESULTS: TestResult[] = [
  elementResult(
    "fire",
    "Ateş Elementi",
    "Tutkulu & Enerjik",
    "Hareket ve cesaret bu profilde sıklıkla öne çıkar. Zorluklar motive edici olabilir; hedefe odaklı bir eğilim görülebilir.",
    ["Cesaret", "Liderlik", "Enerji", "Tutku", "Kararlılık"],
    "Sabırsızlık veya ani tepkiler; dinlemek yerine harekete geçme eğilimi.",
    {
      behaviorTendency: "Hareket ve cesaret bu profilde sıklıkla öne çıkar. Risk alma ve liderlik eğilimi görülebilir.",
      stressResponse: "Stres altında daha çok harekete geçme ve sorunu doğrudan çözmeye yönelme eğilimi gözlenebilir.",
      strength: "Cesaret, enerji ve kararlılık güçlü yanlar arasında sayılabilir.",
      riskArea: "Sabırsızlık veya başkalarının hızına tahammülsüzlük gelişim alanı olarak ele alınabilir.",
      developmentSuggestion: "Ara ara duraklayıp dinlemek ve farklı tempolara alan açmak dengeyi artırabilir.",
    }
  ),
  elementResult(
    "earth",
    "Toprak Elementi",
    "Güvenilir & Sabırlı",
    "Gerçekçi ve sağlam adımlar bu profilde sıklıkla görülür. Güvenlik ve istikrar önemli olabilir; planlama ve sözüne sadakat öne çıkabilir.",
    ["Sabır", "Planlama", "İstikrar", "Sorumluluk", "Güvenilirlik"],
    "Değişime direnç veya aşırı kontrol ihtiyacı; esnek olamama riski.",
    {
      behaviorTendency: "Gerçekçi ve adım adım ilerleme bu profilde sıklıkla gözlenir. Güvenlik ve istikrar önemli olabilir.",
      stressResponse: "Stres altında plan yapma ve düzeni koruma eğilimi görülebilir.",
      strength: "Sabır, planlama ve güvenilirlik güçlü yanlar arasında sayılabilir.",
      riskArea: "Değişime kapalılık veya duygusal ifadenin ertelenmesi gelişim alanı olabilir.",
      developmentSuggestion: "Küçük değişimlere alan açmak ve duyguları ifade etmek dengeyi destekleyebilir.",
    }
  ),
  elementResult(
    "air",
    "Hava Elementi",
    "Özgür & Zeki",
    "Fikir üretme ve iletişim bu profilde sıklıkla öne çıkar. Rutin sıkıcı gelebilir; öğrenme ve paylaşım besleyici olabilir.",
    ["İletişim", "Zeka", "Merak", "Özgürlük", "Uyum sağlama"],
    "Yüzeysellik veya duyguları erteleyebilme; 'kafada' yaşayıp kalbi unutma riski.",
    {
      behaviorTendency: "Fikirler ve iletişim bu profilde sıklıkla merkezdedir. Özgürlük ve merak öne çıkabilir.",
      stressResponse: "Stres altında sohbet etme veya konuyu analiz etme eğilimi görülebilir.",
      strength: "Zeka, iletişim ve uyum sağlama güçlü yanlar arasında sayılabilir.",
      riskArea: "Kararsızlık veya duyguları erteleyebilme gelişim alanı olarak ele alınabilir.",
      developmentSuggestion: "Duygusal anlara bilinçli yer açmak ve karar anlarında bedeni dinlemek faydalı olabilir.",
    }
  ),
  elementResult(
    "water",
    "Su Elementi",
    "Sezgisel & Derin",
    "Duygusal derinlik ve empati bu profilde sıklıkla görülür. İlişkilerde bağ ve anlam önemli olabilir; sanat ve semboller anlamlı gelebilir.",
    ["Empati", "Sezgi", "Yaratıcılık", "Bağlılık", "Derinlik"],
    "Aşırı hassasiyet veya sınır koymakta zorlanma; geçmişe takılma riski.",
    {
      behaviorTendency: "Empati ve sezgi bu profilde sıklıkla öne çıkar. Derin bağlar ve anlam arayışı görülebilir.",
      stressResponse: "Stres altında içe dönme veya duyguları işleme eğilimi gözlenebilir.",
      strength: "Empati, yaratıcılık ve bağlılık güçlü yanlar arasında sayılabilir.",
      riskArea: "Sınır koyamama veya duygusal yükün ağır gelmesi gelişim alanı olabilir.",
      developmentSuggestion: "Sınırları netleştirmek ve duygusal yükü paylaşmak dengeyi artırabilir.",
    }
  ),
];

/* ================= TEST 1: ELEMENT KEŞFİ (10 soru, scores, 3 ters kodlu: q3, q6, q9) ================= */

const el = (f: number, e: number, a: number, w: number): OptionScores => ({ fire: f, earth: e, air: a, water: w });

export const ELEMENT_DISCOVERY_TEST: PersonalityTest = {
  id: "element-discovery",
  slug: "kisilik-element",
  title: "Hangi Element Sensin?",
  description: "Astrolojide dört element (Ateş, Toprak, Hava, Su) kişiliğin temelini oluşturur. Bu testte baskın element enerjini keşfet.",
  duration: "5–6 dk",
  questionCount: 10,
  image: "/tests/personality.png",
  category: "personality",
  questions: [
    { id: "q1", text: "Stresli bir günde ilk tepkin ne olur?", options: [
      { id: "a", text: "Hemen harekete geçer, bir şeyler yaparım", scores: el(2, 0, 0, 0) },
      { id: "b", text: "Plan yapar, adım adım çözerim", scores: el(0, 2, 0, 0) },
      { id: "c", text: "Birine anlatır veya yazarım", scores: el(0, 0, 2, 0) },
      { id: "d", text: "Yalnız kalıp içime dönerim", scores: el(0, 0, 0, 2) },
    ]},
    { id: "q2", text: "En güçlü hissettiğin yönün hangisi?", options: [
      { id: "a", text: "Cesaret ve risk alma", scores: el(2, 0, 0, 0) },
      { id: "b", text: "Sabır ve dayanıklılık", scores: el(0, 2, 0, 0) },
      { id: "c", text: "Zeka ve iletişim", scores: el(0, 0, 2, 0) },
      { id: "d", text: "Empati ve sezgi", scores: el(0, 0, 0, 2) },
    ]},
    /* Ters kodlu: A→water, B→air, C→earth, D→fire (cevap tahminini zorlaştırır) */
    { id: "q3", text: "Hayatta seni en çok motive eden nedir?", options: [
      { id: "a", text: "Heyecan ve yeni hedefler", scores: el(0, 0, 0, 2) },
      { id: "b", text: "Güvenlik ve istikrar", scores: el(0, 0, 2, 0) },
      { id: "c", text: "Özgürlük ve keşif", scores: el(0, 2, 0, 0) },
      { id: "d", text: "Sevgi ve anlamlı bağlar", scores: el(2, 0, 0, 0) },
    ]},
    { id: "q4", text: "Tatilde nasıl bir ortam seçersin?", options: [
      { id: "a", text: "Aksiyon, spor veya macera", scores: el(2, 0, 0, 0) },
      { id: "b", text: "Sakin, düzenli ve konforlu", scores: el(0, 2, 0, 0) },
      { id: "c", text: "Yeni yerler, kültürler, insanlar", scores: el(0, 0, 2, 0) },
      { id: "d", text: "Doğa, deniz veya sessiz bir köşe", scores: el(0, 0, 0, 2) },
    ]},
    { id: "q5", text: "Anlaşmazlıkta genelde nasıl davranırsın?", options: [
      { id: "a", text: "Direkt konuşur, sonucu hemen isterim", scores: el(2, 0, 0, 0) },
      { id: "b", text: "Mantıklı kanıtlar sunarım", scores: el(0, 2, 0, 0) },
      { id: "c", text: "Tartışır, farklı açıları dinlerim", scores: el(0, 0, 2, 0) },
      { id: "d", text: "Önce karşımdakinin hissini anlamaya çalışırım", scores: el(0, 0, 0, 2) },
    ]},
    /* Ters kodlu */
    { id: "q6", text: "İş/okul projesinde rolün genelde ne olur?", options: [
      { id: "a", text: "Fikri ben sunar, yönlendiririm", scores: el(0, 0, 0, 2) },
      { id: "b", text: "Planı yapar, takvime uyulmasını sağlarım", scores: el(0, 0, 2, 0) },
      { id: "c", text: "Araştırır, sunar, iletişimi yönetirim", scores: el(0, 2, 0, 0) },
      { id: "d", text: "Takım uyumunu ve moralini önemserim", scores: el(2, 0, 0, 0) },
    ]},
    { id: "q7", text: "Karar verirken en çok neye güvenirsin?", options: [
      { id: "a", text: "İçgüdü ve cesaret", scores: el(2, 0, 0, 0) },
      { id: "b", text: "Veri ve geçmiş deneyim", scores: el(0, 2, 0, 0) },
      { id: "c", text: "Mantık ve olası senaryolar", scores: el(0, 0, 2, 0) },
      { id: "d", text: "Hislerim ve değerlerim", scores: el(0, 0, 0, 2) },
    ]},
    { id: "q8", text: "Arkadaşların seni nasıl tanımlar?", options: [
      { id: "a", text: "Enerjik, cesur, motive edici", scores: el(2, 0, 0, 0) },
      { id: "b", text: "Güvenilir, istikrarlı, mantıklı", scores: el(0, 2, 0, 0) },
      { id: "c", text: "Zeki, eğlenceli, meraklı", scores: el(0, 0, 2, 0) },
      { id: "d", text: "Anlayışlı, sıcak, derin", scores: el(0, 0, 0, 2) },
    ]},
    /* Ters kodlu */
    { id: "q9", text: "Boş zamanında en çok ne yapmayı seversin?", options: [
      { id: "a", text: "Spor, yarışma veya fiziksel aktivite", scores: el(0, 0, 0, 2) },
      { id: "b", text: "El işi, bahçe, düzen kurma", scores: el(0, 0, 2, 0) },
      { id: "c", text: "Okumak, öğrenmek, sohbet", scores: el(0, 2, 0, 0) },
      { id: "d", text: "Müzik, film, hayal kurma", scores: el(2, 0, 0, 0) },
    ]},
    { id: "q10", text: "Seni en iyi anlatan cümle hangisi?", options: [
      { id: "a", text: "Harekete geçmeden rahat edemem", scores: el(2, 0, 0, 0) },
      { id: "b", text: "Sağlam adımlar atarım", scores: el(0, 2, 0, 0) },
      { id: "c", text: "Fikirler beni canlı tutar", scores: el(0, 0, 2, 0) },
      { id: "d", text: "Duygularıma güvenirim", scores: el(0, 0, 0, 2) },
    ]},
  ],
  resultTemplates: ELEMENT_RESULTS,
};

/* ================= TEST 2: AŞK TARZI (10 soru) ================= */

const LOVE_RESULTS: TestResult[] = [
  elementResult("fire", "Tutkulu Aşık", "Ateşin Aşkı", "İlişkide tutku ve heyecan bu profilde sıklıkla vazgeçilmez. Cesur ve doğrudan eğilim; romantik jestler ve macera ilişkiyi canlı tutabilir.", ["Tutku", "Cesaret", "Sadakat (seçtiğinde)", "Enerji", "Doğrudanlık"], "Sabırsızlık ve kıskançlık; ilişki soğuduğunda hemen kopma eğilimi.", profileTextFrom("İlişkide tutku ve heyecan ön planda. Cesur ve doğrudan eğilim; partnerin enerjik olursa uyum artabilir.", ["Tutku", "Cesaret", "Enerji"], "Sabırsızlık ve kıskançlık; ilişki soğuduğunda kopma eğilimi.")),
  elementResult("earth", "Güvenli Bağ", "Toprağın Aşkı", "İlişkide güvenlik ve sadakat ön planda. Planlı ve uzun vadeli düşünme; ev, aile ve ortak hedefler mutluluk kaynağı olabilir.", ["Sadakat", "Güvenilirlik", "İstikrar", "Sorumluluk", "Derin bağ"], "Değişime kapalılık ve duygusal ifade zorluğu; bazen soğuk görünebilir.", profileTextFrom("Güvenlik ve sadakat ön planda. Sözünün eri ve planlı eğilim.", ["Sadakat", "Güvenilirlik", "İstikrar"], "Değişime kapalılık ve duygusal ifade zorluğu.")),
  elementResult("air", "Zihinsel Uyum", "Havanın Aşkı", "İlişkide zihinsel uyum ve özgürlük önemli. Sohbet ve ortak ilgi alanları çekici; arkadaşlık temelli aşk bu profilde sıklıkla görülür.", ["İletişim", "Espri", "Özgürlük", "Merak", "Denge"], "Bağlanma korkusu ve duygusal mesafe; 'soğuk' algılanabilir.", profileTextFrom("Zihinsel uyum ve özgürlük önemli. Boğucu ilişkilerden kaçınma eğilimi.", ["İletişim", "Özgürlük", "Merak"], "Bağlanma korkusu ve duygusal mesafe.")),
  elementResult("water", "Duygusal Derinlik", "Suyun Aşkı", "İlişkide duygusal derinlik ve bağ merkezde. Empati ve sezgi; güven ve samimiyet olmadan rahat edememe eğilimi görülebilir.", ["Empati", "Bağlılık", "Romantizm", "Sezgi", "Sadakat"], "Aşırı bağlanma ve kırılganlık; terk edilme korkusu yorabilir.", profileTextFrom("Duygusal derinlik ve bağ merkezde. Romantik ve sadık eğilim.", ["Empati", "Bağlılık", "Sezgi"], "Aşırı bağlanma ve kırılganlık.")),
];

export const LOVE_STYLE_TEST: PersonalityTest = {
  id: "love-style",
  slug: "ask-tarzi",
  title: "Aşk ve İlişki Tarzın",
  description: "İlişkilerde nasıl seviyorsun, ne bekliyorsun? Bu test aşk dilini ve ilişki enerjini ortaya çıkarır.",
  duration: "5–6 dk",
  questionCount: 10,
  category: "love",
  image: "/tests/love.png",
  questions: [
    { id: "q1", text: "İlişkide senin için en önemli şey nedir?", options: [{ id: "a", text: "Tutku ve heyecan", scores: el(2,0,0,0) }, { id: "b", text: "Güven ve sadakat", scores: el(0,2,0,0) }, { id: "c", text: "Zihinsel uyum ve sohbet", scores: el(0,0,2,0) }, { id: "d", text: "Duygusal bağ ve anlaşılma", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Partnerin seni nasıl görmeli?", options: [{ id: "a", text: "Güçlü ve cesur", scores: el(2,0,0,0) }, { id: "b", text: "Güvenilir ve istikrarlı", scores: el(0,2,0,0) }, { id: "c", text: "Eğlenceli ve zeki", scores: el(0,0,2,0) }, { id: "d", text: "Şefkatli ve derin", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Kavga sonrası nasıl barışırsın?", options: [{ id: "a", text: "Direkt konuşup çözerim", scores: el(0,0,0,2) }, { id: "b", text: "Mantıklı açıklama yaparım", scores: el(0,0,2,0) }, { id: "c", text: "Mizah veya sohbetle yumuşatırım", scores: el(0,2,0,0) }, { id: "d", text: "Özür diler, duyguları konuşurum", scores: el(2,0,0,0) }] },
    { id: "q4", text: "İdeal randevu nasıl olur?", options: [{ id: "a", text: "Aksiyon, spor veya macera", scores: el(2,0,0,0) }, { id: "b", text: "Yemek, ev, planlı aktivite", scores: el(0,2,0,0) }, { id: "c", text: "Sergi, sohbet, yeni mekan", scores: el(0,0,2,0) }, { id: "d", text: "Romantik akşam, deniz veya doğa", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Sevgiyi nasıl ifade edersin?", options: [{ id: "a", text: "Hareketlerle, sürprizlerle", scores: el(2,0,0,0) }, { id: "b", text: "Sorumluluk alarak, güven vererek", scores: el(0,2,0,0) }, { id: "c", text: "Sohbet ve ilgiyle", scores: el(0,0,2,0) }, { id: "d", text: "Dokunuş, söz ve duygusal anlar", scores: el(0,0,0,2) }] },
    { id: "q6", text: "İlişkide en çok ne seni yorar?", options: [{ id: "a", text: "Rutin ve sıkıcılık", scores: el(0,0,0,2) }, { id: "b", text: "Güvensizlik ve plansızlık", scores: el(0,0,2,0) }, { id: "c", text: "Boğucu ve kısıtlayıcı davranış", scores: el(0,2,0,0) }, { id: "d", text: "Duygusal soğukluk ve mesafe", scores: el(2,0,0,0) }] },
    { id: "q7", text: "Aşkta risk alır mısın?", options: [{ id: "a", text: "Evet, cesurca giderim", scores: el(2,0,0,0) }, { id: "b", text: "Ölçülü, emin olduktan sonra", scores: el(0,2,0,0) }, { id: "c", text: "Mantıklı risk alırım", scores: el(0,0,2,0) }, { id: "d", text: "Kalbim giderse peşinden giderim", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Partnerinden en çok ne bekliyorsun?", options: [{ id: "a", text: "Enerji ve heyecan", scores: el(2,0,0,0) }, { id: "b", text: "Sadakat ve güvenilirlik", scores: el(0,2,0,0) }, { id: "c", text: "Zeka ve özgürlük", scores: el(0,0,2,0) }, { id: "d", text: "Anlayış ve duygusal derinlik", scores: el(0,0,0,2) }] },
    { id: "q9", text: "Ayrılık sonrası nasıl toparlanırsın?", options: [{ id: "a", text: "Yeni hedefler, hareket", scores: el(0,0,0,2) }, { id: "b", text: "Rutin, iş, düzen", scores: el(0,0,2,0) }, { id: "c", text: "Arkadaşlar, sohbet, gezi", scores: el(0,2,0,0) }, { id: "d", text: "Zaman, yalnızlık, sanat/müzik", scores: el(2,0,0,0) }] },
    { id: "q10", text: "Uzun ilişkide seni mutlu eden nedir?", options: [{ id: "a", text: "Heyecan ve birlikte macera", scores: el(2,0,0,0) }, { id: "b", text: "Ev, aile, ortak gelecek", scores: el(0,2,0,0) }, { id: "c", text: "Arkadaşlık ve zihinsel uyum", scores: el(0,0,2,0) }, { id: "d", text: "Derin bağ ve duygusal güven", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: LOVE_RESULTS,
};

/* ================= TEST 3: İLETİŞİM VE ÇATIŞMA (10 soru) ================= */

const COMMUNICATION_RESULTS: TestResult[] = [
  elementResult("fire", "Direkt İletişimci", "Ateşin Dili", "Net ve cesur konuşma bu profilde sıklıkla öne çıkar. Hızlı karar ve aksiyon; karşındakinin doğrudan olması beklentisi görülebilir.", ["Netlik", "Cesaret", "Hız", "Liderlik", "Doğrudanlık"], "Sabırsızlık ve öfke; bazen incitici sert çıkabilir.", profileTextFrom("Net ve cesur iletişim. Çatışmadan kaçınmama eğilimi.", ["Netlik", "Cesaret", "Hız"], "Sabırsızlık ve öfke; incitici sertlik.")),
  elementResult("earth", "Mantıklı ve Yapıcı", "Toprağın Dili", "Soğukkanlı ve kanıta dayalı iletişim bu profilde sıklıkla görülür. Çatışmada adım adım çözme tercih edilebilir.", ["Güvenilirlik", "Mantık", "Sabır", "Tutarlılık", "Çözüm odaklılık"], "Esneklik azlığı ve duygusal ifade zorluğu.", profileTextFrom("Kanıta dayalı iletişim. Sözünün eri olma eğilimi.", ["Güvenilirlik", "Mantık", "Sabır"], "Esneklik azlığı ve duygusal ifade zorluğu.")),
  elementResult("air", "Diplomatik ve Esnek", "Havanın Dili", "Sohbet ve farklı bakış açıları bu profilde sıklıkla önemli. Uzlaşma ve ortak zemin arayışı görülebilir.", ["İletişim", "Esneklik", "Mizah", "Analiz", "Uzlaşma"], "Yüzeysel kalma ve duyguları erteleyebilme.", profileTextFrom("Diplomatik ve esnek iletişim. Mizah ve mantık kullanımı.", ["İletişim", "Esneklik", "Uzlaşma"], "Yüzeysel kalma ve duyguları erteleyebilme.")),
  elementResult("water", "Empatik Dinleyici", "Suyun Dili", "Önce karşındakinin hislerini anlama bu profilde sıklıkla öne çıkar. Sert çatışmalardan rahatsızlık; uyum arayışı görülebilir.", ["Empati", "Dinleme", "Sezgi", "Uyum", "Derinlik"], "Sınır koyamama ve kendi ihtiyaçlarını erteleyebilme.", profileTextFrom("Empatik dinleme. Beden dili ve sessizlik önemli olabilir.", ["Empati", "Dinleme", "Sezgi"], "Sınır koyamama ve ihtiyaçları erteleyebilme.")),
];

export const COMMUNICATION_TEST: PersonalityTest = {
  id: "communication-style",
  slug: "iletisim-catisma",
  title: "İletişim ve Çatışma Stilin",
  description: "Nasıl konuşuyorsun, tartışırken ne yapıyorsun? İletişim tarzın ve çatışma çözümün keşfedilir.",
  duration: "5–6 dk",
  questionCount: 10,
  category: "psychology",
  image: "/tests/mind.png",
  questions: [
    { id: "q1", text: "Anlaşmazlıkta ilk tepkin ne olur?", options: [{ id: "a", text: "Direkt söylerim, net olurum", scores: el(2,0,0,0) }, { id: "b", text: "Kanıtları toplar, mantıklı konuşurum", scores: el(0,2,0,0) }, { id: "c", text: "Tartışır, farklı açıları dinlerim", scores: el(0,0,2,0) }, { id: "d", text: "Önce sakinleşmeyi tercih ederim", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Eleştiri aldığında nasıl hissedersin?", options: [{ id: "a", text: "Savunmaya geçer, hemen yanıt veririm", scores: el(2,0,0,0) }, { id: "b", text: "Mantıklı mı diye değerlendiririm", scores: el(0,2,0,0) }, { id: "c", text: "Analiz eder, tartışırım", scores: el(0,0,2,0) }, { id: "d", text: "İncinirim ama belli etmemeye çalışırım", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Zor bir konuyu nasıl açarsın?", options: [{ id: "a", text: "Açıkça ve hemen söylerim", scores: el(0,0,0,2) }, { id: "b", text: "Uygun zamanı seçer, planlı konuşurum", scores: el(0,0,2,0) }, { id: "c", text: "Sohbet içinde yumuşak geçişle", scores: el(0,2,0,0) }, { id: "d", text: "Karşımdakinin ruh haline göre seçerim", scores: el(2,0,0,0) }] },
    { id: "q4", text: "Topluluk önünde konuşmak?", options: [{ id: "a", text: "Rahatım, enerji verir", scores: el(2,0,0,0) }, { id: "b", text: "Hazırlanırsam rahatım", scores: el(0,2,0,0) }, { id: "c", text: "Konu ilgimi çekiyorsa keyifli", scores: el(0,0,2,0) }, { id: "d", text: "Gergin olurum, küçük gruplar tercih", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Karşındaki çok duygusal konuşunca?", options: [{ id: "a", text: "Çözüme odaklanmak isterim", scores: el(2,0,0,0) }, { id: "b", text: "Sakinleştirip mantıklı ilerlerim", scores: el(0,2,0,0) }, { id: "c", text: "Dinler, sonra konuyu açarım", scores: el(0,0,2,0) }, { id: "d", text: "Empati kurar, hissederim", scores: el(0,0,0,2) }] },
    { id: "q6", text: "E-posta / mesajda nasılsın?", options: [{ id: "a", text: "Kısa ve net", scores: el(0,0,0,2) }, { id: "b", text: "Açık, yapılandırılmış", scores: el(0,0,2,0) }, { id: "c", text: "Sohbet tadında, esprili", scores: el(0,2,0,0) }, { id: "d", text: "Nazik, duygusal ifadeler", scores: el(2,0,0,0) }] },
    { id: "q7", text: "Yanlış anlaşıldığında?", options: [{ id: "a", text: "Hemen düzeltir, netleştiririm", scores: el(2,0,0,0) }, { id: "b", text: "Örneklerle açıklarım", scores: el(0,2,0,0) }, { id: "c", text: "Farklı açıdan anlatırım", scores: el(0,0,2,0) }, { id: "d", text: "Hislerimi anlatmaya çalışırım", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Takımda fikir ayrılığı olunca?", options: [{ id: "a", text: "Benim fikrimi savunurum", scores: el(2,0,0,0) }, { id: "b", text: "Veri ve prosedüre göre karar", scores: el(0,2,0,0) }, { id: "c", text: "Herkesi dinleyip sentez yaparım", scores: el(0,0,2,0) }, { id: "d", text: "Uyumu bozmamak için dikkatli olurum", scores: el(0,0,0,2) }] },
    { id: "q9", text: "Özür dilemek senin için?", options: [{ id: "a", text: "Gerekiyorsa söylerim, uzatmam", scores: el(0,0,0,2) }, { id: "b", text: "Hak ettiğimde samimi özür dilerim", scores: el(0,0,2,0) }, { id: "c", text: "İlişkiyi düzeltmek için gerekli", scores: el(0,2,0,0) }, { id: "d", text: "İlişki için önemli, içten yaparım", scores: el(2,0,0,0) }] },
    { id: "q10", text: "Sessizlik senin için?", options: [{ id: "a", text: "Rahatsız edici, doldurmak isterim", scores: el(2,0,0,0) }, { id: "b", text: "Düşünmek için fırsat", scores: el(0,2,0,0) }, { id: "c", text: "Bazen rahat, bazen sohbet", scores: el(0,0,2,0) }, { id: "d", text: "Rahatım, sözle ifade her şey değil", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: COMMUNICATION_RESULTS,
};

/* ================= TEST 4: KARİYER VE PARA (10 soru) ================= */

const CAREER_RESULTS: TestResult[] = [
  elementResult("fire", "Girişimci Ruh", "Ateşin Kariyeri", "Liderlik ve risk senin doğanda. Yeni projeler, satış veya kendi işin sana uygun. Hızlı karar ve aksiyon isteyen ortamlar seni besler.", ["Liderlik", "Cesaret", "Enerji", "Girişimcilik", "Motivasyon"], "Sabırsızlık ve detaylara tahammülsüzlük; yanlış risk alabilirsin."),
  elementResult("earth", "İstikrarlı Profesyonel", "Toprağın Kariyeri", "Güvenilir, planlı ve sonuç odaklısın. Finans, operasyon veya proje yönetimi sana uygun. Uzun vadeli kariyer ve güvenli gelir önemli.", ["Sorumluluk", "Planlama", "Güvenilirlik", "Disiplin", "Sonuç"], "Değişime direnç ve aşırı riskten kaçınma."),
  elementResult("air", "Fikir ve İletişim İnsanı", "Havanın Kariyeri", "Yaratıcılık, iletişim ve analiz güçlü. Pazarlama, medya, eğitim veya danışmanlık sana yakın. Esnek ve öğrenmeye açık ortamlar seni mutlu eder.", ["Yaratıcılık", "İletişim", "Analiz", "Uyum", "Öğrenme"], "Detay ve takip konusunda dağınıklık; kararsızlık."),
  elementResult("water", "İnsan Odaklı ve Yaratıcı", "Suyun Kariyeri", "İnsanlara dokunan işler senin için anlamlı. Psikoloji, sanat, sağlık veya hizmet sektörü uygun. Anlam ve duygusal tatmin önemli.", ["Empati", "Yaratıcılık", "Sezgi", "İşbirliği", "Anlam"], "Sınır koyamama ve duygusal yük; tükenebilirsin."),
];

export const CAREER_TEST: PersonalityTest = {
  id: "career-energy",
  slug: "kariyer-enerji",
  title: "Kariyer ve Para Enerjisi",
  description: "İş hayatında hangi enerji baskın? Para ve kariyerle ilişkin nasıl? Bu test kariyer tarzını ortaya çıkarır.",
  duration: "5–6 dk",
  questionCount: 10,
  category: "career",
  image: "/tests/career.png",
  questions: [
    { id: "q1", text: "İş ortamında en rahat hissettiğin rol?", options: [{ id: "a", text: "Lider, karar verici", scores: el(2,0,0,0) }, { id: "b", text: "Planlayıcı, organize eden", scores: el(0,2,0,0) }, { id: "c", text: "Fikir üreten, iletişim", scores: el(0,0,2,0) }, { id: "d", text: "Takımı destekleyen, uyum sağlayan", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Para harcarken genelde?", options: [{ id: "a", text: "Anlık keyif, cesur harcarım", scores: el(2,0,0,0) }, { id: "b", text: "Planlı, birikim yaparım", scores: el(0,2,0,0) }, { id: "c", text: "Denge ararım, bazen spontane", scores: el(0,0,2,0) }, { id: "d", text: "Değer verdiğim şeylere harcarım", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Terfi / fırsat geldiğinde?", options: [{ id: "a", text: "Hemen kapar, risk alırım", scores: el(0,0,0,2) }, { id: "b", text: "Artıları eksileri değerlendiririm", scores: el(0,0,2,0) }, { id: "c", text: "Yeni deneyim olarak görürüm", scores: el(0,2,0,0) }, { id: "d", text: "Ekip ve ortam uyumuna bakarım", scores: el(2,0,0,0) }] },
    { id: "q4", text: "En iyi çalıştığın ortam?", options: [{ id: "a", text: "Rekabetçi, hedefli", scores: el(2,0,0,0) }, { id: "b", text: "Düzenli, net kurallı", scores: el(0,2,0,0) }, { id: "c", text: "Esnek, yaratıcı", scores: el(0,0,2,0) }, { id: "d", text: "İşbirlikçi, sıcak", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Başarısızlık sonrası?", options: [{ id: "a", text: "Hemen yeni hedefe geçerim", scores: el(2,0,0,0) }, { id: "b", text: "Ders çıkarır, planı revize ederim", scores: el(0,2,0,0) }, { id: "c", text: "Analiz eder, farklı denerim", scores: el(0,0,2,0) }, { id: "d", text: "Duygusal toparlanır, tekrar denerim", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Para senin için ne ifade eder?", options: [{ id: "a", text: "Özgürlük ve fırsat", scores: el(0,0,0,2) }, { id: "b", text: "Güvenlik ve istikrar", scores: el(0,0,2,0) }, { id: "c", text: "Seçenek ve deneyim", scores: el(0,2,0,0) }, { id: "d", text: "Güven ve huzur", scores: el(2,0,0,0) }] },
    { id: "q7", text: "Takımda en çok ne yaparsın?", options: [{ id: "a", text: "Yönlendirir, motive ederim", scores: el(2,0,0,0) }, { id: "b", text: "Görevleri dağıtır, takip ederim", scores: el(0,2,0,0) }, { id: "c", text: "Fikir üretir, sunarım", scores: el(0,0,2,0) }, { id: "d", text: "Uyum sağlar, destek veririm", scores: el(0,0,0,2) }] },
    { id: "q8", text: "İş değiştirme kararı?", options: [{ id: "a", text: "Cesur atılım, yeni macera", scores: el(2,0,0,0) }, { id: "b", text: "Güvenli geçiş, net koşullar", scores: el(0,2,0,0) }, { id: "c", text: "Merak, öğrenme fırsatı", scores: el(0,0,2,0) }, { id: "d", text: "Anlam ve değer uyumu", scores: el(0,0,0,2) }] },
    { id: "q9", text: "Deadline yaklaşınca?", options: [{ id: "a", text: "Son anda enerji patlaması", scores: el(0,0,0,2) }, { id: "b", text: "Planlı, zamanında bitiririm", scores: el(0,0,2,0) }, { id: "c", text: "Odaklanır, esnek çalışırım", scores: el(0,2,0,0) }, { id: "d", text: "Streslenirim ama tamamlarım", scores: el(2,0,0,0) }] },
    { id: "q10", text: "Kariyer hedefin?", options: [{ id: "a", text: "Liderlik, görünürlük", scores: el(2,0,0,0) }, { id: "b", text: "İstikrar, güvenli gelir", scores: el(0,2,0,0) }, { id: "c", text: "Öğrenme, çeşitlilik", scores: el(0,0,2,0) }, { id: "d", text: "Anlamlı iş, denge", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: CAREER_RESULTS,
};

/* ================= TEST 5: STRES VE DUYGUSAL TEPKİ (10 soru) ================= */

const STRESS_RESULTS: TestResult[] = [
  elementResult("fire", "Aksiyonla Başa Çıkma", "Ateşin Tepkisi", "Stres seni harekete geçirir. Spor, işe gömülme veya sorunu çözmek seni rahatlatır. Uzun süre pasif kalamazsın.", ["Enerji", "Çözüm odaklılık", "Cesaret", "Hız", "Liderlik"], "Öfke patlamaları ve sabırsızlık; bazen yıkıcı çıkışlar."),
  elementResult("earth", "Düzen ve Kontrolle Başa Çıkma", "Toprağın Tepkisi", "Rutin, plan ve kontrol seni sakinleştirir. Listeler, hedefler ve adım adım ilerleme stresi azaltır. Güvenli alan önemli.", ["Düzen", "Sabır", "Kontrol", "Dayanıklılık", "Planlama"], "Esneklik azlığı; kontrol kaybında daha çok stres."),
  elementResult("air", "Sohbet ve Analizle Başa Çıkma", "Havanın Tepkisi", "Konuşmak, yazmak veya mantıksal analiz seni rahatlatır. Distans alıp konuyu farklı açıdan görmek iyi gelir.", ["Mantık", "İletişim", "Esneklik", "Mizah", "Perspektif"], "Duyguları erteleyebilme; bazen yüzeysel kalma."),
  elementResult("water", "İçe Dönerek ve Bağ Kurarak Başa Çıkma", "Suyun Tepkisi", "Yalnız zaman, doğa, sanat veya güvendiğin biriyle konuşmak seni toparlar. Duyguları hissetmek ve ifade etmek önemli.", ["Empati", "Sezgi", "İçe dönüş", "Bağ", "Yaratıcılık"], "Aşırı hassasiyet ve içe kapanma; tükenme riski."),
];

export const STRESS_TEST: PersonalityTest = {
  id: "stress-response",
  slug: "stres-tepki",
  title: "Stres ve Duygusal Tepki",
  description: "Zor anlarda nasıl davranıyorsun? Stres seni harekete mi geçiriyor, yoksa içe mi çekiyor? Tepki tarzın keşfedilir.",
  duration: "5–6 dk",
  questionCount: 10,
  category: "psychology",
  image: "/tests/mind.png",
  questions: [
    { id: "q1", text: "Stresli bir günde ilk yaptığın şey?", options: [{ id: "a", text: "Hareket ederim, spor veya yürüyüş", scores: el(2,0,0,0) }, { id: "b", text: "Liste yapar, planlarım", scores: el(0,2,0,0) }, { id: "c", text: "Birine anlatır veya yazarım", scores: el(0,0,2,0) }, { id: "d", text: "Sessiz bir yere çekilirim", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Beklenmedik kötü haber alınca?", options: [{ id: "a", text: "Hemen ne yapacağımı düşünürüm", scores: el(2,0,0,0) }, { id: "b", text: "Sakin kalıp adımlar planlarım", scores: el(0,2,0,0) }, { id: "c", text: "Analiz eder, seçenekleri tartarım", scores: el(0,0,2,0) }, { id: "d", text: "Şok olur, zaman isterim", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Uyku stresle nasıl etkilenir?", options: [{ id: "a", text: "Uyuyamıyorum, enerji patlaması", scores: el(0,0,0,2) }, { id: "b", text: "Rutin bozulunca zorlanırım", scores: el(0,0,2,0) }, { id: "c", text: "Kafam meşgul, düşünürüm", scores: el(0,2,0,0) }, { id: "d", text: "Kabusa benzer, duygusal", scores: el(2,0,0,0) }] },
    { id: "q4", text: "En çok ne stres yaratır?", options: [{ id: "a", text: "Hareketsizlik ve belirsizlik", scores: el(2,0,0,0) }, { id: "b", text: "Düzensizlik ve güvensizlik", scores: el(0,2,0,0) }, { id: "c", text: "Kısıtlanma ve sıkıcılık", scores: el(0,0,2,0) }, { id: "d", text: "Çatışma ve reddedilme", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Sakinleşmek için ne yaparsın?", options: [{ id: "a", text: "Fiziksel aktivite", scores: el(2,0,0,0) }, { id: "b", text: "Düzen, temizlik, rutin", scores: el(0,2,0,0) }, { id: "c", text: "Sohbet, kitap, podcast", scores: el(0,0,2,0) }, { id: "d", text: "Müzik, banyo, yalnız zaman", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Stres anında çevrene nasıl davranırsın?", options: [{ id: "a", text: "Sinirli veya sabırsız", scores: el(0,0,0,2) }, { id: "b", text: "Mesafeli, işe odaklı", scores: el(0,0,2,0) }, { id: "c", text: "Konuşkan veya dağınık", scores: el(0,2,0,0) }, { id: "d", text: "İçe kapanık veya ağlamaklı", scores: el(2,0,0,0) }] },
    { id: "q7", text: "Kontrolü kaybettiğinde?", options: [{ id: "a", text: "Hemen kontrolü almaya çalışırım", scores: el(2,0,0,0) }, { id: "b", text: "Küçük adımlarla toparlanırım", scores: el(0,2,0,0) }, { id: "c", text: "Perspektif değiştiririm", scores: el(0,0,2,0) }, { id: "d", text: "Duygularıma izin veririm", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Uzun süreli stres?", options: [{ id: "a", text: "Tüketir ama mücadele ederim", scores: el(2,0,0,0) }, { id: "b", text: "Sistematik çözerim", scores: el(0,2,0,0) }, { id: "c", text: "Distans alıp analiz ederim", scores: el(0,0,2,0) }, { id: "d", text: "Ağır hissederim, destek ararım", scores: el(0,0,0,2) }] },
    { id: "q9", text: "Başkası stresliyken?", options: [{ id: "a", text: "Çözüm öneririm, harekete geçiririm", scores: el(0,0,0,2) }, { id: "b", text: "Pratik yardım sunarım", scores: el(0,0,2,0) }, { id: "c", text: "Dinler, mantıklı konuşurum", scores: el(0,2,0,0) }, { id: "d", text: "Yanında olur, hissederim", scores: el(2,0,0,0) }] },
    { id: "q10", text: "Stres sonrası toparlanma?", options: [{ id: "a", text: "Yeni hedefe geçerim", scores: el(2,0,0,0) }, { id: "b", text: "Rutine dönerim", scores: el(0,2,0,0) }, { id: "c", text: "Sohbet ve öğrenmeyle", scores: el(0,0,2,0) }, { id: "d", text: "Dinlenme ve duygusal destekle", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: STRESS_RESULTS,
};

/* ================= TEST 6: KARAR VERME (10 soru) ================= */

const DECISION_RESULTS: TestResult[] = [
  elementResult("fire", "Sezgisel ve Hızlı", "Ateşin Kararı", "İçgüdüne güvenirsin; uzun düşünmek seni sıkar. Hızlı ve cesur karar verirsin. Pişmanlıktan çok fırsat kaçırmaktan korkarsın.", ["Hız", "Cesaret", "Sezgi", "Netlik", "Eylem"], "Aceleci ve riskli kararlar; detayları atlayabilirsin."),
  elementResult("earth", "Mantıklı ve Planlı", "Toprağın Kararı", "Veri, deneyim ve prosedüre göre karar verirsin. Acele etmezsin; artı-eksi listesi yapabilirsin. Güvenli ve tutarlı seçimler yaparsın.", ["Mantık", "Sabır", "Tutarlılık", "Güvenilirlik", "Planlama"], "Aşırı temkinlilik ve fırsat kaçırma."),
  elementResult("air", "Analitik ve Esnek", "Havanın Kararı", "Farklı senaryoları tartarsın; başkalarının fikrini dinlersin. Karar değiştirmekte esnek olabilirsin. Bilgi ve perspektif seni rahatlatır.", ["Analiz", "Esneklik", "İletişim", "Merak", "Uyum"], "Kararsızlık ve sürekli seçenek arama."),
  elementResult("water", "Duygusal ve Değer Odaklı", "Suyun Kararı", "Kalbine ve değerlerine göre karar verirsin. 'Doğru hissettirmesi' önemli. Sezgi ve empati rehberindir.", ["Sezgi", "Değerler", "Empati", "Derinlik", "Bağ"], "Mantığı görmezden gelme; duygusal kararlar."),
];

export const DECISION_TEST: PersonalityTest = {
  id: "decision-style",
  slug: "karar-verme",
  title: "Karar Verme Stilin",
  description: "Seçim yaparken mantık mı sezgi mi kullanıyorsun? Karar verme tarzın ve baskın zihniyetin keşfedilir.",
  duration: "5–6 dk",
  questionCount: 10,
  category: "psychology",
  image: "/tests/mind.png",
  questions: [
    { id: "q1", text: "Önemli bir karar öncesi ne yaparsın?", options: [{ id: "a", text: "İçime bakar, hissederim", scores: el(2,0,0,0) }, { id: "b", text: "Liste yapar, araştırırım", scores: el(0,2,0,0) }, { id: "c", text: "Başkalarına sorar, tartarım", scores: el(0,0,2,0) }, { id: "d", text: "Zaman geçirir, rüyama bırakırım", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Karar verdikten sonra?", options: [{ id: "a", text: "Hemen uygularım", scores: el(2,0,0,0) }, { id: "b", text: "Planı takip ederim", scores: el(0,2,0,0) }, { id: "c", text: "Gerekirse revize ederim", scores: el(0,0,2,0) }, { id: "d", text: "İçime uygun mu diye kontrol ederim", scores: el(0,0,0,2) }] },
    { id: "q3", text: "İki iyi seçenek arasında kaldığında?", options: [{ id: "a", text: "Birini seçer, pişman olmam", scores: el(0,0,0,2) }, { id: "b", text: "Kriterlere göre puanlarım", scores: el(0,0,2,0) }, { id: "c", text: "İkisini de denemeye çalışırım", scores: el(0,2,0,0) }, { id: "d", text: "Hangisi kalbime daha yakın", scores: el(2,0,0,0) }] },
    { id: "q4", text: "Yanlış karar verdiğini anlayınca?", options: [{ id: "a", text: "Hemen düzeltir, devam ederim", scores: el(2,0,0,0) }, { id: "b", text: "Neden yanlış oldu analiz ederim", scores: el(0,2,0,0) }, { id: "c", text: "Alternatif düşünürüm", scores: el(0,0,2,0) }, { id: "d", text: "Üzülür, sonra toparlanırım", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Başkası senin kararını sorgulayınca?", options: [{ id: "a", text: "Savunurum, net olurum", scores: el(2,0,0,0) }, { id: "b", text: "Kanıtlarımı sunarım", scores: el(0,2,0,0) }, { id: "c", text: "Dinler, gerekirse değiştiririm", scores: el(0,0,2,0) }, { id: "d", text: "Hislerime güvenirim", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Acele karar gerekince?", options: [{ id: "a", text: "Rahatım, hemen veririm", scores: el(0,0,0,2) }, { id: "b", text: "En kritik faktöre odaklanırım", scores: el(0,0,2,0) }, { id: "c", text: "Hızlı analiz yaparım", scores: el(0,2,0,0) }, { id: "d", text: "İçgüdüme güvenirim", scores: el(2,0,0,0) }] },
    { id: "q7", text: "Geçmiş kararların hakkında?", options: [{ id: "a", text: "Geçmişe takılmam", scores: el(2,0,0,0) }, { id: "b", text: "Ders çıkarırım", scores: el(0,2,0,0) }, { id: "c", text: "Bağlamı değerlendiririm", scores: el(0,0,2,0) }, { id: "d", text: "Duygusal iz bırakır", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Grup kararında rolün?", options: [{ id: "a", text: "Yönlendirir, son noktayı koyarım", scores: el(2,0,0,0) }, { id: "b", text: "Veriyi sunar, yapı kurarım", scores: el(0,2,0,0) }, { id: "c", text: "Seçenekleri tartıştırırım", scores: el(0,0,2,0) }, { id: "d", text: "Herkesin hissini dikkate alırım", scores: el(0,0,0,2) }] },
    { id: "q9", text: "Para / kariyer kararı?", options: [{ id: "a", text: "Risk alır, fırsatı değerlendiririm", scores: el(0,0,0,2) }, { id: "b", text: "Güvenli ve hesaplı", scores: el(0,0,2,0) }, { id: "c", text: "Esnek, deneyerek", scores: el(0,2,0,0) }, { id: "d", text: "Anlam ve denge önemli", scores: el(2,0,0,0) }] },
    { id: "q10", text: "Karar vermek senin için?", options: [{ id: "a", text: "Doğal ve hızlı", scores: el(2,0,0,0) }, { id: "b", text: "Sistematik süreç", scores: el(0,2,0,0) }, { id: "c", text: "Açık uçlu, değişebilir", scores: el(0,0,2,0) }, { id: "d", text: "Duygusal yük taşır", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: DECISION_RESULTS,
};

/* ================= TEST 7: SOSYAL ENERJİ (10 soru) ================= */

const SOCIAL_RESULTS: TestResult[] = [
  elementResult("fire", "Sosyal Merkez", "Ateşin Sosyalliği", "Kalabalıkta enerji veriyorsun. Parti, etkinlik veya liderlik rolü sana uygun. Tanışmak ve motive etmek doğal.", ["Enerji", "Liderlik", "Cesaret", "Eğlence", "İlham"], "Bazen baskın ve yorucu; dinlemeyi unutabilirsin."),
  elementResult("earth", "Güvenilir Arkadaş", "Toprağın Sosyalliği", "Az ama öz arkadaşlık tercih edersin. Sözünün eri ve istikrarlısın. Planlı buluşmalar ve güven senin için önemli.", ["Güvenilirlik", "Sadakat", "Düzen", "Derinlik", "Sorumluluk"], "Yeni insanlara mesafeli; değişime kapalı olabilirsin."),
  elementResult("air", "Bağlantı Kuran", "Havanın Sosyalliği", "Geniş çevre ve sohbet seni besler. Networking ve farklı insanlar ilgini çeker. Hafif ve eğlenceli ilişkiler rahat.", ["İletişim", "Merak", "Çeşitlilik", "Mizah", "Uyum"], "Derin bağ kurmakta zorlanma; yüzeysel kalabilirsin."),
  elementResult("water", "Derin Bağlar", "Suyun Sosyalliği", "Az sayıda ama çok derin ilişki kurarsın. Empati ve samimiyet önemli. Kalabalık yorar; küçük gruplar veya bire bir tercih.", ["Empati", "Derinlik", "Sadakat", "Sezgi", "Samimiyet"], "Sosyal enerji tükenmesi; sınır koymakta zorlanma."),
];

export const SOCIAL_TEST: PersonalityTest = {
  id: "social-energy",
  slug: "sosyal-enerji",
  title: "Sosyal Enerji ve Arkadaşlık",
  description: "Kalabalıkta nasılsın? Arkadaşlık tarzın ve sosyal pillerin nasıl şarj oluyor? Bu test sosyal enerjini ortaya çıkarır.",
  duration: "5–6 dk",
  questionCount: 10,
  category: "personality",
  image: "/tests/personality.png",
  questions: [
    { id: "q1", text: "Kalabalık bir ortama girdiğinde?", options: [{ id: "a", text: "Ortamı ısıtır, tanışırım", scores: el(2,0,0,0) }, { id: "b", text: "Tanıdık birini ararım", scores: el(0,2,0,0) }, { id: "c", text: "Sohbet başlatır, gezerim", scores: el(0,0,2,0) }, { id: "d", text: "Sessizce izler, alışırım", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Arkadaş sayın ve derinlik?", options: [{ id: "a", text: "Çok arkadaş, geniş çevre", scores: el(2,0,0,0) }, { id: "b", text: "Az ama çok yakın", scores: el(0,2,0,0) }, { id: "c", text: "Orta, çeşitli gruplar", scores: el(0,0,2,0) }, { id: "d", text: "Az, derin ve duygusal", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Parti / etkinlik sonrası?", options: [{ id: "a", text: "Enerji dolu, devam edebilirim", scores: el(0,0,0,2) }, { id: "b", text: "Yorulurum, dinlenmem gerek", scores: el(0,0,2,0) }, { id: "c", text: "Keyifli, ama yeterince sosyalleştim", scores: el(0,2,0,0) }, { id: "d", text: "Bitkin, yalnız zaman isterim", scores: el(2,0,0,0) }] },
    { id: "q4", text: "Yeni biriyle tanışırken?", options: [{ id: "a", text: "Önce ben konuşurum", scores: el(2,0,0,0) }, { id: "b", text: "Güven kurana kadar mesafeli", scores: el(0,2,0,0) }, { id: "c", text: "Sohbeti açar, soru sorarım", scores: el(0,0,2,0) }, { id: "d", text: "Göz teması ve dinleme", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Arkadaşın zor durumda?", options: [{ id: "a", text: "Hemen çözüm sunar, harekete geçerim", scores: el(2,0,0,0) }, { id: "b", text: "Pratik yardım, güvenilir olurum", scores: el(0,2,0,0) }, { id: "c", text: "Dinler, farklı açılar sunarım", scores: el(0,0,2,0) }, { id: "d", text: "Yanında olur, hissederim", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Sosyal pilin nasıl dolar?", options: [{ id: "a", text: "Kalabalıkla, etkinlikle", scores: el(0,0,0,2) }, { id: "b", text: "Rutin ve güvenli ortamla", scores: el(0,0,2,0) }, { id: "c", text: "Sohbet ve yeni bilgiyle", scores: el(0,2,0,0) }, { id: "d", text: "Yalnız veya yakın biriyle", scores: el(2,0,0,0) }] },
    { id: "q7", text: "Grupla plan yaparken?", options: [{ id: "a", text: "Ben önerir, organize ederim", scores: el(2,0,0,0) }, { id: "b", text: "Net tarih ve yer isterim", scores: el(0,2,0,0) }, { id: "c", text: "Esnek, herkesin fikri", scores: el(0,0,2,0) }, { id: "d", text: "Küçük grup, samimi ortam", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Sosyal medyada nasılsın?", options: [{ id: "a", text: "Aktif, paylaşır, etkileşir", scores: el(2,0,0,0) }, { id: "b", text: "Seyrek, anlamlı paylaşım", scores: el(0,2,0,0) }, { id: "c", text: "Sohbet ve bilgi odaklı", scores: el(0,0,2,0) }, { id: "d", text: "Yakın çevreyle, özel", scores: el(0,0,0,2) }] },
    { id: "q9", text: "Yalnız kalmak senin için?", options: [{ id: "a", text: "Sıkıcı, kısa süre yeter", scores: el(0,0,0,2) }, { id: "b", text: "Düzen için gerekli", scores: el(0,0,2,0) }, { id: "c", text: "Düşünmek için iyi", scores: el(0,2,0,0) }, { id: "d", text: "Şart, enerjimi toplarım", scores: el(2,0,0,0) }] },
    { id: "q10", text: "Arkadaşların seni nasıl tanımlar?", options: [{ id: "a", text: "Enerjik, cesur, eğlenceli", scores: el(2,0,0,0) }, { id: "b", text: "Güvenilir, istikrarlı", scores: el(0,2,0,0) }, { id: "c", text: "Zeki, meraklı, iyi sohbet", scores: el(0,0,2,0) }, { id: "d", text: "Anlayışlı, derin, sıcak", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: SOCIAL_RESULTS,
};

/* ================= TEST 8: GİZLİ GÜÇ / GÖLGE (10 soru) ================= */

const SHADOW_RESULTS: TestResult[] = [
  elementResult("fire", "Gölge Ateş", "Gizli Lider", "Baskı altında öfke veya sabırsızlık çıkabilir; ama aynı enerji seni dönüştürüp lider yapar. Gizli gücün: krizde harekete geçirme.", ["Dönüşüm", "Cesaret", "İlham", "Liderlik", "Enerji"], "Kontrol kaybında yıkıcı olma; ego ve öfke."),
  elementResult("earth", "Gölge Toprak", "Gizli Dayanıklılık", "Değişime kapalı veya inatçı görünebilirsin; ama aynı yapı dayanıklılık ve güven verir. Gizli gücün: her koşulda ayakta kalma.", ["Dayanıklılık", "Güven", "Sabır", "İstikrar", "Sorumluluk"], "Katılık ve duygusal soğukluk."),
  elementResult("air", "Gölge Hava", "Gizli Uyum", "Dağınık veya yüzeysel görünebilirsin; ama aynı zihin hızlı öğrenme ve uyum sağlar. Gizli gücün: her ortama uyum.", ["Uyum", "Öğrenme", "İletişim", "Esneklik", "Perspektif"], "Kararsızlık ve bağlanma korkusu."),
  elementResult("water", "Gölge Su", "Gizli Sezgi", "Aşırı hassas veya kapalı görünebilirsin; ama aynı derinlik sezgi ve yaratıcılık verir. Gizli gücün: görünmeyeni hissetme.", ["Sezgi", "Yaratıcılık", "Empati", "Derinlik", "Dönüşüm"], "Aşırı duygusallık ve sınır kaybı."),
];

export const SHADOW_TEST: PersonalityTest = {
  id: "shadow-side",
  slug: "gizli-guc",
  title: "Gizli Gücün ve Gölge Yönün",
  description: "Bilinçdışı tercihlerin ve 'gölge' yanın ne? Jung tarzı bir bakışla gizli gücünü keşfet.",
  duration: "5–6 dk",
  questionCount: 10,
  category: "spiritual",
  image: "/tests/aura.png",
  questions: [
    { id: "q1", text: "Farkında olmadan sık yaptığın şey?", options: [{ id: "a", text: "Liderlik etmek, öne çıkmak", scores: el(2,0,0,0) }, { id: "b", text: "Kontrol etmek, düzenlemek", scores: el(0,2,0,0) }, { id: "c", text: "Merak etmek, analiz etmek", scores: el(0,0,2,0) }, { id: "d", text: "Hissetmek, empati kurmak", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Kızdığında aslında ne hissediyorsun?", options: [{ id: "a", text: "Güçsüz veya engellenmiş", scores: el(2,0,0,0) }, { id: "b", text: "Güvensiz veya tehdit altında", scores: el(0,2,0,0) }, { id: "c", text: "Anlaşılmamış veya haksız", scores: el(0,0,2,0) }, { id: "d", text: "İncinmiş veya reddedilmiş", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Rüyalarında sık çıkan tema?", options: [{ id: "a", text: "Yarış, kovalamaca, aksiyon", scores: el(0,0,0,2) }, { id: "b", text: "Ev, yol, kaybolma", scores: el(0,0,2,0) }, { id: "c", text: "Uçuş, konuşma, bulmaca", scores: el(0,2,0,0) }, { id: "d", text: "Su, deniz, ağlama", scores: el(2,0,0,0) }] },
    { id: "q4", text: "Eleştirildiğinde en çok incinen?", options: [{ id: "a", text: "Yetersiz veya zayıf görülmek", scores: el(2,0,0,0) }, { id: "b", text: "Güvenilmez veya dağınık", scores: el(0,2,0,0) }, { id: "c", text: "Aptal veya yüzeysel", scores: el(0,0,2,0) }, { id: "d", text: "Soğuk veya duygusuz", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Gizli yeteneğin ne olabilir?", options: [{ id: "a", text: "Krizde sakin kalıp harekete geçirmek", scores: el(2,0,0,0) }, { id: "b", text: "Her şeyi taşımak, dayanmak", scores: el(0,2,0,0) }, { id: "c", text: "Farklı açıları birleştirmek", scores: el(0,0,2,0) }, { id: "d", text: "İnsanların hissini okumak", scores: el(0,0,0,2) }] },
    { id: "q6", text: "En zor kabullendiğin yönün?", options: [{ id: "a", text: "Sabırsızlık ve öfke", scores: el(0,0,0,2) }, { id: "b", text: "Inat ve katılık", scores: el(0,0,2,0) }, { id: "c", text: "Kararsızlık ve mesafe", scores: el(0,2,0,0) }, { id: "d", text: "Aşırı hassasiyet", scores: el(2,0,0,0) }] },
    { id: "q7", text: "Stres altında bilinçdışı tepkin?", options: [{ id: "a", text: "Saldırı veya kaçış", scores: el(2,0,0,0) }, { id: "b", text: "Donma, kontrol", scores: el(0,2,0,0) }, { id: "c", text: "Mantığa sığınma", scores: el(0,0,2,0) }, { id: "d", text: "İçe kapanma, ağlama", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Başkalarında en çok neyi eleştirirsin?", options: [{ id: "a", text: "Pasiflik ve vazgeçiş", scores: el(2,0,0,0) }, { id: "b", text: "Düzensizlik ve güvensizlik", scores: el(0,2,0,0) }, { id: "c", text: "Dar görüşlülük", scores: el(0,0,2,0) }, { id: "d", text: "Duygusuzluk", scores: el(0,0,0,2) }] },
    { id: "q9", text: "Kendini geliştirmek için en çok neye ihtiyacın var?", options: [{ id: "a", text: "Sabır ve dinleme", scores: el(0,0,0,2) }, { id: "b", text: "Esneklik ve risk", scores: el(0,0,2,0) }, { id: "c", text: "Derinlik ve duygu", scores: el(0,2,0,0) }, { id: "d", text: "Sınır ve mantık", scores: el(2,0,0,0) }] },
    { id: "q10", text: "Gölge yanın sana ne öğretiyor?", options: [{ id: "a", text: "Gücü paylaşmak", scores: el(2,0,0,0) }, { id: "b", text: "Değişime açılmak", scores: el(0,2,0,0) }, { id: "c", text: "Bağlanmak ve karar vermek", scores: el(0,0,2,0) }, { id: "d", text: "Korunmak ve sınır koymak", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: SHADOW_RESULTS,
};

/* ================= TEST 9: YAŞAM ÖNCELİKLERİ (10 soru) ================= */

const PRIORITY_RESULTS: TestResult[] = [
  elementResult("fire", "Hedef ve Macera", "Ateşin Önceliği", "Hayatta hedef, başarı ve heyecan seni motive eder. Durgunluk seni yorar; anlamı aksiyonda bulursun.", ["Hedef", "Macera", "Başarı", "Özgürlük", "İlham"], "Sürekli bir sonraki hedefe koşma; anı kaçırma."),
  elementResult("earth", "Güvenlik ve Aile", "Toprağın Önceliği", "Güvenlik, aile ve istikrar senin için merkezde. Uzun vadeli plan ve somut sonuçlar seni mutlu eder.", ["Güvenlik", "Aile", "İstikrar", "Sorumluluk", "Plan"], "Aşırı güvenlik arayışı; riskten kaçınma."),
  elementResult("air", "Öğrenme ve Özgürlük", "Havanın Önceliği", "Öğrenmek, keşfetmek ve özgür olmak seni besler. İlişkiler ve fikirler hayatına anlam katar.", ["Öğrenme", "Özgürlük", "İletişim", "Çeşitlilik", "Merak"], "Köksüzlük ve kararsızlık."),
  elementResult("water", "Sevgi ve Anlam", "Suyun Önceliği", "Sevgi, anlam ve derin bağlar senin için öncelikli. İç dünya ve duygusal tatmin hayatına yön verir.", ["Sevgi", "Anlam", "Bağ", "Yaratıcılık", "İç dünya"], "Dış dünyadan kopma; aşırı içe dönüklük."),
];

export const PRIORITY_TEST: PersonalityTest = {
  id: "life-priorities",
  slug: "yasam-oncelikleri",
  title: "Yaşam Önceliklerin",
  description: "Hayatta seni ne motive ediyor? Ne için yaşıyorsun? Bu test yaşam önceliklerini ve değerlerini ortaya çıkarır.",
  duration: "5–6 dk",
  questionCount: 10,
  category: "spiritual",
  image: "/tests/aura.png",
  questions: [
    { id: "q1", text: "Hayatta en çok ne seni motive eder?", options: [{ id: "a", text: "Başarı ve hedef", scores: el(2,0,0,0) }, { id: "b", text: "Güvenlik ve aile", scores: el(0,2,0,0) }, { id: "c", text: "Özgürlük ve öğrenme", scores: el(0,0,2,0) }, { id: "d", text: "Sevgi ve anlam", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Para kazanmak senin için ne?", options: [{ id: "a", text: "Fırsat ve güç", scores: el(2,0,0,0) }, { id: "b", text: "Güvenlik ve rahatlık", scores: el(0,2,0,0) }, { id: "c", text: "Özgürlük ve deneyim", scores: el(0,0,2,0) }, { id: "d", text: "Huzur ve paylaşım", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Ölüm döşeğinde neyi düşünürdün?", options: [{ id: "a", text: "Yapmadığım maceralar", scores: el(0,0,0,2) }, { id: "b", text: "Ailem ve bıraktıklarım", scores: el(0,0,2,0) }, { id: "c", text: "Öğrendiklerim ve paylaştıklarım", scores: el(0,2,0,0) }, { id: "d", text: "Sevdiklerim ve hissettiklerim", scores: el(2,0,0,0) }] },
    { id: "q4", text: "Hafta sonu ideal geçerken?", options: [{ id: "a", text: "Spor, gezi, yeni deneyim", scores: el(2,0,0,0) }, { id: "b", text: "Ev, aile, düzen", scores: el(0,2,0,0) }, { id: "c", text: "Sohbet, kurs, okuma", scores: el(0,0,2,0) }, { id: "d", text: "Doğa, sanat, sevdiklerimle", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Vazgeçemeyeceğin tek şey?", options: [{ id: "a", text: "Özgürlük ve hareket", scores: el(2,0,0,0) }, { id: "b", text: "Güven ve istikrar", scores: el(0,2,0,0) }, { id: "c", text: "Merak ve öğrenme", scores: el(0,0,2,0) }, { id: "d", text: "Sevgi ve bağ", scores: el(0,0,0,2) }] },
    { id: "q6", text: "İş / kariyer seçerken öncelik?", options: [{ id: "a", text: "Heyecan ve liderlik", scores: el(0,0,0,2) }, { id: "b", text: "Güvenli gelir ve düzen", scores: el(0,0,2,0) }, { id: "c", text: "Öğrenme ve çeşitlilik", scores: el(0,2,0,0) }, { id: "d", text: "Anlam ve insan", scores: el(2,0,0,0) }] },
    { id: "q7", text: "Çocuklara ne öğretmek istersin?", options: [{ id: "a", text: "Cesaret ve hedef", scores: el(2,0,0,0) }, { id: "b", text: "Sorumluluk ve düzen", scores: el(0,2,0,0) }, { id: "c", text: "Merak ve mantık", scores: el(0,0,2,0) }, { id: "d", text: "Sevgi ve empati", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Hayatının anlamı?", options: [{ id: "a", text: "İz bırakmak, başarmak", scores: el(2,0,0,0) }, { id: "b", text: "Koruma, sağlamak", scores: el(0,2,0,0) }, { id: "c", text: "Keşfetmek, anlamak", scores: el(0,0,2,0) }, { id: "d", text: "Sevmek, bağ kurmak", scores: el(0,0,0,2) }] },
    { id: "q9", text: "Zamanını neye ayırmak istersin?", options: [{ id: "a", text: "Projeler ve macera", scores: el(0,0,0,2) }, { id: "b", text: "Aile ve ev", scores: el(0,0,2,0) }, { id: "c", text: "Öğrenme ve sohbet", scores: el(0,2,0,0) }, { id: "d", text: "Sevdiklerim ve iç dünya", scores: el(2,0,0,0) }] },
    { id: "q10", text: "Mutluluk senin için?", options: [{ id: "a", text: "Hedefe ulaşmak, hareket", scores: el(2,0,0,0) }, { id: "b", text: "Güvende hissetmek", scores: el(0,2,0,0) }, { id: "c", text: "Özgür ve meraklı olmak", scores: el(0,0,2,0) }, { id: "d", text: "Sevmek ve sevilmek", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: PRIORITY_RESULTS,
};

/* ================= TEST 10: UYUMLULUK VE EŞ SEÇİMİ (10 soru) ================= */

const COMPATIBILITY_RESULTS: TestResult[] = [
  elementResult("fire", "Tutkulu Eş Arayan", "Ateşin Eşi", "Senin için ideal eş enerjik, cesur ve heyecanlı. Tutku ve macera ilişkide ön planda. Sıkıcı ve pasif partner seni tüketir.", ["Tutku", "Cesaret", "Liderlik", "Enerji", "Doğrudanlık"], "Sabırsızlık; yanlış kişiye bağlanıp hemen kopma."),
  elementResult("earth", "Güvenli Eş Arayan", "Toprağın Eşi", "İdeal eşin güvenilir, sadık ve istikrarlı. Ev, aile ve uzun vadeli plan önemli. Belirsiz ve dağınık partner seni yorar.", ["Sadakat", "Güven", "İstikrar", "Plan", "Sorumluluk"], "Aşırı beklenti; duygusal soğukluk."),
  elementResult("air", "Zihinsel Eş Arayan", "Havanın Eşi", "İdeal eşin zeki, sohbeti kuvvetli ve özgür. Arkadaşlık temelli aşk sana yakın. Boğucu ve kıskanç partner seni kaçırır.", ["Zeka", "Sohbet", "Özgürlük", "Esneklik", "Merak"], "Bağlanma korkusu; sürekli 'daha iyisi' arama."),
  elementResult("water", "Ruh Eşi Arayan", "Suyun Eşi", "İdeal eşin duygusal, derin ve sadık. Ruh bağı ve anlaşılma senin için vazgeçilmez. Soğuk ve mesafeli partner seni incitir.", ["Derinlik", "Empati", "Sadakat", "Romantizm", "Sezgi"], "Aşırı idealizasyon; kırılganlık."),
];

export const COMPATIBILITY_TEST: PersonalityTest = {
  id: "compatibility-partner",
  slug: "uyumluluk-es",
  title: "Uyumluluk ve Eş Seçimi",
  description: "İdeal partnerin nasıl biri? Hangi tip seninle uyumlu? Bu test eş seçimi ve uyumluluk tarzını ortaya çıkarır.",
  duration: "5–6 dk",
  questionCount: 10,
  category: "love",
  image: "/tests/love.png",
  questions: [
    { id: "q1", text: "İdeal partnerinde en önemli özellik?", options: [{ id: "a", text: "Enerji ve cesaret", scores: el(2,0,0,0) }, { id: "b", text: "Güvenilirlik ve sadakat", scores: el(0,2,0,0) }, { id: "c", text: "Zeka ve sohbet", scores: el(0,0,2,0) }, { id: "d", text: "Duygusal derinlik ve empati", scores: el(0,0,0,2) }] },
    { id: "q2", text: "İlişkide senin için kırmızı çizgi?", options: [{ id: "a", text: "Sıkıcılık ve vazgeçiş", scores: el(2,0,0,0) }, { id: "b", text: "Sadakatsizlik ve güvensizlik", scores: el(0,2,0,0) }, { id: "c", text: "Kıskançlık ve kısıtlama", scores: el(0,0,2,0) }, { id: "d", text: "Duygusal soğukluk", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Flört aşamasında ne yaparsın?", options: [{ id: "a", text: "Pek çekinmem, cesur davranırım", scores: el(0,0,0,2) }, { id: "b", text: "Yavaş, güven kurarım", scores: el(0,0,2,0) }, { id: "c", text: "Sohbet ve espri", scores: el(0,2,0,0) }, { id: "d", text: "Hisleri okur, uyum ararım", scores: el(2,0,0,0) }] },
    { id: "q4", text: "Partnerin seni nasıl desteklemeli?", options: [{ id: "a", text: "Hedeflerimde yanımda olsun", scores: el(2,0,0,0) }, { id: "b", text: "Güvenilir ve istikrarlı olsun", scores: el(0,2,0,0) }, { id: "c", text: "Fikirlerimi dinlesin, tartışsın", scores: el(0,0,2,0) }, { id: "d", text: "Duygusal olarak yanımda olsun", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Evlilik / uzun ilişki hakkında?", options: [{ id: "a", text: "Ortak hedefler ve macera", scores: el(2,0,0,0) }, { id: "b", text: "Güvenli yuva ve aile", scores: el(0,2,0,0) }, { id: "c", text: "Arkadaşlık ve özgürlük", scores: el(0,0,2,0) }, { id: "d", text: "Ruh bağı ve derin sevgi", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Uyumsuzlukta ne yaparsın?", options: [{ id: "a", text: "Tartışır, netleştiririm", scores: el(0,0,0,2) }, { id: "b", text: "Kurallar ve sınır koyarım", scores: el(0,0,2,0) }, { id: "c", text: "Konuşur, uzlaşırım", scores: el(0,2,0,0) }, { id: "d", text: "Zaman tanır, hissederim", scores: el(2,0,0,0) }] },
    { id: "q7", text: "Seninle en uyumlu tip?", options: [{ id: "a", text: "Enerjik ve hevesli", scores: el(2,0,0,0) }, { id: "b", text: "Güvenilir ve planlı", scores: el(0,2,0,0) }, { id: "c", text: "Zeki ve esnek", scores: el(0,0,2,0) }, { id: "d", text: "Sıcak ve duygusal", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Aşkı nasıl tanımlarsın?", options: [{ id: "a", text: "Tutku ve heyecan", scores: el(2,0,0,0) }, { id: "b", text: "Güven ve sadakat", scores: el(0,2,0,0) }, { id: "c", text: "Zihinsel uyum ve eğlence", scores: el(0,0,2,0) }, { id: "d", text: "Derin bağ ve anlaşılma", scores: el(0,0,0,2) }] },
    { id: "q9", text: "Partnerinin seni en çok anlaması gereken?", options: [{ id: "a", text: "Hedeflerim ve enerjim", scores: el(0,0,0,2) }, { id: "b", text: "İhtiyacım olan güven", scores: el(0,0,2,0) }, { id: "c", text: "Özgürlük ve merakım", scores: el(0,2,0,0) }, { id: "d", text: "Duygularım ve sessiz anlarım", scores: el(2,0,0,0) }] },
    { id: "q10", text: "İlişkide en çok neye ihtiyacın var?", options: [{ id: "a", text: "Heyecan ve saygı", scores: el(2,0,0,0) }, { id: "b", text: "İstikrar ve söz", scores: el(0,2,0,0) }, { id: "c", text: "Özgürlük ve sohbet", scores: el(0,0,2,0) }, { id: "d", text: "Sevgi ve anlaşılma", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: COMPATIBILITY_RESULTS,
};

/* ================= TEST 11: YARATICILIK VE SANAT (10 soru) ================= */

const CREATIVITY_RESULTS: TestResult[] = [
  elementResult("fire", "Tutkulu Yaratıcı", "Ateşin Sanatı", "Yaratıcılığın cesur ve enerjik. Büyük fikirler, dramatik ifade ve performans sana yakın. Sanatında tutku ve güç var; risk almayı seversin.", ["Cesaret", "Enerji", "Dramatik ifade", "Liderlik", "Tutku"], "Sabırsızlık ve aşırı ego; detayları atlayabilirsin."),
  elementResult("earth", "Düzenli ve Somut Yaratıcı", "Toprağın Sanatı", "Yaratıcılığın pratik ve somut. El işi, mimari, tasarım veya planlı projeler sana uygun. Detay ve kalite önemli; eserlerin kalıcı olur.", ["Pratiklik", "Detay", "Kalite", "Sabır", "Somutluk"], "Esneklik azlığı ve riskten kaçınma; bazen sınırlı kalabilirsin."),
  elementResult("air", "Fikir ve Konsept Yaratıcısı", "Havanın Sanatı", "Yaratıcılığın kavramsal ve zihinsel. Fikir üretmek, yazmak veya yenilikçi çözümler senin alanın. Çeşitlilik ve deney seni besler.", ["Fikir", "Yenilik", "İletişim", "Esneklik", "Kavram"], "Tamamlama zorluğu ve dağınıklık; bazen yüzeysel kalabilirsin."),
  elementResult("water", "Duygusal ve Sezgisel Yaratıcı", "Suyun Sanatı", "Yaratıcılığın duygusal ve sezgisel. Müzik, şiir, görsel sanat veya iç dünyayı ifade etmek sana yakın. Sanatın derin ve anlamlı.", ["Sezgi", "Duygu", "Derinlik", "Empati", "Yaratıcılık"], "Aşırı hassasiyet ve içe kapanma; bazen tükenebilirsin."),
];

export const CREATIVITY_TEST: PersonalityTest = {
  id: "creativity-art",
  slug: "yaraticilik-sanat",
  title: "Yaratıcılık ve Sanat Tarzın",
  description: "Yaratıcı yönün nasıl? Hangi sanat formu sana uygun? Bu test yaratıcılık enerjini ve sanatsal ifade tarzını ortaya çıkarır.",
  duration: "5–6 dk",
  questionCount: 10,
  category: "spiritual",
  image: "/tests/aura.png",
  questions: [
    { id: "q1", text: "Yaratıcı projeye başlarken nasıl yaklaşırsın?", options: [{ id: "a", text: "Büyük fikirle başlar, enerjiyle ilerlerim", scores: el(2,0,0,0) }, { id: "b", text: "Plan yapar, adım adım ilerlerim", scores: el(0,2,0,0) }, { id: "c", text: "Fikirleri toplar, deneyerek ilerlerim", scores: el(0,0,2,0) }, { id: "d", text: "Hislerime güvenir, içimden geldiği gibi", scores: el(0,0,0,2) }] },
    { id: "q2", text: "En çok hangi sanat formu ilgini çeker?", options: [{ id: "a", text: "Performans, tiyatro, dans", scores: el(2,0,0,0) }, { id: "b", text: "El işi, mimari, tasarım", scores: el(0,2,0,0) }, { id: "c", text: "Yazı, konsept, yenilik", scores: el(0,0,2,0) }, { id: "d", text: "Müzik, şiir, görsel sanat", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Yaratıcılıkta en çok ne seni besler?", options: [{ id: "a", text: "Heyecan ve risk", scores: el(0,0,0,2) }, { id: "b", text: "Malzeme ve teknik", scores: el(0,0,2,0) }, { id: "c", text: "Fikir ve kavram", scores: el(0,2,0,0) }, { id: "d", text: "Duygu ve sezgi", scores: el(2,0,0,0) }] },
    { id: "q4", text: "Yaratıcı tıkanıklıkta ne yaparsın?", options: [{ id: "a", text: "Farklı bir şeye geçer, enerji ararım", scores: el(2,0,0,0) }, { id: "b", text: "Tekniğe döner, pratik yaparım", scores: el(0,2,0,0) }, { id: "c", text: "Araştırır, ilham ararım", scores: el(0,0,2,0) }, { id: "d", text: "İçime döner, duyguları dinlerim", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Eserini paylaşırken nasıl hissedersin?", options: [{ id: "a", text: "Gururlu, performans isterim", scores: el(2,0,0,0) }, { id: "b", text: "Güvenli, kaliteyi gösteririm", scores: el(0,2,0,0) }, { id: "c", text: "Meraklı, geri bildirim isterim", scores: el(0,0,2,0) }, { id: "d", text: "Kırılgan, samimiyet ararım", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Yaratıcılıkta en güçlü yönün?", options: [{ id: "a", text: "Cesaret ve orijinallik", scores: el(0,0,0,2) }, { id: "b", text: "Teknik ve detay", scores: el(0,0,2,0) }, { id: "c", text: "Fikir ve yenilik", scores: el(0,2,0,0) }, { id: "d", text: "Duygu ve derinlik", scores: el(2,0,0,0) }] },
    { id: "q7", text: "Eleştiri aldığında?", options: [{ id: "a", text: "Savunur, kendi yoluma giderim", scores: el(2,0,0,0) }, { id: "b", text: "Mantıklı olanı değerlendiririm", scores: el(0,2,0,0) }, { id: "c", text: "Tartışır, farklı bakış alırım", scores: el(0,0,2,0) }, { id: "d", text: "İncinirim ama içselleştiririm", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Yaratıcı işbirliğinde rolün?", options: [{ id: "a", text: "Lider, vizyon sunarım", scores: el(2,0,0,0) }, { id: "b", text: "Organize eder, uygularım", scores: el(0,2,0,0) }, { id: "c", text: "Fikir üretir, tartışırım", scores: el(0,0,2,0) }, { id: "d", text: "Uyum sağlar, duygusal destek veririm", scores: el(0,0,0,2) }] },
    { id: "q9", text: "Yaratıcılık senin için ne ifade eder?", options: [{ id: "a", text: "Özgürlük ve kendini ifade", scores: el(0,0,0,2) }, { id: "b", text: "Somut sonuç ve kalite", scores: el(0,0,2,0) }, { id: "c", text: "Keşif ve öğrenme", scores: el(0,2,0,0) }, { id: "d", text: "Duygusal ifade ve anlam", scores: el(2,0,0,0) }] },
    { id: "q10", text: "Yaratıcı projeyi tamamlarken?", options: [{ id: "a", text: "Hızlı bitirir, yeniye geçerim", scores: el(2,0,0,0) }, { id: "b", text: "Detayları bitirir, mükemmelleştiririm", scores: el(0,2,0,0) }, { id: "c", text: "Gerekirse revize eder, geliştiririm", scores: el(0,0,2,0) }, { id: "d", text: "Duygusal olarak bağlanır, zor bırakırım", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: CREATIVITY_RESULTS,
};

/* ================= TEST 12: SAĞLIK VE WELLNESS (10 soru) ================= */

const HEALTH_RESULTS: TestResult[] = [
  elementResult("fire", "Aktif ve Enerjik Sağlık", "Ateşin Sağlığı", "Sağlık için hareket ve enerji önemli. Spor, rekabet ve aktif yaşam seni besler. Dinlenmek zor gelebilir; dengeyi bulmak gerekir.", ["Enerji", "Aktivite", "Cesaret", "Dayanıklılık", "Motivasyon"], "Aşırı aktivite ve dinlenmeyi unutma; tükenme riski."),
  elementResult("earth", "Düzenli ve Dengeli Sağlık", "Toprağın Sağlığı", "Sağlık için rutin ve düzen önemli. Beslenme, uyku ve planlı egzersiz senin için ideal. İstikrarlı yaklaşım güç verir.", ["Düzen", "Disiplin", "Denge", "Sabır", "İstikrar"], "Esneklik azlığı ve aşırı kontrol; bazen katı olabilirsin."),
  elementResult("air", "Esnek ve Çeşitli Sağlık", "Havanın Sağlığı", "Sağlık için çeşitlilik ve zihinsel denge önemli. Yoga, yürüyüş veya grup aktiviteleri sana uygun. Rutin seni sıkar.", ["Esneklik", "Çeşitlilik", "Zihinsel denge", "Uyum", "Merak"], "Tutarsızlık ve rutin eksikliği; bazen dağınık olabilirsin."),
  elementResult("water", "İçsel ve Duygusal Sağlık", "Suyun Sağlığı", "Sağlık için içsel denge ve duygusal iyilik önemli. Meditasyon, doğa veya yalnız aktiviteler seni besler. Stres yönetimi kritik.", ["İçsel denge", "Duygusal sağlık", "Sezgi", "Dinlenme", "Derinlik"], "Aşırı hassasiyet ve içe kapanma; dış aktivite eksikliği."),
];

export const HEALTH_TEST: PersonalityTest = {
  id: "health-wellness",
  slug: "saglik-wellness",
  title: "Sağlık ve Wellness Yaklaşımın",
  description: "Sağlık ve iyilik halin için hangi yaklaşım uygun? Bu test sağlık tarzını ve wellness enerjini ortaya çıkarır.",
  duration: "5–6 dk",
  questionCount: 10,
  category: "spiritual",
  image: "/tests/aura.png",
  questions: [
    { id: "q1", text: "Sağlıklı kalmak için en önemli şey?", options: [{ id: "a", text: "Aktif olmak ve spor", scores: el(2,0,0,0) }, { id: "b", text: "Düzenli rutin ve beslenme", scores: el(0,2,0,0) }, { id: "c", text: "Çeşitli aktivite ve denge", scores: el(0,0,2,0) }, { id: "d", text: "İçsel huzur ve dinlenme", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Egzersiz tercihin?", options: [{ id: "a", text: "Yoğun, rekabetçi spor", scores: el(2,0,0,0) }, { id: "b", text: "Planlı, düzenli antrenman", scores: el(0,2,0,0) }, { id: "c", text: "Çeşitli, eğlenceli aktivite", scores: el(0,0,2,0) }, { id: "d", text: "Sakin, içsel odaklı (yoga, yürüyüş)", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Stres yönetiminde ne yaparsın?", options: [{ id: "a", text: "Spor veya fiziksel aktivite", scores: el(0,0,0,2) }, { id: "b", text: "Rutin ve düzen", scores: el(0,0,2,0) }, { id: "c", text: "Sohbet ve öğrenme", scores: el(0,2,0,0) }, { id: "d", text: "Meditasyon veya yalnız zaman", scores: el(2,0,0,0) }] },
    { id: "q4", text: "Beslenme yaklaşımın?", options: [{ id: "a", text: "Enerji için, pratik", scores: el(2,0,0,0) }, { id: "b", text: "Planlı, dengeli ve düzenli", scores: el(0,2,0,0) }, { id: "c", text: "Çeşitli, deneyerek", scores: el(0,0,2,0) }, { id: "d", text: "Duygusal ve içsel dengeye göre", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Uyku rutinin?", options: [{ id: "a", text: "Kısa ama derin, erken kalkarım", scores: el(2,0,0,0) }, { id: "b", text: "Düzenli saatler, kaliteli uyku", scores: el(0,2,0,0) }, { id: "c", text: "Esnek, ihtiyaca göre", scores: el(0,0,2,0) }, { id: "d", text: "Uzun, dinlenme odaklı", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Hasta olduğunda nasıl davranırsın?", options: [{ id: "a", text: "Hareketsiz kalamam, mücadele ederim", scores: el(0,0,0,2) }, { id: "b", text: "Dinlenir, planlı iyileşirim", scores: el(0,0,2,0) }, { id: "c", text: "Araştırır, alternatif denerim", scores: el(0,2,0,0) }, { id: "d", text: "İçime döner, duygusal destek ararım", scores: el(2,0,0,0) }] },
    { id: "q7", text: "Mental sağlık için ne yaparsın?", options: [{ id: "a", text: "Hedef ve başarı", scores: el(2,0,0,0) }, { id: "b", text: "Düzen ve kontrol", scores: el(0,2,0,0) }, { id: "c", text: "Öğrenme ve sosyal bağ", scores: el(0,0,2,0) }, { id: "d", text: "Duygusal ifade ve bağ", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Wellness rutini oluştururken?", options: [{ id: "a", text: "Hemen başlar, enerjiyle ilerlerim", scores: el(2,0,0,0) }, { id: "b", text: "Plan yapar, sistematik uygularım", scores: el(0,2,0,0) }, { id: "c", text: "Deneyerek, esnek tutarım", scores: el(0,0,2,0) }, { id: "d", text: "İçsel ihtiyaca göre yavaş başlarım", scores: el(0,0,0,2) }] },
    { id: "q9", text: "Sağlık hedefin?", options: [{ id: "a", text: "Güç ve dayanıklılık", scores: el(0,0,0,2) }, { id: "b", text: "Denge ve istikrar", scores: el(0,0,2,0) }, { id: "c", text: "Esneklik ve çeşitlilik", scores: el(0,2,0,0) }, { id: "d", text: "İçsel huzur ve duygusal denge", scores: el(2,0,0,0) }] },
    { id: "q10", text: "Sağlıkta en çok ne seni zorlar?", options: [{ id: "a", text: "Dinlenmek ve yavaşlamak", scores: el(2,0,0,0) }, { id: "b", text: "Değişiklik ve esneklik", scores: el(0,2,0,0) }, { id: "c", text: "Rutin ve tekrar", scores: el(0,0,2,0) }, { id: "d", text: "Dış aktivite ve sosyal baskı", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: HEALTH_RESULTS,
};

/* ================= TEST 13: FİNANS VE PARA YÖNETİMİ (10 soru) ================= */

const FINANCE_RESULTS: TestResult[] = [
  elementResult("fire", "Yatırımcı ve Risk Alan", "Ateşin Finansı", "Para için risk almayı ve yatırım yapmayı seversin. Hızlı karar ve fırsatları değerlendirmek senin tarzın. Büyük hedefler seni motive eder.", ["Risk alma", "Yatırım", "Cesaret", "Fırsat", "Büyüme"], "Aşırı risk ve sabırsızlık; kayıplarda hızlı tepki."),
  elementResult("earth", "Güvenli ve Planlı Finans", "Toprağın Finansı", "Para için güvenlik ve plan önemli. Birikim, emeklilik ve uzun vadeli hedefler senin için ideal. Riskten kaçınır, istikrar ararsın.", ["Birikim", "Planlama", "Güvenlik", "Disiplin", "İstikrar"], "Aşırı temkinlilik ve fırsat kaçırma; bazen cimri görünebilirsin."),
  elementResult("air", "Esnek ve Bilinçli Finans", "Havanın Finansı", "Para için esneklik ve bilgi önemli. Çeşitli yatırımlar ve öğrenme seni çeker. Bütçe yönetimi ve analiz güçlü yanların.", ["Esneklik", "Bilgi", "Analiz", "Çeşitlilik", "Uyum"], "Kararsızlık ve tutarsızlık; bazen dağınık olabilirsin."),
  elementResult("water", "Değer Odaklı ve Duygusal Finans", "Suyun Finansı", "Para için değer ve anlam önemli. Aile, güvenlik ve duygusal tatmin seni yönlendirir. Paylaşım ve bağ kurma finansal kararlarında etkili.", ["Değer", "Güven", "Paylaşım", "Anlam", "Bağ"], "Duygusal kararlar ve sınır koyamama; bazen savurgan olabilirsin."),
];

export const FINANCE_TEST: PersonalityTest = {
  id: "finance-money",
  slug: "finans-para",
  title: "Finans ve Para Yönetimi",
  description: "Para ile ilişkin nasıl? Yatırım, birikim ve harcama tarzın ne? Bu test finansal yaklaşımını ortaya çıkarır.",
  duration: "5–6 dk",
  questionCount: 10,
  category: "career",
  image: "/tests/career.png",
  questions: [
    { id: "q1", text: "Para harcarken en çok neye dikkat edersin?", options: [{ id: "a", text: "Fırsat ve değer", scores: el(2,0,0,0) }, { id: "b", text: "Bütçe ve plan", scores: el(0,2,0,0) }, { id: "c", text: "Araştırma ve karşılaştırma", scores: el(0,0,2,0) }, { id: "d", text: "Duygusal değer ve anlam", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Yatırım yaparken yaklaşımın?", options: [{ id: "a", text: "Risk alır, büyük hedef", scores: el(2,0,0,0) }, { id: "b", text: "Güvenli, uzun vadeli", scores: el(0,2,0,0) }, { id: "c", text: "Çeşitli, dengeli portföy", scores: el(0,0,2,0) }, { id: "d", text: "Değer ve güven odaklı", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Birikim yaparken?", options: [{ id: "a", text: "Hedef odaklı, hızlı birikirim", scores: el(0,0,0,2) }, { id: "b", text: "Düzenli, sistematik birikirim", scores: el(0,0,2,0) }, { id: "c", text: "Esnek, ihtiyaca göre", scores: el(0,2,0,0) }, { id: "d", text: "Güvenlik için, aile odaklı", scores: el(2,0,0,0) }] },
    { id: "q4", text: "Büyük bir harcama kararı?", options: [{ id: "a", text: "Hızlı karar, fırsatı kaçırmam", scores: el(2,0,0,0) }, { id: "b", text: "Plan yapar, araştırırım", scores: el(0,2,0,0) }, { id: "c", text: "Karşılaştırır, analiz ederim", scores: el(0,0,2,0) }, { id: "d", text: "Değer ve hislere göre karar", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Borç / kredi hakkında?", options: [{ id: "a", text: "Gerekirse risk alırım", scores: el(2,0,0,0) }, { id: "b", text: "Mümkünse kaçınırım", scores: el(0,2,0,0) }, { id: "c", text: "Mantıklıysa kullanırım", scores: el(0,0,2,0) }, { id: "d", text: "Güvenli ve gerekliyse", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Para kaybı yaşayınca?", options: [{ id: "a", text: "Hemen yeni fırsat ararım", scores: el(0,0,0,2) }, { id: "b", text: "Ders çıkarır, daha temkinli olurum", scores: el(0,0,2,0) }, { id: "c", text: "Analiz eder, strateji değiştiririm", scores: el(0,2,0,0) }, { id: "d", text: "Duygusal olarak etkilenirim", scores: el(2,0,0,0) }] },
    { id: "q7", text: "Para senin için ne ifade eder?", options: [{ id: "a", text: "Özgürlük ve fırsat", scores: el(2,0,0,0) }, { id: "b", text: "Güvenlik ve istikrar", scores: el(0,2,0,0) }, { id: "c", text: "Seçenek ve deneyim", scores: el(0,0,2,0) }, { id: "d", text: "Güven ve huzur", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Bütçe yönetiminde?", options: [{ id: "a", text: "Genel plan, esnek", scores: el(2,0,0,0) }, { id: "b", text: "Detaylı takip, disiplinli", scores: el(0,2,0,0) }, { id: "c", text: "Kategorize, analiz ederim", scores: el(0,0,2,0) }, { id: "d", text: "Temel ihtiyaçlar, duygusal denge", scores: el(0,0,0,2) }] },
    { id: "q9", text: "Para kazanmak için?", options: [{ id: "a", text: "Risk alır, girişimcilik", scores: el(0,0,0,2) }, { id: "b", text: "İstikrarlı gelir, güvenli iş", scores: el(0,0,2,0) }, { id: "c", text: "Çeşitli kaynak, esneklik", scores: el(0,2,0,0) }, { id: "d", text: "Anlamlı iş, değer yaratma", scores: el(2,0,0,0) }] },
    { id: "q10", text: "Finansal hedefin?", options: [{ id: "a", text: "Büyük başarı ve özgürlük", scores: el(2,0,0,0) }, { id: "b", text: "Güvenli emeklilik ve istikrar", scores: el(0,2,0,0) }, { id: "c", text: "Esneklik ve çeşitlilik", scores: el(0,0,2,0) }, { id: "d", text: "Aile güvenliği ve huzur", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: FINANCE_RESULTS,
};

/* ================= TEST 14: EBEVEYNLİK VE AİLE (10 soru) ================= */

const PARENTING_RESULTS: TestResult[] = [
  elementResult("fire", "Enerjik ve Cesaret Veren Ebeveyn", "Ateşin Ebeveynliği", "Ebeveynlikte enerji ve cesaret ön planda. Çocuklarına bağımsızlık ve hedef koymayı öğretirsin. Aktif ve heyecanlı bir ebeveynsin.", ["Enerji", "Cesaret", "Bağımsızlık", "Liderlik", "Motivasyon"], "Sabırsızlık ve aşırı beklenti; bazen sert olabilirsin."),
  elementResult("earth", "Güvenli ve İstikrarlı Ebeveyn", "Toprağın Ebeveynliği", "Ebeveynlikte güvenlik ve düzen önemli. Sınırlar, rutin ve sorumluluk öğretirsin. Güvenilir ve sabırlı bir ebeveynsin.", ["Güvenlik", "Düzen", "Sorumluluk", "Sabır", "İstikrar"], "Aşırı kontrol ve esneklik eksikliği; bazen katı olabilirsin."),
  elementResult("air", "Özgür ve Öğretici Ebeveyn", "Havanın Ebeveynliği", "Ebeveynlikte özgürlük ve öğrenme önemli. Çocuklarına merak ve keşif aşılar, sohbet ve fikir paylaşımı senin tarzın.", ["Özgürlük", "Öğrenme", "İletişim", "Esneklik", "Merak"], "Tutarsızlık ve sınır eksikliği; bazen dağınık olabilirsin."),
  elementResult("water", "Şefkatli ve Duygusal Ebeveyn", "Suyun Ebeveynliği", "Ebeveynlikte sevgi ve duygusal bağ merkezde. Empati ve anlayışla yaklaşırsın; çocuklarının hislerini önemser, derin bağ kurarsın.", ["Şefkat", "Empati", "Duygusal bağ", "Anlayış", "Derinlik"], "Aşırı koruma ve sınır koyamama; bazen duygusal yük taşırsın."),
];

export const PARENTING_TEST: PersonalityTest = {
  id: "parenting-family",
  slug: "ebeveynlik-aile",
  title: "Ebeveynlik ve Aile Yaklaşımın",
  description: "Ebeveyn olarak nasılsın? Aile içi dinamiklerde rolün ne? Bu test ebeveynlik tarzını ve aile enerjini ortaya çıkarır.",
  duration: "5–6 dk",
  questionCount: 10,
  category: "love",
  image: "/tests/love.png",
  questions: [
    { id: "q1", text: "Çocuk yetiştirmede en önemli değer?", options: [{ id: "a", text: "Cesaret ve bağımsızlık", scores: el(2,0,0,0) }, { id: "b", text: "Sorumluluk ve düzen", scores: el(0,2,0,0) }, { id: "c", text: "Özgürlük ve merak", scores: el(0,0,2,0) }, { id: "d", text: "Sevgi ve empati", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Disiplin yaklaşımın?", options: [{ id: "a", text: "Net kurallar, sonuçları hemen", scores: el(2,0,0,0) }, { id: "b", text: "Tutarlı sınırlar, planlı", scores: el(0,2,0,0) }, { id: "c", text: "Açıklama ve mantık", scores: el(0,0,2,0) }, { id: "d", text: "Anlayış ve duygusal bağ", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Çocuğun zorlandığında?", options: [{ id: "a", text: "Cesaret verir, harekete geçiririm", scores: el(0,0,0,2) }, { id: "b", text: "Plan yapar, adım adım ilerletirim", scores: el(0,0,2,0) }, { id: "c", text: "Konuşur, farklı açılar sunarım", scores: el(0,2,0,0) }, { id: "d", text: "Yanında olur, hissederim", scores: el(2,0,0,0) }] },
    { id: "q4", text: "Aile aktivitelerinde?", options: [{ id: "a", text: "Aksiyon ve macera", scores: el(2,0,0,0) }, { id: "b", text: "Planlı ve düzenli", scores: el(0,2,0,0) }, { id: "c", text: "Çeşitli ve eğlenceli", scores: el(0,0,2,0) }, { id: "d", text: "Sakin ve bağ kurucu", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Çocuğunun başarısı için?", options: [{ id: "a", text: "Hedef koyar, motive ederim", scores: el(2,0,0,0) }, { id: "b", text: "Plan yapar, desteklerim", scores: el(0,2,0,0) }, { id: "c", text: "Öğrenmeyi teşvik ederim", scores: el(0,0,2,0) }, { id: "d", text: "Duygusal destek veririm", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Çocuğun hata yapınca?", options: [{ id: "a", text: "Sonuçları gösterir, ders çıkartırım", scores: el(0,0,0,2) }, { id: "b", text: "Kuralları hatırlatır, düzeltirim", scores: el(0,0,2,0) }, { id: "c", text: "Tartışır, alternatif gösteririm", scores: el(0,2,0,0) }, { id: "d", text: "Anlayışla yaklaşır, desteklerim", scores: el(2,0,0,0) }] },
    { id: "q7", text: "Aile içi çatışmada?", options: [{ id: "a", text: "Net çözüm, adil karar", scores: el(2,0,0,0) }, { id: "b", text: "Kurallar ve sınırlar", scores: el(0,2,0,0) }, { id: "c", text: "Konuşma ve uzlaşma", scores: el(0,0,2,0) }, { id: "d", text: "Herkesin hissini dinleme", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Çocuğuna öğretmek istediğin?", options: [{ id: "a", text: "Cesaret ve hedef", scores: el(2,0,0,0) }, { id: "b", text: "Sorumluluk ve düzen", scores: el(0,2,0,0) }, { id: "c", text: "Merak ve öğrenme", scores: el(0,0,2,0) }, { id: "d", text: "Sevgi ve empati", scores: el(0,0,0,2) }] },
    { id: "q9", text: "Aile zamanı senin için?", options: [{ id: "a", text: "Aktif ve heyecanlı", scores: el(0,0,0,2) }, { id: "b", text: "Düzenli ve güvenli", scores: el(0,0,2,0) }, { id: "c", text: "Eğlenceli ve çeşitli", scores: el(0,2,0,0) }, { id: "d", text: "Sakin ve bağ kurucu", scores: el(2,0,0,0) }] },
    { id: "q10", text: "Ebeveynlikte en çok ne seni zorlar?", options: [{ id: "a", text: "Sabır ve yavaş ilerleme", scores: el(2,0,0,0) }, { id: "b", text: "Esneklik ve spontanlık", scores: el(0,2,0,0) }, { id: "c", text: "Rutin ve tekrar", scores: el(0,0,2,0) }, { id: "d", text: "Sınır koyma ve disiplin", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: PARENTING_RESULTS,
};

/* ================= TEST 15: MANEVİYAT VE İÇSEL YOLCULUK (10 soru) ================= */

const SPIRITUALITY_RESULTS: TestResult[] = [
  elementResult("fire", "Aksiyon Odaklı Maneviyat", "Ateşin Yolu", "Maneviyatın aktif ve cesur. Ritüel, pratik ve hedef odaklı yaklaşım senin için. İlham veren liderlik ve dönüşüm enerjisi taşırsın.", ["Cesaret", "Aksiyon", "Liderlik", "Dönüşüm", "İlham"], "Sabırsızlık ve ego; bazen yüzeysel kalabilirsin."),
  elementResult("earth", "Pratik ve Köklü Maneviyat", "Toprağın Yolu", "Maneviyatın somut ve köklü. Ritüel, düzen ve gelenek senin için önemli. Toprakla bağ, doğa ve istikrarlı pratik seni besler.", ["Köklülük", "Düzen", "Somutluk", "Sabır", "İstikrar"], "Katılık ve değişime direnç; bazen dogmatik olabilirsin."),
  elementResult("air", "Felsefi ve Keşfedici Maneviyat", "Havanın Yolu", "Maneviyatın zihinsel ve keşfedici. Felsefe, öğrenme ve çeşitli gelenekler seni çeker. Mantık ve merak rehberindir.", ["Felsefe", "Keşif", "Öğrenme", "Esneklik", "Merak"], "Yüzeysellik ve bağlanma eksikliği; bazen teoride kalabilirsin."),
  elementResult("water", "Sezgisel ve Derin Maneviyat", "Suyun Yolu", "Maneviyatın duygusal ve sezgisel. Meditasyon, rüyalar ve içsel yolculuk senin için merkezde. Derin bağ ve dönüşüm yaşarsın.", ["Sezgi", "Derinlik", "Duygu", "Bağ", "Dönüşüm"], "Aşırı içe dönüklük ve dış dünyadan kopma; bazen tükenebilirsin."),
];

export const SPIRITUALITY_TEST: PersonalityTest = {
  id: "spirituality-journey",
  slug: "maneviyat-yolculuk",
  title: "Maneviyat ve İçsel Yolculuk",
  description: "İçsel yolculuğun nasıl? Maneviyat ve anlam arayışında hangi yaklaşım sana uygun? Bu test manevi enerjini ortaya çıkarır.",
  duration: "5–6 dk",
  questionCount: 10,
  category: "spiritual",
  image: "/tests/aura.png",
  questions: [
    { id: "q1", text: "Maneviyat senin için ne ifade eder?", options: [{ id: "a", text: "Aksiyon ve dönüşüm", scores: el(2,0,0,0) }, { id: "b", text: "Kök ve gelenek", scores: el(0,2,0,0) }, { id: "c", text: "Keşif ve öğrenme", scores: el(0,0,2,0) }, { id: "d", text: "Derin bağ ve sezgi", scores: el(0,0,0,2) }] },
    { id: "q2", text: "İçsel pratiğin nasıl?", options: [{ id: "a", text: "Aktif ritüel ve hedef", scores: el(2,0,0,0) }, { id: "b", text: "Düzenli ve sistematik", scores: el(0,2,0,0) }, { id: "c", text: "Çeşitli ve esnek", scores: el(0,0,2,0) }, { id: "d", text: "Sezgisel ve duygusal", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Ruhsal arayışta ne yaparsın?", options: [{ id: "a", text: "Liderlik eder, ilham veririm", scores: el(0,0,0,2) }, { id: "b", text: "Geleneği takip ederim", scores: el(0,0,2,0) }, { id: "c", text: "Araştırır, öğrenirim", scores: el(0,2,0,0) }, { id: "d", text: "İçime döner, hissederim", scores: el(2,0,0,0) }] },
    { id: "q4", text: "Doğa ile bağın?", options: [{ id: "a", text: "Aktif, spor ve macera", scores: el(2,0,0,0) }, { id: "b", text: "Bahçe, toprak, köklü", scores: el(0,2,0,0) }, { id: "c", text: "Gözlem ve keşif", scores: el(0,0,2,0) }, { id: "d", text: "Derin bağ ve sessizlik", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Meditasyon / dua pratiğin?", options: [{ id: "a", text: "Aktif, hareketli meditasyon", scores: el(2,0,0,0) }, { id: "b", text: "Düzenli, ritüel odaklı", scores: el(0,2,0,0) }, { id: "c", text: "Esnek, çeşitli teknikler", scores: el(0,0,2,0) }, { id: "d", text: "Derin, sessiz ve içsel", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Ruhsal krizde nasıl toparlanırsın?", options: [{ id: "a", text: "Harekete geçer, dönüşüm yaratırım", scores: el(0,0,0,2) }, { id: "b", text: "Rutine döner, köklere bağlanırım", scores: el(0,0,2,0) }, { id: "c", text: "Öğrenir, perspektif değiştiririm", scores: el(0,2,0,0) }, { id: "d", text: "İçime döner, duyguları işlerim", scores: el(2,0,0,0) }] },
    { id: "q7", text: "Maneviyat ve günlük hayat?", options: [{ id: "a", text: "Aksiyonla birleştiririm", scores: el(2,0,0,0) }, { id: "b", text: "Rutin ve ritüelle entegre", scores: el(0,2,0,0) }, { id: "c", text: "Felsefe ve düşünceyle", scores: el(0,0,2,0) }, { id: "d", text: "Duygu ve sezgiyle", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Ruhsal toplulukta rolün?", options: [{ id: "a", text: "Lider ve ilham veren", scores: el(2,0,0,0) }, { id: "b", text: "Güvenilir ve istikrarlı", scores: el(0,2,0,0) }, { id: "c", text: "Öğrenci ve soru soran", scores: el(0,0,2,0) }, { id: "d", text: "Empatik ve bağ kuran", scores: el(0,0,0,2) }] },
    { id: "q9", text: "İçsel yolculukta hedefin?", options: [{ id: "a", text: "Dönüşüm ve liderlik", scores: el(0,0,0,2) }, { id: "b", text: "Kök ve istikrar", scores: el(0,0,2,0) }, { id: "c", text: "Keşif ve öğrenme", scores: el(0,2,0,0) }, { id: "d", text: "Derinlik ve bağ", scores: el(2,0,0,0) }] },
    { id: "q10", text: "Maneviyat seni nasıl değiştirdi?", options: [{ id: "a", text: "Daha cesur ve lider oldum", scores: el(2,0,0,0) }, { id: "b", text: "Daha köklü ve güvenli", scores: el(0,2,0,0) }, { id: "c", text: "Daha meraklı ve esnek", scores: el(0,0,2,0) }, { id: "d", text: "Daha derin ve bağlı", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: SPIRITUALITY_RESULTS,
};

/* ================= TEST 16: KARİYER YOLUN (10 soru) ================= */

const CAREER_PATH_RESULTS: TestResult[] = [
  elementResult("fire", "Girişimci ve Lider Yol", "Ateşin Kariyeri", "Kariyerinde liderlik ve girişimcilik ön planda. Kendi işin veya yönetim pozisyonları sana uygun. Hızlı ilerleme ve görünürlük seni motive eder.", ["Liderlik", "Girişimcilik", "Cesaret", "Hız", "Başarı"], "Sabırsızlık ve aşırı risk; detayları atlayabilirsin."),
  elementResult("earth", "İstikrarlı ve Güvenli Yol", "Toprağın Kariyeri", "Kariyerinde güvenlik ve istikrar önemli. Uzun vadeli planlama ve adım adım ilerleme senin tarzın. Finans, operasyon veya proje yönetimi sana uygun.", ["İstikrar", "Planlama", "Güvenilirlik", "Disiplin", "Uzun vadeli düşünce"], "Değişime direnç ve fırsat kaçırma; bazen yavaş ilerleyebilirsin."),
  elementResult("air", "Yenilikçi ve Esnek Yol", "Havanın Kariyeri", "Kariyerinde öğrenme ve çeşitlilik önemli. Teknoloji, pazarlama, eğitim veya danışmanlık sana yakın. Esnek ve dinamik ortamlar seni besler.", ["Yenilik", "Öğrenme", "Esneklik", "İletişim", "Çeşitlilik"], "Kararsızlık ve köksüzlük; bazen odaklanma zorluğu."),
  elementResult("water", "Anlamlı ve İnsan Odaklı Yol", "Suyun Kariyeri", "Kariyerinde anlam ve insanlara dokunmak önemli. Psikoloji, sağlık, sanat veya hizmet sektörü sana uygun. Duygusal tatmin ve derinlik seni mutlu eder.", ["Anlam", "Empati", "Yaratıcılık", "İnsan odaklılık", "Derinlik"], "Sınır koyamama ve tükenme; bazen duygusal yük ağır gelebilir."),
];

export const CAREER_PATH_TEST: PersonalityTest = {
  id: "career-path",
  slug: "kariyer-yolu",
  title: "Kariyer Yolun",
  description: "Kariyerinde hangi yol sana uygun? Hedeflerin ve yaklaşımın nasıl? Bu test kariyer yolunu ve profesyonel enerjini ortaya çıkarır.",
  duration: "5–6 dk",
  questionCount: 10,
  category: "career",
  image: "/tests/career.png",
  questions: [
    { id: "q1", text: "Kariyerinde en çok ne seni motive eder?", options: [{ id: "a", text: "Liderlik ve başarı", scores: el(2,0,0,0) }, { id: "b", text: "Güvenlik ve istikrar", scores: el(0,2,0,0) }, { id: "c", text: "Öğrenme ve yenilik", scores: el(0,0,2,0) }, { id: "d", text: "Anlam ve insanlara dokunmak", scores: el(0,0,0,2) }] },
    { id: "q2", text: "İdeal iş ortamın nasıl olur?", options: [{ id: "a", text: "Rekabetçi, hızlı, hedef odaklı", scores: el(2,0,0,0) }, { id: "b", text: "Düzenli, güvenli, planlı", scores: el(0,2,0,0) }, { id: "c", text: "Esnek, yaratıcı, çeşitli", scores: el(0,0,2,0) }, { id: "d", text: "İşbirlikçi, anlamlı, destekleyici", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Kariyer hedefin nedir?", options: [{ id: "a", text: "CEO, girişimci veya üst yönetim", scores: el(0,0,0,2) }, { id: "b", text: "Uzman, müdür veya güvenli pozisyon", scores: el(0,0,2,0) }, { id: "c", text: "Serbest çalışan veya çeşitli projeler", scores: el(0,2,0,0) }, { id: "d", text: "Anlamlı iş, danışman veya mentor", scores: el(2,0,0,0) }] },
    { id: "q4", text: "İş değiştirme kararı?", options: [{ id: "a", text: "Daha iyi fırsat varsa cesurca geçerim", scores: el(2,0,0,0) }, { id: "b", text: "Güvenli geçiş, net koşullar", scores: el(0,2,0,0) }, { id: "c", text: "Yeni deneyim, merak", scores: el(0,0,2,0) }, { id: "d", text: "Değer ve anlam uyumu", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Başarısızlık sonrası?", options: [{ id: "a", text: "Hemen yeni hedefe geçerim", scores: el(2,0,0,0) }, { id: "b", text: "Ders çıkarır, planı revize ederim", scores: el(0,2,0,0) }, { id: "c", text: "Analiz eder, farklı denerim", scores: el(0,0,2,0) }, { id: "d", text: "Duygusal toparlanır, tekrar denerim", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Terfi / fırsat geldiğinde?", options: [{ id: "a", text: "Hemen kapar, risk alırım", scores: el(0,0,0,2) }, { id: "b", text: "Artıları eksileri değerlendiririm", scores: el(0,0,2,0) }, { id: "c", text: "Yeni deneyim olarak görürüm", scores: el(0,2,0,0) }, { id: "d", text: "Ekip ve ortam uyumuna bakarım", scores: el(2,0,0,0) }] },
    { id: "q7", text: "Kariyerinde en çok ne seni zorlar?", options: [{ id: "a", text: "Yavaş ilerleme ve rutin", scores: el(2,0,0,0) }, { id: "b", text: "Belirsizlik ve değişim", scores: el(0,2,0,0) }, { id: "c", text: "Tekrarlayan görevler", scores: el(0,0,2,0) }, { id: "d", text: "Duygusuz ortam ve rekabet", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Networking / çevre yapma?", options: [{ id: "a", text: "Aktif, liderlik ederim", scores: el(2,0,0,0) }, { id: "b", text: "Seçici, güvenilir bağlar", scores: el(0,2,0,0) }, { id: "c", text: "Geniş çevre, çeşitli insanlar", scores: el(0,0,2,0) }, { id: "d", text: "Derin bağlar, samimi ilişkiler", scores: el(0,0,0,2) }] },
    { id: "q9", text: "Kariyerinde en çok ne seni mutlu eder?", options: [{ id: "a", text: "Başarı ve tanınma", scores: el(0,0,0,2) }, { id: "b", text: "Güvenli gelir ve istikrar", scores: el(0,0,2,0) }, { id: "c", text: "Öğrenme ve çeşitlilik", scores: el(0,2,0,0) }, { id: "d", text: "Anlamlı katkı ve bağ", scores: el(2,0,0,0) }] },
    { id: "q10", text: "Emeklilikte nasıl hatırlanmak istersin?", options: [{ id: "a", text: "Lider ve başarılı", scores: el(2,0,0,0) }, { id: "b", text: "Güvenilir ve istikrarlı", scores: el(0,2,0,0) }, { id: "c", text: "Yenilikçi ve öğretici", scores: el(0,0,2,0) }, { id: "d", text: "İnsanlara dokunan ve anlamlı", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: CAREER_PATH_RESULTS,
};

/* ================= TEST 17: LİDERLİK STİLİN (10 soru) ================= */

const LEADERSHIP_RESULTS: TestResult[] = [
  elementResult("fire", "Vizyoner ve Kararlı Lider", "Ateşin Liderliği", "Liderlik tarzın cesur ve ilham verici. Hızlı karar verir, hedefe odaklanırsın. Takımı motive eder ve sonuç odaklısın.", ["Vizyon", "Cesaret", "Kararlılık", "Motivasyon", "Hız"], "Sabırsızlık ve otoriterlik; dinlemeyi unutabilirsin."),
  elementResult("earth", "Güvenilir ve Planlı Lider", "Toprağın Liderliği", "Liderlik tarzın sistematik ve güvenilir. Plan yapar, adım adım ilerlersin. Takımına güven verir ve istikrar sağlarsın.", ["Planlama", "Güvenilirlik", "Disiplin", "Sabır", "İstikrar"], "Esneklik eksikliği ve değişime direnç; bazen katı olabilirsin."),
  elementResult("air", "İletişimci ve Demokratik Lider", "Havanın Liderliği", "Liderlik tarzın iletişim odaklı ve katılımcı. Fikirleri dinler, uzlaşma ararsın. Yenilikçi çözümler ve esneklik senin güçlü yanların.", ["İletişim", "Demokrasi", "Yenilik", "Esneklik", "Analiz"], "Kararsızlık ve netlik eksikliği; bazen yönlendirme zayıf kalabilir."),
  elementResult("water", "Empatik ve Destekleyici Lider", "Suyun Liderliği", "Liderlik tarzın empatik ve destekleyici. Takımın duygusal ihtiyaçlarını önemser, uyum sağlarsın. İşbirliği ve bağ kurma senin gücün.", ["Empati", "Destek", "İşbirliği", "Uyum", "Derinlik"], "Sınır koyamama ve karar verme zorluğu; bazen çok yumuşak olabilirsin."),
];

export const LEADERSHIP_TEST: PersonalityTest = {
  id: "leadership-style",
  slug: "liderlik-stili",
  title: "Liderlik Stilinin",
  description: "Nasıl bir lidersin? Takımı nasıl yönetiyorsun? Bu test liderlik tarzını ve yönetim enerjini ortaya çıkarır.",
  duration: "5–6 dk",
  questionCount: 10,
  category: "career",
  image: "/tests/career.png",
  questions: [
    { id: "q1", text: "Takımı yönetirken önceliğin?", options: [{ id: "a", text: "Hedefe ulaşmak ve sonuç", scores: el(2,0,0,0) }, { id: "b", text: "Plan ve süreç", scores: el(0,2,0,0) }, { id: "c", text: "Fikir alışverişi ve uzlaşma", scores: el(0,0,2,0) }, { id: "d", text: "Takım uyumu ve destek", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Karar verirken yaklaşımın?", options: [{ id: "a", text: "Hızlı ve net karar veririm", scores: el(2,0,0,0) }, { id: "b", text: "Veri toplar, planlı karar veririm", scores: el(0,2,0,0) }, { id: "c", text: "Herkesi dinler, ortak karar", scores: el(0,0,2,0) }, { id: "d", text: "Hisleri ve değerleri dikkate alırım", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Takım üyesi hata yapınca?", options: [{ id: "a", text: "Sonucu gösterir, düzeltmesini isterim", scores: el(0,0,0,2) }, { id: "b", text: "Süreci analiz eder, düzeltirim", scores: el(0,0,2,0) }, { id: "c", text: "Tartışır, alternatif gösteririm", scores: el(0,2,0,0) }, { id: "d", text: "Anlayışla yaklaşır, desteklerim", scores: el(2,0,0,0) }] },
    { id: "q4", text: "Takımı motive ederken?", options: [{ id: "a", text: "Hedef ve başarı vurgusu", scores: el(2,0,0,0) }, { id: "b", text: "Plan ve güvenlik", scores: el(0,2,0,0) }, { id: "c", text: "Fikir ve öğrenme", scores: el(0,0,2,0) }, { id: "d", text: "Değer ve anlam", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Çatışma çözümünde?", options: [{ id: "a", text: "Net karar, sonuç odaklı", scores: el(2,0,0,0) }, { id: "b", text: "Kurallar ve prosedür", scores: el(0,2,0,0) }, { id: "c", text: "Uzlaşma ve alternatif", scores: el(0,0,2,0) }, { id: "d", text: "Herkesin hissini dinleme", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Delegasyon yaparken?", options: [{ id: "a", text: "Sonucu takip ederim", scores: el(0,0,0,2) }, { id: "b", text: "Süreci ve adımları belirlerim", scores: el(0,0,2,0) }, { id: "c", text: "Esnek bırakır, desteklerim", scores: el(0,2,0,0) }, { id: "d", text: "Güven verir, yanında olurum", scores: el(2,0,0,0) }] },
    { id: "q7", text: "Takım toplantısında?", options: [{ id: "a", text: "Agenda yönetir, sonuç alırım", scores: el(2,0,0,0) }, { id: "b", text: "Plan sunar, takip ederim", scores: el(0,2,0,0) }, { id: "c", text: "Fikir toplar, tartıştırırım", scores: el(0,0,2,0) }, { id: "d", text: "Herkesi dinler, uyum sağlarım", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Takım üyesi zorlandığında?", options: [{ id: "a", text: "Hedefi hatırlatır, motive ederim", scores: el(2,0,0,0) }, { id: "b", text: "Plan yapar, adım adım ilerletirim", scores: el(0,2,0,0) }, { id: "c", text: "Alternatif gösterir, desteklerim", scores: el(0,0,2,0) }, { id: "d", text: "Yanında olur, duygusal destek veririm", scores: el(0,0,0,2) }] },
    { id: "q9", text: "Liderlikte en güçlü yönün?", options: [{ id: "a", text: "Vizyon ve cesaret", scores: el(0,0,0,2) }, { id: "b", text: "Planlama ve güvenilirlik", scores: el(0,0,2,0) }, { id: "c", text: "İletişim ve yenilik", scores: el(0,2,0,0) }, { id: "d", text: "Empati ve uyum", scores: el(2,0,0,0) }] },
    { id: "q10", text: "Liderlikte geliştirmek istediğin?", options: [{ id: "a", text: "Dinleme ve sabır", scores: el(2,0,0,0) }, { id: "b", text: "Esneklik ve risk", scores: el(0,2,0,0) }, { id: "c", text: "Kararlılık ve netlik", scores: el(0,0,2,0) }, { id: "d", text: "Sınır ve kararlılık", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: LEADERSHIP_RESULTS,
};

/* ================= TEST 18: ÇALIŞMA TARZI (10 soru) ================= */

const WORK_STYLE_RESULTS: TestResult[] = [
  elementResult("fire", "Hızlı ve Sonuç Odaklı", "Ateşin Çalışması", "Çalışma tarzın hızlı ve hedef odaklı. Çoklu görev yapabilirsin; sonuç önemli. Rekabetçi ortamlar seni besler.", ["Hız", "Sonuç", "Çoklu görev", "Rekabet", "Enerji"], "Detayları atlama ve sabırsızlık; bazen hata yapabilirsin."),
  elementResult("earth", "Planlı ve Düzenli", "Toprağın Çalışması", "Çalışma tarzın sistematik ve düzenli. Tek seferde bir işe odaklanırsın; kalite önemli. Rutin ve plan seni rahatlatır.", ["Planlama", "Düzen", "Kalite", "Odak", "İstikrar"], "Esneklik eksikliği ve yavaşlık; bazen değişime direnç."),
  elementResult("air", "Esnek ve Çok Yönlü", "Havanın Çalışması", "Çalışma tarzın esnek ve çeşitli. Birden fazla projeyle çalışabilirsin; yenilik seni besler. Rutin seni sıkar.", ["Esneklik", "Çeşitlilik", "Yenilik", "Uyum", "Çoklu proje"], "Dağınıklık ve tamamlama zorluğu; bazen odaklanma eksikliği."),
  elementResult("water", "Derinlemesine ve Duygusal", "Suyun Çalışması", "Çalışma tarzın derinlemesine ve duygusal. Tek bir konuya odaklanırsın; anlam önemli. Sakin ortam seni besler.", ["Derinlik", "Odak", "Anlam", "Duygusal bağ", "Sakinlik"], "Yavaşlık ve aşırı hassasiyet; bazen dış dünyadan kopma."),
];

export const WORK_STYLE_TEST: PersonalityTest = {
  id: "work-style",
  slug: "calisma-tarzi",
  title: "Çalışma Tarzın",
  description: "İş ortamında nasıl çalışıyorsun? Hangi yaklaşım sana uygun? Bu test çalışma tarzını ve iş enerjini ortaya çıkarır.",
  duration: "5–6 dk",
  questionCount: 10,
  category: "career",
  image: "/tests/career.png",
  questions: [
    { id: "q1", text: "İşe başlarken nasıl yaklaşırsın?", options: [{ id: "a", text: "Hemen başlar, hızlı ilerlerim", scores: el(2,0,0,0) }, { id: "b", text: "Plan yapar, adım adım ilerlerim", scores: el(0,2,0,0) }, { id: "c", text: "Fikirleri toplar, esnek çalışırım", scores: el(0,0,2,0) }, { id: "d", text: "Derinlemesine anlar, sonra başlarım", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Birden fazla proje arasında?", options: [{ id: "a", text: "Rahatım, hızlı geçiş yaparım", scores: el(2,0,0,0) }, { id: "b", text: "Tek seferde birine odaklanırım", scores: el(0,2,0,0) }, { id: "c", text: "Esnek, ihtiyaca göre", scores: el(0,0,2,0) }, { id: "d", text: "Zorlanırım, tek proje tercih", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Deadline yaklaşınca?", options: [{ id: "a", text: "Son anda enerji patlaması", scores: el(0,0,0,2) }, { id: "b", text: "Planlı, zamanında bitiririm", scores: el(0,0,2,0) }, { id: "c", text: "Odaklanır, esnek çalışırım", scores: el(0,2,0,0) }, { id: "d", text: "Streslenirim ama tamamlarım", scores: el(2,0,0,0) }] },
    { id: "q4", text: "Rutin görevlerde?", options: [{ id: "a", text: "Sıkılırım, hızlı bitirmek isterim", scores: el(2,0,0,0) }, { id: "b", text: "Rahatım, düzen severim", scores: el(0,2,0,0) }, { id: "c", text: "Otomatikleştirir, optimize ederim", scores: el(0,0,2,0) }, { id: "d", text: "Derinlemesine yapar, anlam ararım", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Yeni bir şey öğrenirken?", options: [{ id: "a", text: "Hemen uygular, deneyerek öğrenirim", scores: el(2,0,0,0) }, { id: "b", text: "Sistematik öğrenir, adım adım", scores: el(0,2,0,0) }, { id: "c", text: "Araştırır, farklı kaynaklardan", scores: el(0,0,2,0) }, { id: "d", text: "Derinlemesine anlar, içselleştiririm", scores: el(0,0,0,2) }] },
    { id: "q6", text: "İş ortamında en çok ne seni yorar?", options: [{ id: "a", text: "Yavaşlık ve rutin", scores: el(0,0,0,2) }, { id: "b", text: "Dağınıklık ve belirsizlik", scores: el(0,0,2,0) }, { id: "c", text: "Tekrar ve sıkıcılık", scores: el(0,2,0,0) }, { id: "d", text: "Rekabet ve duygusuzluk", scores: el(2,0,0,0) }] },
    { id: "q7", text: "Takım çalışmasında rolün?", options: [{ id: "a", text: "Lider, yönlendirici", scores: el(2,0,0,0) }, { id: "b", text: "Organize eden, takip eden", scores: el(0,2,0,0) }, { id: "c", text: "Fikir üreten, koordine eden", scores: el(0,0,2,0) }, { id: "d", text: "Uyum sağlayan, destekleyen", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Hata yapınca?", options: [{ id: "a", text: "Hemen düzeltir, devam ederim", scores: el(2,0,0,0) }, { id: "b", text: "Analiz eder, tekrar etmem", scores: el(0,2,0,0) }, { id: "c", text: "Öğrenir, alternatif denerim", scores: el(0,0,2,0) }, { id: "d", text: "İçselleştirir, dikkatli olurum", scores: el(0,0,0,2) }] },
    { id: "q9", text: "En verimli çalışma zamanın?", options: [{ id: "a", text: "Sabah erken, enerji dolu", scores: el(0,0,0,2) }, { id: "b", text: "Sabah, düzenli saatler", scores: el(0,0,2,0) }, { id: "c", text: "Esnek, ihtiyaca göre", scores: el(0,2,0,0) }, { id: "d", text: "Sakin saatler, derin odak", scores: el(2,0,0,0) }] },
    { id: "q10", text: "İşte en çok ne seni mutlu eder?", options: [{ id: "a", text: "Başarı ve sonuç", scores: el(2,0,0,0) }, { id: "b", text: "Düzen ve kalite", scores: el(0,2,0,0) }, { id: "c", text: "Yenilik ve öğrenme", scores: el(0,0,2,0) }, { id: "d", text: "Anlam ve bağ", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: WORK_STYLE_RESULTS,
};

/* ================= TEST 19: İŞ DEĞERLERİN (10 soru) ================= */

const WORK_VALUES_RESULTS: TestResult[] = [
  elementResult("fire", "Başarı ve Özgürlük Odaklı", "Ateşin Değerleri", "İşte başarı, tanınma ve özgürlük senin için önemli. Liderlik, rekabet ve hedef odaklılık seni motive eder.", ["Başarı", "Özgürlük", "Liderlik", "Rekabet", "Hedef"], "Ego ve sabırsızlık; bazen başkalarını göz ardı edebilirsin."),
  elementResult("earth", "Güvenlik ve İstikrar Odaklı", "Toprağın Değerleri", "İşte güvenlik, istikrar ve güvenilirlik senin için önemli. Uzun vadeli plan, sadakat ve sorumluluk seni mutlu eder.", ["Güvenlik", "İstikrar", "Sadakat", "Sorumluluk", "Plan"], "Değişime direnç ve riskten kaçınma; bazen kısıtlayıcı olabilirsin."),
  elementResult("air", "Öğrenme ve Özgürlük Odaklı", "Havanın Değerleri", "İşte öğrenme, özgürlük ve yenilik senin için önemli. Çeşitlilik, esneklik ve zihinsel tatmin seni besler.", ["Öğrenme", "Özgürlük", "Yenilik", "Esneklik", "Çeşitlilik"], "Kararsızlık ve bağlanma korkusu; bazen köksüz olabilirsin."),
  elementResult("water", "Anlam ve Bağ Odaklı", "Suyun Değerleri", "İşte anlam, bağ ve duygusal tatmin senin için önemli. İnsanlara dokunmak, yaratıcılık ve uyum seni mutlu eder.", ["Anlam", "Bağ", "Empati", "Yaratıcılık", "Uyum"], "Sınır koyamama ve duygusal yük; bazen tükenebilirsin."),
];

export const WORK_VALUES_TEST: PersonalityTest = {
  id: "work-values",
  slug: "is-degerleri",
  title: "İş Değerlerin",
  description: "İşte senin için ne önemli? Hangi değerler seni motive ediyor? Bu test iş değerlerini ve motivasyon kaynaklarını ortaya çıkarır.",
  duration: "5–6 dk",
  questionCount: 10,
  category: "career",
  image: "/tests/career.png",
  questions: [
    { id: "q1", text: "İşte en önemli değerin?", options: [{ id: "a", text: "Başarı ve tanınma", scores: el(2,0,0,0) }, { id: "b", text: "Güvenlik ve istikrar", scores: el(0,2,0,0) }, { id: "c", text: "Öğrenme ve özgürlük", scores: el(0,0,2,0) }, { id: "d", text: "Anlam ve bağ", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Para senin için ne ifade eder?", options: [{ id: "a", text: "Başarı ve özgürlük", scores: el(2,0,0,0) }, { id: "b", text: "Güvenlik ve rahatlık", scores: el(0,2,0,0) }, { id: "c", text: "Seçenek ve deneyim", scores: el(0,0,2,0) }, { id: "d", text: "Güven ve huzur", scores: el(0,0,0,2) }] },
    { id: "q3", text: "İş değiştirme nedenin?", options: [{ id: "a", text: "Daha iyi fırsat ve başarı", scores: el(0,0,0,2) }, { id: "b", text: "Güvenlik ve istikrar eksikliği", scores: el(0,0,2,0) }, { id: "c", text: "Sıkıcılık ve öğrenme eksikliği", scores: el(0,2,0,0) }, { id: "d", text: "Anlam ve değer uyumsuzluğu", scores: el(2,0,0,0) }] },
    { id: "q4", text: "İşte en çok ne seni mutsuz eder?", options: [{ id: "a", text: "Yavaş ilerleme ve rutin", scores: el(2,0,0,0) }, { id: "b", text: "Belirsizlik ve güvensizlik", scores: el(0,2,0,0) }, { id: "c", text: "Tekrar ve sıkıcılık", scores: el(0,0,2,0) }, { id: "d", text: "Duygusuzluk ve anlamsızlık", scores: el(0,0,0,2) }] },
    { id: "q5", text: "İdeal iş ortamı?", options: [{ id: "a", text: "Rekabetçi, hızlı, başarı odaklı", scores: el(2,0,0,0) }, { id: "b", text: "Düzenli, güvenli, planlı", scores: el(0,2,0,0) }, { id: "c", text: "Yenilikçi, esnek, öğrenme odaklı", scores: el(0,0,2,0) }, { id: "d", text: "Anlamlı, destekleyici, uyumlu", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Terfi için ne önemli?", options: [{ id: "a", text: "Başarı ve sonuçlar", scores: el(0,0,0,2) }, { id: "b", text: "Sadakat ve güvenilirlik", scores: el(0,0,2,0) }, { id: "c", text: "Yenilik ve katkı", scores: el(0,2,0,0) }, { id: "d", text: "Takım uyumu ve destek", scores: el(2,0,0,0) }] },
    { id: "q7", text: "İş-yaşam dengesinde?", options: [{ id: "a", text: "İş öncelikli, hedef odaklı", scores: el(2,0,0,0) }, { id: "b", text: "Dengeli, planlı", scores: el(0,2,0,0) }, { id: "c", text: "Esnek, ihtiyaca göre", scores: el(0,0,2,0) }, { id: "d", text: "Anlamlı denge, duygusal tatmin", scores: el(0,0,0,2) }] },
    { id: "q8", text: "İşte en çok ne seni motive eder?", options: [{ id: "a", text: "Hedef ve başarı", scores: el(2,0,0,0) }, { id: "b", text: "Güvenlik ve plan", scores: el(0,2,0,0) }, { id: "c", text: "Yenilik ve öğrenme", scores: el(0,0,2,0) }, { id: "d", text: "Anlam ve bağ", scores: el(0,0,0,2) }] },
    { id: "q9", text: "İş arkadaşlarıyla ilişkin?", options: [{ id: "a", text: "Rekabetçi ama saygılı", scores: el(0,0,0,2) }, { id: "b", text: "Güvenilir ve istikrarlı", scores: el(0,0,2,0) }, { id: "c", text: "Sosyal ve eğlenceli", scores: el(0,2,0,0) }, { id: "d", text: "Samimi ve destekleyici", scores: el(2,0,0,0) }] },
    { id: "q10", text: "İşte vazgeçemeyeceğin şey?", options: [{ id: "a", text: "Özgürlük ve başarı", scores: el(2,0,0,0) }, { id: "b", text: "Güvenlik ve istikrar", scores: el(0,2,0,0) }, { id: "c", text: "Öğrenme ve esneklik", scores: el(0,0,2,0) }, { id: "d", text: "Anlam ve bağ", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: WORK_VALUES_RESULTS,
};

/* ================= TEST 20: MESLEK UYUMLULUĞU (10 soru) ================= */

const CAREER_MATCH_RESULTS: TestResult[] = [
  elementResult("fire", "Liderlik ve Girişimcilik Meslekleri", "Ateşin Meslekleri", "Senin için uygun meslekler: CEO, girişimci, satış müdürü, spor antrenörü, asker, polis, itfaiyeci, avukat (dava), yönetim danışmanı. Liderlik ve aksiyon gerektiren alanlar sana yakın.", ["Liderlik", "Girişimcilik", "Rekabet", "Aksiyon", "Cesaret"], "Sabırsızlık ve detay eksikliği; rutin meslekler seni sıkar."),
  elementResult("earth", "İstikrar ve Uzmanlık Meslekleri", "Toprağın Meslekleri", "Senin için uygun meslekler: Muhasebeci, finans uzmanı, mimar, mühendis, doktor, hemşire, eczacı, proje yöneticisi, operasyon müdürü. Güvenilirlik ve uzmanlık gerektiren alanlar sana uygun.", ["Uzmanlık", "Güvenilirlik", "Planlama", "Disiplin", "İstikrar"], "Değişime direnç ve esneklik eksikliği; yenilikçi meslekler zorlayabilir."),
  elementResult("air", "İletişim ve Yenilik Meslekleri", "Havanın Meslekleri", "Senin için uygun meslekler: Gazeteci, yazar, pazarlamacı, eğitmen, danışman, yazılım geliştirici, tasarımcı, iletişim uzmanı, araştırmacı. İletişim ve yenilik gerektiren alanlar sana yakın.", ["İletişim", "Yenilik", "Öğrenme", "Esneklik", "Yaratıcılık"], "Kararsızlık ve odaklanma zorluğu; tekrarlayan meslekler seni sıkar."),
  elementResult("water", "İnsan ve Sanat Meslekleri", "Suyun Meslekleri", "Senin için uygun meslekler: Psikolog, terapist, hemşire, öğretmen, sanatçı, müzisyen, yazar, sosyal hizmet uzmanı, koç, mentor. İnsanlara dokunan ve anlamlı meslekler sana uygun.", ["Empati", "Yaratıcılık", "Anlam", "İnsan odaklılık", "Derinlik"], "Sınır koyamama ve tükenme riski; rekabetçi meslekler zorlayabilir."),
];

export const CAREER_MATCH_TEST: PersonalityTest = {
  id: "career-match",
  slug: "meslek-uyumlulugu",
  title: "Meslek Uyumluluğun",
  description: "Hangi meslekler sana uygun? Kariyer yolunda hangi alanlar senin için ideal? Bu test meslek uyumluluğunu ve kariyer potansiyelini ortaya çıkarır.",
  duration: "5–6 dk",
  questionCount: 10,
  category: "career",
  image: "/tests/career.png",
  questions: [
    { id: "q1", text: "En çok hangi tür işler ilgini çeker?", options: [{ id: "a", text: "Liderlik ve yönetim", scores: el(2,0,0,0) }, { id: "b", text: "Uzmanlık ve teknik", scores: el(0,2,0,0) }, { id: "c", text: "İletişim ve yenilik", scores: el(0,0,2,0) }, { id: "d", text: "İnsanlara yardım ve sanat", scores: el(0,0,0,2) }] },
    { id: "q2", text: "İdeal meslekte ne olmalı?", options: [{ id: "a", text: "Başarı ve görünürlük", scores: el(2,0,0,0) }, { id: "b", text: "Güvenlik ve istikrar", scores: el(0,2,0,0) }, { id: "c", text: "Öğrenme ve çeşitlilik", scores: el(0,0,2,0) }, { id: "d", text: "Anlam ve insanlara dokunmak", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Hangi ortamda çalışmak istersin?", options: [{ id: "a", text: "Rekabetçi, hızlı, dinamik", scores: el(0,0,0,2) }, { id: "b", text: "Düzenli, güvenli, planlı", scores: el(0,0,2,0) }, { id: "c", text: "Yenilikçi, esnek, çeşitli", scores: el(0,2,0,0) }, { id: "d", text: "Destekleyici, anlamlı, uyumlu", scores: el(2,0,0,0) }] },
    { id: "q4", text: "Meslek seçerken önceliğin?", options: [{ id: "a", text: "Kazanç ve başarı potansiyeli", scores: el(2,0,0,0) }, { id: "b", text: "Güvenli gelir ve istikrar", scores: el(0,2,0,0) }, { id: "c", text: "Öğrenme ve gelişim fırsatı", scores: el(0,0,2,0) }, { id: "d", text: "Anlam ve değer uyumu", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Hangi alanda kendini güçlü hissedersin?", options: [{ id: "a", text: "Liderlik ve karar verme", scores: el(2,0,0,0) }, { id: "b", text: "Planlama ve organizasyon", scores: el(0,2,0,0) }, { id: "c", text: "Fikir üretme ve iletişim", scores: el(0,0,2,0) }, { id: "d", text: "Empati ve yaratıcılık", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Meslekte en çok ne seni yorar?", options: [{ id: "a", text: "Rutin ve yavaş ilerleme", scores: el(0,0,0,2) }, { id: "b", text: "Belirsizlik ve değişim", scores: el(0,0,2,0) }, { id: "c", text: "Tekrar ve sıkıcılık", scores: el(0,2,0,0) }, { id: "d", text: "Duygusuzluk ve rekabet", scores: el(2,0,0,0) }] },
    { id: "q7", text: "Meslek değiştirme konusunda?", options: [{ id: "a", text: "Açığım, yeni fırsatlar ararım", scores: el(2,0,0,0) }, { id: "b", text: "Temkinli, güvenli geçiş", scores: el(0,2,0,0) }, { id: "c", text: "Meraklı, denemeye açığım", scores: el(0,0,2,0) }, { id: "d", text: "Anlam varsa değiştirebilirim", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Meslekte en çok ne seni mutlu eder?", options: [{ id: "a", text: "Başarı ve tanınma", scores: el(2,0,0,0) }, { id: "b", text: "Güvenlik ve düzen", scores: el(0,2,0,0) }, { id: "c", text: "Yenilik ve öğrenme", scores: el(0,0,2,0) }, { id: "d", text: "İnsanlara yardım ve anlam", scores: el(0,0,0,2) }] },
    { id: "q9", text: "Meslek seçiminde kimin fikri önemli?", options: [{ id: "a", text: "Kendi kararım", scores: el(0,0,0,2) }, { id: "b", text: "Aile ve güvenilir danışmanlar", scores: el(0,0,2,0) }, { id: "c", text: "Çeşitli kaynaklar ve araştırma", scores: el(0,2,0,0) }, { id: "d", text: "İç sesim ve değerlerim", scores: el(2,0,0,0) }] },
    { id: "q10", text: "İdeal meslekte nasıl birisin?", options: [{ id: "a", text: "Lider ve başarılı", scores: el(2,0,0,0) }, { id: "b", text: "Uzman ve güvenilir", scores: el(0,2,0,0) }, { id: "c", text: "Yenilikçi ve öğretici", scores: el(0,0,2,0) }, { id: "d", text: "Anlamlı ve destekleyici", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: CAREER_MATCH_RESULTS,
};

/* ================= EXPORT ALL (20 TEST) ================= */

export const TESTS: PersonalityTest[] = [
  ELEMENT_DISCOVERY_TEST,
  LOVE_STYLE_TEST,
  COMMUNICATION_TEST,
  CAREER_TEST,
  STRESS_TEST,
  DECISION_TEST,
  SOCIAL_TEST,
  SHADOW_TEST,
  PRIORITY_TEST,
  COMPATIBILITY_TEST,
  CREATIVITY_TEST,
  HEALTH_TEST,
  FINANCE_TEST,
  PARENTING_TEST,
  SPIRITUALITY_TEST,
  CAREER_PATH_TEST,
  LEADERSHIP_TEST,
  WORK_STYLE_TEST,
  WORK_VALUES_TEST,
  CAREER_MATCH_TEST,
];

/** Used by admin dashboard for quick link to a sample test. */
export const SAMPLE_TEST: PersonalityTest = ELEMENT_DISCOVERY_TEST;
