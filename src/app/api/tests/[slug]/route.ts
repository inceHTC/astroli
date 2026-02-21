import { NextResponse } from "next/server";
import { getTestBySlug } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const test = await getTestBySlug(slug);
    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }
    const payload = {
      id: test.id,
      slug: test.slug,
      title: test.title,
      description: test.description,
      duration: test.duration,
      questions: test.questions.map((q: { id: string; text: string; order: number; options: { id: string; text: string; order: number }[] }) => ({
        id: q.id,
        text: q.text,
        order: q.order,
        options: q.options.map((o: { id: string; text: string; order: number }) => ({
          id: o.id,
          text: o.text,
          order: o.order,
        })),
      })),
    };
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
