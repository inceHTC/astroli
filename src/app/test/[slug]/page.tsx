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
      <div className="bg-[#070B12] min-h-screen py-16">
        <Container size="md" className="text-center">
          <p className="text-[#8494B2]">Test bulunamadı.</p>
          <Link
            href="/testler"
            className="mt-4 inline-block text-[#ffc552] hover:underline"
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
    const { scoring, primaryTemplate, secondaryTemplate, isBalanced, isMixed } = result;
    const pt = primaryTemplate.profileText;
    const displayTitle = isBalanced
      ? "Dengeli Profil"
      : isMixed && secondaryTemplate
        ? `${primaryTemplate.title} + ${secondaryTemplate.title}`
        : primaryTemplate.title;
    const displaySubtitle = primaryTemplate.subtitle;

    const relatedTests = TESTS.filter((t) => t.slug !== slug).slice(0, 3);

    const shareText = `"${test.title}" testinde sonucum: ${displayTitle}${displaySubtitle ? ` — ${displaySubtitle}` : ""}. Sen de çöz 👇`;
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    const handleCopy = () => {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).catch(() => {});
    };

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

    return (
      <div className="bg-[#070B12] pb-28 pt-12">
        <Container size="md">

          {/* RESULT HERO */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1530] via-[#11121A] to-[#0E1523] border border-[#ffc552]/20 p-7 sm:p-10 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,114,0.08),transparent_60%)]" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#ffc552] mb-3">
                ✦ Sonucun
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#EDE9DF] leading-tight">
                {displayTitle}
              </h1>
              {displaySubtitle && (
                <p className="mt-2 text-base text-[#ffc552]">{displaySubtitle}</p>
              )}
              {isMixed && secondaryTemplate && (
                <p className="mt-2 text-sm text-[#6B7A99]">
                  Baskın: {primaryTemplate.title} · İkincil iz: {secondaryTemplate.title}
                </p>
              )}
              {isBalanced && (
                <p className="mt-2 text-sm text-[#6B7A99]">
                  Dört elemente de benzer puan — dengeli bir profil.
                </p>
              )}

              {/* SHARE BUTTONS */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-medium text-[#EDE9DF] hover:bg-white/10 transition-colors"
                >
                  <span>⎘</span> Kopyala
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 px-4 py-2 text-xs font-medium text-[#25D366] hover:bg-[#25D366]/25 transition-colors"
                >
                  WhatsApp
                </a>
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-white/[0.06] border border-white/15 px-4 py-2 text-xs font-medium text-[#EDE9DF] hover:bg-white/10 transition-colors"
                >
                  X (Twitter)
                </a>
              </div>
            </div>
          </div>

          {/* PROFILE CONTENT */}
          <div className="mt-5 rounded-2xl bg-[#11121A] text-white p-6 sm:p-8">

            {/* Element dağılım grafiği */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7A99]">
                Element Dağılımın
              </p>
              <div className="mt-4 space-y-3">
                {scoring.sorted.map(({ profile, percent }) => (
                  <div key={profile} className="flex items-center gap-3">
                    <span className="w-14 text-xs text-[#8494B2]">{ELEMENT_NAMES[profile]}</span>
                    <div className="flex-1 h-2.5 rounded-full bg-white/[0.08] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#ffc552] to-[#B8934A] transition-all duration-700"
                        style={{ width: `${Math.max(percent, 2)}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs font-medium text-[#ffc552]">%{percent}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Baskınlık etiketi */}
            <div className="mt-5">
              <span className="inline-block rounded-full bg-[#ffc552]/15 border border-[#ffc552]/20 px-3 py-1 text-xs font-medium text-[#ffc552]">
                {DOMINANCE_LABELS[scoring.dominanceLevel] ?? scoring.dominanceLevel}
              </span>
            </div>

            {/* Ana açıklama */}
            <div className="mt-6 border-t border-white/[0.06] pt-6">
              {pt ? (
                <div className="space-y-5 text-gray-300 text-sm sm:text-base">
                  <div className="rounded-xl bg-[#1A1C2B] p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#ffc552] mb-2">Senin Enerjin</p>
                    <p className="leading-relaxed">{pt.behaviorTendency}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7A99] mb-1.5">Baskı Altında</p>
                    <p className="leading-relaxed">{pt.stressResponse}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7A99] mb-1.5">Güçlü Yanın</p>
                    <p className="leading-relaxed">{pt.strength}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7A99] mb-1.5">Dikkat Alanın</p>
                    <p className="leading-relaxed">{pt.riskArea}</p>
                  </div>
                  <div className="rounded-xl bg-[#1A1C2B] p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7A99] mb-1.5">Gelişim Fırsatın</p>
                    <p className="leading-relaxed">{pt.developmentSuggestion}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                  {primaryTemplate.description}
                </p>
              )}
            </div>

            {/* Güçlü yanlar */}
            <div className="mt-6 border-t border-white/[0.06] pt-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7A99]">
                Güçlü Yanların
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {primaryTemplate.strengths.map((s) => (
                  <span key={s} className="rounded-full bg-[#ffc552]/10 border border-[#ffc552]/20 px-3 py-1.5 text-sm text-[#ffc552]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Gölge yan */}
            <div className="mt-5 rounded-xl bg-gradient-to-br from-[#1A1530] to-[#1A1C2B] p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#8494B2]">Gölge Yan</p>
              <p className="mt-2 text-gray-300 text-sm sm:text-base leading-relaxed">{primaryTemplate.shadowSide}</p>
            </div>
          </div>

          {/* ARKADAŞINA GÖNDER CTA */}
          <div className="mt-5 rounded-2xl bg-gradient-to-br from-[#5B3FFF]/15 to-[#1A1C2B] border border-[#5B3FFF]/20 p-6 text-center">
            <p className="text-sm font-semibold text-[#EDE9DF]">Arkadaşının sonucu ne olurdu?</p>
            <p className="mt-1 text-xs text-[#8494B2]">Bu testi paylaş ve karşılaştır</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={handleCopy}
                className="rounded-full bg-[#ffc552] px-5 py-2 text-sm font-semibold text-[#070B12] hover:bg-[#ffd47a] transition-colors"
              >
                Bağlantıyı kopyala
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#25D366] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1ebe5d] transition-colors"
              >
                WhatsApp'ta paylaş
              </a>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-6 flex flex-col gap-3 max-w-md mx-auto">
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

          {/* RELATED TESTS */}
          {relatedTests.length > 0 && (
            <div className="mt-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7A99] mb-5">
                ✦ Sonraki Testler
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {relatedTests.map((rt) => (
                  <Link key={rt.id} href={`/test/${rt.slug}`}>
                    <div className="group rounded-xl border border-white/[0.06] bg-[#0E1523] p-4 hover:border-[#ffc552]/25 transition-all hover:-translate-y-0.5">
                      <p className="text-sm font-semibold text-[#EDE9DF] leading-snug group-hover:text-white transition-colors line-clamp-2">
                        {rt.title}
                      </p>
                      <p className="mt-1.5 text-xs text-[#6B7A99]">{rt.duration} · {rt.questionCount} soru</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </Container>
      </div>
    );
  }

  return (
    <div className="bg-[#070B12] pb-28 pt-8">
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
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#ffc552] hover:underline"
        >
          ← Testler
        </Link>

        <div className="mb-8">
          <p className="text-sm text-[#8494B2]">
            Soru {step + 1} / {test.questions.length}
          </p>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full bg-[#ffc552] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold text-[#EDE9DF]">
          {question.text}
        </h2>

        <div className="mt-8 space-y-3">
          {question.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleAnswer(opt)}
              className="w-full rounded-2xl border border-white/[0.10] bg-[#0E1523] p-5 text-left text-[#EDE9DF] transition-all hover:border-[#ffc552]/50 hover:shadow-md active:scale-[0.99]"
            >
              {opt.text}
            </button>
          ))}
        </div>
      </Container>
    </div>
  );
}
