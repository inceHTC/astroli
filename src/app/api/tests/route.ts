import { NextResponse } from "next/server";
import { getPublishedTests } from "@/lib/db";

export async function GET() {
  try {
    const tests = await getPublishedTests();
    const list = tests.map((t: { id: string; slug: string; title: string; description: string; duration: string; questions: unknown[] }) => ({
      id: t.id,
      slug: t.slug,
      title: t.title,
      description: t.description,
      duration: t.duration,
      questionCount: t.questions.length,
    }));
    return NextResponse.json(list);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
