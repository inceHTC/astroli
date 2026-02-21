import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookie } from "@/lib/auth";
import {
  getCosmicEnergyForWeek,
  getCosmicEnergyAvailableWeeks,
  upsertCosmicEnergy,
  type CosmicEnergyData,
} from "@/lib/db/repositories/cosmicEnergy";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const list = searchParams.get("list");
    if (list === "weeks") {
      const weeks = await getCosmicEnergyAvailableWeeks(52);
      return NextResponse.json(weeks);
    }

    const weekStartStr = searchParams.get("weekStart");
    const date = weekStartStr ? new Date(weekStartStr) : new Date();
    const data = await getCosmicEnergyForWeek(date);
    if (!data) {
      return NextResponse.json(null);
    }
    return NextResponse.json({
      weekStart: data.weekStart.toISOString().slice(0, 10),
      weekEnd: data.weekEnd.toISOString().slice(0, 10),
      generalEnergy: data.generalEnergy,
      elementFire: data.elementFire,
      elementEarth: data.elementEarth,
      elementAir: data.elementAir,
      elementWater: data.elementWater,
      planetMercury: data.planetMercury,
      planetVenus: data.planetVenus,
      planetMars: data.planetMars,
      advice: data.advice,
      overviewFire: data.overviewFire,
      overviewEarth: data.overviewEarth,
      overviewAir: data.overviewAir,
      overviewWater: data.overviewWater,
    });
  } catch (error) {
    console.error("GET cosmic-energy error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

type Body = {
  weekStart?: string;
  weekEnd?: string;
} & CosmicEnergyData;

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as Body;
    const {
      weekStart: weekStartStr,
      weekEnd: weekEndStr,
      generalEnergy = "",
      elementFire = "",
      elementEarth = "",
      elementAir = "",
      elementWater = "",
      planetMercury = "",
      planetVenus = "",
      planetMars = "",
      advice = "",
      overviewFire = "",
      overviewEarth = "",
      overviewAir = "",
      overviewWater = "",
    } = body;

    if (!weekStartStr || !weekEndStr) {
      return NextResponse.json({ error: "weekStart ve weekEnd gerekli" }, { status: 400 });
    }

    const weekStart = new Date(weekStartStr);
    const weekEnd = new Date(weekEndStr);
    await upsertCosmicEnergy(weekStart, weekEnd, {
      generalEnergy,
      elementFire,
      elementEarth,
      elementAir,
      elementWater,
      planetMercury,
      planetVenus,
      planetMars,
      advice,
      overviewFire,
      overviewEarth,
      overviewAir,
      overviewWater,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST cosmic-energy error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
