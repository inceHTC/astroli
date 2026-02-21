import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookie } from "@/lib/auth";
import { getAllDailyHoroscopes, upsertDailyHoroscope } from "@/lib/db/repositories/horoscope";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const dateStr = searchParams.get("date");
    const date = dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr) ? dateStr : new Date().toISOString().slice(0, 10);

    const horoscopes = await getAllDailyHoroscopes(typeof date === "string" ? new Date(date + "T12:00:00.000Z") : new Date());
    return NextResponse.json(
      horoscopes.map((h) => ({
        zodiacId: h.zodiacId,
        text: h.text,
        date: h.date,
      }))
    );
  } catch (error) {
    console.error("GET daily horoscope error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { date, horoscopes } = body;

    if (!date || !Array.isArray(horoscopes)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const dateStr = typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date(date).toISOString().slice(0, 10);
    for (const h of horoscopes) {
      if (h.zodiacId && typeof h.text === "string") {
        await upsertDailyHoroscope(h.zodiacId, dateStr, h.text.trim());
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST daily horoscope error:", error);
    const message = error instanceof Error ? error.message : "";
    const isPrismaFk = message.includes("Foreign key") || message.includes("violates foreign key");
    const isPrismaUnique = message.includes("Unique constraint") || message.includes("unique constraint");
    if (isPrismaFk) {
      return NextResponse.json(
        { error: "Burç verisi bulunamadı. Lütfen veritabanında Zodiac (12 burç) kayıtlarının olduğundan emin olun." },
        { status: 400 }
      );
    }
    if (isPrismaUnique) {
      return NextResponse.json({ error: "Bu tarih ve burç için zaten kayıt var; güncelleme yapılamadı." }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
