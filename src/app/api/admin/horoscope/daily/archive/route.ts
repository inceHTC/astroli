import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookie } from "@/lib/auth";
import {
  deleteDailyHoroscopesByDate,
  getDailyHoroscopeDatesForAdmin,
} from "@/lib/db/repositories/horoscope";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get("limit");
    const limit = Math.min(Math.max(Number(limitParam) || 100, 1), 3650);

    const dates = await getDailyHoroscopeDatesForAdmin(limit);
    return NextResponse.json(
      dates.map((d) => ({
        date: d,
      }))
    );
  } catch (error) {
    console.error("GET daily archive error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Geçersiz JSON" }, { status: 400 });
    }

    const date = (body as { date?: string })?.date;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "Geçersiz tarih" }, { status: 400 });
    }

    const count = await deleteDailyHoroscopesByDate(date);
    return NextResponse.json({ success: true, deleted: count });
  } catch (error) {
    console.error("DELETE daily archive error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

