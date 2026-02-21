import { NextResponse } from "next/server";
import { getAuthFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/db/client";
import {
  getArticleById,
  updateArticle,
  deleteArticle,
  getArticleBySlugForAdmin,
} from "@/lib/db/repositories/article";
import { updateArticleSchema } from "@/lib/schemas/article";

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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin();
  if (err) return err;

  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) {
    return NextResponse.json({ error: "Makale bulunamadı." }, { status: 404 });
  }
  return NextResponse.json(article);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin();
  if (err) return err;

  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) {
    return NextResponse.json({ error: "Makale bulunamadı." }, { status: 404 });
  }

  try {
    const body = await req.json();
    const parsed = updateArticleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    if (parsed.data.slug && parsed.data.slug !== article.slug) {
      const existing = await getArticleBySlugForAdmin(parsed.data.slug);
      if (existing) {
        return NextResponse.json(
          { error: "Bu slug zaten kullanılıyor." },
          { status: 400 }
        );
      }
    }
    const updated = await updateArticle(id, parsed.data);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Makale güncellenemedi." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin();
  if (err) return err;

  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) {
    return NextResponse.json({ error: "Makale bulunamadı." }, { status: 404 });
  }

  try {
    await deleteArticle(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Makale silinemedi." },
      { status: 500 }
    );
  }
}
