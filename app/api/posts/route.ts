import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const results = await db.select({
      id: posts.id,
      content: posts.content,
      images: posts.images,
      tags: posts.tags,
      likes: posts.likes,
      comments: posts.comments,
      createdAt: posts.createdAt,
      authorName: users.name,
      authorImage: users.image,
      authorId: posts.authorId,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .limit(30);

    return NextResponse.json(results);
  } catch (err) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
