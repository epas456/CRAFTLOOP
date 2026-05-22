import { NextRequest, NextResponse } from "next/server";
import { MOCK_RECYCLE } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase();
  const container = searchParams.get("container");

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require("better-sqlite3");
    const sqlite = new Database(process.env.DATABASE_URL ?? "./craftloop.db");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { drizzle } = require("drizzle-orm/better-sqlite3");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { recycleItems } = require("@/db/schema");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { like, or, eq } = require("drizzle-orm");
    const db = drizzle(sqlite, { schema: { recycleItems } });

    let rows;
    if (q) {
      rows = await db.select().from(recycleItems).where(or(like(recycleItems.name, `%${q}%`), like(recycleItems.aliases, `%${q}%`))).limit(10);
    } else if (container) {
      rows = await db.select().from(recycleItems).where(eq(recycleItems.containerColor, container)).limit(20);
    } else {
      rows = await db.select().from(recycleItems).limit(30);
    }
    if (Array.isArray(rows) && rows.length > 0) return NextResponse.json(rows);
  } catch { /* fall through */ }

  // Fallback mock
  let data = MOCK_RECYCLE;
  if (q) data = data.filter(r => r.name.toLowerCase().includes(q) || r.aliases.toLowerCase().includes(q));
  if (container) data = data.filter(r => r.containerColor === container);
  return NextResponse.json(data);
}
