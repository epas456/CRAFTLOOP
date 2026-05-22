import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { crafts, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const result = await db.select({
      id: crafts.id,
      title: crafts.title,
      description: crafts.description,
      image: crafts.image,
      category: crafts.category,
      difficulty: crafts.difficulty,
      timeMinutes: crafts.timeMinutes,
      ageGroup: crafts.ageGroup,
      materials: crafts.materials,
      steps: crafts.steps,
      likes: crafts.likes,
      saves: crafts.saves,
      views: crafts.views,
      tags: crafts.tags,
      authorName: users.name,
      authorImage: users.image,
      authorId: crafts.authorId,
    })
    .from(crafts)
    .leftJoin(users, eq(crafts.authorId, users.id))
    .where(eq(crafts.id, id))
    .get();

    if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
