import { NextResponse, type NextRequest } from "next/server";
import { LOGIN_PATH, SESSION_COOKIE, isProtectedPath } from "@/lib/auth/config";

// Runs before every page request (Next.js 16 calls this file "proxy"; older versions
// called it "middleware"). It is the first of two login gates; see docs/rules/AUTH.md.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isProtectedPath(pathname) && !request.cookies.has(SESSION_COOKIE)) {
    const login = new URL(LOGIN_PATH, request.url);
    login.searchParams.set("next", pathname + search);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  // Skip API routes (they answer with a 401 themselves) and static files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
