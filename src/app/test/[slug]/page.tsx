"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { TESTS } from "@/data/tests";
import type { TestResult, PersonalityTest, TestOption } from "@/data/tests";
import { ShareCard } from "@/components/share/ShareCard";
import { computeScoring, type ScoringResult } from "@/lib/testScoring";

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

const DOMINANCE_LABELS: Record<string, string> = {
  yüksek_baskın: "Yüksek baskın profil",
  baskın: "Baskın profil",
  dengeli: "Dengeli dağılım",
};

export interface TestPageResult {
  scoring: ScoringResult;
  primaryTemplate: TestResult;
  secondaryTemplate: TestResult | null;
  isBalanced: boolean;
  isMixed: boolean;
  elementBreakdown: Record<string, number>;
}

function calculateResult(
  test: PersonalityTest,
  answers: Record<string, TestOption>
): TestPageResult {
  const optionByQuestionId: Record<string, { id: string; text: string; scores?: import("@/lib/testScoring").OptionScores; weight?: Record<string, number> }> = {};
  for (const [qId, opt] of Object.entries(answers)) {
    optionByQuestionId[qId] = {
      id: opt.id,
      text: opt.text,
      scores: opt.scores,
      weight: opt.weight,
    };
  }
  const scoring = computeScoring(optionByQuestionId, test.questions.length);

  const primaryTemplate =
    test.resultTemplates.find((r) => r.id === scoring.primaryProfile) ?? test.resultTemplates[0];
  const secondaryTemplate = scoring.isMixed
    ? (test.resultTemplates.find((r) => r.id === scoring.secondaryProfile) ?? null)
    : null;

  const elementBreakdown: Record<string, number> = {};
  for (const [k, v] of Object.entries(scoring.percentages)) {
    elementBreakdown[k] = v;
  }

  return {
    scoring,
    primaryTemplate,
    secondaryTemplate,
    isBalanced: scoring.isBalanced,
    isMixed: scoring.isMixed,
    elementBreakdown,
  };
}

export default function TestPage() {
  const params = useParams();
  const slug = params.slug as string;

  const test = TESTS.find((t) => t.slug === slug);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, TestOption>>({});
  const [result, setResult] = useState<TestPageResult | null>(null);

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

  const image = CATEGORY_IMAGES[test.category] ?? "/tests/default.png";
  const question = test.questions[step];
  const progress = ((step + 1) / test.questions.length) * 100;

  const handleAnswer = (option: TestOption) => {
    const newAnswers = { ...answers, [question.id]: option };
    setAnswers(newAnswers);
    if (step + 1 < test.questions.length) {
      setStep(step + 1);
    } else {
      setResult(calculateResult(test, newAnswers));
    }
  };

  if (result) {
    const { scoring, primaryTemplate, secondaryTemplate, isBalanced, isMixed, elementBreakdown } = result;
    const pt = primaryTemplate.profileText;
    const displayTitle = isBalanced
      ? "Dengeli profil"
      : isMixed && secondaryTemplate
        ? `${primaryTemplate.title} + ${secondaryTemplate.title}`
        : primaryTemplate.title;
    const displaySubtitle = primaryTemplate.subtitle;

    return (
      <div className="bg-[#F7F8FC] pb-28 pt-20">
        <Container size="md">
          <div className="rounded-2xl bg-[#11121A] text-white p-6 shadow-lg sm:p-8">
            <h1 className="text-xl font-semibold sm:text-2xl">{displayTitle}</h1>
            {displaySubtitle && (
              <p className="mt-1 text-sm text-[#5B3FFF] sm:text-base">{displaySubtitle}</p>
            )}
            {isMixed && secondaryTemplate && (
              <p className="mt-2 text-sm text-gray-400">
                Birincil: {primaryTemplate.title} · İkincil: {secondaryTemplate.title}
              </p>
            )}
            {isBalanced && (
              <p className="mt-2 text-sm text-gray-400">
                Dört elemente de benzer puan; dengeli bir dağılım görülüyor.
              </p>
            )}

            {/* Baskınlık etiketi */}
            <div className="mt-4">
              <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-gray-300">
                {DOMINANCE_LABELS[scoring.dominanceLevel] ?? scoring.dominanceLevel}
              </span>
            </div>

            {/* % dağılım grafiği (çubuk) */}
            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 sm:text-sm">
                Profil dağılımı
              </p>
              <div className="mt-3 space-y-2">
                {scoring.sorted.map(({ profile, percent }) => (
                  <div key={profile} className="flex items-center gap-3">
                    <span className="w-16 text-xs text-gray-400">{ELEMENT_NAMES[profile]}</span>
                    <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#5B3FFF] transition-all duration-500"
                        style={{ width: `${Math.max(percent, 2)}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs text-gray-400">%{percent}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5 parça metin veya tek açıklama */}
            {pt ? (
              <div className="mt-6 space-y-4 text-gray-300 text-sm sm:text-base">
                <section>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Davranış eğilimi</p>
                  <p className="leading-relaxed">{pt.behaviorTendency}</p>
                </section>
                <section>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Stres tepkisi</p>
                  <p className="leading-relaxed">{pt.stressResponse}</p>
                </section>
                <section>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Güçlü yön</p>
                  <p className="leading-relaxed">{pt.strength}</p>
                </section>
                <section>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Risk alanı</p>
                  <p className="leading-relaxed">{pt.riskArea}</p>
                </section>
                <section>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Gelişim önerisi</p>
                  <p className="leading-relaxed">{pt.developmentSuggestion}</p>
                </section>
              </div>
            ) : (
              <p className="mt-5 text-gray-300 leading-relaxed text-sm sm:text-base">
                {primaryTemplate.description}
              </p>
            )}

            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 sm:text-sm">
                Güçlü yanlar
              </p>
              <ul className="mt-2 space-y-1.5 text-gray-300 text-sm sm:text-base">
                {primaryTemplate.strengths.map((s) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className="text-[#5B3FFF]">✦</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-xl bg-[#1A1C2B] p-4 sm:p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Gölge yan</p>
              <p className="mt-2 text-gray-300 text-sm sm:text-base">{primaryTemplate.shadowSide}</p>
            </div>
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

  return (
    <div className="bg-[#F7F8FC] pb-28 pt-8">
      <Container size="sm">
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
              onClick={() => handleAnswer(opt)}
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
