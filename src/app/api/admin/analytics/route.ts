import { NextResponse } from "next/server";
import { getAuthFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/db/client";
import {
  getTotalCompletions,
  getTodayCompletions,
  getMostPopularTest,
} from "@/lib/db";

export async function GET() {
  try {
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

    const [totalCompletions, todayCompletions, mostPopular] = await Promise.all([
      getTotalCompletions(),
      getTodayCompletions(),
      getMostPopularTest(),
    ]);

    return NextResponse.json({
      totalCompletions,
      todayCompletions,
      mostPopularTest: mostPopular
        ? { id: mostPopular.id, slug: mostPopular.slug, title: mostPopular.title }
        : null,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
