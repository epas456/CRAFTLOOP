import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { materials } from "@/db/schema";

export async function GET() {
  try {
    const all = await db.select().from(materials).limit(20);
    return NextResponse.json(all);
  } catch (err) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
