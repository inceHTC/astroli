import { NextResponse } from "next/server";
import { getZodiacById } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const zodiac = await getZodiacById(id);
    if (!zodiac) {
      return NextResponse.json({ error: "Zodiac not found" }, { status: 404 });
    }
    return NextResponse.json({
      id: zodiac.id,
      name: zodiac.name,
      nameTr: zodiac.nameTr,
      symbol: zodiac.symbol,
      element: zodiac.element,
      dates: zodiac.dates,
      overview: zodiac.overview,
      strengths: zodiac.strengths,
      weaknesses: zodiac.weaknesses,
      love: zodiac.loveStyle,
      career: zodiac.career,
      money: zodiac.money,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
