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
    const date = dateStr ? new Date(dateStr) : new Date();

    const horoscopes = await getAllDailyHoroscopes(date);
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

    const dateObj = new Date(date);
    for (const h of horoscopes) {
      if (h.zodiacId && h.text) {
        await upsertDailyHoroscope(h.zodiacId, dateObj, h.text);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST daily horoscope error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
