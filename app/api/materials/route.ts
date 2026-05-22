import { NextResponse } from "next/server";
import { MOCK_MATERIALS } from "@/lib/mock-data";

export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require("better-sqlite3");
    const sqlite = new Database(process.env.DATABASE_URL ?? "./craftloop.db");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { drizzle } = require("drizzle-orm/better-sqlite3");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { materials } = require("@/db/schema");
    const db = drizzle(sqlite, { schema: { materials } });
    const rows = await db.select().from(materials).limit(20);
    if (Array.isArray(rows) && rows.length > 0) return NextResponse.json(rows);
  } catch { /* fall through */ }
  return NextResponse.json(MOCK_MATERIALS);
}
