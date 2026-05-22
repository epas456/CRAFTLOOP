import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { recycleItems } from "@/db/schema";
import { like, or, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const container = searchParams.get("container");

    if (q) {
      const results = await db.select().from(recycleItems).where(
        or(
          like(recycleItems.name, `%${q}%`),
          like(recycleItems.aliases, `%${q}%`)
        )
      ).limit(10);
      return NextResponse.json(results);
    }

    if (container) {
      const results = await db.select().from(recycleItems).where(
        eq(recycleItems.containerColor, container)
      ).limit(20);
      return NextResponse.json(results);
    }

    const all = await db.select().from(recycleItems).limit(30);
    return NextResponse.json(all);
  } catch (err) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
