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
    ["Empati", "Sezgi", "Hayal Gücü", "Bağlılık", "Derinlik"],
    "Aşırı hassasiyet veya sınır koymakta zorlanma; geçmişe takılma riski.",
    {
      behaviorTendency: "Empati ve sezgi bu profilde sıklıkla öne çıkar. Derin bağlar ve anlam arayışı görülebilir.",
      stressResponse: "Stres altında içe dönme veya duyguları işleme eğilimi gözlenebilir.",
      strength: "Empati, ilham ve bağlılık güçlü yanlar arasında sayılabilir.",
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
  elementResult("air", "Fikir ve İletişim İnsanı", "Havanın Kariyeri", "Özgünlük, iletişim ve analiz gücün yüksek. Pazarlama, medya, eğitim veya danışmanlık sana yakın. Esnek ve öğrenmeye açık ortamlar seni mutlu eder.", ["Özgünlük", "İletişim", "Analiz", "Uyum", "Öğrenme"], "Detay ve takip konusunda dağınıklık; kararsızlık."),
  elementResult("water", "İnsan Odaklı ve Vizyoner", "Suyun Kariyeri", "İnsanlara dokunan işler senin için anlamlı. Psikoloji, sanat, sağlık veya hizmet sektörü uygun. Anlam ve duygusal tatmin önemli.", ["Empati", "İlham", "Sezgi", "İşbirliği", "Anlam"], "Sınır koyamama ve duygusal yük; tükenebilirsin."),
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
    { id: "q4", text: "En iyi çalıştığın ortam?", options: [{ id: "a", text: "Rekabetçi, hedefli", scores: el(2,0,0,0) }, { id: "b", text: "Düzenli, net kurallı", scores: el(0,2,0,0) }, { id: "c", text: "Esnek, yenilikçi", scores: el(0,0,2,0) }, { id: "d", text: "İşbirlikçi, sıcak", scores: el(0,0,0,2) }] },
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
  elementResult("water", "İçe Dönerek ve Bağ Kurarak Başa Çıkma", "Suyun Tepkisi", "Yalnız zaman, doğa, sanat veya güvendiğin biriyle konuşmak seni toparlar. Duyguları hissetmek ve ifade etmek önemli.", ["Empati", "Sezgi", "İçe dönüş", "Bağ", "Sanatsal İfade"], "Aşırı hassasiyet ve içe kapanma; tükenme riski."),
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
    { id: "q4", text: "En çok ne stres yapar?", options: [{ id: "a", text: "Hareketsizlik ve belirsizlik", scores: el(2,0,0,0) }, { id: "b", text: "Düzensizlik ve güvensizlik", scores: el(0,2,0,0) }, { id: "c", text: "Kısıtlanma ve sıkıcılık", scores: el(0,0,2,0) }, { id: "d", text: "Çatışma ve reddedilme", scores: el(0,0,0,2) }] },
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
  elementResult("water", "Gölge Su", "Gizli Sezgi", "Aşırı hassas veya kapalı görünebilirsin; ama aynı derinlik sezgi ve ilham verir. Gizli gücün: görünmeyeni hissetme.", ["Sezgi", "Hayal Gücü", "Empati", "Derinlik", "Dönüşüm"], "Aşırı duygusallık ve sınır kaybı."),
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
  elementResult("water", "Sevgi ve Anlam", "Suyun Önceliği", "Sevgi, anlam ve derin bağlar senin için öncelikli. İç dünya ve duygusal tatmin hayatına yön verir.", ["Sevgi", "Anlam", "Bağ", "Esin", "İç dünya"], "Dış dünyadan kopma; aşırı içe dönüklük."),
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

/* ================= TEST 11:görsel VE SANAT (10 soru) ================= */

const CREATIVITY_RESULTS: TestResult[] = [
  elementResult("fire", "Tutkulu Sanatçı", "Ateşin Sanatı", "Sanatsal ifaden cesur ve enerjik. Büyük fikirler, dramatik anlatım ve performans sana yakın. Eserlerinde tutku ve güç var; risk almayı seversin.", ["Cesaret", "Enerji", "Dramatik ifade", "Liderlik", "Tutku"], "Sabırsızlık ve aşırı ego; detayları atlayabilirsin."),
  elementResult("earth", "Düzenli ve Somut Üretici", "Toprağın Sanatı", "Üretimlerin pratik ve somut. El işi, mimari, tasarım veya planlı projeler sana uygun. Detay ve kalite önemli; eserlerin kalıcı olur.", ["Pratiklik", "Detay", "Kalite", "Sabır", "Somutluk"], "Esneklik azlığı ve riskten kaçınma; bazen sınırlı kalabilirsin."),
  elementResult("air", "Fikir ve Konsept Mimarı", "Havanın Sanatı", "Yaklaşımın kavramsal ve zihinsel. Fikir geliştirmek, yazmak veya yenilikçi çözümler senin alanın. Çeşitlilik ve deney seni besler.", ["Fikir", "Yenilik", "İletişim", "Esneklik", "Kavram"], "Tamamlama zorluğu ve dağınıklık; bazen yüzeysel kalabilirsin."),
  elementResult("water", "Duygusal ve Sezgisel Zihin", "Suyun Sanatı", "İç dünyan oldukça duygusal ve sezgisel. Müzik, şiir, görsel sanat veya derin anlamları ifade etmek sana yakın. Sanatın etkileyici ve derin.", ["Sezgi", "Duygu", "Derinlik", "Empati", "Hayal Gücü"], "Aşırı hassasiyet ve içe kapanma; bazen tükenebilirsin."),
];

export const CREATIVITY_TEST: PersonalityTest = {
  id: "creativity-art",
  slug: "sanatsal-ifade-ve-tarzin",
  title: "Sanatsal Vizyonun ve Tarzın",
  description: "İlham dolu yönün nasıl? Hangi sanat formu sana uygun? Bu test içindeki üretim enerjisini ve sanatsal ifade tarzını ortaya çıkarır.",
  duration: "5–6 dk",
  questionCount: 10,
  category: "spiritual",
  image: "/tests/aura.png",
  questions: [
    { id: "q1", text: "Yeni bir projeye başlarken nasıl yaklaşırsın?", options: [{ id: "a", text: "Büyük fikirle başlar, enerjiyle ilerlerim", scores: el(2,0,0,0) }, { id: "b", text: "Plan yapar, adım adım ilerlerim", scores: el(0,2,0,0) }, { id: "c", text: "Fikirleri toplar, deneyerek ilerlerim", scores: el(0,0,2,0) }, { id: "d", text: "Hislerime güvenir, içimden geldiği gibi", scores: el(0,0,0,2) }] },
    { id: "q2", text: "En çok hangi sanat formu ilgini çeker?", options: [{ id: "a", text: "Performans, tiyatro, dans", scores: el(2,0,0,0) }, { id: "b", text: "El işi, mimari, tasarım", scores: el(0,2,0,0) }, { id: "c", text: "Yazı, konsept, yenilik", scores: el(0,0,2,0) }, { id: "d", text: "Müzik, şiir, görsel sanat", scores: el(0,0,0,2) }] },
    { id: "q3", text: "İlham noktasında en çok ne seni besler?", options: [{ id: "a", text: "Heyecan ve risk", scores: el(0,0,0,2) }, { id: "b", text: "Malzeme ve teknik", scores: el(0,0,2,0) }, { id: "c", text: "Fikir ve kavram", scores: el(0,2,0,0) }, { id: "d", text: "Duygu ve sezgi", scores: el(2,0,0,0) }] },
    { id: "q4", text: "Zihinsel bir tıkanıklık yaşadığında ne yaparsın?", options: [{ id: "a", text: "Farklı bir şeye geçer, enerji ararım", scores: el(2,0,0,0) }, { id: "b", text: "Tekniğe döner, pratik yaparım", scores: el(0,2,0,0) }, { id: "c", text: "Araştırır, yeni ufuklar ararım", scores: el(0,0,2,0) }, { id: "d", text: "İçime döner, duyguları dinlerim", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Eserini paylaşırken nasıl hissedersin?", options: [{ id: "a", text: "Gururlu, performans isterim", scores: el(2,0,0,0) }, { id: "b", text: "Güvenli, kaliteyi gösteririm", scores: el(0,2,0,0) }, { id: "c", text: "Meraklı, geri bildirim isterim", scores: el(0,0,2,0) }, { id: "d", text: "Kırılgan, samimiyet ararım", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Sanatsal süreçte en güçlü yönün?", options: [{ id: "a", text: "Cesaret ve orijinallik", scores: el(0,0,0,2) }, { id: "b", text: "Teknik ve detay", scores: el(0,0,2,0) }, { id: "c", text: "Fikir ve yenilik", scores: el(0,2,0,0) }, { id: "d", text: "Duygu ve derinlik", scores: el(2,0,0,0) }] },
    { id: "q7", text: "Eleştiri aldığında?", options: [{ id: "a", text: "Savunur, kendi yoluma giderim", scores: el(2,0,0,0) }, { id: "b", text: "Mantıklı olanı değerlendiririm", scores: el(0,2,0,0) }, { id: "c", text: "Tartışır, farklı bakış alırım", scores: el(0,0,2,0) }, { id: "d", text: "İncinirim ama içselleştiririm", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Ortak bir çalışmada rolün?", options: [{ id: "a", text: "Lider, vizyon sunarım", scores: el(2,0,0,0) }, { id: "b", text: "Organize eder, uygularım", scores: el(0,2,0,0) }, { id: "c", text: "Fikir üretir, tartışırım", scores: el(0,0,2,0) }, { id: "d", text: "Uyum sağlar, duygusal destek veririm", scores: el(0,0,0,2) }] },
    { id: "q9", text: "Özgün ifade senin için ne anlam taşır?", options: [{ id: "a", text: "Özgürlük ve kendini yansıtma", scores: el(0,0,0,2) }, { id: "b", text: "Somut sonuç ve kalite", scores: el(0,0,2,0) }, { id: "c", text: "Keşif ve öğrenme", scores: el(0,2,0,0) }, { id: "d", text: "Duygusal bağ ve anlam", scores: el(2,0,0,0) }] },
    { id: "q10", text: "Bir projeyi tamamlarken?", options: [{ id: "a", text: "Hızlı bitirir, yeniye geçerim", scores: el(2,0,0,0) }, { id: "b", text: "Detayları bitirir, mükemmelleştiririm", scores: el(0,2,0,0) }, { id: "c", text: "Gerekirse revize eder, geliştiririm", scores: el(0,0,2,0) }, { id: "d", text: "Duygusal olarak bağlanır, zor bırakırım", scores: el(0,0,0,2) }] },
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
    { id: "q9", text: "Para kazanmak için?", options: [{ id: "a", text: "Risk alır, girişimcilik", scores: el(0,0,0,2) }, { id: "b", text: "İstikrarlı gelir, güvenli iş", scores: el(0,0,2,0) }, { id: "c", text: "Çeşitli kaynak, esneklik", scores: el(0,2,0,0) }, { id: "d", text: "Anlamlı iş, değer katma", scores: el(2,0,0,0) }] },
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
    { id: "q6", text: "Ruhsal krizde nasıl toparlanırsın?", options: [{ id: "a", text: "Harekete geçer, dönüşüm sağlarım", scores: el(0,0,0,2) }, { id: "b", text: "Rutine döner, köklere bağlanırım", scores: el(0,0,2,0) }, { id: "c", text: "Öğrenir, perspektif değiştiririm", scores: el(0,2,0,0) }, { id: "d", text: "İçime döner, duyguları işlerim", scores: el(2,0,0,0) }] },
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
  elementResult("water", "Anlamlı ve İnsan Odaklı Yol", "Suyun Kariyeri", "Kariyerinde anlam ve insanlara dokunmak önemli. Psikoloji, sağlık, sanat veya hizmet sektörü sana uygun. Duygusal tatmin ve derinlik seni mutlu eder.", ["Anlam", "Empati", "Özgün İfade", "İnsan odaklılık", "Derinlik"], "Sınır koyamama ve tükenme; bazen duygusal yük ağır gelebilir."),
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
    { id: "q2", text: "İdeal iş ortamın nasıl olur?", options: [{ id: "a", text: "Rekabetçi, hızlı, hedef odaklı", scores: el(2,0,0,0) }, { id: "b", text: "Düzenli, güvenli, planlı", scores: el(0,2,0,0) }, { id: "c", text: "Esnek, özgün, çeşitli", scores: el(0,0,2,0) }, { id: "d", text: "İşbirlikçi, anlamlı, destekleyici", scores: el(0,0,0,2) }] },
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
  elementResult("water", "Anlam ve Bağ Odaklı", "Suyun Değerleri", "İşte anlam, bağ ve duygusal tatmin senin için önemli. İnsanlara dokunmak, sanatsal dışavurum ve uyum seni mutlu eder.", ["Anlam", "Bağ", "Empati", "İlham", "Uyum"], "Sınır koyamama ve duygusal yük; bazen tükenebilirsin."),
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
  elementResult("air", "İletişim ve Yenilik Meslekleri", "Havanın Meslekleri", "Senin için uygun meslekler: Gazeteci, yazar, pazarlamacı, eğitmen, danışman, yazılım geliştirici, tasarımcı, iletişim uzmanı, araştırmacı. İletişim ve yenilik gerektiren alanlar sana yakın.", ["İletişim", "Yenilik", "Öğrenme", "Esneklik", "Özgünlük"], "Kararsızlık ve odaklanma zorluğu; tekrarlayan meslekler seni sıkar."),
  elementResult("water", "İnsan ve Sanat Meslekleri", "Suyun Meslekleri", "Senin için uygun meslekler: Psikolog, terapist, hemşire, öğretmen, sanatçı, müzisyen, yazar, sosyal hizmet uzmanı, koç, mentor. İnsanlara dokunan ve anlamlı meslekler sana uygun.", ["Empati", "İlham", "Anlam", "İnsan odaklılık", "Derinlik"], "Sınır koyamama ve tükenme riski; rekabetçi meslekler zorlayabilir."),
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
    { id: "q5", text: "Hangi alanda kendini güçlü hissedersin?", options: [{ id: "a", text: "Liderlik ve karar verme", scores: el(2,0,0,0) }, { id: "b", text: "Planlama ve organizasyon", scores: el(0,2,0,0) }, { id: "c", text: "Fikir üretme ve iletişim", scores: el(0,0,2,0) }, { id: "d", text: "Empati ve sezgisel ifade", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Meslekte en çok ne seni yorar?", options: [{ id: "a", text: "Rutin ve yavaş ilerleme", scores: el(0,0,0,2) }, { id: "b", text: "Belirsizlik ve değişim", scores: el(0,0,2,0) }, { id: "c", text: "Tekrar ve sıkıcılık", scores: el(0,2,0,0) }, { id: "d", text: "Duygusuzluk ve rekabet", scores: el(2,0,0,0) }] },
    { id: "q7", text: "Meslek değiştirme konusunda?", options: [{ id: "a", text: "Açığım, yeni fırsatlar ararım", scores: el(2,0,0,0) }, { id: "b", text: "Temkinli, güvenli geçiş", scores: el(0,2,0,0) }, { id: "c", text: "Meraklı, denemeye açığım", scores: el(0,0,2,0) }, { id: "d", text: "Anlam varsa değiştirebilirim", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Meslekte en çok ne seni mutlu eder?", options: [{ id: "a", text: "Başarı ve tanınma", scores: el(2,0,0,0) }, { id: "b", text: "Güvenlik ve düzen", scores: el(0,2,0,0) }, { id: "c", text: "Yenilik ve öğrenme", scores: el(0,0,2,0) }, { id: "d", text: "İnsanlara yardım ve anlam", scores: el(0,0,0,2) }] },
    { id: "q9", text: "Meslek seçiminde kimin fikri önemli?", options: [{ id: "a", text: "Kendi kararım", scores: el(0,0,0,2) }, { id: "b", text: "Aile ve güvenilir danışmanlar", scores: el(0,0,2,0) }, { id: "c", text: "Çeşitli kaynaklar ve araştırma", scores: el(0,2,0,0) }, { id: "d", text: "İç sesim ve değerlerim", scores: el(2,0,0,0) }] },
    { id: "q10", text: "İdeal meslekte nasıl birisin?", options: [{ id: "a", text: "Lider ve başarılı", scores: el(2,0,0,0) }, { id: "b", text: "Uzman ve güvenilir", scores: el(0,2,0,0) }, { id: "c", text: "Yenilikçi ve öğretici", scores: el(0,0,2,0) }, { id: "d", text: "Anlamlı ve destekleyici", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: CAREER_MATCH_RESULTS,
};

/* ================= TEST 21: RUH EŞİN HANGİ BURÇTAN? ================= */

const SOULMATE_RESULTS: TestResult[] = [
  elementResult(
    "fire",
    "Ateş Burçları: Koç, Aslan veya Yay",
    "Tutkulu & Özgür Ruh",
    "Ruh eşin ateş grubu burcundan — yani Koç, Aslan ya da Yay enerjisini taşıyor. Bu kişi seni ilham veriyor, hayata karşı tutkunuzu birlikte büyütüyorsunuz. Duygular güçlü, bağlılık derin ama özgürlük ikisi için de vazgeçilmez. Birlikte dans ediyorsunuz, birbirini söndürmüyorsunuz.",
    ["Tutku", "Özgürlük", "Macera", "Karşılıklı ilham", "Dürüstlük"],
    "Zaman zaman iki ateş bir arada yoğunlaşabilir; sabır ve dinleme becerisi ilişkiyi dengeler.",
    { behaviorTendency: "İlişkinizde yoğun enerji ve ortak hedefler ön planda. İkisi de harekete geçmeyi sever.", stressResponse: "Gerginlik anlarında direkt ve çabuk tepkiler gelebilir; bu aslında ilişkinin derinliğini gösteriyor.", strength: "Tutku, özgürlük ve birbirini ileri taşıma güçlü yanlar arasında.", riskArea: "Aşırı yarışmacılık veya bağımsızlık ihtiyacı zaman zaman çatışma yaratabilir.", developmentSuggestion: "Dinlemek ve ara sıra yavaşlamak ilişkiye derinlik katar." }
  ),
  elementResult(
    "earth",
    "Toprak Burçları: Boğa, Başak veya Oğlak",
    "Güvenilir & Sadık Kalp",
    "Ruh eşin toprak grubu burcundan — Boğa, Başak ya da Oğlak enerjisi taşıyor. Bu kişi sana güvenlik ve zemin veriyor. Aşkta söz değil, eylem dili konuşuyorsunuz. Zaman içinde derinleşen, sağlam temelli bir bağ bu. Küçük jestlerle büyük sevgiler.",
    ["Güvenilirlik", "Sadakat", "Sabır", "Pratik sevgi", "Derin bağ"],
    "Bazen rutine gömülebilirsiniz; yeni deneyimler ilişkiye taze hava katar.",
    { behaviorTendency: "İlişkide güven ve devamlılık merkezde. Eyleme geçen sevgi dili konuşuyorsunuz.", stressResponse: "Zor dönemlerde sakin ve pratik yaklaşım ilişkiyi ayakta tutar.", strength: "Güvenilirlik, sabır ve derin bağ ilişkinin temeli.", riskArea: "Duygusal ifadeyi ertelemek veya değişime direnmek zaman zaman mesafe yaratabilir.", developmentSuggestion: "Arada bir rutin dışına çıkmak ilişkiyi tazeleyebilir." }
  ),
  elementResult(
    "air",
    "Hava Burçları: İkizler, Terazi veya Kova",
    "Zeki & Büyüleyici Ruh",
    "Ruh eşin hava grubu burcundan — İkizler, Terazi ya da Kova enerjisi taşıyor. Bu ilişkide zihinsel bağ çok güçlü. Saatlerce konuşabiliyorsunuz, birbirini anlıyorsunuz. Eşin seni düşündürüyor, hayrete düşürüyor. Sevginin yanında en iyi arkadaşsınız.",
    ["Zihinsel bağ", "Esprili iletişim", "Özgürlük", "Eşit partnerlik", "Merak"],
    "Duygusal derinliği ihmal etmemek gerekiyor; his dili de bazen söz ister.",
    { behaviorTendency: "İlişkide iletişim ve ortak merak öne çıkar. Birbirinizin zihnine tutkunsunuz.", stressResponse: "Zor anlarda konuşmak ve analiz etmek ilişkiyi iyileştirir.", strength: "Zihinsel uyum, esprili dil ve özgürlüğe saygı güçlü yanlar.", riskArea: "Duygusal mesafe veya 'kafada kalma' zaman zaman ilişkiyi soyutlaştırabilir.", developmentSuggestion: "Duygular için de alan açmak bağı derinleştirir." }
  ),
  elementResult(
    "water",
    "Su Burçları: Yengeç, Akrep veya Balık",
    "Derin & Ruhsal Bağ",
    "Ruh eşin su grubu burcundan — Yengeç, Akrep ya da Balık enerjisi taşıyor. Bu bağ sözsüz anlaşmalarla dolu; bakışlarla, sessizlikle, his diliyle konuşuyorsunuz. Derin, dönüştürücü ve ruhsal bir aşk bu. Birbirinizi iyileştiriyorsunuz.",
    ["Empati", "Derin bağ", "Sezgisel anlayış", "Duygusal derinlik", "Dönüşüm"],
    "Sınırları korumak önemli; çok yoğun duygusal bağlar arada nefes alanı gerektirir.",
    { behaviorTendency: "İlişkide duygusal derinlik ve sezgisel bağ merkezde. Söze ihtiyaç duymadan anlıyorsunuz.", stressResponse: "Zor dönemlerde birbirinize sarılmak ve hisleri paylaşmak iyileştirir.", strength: "Empati, derin bağ ve dönüştürücü aşk ilişkinin özü.", riskArea: "Duygusal yoğunluk bazen tükenme ya da sınır sorunlarına yol açabilir.", developmentSuggestion: "Hem bağ hem de kişisel alan ilişkiyi dengeler." }
  ),
];

export const SOULMATE_TEST: PersonalityTest = {
  id: "ruh-esin-burcu",
  slug: "ruh-esin-burcu",
  title: "Ruh Eşin Hangi Burçtan?",
  description: "Aşkta seni tamamlayan ruh eşin hangi element grubundan geliyor? 8 soruyla iç sesin söylediğini keşfet.",
  duration: "3–4 dk",
  questionCount: 8,
  category: "love",
  image: "/tests/love.png",
  questions: [
    { id: "q1", text: "Hayal ettiğin romantik bir akşamı tarif et:", options: [{ id: "a", text: "Spontane bir sürpriz — konser, gece yürüyüşü, macera", scores: el(2,0,0,0) }, { id: "b", text: "Özenle hazırlanmış bir yemek, müzik ve dinginlik", scores: el(0,2,0,0) }, { id: "c", text: "Saatlerce konuştuğumuz bir kafe ya da sergi", scores: el(0,0,2,0) }, { id: "d", text: "Evde, mum ışığında sadece ikimiz", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Sevgilinde seni en çok çeken şey:", options: [{ id: "a", text: "Karizması, kendinden emin duruşu", scores: el(2,0,0,0) }, { id: "b", text: "Güvenilirliği ve tutarlılığı", scores: el(0,2,0,0) }, { id: "c", text: "Zekası ve esprili dili", scores: el(0,0,2,0) }, { id: "d", text: "Seni gerçekten dinleyip hissetmesi", scores: el(0,0,0,2) }] },
    { id: "q3", text: "İlişkide en önemli gördüğün şey:", options: [{ id: "a", text: "Tutku ve hayattan birlikte keyif almak", scores: el(2,0,0,0) }, { id: "b", text: "Sadakat ve uzun vadeli güvenlik", scores: el(0,2,0,0) }, { id: "c", text: "Zihinsel uyum ve dürüst iletişim", scores: el(0,0,2,0) }, { id: "d", text: "Duygusal derinlik ve ruhsal bağ", scores: el(0,0,0,2) }] },
    { id: "q4", text: "Tartışma anında ne yaparsın?", options: [{ id: "a", text: "Direkt söylerim, çözüme odaklanırım", scores: el(2,0,0,0) }, { id: "b", text: "Sakin kalır, zamanla konuşurum", scores: el(0,2,0,0) }, { id: "c", text: "Her açıdan analiz ederim", scores: el(0,0,2,0) }, { id: "d", text: "Duygularımı paylaşır, empati kurarım", scores: el(0,0,0,2) }] },
    { id: "q5", text: "İlişkide seni en mutlu eden an:", options: [{ id: "a", text: "Birlikte yeni bir şey denediğimizde", scores: el(2,0,0,0) }, { id: "b", text: "Birlikte rutinimizi, projelerimizi kurduğumuzda", scores: el(0,2,0,0) }, { id: "c", text: "Saatlerce konuşup birbirimizi anladığımızda", scores: el(0,0,2,0) }, { id: "d", text: "Sadece huzurla yanında oturduğumda", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Aşkta en büyük korkun:", options: [{ id: "a", text: "Özgürlüğümü kaybetmek", scores: el(2,0,0,0) }, { id: "b", text: "İhanet veya güvensizlik", scores: el(0,2,0,0) }, { id: "c", text: "İletişim kopukluğu", scores: el(0,0,2,0) }, { id: "d", text: "Duygusal olarak yalnız kalmak", scores: el(0,0,0,2) }] },
    { id: "q7", text: "Sevgilin için bir sürpriz yaparken:", options: [{ id: "a", text: "Büyük jestler — seyahat, konsert, beklenmedik plan", scores: el(2,0,0,0) }, { id: "b", text: "Özenle seçilmiş, anlamlı küçük hediyeler", scores: el(0,2,0,0) }, { id: "c", text: "Birlikte yeni bir şey keşfetmek", scores: el(0,0,2,0) }, { id: "d", text: "Kişisel, el yapımı, kalpten gelen bir şey", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Mükemmel ilişkiyi tek cümleyle tanımla:", options: [{ id: "a", text: "Her gün büyüyen, heyecanlı bir yolculuk", scores: el(2,0,0,0) }, { id: "b", text: "Güvenli bir yuva, sağlam bir ortak hayat", scores: el(0,2,0,0) }, { id: "c", text: "Birbirini zihinsel olarak besleyen eşit iki ruh", scores: el(0,0,2,0) }, { id: "d", text: "Söze gerek kalmadan anlayan, derin bir bağ", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: SOULMATE_RESULTS,
};

/* ================= TEST 22: BİR ÖNCEKİ YAŞAMINDA KİMDİN? ================= */

const PAST_LIFE_RESULTS: TestResult[] = [
  elementResult(
    "fire",
    "Komutan & Lider Arketipi",
    "Tarihin Önünde Yürüyen",
    "Kişiliğinde güçlü bir komutan ve lider arketipi var. Tarih boyunca bu enerjiyi taşıyan insanlar orduları yönetmiş, toplumları dönüştürmüş, cesaretiyle iz bırakmıştır. Sende de aynı irade ve liderlik içgüdüsü güçlü biçimde hissediliyor. Harekete geçmek, korumak ve önden gitmek senin doğan.",
    ["Doğal liderlik", "Koruma içgüdüsü", "Cesaret", "Karizmatik etki", "İrade gücü"],
    "Zaman zaman aşırı kontrol ya da sabırsızlık bu arketipin gölge yanı olabilir.",
    { behaviorTendency: "Liderlik ve koruma içgüdüsü belirgin. İnsanları yönlendirme ve harekete geçirme eğilimi güçlü.", stressResponse: "Baskı altında liderlik refleksi devreye girer; sorunun üstüne gidersin.", strength: "Cesaret, irade ve insanları motive etme yeteneği güçlü yanların.", riskArea: "Aşırı kontrol veya 'tek doğru benim' eğilimi zaman zaman ortaya çıkabilir.", developmentSuggestion: "Başkalarına alan açmak ve dinlemek bu arketipin en önemli gelişim alanı." }
  ),
  elementResult(
    "earth",
    "Şifacı & Zanaatkâr Arketipi",
    "Toprağın Koruyucusu",
    "Kişiliğinde güçlü bir şifacı ve zanaatkâr arketipi var. Tarih boyunca bu enerjiyi taşıyan insanlar toplumları besleyen hekimler, ustalar ve çiftçiler olmuştur. Toprakla, üretimle ve hayatı sürdürmekle iç içe yaşamışlardır. Sende de aynı sabır, güvenilirlik ve pratik iyilik hali var.",
    ["Şifa içgüdüsü", "Pratik zeka", "Sabır", "Üretkenlik", "Güvenilirlik"],
    "Değişime karşı direniş veya rutine aşırı bağlılık bu arketipin gölge yanı olabilir.",
    { behaviorTendency: "Pratik, üretken ve sabırlı yaklaşım belirgin.", stressResponse: "Zor anlarda plan yapma ve düzeni koruma güçlü tepkin.", strength: "Şifa yeteneği, sabır ve güvenilirlik öne çıkan güçlü yanlar.", riskArea: "Değişime direnç veya aşırı kontrolcülük zaman zaman blokaj yaratabilir.", developmentSuggestion: "Esneklik ve yeni deneyimlere açılmak bu arketipin önemli gelişim alanı." }
  ),
  elementResult(
    "air",
    "Bilge & Kâşif Arketipi",
    "Düşüncenin Ustası",
    "Kişiliğinde güçlü bir bilge ve kâşif arketipi var. Tarih boyunca bu enerjiyi taşıyan insanlar filozoflar, seyyahlar ve ilim insanları olmuştur. Fikirlerle, yolculuklarla ve keşiflerle var olmuşlardır. Sende de aynı merak, öğrenme tutkusu ve geniş perspektif hali var.",
    ["Derin merak", "Evrensel bakış", "İletişim gücü", "Öğrenme tutkusu", "Bağlantı kurma"],
    "Kararsızlık ya da bir yere kök salamamak bu arketipin gölge yanı olabilir.",
    { behaviorTendency: "Öğrenme ve keşfetme temel dürtü. Fikirler ve bağlantılar besleyici.", stressResponse: "Zor anlarda analiz etmek ve anlam aramak güçlü tepkin.", strength: "Zeka, iletişim ve geniş perspektif güçlü yanların.", riskArea: "Kararsızlık veya hiçbir yere tam bağlanamamak zaman zaman ortaya çıkabilir.", developmentSuggestion: "Derin kök salmak ve uzun soluklu kalmak bu arketipin dersi." }
  ),
  elementResult(
    "water",
    "Bilge & Sezgisel Arketip",
    "Duyguların Okuyucusu",
    "Kişiliğinde güçlü bir bilge ve sezgisel arketip var. Tarih boyunca bu enerjiyi taşıyan insanlar toplumların ilim insanları, şifacıları ve rehberleri olmuştur. İnsanları dinleyip anlama, derin empati kurma ve iyileştirici bir etki bırakma bu arketipte güçlüdür. Sende de insanlar kolayca açılır; sezgilerinle yol bulursun.",
    ["Güçlü sezgi", "Derin empati", "Şefkat", "İçsel bilgelik", "Şifa enerjisi"],
    "Aşırı yük taşımak ve sınır koyamamak bu arketipin gölge yanı olabilir.",
    { behaviorTendency: "Sezgi ve empati merkezi. İnsanların içini okuma eğilimi güçlü.", stressResponse: "Zor anlarda içe dönme ve sezgine güvenme güçlü tepkin.", strength: "İçsel bilgelik, empati ve sezgisel zeka güçlü yanların.", riskArea: "Başkalarının yükünü üstlenmek veya sınır koyamamak tükenmeye yol açabilir.", developmentSuggestion: "Kendi enerjini korumak ve net sınırlar koymak bu arketipin dersi." }
  ),
];

export const PAST_LIFE_TEST: PersonalityTest = {
  id: "onceki-yasam",
  slug: "onceki-yasam",
  title: "Hangi Tarihi Arketipe Sahipsin?",
  description: "Bazı kişilikler tarih boyunca tekrar eder. 8 soruyla hangi tarihi karakter enerjisini taşıdığını keşfet.",
  duration: "3–4 dk",
  questionCount: 8,
  category: "spiritual",
  image: "/tests/aura.png",
  questions: [
    { id: "q1", text: "Tarihten hangi dönem seni en çok etkiler ya da ilgi çeker?", options: [{ id: "a", text: "Büyük imparatorluklar, savaşlar, kahramanlık destanları", scores: el(2,0,0,0) }, { id: "b", text: "El sanatları, köy hayatı, bereketli toprak", scores: el(0,2,0,0) }, { id: "c", text: "İslam altın çağı, keşifler, ilim ve kütüphaneler", scores: el(0,0,2,0) }, { id: "d", text: "Osmanlı dönemi, anadolu medeniyeti, şiir ve sanat", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Tanımadığın biriyle ilk karşılaşmada ne yaparsın?", options: [{ id: "a", text: "Hemen değerlendiririm — güvenilir mi, güçlü mü?", scores: el(2,0,0,0) }, { id: "b", text: "Gözlemlerim, zamanla güven inşa ederim", scores: el(0,2,0,0) }, { id: "c", text: "Zekasını ve konuşma biçimini fark ederim", scores: el(0,0,2,0) }, { id: "d", text: "Enerjisini ve niyetini sezgiyle hissederim", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Kendini en güçlü hissettiğin an:", options: [{ id: "a", text: "Başkalarını yönetirken veya korurken", scores: el(2,0,0,0) }, { id: "b", text: "Bir işi en iyi şekilde, sabırla tamamlarken", scores: el(0,2,0,0) }, { id: "c", text: "Yeni bir şey öğrenirken ya da anlatırken", scores: el(0,0,2,0) }, { id: "d", text: "Birini dinleyip iyileştirirken", scores: el(0,0,0,2) }] },
    { id: "q4", text: "Başkalarına nasıl yardım edersin?", options: [{ id: "a", text: "Onları koruyarak ve harekete geçirerek", scores: el(2,0,0,0) }, { id: "b", text: "Somut destek ve pratik çözümlerle", scores: el(0,2,0,0) }, { id: "c", text: "Bilgi ve doğru strateji paylaşarak", scores: el(0,0,2,0) }, { id: "d", text: "Dinleyerek, derin anlayış ve şefkatle", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Hangi alanda kendin için ilerlemek istersin?", options: [{ id: "a", text: "Liderlik ve etki alanımı büyütmek", scores: el(2,0,0,0) }, { id: "b", text: "Bir alanda ustalaşmak ve güvenilir olmak", scores: el(0,2,0,0) }, { id: "c", text: "Bilgi ve keşif — öğrenmek, paylaşmak", scores: el(0,0,2,0) }, { id: "d", text: "İnsanlarla derin bağ kurmak ve anlam üretmek", scores: el(0,0,0,2) }] },
    { id: "q6", text: "İçgüdüsel olarak nerede ait hissedersin?", options: [{ id: "a", text: "Bir ordunun ya da büyük bir hareketin önünde", scores: el(2,0,0,0) }, { id: "b", text: "Bereketli topraklara, el emeğine, üretime", scores: el(0,2,0,0) }, { id: "c", text: "Büyük kütüphanelerde ya da yolculuklarda", scores: el(0,0,2,0) }, { id: "d", text: "Su kenarında, doğanın sessizliğinde ya da insanların arasında", scores: el(0,0,0,2) }] },
    { id: "q7", text: "Hayatta seni motive eden şey:", options: [{ id: "a", text: "Büyük bir amaca hizmet ve etki bırakmak", scores: el(2,0,0,0) }, { id: "b", text: "Güvenli bir yurt kurmak ve üreterek var olmak", scores: el(0,2,0,0) }, { id: "c", text: "Bilgiyi artırmak ve aktarmak", scores: el(0,0,2,0) }, { id: "d", text: "İnsanları anlamak ve onların hayatına dokunmak", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Bazen açıklayamadığın güçlü bir içgüdü ya da his yaşıyor musun?", options: [{ id: "a", text: "Evet — özellikle kriz ve liderlik anlarında", scores: el(2,0,0,0) }, { id: "b", text: "Evet — elle üretirken ve pratik çözümlerde", scores: el(0,2,0,0) }, { id: "c", text: "Evet — okurken, seyahat ederken, öğrenirken", scores: el(0,0,2,0) }, { id: "d", text: "Evet — insanları okuduğumda ve derin dinleme anlarında", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: PAST_LIFE_RESULTS,
};

/* ================= TEST 23: HANGİ GEZEGEN SENİ YÖNETİYOR? ================= */

const PLANET_RESULTS: TestResult[] = [
  elementResult(
    "fire",
    "Mars Senin Gezegenin",
    "Savaşçının & Tutkununun Gezegeni",
    "Seni yöneten gezegen Mars — güç, eylem ve tutku gezegeni. İçinde sürekli bir ateş yanıyor; hareketsizlik sana yabancı. Zorluklar seni yormuyor, aksine uyandırıyor. Mars enerjisiyle donatılmış biri olarak hayatı tam gaz yaşıyorsun. Enerji kaynağın: meydan okumalar ve kazanma hissi.",
    ["Güçlü irade", "Harekete geçme hızı", "Rekabet gücü", "Cesaret", "Enerji"],
    "Sabırsızlık ve aşırı ısrar Mars'ın gölge yanı — zaman zaman dinlemek ve yavaşlamak iyileştirir.",
    { behaviorTendency: "Eylem ve güç önce gelir. Harekete geçmek için işaret beklemeye ihtiyaç duymuyorsun.", stressResponse: "Stres altında savaş moduna geçme ve soruna direkt müdahale etme eğilimi.", strength: "İrade, cesaret ve yoğun enerji güçlü yanların.", riskArea: "Sabırsızlık ve zorla çözme refleksi bazen ilişkileri zorlayabilir.", developmentSuggestion: "Dinleme ve dinginlik Mars enerjisini tamamlayan güçlü becerilerdir." }
  ),
  elementResult(
    "earth",
    "Satürn Senin Gezegenin",
    "Zamanın Efendisi & Ödülün Gezegeni",
    "Seni yöneten gezegen Satürn — disiplin, zaman ve ödül gezegeni. Her şeyi inşa ediyorsun, sabırla, adım adım. Satürn insanları zorlar ama en sonunda herkesten çok ödüllendirir. Sen bunu içgüdüsel olarak biliyorsun. Kısa yolları değil, kalıcı olanı seçiyorsun.",
    ["Disiplin", "Sabır", "Uzun vadeli vizyon", "Güvenilirlik", "Derin irade"],
    "Katılık ve değişime direnç Satürn'ün gölgesi — bazen esneklik güçtür.",
    { behaviorTendency: "Yapı kurma ve uzun soluklu planlama doğal eğilimin.", stressResponse: "Stres altında düzeni ve rutini koruma refleksi güçlü.", strength: "Disiplin, sabır ve uzun vadeli inşa etme kapasitesi öne çıkıyor.", riskArea: "Aşırı katılık veya mükemmeliyetçilik bazen ilerlemeyi yavaşlatabilir.", developmentSuggestion: "Esneklik ve kendine merhamet Satürn enerjisini dengeliyor." }
  ),
  elementResult(
    "air",
    "Merkür Senin Gezegenin",
    "Düşüncenin & İletişimin Gezegeni",
    "Seni yöneten gezegen Merkür — zeka, iletişim ve hız gezegeni. Zihnin durmaksızın çalışıyor; bağlantılar kuruyorsun, kalıpları görüyorsun. Kelimeler senin silahın, fikirler senin oyun alanın. Merkür insanları öğrenmeye ve anlatmaya iter — sen ikisini de seviyorsun.",
    ["Keskin zeka", "İletişim gücü", "Hızlı bağlantı kurma", "Adaptasyon", "Analiz"],
    "Karar vermekte zorlanmak ve kararsızlık Merkür'ün gölgesi — bazen düşünmeyi bırakıp hissetmek lazım.",
    { behaviorTendency: "Zihinde yaşama ve sürekli bağlantı arama doğal eğilimin.", stressResponse: "Stres altında analiz etme ve konuyu mantıksal çerçeveye oturtma güçlü tepkin.", strength: "Zeka, iletişim ve hızlı adaptasyon güçlü yanların.", riskArea: "Aşırı düşünme veya karar verme güçlüğü zaman zaman ortaya çıkabilir.", developmentSuggestion: "Sezgilere ve duygu diline alan açmak Merkür enerjisini tamamlıyor." }
  ),
  elementResult(
    "water",
    "Ay & Neptün Senin Gezegenin",
    "Ruhun & Sezginin Gezegenleri",
    "Seni yöneten gezegenler Ay ve Neptün — ruh, sezgi ve derinlik gezegenleri. Gördüğünden fazlasını hissediyorsun; kelimelerden önce enerji geliyor. Ay döngüleriyle titreşiyorsun, Neptün'ün mistik diliyle konuşuyorsun. Sezgin, doğanın en güçlü navigasyon sistemlerinden biri.",
    ["Güçlü sezgi", "Duygusal zeka", "Empati", "Mistik anlayış", "Ruhsal bağ"],
    "Sınır koyamamak ve başkalarının enerjisini çok taşımak Ay/Neptün'ün gölgesi.",
    { behaviorTendency: "Sezgi ve duygusal okuma birincil navigasyon aracın.", stressResponse: "Stres altında içe dönme, dinginlik arama ve sezgine güvenme güçlü tepkin.", strength: "Empati, sezgisel zeka ve derin anlama kapasitesi güçlü yanların.", riskArea: "Aşırı yük taşıma veya sınır koyamamak zamanla tüketebilir.", developmentSuggestion: "Kendi enerjini korumak ve net sınırlar kurmak dengeyi sağlıyor." }
  ),
];

export const PLANET_TEST: PersonalityTest = {
  id: "gezegen-enerjin",
  slug: "gezegen-enerjin",
  title: "Hangi Gezegen Seni Yönetiyor?",
  description: "Astrolojide her ruhun bir gezegeni var. 8 soruyla seni asıl yönlendiren gezegeni keşfet.",
  duration: "3–4 dk",
  questionCount: 8,
  category: "spiritual",
  image: "/tests/aura.png",
  questions: [
    { id: "q1", text: "Sabah kalktığında ilk ne yaparsın?", options: [{ id: "a", text: "Harekete geç — egzersiz, plan, aksiyon", scores: el(2,0,0,0) }, { id: "b", text: "Günü listele, öncelikleri belirle", scores: el(0,2,0,0) }, { id: "c", text: "Haberlere bak, mesajları oku, zihnini uyandır", scores: el(0,0,2,0) }, { id: "d", text: "Rüyanı düşün, nasıl hissettiğine bak", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Bir hedefe ulaşmak için nasıl ilerlersin?", options: [{ id: "a", text: "Direkt, hızlı, cesurca — engeller durduramaz", scores: el(2,0,0,0) }, { id: "b", text: "Adım adım, sistemli ve disiplinle", scores: el(0,2,0,0) }, { id: "c", text: "Strateji kur, bilgi topla, ağ genişlet", scores: el(0,0,2,0) }, { id: "d", text: "Sezgine güven, doğru an gelince hissedeceğini bilirsin", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Güç deyince aklına ilk ne gelir?", options: [{ id: "a", text: "Fiziksel enerji ve irade gücü", scores: el(2,0,0,0) }, { id: "b", text: "Sabır ve zamanın verdiği güç", scores: el(0,2,0,0) }, { id: "c", text: "Zeka ve doğru bilgiye erişim", scores: el(0,0,2,0) }, { id: "d", text: "Duygusal güç ve sezgi", scores: el(0,0,0,2) }] },
    { id: "q4", text: "Enerji aldığın şey:", options: [{ id: "a", text: "Rekabet ve zorlukları aşmak", scores: el(2,0,0,0) }, { id: "b", text: "Tamamlanmış bir görev ve sağlam düzen", scores: el(0,2,0,0) }, { id: "c", text: "Yeni bilgi ve hızlı fikir alışverişi", scores: el(0,0,2,0) }, { id: "d", text: "Derin bağlar ve anlamlı sessizlikler", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Anlaşmazlıkta ne yaparsın?", options: [{ id: "a", text: "Direkt ve hızlı tepki veririm, çözüme geçerim", scores: el(2,0,0,0) }, { id: "b", text: "Sessiz kalır, zamanla çözerim", scores: el(0,2,0,0) }, { id: "c", text: "Mantıklı argüman sunar, analiz ederim", scores: el(0,0,2,0) }, { id: "d", text: "Duyguları önce anlamaya çalışırım", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Zaman zaman en çok ne zorlar seni?", options: [{ id: "a", text: "Yavaşlamak ve sabır göstermek", scores: el(2,0,0,0) }, { id: "b", text: "Değişime ve belirsizliğe uyum sağlamak", scores: el(0,2,0,0) }, { id: "c", text: "Duyguları ifade etmek", scores: el(0,0,2,0) }, { id: "d", text: "'Hayır' demek ve sınır koymak", scores: el(0,0,0,2) }] },
    { id: "q7", text: "Bir lider olsan nasıl yönetirdin?", options: [{ id: "a", text: "Önden giderek, ilham vererek", scores: el(2,0,0,0) }, { id: "b", text: "Sistemi kurarak ve güvenilir olarak", scores: el(0,2,0,0) }, { id: "c", text: "Bilgi ve stratejiyle yönlendirerek", scores: el(0,0,2,0) }, { id: "d", text: "Empatiyle güven inşa ederek", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Hayatta seni en çok tatmin eden şey:", options: [{ id: "a", text: "Zorluğu aşmak ve kazanmak", scores: el(2,0,0,0) }, { id: "b", text: "Uzun vadede sağlam bir şey inşa etmek", scores: el(0,2,0,0) }, { id: "c", text: "Yeni fikirleri keşfetmek ve paylaşmak", scores: el(0,0,2,0) }, { id: "d", text: "Derin bir bağ ve gerçek anlam bulmak", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: PLANET_RESULTS,
};

/* ================= TEST 24: 2026'DA SENİ NE BEKLİYOR? ================= */

const ENERGY_2025_RESULTS: TestResult[] = [
  elementResult(
    "fire",
    "Cesaret & Yeni Kimlik Yılı",
    "Satürn + Neptün Koç'ta: Yeniden Doğuş",
    "2026'da gökyüzünde ender görülen bir buluşma yaşanıyor: hem Satürn hem de Neptün Koç burcuna giriyor. Bu iki gezegen son birlikte Koç'tayken 1861-1862 yıllarıydı — yani yüz yılda bir görülen bir enerji. Satürn Koç'ta yeni bir 29 yıllık cesaret döngüsü başlatıyor: kim olduğunu ve ne istediğini yeniden inşa etme vakti. Neptün ise eski kimliği eritiyor — sana ait olmayan rolleri, başkalarının beklentilerini bırakmak bu yılın asıl işi. Ateş enerjisi taşıyanlar için 2026, 'gerçek ben'e dönüşün başlangıç noktası.",
    ["Kimlik yenilenmesi", "Satürn cesareti", "Rol bırakma", "Özgün yol", "Güç geri dönüşü"],
    "Bu kadar büyük bir dönüşüm anında acele etmek köklerin yerleşmesini engelleyebilir — yavaş ama derin ilerlemek kazandırır.",
    { behaviorTendency: "2026 harekete geçme ve dönüşüm enerjisiyle dolu. Uzun süredir beklenen adımlar için zaman.", stressResponse: "Baskı altında daha da hızlanma ve ilerleme isteği artabilir.", strength: "Cesaret, irade ve dönüşme kapasitesi 2026'nın güçlü yanları.", riskArea: "Aşırı hız veya sabırsızlık önemli detayları atlayabilir.", developmentSuggestion: "Hızlanırken dinlenmek ve değerlendirmek 2026 yolculuğunu güçlendiriyor." }
  ),
  elementResult(
    "earth",
    "Kök & Bolluk Yılı",
    "Jüpiter Yengeç'te: Ev, Aile ve Derin Güvenlik",
    "2026'da Jüpiter Yengeç burcuna geçiyor — ve bu hareket toprak enerjisi taşıyanlar için özellikle güçlü bir mesaj içeriyor. Jüpiter genişleme ve bereket gezegenidir; Yengeç ise ev, aile, duygusal güvenlik ve köktür. Bu buluşma finansal temeli sağlamlaştırıyor; yuva kavramı — ister fiziksel ev ister aidiyet hissi — 2026'da senin için merkeze geliyor. Yıllardır inşa ettiğin şeyler bu yıl meyve veriyor. Aynı zamanda Satürn'ün Koç'a girişi kişisel sorumluluğu hatırlatıyor: güvenliği başkasından değil, kendi sağlam adımlarından almak 2026'nın dersi.",
    ["Duygusal güvenlik", "Yuva inşası", "Jüpiter bereketi", "Aile bağları", "Uzun vadeli büyüme"],
    "Değişen enerjiye direnmek 2026'nın açtığı kapıları kapatabilir — kök salmak donup kalmak değil, derinleşmektir.",
    { behaviorTendency: "2026 sağlam temeller ve somut büyüme enerjisi taşıyor.", stressResponse: "Belirsizlik anlarında plan ve rutin tutunma noktası.", strength: "Sabır, tutarlılık ve uzun vadeli inşa kapasitesi 2026'nın güçlü yanları.", riskArea: "Aşırı ihtiyatlılık veya kaçırılan fırsatlar dikkat edilmesi gereken alan.", developmentSuggestion: "Zaman zaman hesaplı risk almak 2026 yolculuğunu hızlandırıyor." }
  ),
  elementResult(
    "air",
    "Devrim & Kolektif Uyanış Yılı",
    "Plüton Kova'da: Sistemler Çözülüyor, Özgürlük Doğuyor",
    "2026'da Plüton Kova'daki yolculuğunu derinleştiriyor — ve bu, hava enerjisi taşıyanlar için en güçlü rezonansı yaratıyor. Plüton bir neslin dönüşüm noktasını gösterir; Kova ise kolektif bilinç, özgürlük, teknoloji ve insanlığın geleceğidir. 2026'da eski sistemler — hem dışarıda hem içinde — sarsılmaya devam ediyor. Hava enerjisi taşıyanlar bu dalgayı en erken hisseden, ona anlam verenler. Senin için 2026, başkalarının sana çizdiği sınırları aşma, gerçekten kendi düşüncenle düşünme ve kolektif dönüşümün bir parçası olma yılı. Satürn'ün Koç'a girişi ise bu özgürlük arzusunu disiplinle dengelemeyi hatırlatıyor.",
    ["Kolektif dönüşüm", "Özgür düşünce", "Sistem sorgulaması", "Yenilik", "Toplumsal etki"],
    "Her şeyi sorgulamak enerjini dağıtabilir — neye evet neye hayır diyeceğini netleştirmek 2026'da güç verir.",
    { behaviorTendency: "2026 yenilik ve özgürleşme enerjisi taşıyor. Kapılar açılıyor.", stressResponse: "Baskı altında yeni seçenekler arama ve ufku genişletme refleksi.", strength: "Adaptasyon, yenilik ve bağlantı kurma kapasitesi 2026'nın güçlü yanları.", riskArea: "Dağılmak veya bir türlü odaklanamamak dikkat gerektiriyor.", developmentSuggestion: "Birkaç önceliğe odaklanmak 2026 enerjisini katlar." }
  ),
  elementResult(
    "water",
    "Ruhsal Uyanış & Şifa Yılı",
    "Neptün Koç'ta: Eski Benlik Eriyor, Gerçek Ruh Doğuyor",
    "2026'da Neptün Koç burcuna geçiyor — ve bu geçiş su enerjisi taşıyanlar için en derin etkiyi yaratıyor. Neptün mistisizm, ruhsal algı ve şifa gezegenidir; Koç ise 'ben kimim?' sorusunun burcudur. Bu iki enerji bir araya gelince gerçekleşen şey, eski ve artık sana ait olmayan bir 'ben'in yavaşça erimesidir. Sana dayatılan roller, taşıdığın ama senin olmayan ağırlıklar 2026'da yüzeye çıkıyor. Su enerjisi taşıyanlar için bu yıl derin bir duygusal temizlik, şifa ve gerçek benliğe dönüş anlamına geliyor. Aynı zamanda Jüpiter'in Yengeç'teki hareketi duygusal bağları ve anlam aramasını besliyor — bu yıl içsel büyüme dışsal büyümenin önüne geçiyor.",
    ["Ruhsal uyanış", "Neptün şifası", "Duygusal temizlik", "Gerçek benlik", "Anlam derinliği"],
    "Tüm bu derin enerji bazen yorucu gelebilir — sınırları net tutmak ve dinlenmek 2026'da en büyük güçtür.",
    { behaviorTendency: "2026 derinleşme ve iyileşme enerjisiyle dolu.", stressResponse: "Zor anlarda içe dönme ve bağlantı arama güçlü tepki.", strength: "Empati, derin bağ kurma ve içsel güç 2026'nın güçlü yanları.", riskArea: "Aşırı içe kapanma veya hareketsizlik dikkat gerektiren alan.", developmentSuggestion: "Küçük dışsal adımlar 2026 içsel yolculuğunu tamamlıyor." }
  ),
];

export const ENERGY_2025_TEST: PersonalityTest = {
  id: "enerji-2025",
  slug: "enerji-2025",
  title: "2026'da Seni Ne Bekliyor?",
  description: "Yıl enerjisi herkese farklı kapılar açıyor. 8 soruyla 2026'daki astrolojik enerjini ve senin için ne sakladığını öğren.",
  duration: "3–4 dk",
  questionCount: 8,
  category: "spiritual",
  image: "/tests/aura.png",
  questions: [
    { id: "q1", text: "2026'da en çok ne değişmesini istiyorsun?", options: [{ id: "a", text: "Kariyerim, başarılarım ve görünürlüğüm", scores: el(2,0,0,0) }, { id: "b", text: "Finansal istikrarım ve güvenliğim", scores: el(0,2,0,0) }, { id: "c", text: "Özgürlüğüm ve yeni fırsatlarım", scores: el(0,0,2,0) }, { id: "d", text: "İlişkilerim ve duygusal hayatım", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Şu an hayatında en güçlü hissettiğin alan:", options: [{ id: "a", text: "Motivasyonum ve hedeflerime bağlılığım", scores: el(2,0,0,0) }, { id: "b", text: "Planlama ve adım adım ilerleme gücüm", scores: el(0,2,0,0) }, { id: "c", text: "Yeni fikirler üretme ve bağlantı kurma", scores: el(0,0,2,0) }, { id: "d", text: "Duygusal derinliğim ve empati kapasitem", scores: el(0,0,0,2) }] },
    { id: "q3", text: "2026'da bırakmak istediğin şey:", options: [{ id: "a", text: "Başarısızlık korkusu", scores: el(2,0,0,0) }, { id: "b", text: "Değişime direnç", scores: el(0,2,0,0) }, { id: "c", text: "Kısıtlamalar ve sınırlar", scores: el(0,0,2,0) }, { id: "d", text: "Geçmişin duygusal yükleri", scores: el(0,0,0,2) }] },
    { id: "q4", text: "Bu yıl seni en çok çeken tema:", options: [{ id: "a", text: "Kariyer atılımı ve tanınma", scores: el(2,0,0,0) }, { id: "b", text: "Finansal büyüme ve ev/yuva", scores: el(0,2,0,0) }, { id: "c", text: "Yeni ilişkiler, seyahat ve projeler", scores: el(0,0,2,0) }, { id: "d", text: "İçsel keşif ve anlamlı bağlar", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Yıl sonunda nasıl biri olmak istiyorsun?", options: [{ id: "a", text: "Daha güçlü, başarılı ve cesur", scores: el(2,0,0,0) }, { id: "b", text: "Daha istikrarlı, güvenli ve müreffeh", scores: el(0,2,0,0) }, { id: "c", text: "Daha özgür, bağlı ve yenilenmiş", scores: el(0,0,2,0) }, { id: "d", text: "Daha derin, şifalanmış ve sevgi dolu", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Şu an hayatında en eksik hissettiğin şey:", options: [{ id: "a", text: "Daha fazla eylem ve hız", scores: el(2,0,0,0) }, { id: "b", text: "Güvenlik ve sağlam bir zemin", scores: el(0,2,0,0) }, { id: "c", text: "Yenilik ve özgürlük", scores: el(0,0,2,0) }, { id: "d", text: "Anlam ve duygusal bağlantı", scores: el(0,0,0,2) }] },
    { id: "q7", text: "2026 için sana ilham veren cümle:", options: [{ id: "a", text: "\"Artık zamanı; cesaretini geri al.\"", scores: el(2,0,0,0) }, { id: "b", text: "\"Adım adım inşa et — gerisi gelir.\"", scores: el(0,2,0,0) }, { id: "c", text: "\"Merakını takip et, özgürce ilerle.\"", scores: el(0,0,2,0) }, { id: "d", text: "\"Kalbinin sesi seni doğru yere götürür.\"", scores: el(0,0,0,2) }] },
    { id: "q8", text: "2026'da hayatında en çok ne görmek isterdin?", options: [{ id: "a", text: "Büyük bir başarı veya dönüm noktası", scores: el(2,0,0,0) }, { id: "b", text: "Mali güven ve stabil bir yaşam", scores: el(0,2,0,0) }, { id: "c", text: "Heyecan verici yeni başlangıçlar", scores: el(0,0,2,0) }, { id: "d", text: "Derin bir aşk veya ruhsal büyüme", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: ENERGY_2025_RESULTS,
};

/* ================= TEST 25: HANGİ KOZMİK ARKETİPSİN? ================= */

const TAROT_RESULTS: TestResult[] = [
  elementResult(
    "fire",
    "Güneş Arketipi",
    "Neşe, Zafer & Canlılık",
    "Güneş arketipini taşıyorsun — en canlı ve en parlak enerji. Neşe, zafer ve canlılık senin alanın. Gittiğin her yere ışık götürüyorsun; insanlar yanında kendini daha iyi hissediyor. Güneş enerjisi engellerden geçmeyi, galip gelmeyi ve hayatı tam kucaklamayı simgeler.",
    ["Neşe ve canlılık", "İyimserlik", "Zafer enerjisi", "İlham verme", "Güç ve özgüven"],
    "Aşırı optimizm bazen gerçekçiliği gölgede bırakabilir — zaman zaman durup değerlendirmek gerekiyor.",
    { behaviorTendency: "Canlılık ve neşe doğal halin. Etrafına enerji ve ilham yayıyorsun.", stressResponse: "Zor anlarda bile pozitif bakış açısı ve çözüm odaklılık güçlü tepkin.", strength: "Neşe, özgüven ve ilham verme kapasitesi güçlü yanların.", riskArea: "Aşırı iyimserlik veya zorluğu küçümseme bazen sürprizlerle karşılaştırabilir.", developmentSuggestion: "Realist bir bakışı iyimserlikle dengelemek Güneş enerjisini güçlendiriyor." }
  ),
  elementResult(
    "earth",
    "Bereket & Üretim Arketipi",
    "Bolluk, Güç & Yaratıcılık",
    "Bereket ve üretim arketipini taşıyorsun — bolluk, üretkenlik ve besleyici güç. Doğayla, yaşam döngüleriyle ve yaratıcılıkla iç içesin. Etrafındakileri besliyor, büyütüyor ve güçlendiriyorsun. Bu arketip her şeyin vaktinde filizlendiğini, toprağa atılan tohumların sonunda hasat verdiğini hatırlatır.",
    ["Bolluk ve üretkenlik", "Besleyici güç", "Yaratıcılık", "Doğa ile uyum", "İstikrar"],
    "Başkalarını beslerken kendi ihtiyaçlarını ihmal etmek bu arketipin gölgesi — önce kendin için de güç doldur.",
    { behaviorTendency: "Üretme, besleyici olma ve güçlendirme doğal eğilimin.", stressResponse: "Zor anlarda somut adımlar atmak ve üretmek güçlü tepkin.", strength: "Bolluk, güvenilirlik ve besleyici enerji güçlü yanların.", riskArea: "Başkalarına aşırı odaklanıp kendini ihmal etmek tükenmeye yol açabilir.", developmentSuggestion: "Kendi ihtiyaçlarını önceliklendirmek bu arketipin enerjisini tamamlıyor." }
  ),
  elementResult(
    "air",
    "Usta & Stratejist Arketipi",
    "Zeka, Beceri & Ustalık",
    "Usta ve stratejist arketipini taşıyorsun — zeka, beceri ve üretkenlik gücü. Elindeki araçları mükemmel kullanıyorsun; fikirlerden somut sonuçlar yaratıyorsun. Bu arketip her şeyin mümkün olduğunu söyler — yeter ki odaklanasın ve bilgini eyleme dökesin. Senin için engeller birer çözülecek bulmaca.",
    ["Zeka ve beceri", "Strateji", "Çözüm üretme", "Odaklanma gücü", "İletişim"],
    "Dağılmak veya birden çok şeye odaklanmak bu arketipin gölgesi — tek bir şeyde derinleşmek gücü katlar.",
    { behaviorTendency: "Zeka ve beceriyi somut sonuçlara dönüştürme doğal eğilimin.", stressResponse: "Zor anlarda strateji kurmak ve kaynakları mobilize etmek güçlü tepkin.", strength: "Zeka, iletişim ve dönüştürme kapasitesi güçlü yanların.", riskArea: "Aşırı dağılmak veya kararsızlık bu arketipin enerjisini zayıflatabilir.", developmentSuggestion: "Odaklanmak ve bir işi tamamlamak bu arketipin özüdür." }
  ),
  elementResult(
    "water",
    "Ay & Sezgi Arketipi",
    "Sezgi, Derinlik & İç Bilgelik",
    "Ay ve sezgi arketipini taşıyorsun — iç bilgelik, derinlik ve empati. Görünmeyeni hissediyorsun; yüzeyden çok derine iniyorsun. Bu arketip rüyaların, sezgilerin ve derin anlayışın zamanını simgeler. Karmaşık görünen şeylerde anlam buluyorsun; karanlık anlarda bile yolunu buluyorsun.",
    ["Güçlü sezgi", "Derin empati", "İç bilgelik", "Duygusal zeka", "Anlam arama"],
    "Belirsizlikte aşırı düşünmek veya sınır koyamamak bu arketipin gölgesi — kendi sezgine güven.",
    { behaviorTendency: "Sezgi ve derinlik doğal navigasyon aracın. Görünmeyeni hissediyorsun.", stressResponse: "Zor anlarda içe dönme ve sezgine güvenme güçlü tepkin.", strength: "İç bilgelik, sezgisel zeka ve duygusal derinlik güçlü yanların.", riskArea: "Aşırı düşünme veya belirsizlikte kaybolmak zaman zaman zorluyor.", developmentSuggestion: "Sezgine güvenmek ve eyleme geçmek bu arketipin en güçlü hali." }
  ),
];

export const TAROT_TEST: PersonalityTest = {
  id: "tarot-kartin",
  slug: "tarot-kartin",
  title: "Hangi Kozmik Arketipsin?",
  description: "Astrolojinin dört temel enerjisinden hangisi senin ruhunu en iyi yansıtıyor? 8 soruyla keşfet.",
  duration: "3–4 dk",
  questionCount: 8,
  category: "spiritual",
  image: "/tests/aura.png",
  questions: [
    { id: "q1", text: "Bir odaya girdiğinde insanlar seni nasıl fark eder?", options: [{ id: "a", text: "Enerjimle ve sıcaklığımla — atmosferi değiştiririm", scores: el(2,0,0,0) }, { id: "b", text: "Sakinliğim ve öz güvenimle", scores: el(0,2,0,0) }, { id: "c", text: "Zekam ve konuşmalarımla", scores: el(0,0,2,0) }, { id: "d", text: "Gizemimle — insanlar merak ediyor", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Zor bir dönemde ne seni ayakta tutar?", options: [{ id: "a", text: "Sonsuz iyimserliğim ve enerji kaynağım", scores: el(2,0,0,0) }, { id: "b", text: "Yaratma ve inşa etme gücüm", scores: el(0,2,0,0) }, { id: "c", text: "Çözüm bulma ve analiz etme becerim", scores: el(0,0,2,0) }, { id: "d", text: "İçsel bilgeliğim ve sezgilerim", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Başkalarına nasıl yardım edersin?", options: [{ id: "a", text: "Onlara ilham verip enerji katarım", scores: el(2,0,0,0) }, { id: "b", text: "Somut destek, güvenilir bakım sunarım", scores: el(0,2,0,0) }, { id: "c", text: "Doğru bilgi ve strateji paylaşırım", scores: el(0,0,2,0) }, { id: "d", text: "Sezgisel anlayış ve derin dinleme veririm", scores: el(0,0,0,2) }] },
    { id: "q4", text: "En mutlu hissettiğin ortam:", options: [{ id: "a", text: "Neşeli, canlı, güneşli yerler ve kalabalıklar", scores: el(2,0,0,0) }, { id: "b", text: "Doğa, bahçe, bereketli ve sakin mekanlar", scores: el(0,2,0,0) }, { id: "c", text: "Kafe, kütüphane, tartışma ve fikir ortamları", scores: el(0,0,2,0) }, { id: "d", text: "Yalnız mekanlar, gece, su kenarı, sessizlik", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Sana en sık atfedilen özellik:", options: [{ id: "a", text: "Neşeli ve enerjik", scores: el(2,0,0,0) }, { id: "b", text: "Güçlü ve besleyici", scores: el(0,2,0,0) }, { id: "c", text: "Zeki ve yetenekli", scores: el(0,0,2,0) }, { id: "d", text: "Gizemli ve sezgisel", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Seçim anında ne yaparsın?", options: [{ id: "a", text: "Kalbime ve tutkuma göre seçerim", scores: el(2,0,0,0) }, { id: "b", text: "Uzun vadeli faydayı düşünürüm", scores: el(0,2,0,0) }, { id: "c", text: "Her şeyi analiz eder, en mantıklısını seçerim", scores: el(0,0,2,0) }, { id: "d", text: "İçimdeki sese göre seçerim, açıklayamam ama bilirim", scores: el(0,0,0,2) }] },
    { id: "q7", text: "Hayatta en çok değer verdiğin şey:", options: [{ id: "a", text: "Neşe ve anı yaşamak", scores: el(2,0,0,0) }, { id: "b", text: "Bolluk ve güvenlik", scores: el(0,2,0,0) }, { id: "c", text: "Bilgi ve özgürlük", scores: el(0,0,2,0) }, { id: "d", text: "Derin bağ ve anlam", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Ruhunu en iyi tanımlayan şey:", options: [{ id: "a", text: "Sönmeyen bir ışık — karanlığa savaş açıyorum", scores: el(2,0,0,0) }, { id: "b", text: "Verimli toprak — her tohum bende filizlenir", scores: el(0,2,0,0) }, { id: "c", text: "Keskin bir zihin — araçlarım elimde, gücüm odağımda", scores: el(0,0,2,0) }, { id: "d", text: "Derin bir okyanus — yüzey sakin, içte sonsuz", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: TAROT_RESULTS,
};

/* ================= TEST 26: ASTROLOJİK KARANLIK YANIN NE? ================= */

const SHADOW_ASTRO_RESULTS: TestResult[] = [
  elementResult(
    "fire",
    "Savaşan Gölge",
    "Kontrol Edilemeyen Ateş",
    "Karanlık yanın 'Savaşan Gölge' — kontrol edilemeyen ateş. Öfke anlarında veya güç kaybettiğinde içindeki savaşçı devreye giriyor ve bazen gerekenden fazlasını yakıyor. Bu gölge aslında güçlü bir koruma mekanizması; içindeki aslan savunmak için direnç gösteriyor. Ateşini fark etmek söndürmekten çok daha güçlü.",
    ["Güçlü öfke farkındalığı", "Koruma içgüdüsü", "Dönüştürücü enerji", "İrade", "Direniş"],
    "Gölgeyi bastırmak onu daha güçlü yapar — ateşi tanımak ve yönlendirmek gerçek dönüşüm.",
    { behaviorTendency: "Tehdit veya güç kaybı anlarında savaş modu devreye giriyor.", stressResponse: "Baskı altında dışarıya yansıyan yoğun tepkiler olabilir.", strength: "Güçlü koruma içgüdüsü ve dönüştürücü enerji güçlü yanların.", riskArea: "Anlık öfke veya aşırı kontrol ihtiyacı ilişkileri zorlayabilir.", developmentSuggestion: "Öfkenin tetikleyicilerini fark etmek ve duraklamak gölgeyi dönüştürüyor." }
  ),
  elementResult(
    "earth",
    "Donmuş Gölge",
    "Değişmez Katılık",
    "Karanlık yanın 'Donmuş Gölge' — değişmez katılık ve içine kapanma. Zor anlarda içine çekiliyor, duvarlar örüyor, kimseyi içeri almıyorsun. Bu donma aslında derin bir güvenlik ihtiyacından geliyor; toprak, kendi içinde kalarak hayatta kalmayı öğretti. Duvarların koruduğunu biliyorsun ama bazen kim için inşa edildiği unutuluyor.",
    ["Derin güvenlik ihtiyacı", "Sınır koyma kapasitesi", "Sabır", "Dayanıklılık", "İç güç"],
    "Tamamen kapanmak bazen en çok ihtiyaç duyulan bağlantıyı engelliyor — küçük açılımlar dönüşüm başlatır.",
    { behaviorTendency: "Tehdit veya kırılganlık anlarında içe çekilme ve duvar örme eğilimi.", stressResponse: "Baskı altında sessizleşme ve tamamen kontrol alma refleksi.", strength: "Dayanıklılık, sınır koruma ve iç güç güçlü yanların.", riskArea: "Aşırı kapanma veya bağlantı kesmek yalnızlığa yol açabilir.", developmentSuggestion: "Küçük kırılganlık anları seçmek donmuş gölgeyi çözüyor." }
  ),
  elementResult(
    "air",
    "Kayıp Gölge",
    "Hiçbir Yere Bağlanamayan Ruh",
    "Karanlık yanın 'Kayıp Gölge' — sürekli hareket eden, bir türlü kök salınamayan ruh. Duygular anlaşılamayacak kadar karmaşık hissettiriyor; çatışma yerine kaçmayı seçiyorsun. Bu gölge aslında özgürlüğün bedeli — hiçbir şeyle bütünleşmemek bazen en güvenli yer gibi geliyor. Ama kaçmak ve anlamak aynı şey değil.",
    ["Özgürlük ihtiyacı", "Zihinsel esneklik", "Adaptasyon", "Bağımsızlık", "Hız"],
    "Duygulardan kaçmak onları ortadan kaldırmıyor — durmak ve hissetmek kayıp gölgeyi dönüştürüyor.",
    { behaviorTendency: "Duygusal yoğunluk veya çatışma anlarında uzaklaşma ve analiz etme eğilimi.", stressResponse: "Baskı altında kaçma, konuyu değiştirme veya kafaya takma refleksi.", strength: "Esneklik, adaptasyon ve hız güçlü yanların.", riskArea: "Kaçma veya duygusal mesafe zaman zaman bağlantıları zayıflatıyor.", developmentSuggestion: "Durmak, hissetmek ve kalmayı seçmek kayıp gölgeyi dönüştürüyor." }
  ),
  elementResult(
    "water",
    "Boğulan Gölge",
    "Sınırsız Duygu Okyanusu",
    "Karanlık yanın 'Boğulan Gölge' — sınırsız bir duygu okyanusu. Kendi duyguların ve başkalarının yükleri iç içe geçiyor; ne seninki ne onlarınki anlaşılamıyor. Boğulma hissi aslında derin empati kapasitesinin gölgesi — hisseden bir kalp, sınır olmadan tükenebilir. Okyanusun gücü kıyılarından geliyor.",
    ["Derin empati", "Duygusal zeka", "Şifacı enerji", "Bağlantı kapasitesi", "Derinlik"],
    "Başkasını taşımak için önce kendi içinde güçlü kalman gerekiyor — sınırlar empatiyi öldürmez, güçlendirir.",
    { behaviorTendency: "Duygusal yoğunluk anlarında kendi ve başkasının hislerini birbirinden ayırt etme güçlüğü.", stressResponse: "Baskı altında içe çekilme, ağlama veya tükenme ihtimali.", strength: "Derin empati, şifacı enerji ve bağlantı kapasitesi güçlü yanların.", riskArea: "Aşırı yük taşıma veya sınır koyamamak duygusal tükenmeye yol açabilir.", developmentSuggestion: "Net sınırlar koymak empatiyi öldürmez — okyanusu güçlendirir." }
  ),
];

export const SHADOW_ASTRO_TEST: PersonalityTest = {
  id: "astrolojik-karanlik-yan",
  slug: "astrolojik-karanlik-yan",
  title: "Astrolojik Karanlık Yanın Ne?",
  description: "Her burçta bir gölge yaşıyor. 8 soruyla astrolojik karanlık yanını keşfet — çünkü gölgeyi tanımak en büyük güç.",
  duration: "3–4 dk",
  questionCount: 8,
  category: "psychology",
  image: "/tests/mind.png",
  questions: [
    { id: "q1", text: "Kimse görmeseydi ne yapardın?", options: [{ id: "a", text: "Bir mücadeleye girerdim ya da hakkımı arardım", scores: el(2,0,0,0) }, { id: "b", text: "Olduğum yerde kalırdım, kimseyle uğraşmazdım", scores: el(0,2,0,0) }, { id: "c", text: "Ortamdan uzaklaşır, özgürce kaybolurdum", scores: el(0,0,2,0) }, { id: "d", text: "Ağlar ya da sadece hissederdim", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Öfkelendiğinde ne yaparsın?", options: [{ id: "a", text: "Patlayarak dışarı veririm — hemen tepki", scores: el(2,0,0,0) }, { id: "b", text: "İçime gömer, günlerce sessizce taşırım", scores: el(0,2,0,0) }, { id: "c", text: "Mantıkla çözmeye çalışır, mesafe koyarım", scores: el(0,0,2,0) }, { id: "d", text: "Üzülür ve içime kapanırım", scores: el(0,0,0,2) }] },
    { id: "q3", text: "En büyük korkun:", options: [{ id: "a", text: "Güçsüz ya da yetersiz görünmek", scores: el(2,0,0,0) }, { id: "b", text: "Her şeyi kaybetmek ya da güvensiz kalmak", scores: el(0,2,0,0) }, { id: "c", text: "Özgürlüğünü yitirmek ya da sıkışmak", scores: el(0,0,2,0) }, { id: "d", text: "Gerçekten ve tamamen yalnız kalmak", scores: el(0,0,0,2) }] },
    { id: "q4", text: "Seni en çok ne tüketiyor?", options: [{ id: "a", text: "Hızlı ilerleyememek ve hareketsizlik", scores: el(2,0,0,0) }, { id: "b", text: "Hayatın benim kontrolüm dışında olması", scores: el(0,2,0,0) }, { id: "c", text: "Anlamadığım ya da bilemediğim şeyler", scores: el(0,0,2,0) }, { id: "d", text: "İnsanların duygusal ihtiyaçları", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Biri seni hayal kırıklığına uğratırsa:", options: [{ id: "a", text: "Kesip atarım — ikinci şans yok", scores: el(2,0,0,0) }, { id: "b", text: "İçim yanar ama yüzüme vurmamazlık ederim", scores: el(0,2,0,0) }, { id: "c", text: "Analiz eder, mesafe koyarım", scores: el(0,0,2,0) }, { id: "d", text: "Kendi payımı ararım — bir şeyi mi yanlış yaptım?", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Savunma mekanizman ne?", options: [{ id: "a", text: "Saldırıya geçerim ya da baskınlığımı gösteririm", scores: el(2,0,0,0) }, { id: "b", text: "Tamamen çekilirim, kapıyı kapatırım", scores: el(0,2,0,0) }, { id: "c", text: "Konuyu değiştirir ya da şakaya vururum", scores: el(0,0,2,0) }, { id: "d", text: "İnkar eder ya da yokmuş gibi davranırım", scores: el(0,0,0,2) }] },
    { id: "q7", text: "İçindeki en büyük çatışma:", options: [{ id: "a", text: "Harekete geçmek ile yavaşlamak arasında", scores: el(2,0,0,0) }, { id: "b", text: "Kontrolde kalmak ile bırakmak arasında", scores: el(0,2,0,0) }, { id: "c", text: "Bağlanmak ile özgür kalmak arasında", scores: el(0,0,2,0) }, { id: "d", text: "Sevmek ile kendini korumak arasında", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Sabah aynaya bakınca fark ettiğin his:", options: [{ id: "a", text: "\"Bugün de savaşacağım.\"", scores: el(2,0,0,0) }, { id: "b", text: "\"Bir gün daha atlatsam yeter.\"", scores: el(0,2,0,0) }, { id: "c", text: "\"Bugün ne öğrenebilir, nereye gidebilirim?\"", scores: el(0,0,2,0) }, { id: "d", text: "\"Bu dünyayla nasıl baş çıkabilirim?\"", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: SHADOW_ASTRO_RESULTS,
};

/* ================= TEST 27: AŞK DİLİN NE? ================= */

const LOVE_LANG_RESULTS: TestResult[] = [
  elementResult(
    "fire",
    "Sözler & Takdir",
    "Aşkını Kelimelerle Yaşarsın",
    "Aşk dilin sözler ve takdir. Sevdiğine söylenen doğru bir kelime, yazdığı kısa bir mesaj ya da verdiği samimi bir iltifat her şeyin önüne geçer. İçten sözler, 'ne kadar kıymetlisin' diyen bakışlar ve takdir anları sana sevginin en güçlü biçimi gibi gelir. Sessiz kalan sevgi seni içten içe yorar.",
    ["Söze değer verme", "Takdir alma ihtiyacı", "Duygusal ifade", "Cesur iletişim", "Motivasyon"],
    "Sözlere aşırı anlam yükleme ya da söylenmeyeni eksiklik gibi hissetmek zaman zaman zorluyor.",
    { behaviorTendency: "Sözel iletişim ve takdir güçlü ihtiyaçlar arasında.", stressResponse: "İlişkide sessizlik ya da takdir eksikliği içten içe yoruyor.", strength: "Duygusal ifade ve sözle sevgi gösterme kapasitesi güçlü.", riskArea: "Her kelimeye anlam yükleme ya da eleştiriyi fazla büyütme bazen zorluyor.", developmentSuggestion: "Sözlerin yanı sıra eylemleri de fark etmek ilişkiyi zenginleştirir." }
  ),
  elementResult(
    "earth",
    "Eylemlerle Gösterilen Sevgi",
    "Aşkını Yaparak Yaşarsın",
    "Aşk dilin eylemler. Sevdiğine çay yapan, 'arabana benzin koydum' diyen, fark etmeden yardım eden biri seni derinden etkiler. Sözden çok iş dili konuşursun; sevgi göstergesi büyük jestler değil, küçük ama tutarlı eylemlerdir. 'Seni düşündüm' demek için bir iş yapmak en doğal ifaden.",
    ["Pratik sevgi dili", "Tutarlı destek", "Güvenilir ortaklık", "Detaylara dikkat", "Sadakat"],
    "Karşılıksız kalan eylemleri kişisel bir reddediş olarak okuma riski var — bazen sadece görmemişlerdir.",
    { behaviorTendency: "Somut eylemler ve güvenilir destek temel sevgi dili.", stressResponse: "Karşılıksız kalan yardımlar zaman içinde birikip bunaltabilir.", strength: "Pratik destek, güvenilirlik ve tutarlı varlık güçlü yanlar.", riskArea: "Sözsüz hizmetin fark edilmemesi içten içe yorucu olabilir.", developmentSuggestion: "İhtiyaçlarını söylemek ve karşılıklılık beklemek sağlıklı bir adımdır." }
  ),
  elementResult(
    "air",
    "Kaliteli Zaman & Derin Sohbet",
    "Aşkını Birlikte Olarak Yaşarsın",
    "Aşk dilin kaliteli zaman ve derin sohbet. Telefonsuz, dikkatin tamamen sende olduğu anlar; saatlerce konuştuğunuz geceler; birlikte bir şeyler keşfetmek. Fiziksel olarak yanında ama 'uzak' biri seni bitiriyor. Gerçekten orada olmak, seni dinlemek — bunu verene çok güçlü bağlanıyorsun.",
    ["Tam dikkat", "Derin sohbet", "Birlikte keşif", "Zihinsel uyum", "Kaliteli an"],
    "Yalnız kalındığında ya da ilgi azaldığında hızla mesafe hissediyorsun — bu bazen fazla yorum yapılıyor.",
    { behaviorTendency: "Tam dikkat ve kaliteli birliktelik en güçlü ihtiyaç.", stressResponse: "Dikkat dağınıklığı veya yüzeysel vakit geçirme bağı zayıflatıyor.", strength: "Derin sohbet kapasitesi, anlayışlı varlık ve bağ kurma gücü.", riskArea: "İlgi azaldığında bağın bittiğini düşünmek bazen erken sonuçlara yol açıyor.", developmentSuggestion: "Kaliteli zamanı talep etmeyi öğrenmek ilişkiyi güçlendiriyor." }
  ),
  elementResult(
    "water",
    "Fiziksel Yakınlık & Dokunuş",
    "Aşkını Hissederek Yaşarsın",
    "Aşk dilin fiziksel yakınlık ve dokunuş. Bir el tutma, omza atılan bir dokunuş, uzun bir sarılma — bunlar senin için bin kelime söylüyor. Bedensel yakınlık, güvende hissettiriyor ve bağı canlı tutuyor. Dokunuşsuz geçen günler seni duygusal olarak uzaklaştırıyor; bu küçük anlar ilişkinin can damarı.",
    ["Fiziksel bağ", "Güven ve huzur", "Anlık bağlantı", "Şefkat", "Güvende hissetmek"],
    "Fiziksel mesafeyi duygusal mesafeyle karıştırmak zaman zaman yanlış yorumlara yol açıyor.",
    { behaviorTendency: "Fiziksel yakınlık ve dokunuş en güçlü bağlanma aracı.", stressResponse: "Dokunuş eksikliği çabuk yalnızlık ve mesafe hissettiriyor.", strength: "Şefkat, fiziksel bağ kurma ve güven ortamı yaratma güçlü yanlar.", riskArea: "Fiziksel mesafeyi duygusal mesafe olarak okumak yanlış anlaşılmalara yol açabilir.", developmentSuggestion: "İhtiyacını dile getirmek ve alternatif bağlanma biçimleri geliştirmek önemli." }
  ),
];

export const LOVE_LANG_TEST: PersonalityTest = {
  id: "ask-dili",
  slug: "ask-dili",
  title: "Aşk Dilin Ne?",
  description: "Sevgini ve ilgiyi nasıl alırsın, nasıl verirsin? 8 soruyla ilişkideki gerçek aşk dilini keşfet.",
  duration: "3–4 dk",
  questionCount: 8,
  category: "love",
  image: "/tests/love.png",
  questions: [
    { id: "q1", text: "Sevgilinden seni en mutlu eden şey:", options: [{ id: "a", text: "Sana ne kadar kıymet verdiğini söylemesi", scores: el(2,0,0,0) }, { id: "b", text: "Seni düşünerek küçük bir şey yapması", scores: el(0,2,0,0) }, { id: "c", text: "Telefonu bırakıp tamamen sana odaklanması", scores: el(0,0,2,0) }, { id: "d", text: "Elini tutması ya da sıkıca sarılması", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Sevgilinden uzak kaldığında en çok ne özlüyorsun?", options: [{ id: "a", text: "Güzel mesajlarını ve ilgi dolu sözlerini", scores: el(2,0,0,0) }, { id: "b", text: "Sana yaptıklarını, seni düşünerek davranmasını", scores: el(0,2,0,0) }, { id: "c", text: "Birlikte geçirdiğiniz sakin ve özel anları", scores: el(0,0,2,0) }, { id: "d", text: "Fiziksel yakınlığı, sarılmaları, dokunuşları", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Sevgilinin seni en iyi anladığını hissettiren şey:", options: [{ id: "a", text: "Ne hissettiğini tam doğru kelimelerle ifade etmesi", scores: el(2,0,0,0) }, { id: "b", text: "Söylemeden ne ihtiyacın olduğunu anlayıp yapması", scores: el(0,2,0,0) }, { id: "c", text: "Seni gerçekten dinlemesi, tamamen orada olması", scores: el(0,0,2,0) }, { id: "d", text: "Yorgunken omzuna yaslanmana izin vermesi", scores: el(0,0,0,2) }] },
    { id: "q4", text: "Kötü bir gün geçirince ne seni iyi eder?", options: [{ id: "a", text: "Güzel ve içten bir mesaj ya da telefon", scores: el(2,0,0,0) }, { id: "b", text: "Birinin gelip senin için bir şeyler yapması", scores: el(0,2,0,0) }, { id: "c", text: "Yanında sadece oturup konuşmak", scores: el(0,0,2,0) }, { id: "d", text: "Uzun bir sarılma", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Sevgilinden en çok ne canını sıkar?", options: [{ id: "a", text: "Seni takdir etmemesi, söylememesi", scores: el(2,0,0,0) }, { id: "b", text: "Söz verip yapmadıkları, ilgisiz kalması", scores: el(0,2,0,0) }, { id: "c", text: "Yanında ama aklı başka yerde olması", scores: el(0,0,2,0) }, { id: "d", text: "Soğuk davranması, mesafeli durması", scores: el(0,0,0,2) }] },
    { id: "q6", text: "İlişkide seni en iyi hissettiren an:", options: [{ id: "a", text: "İnandığını ve kıymetini bildiğini söylediğinde", scores: el(2,0,0,0) }, { id: "b", text: "Hayatını kolaylaştırmak için bir şey yaptığında", scores: el(0,2,0,0) }, { id: "c", text: "Sadece ikinizin olduğu, özel bir an yarattığında", scores: el(0,0,2,0) }, { id: "d", text: "Spontane bir şekilde yanına sokulup sarıldığında", scores: el(0,0,0,2) }] },
    { id: "q7", text: "Sevgilini en iyi nasıl memnun edersin?", options: [{ id: "a", text: "İçten ve doğrudan iltifatlar, teşekkür ederim demek", scores: el(2,0,0,0) }, { id: "b", text: "Küçük ama anlamlı şeyler yapmak", scores: el(0,2,0,0) }, { id: "c", text: "Tamamen orada olmak, birlikte bir şeyler paylaşmak", scores: el(0,0,2,0) }, { id: "d", text: "Dokunmak, yakınlık kurmak, şefkat göstermek", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Bir ilişkide olmak sana ne hissettiriyor?", options: [{ id: "a", text: "Değerli ve görüldüğümü hissediyorum", scores: el(2,0,0,0) }, { id: "b", text: "Birinin benim için orada olduğunu hissediyorum", scores: el(0,2,0,0) }, { id: "c", text: "Yalnız olmadığımı ve anlaşıldığımı hissediyorum", scores: el(0,0,2,0) }, { id: "d", text: "Güvende ve huzurlu hissediyorum", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: LOVE_LANG_RESULTS,
};

/* ================= TEST 28: HANGİ MÜZİK ENERJİSİSİN? ================= */

const MUSIC_RESULTS: TestResult[] = [
  elementResult(
    "fire",
    "Rock & Hip-Hop Enerjisi",
    "Ritim, Güç & İsyan",
    "Müzik enerjin rock ve hip-hop. Bu müzikler senin iç dünyanın sesini çıkarıyor — güç, ritim, isyan ve bireysellik. Bir şarkı tutarsa tüm gün kafanda çalıyor; konserde ön sırada, kulaklıkla adımlarına güç katarak yürüyorsun. Müzik senin için salt dinleme değil, enerji şarjı.",
    ["Enerji", "Güç", "Bireysellik", "Ritim", "Cesaret"],
    "Sakin ve yavaş müziklerle bağlantı kurmak zor gelebilir — ama bazen dinginlik de bir güç.",
    { behaviorTendency: "Enerjik, güçlü müzikler seni motive ediyor ve harekete geçiriyor.", stressResponse: "Stres anlarında güçlü ritimli müzikle boşalma eğilimi.", strength: "Enerji ve güç veren müziklerle yüksek motivasyon.", riskArea: "Duygusal müziklerden kaçmak bazen duyguları bastırmak anlamına gelebilir.", developmentSuggestion: "Zaman zaman sakin melodilerle de bağlantı kurmak iç dengeyi artırıyor." }
  ),
  elementResult(
    "earth",
    "Türk Müziği & Arabesk Enerjisi",
    "Kök, Derinlik & Duygu",
    "Müzik enerjin Türk sanat müziği, arabesk ve halk müziği. Bu sesler sende kök ve aidiyet hissi uyandırıyor. Bir şarkının sözü kalbine girdiğinde günlerce bırakmıyorsun. Müzik senin için gövdeye sinen bir şey — anı, yeri, duyguyu geri getiren bir zaman makinesi.",
    ["Kök", "Derinlik", "Aidiyet", "Duygusal hafıza", "Anlam"],
    "Yenilikçi müzik tarzlarına kapanmak zaman zaman keşiflerden mahrum bırakabilir.",
    { behaviorTendency: "Kökü derin, anlamlı sözlü müzikler güçlü bağlantı noktası.", stressResponse: "Zor anlarda tanıdık şarkılara dönme ve onlarla sakinleşme eğilimi.", strength: "Müziği derin hissetme ve anlamla bağdaştırma kapasitesi.", riskArea: "Sadece bilinen müziklerde kalmak yeni deneyimleri engelleyebilir.", developmentSuggestion: "Yeni tarzlarla da buluşmak müzik dünyasını genişletiyor." }
  ),
  elementResult(
    "air",
    "Pop & Elektronik Enerjisi",
    "Hareket, Yenilik & Özgürlük",
    "Müzik enerjin pop ve elektronik. Nabzı tutan, trend olan, hareket ettiren müzikler senin dünyanda. Yeni çıkan bir şarkıyı ilk dinleyenlerden olmak enerji veriyor; liste güncel, kulak taze. Müzik senin için renk gibi — her gün farklı, her ortama göre değişen, özgür bir ifade aracı.",
    ["Yenilik", "Hareket", "Özgürlük", "Güncellik", "Çeşitlilik"],
    "Derinlikli, yavaş müziklerle sabırsızlanmak zaman zaman güzel anlara kapıyı kapatıyor.",
    { behaviorTendency: "Güncel, enerjik ve çeşitli müzikler doğal tercih.", stressResponse: "Müziği hızlı değiştirerek ortama uyum sağlama eğilimi.", strength: "Geniş müzik perspektifi ve yeni şeylere açıklık.", riskArea: "Yüzeysel dinleme veya derine inmeden geçip gitme zaman zaman ortaya çıkabilir.", developmentSuggestion: "Tek bir albümü derinlemesine dinlemek yeni kapılar açıyor." }
  ),
  elementResult(
    "water",
    "R&B, Akustik & Soul Enerjisi",
    "His, Duygu & Derinlik",
    "Müzik enerjin R&B, akustik ve soul. Bu müzikler bir şeylere dokunuyor — kalbinin tam ortasına. Şarkıyı hissediyorsun, sadece duymuyor değil; sözleri içinde yankılanıyor, melodinin her nüansı sende bir şey uyandırıyor. Müzik senin için duygusal bir yolculuk; bazen ağlatıyor ama temizliyor.",
    ["His derinliği", "Empati", "Duygusal rezonans", "Melankolik güzellik", "Anlam"],
    "Müziğin duygusal ağırlığına fazla kapılmak bazen ruh halini etkileyebilir.",
    { behaviorTendency: "Duygusal derinliği olan müzikler güçlü rezonans yaratıyor.", stressResponse: "Zor anlarda müzikle duygu işleme ve içe dönme eğilimi.", strength: "Müziği derin hissetme ve onunla empati kurma kapasitesi.", riskArea: "Melankolik müzikle uzun süre kalmak bazen ruh halini ağırlaştırıyor.", developmentSuggestion: "Hisli dinlemenin yanında bazen enerjik müziklerle dengelemek güçlendiriyor." }
  ),
];

export const MUSIC_TEST: PersonalityTest = {
  id: "muzik-enerjisi",
  slug: "muzik-enerjisi",
  title: "Hangi Müzik Enerjisisin?",
  description: "Müzik sadece ses değil — seni anlatan bir dil. 8 soruyla ruhuna en çok dokunan müzik enerjisini keşfet.",
  duration: "3–4 dk",
  questionCount: 8,
  category: "personality",
  image: "/tests/personality.png",
  questions: [
    { id: "q1", text: "Sabah kalktığında kulaklığa ilk ne takarsın?", options: [{ id: "a", text: "Güçlü bir ritim — gün hazır, ben de hazırım", scores: el(2,0,0,0) }, { id: "b", text: "Tanıdık, bildik sevdiğim şarkılar", scores: el(0,2,0,0) }, { id: "c", text: "Günün havasına göre değişir, playlist'i karıştırırım", scores: el(0,0,2,0) }, { id: "d", text: "Hisli, sakin bir şey — günü yavaş açarım", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Stresli bir günde müzik sana ne yapıyor?", options: [{ id: "a", text: "Güçlendiriyor, enerjimi geri veriyor", scores: el(2,0,0,0) }, { id: "b", text: "Beni tanıdık bir yere götürüyor, sakinleşiyorum", scores: el(0,2,0,0) }, { id: "c", text: "Kafamı dağıtıyor, modumu değiştiriyor", scores: el(0,0,2,0) }, { id: "d", text: "Hislerimi işlemememi sağlıyor", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Arkadaşlarla araçtasın, müziği kim seçmeli?", options: [{ id: "a", text: "Ben — listemi zaten açık tutuyorum", scores: el(2,0,0,0) }, { id: "b", text: "Bilinen şeyler açılsın, herkes bilsin", scores: el(0,2,0,0) }, { id: "c", text: "Sırayla seçelim — herkesin tarzı olsun", scores: el(0,0,2,0) }, { id: "d", text: "Sakin bir şey açılsın, konuşabilelim", scores: el(0,0,0,2) }] },
    { id: "q4", text: "Bir şarkıyı tekrar tekrar dinleme sebebin:", options: [{ id: "a", text: "Ritmi ve enerjisi beni yakıyor", scores: el(2,0,0,0) }, { id: "b", text: "Sözleri benim için yazılmış gibi geliyor", scores: el(0,2,0,0) }, { id: "c", text: "Kancası kafama yapışıyor, çıkaramıyorum", scores: el(0,0,2,0) }, { id: "d", text: "Melodisi içime işliyor, hissettiriyor", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Bir konser/etkinliğe gidiyorsun. Nasıl bir şey?", options: [{ id: "a", text: "Büyük sahne, güçlü ses, kalabalık ve enerji dolu", scores: el(2,0,0,0) }, { id: "b", text: "Samimi ve sıcak, birlikte söylenen şarkılar", scores: el(0,2,0,0) }, { id: "c", text: "Yeni bir isim, farklı bir sahne deneyimi", scores: el(0,0,2,0) }, { id: "d", text: "Küçük, mahrem, akustik bir ortam", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Sözleri anlasan da anlamasan da dinleyebilir misin?", options: [{ id: "a", text: "Evet — ritim ve enerji yeterliyse anlam aramam", scores: el(2,0,0,0) }, { id: "b", text: "Hayır — sözler ve anlam çok önemli benim için", scores: el(0,2,0,0) }, { id: "c", text: "Evet — melodinin akışı sürükleyebiliyor", scores: el(0,0,2,0) }, { id: "d", text: "Duygu varsa anlarım — dilden bağımsız", scores: el(0,0,0,2) }] },
    { id: "q7", text: "Müzik listenin genel hali:", options: [{ id: "a", text: "Enerjik, güçlü, tempolu şeyler ağırlıkta", scores: el(2,0,0,0) }, { id: "b", text: "Yıllardır dinlediklerim, güvenilir klasiklerim", scores: el(0,2,0,0) }, { id: "c", text: "Çok çeşitli — her tarza bir şeyler var", scores: el(0,0,2,0) }, { id: "d", text: "Duygusal, sakin, hisli şeyler çoğunlukta", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Müzik olmadan hayat nasıl olurdu?", options: [{ id: "a", text: "Enerjisiz ve ilhamsız — dayanılmaz olurdu", scores: el(2,0,0,0) }, { id: "b", text: "Anlamsız — köküm kaybolurdu", scores: el(0,2,0,0) }, { id: "c", text: "Sıkıcı — renksiz bir dünya olurdu", scores: el(0,0,2,0) }, { id: "d", text: "Boş — duygularımı nereye koyacağımı bilemezdim", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: MUSIC_RESULTS,
};

/* ================= TEST 29: SOSYAL MEDYA KİŞİLİĞİN NE? ================= */

const SOCIAL_MEDIA_RESULTS: TestResult[] = [
  elementResult(
    "fire",
    "İçerik Üretici & Trend Belirleyici",
    "Sahnedesin — Feed Sana Göre Şekilleniyor",
    "Sosyal medyada içerik üretici ve trend belirleyici profildesin. Paylaşmak, göstermek ve etkilemek senin doğanın bir parçası. Takipçi sayısını değil, etkiyi önemsiyorsun; ama bir gönderinin yayılması da seni heyecanlandırıyor. Fikirlerin, tarzın ve bakış açın başkalarını harekete geçiriyor.",
    ["İçerik üretme", "Etki yaratma", "Trend yakalaması", "Karizmatik paylaşım", "Görünürlük"],
    "Beğeni ve etkileşim beklentisi zaman zaman özgün olmayı gölgeleyebilir.",
    { behaviorTendency: "Paylaşmak ve etkilemek güçlü bir dürtü.", stressResponse: "Tepki gelmediğinde motivasyon düşebilir.", strength: "İçerik üretme, trend yakalaması ve etki yaratma kapasitesi.", riskArea: "Onay bağımlılığı veya performatiflik zaman zaman ortaya çıkabilir.", developmentSuggestion: "İçerik üretirken 'bunu ben sevdim mi?' sorusu dengeyi koruyor." }
  ),
  elementResult(
    "earth",
    "Seçici Takipçi & Kalite Odaklı",
    "Az Ama Öz — Her Paylaşım Anlamlı",
    "Sosyal medyada seçici ve kalite odaklı profildesin. Rastgele beğenmiyorsun, rastgele takip etmiyorsun. Paylaşımların az ama her biri bir şey söylüyor. Algoritmanın sürüklediği değil, kendi kurduğun bir dijital dünya bu. Gereksiz gürültüden uzak, anlamlı içeriklerle bir araya geliyorsun.",
    ["Seçicilik", "Anlam arama", "Kalite", "Kontrollü paylaşım", "Güvenilirlik"],
    "Sosyal medyada az görünmek bağlantı fırsatlarını daraltabiliyor — bazen biraz daha açılmak kazandırıyor.",
    { behaviorTendency: "Az paylaş, dikkatli seç, anlamlı kal eğilimi.", stressResponse: "Gürültülü içerik anında ses kesilebilir veya takipten çıkılabilir.", strength: "Seçicilik, kalite odaklılık ve güvenilir dijital varlık.", riskArea: "Aşırı çekilme bazen izolasyona ya da kaçırılan fırsatlara yol açabilir.", developmentSuggestion: "Zaman zaman biraz daha görünür olmak yeni bağlantılar açıyor." }
  ),
  elementResult(
    "air",
    "Yorum & Paylaşım Yapan",
    "Bağlantı Kuran & Fikir Yayan",
    "Sosyal medyada bağlantı kurucu ve fikir yayan profildesin. İyi bir içerik gördüğünde paylaşmak, bir yorumla tartışmayı derinleştirmek, iki farklı insanı birbirine bağlamak sana doğal geliyor. Feed'in bir iletişim aracı; tüketmiyorsun, katılıyorsun. Fikirler seninle yayılıyor.",
    ["Bağlantı kurma", "Fikir paylaşımı", "Yorum yapma", "Tartışma açma", "Bilgi yayma"],
    "Her şeyi paylaşmak veya her tartışmaya girmek zaman içinde enerji tüketebilir.",
    { behaviorTendency: "Bağlantı kurmak ve fikir yaymak güçlü bir eğilim.", stressResponse: "Sessiz kalmak zor — bir yorum veya paylaşım ihtiyacı hissediliyor.", strength: "Bağlantı kurma, tartışma açma ve ağ genişletme kapasitesi.", riskArea: "Her şeye yorum yapmak zaman zaman yorucu veya yanlış anlaşılmalara yol açabiliyor.", developmentSuggestion: "Bazen sadece okuyup geçmek enerjiyi koruyor." }
  ),
  elementResult(
    "water",
    "Gizli İzleyici & Derin Okuyucu",
    "Görünmeden Her Şeyi Biliyorsun",
    "Sosyal medyada gizli izleyici ve derin okuyucu profildesin. Paylaşmıyorsun ama her şeyi görüyorsun. Beğeni atmıyorsun ama etkileniyorsun. Bir içerik seni gerçekten doldurduğunda çok nadiren paylaşıyorsun — çünkü paylaşmak samimiyetin bozulması gibi geliyor. Dijital dünyayı derinden ama sessizce hissediyorsun.",
    ["Derin okuma", "Seçici tepki", "Gözlem", "Gizlilik", "Duyarlılık"],
    "Tamamen görünmez kalmak bazen iyi içeriklerin ya da insanların seni fark etmesini engelliyor.",
    { behaviorTendency: "Gözlemlemek ve derinlemesine okumak tercih.", stressResponse: "Yoğun sosyal medya akışında ses kesmek veya çıkmak eğilimi.", strength: "Derin okuma, dikkatli gözlem ve seçici tepki kapasitesi.", riskArea: "Hiç görünmemek bazen fırsatları ve bağlantıları kaçırıyor.", developmentSuggestion: "Zaman zaman bir paylaşım ya da yorum seni doğru insanlarla buluşturabiliyor." }
  ),
];

export const SOCIAL_MEDIA_TEST: PersonalityTest = {
  id: "sosyal-medya-kisilik",
  slug: "sosyal-medya-kisilik",
  title: "Sosyal Medya Kişiliğin Ne?",
  description: "Feed'ine bakınca kim olduğun belli oluyor. 8 soruyla dijital dünyadaki gerçek kişiliğini keşfet.",
  duration: "3–4 dk",
  questionCount: 8,
  category: "personality",
  image: "/tests/personality.png",
  questions: [
    { id: "q1", text: "Son 24 saatte sosyal medyada ne yaptın?", options: [{ id: "a", text: "Bir şeyler paylaştım ya da story koydum", scores: el(2,0,0,0) }, { id: "b", text: "Baktım, beğendim, ama pek bir şey yapmadım", scores: el(0,2,0,0) }, { id: "c", text: "Bir şeyleri paylaştım veya yorum yaptım", scores: el(0,0,2,0) }, { id: "d", text: "Scrollladım ama hiç etkileşime girmedim", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Sosyal medyada en çok ne yapıyorsun?", options: [{ id: "a", text: "İçerik üretmek ya da fikrimi paylaşmak", scores: el(2,0,0,0) }, { id: "b", text: "Belirli hesapları takip edip kaliteli içerik izlemek", scores: el(0,2,0,0) }, { id: "c", text: "Yorum yazmak, paylaşmak, haber takip etmek", scores: el(0,0,2,0) }, { id: "d", text: "Sadece izlemek, kimseye bildirmeden", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Çok beğendiğin bir içerikle ne yaparsın?", options: [{ id: "a", text: "Paylaşır ya da aynı konuda kendim bir şey yaparım", scores: el(2,0,0,0) }, { id: "b", text: "Beğenirim, belki kaydederim", scores: el(0,2,0,0) }, { id: "c", text: "Arkadaşlarıma atarım ya da yorum yaparım", scores: el(0,0,2,0) }, { id: "d", text: "İzlerim, içim dolar, ama bir şey yazmam", scores: el(0,0,0,2) }] },
    { id: "q4", text: "Kaç hesabı takip ediyorsun yaklaşık?", options: [{ id: "a", text: "Çok — ne kadar fazla o kadar iyi", scores: el(2,0,0,0) }, { id: "b", text: "Az ve öz — gereksiz olanları temizledim", scores: el(0,2,0,0) }, { id: "c", text: "Orta — ama sürekli değişiyor", scores: el(0,0,2,0) }, { id: "d", text: "Az — sadece gerçekten sevdiklerimi", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Bir tartışma ya da haber gördüğünde:", options: [{ id: "a", text: "Fikir yazarım ya da story'ye çekerim", scores: el(2,0,0,0) }, { id: "b", text: "Okur, bir şey söylemem", scores: el(0,2,0,0) }, { id: "c", text: "Yorum yapar ya da arkadaşa iletirim", scores: el(0,0,2,0) }, { id: "d", text: "Okur, sindirir, içimde kalır", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Sosyal medyada en çok ne seni sinir eder?", options: [{ id: "a", text: "Beğeni gelmemesi ya da görmezden gelinmek", scores: el(2,0,0,0) }, { id: "b", text: "Kalitesiz, anlamsız içerik seli", scores: el(0,2,0,0) }, { id: "c", text: "Kimsenin gerçekten iletişim kurmaması", scores: el(0,0,2,0) }, { id: "d", text: "Sahtelik ve performans — herkes bir şey oynuyor", scores: el(0,0,0,2) }] },
    { id: "q7", text: "Bir hafta sosyal medya kullanmasan ne hissedersin?", options: [{ id: "a", text: "Bir şeyleri kaçırdığımı ve görünmez olduğumu", scores: el(2,0,0,0) }, { id: "b", text: "Rahatlama — zaten çok fazla giriyordum", scores: el(0,2,0,0) }, { id: "c", text: "Kopukluk — haberleri ve insanları kaçırırım", scores: el(0,0,2,0) }, { id: "d", text: "Pek fark etmez — çoğu zaman izlesem de girmesem de", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Sosyal medya profillerin genel olarak:", options: [{ id: "a", text: "Aktif — düzenli paylaşım, tutarlı estetik", scores: el(2,0,0,0) }, { id: "b", text: "Temiz ve seçici — az ama anlamlı içerik", scores: el(0,2,0,0) }, { id: "c", text: "Etkileşim odaklı — yorum, repost, bağlantı", scores: el(0,0,2,0) }, { id: "d", text: "Neredeyse boş ya da gizli — kimse görmüyor", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: SOCIAL_MEDIA_RESULTS,
};

/* ================= TEST 30: BASKI ALTINDA NASILSIN? ================= */

const PRESSURE_RESULTS: TestResult[] = [
  elementResult(
    "fire",
    "Savaş Modu",
    "Baskı Seni Yakıtıyor",
    "Baskı altında savaş moduna geçiyorsun. Tehdit veya zorluk hissedince harekete geçme refleksin devreye giriyor. Savaşıyorsun, direniyor, çözüme atıyorsun. Bu mod seni birçok zorluğun içinden çıkaran güçlü bir içgüdü. Ama bazen gereksiz yere çok enerji harcayarak küçük şeyleri de büyük savaşlara dönüştürebiliyorsun.",
    ["Hızlı aksiyon", "Kararlılık", "Direnç", "Koruma içgüdüsü", "Çözüm odaklılık"],
    "Her şeyi savaşa çevirmek zaman içinde yorucu — bazen geri adım atmak da güçtür.",
    { behaviorTendency: "Tehdit veya zorlukta harekete geçme ve savaşma refleksi güçlü.", stressResponse: "Baskı altında dışarıya yansıyan yoğun tepkiler ve hızlı aksiyon.", strength: "Hızlı karar verme, direniş ve çözüm odaklılık güçlü yanlar.", riskArea: "Her zorluğu büyük bir mücadele gibi hissetmek enerjini tüketiyor.", developmentSuggestion: "Hangi savaşları gerçekten vermek gerektiğini ayırt etmek güçlendiriyor." }
  ),
  elementResult(
    "earth",
    "Donma Modu",
    "Baskı Seni Durduruyor",
    "Baskı altında donma moduna geçiyorsun. Çok şey olunca veya zorlayıcı bir karar karşısında hareketsizleşebiliyor, geçiştirme moduna girebiliyorsun. Bu bazen gecikmeli ve içe dönerek tepki vermek anlamına geliyor. Aslında içinde çok şey yaşıyor — sadece dışarı çıkarmak zaman alıyor.",
    ["İçe dönme", "İşlem süreci", "Sabır", "Derin düşünme", "Öz koruma"],
    "Donup kalmak çözümü ertelediğinde sorunlar büyüyebilir — küçük bir adım dönüşümü başlatır.",
    { behaviorTendency: "Yoğun baskı anlarında hareketsizleşme ve içe dönme eğilimi.", stressResponse: "Baskı altında sessizleşme ve bekleyerek geçiştirme refleksi.", strength: "Derin işleme kapasitesi ve sabırlı yaklaşım güçlü yanlar.", riskArea: "Çok uzun donup kalmak sorunu büyütebilir.", developmentSuggestion: "Küçük bir eylem — bir adım — donma modundan çıkışı başlatıyor." }
  ),
  elementResult(
    "air",
    "Kaçış & Analiz Modu",
    "Baskı Seni Düşündürüyor",
    "Baskı altında kaçış ve analiz moduna geçiyorsun. Zorlayıcı durumdan uzaklaşmak, konuyu değiştirmek ya da her şeyi mantıksal çerçeveye oturtmaya çalışmak güçlü tepkilerin. Analiz ederek mesafe koyuyorsun — bu bazen harika bir çözüm üretiyor, bazen ise hislerden kaçmanın bir yolu oluyor.",
    ["Analiz", "Mesafe koyma", "Mantık", "Esneklik", "Kaçış kapısı"],
    "Duygulardan kaçarak çözmeye çalışmak bazen sorunun özüne hiç inmemeyi getiriyor.",
    { behaviorTendency: "Baskı altında mesafe koyma ve analiz etme refleksi güçlü.", stressResponse: "Konuyu değiştirme, mantıkla çözme ya da ortamdan uzaklaşma eğilimi.", strength: "Analiz etme, esneklik ve hızlı alternatif üretme kapasitesi.", riskArea: "Duygusal gerçeklerden kaçmak zaman zaman sorunun derinleşmesine yol açıyor.", developmentSuggestion: "Bir miktar durmak ve hissetmek analizi daha güçlü kılıyor." }
  ),
  elementResult(
    "water",
    "Uyum & İçe Çekilme Modu",
    "Baskı Seni İçine Sürüklüyor",
    "Baskı altında uyum ve içe çekilme moduna geçiyorsun. Çatışmadan kaçınmak, ortamı sakinleştirmek ya da sessizce içine çekilmek güçlü tepkilerin. Başkalarını üzmemek için kendi ihtiyaçlarını geri çekebiliyorsun. Bu derin şefkat kaynağından geliyor ama zaman zaman kendini kaybetmeye dönüşebilir.",
    ["Uyum sağlama", "Şefkat", "Çatışmadan kaçınma", "Sezgi", "İçe dönme"],
    "Sürekli uyum sağlamak ve kendininkini bastırmak zamanla büyük bir tükenmeye yol açıyor.",
    { behaviorTendency: "Çatışmadan kaçınma ve ortama uyum sağlama eğilimi güçlü.", stressResponse: "Baskı altında sessizleşme, geri çekilme ve barış koruma refleksi.", strength: "Şefkat, uyum kapasitesi ve derin sezgi güçlü yanlar.", riskArea: "Kendi ihtiyaçlarını bastırmak uzun vadede tükenme getiriyor.", developmentSuggestion: "İhtiyaçlarını dile getirmek hem seni hem ilişkiyi güçlendiriyor." }
  ),
];

export const PRESSURE_TEST: PersonalityTest = {
  id: "baski-altinda",
  slug: "baski-altinda",
  title: "Baskı Altında Nasıl Birisin?",
  description: "Zorlandığında, strese girdiğinde gerçek karakterin ortaya çıkıyor. 8 soruyla baskı altındaki modunu keşfet.",
  duration: "3–4 dk",
  questionCount: 8,
  category: "psychology",
  image: "/tests/mind.png",
  questions: [
    { id: "q1", text: "Beklenmedik kötü bir haberle karşılaştığında ilk tepkin:", options: [{ id: "a", text: "Ne yapabileceğimi bulmaya hemen başlarım", scores: el(2,0,0,0) }, { id: "b", text: "Donup kalır, ne yapacağımı bilemem", scores: el(0,2,0,0) }, { id: "c", text: "Aklımı toplar, mesafe koyarım", scores: el(0,0,2,0) }, { id: "d", text: "İçime çekilirim, kendimle baş başa kalmak isterim", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Biri seni eleştirince ne yaparsın?", options: [{ id: "a", text: "Hemen karşılık veririm — bence bu böyle değil", scores: el(2,0,0,0) }, { id: "b", text: "Bir şey söylemem ama içten içe çok taşırım", scores: el(0,2,0,0) }, { id: "c", text: "Mantıklı değerlendiririm — haklı mı?", scores: el(0,0,2,0) }, { id: "d", text: "Üzülür, kendimi küçük hissedebilirim", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Çok iş birikiyor, son tarih yaklaşıyor:", options: [{ id: "a", text: "Kol sıvayıp savaşırım — biter bu", scores: el(2,0,0,0) }, { id: "b", text: "Nereden başlayacağımı bilemez, yerinde sayarım", scores: el(0,2,0,0) }, { id: "c", text: "Listeye dökerim, önceliklendiririm", scores: el(0,0,2,0) }, { id: "d", text: "Biriyle konuşmak isterim, destek ararım", scores: el(0,0,0,2) }] },
    { id: "q4", text: "Biriyle anlaşmazlık yaşıyorsun:", options: [{ id: "a", text: "Direkt söylerim — kafama göre gider çözüme", scores: el(2,0,0,0) }, { id: "b", text: "Susar, uzaklaşırım — zamanla geçer", scores: el(0,2,0,0) }, { id: "c", text: "Analiz ederim — kimin haklı olduğunu anlamaya çalışırım", scores: el(0,0,2,0) }, { id: "d", text: "Barışı korumak için geri adım atarım", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Çok yorgunken bir istek daha geldi:", options: [{ id: "a", text: "İçten içe sinirlenirim ama yaparım", scores: el(2,0,0,0) }, { id: "b", text: "Hayır diyemez, donup kalırım", scores: el(0,2,0,0) }, { id: "c", text: "Ne zaman yapabileceğimi tartarım", scores: el(0,0,2,0) }, { id: "d", text: "Gönlüm yapmak ister ama içim parçalanır", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Sonucu değiştiremeyeceğin bir şeyle yüzleşince:", options: [{ id: "a", text: "Bir şekilde mücadele edebileceğim bir şey bulurum", scores: el(2,0,0,0) }, { id: "b", text: "Kabullenmek çok zaman alır, donabilirim", scores: el(0,2,0,0) }, { id: "c", text: "Mantıklı kabul ederim ama içim yavaş işler", scores: el(0,0,2,0) }, { id: "d", text: "Çok derinden hissederim, ağlamak gelir", scores: el(0,0,0,2) }] },
    { id: "q7", text: "Sınavdan önce ya da önemli bir sunum öncesi nasılsın?", options: [{ id: "a", text: "Heyecanlı ve hazır — gelin bakalım", scores: el(2,0,0,0) }, { id: "b", text: "Donmuş — ne çalışabiliyor ne dinlenebiliyorum", scores: el(0,2,0,0) }, { id: "c", text: "Listeyi yapar, her şeyi kontrol ederim", scores: el(0,0,2,0) }, { id: "d", text: "Kaygılı ama bunları göstermemeye çalışırım", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Baskı dönemlerinde seni kim görür?", options: [{ id: "a", text: "Herkes — çünkü aktif, enerjik, harekete geçmiş haldeyim", scores: el(2,0,0,0) }, { id: "b", text: "Kimse — çekilir giderim", scores: el(0,2,0,0) }, { id: "c", text: "Birkaç kişi — strateji konuşmak için seçilmişler", scores: el(0,0,2,0) }, { id: "d", text: "Yakınlarım — onlarla güvenlik buluyorum", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: PRESSURE_RESULTS,
};

/* ================= TEST 31: ARKADAŞLIK TARZIN NE? ================= */

const FRIENDSHIP_RESULTS: TestResult[] = [
  elementResult(
    "fire",
    "Lider & Organize Eden Arkadaş",
    "Sen Olmasaydın Grup Olmazdı",
    "Arkadaş grubunda lider ve organize eden profildesin. Plan yapan, insanları bir araya getiren, 'ne zaman buluşacağız?' sorusuna ilk cevap veren sensin. Enerjin grubu canlı tutuyor. Arkadaşlıktan çok fedakarlık yapıyor, önden gidiyorsun. Bazen yoruluyorsun ama bu senin doğanın bir parçası.",
    ["Liderlik", "Organize etme", "Buluşma kurma", "Enerji yayma", "Sadakat"],
    "Her zaman önce sen organize edersen zamanla yük haline gelebilir — bazen başkasının plan yapmasına izin ver.",
    { behaviorTendency: "Grubu organize etme ve önden gitme güçlü eğilim.", stressResponse: "Arkadaş grubunda gerilim olunca arabulucu veya yönlendirici olmak.", strength: "Liderlik, buluşturma ve güçlü grup bağı kurma kapasitesi.", riskArea: "Her zaman sen organize edersen zaman içinde yük hissedebilirsin.", developmentSuggestion: "Bazen geri çekilip başkasının önden gitmesine izin vermek dengeyi sağlar." }
  ),
  elementResult(
    "earth",
    "Güvenilir & Daima Hazır Arkadaş",
    "Herkes Seninle Güvende Hisseder",
    "Arkadaş grubunda güvenilir ve daima hazır profildesin. Herkes seni aradığında cevaplayansın; söz verdiğinde yapansın; en zor anda yanında olansın. Büyük jestler değil, küçük tutarlı anlar senin dünyan. İnsanlar seninle güvende hissediyor — bu derin bir güç.",
    ["Güvenilirlik", "Sadakat", "Tutarlılık", "Sözünde durma", "Sabır"],
    "Hep veren taraf olmak zaman içinde tükeniyor — bazen ihtiyacını söylemek de güç.",
    { behaviorTendency: "Güvenilir, tutarlı ve her koşulda hazır olmak güçlü eğilim.", stressResponse: "Arkadaş ihtiyaç duyduğunda ilk koşan olmak doğal tepki.", strength: "Güvenilirlik, sadakat ve derin bağ kurma kapasitesi.", riskArea: "Hep alan değil hep veren taraf olmak zamanla tükenmeye yol açabiliyor.", developmentSuggestion: "İhtiyacını dile getirmek ve karşılıklılık beklemek sağlıklı bir adım." }
  ),
  elementResult(
    "air",
    "Eğlenceli & Bağlantı Kuran Arkadaş",
    "Seninle Vakit Geçmek Hep İyi Hissettiriyor",
    "Arkadaş grubunda eğlenceli ve bağlantı kurucu profildesin. İnsanları birbirine tanıştıran, her gruba uyum sağlayan, 'onu siz tanışıyor musunuz?' diyen sensin. Yanında vakit geçirmek hafif ve keyifli; konuşmalar renkli. Yalnız geçirilen zaman seni yeniliyor; sosyal olmak sana enerji veriyor.",
    ["Bağlantı kurma", "Eğlence", "Uyum", "Geniş çevre", "Akıcı iletişim"],
    "Çok geniş bir çevre bazen derinliği zorlaştırabiliyor — az ama derin bağlar da besleyici.",
    { behaviorTendency: "İnsanları tanıştırmak, geniş çevre kurmak ve eğlenceyi getirmek güçlü eğilim.", stressResponse: "Sosyal ortamlarda enerji bulma ve atmosferi canlandırma refleksi.", strength: "Bağlantı kurma, uyum sağlama ve eğlence atmosferi yaratma kapasitesi.", riskArea: "Çok geniş çevre zaman zaman derinliği zorlaştırıyor.", developmentSuggestion: "Birkaç arkadaşla derin bağ kurmak sosyal dünyayı zenginleştiriyor." }
  ),
  elementResult(
    "water",
    "Dinleyen & Duygusal Destek Olan Arkadaş",
    "Herkes Sana Açılıyor",
    "Arkadaş grubunda dinleyen ve duygusal destek sunan profildesin. İnsanlar sana içlerini dökebiliyor — çünkü gerçekten dinliyorsun, yargılamıyorsun ve hissediyorsun. Arkadaşlıkta derinlik arıyorsun; yüzeysel buluşmalar seni tatmin etmiyor. Az ama çok derin arkadaşlıklara değer veriyorsun.",
    ["Derin dinleme", "Empati", "Yargısız varlık", "Derin bağ", "Duygusal güven"],
    "Herkesin yükünü taşımak zaman içinde seni tüketiyor — bazen kendi ihtiyacına dönmek gerekiyor.",
    { behaviorTendency: "Dinlemek, empati kurmak ve duygusal destek olmak güçlü eğilim.", stressResponse: "Arkadaş sıkıntısında çözüme değil dinlemeye odaklanma.", strength: "Derin empati, yargısız dinleme ve güven ortamı yaratma kapasitesi.", riskArea: "Herkesin yükünü taşımak uzun vadede tükeniyor.", developmentSuggestion: "Kendi ihtiyaçlarını da paylaşmak ve destek almak ilişkiyi dengeler." }
  ),
];

export const FRIENDSHIP_TEST: PersonalityTest = {
  id: "arkadaslik-tarzi",
  slug: "arkadaslik-tarzi",
  title: "Arkadaşlık Tarzın Ne?",
  description: "Arkadaşlıkta sen nasıl birisin? Koruyucu, güvenilir, eğlenceli mi? 8 soruyla arkadaşlık stilini keşfet.",
  duration: "3–4 dk",
  questionCount: 8,
  category: "personality",
  image: "/tests/personality.png",
  questions: [
    { id: "q1", text: "Arkadaş grubunda genellikle sen ne yaparsın?", options: [{ id: "a", text: "Plan kurar, buluşma organize ederim", scores: el(2,0,0,0) }, { id: "b", text: "Söyleneni yapar, güvenilir olmaya çalışırım", scores: el(0,2,0,0) }, { id: "c", text: "Eğlenceyi getiririm, herkesi birbirine bağlarım", scores: el(0,0,2,0) }, { id: "d", text: "Dinlerim, destek olurum", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Arkadaşın seni arayıp 'konuşmam lazım' dese:", options: [{ id: "a", text: "Ne oldu, nasıl çözeriz — hemen harekete geçerim", scores: el(2,0,0,0) }, { id: "b", text: "Ne gerekiyorsa yaparım, yanında olacağım", scores: el(0,2,0,0) }, { id: "c", text: "Buluşma ayarlar, dışarıya çıkarırım", scores: el(0,0,2,0) }, { id: "d", text: "Dinler, anlamaya çalışır, yargılamam", scores: el(0,0,0,2) }] },
    { id: "q3", text: "İdeal arkadaşlık nasıl olur?", options: [{ id: "a", text: "Aktif, birlikte iş yapılan, ortak hedefli", scores: el(2,0,0,0) }, { id: "b", text: "Güvenilir, tutarlı, sözünde duran", scores: el(0,2,0,0) }, { id: "c", text: "Eğlenceli, yeni şeyler keşfeden, bağlantılı", scores: el(0,0,2,0) }, { id: "d", text: "Derin, içten, her şeyi konuşabileceğin", scores: el(0,0,0,2) }] },
    { id: "q4", text: "Arkadaşlıkta seni en çok ne üzer?", options: [{ id: "a", text: "Planların bozulması veya ilgisizlik", scores: el(2,0,0,0) }, { id: "b", text: "Güvenin kırılması veya sözünde durulmaması", scores: el(0,2,0,0) }, { id: "c", text: "Monoton ve sıkıcı buluşmalar", scores: el(0,0,2,0) }, { id: "d", text: "Yüzeysel konuşmalar, gerçek anlamda bağlanılmaması", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Kaç yakın arkadaşın var?", options: [{ id: "a", text: "Geniş çevre — pek çok arkadaş grubum var", scores: el(2,0,0,0) }, { id: "b", text: "Belirli, güvenilir bir kaç kişi", scores: el(0,2,0,0) }, { id: "c", text: "Çok geniş — herkesle iyi geçiniyorum", scores: el(0,0,2,0) }, { id: "d", text: "Az ama çok derin bağım var", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Arkadaş grubunun seni tanımlaması:", options: [{ id: "a", text: "En çok plan yapan, organize eden", scores: el(2,0,0,0) }, { id: "b", text: "En güvenilir, sözünde duran", scores: el(0,2,0,0) }, { id: "c", text: "En eğlenceli, sosyal, herkesi tanıyan", scores: el(0,0,2,0) }, { id: "d", text: "En iyi dinleyen, içlerini döktükleri", scores: el(0,0,0,2) }] },
    { id: "q7", text: "Uzun süredir görmediğin biri aradığında:", options: [{ id: "a", text: "Hemen buluşma kurar, plan yaparım", scores: el(2,0,0,0) }, { id: "b", text: "Önce konuşur, hazır olduğumda buluşurum", scores: el(0,2,0,0) }, { id: "c", text: "Seve seve kabul ederim — yeni hikayeler isterim", scores: el(0,0,2,0) }, { id: "d", text: "Nasıl olduğunu sormak için gözlerim dolar neredeyse", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Arkadaşlıkta en güzel an:", options: [{ id: "a", text: "Hep birlikte bir şey başarınca", scores: el(2,0,0,0) }, { id: "b", text: "Zor günde yanında olmak ya da yanımda olmak", scores: el(0,2,0,0) }, { id: "c", text: "Yeni insanlar tanıyıp anlar oluşturduğumuzda", scores: el(0,0,2,0) }, { id: "d", text: "Sabaha kadar konuştuğumuz, hiç bitmesini istemediğim anlar", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: FRIENDSHIP_RESULTS,
};

/* ================= TEST 32: AURA RENGİN NE? ================= */

const AURA_RESULTS: TestResult[] = [
  elementResult("fire", "Kırmızı & Turuncu Aura", "Yakıcı Enerji", "Aura'n yoğun, dikkat çekici ve ısıtıcı. Odaya girdiğinde enerji değişiyor — insanlar bunu hissediyor. Tutku ve hareket senin frekansın; hayatı tam hızda yaşıyorsun. Kırmızı aura güç ve cesaret taşırken, turuncu yaratıcılık ve neşe yayıyor.", ["Karizmatik varlık", "Güçlü enerji yayma", "Doğal liderlik", "İlham verme"], "Bazen enerjin etrafındakileri bunaltabilir — herkeste aynı ateş yok."),
  elementResult("earth", "Yeşil Aura", "İyileştirici Enerji", "Aura'n sakin, besleyici ve güvenli. İnsanlar yanındayken neden bu kadar rahat hissettiklerini tam açıklayamıyor — çünkü yeşil aura iyileştirir, büyütür, güven verir. Doğayla, büyümeyle ve şefkatle titreşiyorsun.", ["Şefkat ve empati", "Güven ortamı yaratma", "İyileştirici varlık", "Sabır"], "Hep veren taraf olunca kendi enerjini yenilemek zor kalabilir."),
  elementResult("air", "Sarı & Beyaz Aura", "Işık Enerjisi", "Aura'n parlak, açık ve özgür titreşimli. Etrafındakilere bir hafiflik getiriyorsun — konuşmalar renkleniyor, merak uyanıyor. Sarı aura zeka ve neşeyle titreşirken, beyaz aura netlik ve özgürlük taşıyor.", ["Aydınlatıcı enerji", "Entelektüel çekim", "Özgürlük titreşimi", "Neşe yayma"], "Zaman zaman yüzeyde kalma ve derinleşmeme riski var."),
  elementResult("water", "Mavi & Mor Aura", "Mistik Enerji", "Aura'n derin, sezgisel ve gizemli. İnsanlar sana açılıyor ama tam neden olduğunu bilmiyor — çünkü mavi aura güven ve derinlik taşıyor, mor aura ise sezgi ve ruhsal bağlantı. Sen bu dünyada ama başka bir frekansta titreşiyorsun.", ["Güçlü sezgi", "Derin empati", "Ruhsal bağlantı", "Gizemli çekim"], "Duygu yoğunluğu zaman zaman seni yorabiliyor."),
];

export const AURA_TEST: PersonalityTest = {
  id: "aura-rengin",
  slug: "aura-rengin",
  title: "Aura Rengin Ne?",
  description: "Her insanın çevresinde görünmez bir enerji alanı var. 8 soruyla senin aura rengini ve enerjini keşfet.",
  duration: "3–4 dk",
  questionCount: 8,
  category: "spiritual",
  image: "/tests/aura.png",
  questions: [
    { id: "q1", text: "Bir odaya girdiğinde insanlar seni nasıl hisseder?", options: [{ id: "a", text: "Enerji değişir, ortam canlanır", scores: el(2,0,0,0) }, { id: "b", text: "Rahatlar, güvende hisseder", scores: el(0,2,0,0) }, { id: "c", text: "Merak uyandırırım, konuşmak isterler", scores: el(0,0,2,0) }, { id: "d", text: "Derin bir huzur ya da ağırlık hisseder", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Sabah uyandığında ilk hissin?", options: [{ id: "a", text: "Harekete geçmek istiyorum hemen", scores: el(2,0,0,0) }, { id: "b", text: "Güne hazırım, düzenli başlamak istiyorum", scores: el(0,2,0,0) }, { id: "c", text: "Aklım zaten düşüncelere başladı", scores: el(0,0,2,0) }, { id: "d", text: "Hala rüyalarla iç içeyim biraz", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Arkadaşların sana ne için gelir?", options: [{ id: "a", text: "Motivasyon ve enerji için", scores: el(2,0,0,0) }, { id: "b", text: "Destek ve tavsiye için", scores: el(0,2,0,0) }, { id: "c", text: "Farklı bir bakış açısı için", scores: el(0,0,2,0) }, { id: "d", text: "Anlaşılmak ve dinlenmek için", scores: el(0,0,0,2) }] },
    { id: "q4", text: "Müzik dinlerken nasılsın?", options: [{ id: "a", text: "Hareket etmek, dans etmek isterim", scores: el(2,0,0,0) }, { id: "b", text: "Rahatlarım, ortama uyum sağlarım", scores: el(0,2,0,0) }, { id: "c", text: "Sözleri dinler, anlam ararım", scores: el(0,0,2,0) }, { id: "d", text: "Duyguların içine dalarım", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Yorulduğunda ne seni en çok iyileştirir?", options: [{ id: "a", text: "Hareket, spor ya da yürüyüş", scores: el(2,0,0,0) }, { id: "b", text: "Düzeni korumak, iyi yemek, uyku", scores: el(0,2,0,0) }, { id: "c", text: "Podcast, kitap ya da yeni bir şey öğrenmek", scores: el(0,0,2,0) }, { id: "d", text: "Müzik, yalnızlık, içe dönmek", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Kalabalık bir partide neredesin?", options: [{ id: "a", text: "Ortanın tam merkezinde", scores: el(2,0,0,0) }, { id: "b", text: "Güvendiğim insanlarla konuşuyorum", scores: el(0,2,0,0) }, { id: "c", text: "Herkesle kısa sohbet, ilgi çekici konular", scores: el(0,0,2,0) }, { id: "d", text: "Sakin bir köşede, gerçekten bağlanacağım biriyle", scores: el(0,0,0,2) }] },
    { id: "q7", text: "Seni en iyi anlatan renk aralığı?", options: [{ id: "a", text: "Kırmızı, turuncu, ateş tonları", scores: el(2,0,0,0) }, { id: "b", text: "Yeşil, toprak, doğal tonlar", scores: el(0,2,0,0) }, { id: "c", text: "Beyaz, açık mavi, gümüş", scores: el(0,0,2,0) }, { id: "d", text: "Koyu mavi, mor, indigo", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Hayatta seni en çok besleyen?", options: [{ id: "a", text: "Hedefler, yarışmak ve kazanmak", scores: el(2,0,0,0) }, { id: "b", text: "İstikrar, güvenlik ve sevdiklerim", scores: el(0,2,0,0) }, { id: "c", text: "Öğrenmek, keşfetmek ve özgürlük", scores: el(0,0,2,0) }, { id: "d", text: "Derin bağlar, anlam ve duygusal derinlik", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: AURA_RESULTS,
};

/* ================= TEST 33: HANGİ ESTETİK SENİN? ================= */

const AESTHETIC_RESULTS: TestResult[] = [
  elementResult("fire", "Y2K & Bold Estetik", "Parlak, İddialı, Trend", "Renk, cesaret ve dikkat çekmek senin dünyan. Y2K estetiğinin parlak metalikleri, bold moda seçimleri ve 'ben buradayım' enerjisi tam sana göre. Trend olana değil, trendin tam ortasında olmaya yöneliyorsun — ve bu sana yakışıyor.", ["Cesur seçimler", "Trend öncülüğü", "Enerjik görünüm", "Dikkat çekici stil"], "Her şeyin çok hızlı geçtiği bir estetikte derinliği bulmak zor olabiliyor."),
  elementResult("earth", "Cottagecore & Dark Academia", "Kitaplar, Doğa, Zaman", "Eski kitapların kokusu, sonbahar ormanları, mumlar ve vintage kadifeler. Cottagecore'un sıcaklığı ile Dark Academia'nın entelektüel derinliği iç içe geçmiş bir dünyan var. Zamansız olan seni çekiyor — trendle değil, anlamla ilgileniyorsun.", ["Derin estetik duygu", "Doğayla bağ", "Entelektüel atmosfer", "Zamansız seçimler"], "Bazen dışarıda olup bitenlerden kopuk kalma riski var."),
  elementResult("air", "Minimalist & Clean Estetik", "Az ama Anlamlı", "Beyaz duvarlar, sade çizgiler, gereksiz hiçbir şey. Minimalizm senin için bir felsefe — az ama iyi, temiz ama canlı. Her nesne bir amaca hizmet ediyor. Zihin de, ortam da, stil de berrak ve özgür.", ["Net görünüm", "Amaçlı seçimler", "Rahatlatıcı sadelik", "Özgür hissettiren çevre"], "Bazen çok steril bir ortam duygusal derinliği zorlaştırabilir."),
  elementResult("water", "Mystical & Celestial Estetik", "Gece Gökyüzü, Ay ve Derin Renkler", "Galaksiler, ay evreleri, kadife dokular ve derin renkler. Gizemli olan seni çekiyor — görünür değil, hissedilen bir estetik bu. Duvarındaki harita yıldız haritası, playlist'inde ambient ve şiirsel sözler var. Sen bu dünyada ama başka bir boyutla temas halinde.", ["Mistik derinlik", "Sembolik düşünme", "Atmosfer yaratma", "Ruhsal estetik duygu"], "Çok içe dönük bir dünya dışarıyla bağlantıyı zorlaştırabilir."),
];

export const AESTHETIC_TEST: PersonalityTest = {
  id: "estetik-tarzin",
  slug: "estetik-tarzin",
  title: "Hangi Estetik Senin?",
  description: "Y2K mi, Dark Academia mı, Minimalist mi, Celestial mi? 8 soruyla senin dünyana en çok uyan estetiği bul.",
  duration: "3–4 dk",
  questionCount: 8,
  category: "personality",
  image: "/tests/personality.png",
  questions: [
    { id: "q1", text: "İdeal çalışma ortamın hangisi?", options: [{ id: "a", text: "Hareketli kafe, renkli, enerjik", scores: el(2,0,0,0) }, { id: "b", text: "Ahşap masa, doğal ışık, bitki", scores: el(0,2,0,0) }, { id: "c", text: "Tamamen sade, temiz bir masa", scores: el(0,0,2,0) }, { id: "d", text: "Gece lambası, mum, loş ışık", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Telefonunun duvar kağıdı genelde nasıl?", options: [{ id: "a", text: "Renkli, iddialı, dikkat çekici", scores: el(2,0,0,0) }, { id: "b", text: "Doğa, bitki ya da retro fotoğraf", scores: el(0,2,0,0) }, { id: "c", text: "Sade, neredeyse beyaz", scores: el(0,0,2,0) }, { id: "d", text: "Gece gökyüzü, ay, galaksi", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Favori zaman dilimin?", options: [{ id: "a", text: "Akşamüstü — şehrin en hareketli saati", scores: el(2,0,0,0) }, { id: "b", text: "Sabah erken — güneş ve huzur", scores: el(0,2,0,0) }, { id: "c", text: "Günün tazesinde — verimli saatler", scores: el(0,0,2,0) }, { id: "d", text: "Gece — dünyanın uyuduğu saatler", scores: el(0,0,0,2) }] },
    { id: "q4", text: "Playlist'inde ne baskın?", options: [{ id: "a", text: "Pop, hip-hop, trend şeyler", scores: el(2,0,0,0) }, { id: "b", text: "Klasikler, folk, vintage ses", scores: el(0,2,0,0) }, { id: "c", text: "Instrumental, minimal, ambient", scores: el(0,0,2,0) }, { id: "d", text: "Şiirsel sözler, indie, dark", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Favori stil/kıyafet tercihin?", options: [{ id: "a", text: "İddialı, renkli, trend parçalar", scores: el(2,0,0,0) }, { id: "b", text: "Vintage, katmanlı, sıcak dokular", scores: el(0,2,0,0) }, { id: "c", text: "Monochrome, minimal, sade", scores: el(0,0,2,0) }, { id: "d", text: "Derin renkler, kadife, gizemli", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Eve döndüğünde ilk ne yaparsın?", options: [{ id: "a", text: "Müziği aç, enerjini boşalt", scores: el(2,0,0,0) }, { id: "b", text: "Bir şeyler ye, düzenli rutin yap", scores: el(0,2,0,0) }, { id: "c", text: "Temizle, düzenle, sıfırla", scores: el(0,0,2,0) }, { id: "d", text: "Işıkları kıs, mum yak, müzik aç", scores: el(0,0,0,2) }] },
    { id: "q7", text: "Sosyal medyada ne tür içerikleri takip edersin?", options: [{ id: "a", text: "Trendsetterlar, moda, influencer", scores: el(2,0,0,0) }, { id: "b", text: "Bitki, doğa, DIY, tarif", scores: el(0,2,0,0) }, { id: "c", text: "Minimal tasarım, productivity, sanat", scores: el(0,0,2,0) }, { id: "d", text: "Astroloji, mistik, sanat, şiir", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Seni en çok heyecanlandıran keşif?", options: [{ id: "a", text: "Yeni trend, yeni kafe, yeni etkinlik", scores: el(2,0,0,0) }, { id: "b", text: "Eski kitap dükkanı, vintage pazar", scores: el(0,2,0,0) }, { id: "c", text: "Yeni bir fikir ya da farklı bakış açısı", scores: el(0,0,2,0) }, { id: "d", text: "Gece gökyüzü, gizli anlam, eski müzik", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: AESTHETIC_RESULTS,
};

/* ================= TEST 34: RUHUN KAÇ YAŞINDA? ================= */

const SOUL_AGE_RESULTS: TestResult[] = [
  elementResult("fire", "Genç Ruh", "18–25 Yaş Ruhu", "Ruhun taze, korkusuz ve meraklı. Dünyayı hâlâ büyük bir oyun alanı olarak görüyorsun — ve bu seni canlı tutuyor. Deneyim değil heves, temkinlilik değil cesaret senin frekansın. Genç ruhlar en yaratıcı ve en özgür ruhlar.", ["Korku tanımayan enerji", "Saf merak", "Anı yaşamak", "Yeniye açıklık"], "Acelesi olan genç ruh, bazen sabırsızlıkla fırsat kaçırabilir."),
  elementResult("earth", "Olgun Ruh", "30–45 Yaş Ruhu", "Ruhun deneyimli, sakin ve yerleşik. Hayatın büyük sorularını çoktan sordun — bazılarına cevap buldun, bazıları hâlâ açık ve bunu kabullenebildin. İstikrar ve derinlik senin için anlam taşıyor. Olgun ruhlar en güvenilir ve en sağlam ruhlar.", ["Deneyimden gelen bilgelik", "İstikrar", "Derin bağlar", "Hayatı sindirmiş olmak"], "Bazen değişime direnç ve rutine bağlılık gelişimi yavaşlatabilir."),
  elementResult("air", "Genç Yetişkin Ruh", "25–35 Yaş Ruhu", "Ruhun büyüyor, keşfediyor ve dönüşüyor. Ne tamamen bağlandın ne de tamamen özgürsün — tam da o güzel arafta. Soru sormaktan, öğrenmekten ve farklı bakış açılarını denemekten besleniyorsun.", ["Büyüme isteği", "Entelektüel merak", "Dengeli yaklaşım", "Öğrenmeye açıklık"], "Çok fazla seçenek arasında kalmak bazen yön kaybına neden olabiliyor."),
  elementResult("water", "Eski Ruh", "50+ Yaş Ruhu", "Ruhun bu dünyaya yabancı değil — defalarca gelmiş gibi hissettiriyor. Çoğu insanın görmediği şeyleri görüyorsun, hissettikleri şeyleri kelimeye dökmeden anlıyorsun. Eski ruhlar en derin, en sezgisel ve en mistik ruhlar.", ["Derin sezgi", "Zamansız bilgelik", "Güçlü empati", "Anlam arayışı"], "Bu dünyaya tam uyum sağlamak zaman zaman yorucu gelebilir."),
];

export const SOUL_AGE_TEST: PersonalityTest = {
  id: "ruh-yasin",
  slug: "ruh-yasin",
  title: "Ruhun Kaç Yaşında?",
  description: "Beden yaşın kaç olursa olsun ruhunun yaşı bambaşka. 8 soruyla ruhunun hangi evrede olduğunu keşfet.",
  duration: "3–4 dk",
  questionCount: 8,
  category: "spiritual",
  image: "/tests/aura.png",
  questions: [
    { id: "q1", text: "Sabah alarm çaldığında ne yaparsın?", options: [{ id: "a", text: "Hemen atlarım, günü kaçırmak istemem", scores: el(2,0,0,0) }, { id: "b", text: "Yavaş kalkarım, acelem yok", scores: el(0,2,0,0) }, { id: "c", text: "Aklım zaten uyumadan önce çalışmaya başladı", scores: el(0,0,2,0) }, { id: "d", text: "İstemeden gözlerim açılır, biraz daha uyumak isterdim", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Büyük bir hata yapınca ne olur?", options: [{ id: "a", text: "Ders çıkarırım, hızla devam ederim", scores: el(2,0,0,0) }, { id: "b", text: "Analiz eder, bir dahaki için plan yaparım", scores: el(0,2,0,0) }, { id: "c", text: "Farklı senaryoları düşünür, öğrenmeye çalışırım", scores: el(0,0,2,0) }, { id: "d", text: "Uzun süre içimde taşırım — derinden hissederim", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Çoğu insanla ilişkin nasıl?", options: [{ id: "a", text: "Kolay anlaşırım, geniş çevrem var", scores: el(2,0,0,0) }, { id: "b", text: "Seçiciyim ama bağlandığımda derin olur", scores: el(0,2,0,0) }, { id: "c", text: "Fikir alışverişi yapmayı severim", scores: el(0,0,2,0) }, { id: "d", text: "Az insanla, çok derin bağlar kuruyorum", scores: el(0,0,0,2) }] },
    { id: "q4", text: "Gelecek hakkında nasıl hissediyorsun?", options: [{ id: "a", text: "Heyecan verici! Neler olacak bilinmez", scores: el(2,0,0,0) }, { id: "b", text: "Hazırlıklı olunursa yönetilebilir", scores: el(0,2,0,0) }, { id: "c", text: "Merak ediyorum ama aşırı endişelenmiyorum", scores: el(0,0,2,0) }, { id: "d", text: "Gelecek gelir — hayat büyük bir döngü", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Enerji kaynağın ne?", options: [{ id: "a", text: "İnsanlar, etkinlikler ve hareket", scores: el(2,0,0,0) }, { id: "b", text: "Rutinler ve güvenli ortam", scores: el(0,2,0,0) }, { id: "c", text: "Yeni fikirler ve öğrenme", scores: el(0,0,2,0) }, { id: "d", text: "Sessizlik ve yalnızlık", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Çocukluğundan hâlâ taşıdığın his?", options: [{ id: "a", text: "Merak ve serbestlik", scores: el(2,0,0,0) }, { id: "b", text: "Güvenlik ihtiyacı", scores: el(0,2,0,0) }, { id: "c", text: "Soru sormak, anlamak istemek", scores: el(0,0,2,0) }, { id: "d", text: "Biraz yalnızlık ve farklılık hissi", scores: el(0,0,0,2) }] },
    { id: "q7", text: "Yaş hakkında ne düşünüyorsun?", options: [{ id: "a", text: "Hiç önemli değil — ruh genç kaldıkça tamam", scores: el(2,0,0,0) }, { id: "b", text: "Deneyim önemli, yaşla gelir", scores: el(0,2,0,0) }, { id: "c", text: "Bilgi önemli, yaşla doğru orantılı değil", scores: el(0,0,2,0) }, { id: "d", text: "Ruhun yaşı bedenin yaşından çok farklı olabilir", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Sana ruhunun kaç yaşında olduğunu sorsalar ne dersin?", options: [{ id: "a", text: "Çok genç hissediyorum", scores: el(2,0,0,0) }, { id: "b", text: "Yaşıma göre makul, olgunlaştım", scores: el(0,2,0,0) }, { id: "c", text: "Zihinsel olarak sürekli meşgulüm, durmak yok", scores: el(0,0,2,0) }, { id: "d", text: "Ruhum çok eski — bazen yoruyor", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: SOUL_AGE_RESULTS,
};

/* ================= TEST 35: İÇ SESİN NE DİYOR? ================= */

const INNER_VOICE_RESULTS: TestResult[] = [
  elementResult("fire", "Motive Edici İç Ses", "\"Yapabilirsin, hadi!\"", "Kafanın içindeki ses bir antrenör gibi — cesaretlendiren, harekete geçiren, 'devam et' diyen. Zor anlarda bile iç sesin seni bırakmıyor. Bu büyük bir güç; ama bazen o ses o kadar yüksek ki yorgunluğunu fark etmen gecikebilir.", ["Güçlü iç motivasyon", "Kendine inanç", "Hızla toparlanma", "Harekete geçme gücü"], "İç sesin zaman zaman sınırlarını görmezden gelmeni sağlayabilir."),
  elementResult("earth", "Pratik İç Ses", "\"Adım adım, sağlam git\"", "Kafanın içindeki ses bir mimar gibi — planlar, kontrol eder, 'bunu daha iyi yapabilirdin' der. Eleştirel ama yapıcı. Seni ileri götüren bu ses, ama çok sert konuştuğunda kendine karşı katı olabiliyorsun.", ["Detay farkındalığı", "Öz disiplin", "Güçlü özeleştiri", "Sürekli gelişim isteği"], "İç sesin bazen çok katı ve mükemmeliyetçi olabilir."),
  elementResult("air", "Analitik İç Ses", "\"Düşün, mantıklı bak\"", "Kafanın içindeki ses bir dedektif gibi — sorgular, analiz eder, 'neden böyle oldu?' diye sorar. Duygulardan önce anlam arıyorsun. Bu zihin berraklığı güçlü; ama bazen aşırı düşünmek ve analiz felci sana engel olabiliyor.", ["Zihin berraklığı", "Problem çözme", "Nesnel bakış", "Derin analiz"], "Çok fazla analiz bazen hareketi engelleyebilir."),
  elementResult("water", "Duygusal İç Ses", "\"Hissediyorum, anlıyorum\"", "Kafanın içindeki ses bir şair gibi — hisseder, derinleşir, 'bu beni nasıl etkiliyor?' diye sorar. Duygular senin için hem pusula hem yük. Bu derin his kapasitesi büyük bir güç — ama yoğun anlarda kendini bunalmış hissedebiliyorsun.", ["Derin duygusal zeka", "Güçlü empati", "Sezgisel anlayış", "Kendini tanıma"], "Duygular çok yoğunlaşınca nesnel karar almak güçleşiyor."),
];

export const INNER_VOICE_TEST: PersonalityTest = {
  id: "ic-sesin",
  slug: "ic-sesin",
  title: "İç Sesin Ne Diyor?",
  description: "Herkesin kafasında bir iç ses var. Seninki seni motive mi eder, eleştirir mi, analiz mi yapar? 8 soruyla öğren.",
  duration: "3–4 dk",
  questionCount: 8,
  category: "psychology",
  image: "/tests/mind.png",
  questions: [
    { id: "q1", text: "Zor bir karar öncesi kafanda ne döner?", options: [{ id: "a", text: "\"Atlıyorum, sonra hallederim\"", scores: el(2,0,0,0) }, { id: "b", text: "\"Artısını eksisini sayalım\"", scores: el(0,2,0,0) }, { id: "c", text: "\"Tüm senaryoları düşüneyim\"", scores: el(0,0,2,0) }, { id: "d", text: "\"İçim ne diyor?\"", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Başarılı olduğunda kendine ne dersin?", options: [{ id: "a", text: "\"Evet! Devam!\"", scores: el(2,0,0,0) }, { id: "b", text: "\"Doğru yaptım, beklenendi\"", scores: el(0,2,0,0) }, { id: "c", text: "\"Anladım artık nasıl çalışıyor\"", scores: el(0,0,2,0) }, { id: "d", text: "\"Hak ediyordum, iyi ki oldu\"", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Bir şey yolunda gitmediğinde ilk tepkin?", options: [{ id: "a", text: "\"Bir yol bulurum, sorun değil\"", scores: el(2,0,0,0) }, { id: "b", text: "\"Nerede hata yaptım?\"", scores: el(0,2,0,0) }, { id: "c", text: "\"Neden olduğunu anlamak istiyorum\"", scores: el(0,0,2,0) }, { id: "d", text: "\"Çok üzüldüm, bunu hissetmem lazım\"", scores: el(0,0,0,2) }] },
    { id: "q4", text: "Birine kızdığında kafanda ilk ne geçer?", options: [{ id: "a", text: "\"Hemen söylemeliyim\"", scores: el(2,0,0,0) }, { id: "b", text: "\"Sakin ol, söze bak\"", scores: el(0,2,0,0) }, { id: "c", text: "\"Haklı mı haksız mı diye değerlendiriyorum\"", scores: el(0,0,2,0) }, { id: "d", text: "\"İçim yanıyor ama üzmek istemiyorum\"", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Sabah aynaya bakınca iç sesin ne der?", options: [{ id: "a", text: "\"Hazırım, gelsin\"", scores: el(2,0,0,0) }, { id: "b", text: "\"Güne hazır mıyım?\"", scores: el(0,2,0,0) }, { id: "c", text: "\"Bugün ne yapacağım?\"", scores: el(0,0,2,0) }, { id: "d", text: "\"Nasıl hissediyorum?\"", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Sıkıldığında iç sesin ne der?", options: [{ id: "a", text: "\"Bir şeyler yap, harekete geç\"", scores: el(2,0,0,0) }, { id: "b", text: "\"Liste yap, yapılacaklar var\"", scores: el(0,2,0,0) }, { id: "c", text: "\"Yeni bir şey öğren ya da keşfet\"", scores: el(0,0,2,0) }, { id: "d", text: "\"Film izle, müzik dinle, içine bak\"", scores: el(0,0,0,2) }] },
    { id: "q7", text: "Başarısız olduğunda kendine nasıl davranırsın?", options: [{ id: "a", text: "\"Olmadı, ama devam — bir dahaki\"", scores: el(2,0,0,0) }, { id: "b", text: "\"Neyi daha iyi yapabilirdim?\"", scores: el(0,2,0,0) }, { id: "c", text: "\"Sistematik analiz — nerede hata var?\"", scores: el(0,0,2,0) }, { id: "d", text: "\"Çok üzüldüm, toparlanmam biraz zaman alır\"", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Yatmadan önce kafanda neler döner?", options: [{ id: "a", text: "\"Yarın ne yapacağım?\"", scores: el(2,0,0,0) }, { id: "b", text: "\"Bugün her şeyi yaptım mı?\"", scores: el(0,2,0,0) }, { id: "c", text: "Düşünceler, sorular, fikirler…", scores: el(0,0,2,0) }, { id: "d", text: "Bugünün duyguları, anlar, hisler…", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: INNER_VOICE_RESULTS,
};

/* ================= TEST 36: STRES ANINDA KAÇIŞ BİÇİMİN NE? ================= */

const ESCAPE_RESULTS: TestResult[] = [
  elementResult("fire", "Hareket & Aksiyon", "Bedenin Çözümü Biliyor", "Stres gelince bedenin devreye giriyor — koşarsın, temizlersin, bir projeye atılırsın. Hareketsiz kalmak seni daha da sıkıştırıyor. Bu aktif kaçış biçimi çok sağlıklı; enerjiyi vücuttan geçirip boşaltıyorsun.", ["Bedensel farkındalık", "Aktif stres boşaltma", "Hızlı toparlanma", "Verimliliğe dönüşen enerji"], "Bazen durmak ve hissetmek yerine sürekli hareket etmek duyguları erteleyebilir."),
  elementResult("earth", "Rutin & Konfor", "Düzen Seni İyileştiriyor", "Stres gelince güvenli alana dönüyorsun — iyi yemek, uyku, düzen. Rutin senin için terapi. Karmaşa içinde bile bir düzen noktası buluyorsun ve oradan iyileşiyorsun. Bu kaçış biçimi sağlam ve sürdürülebilir.", ["Kendi kendine bakım", "Düzeni yeniden kurma", "Rutin gücü", "Zemine dönme"], "Bazen konfor alanı dışına çıkması gereken bir şeyi kaçırmak olabilir."),
  elementResult("air", "Kaçış & Keşif", "Aklın Yeni Bir Kapı Açıyor", "Stres gelince aklını meşgul ediyorsun — dizi, podcast, yeni bir şey öğrenmek. Zihni başka yere çekmek senin stres vanaslın. Bu kaçış biçimi yaratıcı ve besleyici; merak seni iyileştiriyor.", ["Merak yoluyla iyileşme", "Zihinsel esneklik", "İçerik seçiciliği", "Yeni ilgi alanı açma"], "Bazen duyguları işlemek yerine aklı meşgul etmek bastırmaya dönebilir."),
  elementResult("water", "İçe Çekilme", "Sessizlik Seni Topluyor", "Stres gelince içine çekiliyorsun — müzik, loş ışık, yalnızlık. Duyguları serbest bırakmak senin iyileşme biçimin. Ağlamak, günlük yazmak, hissetmek — bunlar senin için güçtür, zayıflık değil.", ["Duygusal zeka", "Kendini tanıma", "Derinlemesine işleme", "Sessizliği kullanma gücü"], "Çok uzun süre içe çekilmek yalnızlığı derinleştirebilir."),
];

export const ESCAPE_TEST: PersonalityTest = {
  id: "kacis-bicimin",
  slug: "kacis-bicimin",
  title: "Stres Anında Kaçış Biçimin Ne?",
  description: "Bunaldığında ne yapıyorsun — koşuyor musun, uyuyor musun, dizi mi izliyorsun? 8 soruyla stres tarzını öğren.",
  duration: "3–4 dk",
  questionCount: 8,
  category: "psychology",
  image: "/tests/mind.png",
  questions: [
    { id: "q1", text: "Çok stresli bir günün sonunda ilk ne yaparsın?", options: [{ id: "a", text: "Spor, hareket ya da hızlı yürüyüş", scores: el(2,0,0,0) }, { id: "b", text: "Ev yemeği ya da sevdiğim bir şey yerim", scores: el(0,2,0,0) }, { id: "c", text: "Dizi, podcast ya da yeni bir şeyle ilgilenirim", scores: el(0,0,2,0) }, { id: "d", text: "Müzik açar, yalnız kalırım", scores: el(0,0,0,2) }] },
    { id: "q2", text: "Kafan çok dolduğunda ne işe yarar?", options: [{ id: "a", text: "Bedenini çalıştırmak", scores: el(2,0,0,0) }, { id: "b", text: "İyi bir uyku ya da düzeni geri getirmek", scores: el(0,2,0,0) }, { id: "c", text: "Aklını başka yöne çekmek", scores: el(0,0,2,0) }, { id: "d", text: "Duyguları serbest bırakmak", scores: el(0,0,0,2) }] },
    { id: "q3", text: "Zor bir konuşmanın hemen ardından ne yaparsın?", options: [{ id: "a", text: "Bir aktiviteye atlarım, kafamı dağıtırım", scores: el(2,0,0,0) }, { id: "b", text: "Bir şeyler yer, eve döner, toparlanırım", scores: el(0,2,0,0) }, { id: "c", text: "Düşüncelerimi kafamda işlerim, belki yazarım", scores: el(0,0,2,0) }, { id: "d", text: "Ağlamak ya da müzikle duyguyu serbest bırakmak", scores: el(0,0,0,2) }] },
    { id: "q4", text: "\"Bunaldım\" hissi gelince ilk tepkin?", options: [{ id: "a", text: "Dışarı çıkar, hareket ederim", scores: el(2,0,0,0) }, { id: "b", text: "Listeye döker, düzeni kurarım", scores: el(0,2,0,0) }, { id: "c", text: "Dikkatimi dağıtacak bir içerik bulurum", scores: el(0,0,2,0) }, { id: "d", text: "Sessizliğe ihtiyacım var, yalnız kalırım", scores: el(0,0,0,2) }] },
    { id: "q5", text: "Sosyal medyada stresli anında ne açarsın?", options: [{ id: "a", text: "Motivasyon, spor, aksiyon içerikleri", scores: el(2,0,0,0) }, { id: "b", text: "Tarif, düzen, konfor içerikleri", scores: el(0,2,0,0) }, { id: "c", text: "Belgesel, bilgi, ilgi çekici şeyler", scores: el(0,0,2,0) }, { id: "d", text: "Müzik, lofi, duygusal içerik", scores: el(0,0,0,2) }] },
    { id: "q6", text: "Tatilde bile stres varsa ne yaparsın?", options: [{ id: "a", text: "Aktivite dolu program yaparım", scores: el(2,0,0,0) }, { id: "b", text: "Erken uyurum, yemek yerim", scores: el(0,2,0,0) }, { id: "c", text: "Kitap okur ya da yeni yer keşfederim", scores: el(0,0,2,0) }, { id: "d", text: "Sahilde ya da odamda yalnız vakit geçiririm", scores: el(0,0,0,2) }] },
    { id: "q7", text: "Seni en çok rahatlatan ortam?", options: [{ id: "a", text: "Hareket halindeyken, dışarıda", scores: el(2,0,0,0) }, { id: "b", text: "Kendi evimde, düzenli ortamda", scores: el(0,2,0,0) }, { id: "c", text: "Yeni bir ortam, farklı atmosfer", scores: el(0,0,2,0) }, { id: "d", text: "Karanlık, sessiz, yalnız bir köşe", scores: el(0,0,0,2) }] },
    { id: "q8", text: "Stres sonrası iyileşince ne dersin?", options: [{ id: "a", text: "\"Hareket ettim, geçti\"", scores: el(2,0,0,0) }, { id: "b", text: "\"Uyudum/yedim, düzeldim\"", scores: el(0,2,0,0) }, { id: "c", text: "\"Başka şeyle ilgilendim, geçti\"", scores: el(0,0,2,0) }, { id: "d", text: "\"Ağladım/dinledim, boşaldım\"", scores: el(0,0,0,2) }] },
  ],
  resultTemplates: ESCAPE_RESULTS,
};

/* ================= EXPORT ALL (36 TEST) ================= */

export const TESTS: PersonalityTest[] = [
  AURA_TEST,
  AESTHETIC_TEST,
  SOUL_AGE_TEST,
  INNER_VOICE_TEST,
  ESCAPE_TEST,
  SOULMATE_TEST,
  PAST_LIFE_TEST,
  PLANET_TEST,
  ENERGY_2025_TEST,
  TAROT_TEST,
  SHADOW_ASTRO_TEST,
  LOVE_LANG_TEST,
  MUSIC_TEST,
  SOCIAL_MEDIA_TEST,
  PRESSURE_TEST,
  FRIENDSHIP_TEST,
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
