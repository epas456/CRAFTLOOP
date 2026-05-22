import { NextRequest, NextResponse } from "next/server";
import { MOCK_CRAFTS } from "@/lib/mock-data";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require("better-sqlite3");
    const sqlite = new Database(process.env.DATABASE_URL ?? "./craftloop.db");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { drizzle } = require("drizzle-orm/better-sqlite3");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { crafts, users } = require("@/db/schema");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { eq } = require("drizzle-orm");
    const db = drizzle(sqlite, { schema: { crafts, users } });

    const result = await db.select({
      id: crafts.id, title: crafts.title, description: crafts.description,
      image: crafts.image, category: crafts.category, difficulty: crafts.difficulty,
      timeMinutes: crafts.timeMinutes, ageGroup: crafts.ageGroup,
      materials: crafts.materials, steps: crafts.steps, likes: crafts.likes,
      saves: crafts.saves, views: crafts.views, tags: crafts.tags,
      authorName: users.name, authorImage: users.image, authorId: crafts.authorId,
    }).from(crafts).leftJoin(users, eq(crafts.authorId, users.id)).where(eq(crafts.id, id)).get();

    if (result) return NextResponse.json(result);
  } catch { /* fall through */ }

  // Fallback mock
  const craft = MOCK_CRAFTS.find(c => c.id === id);
  if (!craft) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...craft, ageGroup: "todos", steps: craft.steps });
}
