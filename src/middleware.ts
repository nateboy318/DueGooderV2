import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const isAuth = !!token
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/sign-in") ||
    req.nextUrl.pathname.startsWith("/sign-up")

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/app", req.url))
    }
    return null
  }

  if (!isAuth) {
    let from = req.nextUrl.pathname
    if (req.nextUrl.search) {
      from += req.nextUrl.search
    }

    return NextResponse.redirect(
      new URL(`/sign-in?from=${encodeURIComponent(from)}`, req.url)
    )
  }
}

export const config = {
  matcher: ["/app/:path*", "/sign-in", "/sign-up"],
} 