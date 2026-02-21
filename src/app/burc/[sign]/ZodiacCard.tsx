"use client";

import { useState } from "react";
import Image from "next/image";
import { ZodiacInfo, ELEMENT_LABELS } from "@/data/zodiac";

export function ZodiacCard({ zodiac }: { zodiac: ZodiacInfo }) {
  const [active, setActive] = useState<"general" | "male" | "female">("general");

  const content =
    active === "male"
      ? zodiac.male
      : active === "female"
      ? zodiac.female
      : null;

  return (
    <div className="overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-xl">

      {/* 🔥 GÖRSEL */}
      <div className="relative h-72 w-full">
        <Image
          src={zodiac.image}
          alt={zodiac.nameTr}
          fill
          priority
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>

      {/* 🔥 BAŞLIK ALANI */}
      <div className="px-10 pt-10 text-center">
        <h2 className="text-3xl font-bold text-black">
          {zodiac.nameTr} Burcu
        </h2>

        <p className="mt-2 text-[#666]">
          {zodiac.dates}
        </p>
      </div>

      {/* 🔥 İÇERİK */}
      <div className="p-10 pt-6">

        {/* Üst Bilgiler */}
        <div className="mb-8 flex flex-wrap justify-center gap-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-gray-100">
            Element: {ELEMENT_LABELS[zodiac.element]}
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-100">
            Yönetici: {zodiac.rulingPlanet}
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-100">
            Modalite: {zodiac.modality}
          </span>
        </div>

        {/* İçerik */}
        {active === "general" ? (
          <div className="text-[#444] leading-relaxed space-y-4 text-center">
            {zodiac.generalOverview
              .split(/\n\n+/)
              .filter(Boolean)
              .map((para, i) => (
                <p key={i}>{para}</p>
              ))}
          </div>
        ) : (
          <>
            <div className="text-[#444] leading-relaxed space-y-4">
              {content?.general
                .split(/\n\n+/)
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
            </div>

            <div className="mt-8 grid gap-10 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-black">Güçlü Yönler</h3>
                <ul className="mt-3 space-y-2 text-[#444]">
                  {content?.strengths.map((item, i) => (
                    <li key={i}>✔ {item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-black">Zayıf Yönler</h3>
                <ul className="mt-3 space-y-2 text-[#444]">
                  {content?.weaknesses.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 space-y-6 text-[#444]">
              <div>
                <h3 className="font-semibold text-black mb-2">Aşk ve İlişkiler</h3>
                {(content?.love ?? "").split(/\n\n+/).filter(Boolean).map((para, i) => (
                  <p key={i} className="mb-2 last:mb-0">{para}</p>
                ))}
              </div>
              <div>
                <h3 className="font-semibold text-black mb-2">Kariyer ve İş Hayatı</h3>
                {(content?.career ?? "").split(/\n\n+/).filter(Boolean).map((para, i) => (
                  <p key={i} className="mb-2 last:mb-0">{para}</p>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Toggle */}
        <div className="mt-10 flex justify-center gap-3 border-t pt-8">
          <button
            onClick={() => setActive("general")}
            className={`px-5 py-2 rounded-full text-sm transition ${
              active === "general"
                ? "bg-[#1A163E] text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Genel
          </button>

          <button
            onClick={() => setActive("male")}
            className={`px-5 py-2 rounded-full text-sm transition ${
              active === "male"
                ? "bg-[#1A163E] text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Erkek
          </button>

          <button
            onClick={() => setActive("female")}
            className={`px-5 py-2 rounded-full text-sm transition ${
              active === "female"
                ? "bg-[#1A163E] text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Kadın
          </button>
        </div>

      </div>
    </div>
  );
}
