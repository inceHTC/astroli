import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookie } from "@/lib/auth";
import {
  deleteWeeklyHoroscopesByWeekStart,
  getWeeklyHoroscopeWeeksForAdmin,
} from "@/lib/db/repositories/horoscope";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get("limit");
    const limit = Math.min(Math.max(Number(limitParam) || 100, 1), 1040);

    const weeks = await getWeeklyHoroscopeWeeksForAdmin(limit);
    return NextResponse.json(
      weeks.map((w) => ({
        weekStart: w,
      }))
    );
  } catch (error) {
    console.error("GET weekly archive error:", error);
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

    const weekStart = (body as { weekStart?: string })?.weekStart;
    if (!weekStart || !/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) {
      return NextResponse.json({ error: "Geçersiz hafta başlangıcı" }, { status: 400 });
    }

    const count = await deleteWeeklyHoroscopesByWeekStart(weekStart);
    return NextResponse.json({ success: true, deleted: count });
  } catch (error) {
    console.error("DELETE weekly archive error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

