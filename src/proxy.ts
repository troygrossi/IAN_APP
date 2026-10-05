import { NextResponse, type NextRequest } from "next/server";
import { LOGIN_PATH, SESSION_COOKIE, isProtectedPath } from "@/lib/auth/config";

// Runs before every request (Next.js 16 calls this file "proxy"; older versions
// called it "middleware"). It does two cheap checks; see docs/rules/AUTH.md.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    // A request that changes data must come from our own pages. A browser always says
    // where a POST came from, so another site cannot use a visitor's session against them.
    // Webhooks come from servers, not browsers, and prove themselves with a signature instead.
    const changesData = !["GET", "HEAD", "OPTIONS"].includes(request.method);
    const origin = request.headers.get("origin");
    if (changesData && origin && !pathname.startsWith("/api/webhooks/") && new URL(origin).host !== request.headers.get("host")) {
      return NextResponse.json(
        { ok: false, error: { code: "bad-input", message: "This request came from another site and was refused." } },
        { status: 403 },
      );
    }
    return NextResponse.next();
  }

  // The first of two login gates. It only sees that a cookie exists; the (app)
  // layout checks that the session is real.
  if (isProtectedPath(pathname) && !request.cookies.has(SESSION_COOKIE)) {
    const login = new URL(LOGIN_PATH, request.url);
    login.searchParams.set("next", pathname + search);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  // Skip Next.js's own files and anything with a file extension (images, icons, robots.txt).
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
