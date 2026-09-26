import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/app/_auth/auth";

export type CurrentUser = { id: string; email: string; userName: string; name: string; isAdmin: boolean };

// Cached per request. Pass `fresh` to bypass the signed session-cookie cache
// for an authoritative DB read — needed wherever a stale cache would matter,
// e.g. deciding whether to bounce an already-signed-in visitor away from
// /auth/login (see app/auth/login/page.tsx).
export const getCurrentUser = cache(async (fresh = false): Promise<CurrentUser | null> => {
  const result = await auth.api.getSession({
    headers: await headers(),
    query: fresh ? { disableCookieCache: true } : undefined,
  });
  if (!result) return null;
  const { user } = result;
  return { id: user.id, email: user.email, userName: user.username ?? "", name: user.name, isAdmin: user.isAdmin ?? false };
});

// Authorization is a sensitive check (it gates /admin and every admin Server
// Action), so it always goes fresh rather than trusting the signed-cookie
// cache for up to its 5-minute window.
export async function isAdmin() {
  return !!(await getCurrentUser(true))?.isAdmin;
}

// For pages: sends signed-out visitors to the login page.
export async function requireUser(next = "/") {
  const user = await getCurrentUser(true);
  if (!user) redirect(`/auth/login?next=${encodeURIComponent(next)}`);
  return user;
}
