import { NextResponse } from "next/server";
import { getAuthFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/db/client";
import {
  listAllTestsForAdmin,
  createTest,
  getTestBySlugForAdmin,
} from "@/lib/db/repositories/test";
import { createTestSchema } from "@/lib/schemas/test";

async function requireAdmin() {
  const auth = await getAuthFromCookie();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const admin = await prisma.admin.findUnique({
    where: { id: auth.adminId },
  });
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const err = await requireAdmin();
  if (err) return err;

  try {
    const tests = await listAllTestsForAdmin();
    const list = tests.map((t) => ({
      id: t.id,
      slug: t.slug,
      title: t.title,
      description: t.description,
      duration: t.duration,
      image: t.image,
      category: t.category,
      published: t.published,
      questionCount: t._count.questions,
      updatedAt: t.updatedAt,
    }));
    return NextResponse.json(list);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  const err = await requireAdmin();
  if (err) return err;

  try {
    const body = await req.json();
    const parsed = createTestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const existing = await getTestBySlugForAdmin(parsed.data.slug);
    if (existing) {
      return NextResponse.json(
        { error: "Bu slug zaten kullanılıyor." },
        { status: 400 }
      );
    }
    const test = await createTest(parsed.data);
    return NextResponse.json(test);
  } catch (e) {
    return NextResponse.json(
      { error: "Test oluşturulamadı." },
      { status: 500 }
    );
  }
}
