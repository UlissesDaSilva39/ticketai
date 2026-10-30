import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const TIER_2_PREFIXES = [
  "/wallet",
  "/my-tickets",
  "/messages",
  "/feed",
  "/people",
  "/following",
  "/network",
  "/connections",
  "/friends",
  "/profile",
  "/settings",
  "/business",
  "/admin",
  "/organizer",
  "/promoter",
  "/venue",
  "/label",
  "/artist/dashboard",
  "/dashboard",
];

function isTier2(pathname: string): boolean {
  return TIER_2_PREFIXES.some(p => pathname === p || pathname.startsWith(p + "/"));
}

// Everything that should never hit Supabase in middleware
function isStaticOrInternal(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/__nextjs") ||
    pathname.startsWith("/api/") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  );
}

function isPublic(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/waitlist" ||
    pathname === "/join" ||
    pathname.startsWith("/discover") ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/music") ||
    (pathname.startsWith("/artist/") && !pathname.startsWith("/artist/dashboard")) ||
    pathname.startsWith("/artists") ||
    pathname.startsWith("/venues") ||
    pathname.startsWith("/events") ||
    pathname.startsWith("/event/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Static and internal assets — allow immediately, no Supabase
  if (isStaticOrInternal(pathname)) {
    return NextResponse.next();
  }

  // 2. Public pages — allow immediately, no Supabase
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // 3. Only routes that need authentication create a Supabase client
  try {
    const response = NextResponse.next();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // Admin bypass
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role === "admin") return response;

    // Waitlist check
    const { data: entry } = await supabase
      .from("waitlist")
      .select("status")
      .eq("user_id", user.id)
      .maybeSingle();

    const status = entry?.status || "pending";

    if (status === "approved") return response;

    if (isTier2(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/waitlist";
      return NextResponse.redirect(url);
    }

    return response;
  } catch (error) {
    // If middleware fails for any reason, allow the request through.
    // The page's own auth check (or lack of one) will handle it.
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};