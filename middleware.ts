export { default } from "next-auth/middleware";

export const config = {
  // Protect all routes EXCEPT api, _next, static assets, and login
  matcher: [
    "/((?!api|_next/static|_next/image|favicon|login|_next).*)",
  ],
};
