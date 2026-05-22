import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    secret: process.env.NEXTAUTH_SECRET ?? "craftloop-dev-secret-2026",
    pages: { signIn: "/login" },
    callbacks: {
      authorized({ token }) {
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // Protect all app routes except login, api, static assets
    "/((?!login|api|_next/static|_next/image|favicon|uploads).*)",
  ],
};
