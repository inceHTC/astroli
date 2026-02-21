"use client";

import { useMemo, useState } from "react";

type DecisionType = "is" | "iliski" | "estetik" | "yatirim";

interface FormState {
  date: string;
  sign: string;
  decisionType: DecisionType | "";
}

interface SuggestionOutput {
  suggestions: string[];
  cautions: string[];
  insight: string;
}

function buildSuggestion({ date, sign, decisionType }: FormState): SuggestionOutput {
  const base: SuggestionOutput = {
    suggestions: [],
    cautions: [],
    insight: "",
  };

  const year = date ? new Date(date).getFullYear() : undefined;

  if (decisionType === "is") {
    base.suggestions.push(
      "Yeni iş sözleşmesini imzalamadan önce, maddeleri yüksek sesle kendine okuyup gerçekten anladığından emin ol.",
      "Mümkünse bir kez daha geri bildirim al; bir arkadaşın veya profesyonel bir göz, sana fark etmediğin detayları gösterebilir.",
      "Kararı bugün vermen gerekmiyorsa, zihnini sakinleştirmek için en az bir gece uyuyarak üzerinden geç."
    );
    base.cautions.push(
      "Sadece 'kaçırırım' baskısıyla, içinden gelen tereddüt sinyalini görmezden gelmekten kaçın.",
      "Yorulmuşken ya da duygusal olarak dalgalıyken, geri dönüşü zor kararları aceleye getirmemeye çalış."
    );
    base.insight =
      "Bu dönem, iş kararlarını engellemek için değil; aceleyle aldığın kararların uzun vadeli etkilerini daha bilinçli görmen için seni yavaşlatmak isteyebilir.";
  } else if (decisionType === "iliski") {
    base.suggestions.push(
      "İlişkiyle ilgili kararını tek bir olay üzerinden değil, genel döngü ve tekrar eden temalar üzerinden değerlendir.",
      "Duygularını yazıya dökerek, ne hissettiğini ve neye ihtiyaç duyduğunu daha net görebilirsin.",
      "Kesin karar almadan önce, sakin bir anda ihtiyaç ve sınırlarını açık şekilde ifade etmeyi dene."
    );
    base.cautions.push(
      "Tamamen öfke veya kırgınlık anında, geri dönüşü zor kararlar vermekten kaçın.",
      "Sadece korktuğun için kalmayı ya da sadece bir anda rahatlamak için gitmeyi seçmemeye çalış."
    );
    base.insight =
      "Retro dönemi, ilişkilerdeki 'yanlış' kişiyi değil, görünmeyen ihtiyaçlarını ve sınırlarını daha şeffaf görmen için bir ayna görevi görebilir.";
  } else if (decisionType === "estetik") {
    base.suggestions.push(
      "Kendine zaman tanı; önce küçük ve geri döndürülebilir değişikliklerle ne hissettiğini test edebilirsin.",
      "Uzun zamandır istediğin bir değişiklikse, referans fotoğrafları ve beklentilerini netleştirmek güvenli alan sağlar.",
      "Kararı tamamen dış onaya göre değil, bedeninle kurduğun ilişkiye göre vermeyi dene."
    );
    base.cautions.push(
      "Tamamen anlık duygusal dalgalanma ile, seni tanımayan bir uzmanın önerisine bütünüyle teslim olmamaya çalış.",
      "Kendini sadece dış görünüşünle tanımladığın sert iç seslere dikkat et; bu sesler çoğu zaman gerçekçi olmayabilir."
    );
    base.insight =
      "Bu dönem, estetik kararları yasaklamaz; sadece beden algın, öz-değerin ve dış onay ihtiyacın arasındaki dengeyi fark etmeni kolaylaştırabilir.";
  } else if (decisionType === "yatirim") {
    base.suggestions.push(
      "Risk seviyesini, kaybetmeyi göze alabileceğin miktar üzerinden hesaplamaya çalış.",
      "Kararı tek bir kaynaktan değil, farklı bakış açılarından besleyerek şekillendir.",
      "Kısa vadeli kazanç değil, uzun vadeli dayanıklılık odağıyla bir senaryo yaz."
    );
    base.cautions.push(
      "Sadece 'herkes yapıyor' diye dahil olduğun yatırım kararlarına dikkat et.",
      "Tam bilgiye sahip olmadan, 'bir şey kaçırıyorum' duygusuyla büyük adımlar atmaktan kaçın."
    );
    base.insight =
      "Retro enerjisi, yatırımda korkutmak yerine; risk algını, sabrını ve güven ihtiyacını daha gerçekçi görmen için ortam yaratabilir.";
  }

  if (sign) {
    base.suggestions.push(
      `${sign} burcu vurgusu, kararlarını verirken hem sezgilerini hem de mantığını beraber kullanmana destek olabilir; tek bir tarafa yaslanmak yerine dengeyi araştır.`,
    );
  }

  if (year && year < new Date().getFullYear()) {
    base.insight +=
      " Geçmiş yıllara ait temaları fark etmek, bugün verdiğin kararların arka planını anlamanı kolaylaştırabilir.";
  }

  if (base.suggestions.length === 0) {
    base.suggestions.push(
      "Önündeki kararla ilgili tüm seçenekleri yazıya dök; artı-eksi listesi, zihnini sakinleştirebilir.",
      "Güvendiğin birine duygularını aktarmak, karar sürecini daha taşıması kolay hale getirebilir.",
      "Kararı hemen vermen gerekip gerekmediğini dürüstçe kendine sor; zaman tanıyabildiğin her durumda, netlik artar.",
    );
    base.cautions.push(
      "Kendini zorla bir yöne iten iç sesi, sorgulamadan gerçeğin tek kaynağı gibi görmemeye çalış.",
      "Sürekli kendini suçlayan sert iç diyaloglara dikkat et; bu, kararı değil sadece yükünü artırabilir.",
    );
    base.insight =
      "Retro, yasak koyan bir dış otorite değil; kararlarını daha bilinçli vermen için süreci yavaşlatan içsel bir alarm sistemi gibi düşünülebilir.";
  }

  return {
    suggestions: base.suggestions.slice(0, 3),
    cautions: base.cautions.slice(0, 2),
    insight: base.insight,
  };
}

export function RetroPersonalAnalyzer() {
  const [form, setForm] = useState<FormState>({
    date: "",
    sign: "",
    decisionType: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const output = useMemo(() => buildSuggestion(form), [form]);

  const handleChange = (
    field: keyof FormState,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500">
            Kişisel retro analizi
          </p>
          <h1 className="mt-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 bg-clip-text text-2xl font-semibold text-transparent sm:text-3xl">
            Kararını yasaklamadan,{" "}
            <span className="block text-gray-800">
              farkındalıkla destekleyelim.
            </span>
          </h1>
          <p className="mt-3 text-sm text-gray-700 leading-relaxed">
            Bu modül; doğum tarihin, burcun ve karar türün üzerinden{" "}
            <span className="font-semibold text-gray-900">
              üç öneri, iki dikkat noktası ve tek bir psikolojik içgörü
            </span>{" "}
            üretir. Amaç; seni korkutmak değil,{" "}
            <span className="font-semibold text-gray-900">iç sesini yumuşatmak</span> ve
            karar sürecini daha şeffaf hale getirmek.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="block text-[11px] font-semibold text-gray-700">
                  Doğum tarihin
                </span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className="w-full rounded-2xl border-2 border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none ring-purple-400/40 placeholder:text-gray-400 focus:border-purple-400 focus:ring-1"
                />
              </label>
              <label className="space-y-1.5">
                <span className="block text-[11px] font-semibold text-gray-700">
                  Burcun (bilmiyorsan boş bırak)
                </span>
                <input
                  type="text"
                  value={form.sign}
                  onChange={(e) => handleChange("sign", e.target.value)}
                  placeholder="Örn. Koç, Terazi..."
                  className="w-full rounded-2xl border-2 border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none ring-purple-400/40 placeholder:text-gray-400 focus:border-purple-400 focus:ring-1"
                />
              </label>
            </div>

            <label className="space-y-1.5">
              <span className="block text-[11px] font-semibold text-gray-700">
                Şu anda hangi alanda karar vermek istiyorsun?
              </span>
              <div className="grid gap-2 sm:grid-cols-2">
                <DecisionChip
                  label="İş & kariyer"
                  value="is"
                  active={form.decisionType === "is"}
                  onSelect={() => handleChange("decisionType", "is")}
                />
                <DecisionChip
                  label="İlişki & bağlanma"
                  value="iliski"
                  active={form.decisionType === "iliski"}
                  onSelect={() => handleChange("decisionType", "iliski")}
                />
                <DecisionChip
                  label="Estetik & görünüm"
                  value="estetik"
                  active={form.decisionType === "estetik"}
                  onSelect={() => handleChange("decisionType", "estetik")}
                />
                <DecisionChip
                  label="Yatırım & finans"
                  value="yatirim"
                  active={form.decisionType === "yatirim"}
                  onSelect={() => handleChange("decisionType", "yatirim")}
                />
              </div>
            </label>

            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:translate-y-0.5 hover:shadow-lg"
            >
              Kişisel retro rehberini oluştur
            </button>

            <p className="text-[10px] text-gray-500">
              Bu analiz tıbbi ya da kesin bir hukuki öneri değildir;{" "}
              <span className="font-medium text-gray-700">
                farkındalık artırıcı psikolojik bir rehberlik
              </span>{" "}
              niteliğindedir.
            </p>
          </form>
        </div>

        <div className="relative rounded-3xl border-2 border-gray-200 bg-gray-50 p-4 text-xs shadow-md">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
              Çıktı paneli
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-medium text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Yargılamayan dil
            </span>
          </div>

          {!submitted ? (
            <div className="mt-4 space-y-2 text-[13px] text-gray-600 leading-relaxed">
              <p>
                Formu doldurduğunda;{" "}
                <span className="font-semibold text-gray-900">
                  3 öneri, 2 dikkat noktası ve 1 psikolojik içgörü
                </span>{" "}
                göreceksin. Amaç; kararı senin yerine vermek değil,{" "}
                <span className="font-semibold text-gray-900">
                  iç sesini daha nazik ve net hale getirmek
                </span>
                .
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                  3 öneri
                </p>
                <ul className="space-y-1.5 text-[13px] text-gray-700 leading-relaxed">
                  {output.suggestions.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                  2 dikkat noktası
                </p>
                <ul className="space-y-1.5 text-[13px] text-gray-700 leading-relaxed">
                  {output.cautions.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-3 text-[13px] text-purple-900">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-purple-700">
                  Psikolojik içgörü
                </p>
                <p className="mt-1 leading-relaxed">{output.insight}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

interface DecisionChipProps {
  label: string;
  value: DecisionType;
  active: boolean;
  onSelect: () => void;
}

function DecisionChip({ label, value, active, onSelect }: DecisionChipProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex items-center justify-between rounded-2xl border-2 px-3 py-2 text-[11px] font-medium transition ${
        active
          ? "border-purple-400 bg-purple-100 text-purple-700 shadow-sm"
          : "border-gray-300 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50"
      }`}
      aria-pressed={active}
      data-decision={value}
    >
      <span>{label}</span>
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-gray-400"
        }`}
      />
    </button>
  );
}

