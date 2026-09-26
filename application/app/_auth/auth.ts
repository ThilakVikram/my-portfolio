import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { prisma } from "@/database/lib/prisma";
import { MAX_PASSWORD } from "@/app/_auth/validation";

// nextCookies() must be last: it applies the Set-Cookie headers better-auth
// produces to the response of whatever Server Action called auth.api.*.
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "mysql" }),
  emailAndPassword: { enabled: true, minPasswordLength: 8, maxPasswordLength: MAX_PASSWORD },
  user: {
    additionalFields: {
      isAdmin: { type: "boolean", required: false, defaultValue: false, input: false },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },
  plugins: [username({ displayUsername: false }), nextCookies()],
});
