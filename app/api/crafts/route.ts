import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { crafts, users } from "@/db/schema";
import { like, eq, and, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const material = searchParams.get("material");

    let query = db.select({
      id: crafts.id,
      title: crafts.title,
      description: crafts.description,
      image: crafts.image,
      category: crafts.category,
      difficulty: crafts.difficulty,
      timeMinutes: crafts.timeMinutes,
      materials: crafts.materials,
      likes: crafts.likes,
      saves: crafts.saves,
      views: crafts.views,
      tags: crafts.tags,
      authorId: crafts.authorId,
      createdAt: crafts.createdAt,
      authorName: users.name,
      authorImage: users.image,
    })
    .from(crafts)
    .leftJoin(users, eq(crafts.authorId, users.id));

    const conditions = [];
    if (q) conditions.push(like(crafts.title, `%${q}%`));
    if (category && category !== "Todos") conditions.push(eq(crafts.category, category));
    if (difficulty && difficulty !== "Todos") conditions.push(eq(crafts.difficulty, difficulty));

    const results = conditions.length > 0
      ? await query.where(and(...conditions)).limit(50)
      : await query.limit(50);

    return NextResponse.json(results);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error fetching crafts" }, { status: 500 });
  }
}
