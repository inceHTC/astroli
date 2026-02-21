import { NextResponse } from "next/server";
import { z } from "zod";
import { getTestBySlug } from "@/lib/db";
import { createTestCompletion } from "@/lib/db";
import { computeResult, validateAnswers, type SubmitAnswer } from "@/lib/testEngine";

const schema = z.object({
  slug: z.string().min(1),
  answers: z.array(
    z.object({
      questionId: z.string(),
      optionId: z.string(),
    })
  ),
  device: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { slug, answers, device } = parsed.data;

    const test = await getTestBySlug(slug);
    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    const validation = validateAnswers(test, answers as SubmitAnswer[]);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error ?? "Invalid answers" },
        { status: 400 }
      );
    }

    const result = computeResult(test, answers as SubmitAnswer[]);
    if (!result) {
      return NextResponse.json(
        { error: "Could not compute result" },
        { status: 500 }
      );
    }

    await createTestCompletion(test.id, device);

    return NextResponse.json({
      primaryType: result.primaryType,
      elements: result.elements,
      description: result.description,
      subtitle: result.subtitle,
      strengths: result.strengths,
      shadowSide: result.shadowSide,
      elementData: result.elementData,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
