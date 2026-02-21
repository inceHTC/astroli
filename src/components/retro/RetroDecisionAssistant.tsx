"use client";

import { useState } from "react";

type DecisionCategory = "is" | "iliski" | "estetik" | "yatirim";

interface RetroDecisionAssistantProps {
  planetName: string;
}

function getDecisionCopy(category: DecisionCategory) {
  switch (category) {
    case "is":
      return {
        title: "Yeni iş / sözleşme kararı",
        buttonText: '"Yeni sözleşme imzalayacağım" için öneri üret',
        exampleText: '"Yeni sözleşme imzalayacağım"',
        suggestions: [
          "Sözleşmeyi yüksek sesle kendine oku; anlamadığın her maddeyi netleştirmek için zaman isteyebilirsin.",
          "Kararı bugün vermek zorunda olup olmadığını sor; bir gece düşünmek çoğu zaman zihni berraklaştırır.",
          "İşin sadece maddi tarafına değil, psikolojik yüküne ve günlük ritmine de odaklanmaya çalış.",
        ],
        tone: "Merkür retrosu, imza atmayı yasaklamaz; sadece detayları otomatik pilota almadan, daha bilinçli okuman için tempoyu yavaşlatır.",
      };
    case "iliski":
      return {
        title: "İlişkiyle ilgili karar",
        buttonText: '"İlişkimle ilgili karar vereceğim" için öneri üret',
        exampleText: '"İlişkimle ilgili karar vereceğim"',
        suggestions: [
          "Tek bir tartışma üzerinden değil, tekrar eden döngüler üzerinden karar vermeye çalış.",
          "Duygularını yazıya dök; yazarken hangi cümlelerde sıkıştığını fark etmek önemli ipuçları verir.",
          "Keskin karar vermeden önce, ihtiyaç ve sınırlarını sakin bir anda açıkça ifade etmeyi dene.",
        ],
        tone: "Retro, ilişkini bitirmen ya da tutunman gerektiğini söylemez; sadece neye gerçekten ihtiyaç duyduğunu daha net görmen için alan açar.",
      };
    case "estetik":
      return {
        title: "Estetik / görünüm değişimi",
        buttonText: '"Görünümümü değiştireceğim" için öneri üret',
        exampleText: '"Görünümümü değiştireceğim"',
        suggestions: [
          "Kökten değişiklik yerine, önce küçük ve geri döndürülebilir adımlarla hislerini test edebilirsin.",
          "Uzun süredir istediğin bir değişiklikse, referans görsellerle beklentini netleştirmek iyi bir ara adım olabilir.",
          "Kararı sadece dış onay için değil, bedeninle kurduğun ilişki üzerinden de değerlendirmeye çalış.",
        ],
        tone: "Bu dönem, bedenini değiştirmemelisin demek yerine; öz-değer algın, benlik imgen ve dış onay ihtiyacın arasındaki dengeyi görmeni destekler.",
      };
    case "yatirim":
      return {
        title: "Yatırım / finansal karar",
        buttonText: '"Yatırım kararı vereceğim" için öneri üret',
        exampleText: '"Yatırım kararı vereceğim"',
        suggestions: [
          "Kaybetmeyi göze alabileceğin miktarı netleştir; bu sınır, sağlıklı risk algısı için çıpa görevi görebilir.",
          "Tek kaynaktan değil, farklı bakış açılarından bilgi toplayarak kararını yapılandır.",
          "Kısa vadeli heyecan yerine, uzun vadeli dayanıklılık senaryosu yazmaya çalış.",
        ],
        tone: "Retro enerjisi, seni yatırımdan vazgeçirmekten çok; risk algını, sabrını ve beklentilerini daha gerçekçi görmeni amaçlayan bir yavaşlatma tuşu gibi düşünülebilir.",
      };
    default:
      return {
        title: "",
        buttonText: "Öneri üret",
        exampleText: "",
        suggestions: [],
        tone: "",
      };
  }
}

export function RetroDecisionAssistant({
  planetName,
}: RetroDecisionAssistantProps) {
  const [category, setCategory] = useState<DecisionCategory>("is");
  const [visible, setVisible] = useState(false);

  const copy = getDecisionCopy(category);

  const handleGenerate = () => {
    setVisible(true);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg sm:p-7">
      <div className="space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500">
            Karar analizi
          </p>
          <h2 className="mt-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
            {planetName.replace(/\s+Retrosu$/, "")} retrosunda kararını nasıl destekleyebilirsin?
          </h2>
          <p className="mt-1 text-xs text-gray-600 leading-relaxed">
            Amaç, seni durdurmak değil;{" "}
            <span className="font-semibold text-gray-800">
              kararını daha sakin, şeffaf ve psikolojik olarak sağlıklı hale
              getirmek
            </span>
            .
          </p>
        </div>

        <div className="grid gap-3 text-xs sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-gray-700">
              Şu an hangi alanda karar vermek üzeresin?
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <DecisionPill
                label="Yeni sözleşme / iş"
                active={category === "is"}
                onClick={() => setCategory("is")}
              />
              <DecisionPill
                label="İlişki kararı"
                active={category === "iliski"}
                onClick={() => setCategory("iliski")}
              />
              <DecisionPill
                label="Estetik / görünüm"
                active={category === "estetik"}
                onClick={() => setCategory("estetik")}
              />
              <DecisionPill
                label="Yatırım / finans"
                active={category === "yatirim"}
                onClick={() => setCategory("yatirim")}
              />
            </div>
          </div>

          <div className="flex flex-col justify-between gap-3 rounded-2xl border-2 border-gray-200 bg-gray-50 p-3 text-[11px]">
            <p className="text-[11px] text-gray-600 leading-relaxed">
              {copy.exampleText ? (
                <>
                  {copy.exampleText} gibi net bir cümleyle niyetini belirle;
                  ardından{" "}
                  <span className="font-semibold text-gray-800">
                    temkinli ama yasaklayıcı olmayan
                  </span>{" "}
                  önerileri gör.
                </>
              ) : (
                <>
                  Net bir cümleyle niyetini belirle; ardından{" "}
                  <span className="font-semibold text-gray-800">
                    temkinli ama yasaklayıcı olmayan
                  </span>{" "}
                  önerileri gör.
                </>
              )}
            </p>
            <button
              type="button"
              onClick={handleGenerate}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 px-3 py-2 text-[11px] font-semibold text-white shadow-md transition hover:translate-y-0.5 hover:shadow-lg"
            >
              {copy.buttonText}
            </button>
          </div>
        </div>

        {visible && (
          <div className="relative mt-2 space-y-3 rounded-2xl border-2 border-gray-200 bg-gray-50 p-3 text-[13px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
              Analiz · {copy.title}
            </p>
            <ul className="space-y-1.5 text-gray-700 leading-relaxed">
              {copy.suggestions.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-1 rounded-2xl border-2 border-purple-200 bg-purple-50 p-3 text-[12px] leading-relaxed text-purple-800">
              {copy.tone}
            </p>
            <p className="text-[10px] text-gray-500">
              Bu içerik, kararını senin yerine vermez;{" "}
              <span className="font-medium text-gray-700">
                sadece bilişsel yükünü azaltan bir perspektif sunar
              </span>
              .
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

interface DecisionPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function DecisionPill({ label, active, onClick }: DecisionPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between rounded-2xl border-2 px-3 py-1.5 text-[11px] font-medium transition ${
        active
          ? "border-purple-400 bg-purple-100 text-purple-700 shadow-sm"
          : "border-gray-300 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50"
      }`}
      aria-pressed={active}
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

