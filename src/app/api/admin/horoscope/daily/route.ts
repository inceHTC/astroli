import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookie } from "@/lib/auth";
import { ensureZodiacSignsExist } from "@/lib/db/repositories/zodiac";
import { getDailyHoroscopesForAdmin, upsertDailyHoroscope } from "@/lib/db/repositories/horoscope";

export async function GET(request: NextRequest) {
  try {
    let auth: { adminId: string } | null = null;
    try {
      auth = await getAuthFromCookie();
    } catch (e) {
      console.error("getAuthFromCookie error:", e);
      return NextResponse.json({ error: "Auth error" }, { status: 500 });
    }
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const dateStr = searchParams.get("date");
    const date = dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr) ? dateStr : new Date().toISOString().slice(0, 10);

    const horoscopes = await getDailyHoroscopesForAdmin(date);
    const list = Array.isArray(horoscopes) ? horoscopes : [];
    return NextResponse.json(
      list.map((h) => ({
        zodiacId: h.zodiacId,
        text: h.text,
        date: h.date,
      }))
    );
  } catch (error) {
    console.error("GET daily horoscope error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    let auth: { adminId: string } | null = null;
    try {
      auth = await getAuthFromCookie();
    } catch (e) {
      console.error("getAuthFromCookie error:", e);
      return NextResponse.json({ error: "Auth error" }, { status: 500 });
    }
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    type DailyEntry = { zodiacId?: string; text?: string };
    let body: { date?: string; horoscopes?: unknown[] };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Geçersiz JSON" }, { status: 400 });
    }
    const { date, horoscopes } = body;

    if (!date || !Array.isArray(horoscopes)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const dateStr = typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date(date).toISOString().slice(0, 10);

    await ensureZodiacSignsExist();

    for (const h of horoscopes as DailyEntry[]) {
      if (h.zodiacId && typeof h.text === "string") {
        try {
          await upsertDailyHoroscope(h.zodiacId, dateStr, h.text.trim());
        } catch (e) {
          console.error("upsertDailyHoroscope error for", h.zodiacId, e);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST daily horoscope error:", error);
    return NextResponse.json({ success: true });
  }
}
