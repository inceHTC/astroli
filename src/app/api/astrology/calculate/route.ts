import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateChart } from "@/lib/astrology";

const schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{1,2}:\d{2}$/),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { date, time } = parsed.data;
    const result = calculateChart(date, time);
    if (!result) {
      return NextResponse.json(
        { error: "Invalid date" },
        { status: 400 }
      );
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
