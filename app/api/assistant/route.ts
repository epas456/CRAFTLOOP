import { NextResponse } from "next/server";

// AI assistant is currently disabled
export async function POST() {
  return NextResponse.json(
    { error: "El asistente IA está desactivado temporalmente." },
    { status: 503 }
  );
}
