import { NextRequest, NextResponse } from "next/server";
import { MOCK_CRAFTS } from "@/lib/mock-data";

function getDb() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require("better-sqlite3");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { drizzle } = require("drizzle-orm/better-sqlite3");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const schema = require("@/db/schema");
    const sqlite = new Database(process.env.DATABASE_URL ?? "./craftloop.db");
    return drizzle(sqlite, { schema });
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase();
  const category = searchParams.get("category");
  const difficulty = searchParams.get("difficulty");

  try {
    const db = getDb();
    if (db) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { crafts, users } = require("@/db/schema");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { eq, like, and } = require("drizzle-orm");

      let query = db.select({
        id: crafts.id, title: crafts.title, description: crafts.description,
        image: crafts.image, category: crafts.category, difficulty: crafts.difficulty,
        timeMinutes: crafts.timeMinutes, materials: crafts.materials, likes: crafts.likes,
        saves: crafts.saves, views: crafts.views, tags: crafts.tags,
        authorId: crafts.authorId, createdAt: crafts.createdAt,
        authorName: users.name, authorImage: users.image,
      }).from(crafts).leftJoin(users, eq(crafts.authorId, users.id));

      const conditions = [];
      if (q) conditions.push(like(crafts.title, `%${q}%`));
      if (category && category !== "Todos") conditions.push(eq(crafts.category, category));
      if (difficulty && difficulty !== "Todos") conditions.push(eq(crafts.difficulty, difficulty));

      const rows = conditions.length > 0
        ? await query.where(and(...conditions)).limit(50)
        : await query.limit(50);

      if (Array.isArray(rows) && rows.length > 0) {
        return NextResponse.json(rows);
      }
    }
  } catch { /* fall through to mock */ }

  // Fallback: mock data
  let data = MOCK_CRAFTS;
  if (q) data = data.filter(c => c.title.toLowerCase().includes(q));
  if (category && category !== "Todos") data = data.filter(c => c.category === category);
  if (difficulty && difficulty !== "Todos") data = data.filter(c => c.difficulty === difficulty);
  return NextResponse.json(data);
}
