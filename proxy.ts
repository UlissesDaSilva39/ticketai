import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/home", "/messages", "/notifications", "/profile"];

function isProtected(pathname: string) {
  return PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

function hasSession(req: NextRequest) {
  const cookies = req.cookies.getAll();
  return cookies.some((c) => {
    const n = c.name;
    return (
      n === "sb-access-token" ||
      n === "sb-refresh-token" ||
      (n.startsWith("sb-") && n.endsWith("-auth-token"))
    );
  });
}

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (!isProtected(pathname)) return NextResponse.next();
  if (hasSession(req)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  url.searchParams.set("next", pathname + search);
  return NextResponse.redirect(url);
}

// Match the exact paths AND their subpaths. Bare "/home" must match.
// Using a broad matcher and filtering inside is the reliable pattern.
export const config = {
  matcher: ["/home", "/home/:path*", "/messages", "/messages/:path*", "/notifications", "/notifications/:path*", "/profile", "/profile/:path*"],
};
