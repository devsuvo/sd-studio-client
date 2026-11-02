import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Must match TOKEN_COOKIE in the Express auth middleware.
const TOKEN_COOKIE = "ss_token";

const cookieOptions = {
  httpOnly: true, // JavaScript can never read the token, so XSS can't steal it
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

// POST /api/session-token — swaps the BetterAuth session for a short-lived JWT stored in an HttpOnly cookie.
export async function POST() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session) {
    const res = NextResponse.json({ message: "Please log in to continue." }, { status: 401 });
    res.cookies.set(TOKEN_COOKIE, "", { ...cookieOptions, maxAge: 0 });
    return res;
  }
  const { token } = await auth.api.getToken({ headers: requestHeaders });
  const res = NextResponse.json({ ok: true });
  // The JWT itself expires after 15 minutes; drop the cookie a little earlier so it's refreshed in time.
  res.cookies.set(TOKEN_COOKIE, token, { ...cookieOptions, maxAge: 14 * 60 });
  return res;
}

// DELETE /api/session-token — clears the cookie on logout or account switch.
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(TOKEN_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return res;
}
