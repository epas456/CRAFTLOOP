import { NextResponse } from "next/server";
import { MOCK_POSTS } from "@/lib/mock-data";

export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require("better-sqlite3");
    const sqlite = new Database(process.env.DATABASE_URL ?? "./craftloop.db");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { drizzle } = require("drizzle-orm/better-sqlite3");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { posts, users } = require("@/db/schema");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { eq } = require("drizzle-orm");
    const db = drizzle(sqlite, { schema: { posts, users } });
    const rows = await db.select({
      id: posts.id, content: posts.content, images: posts.images, tags: posts.tags,
      likes: posts.likes, comments: posts.comments, createdAt: posts.createdAt,
      authorName: users.name, authorImage: users.image, authorId: posts.authorId,
    }).from(posts).leftJoin(users, eq(posts.authorId, users.id)).limit(30);
    if (Array.isArray(rows) && rows.length > 0) return NextResponse.json(rows);
  } catch { /* fall through */ }
  return NextResponse.json(MOCK_POSTS);
}
