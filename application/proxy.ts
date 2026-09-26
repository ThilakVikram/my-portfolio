import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Optimistic check only: it verifies the signed session cookie's shape, not
// the database. Pages and actions confirm the session for real with
// getCurrentUser()/isAdmin() (see app/_auth/session.ts).
//
// /auth/login and /auth/signin deliberately do NOT redirect an "optimistically
// signed in" visitor away here — that decision needs the authoritative check,
// which those pages do themselves. Doing it here (based on cookie presence
// alone) is what used to trap visitors at "/" whenever the DB session was
// gone but the browser still held the cookie.
const PUBLIC = new Set(["/", "/api/personal_assistant", "/auth/login", "/auth/signin"]);

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  // better-auth's own routes (sign-in, sign-up, session refresh, ...) have to
  // be reachable while signed out - that's how signing in happens.
  if (pathname.startsWith("/api/auth/")) return NextResponse.next();
  if (PUBLIC.has(pathname) || getSessionCookie(request)) return NextResponse.next();

  if (pathname.startsWith("/api/")) return Response.json({ error: "Sign in required." }, { status: 401 });
  const login = new URL("/auth/login", request.url);
  login.searchParams.set("next", pathname + search);
  return NextResponse.redirect(login);
}

export const config = {
  // Skip Next internals and static files in public/.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
