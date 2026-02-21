import { NextResponse } from "next/server";
import { getAuthFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/db/client";
import {
  listAllArticles,
  createArticle,
  getArticleBySlugForAdmin,
} from "@/lib/db/repositories/article";
import { createArticleSchema } from "@/lib/schemas/article";

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
    const articles = await listAllArticles();
    return NextResponse.json(Array.isArray(articles) ? articles : []);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  const err = await requireAdmin();
  if (err) return err;

  try {
    const body = await req.json();
    const parsed = createArticleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const existing = await getArticleBySlugForAdmin(parsed.data.slug);
    if (existing) {
      return NextResponse.json(
        { error: "Bu slug zaten kullanılıyor." },
        { status: 400 }
      );
    }
    const article = await createArticle(parsed.data);
    return NextResponse.json(article);
  } catch (e) {
    return NextResponse.json(
      { error: "Makale oluşturulamadı." },
      { status: 500 }
    );
  }
}
