export type Element = "fire" | "earth" | "air" | "water";

export type ZodiacSign =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

export interface GenderContent {
  general: string;
  strengths: string[];
  weaknesses: string[];
  love: string;
  career: string;
}

export interface ZodiacInfo {
  id: ZodiacSign;
  name: string;
  nameTr: string;
  symbol: string;
  element: Element;
  dates: string;
  image: string;
  rulingPlanet: string;
  modality: "Öncü" | "Sabit" | "Değişken";
  generalOverview: string;

  dateRange: {
    start: { month: number; day: number };
    end: { month: number; day: number };
  };

  // ✅ Yeni alanlar
  male: GenderContent;
  female: GenderContent;
}


export const ZODIAC_SIGNS: ZodiacInfo[] = [
{
  id: "aries",
  name: "Aries",
  nameTr: "Koç",
  symbol: "♈",
  element: "fire",
  image: "/zodiac/aries.png",
  dates: "21 Mart - 19 Nisan",
  rulingPlanet: "Mars",
  modality: "Öncü",
  generalOverview:
    "Koç burcu, zodyakın ilk burcu olarak ateş elementine ait ve \"öncü\" nitelikte bir burçtur. Yönetici gezegeni Mars'ın etkisiyle hareket, cesaret, rekabet ve atılganlık en belirgin özellikleridir. İlkbahar ekinoksuyla başlayan bu dönemde doğanlar, hayata \"ilk adımı atan\" enerjiyi taşır; beklemekten ve geride kalmaktan rahatsız olurlar.\n\n" +
    "Doğal liderlik eğilimi, hızlı karar alma ve risk almaktan çekinmeme Koç'u hem iş hem ilişkilerde öne çıkarır. Zodyakın en dinamik ve enerjik burçlarından biri olarak görülür. Dürüst, doğrudan ve net bir iletişim tarzı vardır; dolaylı konuşmalardan ve belirsizlikten hoşlanmaz. Rekabet onları motive eder; zorluklar karşısında pes etmek yerine daha da hırslanırlar.\n\n" +
    "Zayıf noktaları sabırsızlık, aceleci kararlar ve öfke yönetimidir. Uzun vadeli detaylardan çok anlık sonuçlara odaklanabilirler. Buna rağmen cesaretleri, girişimcilik ruhları ve \"yapabilirim\" inancıyla birçok alanda öncü rol üstlenirler.",

  dateRange: {
    start: { month: 3, day: 21 },
    end: { month: 4, day: 19 }
  },

  male: {
    general:
      "Koç burcu erkeği cesur, atılgan ve lider ruhlu bir karaktere sahiptir. Hayatında durağanlığa yer yoktur; sürekli hareket, yeni hedefler ve rekabet onu ayakta tutar. Risk almaktan çekinmez, zorluklar karşısında geri adım atmak yerine mücadeleyi seçer.\n\n" +
      "Sosyal ortamlarda öne çıkar, fikrini net söyler ve kararlarını hızlı verir. Ailesine ve sevdiklerine karşı koruyucu ve sahiplenicidir; ancak kendi alanına müdahale edilmesinden hoşlanmaz. Enerjisi yüksektir; spor, macera ve aksiyon gerektiren aktivitelerden keyif alır.\n\n" +
      "Duygusal olarak doğrudan ve tutkuludur. Oyun oynamaktan çok net ve açık ilişkileri tercih eder; ancak ilgi görmediğini hissettiğinde sabırsızlanabilir.",
    strengths: [
      "Cesaret ve risk alma",
      "Doğal liderlik yeteneği",
      "Kararlılık ve azim",
      "Yüksek enerji ve hareketlilik",
      "Dürüst ve doğrudan iletişim",
      "Girişimcilik ruhu",
      "Rekabetçi motivasyon"
    ],
    weaknesses: [
      "Sabırsızlık",
      "Öfke kontrolünde zorlanma",
      "Aceleci kararlar",
      "Dominant ve baskıcı tavır",
      "Detaylara yeterince odaklanamama"
    ],
    love:
      "Aşkta tutkulu ve sahiplenicidir. İlişkide heyecan, dinamizm ve karşılıklı saygı ister. İlgi görmek ve takdir edilmek onun için önemlidir; monoton ve sönük ilişkilerden çabuk sıkılır.\n\n" +
      "Flört döneminde atak ve romantik olabilir; uzun vadede ise güven ve sadakat bekler. Partnerinin de kendine güvenen, bağımsız ve heyecanlı biri olmasını ister. Kıskançlık gösterebilir ancak kısıtlayıcı davranışlardan rahatsız olur.",
    career:
      "Girişimcilik, spor, yönetim, satış ve rekabet gerektiren sektörlerde kendini rahat hisseder. Karar verme ve risk alma gerektiren alanlarda öne çıkar; uzun süre tek başına detay işi yapmak onu yorar.\n\n" +
      "Liderlik pozisyonları, proje yönetimi, pazarlama ve sahne gerektiren işler (sunuculuk, eğitmenlik) Koç erkeğine uygundur. Startup kurucusu, antrenör veya askeri/polislik gibi disiplinli ama aksiyon dolu alanlarda da başarılı olabilir."
  },

  female: {
    general:
      "Koç burcu kadını güçlü, bağımsız ve özgüvenlidir. Kendi kararlarını kendi verir; başkalarının yönlendirmesinden ve \"kadına göre\" kalıplarından rahatsız olur. Enerjisi ve karizmasıyla bulunduğu ortamda hemen fark edilir.\n\n" +
      "Erkek meslektaşlarıyla eşit rekabet etmekten çekinmez; haksızlığa tahammülü yoktur. Ailesine ve çocuklarına düşkün olsa da kariyerinden vazgeçmek istemez; her iki alanı da yönetmeye çalışır. Duygusal olarak doğrudan ve açık sözlüdür; oyun ve belirsizlikten hoşlanmaz.\n\n" +
      "Moda ve görünüm konusunda cesur tercihler yapabilir; trendleri takip etmekten çok kendi tarzını yaratmayı sever.",
    strengths: [
      "Özgüven ve karizma",
      "Girişimcilik ve liderlik ruhu",
      "Bağımsızlık ve öz yeterlilik",
      "Dürüstlük ve doğrudanlık",
      "Enerji ve azim",
      "Kriz anında soğukkanlılık"
    ],
    weaknesses: [
      "İnatçılık",
      "Sabırsızlık",
      "Aşırı rekabetçilik",
      "Bazen duygusal hassasiyeti göz ardı etme"
    ],
    love:
      "Aşkta heyecan ve tutku arar. Güçlü, kendine güvenen ve kendini geliştiren partnerlerden hoşlanır. Monoton ilişkilerden çabuk sıkılır; birlikte yeni deneyimler ve ortak hedefler ister.\n\n" +
      "İlişkide eşitlik önemlidir; \"koruma altına alınmak\" yerine \"yan yana yürümek\" ister. Kıskançlık gösterebilir ama kısıtlanmaktan da rahatsız olur. Evlilik ve uzun vadeli birliktelikte kararlı olabilir; ancak saygı ve heyecan kaybolursa uzaklaşabilir.",
    career:
      "Yönetim, satış, spor, girişimcilik ve liderlik gerektiren pozisyonlarda başarılı olur. Hedef odaklıdır ve vazgeçmez; erkek egemen alanlarda bile kendine yer açar.\n\n" +
      "Pazarlama, insan kaynakları (dönüşüm tarafı), etkinlik yönetimi ve sahne gerektiren işler (eğitmen, sunucu) ona uygundur. Kendi işini kurmak isteyen Koç kadını, disiplinli bir planla uzun vadede başarılı olabilir."
  }
}

,
{
  id: "taurus",
  name: "Taurus",
  nameTr: "Boğa",
  symbol: "♉",
  element: "earth",
  image: "/zodiac/taurus.png",
  dates: "20 Nisan - 20 Mayıs",
  rulingPlanet: "Venüs",
  modality: "Sabit",
  generalOverview:
    "Boğa burcu toprak elementine ait ve \"sabit\" nitelikte bir burçtur. Yönetici gezegeni Venüs'ün etkisiyle estetik, konfor, maddi güvenlik ve duyusal zevkler ön plandadır. İlkbaharın tam ortasında doğan Boğa'lar, doğanın bolluğu ve istikrarıyla özdeşleşir.\n\n" +
    "Kararlı, sabırlı ve ayakları yere basan bir yapıları vardır. Ani değişimlerden ve belirsizlikten hoşlanmazlar; planlı, adım adım ilerlemeyi ve uzun vadeli hedeflere yatırım yapmayı tercih ederler. Güvenilir, sözünün eri ve sadık insanlardır; ancak bir kez inatlaştıklarında onları ikna etmek zor olabilir.\n\n" +
    "Estetik zevkleri gelişmiştir; yemek, müzik, sanat ve doğa onlar için önemli yaşam alanlarıdır. Maddi güvenlik hissi olmadan kendilerini rahat hissedemezler; bu yüzden tasarruf ve yatırım konusunda bilinçli davranırlar.",

  dateRange: { start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },

 male: {
  general:
    "Boğa burcu erkeği sakin, güvenilir ve ayakları yere basan bir karakter taşır. Hayatında istikrar ve maddi güvenlik ön plandadır; ani kariyer veya ilişki değişimlerinden kaçınır. Planlı ilerlemeyi, birikim yapmayı ve uzun vadeli ilişkiler kurmayı sever.\n\n" +
    "Duygusal olarak derin ama yavaş açılır. Güvenmeden önce karşı tarafı sınar; bir kez bağlandığında ise son derece sadık ve koruyucu olur. Ailesine ve evine düşkündür; konforlu bir yaşam kurmak onun için önemlidir.\n\n" +
    "İnatçılığı hem güçlü yönü hem zayıf yönüdür: hedeflerinde vazgeçmez ama değişime kapalı olabilir.",
  strengths: [
    "Sadakat ve güvenilirlik",
    "Sabır ve kararlılık",
    "Maddi istikrar ve planlama",
    "Duygusal derinlik",
    "Estetik ve konfor anlayışı",
    "Sözünün eri olma"
  ],
  weaknesses: [
    "İnatçılık",
    "Değişime direnç",
    "Aşırı sahiplenme ve kıskançlık",
    "Bazen aşırı rahata düşkünlük"
  ],
  love:
    "Aşkta güven ve bağlılık arar. Kolay kolay açılmaz; flört döneminde temkinli davranır. Bağlandığında ise uzun vadeli düşünür, evlilik ve ortak bir yaşam kurmak ister.\n\n" +
    "Romantik jestlere, fiziksel temas ve kaliteli zaman geçirmeye değer verir. Sadakatsizliğe tahammülü yoktur; kendi de sadık kalmayı önemser. İlişkide kavga etmektense sakin konuşmayı tercih eder.",
  career:
    "Finans, bankacılık, gayrimenkul, tarım ve estetik alanlarda (mimarlık, iç mimari, gastronomi) başarılı olabilir. Disiplinli yapısı ve uzun vadeli düşünmesi sayesinde birikim yapar ve kariyerinde istikrarlı ilerler.\n\n" +
    "Riskli yatırımlardan ve ani kariyer değişimlerinden kaçınır. Kendi işini kurduğunda da adım adım büyümeyi tercih eder."
},
female: {
  general:
    "Boğa burcu kadını zarif, sabırlı ve güçlü bir karaktere sahiptir. Hayatında konfor, huzur ve güzel çevre önemlidir; estetik zevkleri gelişmiştir. Kararlı yapısıyla hedeflerine adım adım ilerler; aceleci kararlar vermez.\n\n" +
    "Duygusal olarak derin ve bağlıdır. Güvenmeden önce zaman ister; bir kez sevdiğinde ise son derece sadık ve koruyucu olur. Aile ve ev kavramı onun için kutsaldır; evini güzelleştirmekten ve misafir ağırlamaktan keyif alır.\n\n" +
    "Maddi bağımsızlığa önem verir; kendi parasını kazanmak ve birikim yapmak onu güvende hissettirir.",
  strengths: [
    "Duygusal denge ve olgunluk",
    "Sadakat ve güvenilirlik",
    "Estetik zevk ve zarafet",
    "Sabır ve kararlılık",
    "Pratik zeka",
    "Ev ve aile odaklılık"
  ],
  weaknesses: [
    "İnatçılık",
    "Aşırı kıskançlık",
    "Rahatına düşkünlük",
    "Değişime kapalı olma"
  ],
  love:
    "Romantik ve bağlıdır. İlişkide güven, sadakat ve fiziksel temas (sarılmak, dokunmak) onun için vazgeçilmezdir. Evlilik ve uzun vadeli birliktelik ister; flörtü ciddiye taşımak ister.\n\n" +
    "Partnerinin güvenilir, sakin ve kendine zaman ayıran biri olmasını bekler. İhanet ve belirsizlik ilişkisini bitirir. Evini ve ailesini korumak için mücadele eder.",
  career:
    "Sanat, tasarım, finans, gastronomi ve işletme alanlarında başarılı olabilir. Estetik anlayışı sayesinde moda, iç mimari veya marka yönetiminde öne çıkar.\n\n" +
    "Düzenli maaş ve sosyal güvence onu rahat hissettirir; riskli girişimlere tek başına atılmak yerine güvenilir ortaklıklar kurmayı tercih edebilir."
}

},
{
  id: "gemini",
  name: "Gemini",
  nameTr: "İkizler",
  symbol: "♊",
  element: "air",
  image: "/zodiac/gemini.png",
  dates: "21 Mayıs - 20 Haziran",
  rulingPlanet: "Merkür",
  modality: "Değişken",
  generalOverview:
    "İkizler burcu hava elementine ait ve \"değişken\" nitelikte bir burçtur. Yönetici gezegeni Merkür'ün etkisiyle iletişim, zihinsel hareketlilik, merak ve çok yönlülük ön plandadır. İlk yazın başlangıcında doğan İkizler, hayatı çeşitlilik ve bilgiyle dolu yaşamak ister.\n\n" +
    "Meraklı, konuşkan ve adaptasyon yeteneği yüksek bir karakter sergiler. Aynı anda birden fazla konuya ilgi duyabilir; sıkılmak onlar için en büyük düşmandır. Sosyal, esprili ve hızlı düşünen yapılarıyla çevrelerinde aranan insanlardır.\n\n" +
    "Zayıf noktaları kararsızlık, dikkat dağınıklığı ve bazen yüzeysel kalabilmeleridir. Derinleşmek yerine yeni konulara atlayabilirler; ancak doğru motivasyonla iletişim, medya ve öğrenme alanlarında çok başarılı olurlar.",

  dateRange: { start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
male: {
  general:
    "İkizler burcu erkeği zeki, konuşkan ve sosyal bir karakterdir. Meraklı yapısı sayesinde sürekli yeni bilgiler edinmek, yeni insanlarla tanışmak ve farklı konularda sohbet etmek ister. Monoton işlerden ve tekrarlayan günlerden çabuk sıkılır.\n\n" +
    "Espri anlayışı gelişmiştir; bulunduğu ortamı neşelendirir. İlişkilerde zihinsel uyum arar; partneriyle saatlerce konuşabilmek onun için değerlidir. Duygusal olarak bazen kararsız kalabilir; \"tek kişi\"ye bağlanmak zaman alabilir.\n\n" +
    "Pratik ve hızlı düşünür; kriz anlarında çözüm üretmekte iyidir. Ancak uzun vadeli detay işlerde odak kaybı yaşayabilir.",
  strengths: [
    "İletişim gücü ve ikna yeteneği",
    "Zeka ve hızlı öğrenme",
    "Uyum sağlama ve esneklik",
    "Çok yönlülük",
    "Sosyal zeka",
    "Espri ve neşe"
  ],
  weaknesses: [
    "Kararsızlık",
    "Dağınıklık ve dikkat dağınıklığı",
    "Bazen yüzeysellik",
    "Sadakatsizlik riski (sıkıldığında)"
  ],
  love:
    "Zihinsel uyum ve sohbet arar. Monoton ilişkilerden çabuk sıkılır; partnerinin de meraklı, eğlenceli ve kendini geliştiren biri olmasını ister. Flört döneminde çekici ve ilgi çekicidir; ancak ciddi bağ kurmak zaman alabilir.\n\n" +
    "Sadakatsizlik eğilimi abartılsa da aslında sıkıldığında uzaklaşabilir. Uzun vadeli ilişkide ortak hobiler, seyahat ve sohbet ilişkiyi canlı tutar.",
  career:
    "Medya, yazarlık, gazetecilik, satış, pazarlama ve iletişim alanında başarılıdır. Podcast, içerik üretimi, sosyal medya ve eğitim (eğitmen, danışman) ona uygun alanlardır.\n\n" +
    "Tekrarlayan ofis işleri ve uzun süre tek başına çalışma onu yorar. Takım çalışması, müşteri ilişkileri ve sürekli yeni bilgi gerektiren işlerde parlar."
},
female: {
  general:
    "İkizler burcu kadını enerjik, meraklı ve sosyal bir karaktere sahiptir. Sosyal çevresi geniştir; farklı alanlara ilgi duyar ve birçok konuda bilgi sahibidir. Sıkılmaktan hoşlanmaz; hayatında hareket ve çeşitlilik ister.\n\n" +
    "Zeki ve esprili yapısıyla bulunduğu ortamda dikkat çeker. İlişkide zihinsel uyum ve sohbet onun için vazgeçilmezdir; partnerinin sıkıcı ve tek düze olmasına tahammül edemez. Kariyer ve özel hayat dengesini kurmak ister; tek bir role sıkışıp kalmak istemez.\n\n" +
    "Duygusal olarak bazen kararsız kalabilir; ancak bir kez gerçekten bağlandığında sadık ve eğlenceli bir eş olur.",
  strengths: [
    "Hızlı öğrenme ve çok yönlülük",
    "Sosyal zeka ve iletişim",
    "Esneklik ve uyum",
    "Enerji ve merak",
    "Espri anlayışı"
  ],
  weaknesses: [
    "Kararsızlık",
    "Dikkat dağınıklığı",
    "Bazen sadakatsizlik veya sıkılma"
  ],
  love:
    "Eğlenceli, sohbeti güçlü ve zihinsel olarak uyumlu partnerlerden hoşlanır. Monoton ilişkilerden çabuk sıkılır; birlikte yeni yerler görmek, yeni konular konuşmak ister.\n\n" +
    "Flört döneminde çekici ve hareketlidir. Uzun vadede güven ve sadakat önemlidir; ancak ilişkinin \"sıkıcı\" hale gelmesinden korkar. Ortak projeler ve sohbet ilişkiyi canlı tutar.",
  career:
    "Reklam, medya, pazarlama, eğitim ve içerik üretimi alanlarında parlayabilir. Yazarlık, sunuculuk, sosyal medya yönetimi ve danışmanlık ona uygun mesleklerdir.\n\n" +
    "Tek düze ofis işleri onu yorar; esnek çalışma ve proje bazlı işler daha iyi gelir."
}

},
{
  id: "cancer",
  name: "Cancer",
  nameTr: "Yengeç",
  symbol: "♋",
  element: "water",
  image: "/zodiac/cancer.png",
  dates: "21 Haziran - 22 Temmuz",
  rulingPlanet: "Ay",
  modality: "Öncü",
  generalOverview:
    "Yengeç burcu su elementine ait ve \"öncü\" nitelikte bir burçtur. Yönetici gezegeni Ay'ın etkisiyle duygular, aile, güvenlik ve içsel dünya ön plandadır. Yaz gündönümü civarında doğan Yengeç'ler, sıcak ama korunaklı bir enerji taşır.\n\n" +
    "Koruyucu, sezgisel ve hassas bir yapıya sahiptir. Aile ve \"yuva\" kavramı onlar için kutsaldır; sevdiklerini korumak ve onlara bakmak isterler. Duygusal olarak derinler; bazen alıngan ve geçmişe takılı kalabilirler, ancak empati ve şefkatleri güçlüdür.\n\n" +
    "Dışarıya karşı sert bir kabuk gösterebilirler; güvenmeden içlerini açmazlar. Bir kez güvendiklerinde ise son derece sadık ve bağlıdırlar. Sanat, psikoloji ve insan odaklı mesleklerde başarılı olurlar.",

  dateRange: { start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },

 male: {
  general:
    "Yengeç burcu erkeği duygusal, sezgisel ve koruyucu bir karaktere sahiptir. Ailesine ve sevdiklerine karşı güçlü bir bağlılık hisseder; onları korumak ve güvende hissettirmek ister. Dışarıya karşı sert ve mesafeli görünebilir; güvenmeden duygularını açmaz.\n\n" +
    "Ev ve aile kavramı onun için önemlidir; rahat bir yuva kurmak ister. İş hayatında da \"aile gibi\" bir ortam arayabilir; soğuk ve rekabetçi işyerlerinden rahatsız olur. Geçmişe takılma eğilimi vardır; eski anılar ve ilişkiler onu etkileyebilir.\n\n" +
    "Romantik ve sadık bir eş olabilir; ancak alınganlık ve kıskançlık ilişkide sorun çıkarabilir.",
  strengths: [
    "Empati ve şefkat",
    "Sadakat ve bağlılık",
    "Koruyuculuk",
    "Sezgi",
    "Aile odaklılık",
    "Duygusal derinlik"
  ],
  weaknesses: [
    "Alınganlık",
    "Geçmişe takılma",
    "Aşırı korumacılık",
    "Mood değişimleri"
  ],
  love:
    "Derin bağ kurmak ister. Güven olmadan ilişkiye başlamaz; bir kez sevdiğinde ise son derece sadık ve evine düşkün olur. Romantik jestlere ve duygusal paylaşıma değer verir.\n\n" +
    "Partnerinin de aileye ve uzun vadeli birlikteliğe önem vermesini bekler. İhanet ve soğukluk onu derinden yaralar. Evlilik ve çocuk onun için doğal bir hedeftir.",
  career:
    "Aile işletmeleri, hizmet sektörü, psikoloji, eğitim ve insan kaynakları alanında başarılıdır. Güven veren ve \"insana dokunan\" işler onu tatmin eder.\n\n" +
    "Aşırı rekabetçi ve soğuk ortamlar onu yorar. Mutfak, turizm ve bakım sektörü de Yengeç erkeğine uygun alanlardır."
},
female: {
  general:
    "Yengeç burcu kadını şefkatli, sezgisel ve duygusal derinliği olan bir karaktere sahiptir. İç dünyası zengindir; sanat, müzik ve doğa onu besler. Aile ve ev onun için merkezdedir; yuva kurmak ve sevdiklerine bakmak ister.\n\n" +
    "Dışarıya karşı bazen çekingen görünebilir; ancak güvendiği insanlara karşı son derece sıcak ve koruyucudur. Annelik içgüdüsü güçlüdür; çocuklara ve ihtiyacı olanlara karşı şefkatlidir. Geçmişe ve anılara bağlıdır; eski eşyaları saklamak, anı defteri tutmak onun tarzına uyabilir.\n\n" +
    "Duygusal dalgalanmalar yaşayabilir; partnerinin ve çevresinin bunu anlaması ilişkiyi kolaylaştırır.",
  strengths: [
    "Şefkat ve empati",
    "Sezgi",
    "Sadakat",
    "Koruyuculuk",
    "Yaratıcılık",
    "Aile ve ev odaklılık"
  ],
  weaknesses: [
    "Duygusal hassasiyet",
    "Kıskançlık",
    "Alınganlık",
    "Geçmişe takılma"
  ],
  love:
    "Güven ve sadakat onun için vazgeçilmezdir. Romantik ve bağlı bir ilişki ister; flörtü ciddiye taşımak ister. Partnerinin duygusal olarak erişilebilir ve evine düşkün olmasını bekler.\n\n" +
    "İhanet ve soğukluk onu derinden yaralar. Evlilik ve çocuk çoğu Yengeç kadını için doğal bir hedeftir. Fiziksel temas ve \"ev gibi\" hissettiren anlar ilişkiyi güçlendirir.",
  career:
    "Psikoloji, eğitim, hemşirelik, sosyal hizmet ve sanat alanında başarılı olabilir. İnsana dokunan, anlamlı işler onu tatmin eder.\n\n" +
    "Evden çalışma veya esnek saatler bazı Yengeç kadınları için idealdir. Gastronomi, dekorasyon ve çocuk gelişimi de uygun alanlardır."
}

},
{
  id: "leo",
  name: "Leo",
  nameTr: "Aslan",
  symbol: "♌",
  element: "fire",
  image: "/zodiac/leo.png",
  dates: "23 Temmuz - 22 Ağustos",
  rulingPlanet: "Güneş",
  modality: "Sabit",
  generalOverview:
    "Aslan burcu ateş elementine ait ve \"sabit\" nitelikte bir burçtur. Yönetici gezegeni Güneş'in etkisiyle özgüven, liderlik, görünürlük ve yaratıcılık temaları güçlüdür. Yazın ortasında doğan Aslan'lar, hayatın sahnesinde olmayı ve takdir görmeyi sever.\n\n" +
    "Karizmatik, cömert ve sahne ışığını seven bir karakter taşır. Arka planda kalmaktan hoşlanmaz; liderlik pozisyonları ve \"görünen\" işler onlara uygundur. Gururlu ve onurludur; küçük düşürülmeye tahammül edemez. Cömerttir; sevdiklerine zaman ve para konusunda eli açıktır.\n\n" +
    "Zayıf noktaları ego, inatçılık ve bazen aşırı dramatik olmaktır. Eleştiriye kapalı olabilirler; ancak doğru motivasyonla yönetim, sanat ve topluluk önünde çalışan rollerde parlar.",

  dateRange: { start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },

male: {
  general:
    "Aslan burcu erkeği karizmatik, özgüvenli ve lider ruhlu bir karaktere sahiptir. İlgi odağı olmaktan hoşlanır; bulunduğu ortamda fark edilmek ister. Cömerttir; sevdiklerine hediye almak ve onları ağırlamak onu mutlu eder.\n\n" +
    "İş hayatında liderlik pozisyonlarında kendini rahat hisseder. Eleştiriye kapalı olabilir; \"saygı\" onun için önemlidir. Aşkta tutkulu ve sahiplenicidir; partnerinin kendisine hayran olmasını ve ilgi göstermesini ister.\n\n" +
    "Gururu incindiğinde soğuk ve mesafeli davranabilir. Uzun vadede sadık bir eş ve baba olabilir; ancak evde de \"kral\" gibi hissetmek ister.",
  strengths: [
    "Karizma ve özgüven",
    "Liderlik",
    "Cömertlik",
    "Yaratıcılık",
    "Sadakat (güvendiğinde)",
    "Koruyuculuk"
  ],
  weaknesses: [
    "Ego",
    "Gurur",
    "Eleştiriye kapalılık",
    "Bazen dominant tavır"
  ],
  love:
    "İlişkide ilgi görmek ve takdir edilmek ister. Tutkulu ve sahiplenicidir; partnerini \"kraliçe\" gibi ağırlamak isteyebilir. Romantik jestlere ve görünür sevgi gösterilerine değer verir.\n\n" +
    "Sadakatsizlik ve saygısızlık onun için kabul edilemez. Uzun vadede evlilik ve aile kurmak ister; çocuklarına gurur duyar ve onları destekler.",
  career:
    "Yönetim, CEO, satış direktörlüğü, sanat (oyuncu, yönetmen), reklam ve organizasyon alanında başarılıdır. Sahne gerektiren işler (sunuculuk, eğitmenlik) ona uygundur.\n\n" +
    "Arka planda kalan ve takdir görmeyen işler onu tatmin etmez. Kendi işini kurduğunda da markasını öne çıkarmayı sever."
},
female: {
  general:
    "Aslan burcu kadını güçlü, dikkat çekici ve özgüvenlidir. Kendine güveni yüksektir; moda ve görünüm konusunda cesur tercihler yapar. Bulunduğu ortamda \"kraliçe\" gibi hissetmek ister.\n\n" +
    "Cömert ve sıcakkanlıdır; arkadaşlarına ve ailesine düşkündür. İş hayatında da öne çıkmak ister; yeteneklerinin takdir edilmesini bekler. Duygusal olarak tutkulu ve romantiktir; ancak partnerinin kendisine ilgi göstermesini ve saygı duymasını ister.\n\n" +
    "Gururu incindiğinde soğuklaşabilir. Uzun vadede sadık ve koruyucu bir eş ve anne olabilir.",
  strengths: [
    "Özgüven ve karizma",
    "Cömertlik",
    "Yaratıcılık",
    "Liderlik",
    "Sadakat",
    "Sıcakkanlılık"
  ],
  weaknesses: [
    "Gurur",
    "Dominant tavır",
    "Eleştiriye kapalılık"
  ],
  love:
    "Romantik ve dramatiktir. İlgi ve takdir ister; partnerinin kendisini \"özel\" hissettirmesini bekler. Tutkulu ve sadık bir eş olabilir; ancak ihmal edildiğini hissettiğinde uzaklaşabilir.\n\n" +
    "Evlilik ve aile onun için önemlidir; çocuklarına düşkündür. Partnerinin de kendisine saygı göstermesi ve ilişkiyi \"sahneye\" taşımaktan çekinmemesi gerekir.",
  career:
    "Yönetim, marka yönetimi, sahne sanatları (oyuncu, sunucu), reklam ve etkinlik organizasyonu alanında öne çıkar. Liderlik ve görünürlük gerektiren işler ona uygundur.\n\n" +
    "Moda, lüks satış ve insan kaynakları (kurumsal eğitim) da Aslan kadınının parlayabileceği alanlardır. Arka planda kalmak onu tatmin etmez."
}

},
{
  id: "virgo",
  name: "Virgo",
  nameTr: "Başak",
  symbol: "♍",
  element: "earth",
  image: "/zodiac/virgo.png",
  dates: "23 Ağustos - 22 Eylül",
  rulingPlanet: "Merkür",
  modality: "Değişken",
  generalOverview:
    "Başak burcu toprak elementine ait ve \"değişken\" nitelikte bir burçtur. Yönetici gezegeni Merkür'ün etkisiyle analitik düşünme, detaycılık ve hizmet verme ön plandadır. Yaz sonunda doğan Başak'lar, düzen, verimlilik ve mükemmellik arayışıyla tanınır.\n\n" +
    "Disiplinli, titiz ve planlı bir yapıya sahiptir. Kaotik ortamlardan rahatsız olur; her şeyin yerli yerinde olmasını ister. Eleştirel zekaları güçlüdür; hem kendilerini hem çevrelerini iyileştirmeye çalışırlar. Bazen aşırı mükemmeliyetçi ve eleştirel olabilirler; ancak güvenilir, çalışkan ve sorumluluk sahibi insanlardır.\n\n" +
    "Sağlık, eğitim, analiz ve hizmet sektöründe doğal yetenekleri vardır. Duygusal olarak temkinli açılırlar; ancak bir kez güvendiklerinde sadık kalırlar.",

  dateRange: { start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },

 male: {
  general:
    "Başak burcu erkeği analitik, detaycı ve düzenli bir karaktere sahiptir. Düzenli ve planlı bir yaşam ister; dağınıklık ve belirsizlik onu rahatsız eder. İşinde ve ilişkilerinde \"doğru\" olanı yapmaya çalışır; yarım iş bırakmaktan hoşlanmaz.\n\n" +
    "Duygusal olarak temkinlidir; kolay kolay açılmaz. Güven kazanmak zaman alır; ancak bir kez bağlandığında sadık ve güvenilir bir eş olur. Eleştirel yanı güçlüdür; bazen partnerini veya kendini fazla eleştirebilir. Pratik ve yardımseverdir; sevdiklerinin sorunlarını çözmek için uğraşır.\n\n" +
    "Sağlık, verimlilik ve düzen konularına ilgi duyar.",
  strengths: [
    "Disiplin ve düzen",
    "Analitik zeka",
    "Titizlik ve detaycılık",
    "Güvenilirlik",
    "Hizmet verme isteği",
    "Pratik zeka"
  ],
  weaknesses: [
    "Aşırı eleştirel olma",
    "Mükemmeliyetçilik",
    "Endişe ve takıntı",
    "Duygusal soğukluk (dışarıdan)"
  ],
  love:
    "Sadık ama temkinlidir. Güven kazanmak ister; flört döneminde test eder gibi davranabilir. Bir kez sevdiğinde pratik jestlerle (yardım etmek, düzenlemek) sevgisini gösterir.\n\n" +
    "Partnerinin de düzenli, güvenilir ve kendini geliştiren biri olmasını ister. Sadakatsizlik ve dağınıklık onu uzaklaştırır. Evlilikte sorumluluk alır ve evi çekip çevirir.",
  career:
    "Mühendislik, yazılım, veri analizi, sağlık (doktor, eczacı, laborant), muhasebe ve kalite kontrol alanlarında başarılıdır. Detay ve düzen gerektiren işler ona uygundur.\n\n" +
    "Proje yönetimi, editörlük ve araştırma da Başak erkeğinin rahat edeceği alanlardır. Kaotik ve belirsiz ortamlar onu yorar."
},
female: {
  general:
    "Başak burcu kadını titiz, zeki ve pratik bir karaktere sahiptir. Detaylara dikkat eder; evi ve işi düzenli tutmak ister. Mükemmeliyetçidir; kendini ve çevresini sürekli iyileştirmeye çalışır.\n\n" +
    "Duygusal olarak kolay açılmaz; güvenmeden önce gözlemler. Bir kez sevdiğinde ise sadık ve yardımseverdir. Sağlık, beslenme ve düzen konularına ilgi duyar; çevresindekilere de bu konularda tavsiyeler verir.\n\n" +
    "Eleştirel yanı bazen ilişkide sorun çıkarabilir; partnerinin \"yeterince iyi\" olmadığını düşünebilir. Farkındalık geliştirdiğinde ise dengeli ve güvenilir bir eş olur.",
  strengths: [
    "Organizasyon ve düzen",
    "Zeka ve analitik düşünme",
    "Pratiklik",
    "Sadakat",
    "Hizmet verme",
    "Detaycılık"
  ],
  weaknesses: [
    "Mükemmeliyetçilik",
    "Aşırı eleştirellik",
    "Endişe",
    "Kendine yüksek standart koyma"
  ],
  love:
    "Duygularını kolay açmaz ama bağlandığında sadıktır. Pratik sevgi gösterilerini (yardım, düzen, ilgi) tercih eder. Partnerinin de güvenilir ve düzenli olmasını ister.\n\n" +
    "Flörtü ciddiye taşımak ister; oyun oynamaktan hoşlanmaz. Evlilikte evi çekip çevirir; çocukların eğitimi ve sağlığı konusunda titizdir.",
  career:
    "Sağlık (hemşire, diyetisyen, eczacı), eğitim, editörlük, muhasebe ve veri analizi alanında başarılıdır. Düzen ve detay gerektiren işler ona uygundur.\n\n" +
    "İnsan kaynakları (prosedür ve düzen), kütüphane ve arşiv çalışanı da Başak kadınının rahat edeceği mesleklerdendir."
}

},
{
  id: "libra",
  name: "Libra",
  nameTr: "Terazi",
  symbol: "♎",
  element: "air",
  image: "/zodiac/libra.png",
  dates: "23 Eylül - 22 Ekim",
  rulingPlanet: "Venüs",
  modality: "Öncü",
  generalOverview:
    "Terazi burcu hava elementine ait ve \"öncü\" nitelikte bir burçtur. Yönetici gezegeni Venüs'ün etkisiyle estetik, uyum, adalet ve ilişki temaları baskındır. Sonbahar ekinoksu civarında doğan Terazi'ler, denge ve güzellik arayışıyla tanınır.\n\n" +
    "Diplomatik, nazik ve sosyal zekası yüksek bir karakter taşır. Çatışmadan kaçınır; herkesle iyi geçinmeye çalışır. Karar vermekte zorlanabilir; \"en doğru\" seçeneği bulmak ister. Estetik zevkleri gelişmiştir; sanat, müzik ve güzel ortamlar onları besler.\n\n" +
    "İlişkide denge ve eşitlik ararlar; yalnız kalmaktan hoşlanmazlar. Hukuk, sanat, tasarım ve insan ilişkileri gerektiren mesleklerde başarılı olurlar.",

  dateRange: { start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },

male: {
  general:
    "Terazi burcu erkeği diplomatik, sosyal ve estetik anlayışı gelişmiş bir karaktere sahiptir. Çatışmadan kaçınır; nazik ve saygılı davranır. İlişkide romantik ve düşüncelidir; partnerini mutlu etmek ister.\n\n" +
    "Karar vermekte zorlanabilir; önemli seçimlerde başkalarının fikrini alır. Adalet duygusu güçlüdür; haksızlığa tahammül edemez. İş hayatında da uyumlu bir ortam ister; agresif rekabetten rahatsız olur.\n\n" +
    "Ev ve ilişki onun için önemlidir; yalnız kalmaktan hoşlanmaz. Uzun vadede sadık ve dengeli bir eş olabilir.",
  strengths: [
    "Adalet ve denge",
    "Uyum ve diplomatiklik",
    "Sosyal zeka",
    "Romantiklik",
    "Estetik anlayış",
    "Nezaket"
  ],
  weaknesses: [
    "Kararsızlık",
    "Çatışmadan kaçınma",
    "Bazen başkalarının onayına fazla bağımlılık"
  ],
  love:
    "Romantik ve naziktir. İlişkide uyum, denge ve güzel anlar ister. Partnerini mutlu etmek için çaba harcar; hediye ve jestlere değer verir.\n\n" +
    "Karar vermekte (evlilik, taşınma vb.) zaman alabilir. Sadakatsizlik ve kabalık onu uzaklaştırır. Uzun vadede eşit ve saygılı bir ilişki kurmak ister.",
  career:
    "Hukuk, diplomasi, insan kaynakları, sanat, tasarım ve marka yönetimi alanında başarılıdır. Müşteri ilişkileri ve arabuluculuk ona uygun roller olabilir.\n\n" +
    "Rekabetçi ve agresif iş ortamları onu yorar. Estetik ve adalet odaklı işler onu tatmin eder."
},
female: {
  general:
    "Terazi burcu kadını zarif, estetik odaklı ve sosyal uyum sağlayan bir karaktere sahiptir. Görünümüne ve çevresine özen gösterir; güzel ve dengeli bir yaşam ister.\n\n" +
    "İlişkide denge ve eşitlik arar. Partnerinin nazik, romantik ve kendisine saygılı olmasını bekler. Karar vermekte zorlanabilir; alışverişten ilişki tercihlerine kadar \"en doğrusunu\" bulmaya çalışır.\n\n" +
    "Çatışmadan kaçınır; ancak haksızlığa boyun eğmez. Uzun vadede sadık ve uyumlu bir eş olur; evi güzelleştirmekten ve misafir ağırlamaktan keyif alır.",
  strengths: [
    "Estetik anlayış",
    "Sosyal uyum",
    "Diplomatiklik",
    "Romantiklik",
    "Nezaket",
    "Denge arayışı"
  ],
  weaknesses: [
    "Kararsızlık",
    "Başkalarının onayına bağımlılık",
    "Çatışmadan kaçınma"
  ],
  love:
    "Uyumlu ve dengeli ilişki ister. Romantik jestlere, güzel ortamlara ve karşılıklı saygıya değer verir. Partnerinin de estetik anlayışı ve nazik olmasını bekler.\n\n" +
    "Evlilik ve uzun vadeli birliktelik onun için doğal bir hedeftir. Sadakatsizlik ve kabalık ilişkiyi bitirir.",
  career:
    "Sanat, tasarım, moda, hukuk, insan kaynakları ve halkla ilişkiler alanında öne çıkar. Estetik ve insan ilişkisi gerektiren işler ona uygundur.\n\n" +
    "İç mimari, galeri yönetimi ve etkinlik planlama da Terazi kadınının parlayabileceği alanlardır."
}

},
{
  id: "scorpio",
  name: "Scorpio",
  nameTr: "Akrep",
  symbol: "♏",
  element: "water",
  image: "/zodiac/scorpio.png",
  dates: "23 Ekim - 21 Kasım",
  rulingPlanet: "Plüton",
  modality: "Sabit",
  generalOverview:
    "Akrep burcu su elementine ait ve \"sabit\" nitelikte bir burçtur. Yönetici gezegeni Plüton'un etkisiyle dönüşüm, derinlik, güç ve sır temaları baskındır. Sonbaharın derinleştiği dönemde doğan Akrep'ler, yüzeysel ilişkilerden ve şeffaf olmayan yapılardan rahatsız olur.\n\n" +
    "Tutkulu, kararlı ve sezgisel bir yapıya sahiptir. Kolay kolay güvenmez; bir kez güvendiğinde ise son derece sadık ve koruyucudur. Kontrol ve \"gerçeği bilmek\" onlar için önemlidir; bu yüzden kıskançlık ve araştırıcılık gösterirler. Zayıf noktaları aşırı kıskançlık, kinci olma ve duygusal manipülasyondur.\n\n" +
    "Finans, araştırma, psikoloji ve strateji gerektiren alanlarda doğal yetenekleri vardır. İlişkide derin ve yoğun bağ kurmak isterler.",

  dateRange: { start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },

male: {
  general:
    "Akrep burcu erkeği tutkulu, gizemli ve kararlı bir karaktere sahiptir. Kolay kolay açılmaz; duygularını kontrol altında tutar. Bir kez sevdiğinde ise yoğun ve sadık bir bağ kurar.\n\n" +
    "Sezgisi güçlüdür; yalanı ve sahteliği hisseder. İş hayatında stratejik düşünür; risk alabilir ama kontrolü elden bırakmak istemez. Kıskançlık gösterebilir; partnerinin sadakati onun için vazgeçilmezdir.\n\n" +
    "Dışarıya karşı soğuk görünebilir; ancak güvendiği insanlara karşı sıcak ve koruyucudur.",
  strengths: [
    "Kararlılık ve azim",
    "Sezgi",
    "Stratejik düşünme",
    "Sadakat (güvendiğinde)",
    "Tutku",
    "Dönüşüm ve yenilenme kapasitesi"
  ],
  weaknesses: [
    "Kıskançlık",
    "Kontrolcü tavır",
    "Kinci olma",
    "Aşırı gizlilik"
  ],
  love:
    "Yoğun ve derin bağ kurar. Yüzeysel flörtten hoşlanmaz; \"gerçek\" sevgi ve sadakat ister. Partnerinin de kendisine tam açılmasını ve sırdaş olmasını bekler.\n\n" +
    "Sadakatsizlik onun için affedilmez; bir kez güven kaybedilince geri gelmesi zor olur. Uzun vadede evlilik ve aile kurmak ister; çocuklarına düşkün ve koruyucudur.",
  career:
    "Finans, yatırım, araştırma, psikoloji, kriz yönetimi ve siber güvenlik alanında başarılıdır. Strateji ve \"derinlemesine\" analiz gerektiren işler ona uygundur.\n\n" +
    "Gazetecilik (araştırmacı), hukuk ve istihbarat analizi de Akrep erkeğinin rahat edeceği alanlardır."
},
female: {
  general:
    "Akrep burcu kadını güçlü, sezgisel ve tutkulu bir karaktere sahiptir. Dışarıya karşı gizemli ve çekici görünebilir; kolay kolay içini açmaz. Bir kez sevdiğinde ise son derece sadık ve koruyucudur.\n\n" +
    "Sezgisi çok güçlüdür; sahteliği ve yalanı hisseder. İlişkide derinlik ve güven ister; yüzeysel ilişkilerden sıkılır. Kıskançlık gösterebilir; partnerinin tam sadakati onun için önemlidir.\n\n" +
    "İş hayatında stratejik ve kararlıdır; duygusal olsa da zayıf görünmek istemez.",
  strengths: [
    "Tutku ve kararlılık",
    "Sezgi",
    "Karizma",
    "Sadakat",
    "Stratejik zeka",
    "Dönüşüm kapasitesi"
  ],
  weaknesses: [
    "Kıskançlık",
    "Kontrolcülük",
    "Kinci olma",
    "Aşırı gizlilik"
  ],
  love:
    "Derin ve güçlü ilişkiler ister. Romantik ama aynı zamanda \"gerçek\" bağ arar; oyun oynamaktan hoşlanmaz. Partnerinin de kendisine tam açılmasını ve sadık kalmasını bekler.\n\n" +
    "Sadakatsizlik ilişkiyi bitirir; affetmekte zorlanır. Uzun vadede evlilik ve aile kurmak ister; çocuklarına düşkün ve koruyucu bir anne olur.",
  career:
    "Psikoloji, terapistlik, strateji, araştırma, finans ve kriz yönetimi alanında başarılıdır. İnsanın \"derin\" yanıyla ilgilenen veya stratejik karar gerektiren işler ona uygundur.\n\n" +
    "Hukuk, gazetecilik (araştırmacı) ve insan kaynakları (dönüşüm) da Akrep kadınının parlayabileceği alanlardır."
}

},
{
  id: "sagittarius",
  name: "Sagittarius",
  nameTr: "Yay",
  symbol: "♐",
  element: "fire",
  image: "/zodiac/sagittarius.png",
  dates: "22 Kasım - 21 Aralık",
  rulingPlanet: "Jüpiter",
  modality: "Değişken",
  generalOverview:
    "Yay burcu ateş elementine ait ve \"değişken\" nitelikte bir burçtur. Yönetici gezegeni Jüpiter'in etkisiyle büyüme, keşif, özgürlük ve felsefe temaları baskındır. Kışa girerken doğan Yay'lar, hayatı geniş ve iyimser bir pencereden görür.\n\n" +
    "Özgürlükçü, maceracı ve iyimser bir yapıya sahiptir. Seyahat, öğrenme ve yeni deneyimler onları besler. Rutin ve kısıtlamadan hoşlanmazlar; \"anlam\" ve \"büyük resim\" peşinde koşarlar. Dürüst ve açık sözlüdürler; bazen patavatsız olabilirler.\n\n" +
    "Zayıf noktaları sabırsızlık, detaylardan kaçınma ve bazen bağlanma korkusudur. Eğitim, seyahat, yayıncılık ve uluslararası alanlarda başarılı olurlar.",

  dateRange: { start: { month: 11, day: 22 }, end: { month: 12, day: 21 } },

male: {
  general:
    "Yay burcu erkeği özgür ruhlu, maceracı ve iyimser bir karaktere sahiptir. Seyahat etmek, yeni kültürler keşfetmek ve sürekli öğrenmek ister. Rutin ofis işleri ve kısıtlayıcı ilişkiler onu sıkar.\n\n" +
    "Dürüst ve açık sözlüdür; bazen doğrudan söylediği için \"kaba\" algılanabilir. Felsefe, din, politika ve \"büyük sorular\" onu ilgilendirir. İlişkide özgürlüğünü korumak ister; boğucu bir aşk onu uzaklaştırır.\n\n" +
    "Uzun vadede anlamlı bir ilişki kurabilir; ancak partnerinin de kendine alan tanıması ve maceraya açık olması gerekir.",
  strengths: [
    "İyimserlik",
    "Cesaret ve macera ruhu",
    "Dürüstlük",
    "Öğrenme sevgisi",
    "Geniş bakış açısı",
    "Esneklik"
  ],
  weaknesses: [
    "Sabırsızlık",
    "Detaylardan kaçınma",
    "Bazen bağlanma korkusu",
    "Patavatsızlık"
  ],
  love:
    "Özgürlüğünü korumak ister. Boğucu ve kıskanç ilişkilerden kaçınır. Partnerinin de maceracı, zihinsel uyumlu ve kendine alan tanıyan biri olmasını ister.\n\n" +
    "Uzun vadede evlilik ve aile kurabilir; ancak seyahat ve ortak keşif ilişkiyi canlı tutar. Sadakatsizlik ve yalan onu uzaklaştırır.",
  career:
    "Seyahat, turizm, eğitim, yayıncılık, uluslararası ilişkiler ve dil alanında başarılıdır. Felsefe, din bilimi ve spor yorumculuğu da ona uygun alanlardır.\n\n" +
    "Tekrarlayan ve kapalı ortamlar onu yorar. Özgürlük ve çeşitlilik gerektiren işlerde parlar."
},
female: {
  general:
    "Yay burcu kadını enerjik, bağımsız ve iyimser bir karaktere sahiptir. Macera ve öğrenme onu besler; rutin hayattan sıkılır. Dürüst ve açık sözlüdür; oyun oynamaktan hoşlanmaz.\n\n" +
    "İlişkide özgürlüğünü korumak ister; kısıtlayıcı partnerlerden uzak durur. Zihinsel uyum ve ortak maceralar onun için önemlidir. Kariyer ve seyahat konusunda iddialı olabilir; ev kadını rolüne sıkışıp kalmak istemez.\n\n" +
    "Uzun vadede anlamlı bir birliktelik kurabilir; ancak partnerinin de kendine alan tanıması gerekir.",
  strengths: [
    "Pozitiflik ve iyimserlik",
    "Özgürlük ve bağımsızlık",
    "Dürüstlük",
    "Macera ruhu",
    "Zihinsel merak",
    "Esneklik"
  ],
  weaknesses: [
    "Bağlanma korkusu (bazen)",
    "Sabırsızlık",
    "Detaylardan kaçınma",
    "Patavatsızlık"
  ],
  love:
    "Macera dolu ve zihinsel uyumlu ilişkiler ister. Partnerinin de özgür, dürüst ve birlikte keşfe açık olmasını bekler. Boğucu aşk onu uzaklaştırır.\n\n" +
    "Evlilik ve uzun vadeli birliktelik kurabilir; seyahat ve ortak hobiler ilişkiyi canlı tutar. Sadakatsizlik ve yalan ilişkiyi bitirir.",
  career:
    "Uluslararası ilişkiler, turizm, eğitim, yayıncılık, medya ve dil alanında başarılıdır. Seyahat blogu, rehberlik ve danışmanlık da ona uygun mesleklerdir.\n\n" +
    "Tek düze ofis işleri onu yorar; esnek ve çeşitlilik gerektiren kariyerler tercih eder."
}

},
{
  id: "capricorn",
  name: "Capricorn",
  nameTr: "Oğlak",
  symbol: "♑",
  element: "earth",
  image: "/zodiac/capricorn.png",
  dates: "22 Aralık - 19 Ocak",
  rulingPlanet: "Satürn",
  modality: "Öncü",
  generalOverview:
    "Oğlak burcu toprak elementine ait ve \"öncü\" nitelikte bir burçtur. Yönetici gezegeni Satürn'ün etkisiyle disiplin, sorumluluk, hedef ve uzun vadeli yapı temaları baskındır. Kış gündönümü civarında doğan Oğlak'lar, hayatı ciddiye alır ve \"en tepeye\" tırmanmak ister.\n\n" +
    "Hedef odaklı, kararlı ve sabırlı bir yapıya sahiptir. Kısa vadeli keyiflerden çok uzun vadeli başarıya yatırım yapar. Dışarıya karşı mesafeli ve ciddi görünebilir; ancak güvendiği insanlara karşı sıcak ve şakacı olabilir. Zayıf noktaları aşırı ciddiyet, işkoliklik ve duygusal mesafedir.\n\n" +
    "Yönetim, finans, hukuk ve kurumsal kariyerde doğal yetenekleri vardır. İlişkide güven ve istikrar ararlar.",

  dateRange: { start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },

male: {
  general:
    "Oğlak burcu erkeği disiplinli, hedef odaklı ve sorumluluk sahibi bir karaktere sahiptir. Kariyerine ve statüsüne önem verir; \"başarılı\" görünmek onun için değerlidir. Duygusal olarak mesafeli görünebilir; kolay kolay açılmaz.\n\n" +
    "Ailesine ve sevdiklerine karşı güvenilir ve sadıktır; ancak duygularını göstermekte zorlanabilir. İş hayatında uzun saatler çalışabilir; \"işkolik\" olma eğilimi vardır. Uzun vadede ev ve aile kurmak ister; ancak önce maddi güvence sağlamak ister.\n\n" +
    "Mizah anlayışı genellikle kuru ve zekidir; güvendiği insanlara karşı sıcaktır.",
  strengths: [
    "Sorumluluk",
    "Disiplin",
    "Azim ve sabır",
    "Güvenilirlik",
    "Uzun vadeli planlama",
    "Liderlik"
  ],
  weaknesses: [
    "Aşırı ciddiyet",
    "Duygusal mesafe",
    "İşkoliklik",
    "Bazen soğuk görünme"
  ],
  love:
    "Güven temelli ilişki ister. Flörtü ciddiye taşımak ister; oyun oynamaktan hoşlanmaz. Partnerinin de güvenilir, sadık ve uzun vadeli düşünen biri olmasını bekler.\n\n" +
    "Duygularını göstermekte yavaş olabilir; ancak sadık ve evine düşkün bir eş olur. Evlilik ve çocuk onun için doğal bir hedeftir; ancak önce kariyerini oturtmak isteyebilir.",
  career:
    "Yönetim, CEO, finans, hukuk, mühendislik ve kamu yönetimi alanında başarılıdır. Uzun vadeli kariyer planı yapar ve adım adım tırmanır.\n\n" +
    "Girişimcilik ve kendi işini kurma da Oğlak erkeğine uygundur; disiplinli yapısı sayesinde başarılı olur."
},
female: {
  general:
    "Oğlak burcu kadını güçlü, planlı ve azimli bir karaktere sahiptir. Kariyerine önem verir; \"sadece ev hanımı\" rolüne sıkışıp kalmak istemez. Dışarıya karşı mesafeli ve ciddi görünebilir; ancak güvendiği insanlara karşı sıcak ve koruyucudur.\n\n" +
    "Duygusal olarak kolay açılmaz; güven kazanmak zaman alır. Uzun vadede evlilik ve aile kurmak ister; ancak partnerinin de sorumlu ve güvenilir olmasını bekler. İş ve özel hayat dengesini kurmaya çalışır; her iki alanda da \"en iyi\" olmak isteyebilir.\n\n" +
    "Pratik ve gerçekçidir; hayalperest değildir.",
  strengths: [
    "Azim ve kararlılık",
    "Disiplin",
    "Güvenilirlik",
    "Liderlik",
    "Uzun vadeli planlama",
    "Sorumluluk"
  ],
  weaknesses: [
    "Mesafeli duruş",
    "Aşırı ciddiyet",
    "Duyguları göstermekte zorlanma",
    "İşkoliklik"
  ],
  love:
    "Sadakat ve güven arar. Partnerinin de sorumlu, güvenilir ve uzun vadeli düşünen biri olmasını ister. Duygusal gösterilerde yavaş olabilir; ancak pratik jestlerle (güvenlik, istikrar) sevgisini gösterir.\n\n" +
    "Evlilik ve aile onun için önemlidir; çocuklarına disiplinli ama sevecen bir anne olur. Sadakatsizlik ve sorumsuzluk ilişkiyi bitirir.",
  career:
    "Kurumsal hayatta yönetim, finans, hukuk ve insan kaynakları alanında parlayabilir. Disiplinli ve hedef odaklı yapısı sayesinde kariyer basamaklarını tırmanır.\n\n" +
    "Kendi işini kurma veya kamu sektöründe üst düzey roller de Oğlak kadınına uygundur."
}

},
{
  id: "aquarius",
  name: "Aquarius",
  nameTr: "Kova",
  symbol: "♒",
  element: "air",
  image: "/zodiac/aquarius.png",
  dates: "20 Ocak - 18 Şubat",
  rulingPlanet: "Uranüs",
  modality: "Sabit",
  generalOverview:
    "Kova burcu hava elementine ait ve \"sabit\" nitelikte bir burçtur. Yönetici gezegeni Uranüs'ün etkisiyle yenilik, özgürlük, topluluk ve sıra dışı düşünce temaları baskındır. Kışın sonuna doğru doğan Kova'lar, \"gelecek\" ve \"insanlık\" odaklı düşünür.\n\n" +
    "Bireysel, yenilikçi ve bağımsız bir yapıya sahiptir. Gelenekçi kalıplardan sıkılır; kendi yolunu çizmek ister. Sosyal ve topluluk odaklıdır; ancak duygusal olarak mesafeli kalabilir. Zeka ve yaratıcılık güçlüdür; teknoloji, bilim ve sosyal projelerde başarılı olurlar.\n\n" +
    "Zayıf noktaları duygusal mesafe, rutin sevmeme ve bazen \"tuhaf\" görünmektir. İlişkide zihinsel uyum ve özgürlük ararlar.",

  dateRange: { start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },

 male: {
  general:
    "Kova burcu erkeği yenilikçi, bağımsız ve zeki bir karaktere sahiptir. Gelenekçi kalıplardan rahatsız olur; kendi fikirlerini savunur. Duygusal olarak mesafeli görünebilir; \"duygusal konuşmalar\" onu zorlayabilir.\n\n" +
    "Arkadaşlığa önem verir; bazen arkadaşları partnerinden önce gelebilir. İlişkide zihinsel uyum ve ortak ilgi alanları arar. İş hayatında yenilikçi ve takım odaklıdır; katı hiyerarşiden hoşlanmaz.\n\n" +
    "Uzun vadede sadık bir eş olabilir; ancak \"özgürlük\" ve \"kişisel alan\" ona bırakılmalıdır.",
  strengths: [
    "Zeka ve yenilikçilik",
    "Bağımsızlık",
    "Sosyal ve topluluk odaklılık",
    "İnsanlık ve adalet duygusu",
    "Yaratıcı düşünce",
    "Dostluk"
  ],
  weaknesses: [
    "Duygusal mesafe",
    "Rutin sevmeme",
    "Bazen \"soğuk\" algılanma",
    "İnatçılık"
  ],
  love:
    "Zihinsel uyum ve arkadaşlık temelli aşk ister. Boğucu ve kısıtlayıcı ilişkilerden kaçınır. Partnerinin de bağımsız, zeki ve kendine alan tanıyan biri olmasını bekler.\n\n" +
    "Romantik jestlerde bazen \"garip\" veya mesafeli olabilir; ancak sadık kalır. Evlilik ve uzun vadeli birliktelik kurabilir; ancak \"geleneksel\" rollerden rahatsız olabilir.",
  career:
    "Teknoloji, yazılım, bilim, araştırma ve sosyal girişim alanında başarılıdır. UX/UI, inovasyon danışmanlığı ve topluluk yönetimi ona uygundur.\n\n" +
    "Katı hiyerarşi ve geleneksel ofis ortamları onu yorar. Uzaktan çalışma ve proje bazlı işler tercih edebilir."
},
female: {
  general:
    "Kova burcu kadını özgün, yaratıcı ve bağımsız bir karaktere sahiptir. \"Kadına göre\" kalıplardan rahatsız olur; kendi kimliğini oluşturmak ister. Zeki ve meraklıdır; sürekli yeni fikirler peşinde koşar.\n\n" +
    "Duygusal olarak mesafeli görünebilir; ancak güvendiği insanlara karşı sıcak ve sadıktır. İlişkide zihinsel uyum ve özgürlük ister; kısıtlanmaktan hoşlanmaz. Kariyer ve toplumsal konulara ilgi duyar; sadece \"ev kadını\" olmak istemez.\n\n" +
    "Uzun vadede dengeli bir ilişki kurabilir; ancak partnerinin de kendine alan tanıması gerekir.",
  strengths: [
    "Yaratıcılık",
    "Bağımsızlık",
    "Zeka",
    "Sosyal bilinç",
    "Yenilikçilik",
    "Dostluk"
  ],
  weaknesses: [
    "Rutin sevmeme",
    "Duygusal mesafe",
    "Bazen \"tuhaf\" veya soğuk algılanma"
  ],
  love:
    "Özgürlüğünü korumak ister. Partnerinin de bağımsız ve zihinsel uyumlu olmasını bekler. Boğucu aşk onu uzaklaştırır.\n\n" +
    "Evlilik ve uzun vadeli birliktelik kurabilir; ancak geleneksel roller (sadece ev hanımı vb.) onu sıkar. Arkadaşlık temelli aşk ve ortak projeler ilişkiyi canlı tutar.",
  career:
    "Teknoloji, tasarım, sosyal projeler, NGO ve inovasyon alanında başarılıdır. Topluluk yönetimi, içerik üretimi ve bilim de ona uygun alanlardır.\n\n" +
    "Katı kurumsal yapılar onu yorar; esnek ve yaratıcı iş ortamları tercih eder."
}
}
,
{
  id: "pisces",
  name: "Pisces",
  nameTr: "Balık",
  symbol: "♓",
  element: "water",
  image: "/zodiac/pisces.png",
  dates: "19 Şubat - 20 Mart",
  rulingPlanet: "Neptün",
  modality: "Değişken",
  generalOverview:
    "Balık burcu su elementine ait ve \"değişken\" nitelikte bir burçtur. Yönetici gezegeni Neptün'ün etkisiyle hayal gücü, sezgi, empati ve ruhsal derinlik temaları baskındır. Zodyakın son burcu olarak \"tüm deneyimleri özümseme\" enerjisi taşır.\n\n" +
    "Empatik, yaratıcı ve hassas bir yapıya sahiptir. Başkalarının duygularını hisseder; sınır koymakta zorlanabilir. Sanat, müzik ve spiritüel konulara yatkındır. Zayıf noktaları kararsızlık, kaçış (alkol, hayal) ve aşırı fedakarlıktır.\n\n" +
    "İlişkide romantik ve fedakardır; ancak hayal kırıklığına açıktır. Sanat, terapi ve insana dokunan mesleklerde başarılı olurlar.",

  dateRange: { start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },

 male: {
  general:
    "Balık burcu erkeği duygusal, hayalperest ve empatik bir karaktere sahiptir. Sanat, müzik ve ruhsal konulara ilgi duyar. Başkalarının acısını hisseder; yardım etmek ister. Sınır koymakta zorlanabilir; bazen \"hayır\" demekte zayıftır.\n\n" +
    "İlişkide romantik ve fedakardır; partnerini mutlu etmek için kendini feda edebilir. Kararsız kalabilir; önemli kararlarda başkalarının fikrini alır. İş hayatında yaratıcı ve insan odaklı alanlarda rahat hisseder; katı rekabet onu yorar.\n\n" +
    "Hayal kırıklığına ve aldanmaya açıktır; güvenilir bir çevre onu korur.",
  strengths: [
    "Empati",
    "Yaratıcılık",
    "Sezgi",
    "Fedakarlık",
    "Romantiklik",
    "Ruhsal derinlik"
  ],
  weaknesses: [
    "Kararsızlık",
    "Sınır koyamama",
    "Kaçış eğilimi",
    "Aşırı hassasiyet"
  ],
  love:
    "Romantik ve fedakardır. Derin bağ ve \"ruh eşi\" arayışı içindedir. Partnerini idealize edebilir; hayal kırıklığı yaşayınca çökebilir.\n\n" +
    "Sadık ve şefkatli bir eş olur; ancak duygusal destek ve anlayış bekler. Sadakatsizlik ve soğukluk onu derinden yaralar. Evlilik ve aile onun için kutsal olabilir.",
  career:
    "Sanat, müzik, film, yazarlık ve terapi alanında başarılıdır. Psikoloji, hemşirelik ve sosyal hizmet de ona uygun mesleklerdir.\n\n" +
    "Aşırı rekabetçi ve soğuk iş ortamları onu yorar. Yaratıcı ve anlamlı işler onu tatmin eder."
},
female: {
  general:
    "Balık burcu kadını sezgisel, şefkatli ve yaratıcı bir karaktere sahiptir. Empati gücü yüksektir; başkalarının duygularını hisseder. Sanat, müzik ve ruhsal konulara yatkındır; hayal dünyası zengindir.\n\n" +
    "İlişkide romantik ve fedakardır; \"ruh eşi\" arayışı içinde olabilir. Sınır koymakta zorlanır; bazen kendini feda eder. Hayal kırıklığına açıktır; partnerini idealize edip sonra yıkılabilir. İş hayatında yaratıcı ve insan odaklı alanlarda rahat hisseder.\n\n" +
    "Duygusal destek ve anlayış bekler; soğuk ve mesafeli ortamlar onu yorar.",
  strengths: [
    "Şefkat ve empati",
    "Hayal gücü ve yaratıcılık",
    "Sezgi",
    "Fedakarlık",
    "Romantiklik",
    "Ruhsal derinlik"
  ],
  weaknesses: [
    "Aşırı hassasiyet",
    "Sınır koyamama",
    "Kararsızlık",
    "Kaçış eğilimi"
  ],
  love:
    "Derin bağ ve ruhsal uyum ister. Romantik ve fedakardır; partnerini mutlu etmek için çok şey yapar. İdealize etme eğilimi vardır; hayal kırıklığı yaşayınca incinebilir.\n\n" +
    "Sadık ve şefkatli bir eş olur; duygusal destek ve güven bekler. Sadakatsizlik ve soğukluk onu derinden yaralar. Evlilik ve aile onun için kutsal olabilir; çocuklarına çok düşkündür.",
  career:
    "Sanat, müzik, yazarlık, film ve terapi alanında öne çıkar. Psikoloji, hemşirelik, sosyal hizmet ve danışmanlık da ona uygun mesleklerdir.\n\n" +
    "Aşırı rekabetçi ve soğuk iş ortamları onu yorar. Yaratıcı ve anlamlı işler onu tatmin eder."
}

}

];


export const ELEMENT_LABELS: Record<Element, string> = {
  fire: "Ateş",
  earth: "Toprak",
  air: "Hava",
  water: "Su",
};

export const ELEMENT_COLORS: Record<Element, string> = {
  fire: "#f97316",
  earth: "#84cc16",
  air: "#38bdf8",
  water: "#0ea5e9",
};
