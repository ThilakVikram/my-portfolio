import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/_auth/session"
import LoginForm from "./LoginForm"

// Authoritative check: proxy.ts only looks at the (unvalidated) session
// cookie, so an already-signed-in visitor is confirmed for real here rather
// than being bounced away by middleware alone.
export default async function Login({ searchParams }: PageProps<"/auth/login">) {
    const next = (await searchParams).next
    if (await getCurrentUser(true)) redirect("/")
    return <LoginForm next={typeof next === "string" ? next : "/"} />
}
