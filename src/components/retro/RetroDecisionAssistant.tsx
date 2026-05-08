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
        title: "Yeni is / sozlesme karari",
        buttonText: "Sozlesme kararim icin oneri uret",
        exampleText: "Yeni sozlesme imzalayacagim",
        suggestions: [
          "Sozlesmeyi yuksek sesle kendine oku; anlamadigin her maddeyi netlestirmek icin zaman isteyebilirsin.",
          "Karari bugun vermek zorunda olup olmadigini sor; bir gece dusunmek cogu zaman zihni berraklastirir.",
          "Isin sadece maddi tarafina degil, psikolojik yukune ve gunluk ritmine de odaklanmaya calis.",
        ],
        tone: "Merkur retrosu imza atmayi yasaklamaz; sadece detaylari otomatik pilota almadan, daha bilincli okuman icin tempoyu yavaslatiir.",
      };
    case "iliski":
      return {
        title: "Iliskiyle ilgili karar",
        buttonText: "Iliski kararim icin oneri uret",
        exampleText: "Iliskimle ilgili karar verecegim",
        suggestions: [
          "Tek bir tartisma uzerinden degil, tekrar eden donguler uzerinden karar vermeye calis.",
          "Duygularini yaziya dok; hangi cumlelerde sikindigini fark etmek onemli ipuclari verir.",
          "Keskin karar vermeden once, ihtiyac ve sinirlarini sakin bir anda acikca ifade etmeyi dene.",
        ],
        tone: "Retro, iliskini bitirmen ya da tutunman gerektigini soylemez; neye gercekten ihtiyac duyduigunu daha net gormen icin alan acar.",
      };
    case "estetik":
      return {
        title: "Estetik / gorunum degisimi",
        buttonText: "Gorunum degisimim icin oneri uret",
        exampleText: "Gorunumumu degistirecegim",
        suggestions: [
          "Kokten degisiklik yerine once kucuk ve geri donulebilir adimlarla hislerini test edebilirsin.",
          "Uzun suredir istedigin bir degisiklikse, referans gorseller ile beklentini netlestirmek iyi bir ara adim olabilir.",
          "Karari sadece dis onay icin degil, bedeninle kurdugun iliski uzerinden de degerlendirmeye calis.",
        ],
        tone: "Bu donem bedenini degistirmemelisin demekten ziyade; oz-deger algin ve dis onay ihtiyacin arasindaki dengeyi gormen icin alan acar.",
      };
    case "yatirim":
      return {
        title: "Yatirim / finansal karar",
        buttonText: "Finansal kararim icin oneri uret",
        exampleText: "Yatirim karari verecegim",
        suggestions: [
          "Kaybetmeyi goze alabilecegini netlestir; bu sinir saglikli risk algisi icin cipa gorevi gorur.",
          "Tek kaynaktan degil, farkli bakis acilarindan bilgi toplayarak kararini yapilandir.",
          "Kisa vadeli heyecan yerine, uzun vadeli dayaniklilik senaryosu yazmaya calis.",
        ],
        tone: "Retro enerjisi seni yatirimdan vazgecirmekten cok; risk algin, sabrini ve beklentilerini daha gercekci gormen icin bir yavaslama tusu gibi calisir.",
      };
  }
}

export function RetroDecisionAssistant({ planetName }: RetroDecisionAssistantProps) {
  const [category, setCategory] = useState<DecisionCategory>("is");
  const [visible, setVisible] = useState(false);

  const copy = getDecisionCopy(category);

  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#0E1523] p-6 sm:p-7">
      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A78BFA]">
            Karar analizi
          </p>
          <h2 className="mt-1 text-xl font-bold text-[#EDE9DF] sm:text-2xl">
            {planetName.replace(/\s+Retrosu$/, "")} retrosunda kararini nasil destekleyebilirsin?
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-[#7A8090]">
            Amac seni durdurmak degil;{" "}
            <span className="text-[#C4C0BA]">
              kararini daha sakin ve psikolojik olarak saglikli hale getirmek
            </span>.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[#7A8090]">
              Su an hangi alanda karar vermek uzeresin?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(["is", "iliski", "estetik", "yatirim"] as DecisionCategory[]).map((cat) => {
                const labels: Record<DecisionCategory, string> = {
                  is: "Yeni sozlesme / is",
                  iliski: "Iliski karari",
                  estetik: "Estetik / gorunum",
                  yatirim: "Yatirim / finans",
                };
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => { setCategory(cat); setVisible(false); }}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2 text-[11px] font-medium transition ${
                      category === cat
                        ? "border-[#A78BFA]/30 bg-[#A78BFA]/10 text-[#A78BFA]"
                        : "border-white/[0.07] bg-white/[0.02] text-[#7A8090] hover:border-white/[0.12] hover:text-[#C4C0BA]"
                    }`}
                    aria-pressed={category === cat}
                  >
                    <span>{labels[cat]}</span>
                    <span className={`h-1.5 w-1.5 rounded-full ${category === cat ? "bg-[#A78BFA]" : "bg-white/[0.15]"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-[11px]">
            <p className="leading-relaxed text-[#7A8090]">
              Net bir cümleyle niyetini belirle, ardından{" "}
              <span className="text-[#C4C0BA]">temkinli ama yasaklayici olmayan</span>{" "}
              onerileri gor.
            </p>
            <button
              type="button"
              onClick={() => setVisible(true)}
              className="inline-flex items-center justify-center rounded-full bg-[#5C44D0] px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-[#4934B8]"
            >
              {copy.buttonText}
            </button>
          </div>
        </div>

        {visible && (
          <div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A78BFA]">
              Analiz · {copy.title}
            </p>
            <ul className="space-y-2 leading-relaxed text-[#C4C0BA]">
              {copy.suggestions.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#A78BFA]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="rounded-xl border border-[#A78BFA]/15 bg-[#A78BFA]/6 p-3 text-[12px] leading-relaxed text-[#C4C0BA]">
              {copy.tone}
            </p>
            <p className="text-[10px] text-[#7A8090]">
              Bu icerik kararini senin yerine vermez;{" "}
              <span className="text-[#C4C0BA]">
                sadece bilissel yukunu azaltan bir perspektif sunar
              </span>.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
