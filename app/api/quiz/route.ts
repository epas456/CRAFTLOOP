import { NextResponse } from "next/server";
import { MOCK_QUIZ } from "@/lib/mock-data";

export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require("better-sqlite3");
    const sqlite = new Database(process.env.DATABASE_URL ?? "./craftloop.db");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { drizzle } = require("drizzle-orm/better-sqlite3");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { quizQuestions } = require("@/db/schema");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { sql } = require("drizzle-orm");
    const db = drizzle(sqlite, { schema: { quizQuestions } });
    const rows = await db.select().from(quizQuestions).orderBy(sql`RANDOM()`).limit(10);
    if (Array.isArray(rows) && rows.length > 0) return NextResponse.json(rows);
  } catch { /* fall through */ }
  // Shuffle mock data
  const shuffled = [...MOCK_QUIZ].sort(() => Math.random() - 0.5).slice(0, 10);
  return NextResponse.json(shuffled);
}
