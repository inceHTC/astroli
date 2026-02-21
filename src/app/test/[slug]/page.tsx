"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { TESTS } from "@/data/tests";
import type { TestResult, PersonalityTest } from "@/data/tests";
import { ShareCard } from "@/components/share/ShareCard";

const CATEGORY_IMAGES: Record<string, string> = {
  love: "/tests/love.png",
  career: "/tests/career.png",
  psychology: "/tests/mind.png",
  spiritual: "/tests/aura.png",
  personality: "/tests/personality.png",
};

const ELEMENT_NAMES: Record<string, string> = {
  fire: "Ateş",
  earth: "Toprak",
  air: "Hava",
  water: "Su",
};

function calculateResult(
  test: PersonalityTest,
  answers: Record<string, Record<string, number>>
): TestResult & { elementBreakdown: Record<string, number> } {
  const totals: Record<string, number> = {
    fire: 0,
    earth: 0,
    air: 0,
    water: 0,
  };

  for (const qAnswers of Object.values(answers)) {
    for (const [elem, pts] of Object.entries(qAnswers)) {
      totals[elem] += pts;
    }
  }

  const sum = Object.values(totals).reduce((a, b) => a + b, 0);

  const elementBreakdown: Record<string, number> = {};
  for (const [k, v] of Object.entries(totals)) {
    elementBreakdown[k] = sum > 0 ? Math.round((v / sum) * 100) : 25;
  }

  const primary = Object.entries(elementBreakdown).sort(
    (a, b) => b[1] - a[1]
  )[0][0];

  const template =
    test.resultTemplates.find((r) => r.id === primary) ??
    test.resultTemplates[0];

  return {
    ...template,
    elementBreakdown,
  };
}

export default function TestPage() {
  const params = useParams();
  const slug = params.slug as string;

  const test = TESTS.find((t) => t.slug === slug);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<
    Record<string, Record<string, number>>
  >({});
  const [result, setResult] = useState<
    (TestResult & { elementBreakdown: Record<string, number> }) | null
  >(null);

  // ================= TEST BULUNAMADI =================
  if (!test) {
    return (
      <div className="bg-[#F7F8FC] min-h-screen py-16">
        <Container size="md" className="text-center">
          <p className="text-[#444]">Test bulunamadı.</p>
          <Link
            href="/testler"
            className="mt-4 inline-block text-[#5B3FFF] hover:underline"
          >
            Testlere dön
          </Link>
        </Container>
      </div>
    );
  }

  const image =
    CATEGORY_IMAGES[test.category] ?? "/tests/default.png";

  const question = test.questions[step];
  const progress = ((step + 1) / test.questions.length) * 100;

  const handleAnswer = (weight: Record<string, number>) => {
    const newAnswers = {
      ...answers,
      [question.id]: weight,
    };

    setAnswers(newAnswers);

    if (step + 1 < test.questions.length) {
      setStep(step + 1);
    } else {
      setResult(calculateResult(test, newAnswers));
    }
  };

  // ================= RESULT SCREEN =================
  if (result) {
    return (
      <div className="bg-[#F7F8FC] pb-28 pt-20">
        <Container size="md">
        

          {/* Sonuç kartı: başlık → açıklama → element → güçlü yanlar → gölge */}
          <div className="rounded-2xl bg-[#11121A] text-white p-6 shadow-lg sm:p-8 ">
            <h1 className="text-xl font-semibold sm:text-2xl">
              {result.title}
            </h1>
            {result.subtitle && (
              <p className="mt-1 text-sm text-[#5B3FFF] sm:text-base">{result.subtitle}</p>
            )}

            <p className="mt-5 text-gray-300 leading-relaxed text-sm sm:text-base">
              {result.description}
            </p>

            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 sm:text-sm">
                Element dağılımın
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(result.elementBreakdown).map(([elem, pct]) => (
                  <span
                    key={elem}
                    className="rounded-full border border-[#5B3FFF]/30 bg-[#5B3FFF]/10 px-3 py-1 text-xs text-[#8C7BFF] sm:px-4 sm:py-1.5 sm:text-sm"
                  >
                    {ELEMENT_NAMES[elem]}: %{pct}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 sm:text-sm">
                Güçlü yanların
              </p>
              <ul className="mt-2 space-y-1.5 text-gray-300 text-sm sm:text-base">
                {result.strengths.map((s) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className="text-[#5B3FFF]">✦</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-xl bg-[#1A1C2B] p-4 sm:p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Gölge yan
              </p>
              <p className="mt-2 text-gray-300 text-sm sm:text-base">{result.shadowSide}</p>
            </div>
          </div>

          

          <div className="mt-8">
            <ShareCard
              title={result.title}
              subtitle={result.subtitle}
              type="test"
              elementBreakdown={result.elementBreakdown}
            />
          </div>


<div className="mt-8 flex flex-col gap-3 max-w-md mx-auto">
  <Button
    variant="outline"
    onClick={() => {
      setStep(0);
      setAnswers({});
      setResult(null);
    }}
    fullWidth
  >
    Tekrar çöz
  </Button>

  <Link href="/testler" className="w-full">
    <Button variant="secondary" fullWidth>
      Başka test dene
    </Button>
  </Link>
</div>

        </Container>
      </div>
    );
  }

  // ================= QUESTION SCREEN =================
  return (
    <div className="bg-[#F7F8FC] pb-28 pt-8">
      <Container size="sm">

        {/* TEST KAPAK */}
        <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <Image
            src={image}
            alt={test.title}
            fill
            className="object-cover"
          />
        </div>

        <Link
          href="/testler"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#5B3FFF] hover:underline"
        >
          ← Testler
        </Link>

        <div className="mb-8">
          <p className="text-sm text-[#444]">
            Soru {step + 1} / {test.questions.length}
          </p>

          <div className="mt-2 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full bg-[#5B3FFF] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold text-black">
          {question.text}
        </h2>

        <div className="mt-8 space-y-3">
          {question.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleAnswer(opt.weight)}
              className="w-full rounded-2xl border border-gray-200 bg-white p-5 text-left text-black transition-all hover:border-[#5B3FFF]/50 hover:shadow-md active:scale-[0.99]"
            >
              {opt.text}
            </button>
          ))}
        </div>

      </Container>
    </div>
  );
}
