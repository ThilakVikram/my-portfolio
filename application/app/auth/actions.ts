"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APIError } from "better-auth";
import { auth } from "@/app/_auth/auth";
import { MAX_PASSWORD, checkEmail, checkPassword, checkUserName, normalizeEmail } from "@/app/_auth/validation";

export type AuthState = { error: string } | null;

// Only same-site paths, so ?next= can't send people to another site.
function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : "/";
}

export async function signup(_: AuthState, formData: FormData): Promise<AuthState> {
  const userName = String(formData.get("user_name") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("c_password") ?? "");

  const invalid = checkUserName(userName) ?? checkEmail(email) ?? checkPassword(password);
  if (invalid) return { error: invalid };
  if (password !== confirm) return { error: "Passwords don't match." };

  try {
    await auth.api.signUpEmail({ body: { name: userName, email, password, username: userName } });
  } catch (e) {
    if (e instanceof APIError) return { error: e.message };
    console.error("Failed to create user", e);
    return { error: "Could not create your account. Please try again." };
  }
  redirect(safeNext(formData.get("next")));
}

export async function login(_: AuthState, formData: FormData): Promise<AuthState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!identifier || !password || password.length > MAX_PASSWORD) return { error: "Wrong user name/email or password." };

  try {
    if (identifier.includes("@")) {
      await auth.api.signInEmail({ body: { email: identifier, password } });
    } else {
      // The username plugin has no combined identifier endpoint.
      await auth.api.signInUsername({ body: { username: identifier, password } });
    }
  } catch (e) {
    if (e instanceof APIError) return { error: "Wrong user name/email or password." };
    throw e;
  }
  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/auth/login");
}
