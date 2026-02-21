import { NextResponse } from "next/server";
import { getAuthFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/db/client";
import {
  listCelebrities,
  createCelebrity,
  getCelebrityBySlug,
  searchCelebritiesByName,
} from "@/lib/db/repositories/celebrity";
import { createCelebritySchema } from "@/lib/schemas/celebrity";

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

export async function GET(req: Request) {
  const err = await requireAdmin();
  if (err) return err;
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const list = q
    ? await searchCelebritiesByName(q)
    : await listCelebrities();
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const body = await req.json();
    const parsed = createCelebritySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const existing = await getCelebrityBySlug(parsed.data.slug);
    if (existing) {
      return NextResponse.json({ error: "Bu slug zaten kullanılıyor." }, { status: 400 });
    }
    const birthDate = parseBirthDate(parsed.data.birthDate ?? undefined);
    const celebrity = await createCelebrity({
      ...parsed.data,
      image: parsed.data.image || undefined,
      bio: parsed.data.bio || undefined,
      birthDate,
    });
    return NextResponse.json(celebrity);
  } catch {
    return NextResponse.json({ error: "Oluşturulamadı." }, { status: 500 });
  }
}
