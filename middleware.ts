import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const SECRET = process.env.NEXTAUTH_SECRET ?? "craftloop-dev-secret-2026";

// Pages that don't need a session
const PUBLIC = ["/login", "/api/", "/_next/", "/favicon", "/uploads"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths through
  if (PUBLIC.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check JWT token (works on Vercel without NEXTAUTH_URL)
  const token = await getToken({ req, secret: SECRET });

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|uploads).*)"],
};
