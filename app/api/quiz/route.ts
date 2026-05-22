import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quizQuestions } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const questions = await db.select().from(quizQuestions).orderBy(sql`RANDOM()`).limit(10);
    return NextResponse.json(questions);
  } catch (err) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
