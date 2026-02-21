import { NextResponse } from "next/server";
import { getAuthFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/db/client";
import {
  getCelebrityById,
  updateCelebrity,
  deleteCelebrity,
  getCelebrityBySlug,
} from "@/lib/db/repositories/celebrity";
import { updateCelebritySchema } from "@/lib/schemas/celebrity";

async function requireAdmin() {
  const auth = await getAuthFromCookie();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = await prisma.admin.findUnique({ where: { id: auth.adminId } });
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

function parseBirthDate(s: string | undefined | null): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin();
  if (err) return err;
  const { id } = await params;
  const celebrity = await getCelebrityById(id);
  if (!celebrity) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  return NextResponse.json(celebrity);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin();
  if (err) return err;
  const { id } = await params;
  const celebrity = await getCelebrityById(id);
  if (!celebrity) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  try {
    const body = await req.json();
    const parsed = updateCelebritySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    if (parsed.data.slug && parsed.data.slug !== celebrity.slug) {
      const existing = await getCelebrityBySlug(parsed.data.slug);
      if (existing) {
        return NextResponse.json({ error: "Bu slug zaten kullanılıyor." }, { status: 400 });
      }
    }
    const birthDate = parsed.data.birthDate !== undefined ? parseBirthDate(parsed.data.birthDate) : undefined;
    const updateData: Parameters<typeof updateCelebrity>[1] = { ...parsed.data };
    if (birthDate !== undefined) updateData.birthDate = birthDate;
    const updated = await updateCelebrity(id, updateData);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Güncellenemedi." }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const err = await requireAdmin();
  if (err) return err;
  const { id } = await params;
  const celebrity = await getCelebrityById(id);
  if (!celebrity) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  try {
    await deleteCelebrity(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Silinemedi." }, { status: 500 });
  }
}
