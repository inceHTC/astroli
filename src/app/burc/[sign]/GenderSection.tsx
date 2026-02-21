"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZodiacInfo } from "@/data/zodiac";

interface Props {
  zodiac: ZodiacInfo;
}

export function GenderSection({ zodiac }: Props) {
  const [active, setActive] = useState<"male" | "female">("male");

  const content = active === "male" ? zodiac.male : zodiac.female;

  return (
    <div className="mt-16">

      {/* Toggle Buttons */}
      <div className="flex justify-center mb-10">
        <div className="flex rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setActive("male")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
              active === "male"
                ? "bg-[#2fa7f7] text-white shadow"
                : "text-gray-600"
            }`}
          >
            Erkek
          </button>

          <button
            onClick={() => setActive("female")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
              active === "female"
                ? "bg-[#d552c8fe] text-white shadow"
                : "text-gray-600"
            }`}
          >
            Kadın
          </button>
        </div>
      </div>

      {/* Animated Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl bg-white border border-gray-200 p-8 shadow-sm"
        >
          <h2 className="text-2xl font-semibold text-black">
            {active === "male"
              ? `Erkek ${zodiac.nameTr} Burcu`
              : `Kadın ${zodiac.nameTr} Burcu`}
          </h2>

          <p className="mt-4 text-[#444] leading-relaxed">
            {content.general}
          </p>

          <div className="mt-8 grid gap-8 md:grid-cols-2">

            <div>
              <h3 className="font-medium text-black">Güçlü Yönler</h3>
              <ul className="mt-3 space-y-2 text-[#444]">
                {content.strengths.map((item, i) => (
                  <li key={i}>✔ {item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-black">Zayıf Yönler</h3>
              <ul className="mt-3 space-y-2 text-[#444]">
                {content.weaknesses.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <p>
              <strong>Aşk:</strong> {content.love}
            </p>
            <p>
              <strong>Kariyer:</strong> {content.career}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
