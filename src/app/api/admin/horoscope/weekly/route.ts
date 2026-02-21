import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookie } from "@/lib/auth";
import { getAllWeeklyHoroscopes, upsertWeeklyHoroscope } from "@/lib/db/repositories/horoscope";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const weekStartStr = searchParams.get("weekStart");
    const weekEndStr = searchParams.get("weekEnd");
    const date = weekStartStr ? new Date(weekStartStr) : new Date();

    const horoscopes = await getAllWeeklyHoroscopes(date);
    return NextResponse.json(
      horoscopes.map((h) => ({
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

    const body = await request.json();
    const { weekStart, weekEnd, horoscopes } = body;

    if (!weekStart || !weekEnd || !Array.isArray(horoscopes)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const weekStartDate = new Date(weekStart);
    const weekEndDate = new Date(weekEnd);

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
