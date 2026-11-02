import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

// Fast cookie check before private pages render. The full session check
// happens client-side in <AuthGuard>, so a stale cookie can't cause a redirect loop.
export function proxy(request: NextRequest) {
  if (!getSessionCookie(request)) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/add-studio", "/my-listings", "/my-bookings", "/saved", "/studios/edit/:path*"],
};
