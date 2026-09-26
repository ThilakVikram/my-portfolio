import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/_auth/session"
import SigninForm from "./SigninForm"

// Authoritative check: proxy.ts only looks at the (unvalidated) session
// cookie, so an already-signed-in visitor is confirmed for real here rather
// than being bounced away by middleware alone.
export default async function Signin({ searchParams }: PageProps<"/auth/signin">) {
    const next = (await searchParams).next
    if (await getCurrentUser(true)) redirect("/")
    return <SigninForm next={typeof next === "string" ? next : "/"} />
}
