import { NextResponse } from "next/server";
import { auth } from "./auth";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await auth();
  const isAuth = !!session?.user;

  const isAuthPage =
    req.nextUrl.pathname.startsWith("/sign-in") ||
    req.nextUrl.pathname.startsWith("/sign-up") ||
    req.nextUrl.pathname.startsWith("/sign-out");

  if (isAuthPage) {
    if (isAuth && !req.nextUrl.pathname.startsWith("/sign-out")) {
      return NextResponse.redirect(new URL("/app", req.url));
    }
    return NextResponse.next();
  }

  if (!isAuth) {
    let callbackUrl = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      callbackUrl += req.nextUrl.search;
    }

    return NextResponse.redirect(
      new URL(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`, req.url)
    );
  }
}

export const config = {
  matcher: ["/app/:path*", "/sign-in", "/sign-up", "/sign-out"],
};
