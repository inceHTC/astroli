import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookie } from "@/lib/auth";
import { ensureZodiacSignsExist } from "@/lib/db/repositories/zodiac";
import { getWeeklyHoroscopesForAdmin, upsertWeeklyHoroscope } from "@/lib/db/repositories/horoscope";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const weekStartStr = searchParams.get("weekStart");
    const date = weekStartStr || new Date().toISOString().slice(0, 10);

    const horoscopes = await getWeeklyHoroscopesForAdmin(date);
    const list = Array.isArray(horoscopes) ? horoscopes : [];
    return NextResponse.json(
      list.map((h) => ({
        zodiacId: h.zodiacId,
        health: h.health,
        love: h.love,
        money: h.money,
        work: h.work,
        healthText: h.healthText ?? "",
        loveText: h.loveText ?? "",
        moneyText: h.moneyText ?? "",
        workText: h.workText ?? "",
        summary: h.summary,
        advice: h.advice,
        weekStart: h.weekStart,
        weekEnd: h.weekEnd,
      }))
    );
  } catch (error) {
    console.error("GET weekly horoscope error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    type WeeklyBody = {
      weekStart?: string;
      weekEnd?: string;
      horoscopes?: Array<{
        zodiacId?: string;
        health?: number;
        love?: number;
        money?: number;
        work?: number;
        healthText?: string | null;
        loveText?: string | null;
        moneyText?: string | null;
        workText?: string | null;
        summary?: string;
        advice?: string;
      }>;
    };
    const body = (await request.json()) as WeeklyBody;
    const { weekStart, weekEnd, horoscopes } = body;

    if (!weekStart || !weekEnd || !Array.isArray(horoscopes)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const weekStartDate = new Date(weekStart);
    const weekEndDate = new Date(weekEnd);

    await ensureZodiacSignsExist();

    for (const h of horoscopes) {
      if (h.zodiacId) {
        await upsertWeeklyHoroscope(
          h.zodiacId,
          weekStartDate,
          weekEndDate,
          {
            health: h.health ?? 3,
            love: h.love ?? 3,
            money: h.money ?? 3,
            work: h.work ?? 3,
            healthText: h.healthText ?? null,
            loveText: h.loveText ?? null,
            moneyText: h.moneyText ?? null,
            workText: h.workText ?? null,
            summary: h.summary || "",
            advice: h.advice || "",
          }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST weekly horoscope error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
