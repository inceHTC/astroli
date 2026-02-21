/* ================= TYPES ================= */

export interface TestOption {
  id: string;
  text: string;
  weight: Record<string, number>;
}

export interface TestQuestion {
  id: string;
  text: string;
  options: TestOption[];
}

export interface TestResult {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  strengths: string[];
  shadowSide: string;
  elementBreakdown: Record<string, number>;
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

function elementResult(
  id: string,
  title: string,
  subtitle: string,
  description: string,
  strengths: string[],
  shadowSide: string
): TestResult {
  const breakdown: Record<string, number> = { fire: 25, earth: 25, air: 25, water: 25 };
  breakdown[id] = 70;
  const others = (["fire", "earth", "air", "water"] as const).filter((e) => e !== id);
  others.forEach((e) => (breakdown[e] = 10));
  return { id, title, subtitle, description, strengths, shadowSide, elementBreakdown: breakdown };
}

/* ================= TEST 1: HANGİ ELEMENT SENSİN? ================= */

const ELEMENT_RESULTS: TestResult[] = [
  elementResult(
    "fire",
    "Ateş Elementi",
    "Tutkulu & Enerjik",
    "Hayatta hareket ve cesaret senin dilin. Risk almaktan çekinmiyorsun; zorluklar seni motive ediyor. Liderlik doğal geliyor ve çevrendekilere ilham veriyorsun. Durgunluk seni yorar; hedefe odaklı ve tutkulusun.",
    ["Cesaret", "Liderlik", "Enerji", "Tutku", "Kararlılık"],
    "Sabırsızlık, ani öfke ve başkalarının hızına tahammülsüzlük. Dinlemek yerine harekete geçmek isteyebilirsin."
  ),
  elementResult(
    "earth",
    "Toprak Elementi",
    "Güvenilir & Sabırlı",
    "Gerçekçi ve sağlam adımlar atıyorsun. Güvenlik ve istikrar senin için önemli; sözünün eri ve planlısın. İnsanlar sana güvenir; işleri bitirmekte ve sorumluluk almaktaki yeteneğin belirgin.",
    ["Sabır", "Planlama", "İstikrar", "Sorumluluk", "Güvenilirlik"],
    "Değişime direnç, aşırı kontrol ihtiyacı ve bazen esnek olamama. Risk almaktan kaçınabilirsin."
  ),
  elementResult(
    "air",
    "Hava Elementi",
    "Özgür & Zeki",
    "Fikir üretmeyi ve iletişimi seviyorsun. Rutin seni sıkar; öğrenmek ve paylaşmak seni besler. Sosyal ve meraklısın; mantık ve analiz güçlü yanların. Yeni bakış açıları seni heyecanlandırır.",
    ["İletişim", "Zeka", "Merak", "Özgürlük", "Uyum sağlama"],
    "Yüzeysellik, kararsızlık ve duyguları erteleyebilme. Bazen 'kafada' yaşayıp kalbi unutabilirsin."
  ),
  elementResult(
    "water",
    "Su Elementi",
    "Sezgisel & Derin",
    "Duygusal zekan güçlü; empati ve sezgi doğal yeteneklerin. İlişkilerde derin bağ kuruyorsun; sanat ve semboller seninle konuşuyor. İç dünyan zengin; rüyalar ve hisler seni yönlendiriyor.",
    ["Empati", "Sezgi", "Yaratıcılık", "Bağlılık", "Derinlik"],
    "Aşırı hassasiyet, sınır koymakta zorlanma ve geçmişe takılı kalma. Duygusal yük bazen ağır gelebilir."
  ),
];

/* ================= TEST 1: ELEMENT KEŞFİ (10 soru) ================= */

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
    {
      id: "q1",
      text: "Stresli bir günde ilk tepkin ne olur?",
      options: [
        { id: "a", text: "Hemen harekete geçer, bir şeyler yaparım", weight: { fire: 3 } },
        { id: "b", text: "Plan yapar, adım adım çözerim", weight: { earth: 3 } },
        { id: "c", text: "Birine anlatır veya yazarım", weight: { air: 3 } },
        { id: "d", text: "Yalnız kalıp içime dönerim", weight: { water: 3 } },
      ],
    },
    {
      id: "q2",
      text: "En güçlü hissettiğin yönün hangisi?",
      options: [
        { id: "a", text: "Cesaret ve risk alma", weight: { fire: 3 } },
        { id: "b", text: "Sabır ve dayanıklılık", weight: { earth: 3 } },
        { id: "c", text: "Zeka ve iletişim", weight: { air: 3 } },
        { id: "d", text: "Empati ve sezgi", weight: { water: 3 } },
      ],
    },
    {
      id: "q3",
      text: "Hayatta seni en çok motive eden nedir?",
      options: [
        { id: "a", text: "Heyecan ve yeni hedefler", weight: { fire: 3 } },
        { id: "b", text: "Güvenlik ve istikrar", weight: { earth: 3 } },
        { id: "c", text: "Özgürlük ve keşif", weight: { air: 3 } },
        { id: "d", text: "Sevgi ve anlamlı bağlar", weight: { water: 3 } },
      ],
    },
    {
      id: "q4",
      text: "Tatilde nasıl bir ortam seçersin?",
      options: [
        { id: "a", text: "Aksiyon, spor veya macera", weight: { fire: 3 } },
        { id: "b", text: "Sakin, düzenli ve konforlu", weight: { earth: 3 } },
        { id: "c", text: "Yeni yerler, kültürler, insanlar", weight: { air: 3 } },
        { id: "d", text: "Doğa, deniz veya sessiz bir köşe", weight: { water: 3 } },
      ],
    },
    {
      id: "q5",
      text: "Anlaşmazlıkta genelde nasıl davranırsın?",
      options: [
        { id: "a", text: "Direkt konuşur, sonucu hemen isterim", weight: { fire: 3 } },
        { id: "b", text: "Mantıklı kanıtlar sunarım", weight: { earth: 3 } },
        { id: "c", text: "Tartışır, farklı açıları dinlerim", weight: { air: 3 } },
        { id: "d", text: "Önce karşımdakinin hissini anlamaya çalışırım", weight: { water: 3 } },
      ],
    },
    {
      id: "q6",
      text: "İş/okul projesinde rolün genelde ne olur?",
      options: [
        { id: "a", text: "Fikri ben sunar, yönlendiririm", weight: { fire: 3 } },
        { id: "b", text: "Planı yapar, takvime uyulmasını sağlarım", weight: { earth: 3 } },
        { id: "c", text: "Araştırır, sunar, iletişimi yönetirim", weight: { air: 3 } },
        { id: "d", text: "Takım uyumunu ve moralini önemserim", weight: { water: 3 } },
      ],
    },
    {
      id: "q7",
      text: "Karar verirken en çok neye güvenirsin?",
      options: [
        { id: "a", text: "İçgüdü ve cesaret", weight: { fire: 3 } },
        { id: "b", text: "Veri ve geçmiş deneyim", weight: { earth: 3 } },
        { id: "c", text: "Mantık ve olası senaryolar", weight: { air: 3 } },
        { id: "d", text: "Hislerim ve değerlerim", weight: { water: 3 } },
      ],
    },
    {
      id: "q8",
      text: "Arkadaşların seni nasıl tanımlar?",
      options: [
        { id: "a", text: "Enerjik, cesur, motive edici", weight: { fire: 3 } },
        { id: "b", text: "Güvenilir, istikrarlı, mantıklı", weight: { earth: 3 } },
        { id: "c", text: "Zeki, eğlenceli, meraklı", weight: { air: 3 } },
        { id: "d", text: "Anlayışlı, sıcak, derin", weight: { water: 3 } },
      ],
    },
    {
      id: "q9",
      text: "Boş zamanında en çok ne yapmayı seversin?",
      options: [
        { id: "a", text: "Spor, yarışma veya fiziksel aktivite", weight: { fire: 3 } },
        { id: "b", text: "El işi, bahçe, düzen kurma", weight: { earth: 3 } },
        { id: "c", text: "Okumak, öğrenmek, sohbet", weight: { air: 3 } },
        { id: "d", text: "Müzik, film, hayal kurma", weight: { water: 3 } },
      ],
    },
    {
      id: "q10",
      text: "Seni en iyi anlatan cümle hangisi?",
      options: [
        { id: "a", text: "Harekete geçmeden rahat edemem", weight: { fire: 3 } },
        { id: "b", text: "Sağlam adımlar atarım", weight: { earth: 3 } },
        { id: "c", text: "Fikirler beni canlı tutar", weight: { air: 3 } },
        { id: "d", text: "Duygularıma güvenirim", weight: { water: 3 } },
      ],
    },
  ],
  resultTemplates: ELEMENT_RESULTS,
};

/* ================= TEST 2: AŞK TARZI (10 soru) ================= */

const LOVE_RESULTS: TestResult[] = [
  elementResult("fire", "Tutkulu Aşık", "Ateşin Aşkı", "İlişkide tutku ve heyecan senin için vazgeçilmez. Cesur ve doğrudan seviyorsun; sıkılmak istemezsin. Partnerinin de enerjik ve hevesli olmasını beklersin. Romantik jestler ve macera ilişkini canlı tutar.", ["Tutku", "Cesaret", "Sadakat (seçtiğinde)", "Enerji", "Doğrudanlık"], "Sabırsızlık ve kıskançlık; ilişki soğuduğunda hemen kopma eğilimi."),
  elementResult("earth", "Güvenli Bağ", "Toprağın Aşkı", "İlişkide güvenlik ve sadakat ön planda. Sözünün eri, planlı ve uzun vadeli düşünürsün. Partnerinin güvenilir ve istikrarlı olmasını istersin. Ev, aile ve ortak hedefler seni mutlu eder.", ["Sadakat", "Güvenilirlik", "İstikrar", "Sorumluluk", "Derin bağ"], "Değişime kapalılık ve duygusal ifade zorluğu; bazen soğuk görünebilirsin."),
  elementResult("air", "Zihinsel Uyum", "Havanın Aşkı", "İlişkide zihinsel uyum ve özgürlük önemli. Sohbet, espri ve ortak ilgi alanları seni çeker. Boğucu ilişkilerden kaçınır; nefes alacak alan istersin. Arkadaşlık temelli aşk sana yakın.", ["İletişim", "Espri", "Özgürlük", "Merak", "Denge"], "Bağlanma korkusu ve duygusal mesafe; 'soğuk' algılanabilirsin."),
  elementResult("water", "Duygusal Derinlik", "Suyun Aşkı", "İlişkide duygusal derinlik ve bağ senin için merkezde. Empati ve sezgiyle partnerini anlarsın. Romantik, sadık ve evliliğe/uzun ilişkiye yatkınsın. Güven ve samimiyet olmadan rahat edemezsin.", ["Empati", "Bağlılık", "Romantizm", "Sezgi", "Sadakat"], "Aşırı bağlanma ve kırılganlık; terk edilme korkusu seni yorabilir."),
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
    { id: "q1", text: "İlişkide senin için en önemli şey nedir?", options: [{ id: "a", text: "Tutku ve heyecan", weight: { fire: 3 } }, { id: "b", text: "Güven ve sadakat", weight: { earth: 3 } }, { id: "c", text: "Zihinsel uyum ve sohbet", weight: { air: 3 } }, { id: "d", text: "Duygusal bağ ve anlaşılma", weight: { water: 3 } }] },
    { id: "q2", text: "Partnerin seni nasıl görmeli?", options: [{ id: "a", text: "Güçlü ve cesur", weight: { fire: 3 } }, { id: "b", text: "Güvenilir ve istikrarlı", weight: { earth: 3 } }, { id: "c", text: "Eğlenceli ve zeki", weight: { air: 3 } }, { id: "d", text: "Şefkatli ve derin", weight: { water: 3 } }] },
    { id: "q3", text: "Kavga sonrası nasıl barışırsın?", options: [{ id: "a", text: "Direkt konuşup çözerim", weight: { fire: 3 } }, { id: "b", text: "Mantıklı açıklama yaparım", weight: { earth: 3 } }, { id: "c", text: "Mizah veya sohbetle yumuşatırım", weight: { air: 3 } }, { id: "d", text: "Özür diler, duyguları konuşurum", weight: { water: 3 } }] },
    { id: "q4", text: "İdeal randevu nasıl olur?", options: [{ id: "a", text: "Aksiyon, spor veya macera", weight: { fire: 3 } }, { id: "b", text: "Yemek, ev, planlı aktivite", weight: { earth: 3 } }, { id: "c", text: "Sergi, sohbet, yeni mekan", weight: { air: 3 } }, { id: "d", text: "Romantik akşam, deniz veya doğa", weight: { water: 3 } }] },
    { id: "q5", text: "Sevgiyi nasıl ifade edersin?", options: [{ id: "a", text: "Hareketlerle, sürprizlerle", weight: { fire: 3 } }, { id: "b", text: "Sorumluluk alarak, güven vererek", weight: { earth: 3 } }, { id: "c", text: "Sohbet ve ilgiyle", weight: { air: 3 } }, { id: "d", text: "Dokunuş, söz ve duygusal anlar", weight: { water: 3 } }] },
    { id: "q6", text: "İlişkide en çok ne seni yorar?", options: [{ id: "a", text: "Rutin ve sıkıcılık", weight: { fire: 3 } }, { id: "b", text: "Güvensizlik ve plansızlık", weight: { earth: 3 } }, { id: "c", text: "Boğucu ve kısıtlayıcı davranış", weight: { air: 3 } }, { id: "d", text: "Duygusal soğukluk ve mesafe", weight: { water: 3 } }] },
    { id: "q7", text: "Aşkta risk alır mısın?", options: [{ id: "a", text: "Evet, cesurca giderim", weight: { fire: 3 } }, { id: "b", text: "Ölçülü, emin olduktan sonra", weight: { earth: 3 } }, { id: "c", text: "Mantıklı risk alırım", weight: { air: 3 } }, { id: "d", text: "Kalbim giderse peşinden giderim", weight: { water: 3 } }] },
    { id: "q8", text: "Partnerinden en çok ne bekliyorsun?", options: [{ id: "a", text: "Enerji ve heyecan", weight: { fire: 3 } }, { id: "b", text: "Sadakat ve güvenilirlik", weight: { earth: 3 } }, { id: "c", text: "Zeka ve özgürlük", weight: { air: 3 } }, { id: "d", text: "Anlayış ve duygusal derinlik", weight: { water: 3 } }] },
    { id: "q9", text: "Ayrılık sonrası nasıl toparlanırsın?", options: [{ id: "a", text: "Yeni hedefler, hareket", weight: { fire: 3 } }, { id: "b", text: "Rutin, iş, düzen", weight: { earth: 3 } }, { id: "c", text: "Arkadaşlar, sohbet, gezi", weight: { air: 3 } }, { id: "d", text: "Zaman, yalnızlık, sanat/müzik", weight: { water: 3 } }] },
    { id: "q10", text: "Uzun ilişkide seni mutlu eden nedir?", options: [{ id: "a", text: "Heyecan ve birlikte macera", weight: { fire: 3 } }, { id: "b", text: "Ev, aile, ortak gelecek", weight: { earth: 3 } }, { id: "c", text: "Arkadaşlık ve zihinsel uyum", weight: { air: 3 } }, { id: "d", text: "Derin bağ ve duygusal güven", weight: { water: 3 } }] },
  ],
  resultTemplates: LOVE_RESULTS,
};

/* ================= TEST 3: İLETİŞİM VE ÇATIŞMA (10 soru) ================= */

const COMMUNICATION_RESULTS: TestResult[] = [
  elementResult("fire", "Direkt İletişimci", "Ateşin Dili", "Net ve cesur konuşursun. Sözünü sakınmaz, çatışmadan kaçınmazsın. Hızlı karar ve aksiyon istersin. Karşındakinin de doğrudan olmasını beklersin.", ["Netlik", "Cesaret", "Hız", "Liderlik", "Doğrudanlık"], "Sabırsızlık ve öfke; bazen incitici sert çıkabilirsin."),
  elementResult("earth", "Mantıklı ve Yapıcı", "Toprağın Dili", "Soğukkanlı ve kanıta dayalı iletişim kurarsın. Sözünün eri olursun; vaatleri ciddiye alırsın. Çatışmada adım adım çözmeyi tercih edersin.", ["Güvenilirlik", "Mantık", "Sabır", "Tutarlılık", "Çözüm odaklılık"], "Esneklik azlığı ve duygusal ifade zorluğu."),
  elementResult("air", "Diplomatik ve Esnek", "Havanın Dili", "Sohbeti ve farklı bakış açılarını seversin. Tartışmayı kişiselleştirmezsin; mizah ve mantık kullanırsın. Uzlaşma ve ortak zemin ararsın.", ["İletişim", "Esneklik", "Mizah", "Analiz", "Uzlaşma"], "Yüzeysel kalma ve duyguları erteleyebilme."),
  elementResult("water", "Empatik Dinleyici", "Suyun Dili", "Önce karşındakinin hislerini anlamaya çalışırsın. Sessiz dinleme ve beden dili senin için önemli. Sert çatışmalardan rahatsız olursun; uyum ararsın.", ["Empati", "Dinleme", "Sezgi", "Uyum", "Derinlik"], "Sınır koyamama ve kendi ihtiyaçlarını erteleyebilme."),
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
    { id: "q1", text: "Anlaşmazlıkta ilk tepkin ne olur?", options: [{ id: "a", text: "Direkt söylerim, net olurum", weight: { fire: 3 } }, { id: "b", text: "Kanıtları toplar, mantıklı konuşurum", weight: { earth: 3 } }, { id: "c", text: "Tartışır, farklı açıları dinlerim", weight: { air: 3 } }, { id: "d", text: "Önce sakinleşmeyi tercih ederim", weight: { water: 3 } }] },
    { id: "q2", text: "Eleştiri aldığında nasıl hissedersin?", options: [{ id: "a", text: "Savunmaya geçer, hemen yanıt veririm", weight: { fire: 3 } }, { id: "b", text: "Mantıklı mı diye değerlendiririm", weight: { earth: 3 } }, { id: "c", text: "Analiz eder, tartışırım", weight: { air: 3 } }, { id: "d", text: "İncinirim ama belli etmemeye çalışırım", weight: { water: 3 } }] },
    { id: "q3", text: "Zor bir konuyu nasıl açarsın?", options: [{ id: "a", text: "Açıkça ve hemen söylerim", weight: { fire: 3 } }, { id: "b", text: "Uygun zamanı seçer, planlı konuşurum", weight: { earth: 3 } }, { id: "c", text: "Sohbet içinde yumuşak geçişle", weight: { air: 3 } }, { id: "d", text: "Karşımdakinin ruh haline göre seçerim", weight: { water: 3 } }] },
    { id: "q4", text: "Topluluk önünde konuşmak?", options: [{ id: "a", text: "Rahatım, enerji verir", weight: { fire: 3 } }, { id: "b", text: "Hazırlanırsam rahatım", weight: { earth: 3 } }, { id: "c", text: "Konu ilgimi çekiyorsa keyifli", weight: { air: 3 } }, { id: "d", text: "Gergin olurum, küçük gruplar tercih", weight: { water: 3 } }] },
    { id: "q5", text: "Karşındaki çok duygusal konuşunca?", options: [{ id: "a", text: "Çözüme odaklanmak isterim", weight: { fire: 3 } }, { id: "b", text: "Sakinleştirip mantıklı ilerlerim", weight: { earth: 3 } }, { id: "c", text: "Dinler, sonra konuyu açarım", weight: { air: 3 } }, { id: "d", text: "Empati kurar, hissederim", weight: { water: 3 } }] },
    { id: "q6", text: "E-posta / mesajda nasılsın?", options: [{ id: "a", text: "Kısa ve net", weight: { fire: 3 } }, { id: "b", text: "Açık, yapılandırılmış", weight: { earth: 3 } }, { id: "c", text: "Sohbet tadında, esprili", weight: { air: 3 } }, { id: "d", text: "Nazik, duygusal ifadeler", weight: { water: 3 } }] },
    { id: "q7", text: "Yanlış anlaşıldığında?", options: [{ id: "a", text: "Hemen düzeltir, netleştiririm", weight: { fire: 3 } }, { id: "b", text: "Örneklerle açıklarım", weight: { earth: 3 } }, { id: "c", text: "Farklı açıdan anlatırım", weight: { air: 3 } }, { id: "d", text: "Hislerimi anlatmaya çalışırım", weight: { water: 3 } }] },
    { id: "q8", text: "Takımda fikir ayrılığı olunca?", options: [{ id: "a", text: "Benim fikrimi savunurum", weight: { fire: 3 } }, { id: "b", text: "Veri ve prosedüre göre karar", weight: { earth: 3 } }, { id: "c", text: "Herkesi dinleyip sentez yaparım", weight: { air: 3 } }, { id: "d", text: "Uyumu bozmamak için dikkatli olurum", weight: { water: 3 } }] },
    { id: "q9", text: "Özür dilemek senin için?", options: [{ id: "a", text: "Gerekiyorsa söylerim, uzatmam", weight: { fire: 3 } }, { id: "b", text: "Hak ettiğimde samimi özür dilerim", weight: { earth: 3 } }, { id: "c", text: "İlişkiyi düzeltmek için gerekli", weight: { air: 3 } }, { id: "d", text: "İlişki için önemli, içten yaparım", weight: { water: 3 } }] },
    { id: "q10", text: "Sessizlik senin için?", options: [{ id: "a", text: "Rahatsız edici, doldurmak isterim", weight: { fire: 3 } }, { id: "b", text: "Düşünmek için fırsat", weight: { earth: 3 } }, { id: "c", text: "Bazen rahat, bazen sohbet", weight: { air: 3 } }, { id: "d", text: "Rahatım, sözle ifade her şey değil", weight: { water: 3 } }] },
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
    { id: "q1", text: "İş ortamında en rahat hissettiğin rol?", options: [{ id: "a", text: "Lider, karar verici", weight: { fire: 3 } }, { id: "b", text: "Planlayıcı, organize eden", weight: { earth: 3 } }, { id: "c", text: "Fikir üreten, iletişim", weight: { air: 3 } }, { id: "d", text: "Takımı destekleyen, uyum sağlayan", weight: { water: 3 } }] },
    { id: "q2", text: "Para harcarken genelde?", options: [{ id: "a", text: "Anlık keyif, cesur harcarım", weight: { fire: 3 } }, { id: "b", text: "Planlı, birikim yaparım", weight: { earth: 3 } }, { id: "c", text: "Denge ararım, bazen spontane", weight: { air: 3 } }, { id: "d", text: "Değer verdiğim şeylere harcarım", weight: { water: 3 } }] },
    { id: "q3", text: "Terfi / fırsat geldiğinde?", options: [{ id: "a", text: "Hemen kapar, risk alırım", weight: { fire: 3 } }, { id: "b", text: "Artıları eksileri değerlendiririm", weight: { earth: 3 } }, { id: "c", text: "Yeni deneyim olarak görürüm", weight: { air: 3 } }, { id: "d", text: "Ekip ve ortam uyumuna bakarım", weight: { water: 3 } }] },
    { id: "q4", text: "En iyi çalıştığın ortam?", options: [{ id: "a", text: "Rekabetçi, hedefli", weight: { fire: 3 } }, { id: "b", text: "Düzenli, net kurallı", weight: { earth: 3 } }, { id: "c", text: "Esnek, yaratıcı", weight: { air: 3 } }, { id: "d", text: "İşbirlikçi, sıcak", weight: { water: 3 } }] },
    { id: "q5", text: "Başarısızlık sonrası?", options: [{ id: "a", text: "Hemen yeni hedefe geçerim", weight: { fire: 3 } }, { id: "b", text: "Ders çıkarır, planı revize ederim", weight: { earth: 3 } }, { id: "c", text: "Analiz eder, farklı denerim", weight: { air: 3 } }, { id: "d", text: "Duygusal toparlanır, tekrar denerim", weight: { water: 3 } }] },
    { id: "q6", text: "Para senin için ne ifade eder?", options: [{ id: "a", text: "Özgürlük ve fırsat", weight: { fire: 3 } }, { id: "b", text: "Güvenlik ve istikrar", weight: { earth: 3 } }, { id: "c", text: "Seçenek ve deneyim", weight: { air: 3 } }, { id: "d", text: "Güven ve huzur", weight: { water: 3 } }] },
    { id: "q7", text: "Takımda en çok ne yaparsın?", options: [{ id: "a", text: "Yönlendirir, motive ederim", weight: { fire: 3 } }, { id: "b", text: "Görevleri dağıtır, takip ederim", weight: { earth: 3 } }, { id: "c", text: "Fikir üretir, sunarım", weight: { air: 3 } }, { id: "d", text: "Uyum sağlar, destek veririm", weight: { water: 3 } }] },
    { id: "q8", text: "İş değiştirme kararı?", options: [{ id: "a", text: "Cesur atılım, yeni macera", weight: { fire: 3 } }, { id: "b", text: "Güvenli geçiş, net koşullar", weight: { earth: 3 } }, { id: "c", text: "Merak, öğrenme fırsatı", weight: { air: 3 } }, { id: "d", text: "Anlam ve değer uyumu", weight: { water: 3 } }] },
    { id: "q9", text: "Deadline yaklaşınca?", options: [{ id: "a", text: "Son anda enerji patlaması", weight: { fire: 3 } }, { id: "b", text: "Planlı, zamanında bitiririm", weight: { earth: 3 } }, { id: "c", text: "Odaklanır, esnek çalışırım", weight: { air: 3 } }, { id: "d", text: "Streslenirim ama tamamlarım", weight: { water: 3 } }] },
    { id: "q10", text: "Kariyer hedefin?", options: [{ id: "a", text: "Liderlik, görünürlük", weight: { fire: 3 } }, { id: "b", text: "İstikrar, güvenli gelir", weight: { earth: 3 } }, { id: "c", text: "Öğrenme, çeşitlilik", weight: { air: 3 } }, { id: "d", text: "Anlamlı iş, denge", weight: { water: 3 } }] },
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
    { id: "q1", text: "Stresli bir günde ilk yaptığın şey?", options: [{ id: "a", text: "Hareket ederim, spor veya yürüyüş", weight: { fire: 3 } }, { id: "b", text: "Liste yapar, planlarım", weight: { earth: 3 } }, { id: "c", text: "Birine anlatır veya yazarım", weight: { air: 3 } }, { id: "d", text: "Sessiz bir yere çekilirim", weight: { water: 3 } }] },
    { id: "q2", text: "Beklenmedik kötü haber alınca?", options: [{ id: "a", text: "Hemen ne yapacağımı düşünürüm", weight: { fire: 3 } }, { id: "b", text: "Sakin kalıp adımlar planlarım", weight: { earth: 3 } }, { id: "c", text: "Analiz eder, seçenekleri tartarım", weight: { air: 3 } }, { id: "d", text: "Şok olur, zaman isterim", weight: { water: 3 } }] },
    { id: "q3", text: "Uyku stresle nasıl etkilenir?", options: [{ id: "a", text: "Uyuyamıyorum, enerji patlaması", weight: { fire: 3 } }, { id: "b", text: "Rutin bozulunca zorlanırım", weight: { earth: 3 } }, { id: "c", text: "Kafam meşgul, düşünürüm", weight: { air: 3 } }, { id: "d", text: "Kabusa benzer, duygusal", weight: { water: 3 } }] },
    { id: "q4", text: "En çok ne stres yaratır?", options: [{ id: "a", text: "Hareketsizlik ve belirsizlik", weight: { fire: 3 } }, { id: "b", text: "Düzensizlik ve güvensizlik", weight: { earth: 3 } }, { id: "c", text: "Kısıtlanma ve sıkıcılık", weight: { air: 3 } }, { id: "d", text: "Çatışma ve reddedilme", weight: { water: 3 } }] },
    { id: "q5", text: "Sakinleşmek için ne yaparsın?", options: [{ id: "a", text: "Fiziksel aktivite", weight: { fire: 3 } }, { id: "b", text: "Düzen, temizlik, rutin", weight: { earth: 3 } }, { id: "c", text: "Sohbet, kitap, podcast", weight: { air: 3 } }, { id: "d", text: "Müzik, banyo, yalnız zaman", weight: { water: 3 } }] },
    { id: "q6", text: "Stres anında çevrene nasıl davranırsın?", options: [{ id: "a", text: "Sinirli veya sabırsız", weight: { fire: 3 } }, { id: "b", text: "Mesafeli, işe odaklı", weight: { earth: 3 } }, { id: "c", text: "Konuşkan veya dağınık", weight: { air: 3 } }, { id: "d", text: "İçe kapanık veya ağlamaklı", weight: { water: 3 } }] },
    { id: "q7", text: "Kontrolü kaybettiğinde?", options: [{ id: "a", text: "Hemen kontrolü almaya çalışırım", weight: { fire: 3 } }, { id: "b", text: "Küçük adımlarla toparlanırım", weight: { earth: 3 } }, { id: "c", text: "Perspektif değiştiririm", weight: { air: 3 } }, { id: "d", text: "Duygularıma izin veririm", weight: { water: 3 } }] },
    { id: "q8", text: "Uzun süreli stres?", options: [{ id: "a", text: "Tüketir ama mücadele ederim", weight: { fire: 3 } }, { id: "b", text: "Sistematik çözerim", weight: { earth: 3 } }, { id: "c", text: "Distans alıp analiz ederim", weight: { air: 3 } }, { id: "d", text: "Ağır hissederim, destek ararım", weight: { water: 3 } }] },
    { id: "q9", text: "Başkası stresliyken?", options: [{ id: "a", text: "Çözüm öneririm, harekete geçiririm", weight: { fire: 3 } }, { id: "b", text: "Pratik yardım sunarım", weight: { earth: 3 } }, { id: "c", text: "Dinler, mantıklı konuşurum", weight: { air: 3 } }, { id: "d", text: "Yanında olur, hissederim", weight: { water: 3 } }] },
    { id: "q10", text: "Stres sonrası toparlanma?", options: [{ id: "a", text: "Yeni hedefe geçerim", weight: { fire: 3 } }, { id: "b", text: "Rutine dönerim", weight: { earth: 3 } }, { id: "c", text: "Sohbet ve öğrenmeyle", weight: { air: 3 } }, { id: "d", text: "Dinlenme ve duygusal destekle", weight: { water: 3 } }] },
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
    { id: "q1", text: "Önemli bir karar öncesi ne yaparsın?", options: [{ id: "a", text: "İçime bakar, hissederim", weight: { fire: 3 } }, { id: "b", text: "Liste yapar, araştırırım", weight: { earth: 3 } }, { id: "c", text: "Başkalarına sorar, tartarım", weight: { air: 3 } }, { id: "d", text: "Zaman geçirir, rüyama bırakırım", weight: { water: 3 } }] },
    { id: "q2", text: "Karar verdikten sonra?", options: [{ id: "a", text: "Hemen uygularım", weight: { fire: 3 } }, { id: "b", text: "Planı takip ederim", weight: { earth: 3 } }, { id: "c", text: "Gerekirse revize ederim", weight: { air: 3 } }, { id: "d", text: "İçime uygun mu diye kontrol ederim", weight: { water: 3 } }] },
    { id: "q3", text: "İki iyi seçenek arasında kaldığında?", options: [{ id: "a", text: "Birini seçer, pişman olmam", weight: { fire: 3 } }, { id: "b", text: "Kriterlere göre puanlarım", weight: { earth: 3 } }, { id: "c", text: "İkisini de denemeye çalışırım", weight: { air: 3 } }, { id: "d", text: "Hangisi kalbime daha yakın", weight: { water: 3 } }] },
    { id: "q4", text: "Yanlış karar verdiğini anlayınca?", options: [{ id: "a", text: "Hemen düzeltir, devam ederim", weight: { fire: 3 } }, { id: "b", text: "Neden yanlış oldu analiz ederim", weight: { earth: 3 } }, { id: "c", text: "Alternatif düşünürüm", weight: { air: 3 } }, { id: "d", text: "Üzülür, sonra toparlanırım", weight: { water: 3 } }] },
    { id: "q5", text: "Başkası senin kararını sorgulayınca?", options: [{ id: "a", text: "Savunurum, net olurum", weight: { fire: 3 } }, { id: "b", text: "Kanıtlarımı sunarım", weight: { earth: 3 } }, { id: "c", text: "Dinler, gerekirse değiştiririm", weight: { air: 3 } }, { id: "d", text: "Hislerime güvenirim", weight: { water: 3 } }] },
    { id: "q6", text: "Acele karar gerekince?", options: [{ id: "a", text: "Rahatım, hemen veririm", weight: { fire: 3 } }, { id: "b", text: "En kritik faktöre odaklanırım", weight: { earth: 3 } }, { id: "c", text: "Hızlı analiz yaparım", weight: { air: 3 } }, { id: "d", text: "İçgüdüme güvenirim", weight: { water: 3 } }] },
    { id: "q7", text: "Geçmiş kararların hakkında?", options: [{ id: "a", text: "Geçmişe takılmam", weight: { fire: 3 } }, { id: "b", text: "Ders çıkarırım", weight: { earth: 3 } }, { id: "c", text: "Bağlamı değerlendiririm", weight: { air: 3 } }, { id: "d", text: "Duygusal iz bırakır", weight: { water: 3 } }] },
    { id: "q8", text: "Grup kararında rolün?", options: [{ id: "a", text: "Yönlendirir, son noktayı koyarım", weight: { fire: 3 } }, { id: "b", text: "Veriyi sunar, yapı kurarım", weight: { earth: 3 } }, { id: "c", text: "Seçenekleri tartıştırırım", weight: { air: 3 } }, { id: "d", text: "Herkesin hissini dikkate alırım", weight: { water: 3 } }] },
    { id: "q9", text: "Para / kariyer kararı?", options: [{ id: "a", text: "Risk alır, fırsatı değerlendiririm", weight: { fire: 3 } }, { id: "b", text: "Güvenli ve hesaplı", weight: { earth: 3 } }, { id: "c", text: "Esnek, deneyerek", weight: { air: 3 } }, { id: "d", text: "Anlam ve denge önemli", weight: { water: 3 } }] },
    { id: "q10", text: "Karar vermek senin için?", options: [{ id: "a", text: "Doğal ve hızlı", weight: { fire: 3 } }, { id: "b", text: "Sistematik süreç", weight: { earth: 3 } }, { id: "c", text: "Açık uçlu, değişebilir", weight: { air: 3 } }, { id: "d", text: "Duygusal yük taşır", weight: { water: 3 } }] },
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
    { id: "q1", text: "Kalabalık bir ortama girdiğinde?", options: [{ id: "a", text: "Ortamı ısıtır, tanışırım", weight: { fire: 3 } }, { id: "b", text: "Tanıdık birini ararım", weight: { earth: 3 } }, { id: "c", text: "Sohbet başlatır, gezerim", weight: { air: 3 } }, { id: "d", text: "Sessizce izler, alışırım", weight: { water: 3 } }] },
    { id: "q2", text: "Arkadaş sayın ve derinlik?", options: [{ id: "a", text: "Çok arkadaş, geniş çevre", weight: { fire: 3 } }, { id: "b", text: "Az ama çok yakın", weight: { earth: 3 } }, { id: "c", text: "Orta, çeşitli gruplar", weight: { air: 3 } }, { id: "d", text: "Az, derin ve duygusal", weight: { water: 3 } }] },
    { id: "q3", text: "Parti / etkinlik sonrası?", options: [{ id: "a", text: "Enerji dolu, devam edebilirim", weight: { fire: 3 } }, { id: "b", text: "Yorulurum, dinlenmem gerek", weight: { earth: 3 } }, { id: "c", text: "Keyifli, ama yeterince sosyalleştim", weight: { air: 3 } }, { id: "d", text: "Bitkin, yalnız zaman isterim", weight: { water: 3 } }] },
    { id: "q4", text: "Yeni biriyle tanışırken?", options: [{ id: "a", text: "Önce ben konuşurum", weight: { fire: 3 } }, { id: "b", text: "Güven kurana kadar mesafeli", weight: { earth: 3 } }, { id: "c", text: "Sohbeti açar, soru sorarım", weight: { air: 3 } }, { id: "d", text: "Göz teması ve dinleme", weight: { water: 3 } }] },
    { id: "q5", text: "Arkadaşın zor durumda?", options: [{ id: "a", text: "Hemen çözüm sunar, harekete geçerim", weight: { fire: 3 } }, { id: "b", text: "Pratik yardım, güvenilir olurum", weight: { earth: 3 } }, { id: "c", text: "Dinler, farklı açılar sunarım", weight: { air: 3 } }, { id: "d", text: "Yanında olur, hissederim", weight: { water: 3 } }] },
    { id: "q6", text: "Sosyal pilin nasıl dolar?", options: [{ id: "a", text: "Kalabalıkla, etkinlikle", weight: { fire: 3 } }, { id: "b", text: "Rutin ve güvenli ortamla", weight: { earth: 3 } }, { id: "c", text: "Sohbet ve yeni bilgiyle", weight: { air: 3 } }, { id: "d", text: "Yalnız veya yakın biriyle", weight: { water: 3 } }] },
    { id: "q7", text: "Grupla plan yaparken?", options: [{ id: "a", text: "Ben önerir, organize ederim", weight: { fire: 3 } }, { id: "b", text: "Net tarih ve yer isterim", weight: { earth: 3 } }, { id: "c", text: "Esnek, herkesin fikri", weight: { air: 3 } }, { id: "d", text: "Küçük grup, samimi ortam", weight: { water: 3 } }] },
    { id: "q8", text: "Sosyal medyada nasılsın?", options: [{ id: "a", text: "Aktif, paylaşır, etkileşir", weight: { fire: 3 } }, { id: "b", text: "Seyrek, anlamlı paylaşım", weight: { earth: 3 } }, { id: "c", text: "Sohbet ve bilgi odaklı", weight: { air: 3 } }, { id: "d", text: "Yakın çevreyle, özel", weight: { water: 3 } }] },
    { id: "q9", text: "Yalnız kalmak senin için?", options: [{ id: "a", text: "Sıkıcı, kısa süre yeter", weight: { fire: 3 } }, { id: "b", text: "Düzen için gerekli", weight: { earth: 3 } }, { id: "c", text: "Düşünmek için iyi", weight: { air: 3 } }, { id: "d", text: "Şart, enerjimi toplarım", weight: { water: 3 } }] },
    { id: "q10", text: "Arkadaşların seni nasıl tanımlar?", options: [{ id: "a", text: "Enerjik, cesur, eğlenceli", weight: { fire: 3 } }, { id: "b", text: "Güvenilir, istikrarlı", weight: { earth: 3 } }, { id: "c", text: "Zeki, meraklı, iyi sohbet", weight: { air: 3 } }, { id: "d", text: "Anlayışlı, derin, sıcak", weight: { water: 3 } }] },
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
    { id: "q1", text: "Farkında olmadan sık yaptığın şey?", options: [{ id: "a", text: "Liderlik etmek, öne çıkmak", weight: { fire: 3 } }, { id: "b", text: "Kontrol etmek, düzenlemek", weight: { earth: 3 } }, { id: "c", text: "Merak etmek, analiz etmek", weight: { air: 3 } }, { id: "d", text: "Hissetmek, empati kurmak", weight: { water: 3 } }] },
    { id: "q2", text: "Kızdığında aslında ne hissediyorsun?", options: [{ id: "a", text: "Güçsüz veya engellenmiş", weight: { fire: 3 } }, { id: "b", text: "Güvensiz veya tehdit altında", weight: { earth: 3 } }, { id: "c", text: "Anlaşılmamış veya haksız", weight: { air: 3 } }, { id: "d", text: "İncinmiş veya reddedilmiş", weight: { water: 3 } }] },
    { id: "q3", text: "Rüyalarında sık çıkan tema?", options: [{ id: "a", text: "Yarış, kovalamaca, aksiyon", weight: { fire: 3 } }, { id: "b", text: "Ev, yol, kaybolma", weight: { earth: 3 } }, { id: "c", text: "Uçuş, konuşma, bulmaca", weight: { air: 3 } }, { id: "d", text: "Su, deniz, ağlama", weight: { water: 3 } }] },
    { id: "q4", text: "Eleştirildiğinde en çok incinen?", options: [{ id: "a", text: "Yetersiz veya zayıf görülmek", weight: { fire: 3 } }, { id: "b", text: "Güvenilmez veya dağınık", weight: { earth: 3 } }, { id: "c", text: "Aptal veya yüzeysel", weight: { air: 3 } }, { id: "d", text: "Soğuk veya duygusuz", weight: { water: 3 } }] },
    { id: "q5", text: "Gizli yeteneğin ne olabilir?", options: [{ id: "a", text: "Krizde sakin kalıp harekete geçirmek", weight: { fire: 3 } }, { id: "b", text: "Her şeyi taşımak, dayanmak", weight: { earth: 3 } }, { id: "c", text: "Farklı açıları birleştirmek", weight: { air: 3 } }, { id: "d", text: "İnsanların hissini okumak", weight: { water: 3 } }] },
    { id: "q6", text: "En zor kabullendiğin yönün?", options: [{ id: "a", text: "Sabırsızlık ve öfke", weight: { fire: 3 } }, { id: "b", text: "Inat ve katılık", weight: { earth: 3 } }, { id: "c", text: "Kararsızlık ve mesafe", weight: { air: 3 } }, { id: "d", text: "Aşırı hassasiyet", weight: { water: 3 } }] },
    { id: "q7", text: "Stres altında bilinçdışı tepkin?", options: [{ id: "a", text: "Saldırı veya kaçış", weight: { fire: 3 } }, { id: "b", text: "Donma, kontrol", weight: { earth: 3 } }, { id: "c", text: "Mantığa sığınma", weight: { air: 3 } }, { id: "d", text: "İçe kapanma, ağlama", weight: { water: 3 } }] },
    { id: "q8", text: "Başkalarında en çok neyi eleştirirsin?", options: [{ id: "a", text: "Pasiflik ve vazgeçiş", weight: { fire: 3 } }, { id: "b", text: "Düzensizlik ve güvensizlik", weight: { earth: 3 } }, { id: "c", text: "Dar görüşlülük", weight: { air: 3 } }, { id: "d", text: "Duygusuzluk", weight: { water: 3 } }] },
    { id: "q9", text: "Kendini geliştirmek için en çok neye ihtiyacın var?", options: [{ id: "a", text: "Sabır ve dinleme", weight: { fire: 3 } }, { id: "b", text: "Esneklik ve risk", weight: { earth: 3 } }, { id: "c", text: "Derinlik ve duygu", weight: { air: 3 } }, { id: "d", text: "Sınır ve mantık", weight: { water: 3 } }] },
    { id: "q10", text: "Gölge yanın sana ne öğretiyor?", options: [{ id: "a", text: "Gücü paylaşmak", weight: { fire: 3 } }, { id: "b", text: "Değişime açılmak", weight: { earth: 3 } }, { id: "c", text: "Bağlanmak ve karar vermek", weight: { air: 3 } }, { id: "d", text: "Korunmak ve sınır koymak", weight: { water: 3 } }] },
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
    { id: "q1", text: "Hayatta en çok ne seni motive eder?", options: [{ id: "a", text: "Başarı ve hedef", weight: { fire: 3 } }, { id: "b", text: "Güvenlik ve aile", weight: { earth: 3 } }, { id: "c", text: "Özgürlük ve öğrenme", weight: { air: 3 } }, { id: "d", text: "Sevgi ve anlam", weight: { water: 3 } }] },
    { id: "q2", text: "Para kazanmak senin için ne?", options: [{ id: "a", text: "Fırsat ve güç", weight: { fire: 3 } }, { id: "b", text: "Güvenlik ve rahatlık", weight: { earth: 3 } }, { id: "c", text: "Özgürlük ve deneyim", weight: { air: 3 } }, { id: "d", text: "Huzur ve paylaşım", weight: { water: 3 } }] },
    { id: "q3", text: "Ölüm döşeğinde neyi düşünürdün?", options: [{ id: "a", text: "Yapmadığım maceralar", weight: { fire: 3 } }, { id: "b", text: "Ailem ve bıraktıklarım", weight: { earth: 3 } }, { id: "c", text: "Öğrendiklerim ve paylaştıklarım", weight: { air: 3 } }, { id: "d", text: "Sevdiklerim ve hissettiklerim", weight: { water: 3 } }] },
    { id: "q4", text: "Hafta sonu ideal geçerken?", options: [{ id: "a", text: "Spor, gezi, yeni deneyim", weight: { fire: 3 } }, { id: "b", text: "Ev, aile, düzen", weight: { earth: 3 } }, { id: "c", text: "Sohbet, kurs, okuma", weight: { air: 3 } }, { id: "d", text: "Doğa, sanat, sevdiklerimle", weight: { water: 3 } }] },
    { id: "q5", text: "Vazgeçemeyeceğin tek şey?", options: [{ id: "a", text: "Özgürlük ve hareket", weight: { fire: 3 } }, { id: "b", text: "Güven ve istikrar", weight: { earth: 3 } }, { id: "c", text: "Merak ve öğrenme", weight: { air: 3 } }, { id: "d", text: "Sevgi ve bağ", weight: { water: 3 } }] },
    { id: "q6", text: "İş / kariyer seçerken öncelik?", options: [{ id: "a", text: "Heyecan ve liderlik", weight: { fire: 3 } }, { id: "b", text: "Güvenli gelir ve düzen", weight: { earth: 3 } }, { id: "c", text: "Öğrenme ve çeşitlilik", weight: { air: 3 } }, { id: "d", text: "Anlam ve insan", weight: { water: 3 } }] },
    { id: "q7", text: "Çocuklara ne öğretmek istersin?", options: [{ id: "a", text: "Cesaret ve hedef", weight: { fire: 3 } }, { id: "b", text: "Sorumluluk ve düzen", weight: { earth: 3 } }, { id: "c", text: "Merak ve mantık", weight: { air: 3 } }, { id: "d", text: "Sevgi ve empati", weight: { water: 3 } }] },
    { id: "q8", text: "Hayatının anlamı?", options: [{ id: "a", text: "İz bırakmak, başarmak", weight: { fire: 3 } }, { id: "b", text: "Koruma, sağlamak", weight: { earth: 3 } }, { id: "c", text: "Keşfetmek, anlamak", weight: { air: 3 } }, { id: "d", text: "Sevmek, bağ kurmak", weight: { water: 3 } }] },
    { id: "q9", text: "Zamanını neye ayırmak istersin?", options: [{ id: "a", text: "Projeler ve macera", weight: { fire: 3 } }, { id: "b", text: "Aile ve ev", weight: { earth: 3 } }, { id: "c", text: "Öğrenme ve sohbet", weight: { air: 3 } }, { id: "d", text: "Sevdiklerim ve iç dünya", weight: { water: 3 } }] },
    { id: "q10", text: "Mutluluk senin için?", options: [{ id: "a", text: "Hedefe ulaşmak, hareket", weight: { fire: 3 } }, { id: "b", text: "Güvende hissetmek", weight: { earth: 3 } }, { id: "c", text: "Özgür ve meraklı olmak", weight: { air: 3 } }, { id: "d", text: "Sevmek ve sevilmek", weight: { water: 3 } }] },
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
    { id: "q1", text: "İdeal partnerinde en önemli özellik?", options: [{ id: "a", text: "Enerji ve cesaret", weight: { fire: 3 } }, { id: "b", text: "Güvenilirlik ve sadakat", weight: { earth: 3 } }, { id: "c", text: "Zeka ve sohbet", weight: { air: 3 } }, { id: "d", text: "Duygusal derinlik ve empati", weight: { water: 3 } }] },
    { id: "q2", text: "İlişkide senin için kırmızı çizgi?", options: [{ id: "a", text: "Sıkıcılık ve vazgeçiş", weight: { fire: 3 } }, { id: "b", text: "Sadakatsizlik ve güvensizlik", weight: { earth: 3 } }, { id: "c", text: "Kıskançlık ve kısıtlama", weight: { air: 3 } }, { id: "d", text: "Duygusal soğukluk", weight: { water: 3 } }] },
    { id: "q3", text: "Flört aşamasında ne yaparsın?", options: [{ id: "a", text: "Pek çekinmem, cesur davranırım", weight: { fire: 3 } }, { id: "b", text: "Yavaş, güven kurarım", weight: { earth: 3 } }, { id: "c", text: "Sohbet ve espri", weight: { air: 3 } }, { id: "d", text: "Hisleri okur, uyum ararım", weight: { water: 3 } }] },
    { id: "q4", text: "Partnerin seni nasıl desteklemeli?", options: [{ id: "a", text: "Hedeflerimde yanımda olsun", weight: { fire: 3 } }, { id: "b", text: "Güvenilir ve istikrarlı olsun", weight: { earth: 3 } }, { id: "c", text: "Fikirlerimi dinlesin, tartışsın", weight: { air: 3 } }, { id: "d", text: "Duygusal olarak yanımda olsun", weight: { water: 3 } }] },
    { id: "q5", text: "Evlilik / uzun ilişki hakkında?", options: [{ id: "a", text: "Ortak hedefler ve macera", weight: { fire: 3 } }, { id: "b", text: "Güvenli yuva ve aile", weight: { earth: 3 } }, { id: "c", text: "Arkadaşlık ve özgürlük", weight: { air: 3 } }, { id: "d", text: "Ruh bağı ve derin sevgi", weight: { water: 3 } }] },
    { id: "q6", text: "Uyumsuzlukta ne yaparsın?", options: [{ id: "a", text: "Tartışır, netleştiririm", weight: { fire: 3 } }, { id: "b", text: "Kurallar ve sınır koyarım", weight: { earth: 3 } }, { id: "c", text: "Konuşur, uzlaşırım", weight: { air: 3 } }, { id: "d", text: "Zaman tanır, hissederim", weight: { water: 3 } }] },
    { id: "q7", text: "Seninle en uyumlu tip?", options: [{ id: "a", text: "Enerjik ve hevesli", weight: { fire: 3 } }, { id: "b", text: "Güvenilir ve planlı", weight: { earth: 3 } }, { id: "c", text: "Zeki ve esnek", weight: { air: 3 } }, { id: "d", text: "Sıcak ve duygusal", weight: { water: 3 } }] },
    { id: "q8", text: "Aşkı nasıl tanımlarsın?", options: [{ id: "a", text: "Tutku ve heyecan", weight: { fire: 3 } }, { id: "b", text: "Güven ve sadakat", weight: { earth: 3 } }, { id: "c", text: "Zihinsel uyum ve eğlence", weight: { air: 3 } }, { id: "d", text: "Derin bağ ve anlaşılma", weight: { water: 3 } }] },
    { id: "q9", text: "Partnerinin seni en çok anlaması gereken?", options: [{ id: "a", text: "Hedeflerim ve enerjim", weight: { fire: 3 } }, { id: "b", text: "İhtiyacım olan güven", weight: { earth: 3 } }, { id: "c", text: "Özgürlük ve merakım", weight: { air: 3 } }, { id: "d", text: "Duygularım ve sessiz anlarım", weight: { water: 3 } }] },
    { id: "q10", text: "İlişkide en çok neye ihtiyacın var?", options: [{ id: "a", text: "Heyecan ve saygı", weight: { fire: 3 } }, { id: "b", text: "İstikrar ve söz", weight: { earth: 3 } }, { id: "c", text: "Özgürlük ve sohbet", weight: { air: 3 } }, { id: "d", text: "Sevgi ve anlaşılma", weight: { water: 3 } }] },
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
    { id: "q1", text: "Yaratıcı projeye başlarken nasıl yaklaşırsın?", options: [{ id: "a", text: "Büyük fikirle başlar, enerjiyle ilerlerim", weight: { fire: 3 } }, { id: "b", text: "Plan yapar, adım adım ilerlerim", weight: { earth: 3 } }, { id: "c", text: "Fikirleri toplar, deneyerek ilerlerim", weight: { air: 3 } }, { id: "d", text: "Hislerime güvenir, içimden geldiği gibi", weight: { water: 3 } }] },
    { id: "q2", text: "En çok hangi sanat formu ilgini çeker?", options: [{ id: "a", text: "Performans, tiyatro, dans", weight: { fire: 3 } }, { id: "b", text: "El işi, mimari, tasarım", weight: { earth: 3 } }, { id: "c", text: "Yazı, konsept, yenilik", weight: { air: 3 } }, { id: "d", text: "Müzik, şiir, görsel sanat", weight: { water: 3 } }] },
    { id: "q3", text: "Yaratıcılıkta en çok ne seni besler?", options: [{ id: "a", text: "Heyecan ve risk", weight: { fire: 3 } }, { id: "b", text: "Malzeme ve teknik", weight: { earth: 3 } }, { id: "c", text: "Fikir ve kavram", weight: { air: 3 } }, { id: "d", text: "Duygu ve sezgi", weight: { water: 3 } }] },
    { id: "q4", text: "Yaratıcı tıkanıklıkta ne yaparsın?", options: [{ id: "a", text: "Farklı bir şeye geçer, enerji ararım", weight: { fire: 3 } }, { id: "b", text: "Tekniğe döner, pratik yaparım", weight: { earth: 3 } }, { id: "c", text: "Araştırır, ilham ararım", weight: { air: 3 } }, { id: "d", text: "İçime döner, duyguları dinlerim", weight: { water: 3 } }] },
    { id: "q5", text: "Eserini paylaşırken nasıl hissedersin?", options: [{ id: "a", text: "Gururlu, performans isterim", weight: { fire: 3 } }, { id: "b", text: "Güvenli, kaliteyi gösteririm", weight: { earth: 3 } }, { id: "c", text: "Meraklı, geri bildirim isterim", weight: { air: 3 } }, { id: "d", text: "Kırılgan, samimiyet ararım", weight: { water: 3 } }] },
    { id: "q6", text: "Yaratıcılıkta en güçlü yönün?", options: [{ id: "a", text: "Cesaret ve orijinallik", weight: { fire: 3 } }, { id: "b", text: "Teknik ve detay", weight: { earth: 3 } }, { id: "c", text: "Fikir ve yenilik", weight: { air: 3 } }, { id: "d", text: "Duygu ve derinlik", weight: { water: 3 } }] },
    { id: "q7", text: "Eleştiri aldığında?", options: [{ id: "a", text: "Savunur, kendi yoluma giderim", weight: { fire: 3 } }, { id: "b", text: "Mantıklı olanı değerlendiririm", weight: { earth: 3 } }, { id: "c", text: "Tartışır, farklı bakış alırım", weight: { air: 3 } }, { id: "d", text: "İncinirim ama içselleştiririm", weight: { water: 3 } }] },
    { id: "q8", text: "Yaratıcı işbirliğinde rolün?", options: [{ id: "a", text: "Lider, vizyon sunarım", weight: { fire: 3 } }, { id: "b", text: "Organize eder, uygularım", weight: { earth: 3 } }, { id: "c", text: "Fikir üretir, tartışırım", weight: { air: 3 } }, { id: "d", text: "Uyum sağlar, duygusal destek veririm", weight: { water: 3 } }] },
    { id: "q9", text: "Yaratıcılık senin için ne ifade eder?", options: [{ id: "a", text: "Özgürlük ve kendini ifade", weight: { fire: 3 } }, { id: "b", text: "Somut sonuç ve kalite", weight: { earth: 3 } }, { id: "c", text: "Keşif ve öğrenme", weight: { air: 3 } }, { id: "d", text: "Duygusal ifade ve anlam", weight: { water: 3 } }] },
    { id: "q10", text: "Yaratıcı projeyi tamamlarken?", options: [{ id: "a", text: "Hızlı bitirir, yeniye geçerim", weight: { fire: 3 } }, { id: "b", text: "Detayları bitirir, mükemmelleştiririm", weight: { earth: 3 } }, { id: "c", text: "Gerekirse revize eder, geliştiririm", weight: { air: 3 } }, { id: "d", text: "Duygusal olarak bağlanır, zor bırakırım", weight: { water: 3 } }] },
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
    { id: "q1", text: "Sağlıklı kalmak için en önemli şey?", options: [{ id: "a", text: "Aktif olmak ve spor", weight: { fire: 3 } }, { id: "b", text: "Düzenli rutin ve beslenme", weight: { earth: 3 } }, { id: "c", text: "Çeşitli aktivite ve denge", weight: { air: 3 } }, { id: "d", text: "İçsel huzur ve dinlenme", weight: { water: 3 } }] },
    { id: "q2", text: "Egzersiz tercihin?", options: [{ id: "a", text: "Yoğun, rekabetçi spor", weight: { fire: 3 } }, { id: "b", text: "Planlı, düzenli antrenman", weight: { earth: 3 } }, { id: "c", text: "Çeşitli, eğlenceli aktivite", weight: { air: 3 } }, { id: "d", text: "Sakin, içsel odaklı (yoga, yürüyüş)", weight: { water: 3 } }] },
    { id: "q3", text: "Stres yönetiminde ne yaparsın?", options: [{ id: "a", text: "Spor veya fiziksel aktivite", weight: { fire: 3 } }, { id: "b", text: "Rutin ve düzen", weight: { earth: 3 } }, { id: "c", text: "Sohbet ve öğrenme", weight: { air: 3 } }, { id: "d", text: "Meditasyon veya yalnız zaman", weight: { water: 3 } }] },
    { id: "q4", text: "Beslenme yaklaşımın?", options: [{ id: "a", text: "Enerji için, pratik", weight: { fire: 3 } }, { id: "b", text: "Planlı, dengeli ve düzenli", weight: { earth: 3 } }, { id: "c", text: "Çeşitli, deneyerek", weight: { air: 3 } }, { id: "d", text: "Duygusal ve içsel dengeye göre", weight: { water: 3 } }] },
    { id: "q5", text: "Uyku rutinin?", options: [{ id: "a", text: "Kısa ama derin, erken kalkarım", weight: { fire: 3 } }, { id: "b", text: "Düzenli saatler, kaliteli uyku", weight: { earth: 3 } }, { id: "c", text: "Esnek, ihtiyaca göre", weight: { air: 3 } }, { id: "d", text: "Uzun, dinlenme odaklı", weight: { water: 3 } }] },
    { id: "q6", text: "Hasta olduğunda nasıl davranırsın?", options: [{ id: "a", text: "Hareketsiz kalamam, mücadele ederim", weight: { fire: 3 } }, { id: "b", text: "Dinlenir, planlı iyileşirim", weight: { earth: 3 } }, { id: "c", text: "Araştırır, alternatif denerim", weight: { air: 3 } }, { id: "d", text: "İçime döner, duygusal destek ararım", weight: { water: 3 } }] },
    { id: "q7", text: "Mental sağlık için ne yaparsın?", options: [{ id: "a", text: "Hedef ve başarı", weight: { fire: 3 } }, { id: "b", text: "Düzen ve kontrol", weight: { earth: 3 } }, { id: "c", text: "Öğrenme ve sosyal bağ", weight: { air: 3 } }, { id: "d", text: "Duygusal ifade ve bağ", weight: { water: 3 } }] },
    { id: "q8", text: "Wellness rutini oluştururken?", options: [{ id: "a", text: "Hemen başlar, enerjiyle ilerlerim", weight: { fire: 3 } }, { id: "b", text: "Plan yapar, sistematik uygularım", weight: { earth: 3 } }, { id: "c", text: "Deneyerek, esnek tutarım", weight: { air: 3 } }, { id: "d", text: "İçsel ihtiyaca göre yavaş başlarım", weight: { water: 3 } }] },
    { id: "q9", text: "Sağlık hedefin?", options: [{ id: "a", text: "Güç ve dayanıklılık", weight: { fire: 3 } }, { id: "b", text: "Denge ve istikrar", weight: { earth: 3 } }, { id: "c", text: "Esneklik ve çeşitlilik", weight: { air: 3 } }, { id: "d", text: "İçsel huzur ve duygusal denge", weight: { water: 3 } }] },
    { id: "q10", text: "Sağlıkta en çok ne seni zorlar?", options: [{ id: "a", text: "Dinlenmek ve yavaşlamak", weight: { fire: 3 } }, { id: "b", text: "Değişiklik ve esneklik", weight: { earth: 3 } }, { id: "c", text: "Rutin ve tekrar", weight: { air: 3 } }, { id: "d", text: "Dış aktivite ve sosyal baskı", weight: { water: 3 } }] },
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
    { id: "q1", text: "Para harcarken en çok neye dikkat edersin?", options: [{ id: "a", text: "Fırsat ve değer", weight: { fire: 3 } }, { id: "b", text: "Bütçe ve plan", weight: { earth: 3 } }, { id: "c", text: "Araştırma ve karşılaştırma", weight: { air: 3 } }, { id: "d", text: "Duygusal değer ve anlam", weight: { water: 3 } }] },
    { id: "q2", text: "Yatırım yaparken yaklaşımın?", options: [{ id: "a", text: "Risk alır, büyük hedef", weight: { fire: 3 } }, { id: "b", text: "Güvenli, uzun vadeli", weight: { earth: 3 } }, { id: "c", text: "Çeşitli, dengeli portföy", weight: { air: 3 } }, { id: "d", text: "Değer ve güven odaklı", weight: { water: 3 } }] },
    { id: "q3", text: "Birikim yaparken?", options: [{ id: "a", text: "Hedef odaklı, hızlı birikirim", weight: { fire: 3 } }, { id: "b", text: "Düzenli, sistematik birikirim", weight: { earth: 3 } }, { id: "c", text: "Esnek, ihtiyaca göre", weight: { air: 3 } }, { id: "d", text: "Güvenlik için, aile odaklı", weight: { water: 3 } }] },
    { id: "q4", text: "Büyük bir harcama kararı?", options: [{ id: "a", text: "Hızlı karar, fırsatı kaçırmam", weight: { fire: 3 } }, { id: "b", text: "Plan yapar, araştırırım", weight: { earth: 3 } }, { id: "c", text: "Karşılaştırır, analiz ederim", weight: { air: 3 } }, { id: "d", text: "Değer ve hislere göre karar", weight: { water: 3 } }] },
    { id: "q5", text: "Borç / kredi hakkında?", options: [{ id: "a", text: "Gerekirse risk alırım", weight: { fire: 3 } }, { id: "b", text: "Mümkünse kaçınırım", weight: { earth: 3 } }, { id: "c", text: "Mantıklıysa kullanırım", weight: { air: 3 } }, { id: "d", text: "Güvenli ve gerekliyse", weight: { water: 3 } }] },
    { id: "q6", text: "Para kaybı yaşayınca?", options: [{ id: "a", text: "Hemen yeni fırsat ararım", weight: { fire: 3 } }, { id: "b", text: "Ders çıkarır, daha temkinli olurum", weight: { earth: 3 } }, { id: "c", text: "Analiz eder, strateji değiştiririm", weight: { air: 3 } }, { id: "d", text: "Duygusal olarak etkilenirim", weight: { water: 3 } }] },
    { id: "q7", text: "Para senin için ne ifade eder?", options: [{ id: "a", text: "Özgürlük ve fırsat", weight: { fire: 3 } }, { id: "b", text: "Güvenlik ve istikrar", weight: { earth: 3 } }, { id: "c", text: "Seçenek ve deneyim", weight: { air: 3 } }, { id: "d", text: "Güven ve huzur", weight: { water: 3 } }] },
    { id: "q8", text: "Bütçe yönetiminde?", options: [{ id: "a", text: "Genel plan, esnek", weight: { fire: 3 } }, { id: "b", text: "Detaylı takip, disiplinli", weight: { earth: 3 } }, { id: "c", text: "Kategorize, analiz ederim", weight: { air: 3 } }, { id: "d", text: "Temel ihtiyaçlar, duygusal denge", weight: { water: 3 } }] },
    { id: "q9", text: "Para kazanmak için?", options: [{ id: "a", text: "Risk alır, girişimcilik", weight: { fire: 3 } }, { id: "b", text: "İstikrarlı gelir, güvenli iş", weight: { earth: 3 } }, { id: "c", text: "Çeşitli kaynak, esneklik", weight: { air: 3 } }, { id: "d", text: "Anlamlı iş, değer yaratma", weight: { water: 3 } }] },
    { id: "q10", text: "Finansal hedefin?", options: [{ id: "a", text: "Büyük başarı ve özgürlük", weight: { fire: 3 } }, { id: "b", text: "Güvenli emeklilik ve istikrar", weight: { earth: 3 } }, { id: "c", text: "Esneklik ve çeşitlilik", weight: { air: 3 } }, { id: "d", text: "Aile güvenliği ve huzur", weight: { water: 3 } }] },
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
    { id: "q1", text: "Çocuk yetiştirmede en önemli değer?", options: [{ id: "a", text: "Cesaret ve bağımsızlık", weight: { fire: 3 } }, { id: "b", text: "Sorumluluk ve düzen", weight: { earth: 3 } }, { id: "c", text: "Özgürlük ve merak", weight: { air: 3 } }, { id: "d", text: "Sevgi ve empati", weight: { water: 3 } }] },
    { id: "q2", text: "Disiplin yaklaşımın?", options: [{ id: "a", text: "Net kurallar, sonuçları hemen", weight: { fire: 3 } }, { id: "b", text: "Tutarlı sınırlar, planlı", weight: { earth: 3 } }, { id: "c", text: "Açıklama ve mantık", weight: { air: 3 } }, { id: "d", text: "Anlayış ve duygusal bağ", weight: { water: 3 } }] },
    { id: "q3", text: "Çocuğun zorlandığında?", options: [{ id: "a", text: "Cesaret verir, harekete geçiririm", weight: { fire: 3 } }, { id: "b", text: "Plan yapar, adım adım ilerletirim", weight: { earth: 3 } }, { id: "c", text: "Konuşur, farklı açılar sunarım", weight: { air: 3 } }, { id: "d", text: "Yanında olur, hissederim", weight: { water: 3 } }] },
    { id: "q4", text: "Aile aktivitelerinde?", options: [{ id: "a", text: "Aksiyon ve macera", weight: { fire: 3 } }, { id: "b", text: "Planlı ve düzenli", weight: { earth: 3 } }, { id: "c", text: "Çeşitli ve eğlenceli", weight: { air: 3 } }, { id: "d", text: "Sakin ve bağ kurucu", weight: { water: 3 } }] },
    { id: "q5", text: "Çocuğunun başarısı için?", options: [{ id: "a", text: "Hedef koyar, motive ederim", weight: { fire: 3 } }, { id: "b", text: "Plan yapar, desteklerim", weight: { earth: 3 } }, { id: "c", text: "Öğrenmeyi teşvik ederim", weight: { air: 3 } }, { id: "d", text: "Duygusal destek veririm", weight: { water: 3 } }] },
    { id: "q6", text: "Çocuğun hata yapınca?", options: [{ id: "a", text: "Sonuçları gösterir, ders çıkartırım", weight: { fire: 3 } }, { id: "b", text: "Kuralları hatırlatır, düzeltirim", weight: { earth: 3 } }, { id: "c", text: "Tartışır, alternatif gösteririm", weight: { air: 3 } }, { id: "d", text: "Anlayışla yaklaşır, desteklerim", weight: { water: 3 } }] },
    { id: "q7", text: "Aile içi çatışmada?", options: [{ id: "a", text: "Net çözüm, adil karar", weight: { fire: 3 } }, { id: "b", text: "Kurallar ve sınırlar", weight: { earth: 3 } }, { id: "c", text: "Konuşma ve uzlaşma", weight: { air: 3 } }, { id: "d", text: "Herkesin hissini dinleme", weight: { water: 3 } }] },
    { id: "q8", text: "Çocuğuna öğretmek istediğin?", options: [{ id: "a", text: "Cesaret ve hedef", weight: { fire: 3 } }, { id: "b", text: "Sorumluluk ve düzen", weight: { earth: 3 } }, { id: "c", text: "Merak ve öğrenme", weight: { air: 3 } }, { id: "d", text: "Sevgi ve empati", weight: { water: 3 } }] },
    { id: "q9", text: "Aile zamanı senin için?", options: [{ id: "a", text: "Aktif ve heyecanlı", weight: { fire: 3 } }, { id: "b", text: "Düzenli ve güvenli", weight: { earth: 3 } }, { id: "c", text: "Eğlenceli ve çeşitli", weight: { air: 3 } }, { id: "d", text: "Sakin ve bağ kurucu", weight: { water: 3 } }] },
    { id: "q10", text: "Ebeveynlikte en çok ne seni zorlar?", options: [{ id: "a", text: "Sabır ve yavaş ilerleme", weight: { fire: 3 } }, { id: "b", text: "Esneklik ve spontanlık", weight: { earth: 3 } }, { id: "c", text: "Rutin ve tekrar", weight: { air: 3 } }, { id: "d", text: "Sınır koyma ve disiplin", weight: { water: 3 } }] },
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
    { id: "q1", text: "Maneviyat senin için ne ifade eder?", options: [{ id: "a", text: "Aksiyon ve dönüşüm", weight: { fire: 3 } }, { id: "b", text: "Kök ve gelenek", weight: { earth: 3 } }, { id: "c", text: "Keşif ve öğrenme", weight: { air: 3 } }, { id: "d", text: "Derin bağ ve sezgi", weight: { water: 3 } }] },
    { id: "q2", text: "İçsel pratiğin nasıl?", options: [{ id: "a", text: "Aktif ritüel ve hedef", weight: { fire: 3 } }, { id: "b", text: "Düzenli ve sistematik", weight: { earth: 3 } }, { id: "c", text: "Çeşitli ve esnek", weight: { air: 3 } }, { id: "d", text: "Sezgisel ve duygusal", weight: { water: 3 } }] },
    { id: "q3", text: "Ruhsal arayışta ne yaparsın?", options: [{ id: "a", text: "Liderlik eder, ilham veririm", weight: { fire: 3 } }, { id: "b", text: "Geleneği takip ederim", weight: { earth: 3 } }, { id: "c", text: "Araştırır, öğrenirim", weight: { air: 3 } }, { id: "d", text: "İçime döner, hissederim", weight: { water: 3 } }] },
    { id: "q4", text: "Doğa ile bağın?", options: [{ id: "a", text: "Aktif, spor ve macera", weight: { fire: 3 } }, { id: "b", text: "Bahçe, toprak, köklü", weight: { earth: 3 } }, { id: "c", text: "Gözlem ve keşif", weight: { air: 3 } }, { id: "d", text: "Derin bağ ve sessizlik", weight: { water: 3 } }] },
    { id: "q5", text: "Meditasyon / dua pratiğin?", options: [{ id: "a", text: "Aktif, hareketli meditasyon", weight: { fire: 3 } }, { id: "b", text: "Düzenli, ritüel odaklı", weight: { earth: 3 } }, { id: "c", text: "Esnek, çeşitli teknikler", weight: { air: 3 } }, { id: "d", text: "Derin, sessiz ve içsel", weight: { water: 3 } }] },
    { id: "q6", text: "Ruhsal krizde nasıl toparlanırsın?", options: [{ id: "a", text: "Harekete geçer, dönüşüm yaratırım", weight: { fire: 3 } }, { id: "b", text: "Rutine döner, köklere bağlanırım", weight: { earth: 3 } }, { id: "c", text: "Öğrenir, perspektif değiştiririm", weight: { air: 3 } }, { id: "d", text: "İçime döner, duyguları işlerim", weight: { water: 3 } }] },
    { id: "q7", text: "Maneviyat ve günlük hayat?", options: [{ id: "a", text: "Aksiyonla birleştiririm", weight: { fire: 3 } }, { id: "b", text: "Rutin ve ritüelle entegre", weight: { earth: 3 } }, { id: "c", text: "Felsefe ve düşünceyle", weight: { air: 3 } }, { id: "d", text: "Duygu ve sezgiyle", weight: { water: 3 } }] },
    { id: "q8", text: "Ruhsal toplulukta rolün?", options: [{ id: "a", text: "Lider ve ilham veren", weight: { fire: 3 } }, { id: "b", text: "Güvenilir ve istikrarlı", weight: { earth: 3 } }, { id: "c", text: "Öğrenci ve soru soran", weight: { air: 3 } }, { id: "d", text: "Empatik ve bağ kuran", weight: { water: 3 } }] },
    { id: "q9", text: "İçsel yolculukta hedefin?", options: [{ id: "a", text: "Dönüşüm ve liderlik", weight: { fire: 3 } }, { id: "b", text: "Kök ve istikrar", weight: { earth: 3 } }, { id: "c", text: "Keşif ve öğrenme", weight: { air: 3 } }, { id: "d", text: "Derinlik ve bağ", weight: { water: 3 } }] },
    { id: "q10", text: "Maneviyat seni nasıl değiştirdi?", options: [{ id: "a", text: "Daha cesur ve lider oldum", weight: { fire: 3 } }, { id: "b", text: "Daha köklü ve güvenli", weight: { earth: 3 } }, { id: "c", text: "Daha meraklı ve esnek", weight: { air: 3 } }, { id: "d", text: "Daha derin ve bağlı", weight: { water: 3 } }] },
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
    { id: "q1", text: "Kariyerinde en çok ne seni motive eder?", options: [{ id: "a", text: "Liderlik ve başarı", weight: { fire: 3 } }, { id: "b", text: "Güvenlik ve istikrar", weight: { earth: 3 } }, { id: "c", text: "Öğrenme ve yenilik", weight: { air: 3 } }, { id: "d", text: "Anlam ve insanlara dokunmak", weight: { water: 3 } }] },
    { id: "q2", text: "İdeal iş ortamın nasıl olur?", options: [{ id: "a", text: "Rekabetçi, hızlı, hedef odaklı", weight: { fire: 3 } }, { id: "b", text: "Düzenli, güvenli, planlı", weight: { earth: 3 } }, { id: "c", text: "Esnek, yaratıcı, çeşitli", weight: { air: 3 } }, { id: "d", text: "İşbirlikçi, anlamlı, destekleyici", weight: { water: 3 } }] },
    { id: "q3", text: "Kariyer hedefin nedir?", options: [{ id: "a", text: "CEO, girişimci veya üst yönetim", weight: { fire: 3 } }, { id: "b", text: "Uzman, müdür veya güvenli pozisyon", weight: { earth: 3 } }, { id: "c", text: "Serbest çalışan veya çeşitli projeler", weight: { air: 3 } }, { id: "d", text: "Anlamlı iş, danışman veya mentor", weight: { water: 3 } }] },
    { id: "q4", text: "İş değiştirme kararı?", options: [{ id: "a", text: "Daha iyi fırsat varsa cesurca geçerim", weight: { fire: 3 } }, { id: "b", text: "Güvenli geçiş, net koşullar", weight: { earth: 3 } }, { id: "c", text: "Yeni deneyim, merak", weight: { air: 3 } }, { id: "d", text: "Değer ve anlam uyumu", weight: { water: 3 } }] },
    { id: "q5", text: "Başarısızlık sonrası?", options: [{ id: "a", text: "Hemen yeni hedefe geçerim", weight: { fire: 3 } }, { id: "b", text: "Ders çıkarır, planı revize ederim", weight: { earth: 3 } }, { id: "c", text: "Analiz eder, farklı denerim", weight: { air: 3 } }, { id: "d", text: "Duygusal toparlanır, tekrar denerim", weight: { water: 3 } }] },
    { id: "q6", text: "Terfi / fırsat geldiğinde?", options: [{ id: "a", text: "Hemen kapar, risk alırım", weight: { fire: 3 } }, { id: "b", text: "Artıları eksileri değerlendiririm", weight: { earth: 3 } }, { id: "c", text: "Yeni deneyim olarak görürüm", weight: { air: 3 } }, { id: "d", text: "Ekip ve ortam uyumuna bakarım", weight: { water: 3 } }] },
    { id: "q7", text: "Kariyerinde en çok ne seni zorlar?", options: [{ id: "a", text: "Yavaş ilerleme ve rutin", weight: { fire: 3 } }, { id: "b", text: "Belirsizlik ve değişim", weight: { earth: 3 } }, { id: "c", text: "Tekrarlayan görevler", weight: { air: 3 } }, { id: "d", text: "Duygusuz ortam ve rekabet", weight: { water: 3 } }] },
    { id: "q8", text: "Networking / çevre yapma?", options: [{ id: "a", text: "Aktif, liderlik ederim", weight: { fire: 3 } }, { id: "b", text: "Seçici, güvenilir bağlar", weight: { earth: 3 } }, { id: "c", text: "Geniş çevre, çeşitli insanlar", weight: { air: 3 } }, { id: "d", text: "Derin bağlar, samimi ilişkiler", weight: { water: 3 } }] },
    { id: "q9", text: "Kariyerinde en çok ne seni mutlu eder?", options: [{ id: "a", text: "Başarı ve tanınma", weight: { fire: 3 } }, { id: "b", text: "Güvenli gelir ve istikrar", weight: { earth: 3 } }, { id: "c", text: "Öğrenme ve çeşitlilik", weight: { air: 3 } }, { id: "d", text: "Anlamlı katkı ve bağ", weight: { water: 3 } }] },
    { id: "q10", text: "Emeklilikte nasıl hatırlanmak istersin?", options: [{ id: "a", text: "Lider ve başarılı", weight: { fire: 3 } }, { id: "b", text: "Güvenilir ve istikrarlı", weight: { earth: 3 } }, { id: "c", text: "Yenilikçi ve öğretici", weight: { air: 3 } }, { id: "d", text: "İnsanlara dokunan ve anlamlı", weight: { water: 3 } }] },
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
    { id: "q1", text: "Takımı yönetirken önceliğin?", options: [{ id: "a", text: "Hedefe ulaşmak ve sonuç", weight: { fire: 3 } }, { id: "b", text: "Plan ve süreç", weight: { earth: 3 } }, { id: "c", text: "Fikir alışverişi ve uzlaşma", weight: { air: 3 } }, { id: "d", text: "Takım uyumu ve destek", weight: { water: 3 } }] },
    { id: "q2", text: "Karar verirken yaklaşımın?", options: [{ id: "a", text: "Hızlı ve net karar veririm", weight: { fire: 3 } }, { id: "b", text: "Veri toplar, planlı karar veririm", weight: { earth: 3 } }, { id: "c", text: "Herkesi dinler, ortak karar", weight: { air: 3 } }, { id: "d", text: "Hisleri ve değerleri dikkate alırım", weight: { water: 3 } }] },
    { id: "q3", text: "Takım üyesi hata yapınca?", options: [{ id: "a", text: "Sonucu gösterir, düzeltmesini isterim", weight: { fire: 3 } }, { id: "b", text: "Süreci analiz eder, düzeltirim", weight: { earth: 3 } }, { id: "c", text: "Tartışır, alternatif gösteririm", weight: { air: 3 } }, { id: "d", text: "Anlayışla yaklaşır, desteklerim", weight: { water: 3 } }] },
    { id: "q4", text: "Takımı motive ederken?", options: [{ id: "a", text: "Hedef ve başarı vurgusu", weight: { fire: 3 } }, { id: "b", text: "Plan ve güvenlik", weight: { earth: 3 } }, { id: "c", text: "Fikir ve öğrenme", weight: { air: 3 } }, { id: "d", text: "Değer ve anlam", weight: { water: 3 } }] },
    { id: "q5", text: "Çatışma çözümünde?", options: [{ id: "a", text: "Net karar, sonuç odaklı", weight: { fire: 3 } }, { id: "b", text: "Kurallar ve prosedür", weight: { earth: 3 } }, { id: "c", text: "Uzlaşma ve alternatif", weight: { air: 3 } }, { id: "d", text: "Herkesin hissini dinleme", weight: { water: 3 } }] },
    { id: "q6", text: "Delegasyon yaparken?", options: [{ id: "a", text: "Sonucu takip ederim", weight: { fire: 3 } }, { id: "b", text: "Süreci ve adımları belirlerim", weight: { earth: 3 } }, { id: "c", text: "Esnek bırakır, desteklerim", weight: { air: 3 } }, { id: "d", text: "Güven verir, yanında olurum", weight: { water: 3 } }] },
    { id: "q7", text: "Takım toplantısında?", options: [{ id: "a", text: "Agenda yönetir, sonuç alırım", weight: { fire: 3 } }, { id: "b", text: "Plan sunar, takip ederim", weight: { earth: 3 } }, { id: "c", text: "Fikir toplar, tartıştırırım", weight: { air: 3 } }, { id: "d", text: "Herkesi dinler, uyum sağlarım", weight: { water: 3 } }] },
    { id: "q8", text: "Takım üyesi zorlandığında?", options: [{ id: "a", text: "Hedefi hatırlatır, motive ederim", weight: { fire: 3 } }, { id: "b", text: "Plan yapar, adım adım ilerletirim", weight: { earth: 3 } }, { id: "c", text: "Alternatif gösterir, desteklerim", weight: { air: 3 } }, { id: "d", text: "Yanında olur, duygusal destek veririm", weight: { water: 3 } }] },
    { id: "q9", text: "Liderlikte en güçlü yönün?", options: [{ id: "a", text: "Vizyon ve cesaret", weight: { fire: 3 } }, { id: "b", text: "Planlama ve güvenilirlik", weight: { earth: 3 } }, { id: "c", text: "İletişim ve yenilik", weight: { air: 3 } }, { id: "d", text: "Empati ve uyum", weight: { water: 3 } }] },
    { id: "q10", text: "Liderlikte geliştirmek istediğin?", options: [{ id: "a", text: "Dinleme ve sabır", weight: { fire: 3 } }, { id: "b", text: "Esneklik ve risk", weight: { earth: 3 } }, { id: "c", text: "Kararlılık ve netlik", weight: { air: 3 } }, { id: "d", text: "Sınır ve kararlılık", weight: { water: 3 } }] },
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
    { id: "q1", text: "İşe başlarken nasıl yaklaşırsın?", options: [{ id: "a", text: "Hemen başlar, hızlı ilerlerim", weight: { fire: 3 } }, { id: "b", text: "Plan yapar, adım adım ilerlerim", weight: { earth: 3 } }, { id: "c", text: "Fikirleri toplar, esnek çalışırım", weight: { air: 3 } }, { id: "d", text: "Derinlemesine anlar, sonra başlarım", weight: { water: 3 } }] },
    { id: "q2", text: "Birden fazla proje arasında?", options: [{ id: "a", text: "Rahatım, hızlı geçiş yaparım", weight: { fire: 3 } }, { id: "b", text: "Tek seferde birine odaklanırım", weight: { earth: 3 } }, { id: "c", text: "Esnek, ihtiyaca göre", weight: { air: 3 } }, { id: "d", text: "Zorlanırım, tek proje tercih", weight: { water: 3 } }] },
    { id: "q3", text: "Deadline yaklaşınca?", options: [{ id: "a", text: "Son anda enerji patlaması", weight: { fire: 3 } }, { id: "b", text: "Planlı, zamanında bitiririm", weight: { earth: 3 } }, { id: "c", text: "Odaklanır, esnek çalışırım", weight: { air: 3 } }, { id: "d", text: "Streslenirim ama tamamlarım", weight: { water: 3 } }] },
    { id: "q4", text: "Rutin görevlerde?", options: [{ id: "a", text: "Sıkılırım, hızlı bitirmek isterim", weight: { fire: 3 } }, { id: "b", text: "Rahatım, düzen severim", weight: { earth: 3 } }, { id: "c", text: "Otomatikleştirir, optimize ederim", weight: { air: 3 } }, { id: "d", text: "Derinlemesine yapar, anlam ararım", weight: { water: 3 } }] },
    { id: "q5", text: "Yeni bir şey öğrenirken?", options: [{ id: "a", text: "Hemen uygular, deneyerek öğrenirim", weight: { fire: 3 } }, { id: "b", text: "Sistematik öğrenir, adım adım", weight: { earth: 3 } }, { id: "c", text: "Araştırır, farklı kaynaklardan", weight: { air: 3 } }, { id: "d", text: "Derinlemesine anlar, içselleştiririm", weight: { water: 3 } }] },
    { id: "q6", text: "İş ortamında en çok ne seni yorar?", options: [{ id: "a", text: "Yavaşlık ve rutin", weight: { fire: 3 } }, { id: "b", text: "Dağınıklık ve belirsizlik", weight: { earth: 3 } }, { id: "c", text: "Tekrar ve sıkıcılık", weight: { air: 3 } }, { id: "d", text: "Rekabet ve duygusuzluk", weight: { water: 3 } }] },
    { id: "q7", text: "Takım çalışmasında rolün?", options: [{ id: "a", text: "Lider, yönlendirici", weight: { fire: 3 } }, { id: "b", text: "Organize eden, takip eden", weight: { earth: 3 } }, { id: "c", text: "Fikir üreten, koordine eden", weight: { air: 3 } }, { id: "d", text: "Uyum sağlayan, destekleyen", weight: { water: 3 } }] },
    { id: "q8", text: "Hata yapınca?", options: [{ id: "a", text: "Hemen düzeltir, devam ederim", weight: { fire: 3 } }, { id: "b", text: "Analiz eder, tekrar etmem", weight: { earth: 3 } }, { id: "c", text: "Öğrenir, alternatif denerim", weight: { air: 3 } }, { id: "d", text: "İçselleştirir, dikkatli olurum", weight: { water: 3 } }] },
    { id: "q9", text: "En verimli çalışma zamanın?", options: [{ id: "a", text: "Sabah erken, enerji dolu", weight: { fire: 3 } }, { id: "b", text: "Sabah, düzenli saatler", weight: { earth: 3 } }, { id: "c", text: "Esnek, ihtiyaca göre", weight: { air: 3 } }, { id: "d", text: "Sakin saatler, derin odak", weight: { water: 3 } }] },
    { id: "q10", text: "İşte en çok ne seni mutlu eder?", options: [{ id: "a", text: "Başarı ve sonuç", weight: { fire: 3 } }, { id: "b", text: "Düzen ve kalite", weight: { earth: 3 } }, { id: "c", text: "Yenilik ve öğrenme", weight: { air: 3 } }, { id: "d", text: "Anlam ve bağ", weight: { water: 3 } }] },
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
    { id: "q1", text: "İşte en önemli değerin?", options: [{ id: "a", text: "Başarı ve tanınma", weight: { fire: 3 } }, { id: "b", text: "Güvenlik ve istikrar", weight: { earth: 3 } }, { id: "c", text: "Öğrenme ve özgürlük", weight: { air: 3 } }, { id: "d", text: "Anlam ve bağ", weight: { water: 3 } }] },
    { id: "q2", text: "Para senin için ne ifade eder?", options: [{ id: "a", text: "Başarı ve özgürlük", weight: { fire: 3 } }, { id: "b", text: "Güvenlik ve rahatlık", weight: { earth: 3 } }, { id: "c", text: "Seçenek ve deneyim", weight: { air: 3 } }, { id: "d", text: "Güven ve huzur", weight: { water: 3 } }] },
    { id: "q3", text: "İş değiştirme nedenin?", options: [{ id: "a", text: "Daha iyi fırsat ve başarı", weight: { fire: 3 } }, { id: "b", text: "Güvenlik ve istikrar eksikliği", weight: { earth: 3 } }, { id: "c", text: "Sıkıcılık ve öğrenme eksikliği", weight: { air: 3 } }, { id: "d", text: "Anlam ve değer uyumsuzluğu", weight: { water: 3 } }] },
    { id: "q4", text: "İşte en çok ne seni mutsuz eder?", options: [{ id: "a", text: "Yavaş ilerleme ve rutin", weight: { fire: 3 } }, { id: "b", text: "Belirsizlik ve güvensizlik", weight: { earth: 3 } }, { id: "c", text: "Tekrar ve sıkıcılık", weight: { air: 3 } }, { id: "d", text: "Duygusuzluk ve anlamsızlık", weight: { water: 3 } }] },
    { id: "q5", text: "İdeal iş ortamı?", options: [{ id: "a", text: "Rekabetçi, hızlı, başarı odaklı", weight: { fire: 3 } }, { id: "b", text: "Düzenli, güvenli, planlı", weight: { earth: 3 } }, { id: "c", text: "Yenilikçi, esnek, öğrenme odaklı", weight: { air: 3 } }, { id: "d", text: "Anlamlı, destekleyici, uyumlu", weight: { water: 3 } }] },
    { id: "q6", text: "Terfi için ne önemli?", options: [{ id: "a", text: "Başarı ve sonuçlar", weight: { fire: 3 } }, { id: "b", text: "Sadakat ve güvenilirlik", weight: { earth: 3 } }, { id: "c", text: "Yenilik ve katkı", weight: { air: 3 } }, { id: "d", text: "Takım uyumu ve destek", weight: { water: 3 } }] },
    { id: "q7", text: "İş-yaşam dengesinde?", options: [{ id: "a", text: "İş öncelikli, hedef odaklı", weight: { fire: 3 } }, { id: "b", text: "Dengeli, planlı", weight: { earth: 3 } }, { id: "c", text: "Esnek, ihtiyaca göre", weight: { air: 3 } }, { id: "d", text: "Anlamlı denge, duygusal tatmin", weight: { water: 3 } }] },
    { id: "q8", text: "İşte en çok ne seni motive eder?", options: [{ id: "a", text: "Hedef ve başarı", weight: { fire: 3 } }, { id: "b", text: "Güvenlik ve plan", weight: { earth: 3 } }, { id: "c", text: "Yenilik ve öğrenme", weight: { air: 3 } }, { id: "d", text: "Anlam ve bağ", weight: { water: 3 } }] },
    { id: "q9", text: "İş arkadaşlarıyla ilişkin?", options: [{ id: "a", text: "Rekabetçi ama saygılı", weight: { fire: 3 } }, { id: "b", text: "Güvenilir ve istikrarlı", weight: { earth: 3 } }, { id: "c", text: "Sosyal ve eğlenceli", weight: { air: 3 } }, { id: "d", text: "Samimi ve destekleyici", weight: { water: 3 } }] },
    { id: "q10", text: "İşte vazgeçemeyeceğin şey?", options: [{ id: "a", text: "Özgürlük ve başarı", weight: { fire: 3 } }, { id: "b", text: "Güvenlik ve istikrar", weight: { earth: 3 } }, { id: "c", text: "Öğrenme ve esneklik", weight: { air: 3 } }, { id: "d", text: "Anlam ve bağ", weight: { water: 3 } }] },
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
    { id: "q1", text: "En çok hangi tür işler ilgini çeker?", options: [{ id: "a", text: "Liderlik ve yönetim", weight: { fire: 3 } }, { id: "b", text: "Uzmanlık ve teknik", weight: { earth: 3 } }, { id: "c", text: "İletişim ve yenilik", weight: { air: 3 } }, { id: "d", text: "İnsanlara yardım ve sanat", weight: { water: 3 } }] },
    { id: "q2", text: "İdeal meslekte ne olmalı?", options: [{ id: "a", text: "Başarı ve görünürlük", weight: { fire: 3 } }, { id: "b", text: "Güvenlik ve istikrar", weight: { earth: 3 } }, { id: "c", text: "Öğrenme ve çeşitlilik", weight: { air: 3 } }, { id: "d", text: "Anlam ve insanlara dokunmak", weight: { water: 3 } }] },
    { id: "q3", text: "Hangi ortamda çalışmak istersin?", options: [{ id: "a", text: "Rekabetçi, hızlı, dinamik", weight: { fire: 3 } }, { id: "b", text: "Düzenli, güvenli, planlı", weight: { earth: 3 } }, { id: "c", text: "Yenilikçi, esnek, çeşitli", weight: { air: 3 } }, { id: "d", text: "Destekleyici, anlamlı, uyumlu", weight: { water: 3 } }] },
    { id: "q4", text: "Meslek seçerken önceliğin?", options: [{ id: "a", text: "Kazanç ve başarı potansiyeli", weight: { fire: 3 } }, { id: "b", text: "Güvenli gelir ve istikrar", weight: { earth: 3 } }, { id: "c", text: "Öğrenme ve gelişim fırsatı", weight: { air: 3 } }, { id: "d", text: "Anlam ve değer uyumu", weight: { water: 3 } }] },
    { id: "q5", text: "Hangi alanda kendini güçlü hissedersin?", options: [{ id: "a", text: "Liderlik ve karar verme", weight: { fire: 3 } }, { id: "b", text: "Planlama ve organizasyon", weight: { earth: 3 } }, { id: "c", text: "Fikir üretme ve iletişim", weight: { air: 3 } }, { id: "d", text: "Empati ve yaratıcılık", weight: { water: 3 } }] },
    { id: "q6", text: "Meslekte en çok ne seni yorar?", options: [{ id: "a", text: "Rutin ve yavaş ilerleme", weight: { fire: 3 } }, { id: "b", text: "Belirsizlik ve değişim", weight: { earth: 3 } }, { id: "c", text: "Tekrar ve sıkıcılık", weight: { air: 3 } }, { id: "d", text: "Duygusuzluk ve rekabet", weight: { water: 3 } }] },
    { id: "q7", text: "Meslek değiştirme konusunda?", options: [{ id: "a", text: "Açığım, yeni fırsatlar ararım", weight: { fire: 3 } }, { id: "b", text: "Temkinli, güvenli geçiş", weight: { earth: 3 } }, { id: "c", text: "Meraklı, denemeye açığım", weight: { air: 3 } }, { id: "d", text: "Anlam varsa değiştirebilirim", weight: { water: 3 } }] },
    { id: "q8", text: "Meslekte en çok ne seni mutlu eder?", options: [{ id: "a", text: "Başarı ve tanınma", weight: { fire: 3 } }, { id: "b", text: "Güvenlik ve düzen", weight: { earth: 3 } }, { id: "c", text: "Yenilik ve öğrenme", weight: { air: 3 } }, { id: "d", text: "İnsanlara yardım ve anlam", weight: { water: 3 } }] },
    { id: "q9", text: "Meslek seçiminde kimin fikri önemli?", options: [{ id: "a", text: "Kendi kararım", weight: { fire: 3 } }, { id: "b", text: "Aile ve güvenilir danışmanlar", weight: { earth: 3 } }, { id: "c", text: "Çeşitli kaynaklar ve araştırma", weight: { air: 3 } }, { id: "d", text: "İç sesim ve değerlerim", weight: { water: 3 } }] },
    { id: "q10", text: "İdeal meslekte nasıl birisin?", options: [{ id: "a", text: "Lider ve başarılı", weight: { fire: 3 } }, { id: "b", text: "Uzman ve güvenilir", weight: { earth: 3 } }, { id: "c", text: "Yenilikçi ve öğretici", weight: { air: 3 } }, { id: "d", text: "Anlamlı ve destekleyici", weight: { water: 3 } }] },
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
