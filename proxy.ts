import { NextResponse } from "next/server";
import { isPublicPath } from "@/lib/access";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";

async function isAdmin(userId: string) {
  const { data } = await createAdminClient()
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  return data?.role === "admin";
}

// Next.js 16: this file replaces middleware.ts (same behaviour, new name).
const IS_PROD = process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_ENV === "production";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_WS = SUPABASE_URL.replace(/^http/, "ws");

// Content-Security-Policy: only our own scripts plus Stripe; embeds limited to the
// players we use. 'unsafe-inline' is needed for Next's inline bootstrap scripts
// (a nonce-based policy would be the next step up); 'unsafe-eval' only in dev.
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${IS_PROD ? "" : " 'unsafe-eval'"} https://js.stripe.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  `connect-src 'self' ${SUPABASE_URL} ${SUPABASE_WS} https://api.stripe.com${IS_PROD ? "" : " ws: wss:"}`,
  "frame-src https://open.spotify.com https://www.youtube.com https://www.youtube-nocookie.com https://player.twitch.tv https://w.soundcloud.com https://js.stripe.com https://hooks.stripe.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(IS_PROD ? ["upgrade-insecure-requests"] : []),
].join("; ");

// Which pages need login is decided by the allow list in lib/access.ts:
// marketing, account, legal and shared links are public; everything else,
// including any page added later, sends logged-out visitors to /login.

function matches(pathname: string, paths: string[]) {
  return paths.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function withSecurityHeaders(res: NextResponse) {
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set("Content-Security-Policy", CSP);
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  if (IS_PROD) {
    res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
  return res;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  let res = NextResponse.next({ request: req });

  // Refresh the Supabase session on every page request so server components
  // (which can't write cookies) always see a valid, non-expired session.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isPublicPath(pathname)) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return withSecurityHeaders(NextResponse.redirect(loginUrl));
  }

  // Admin area: logged in is not enough, the profile must have role = 'admin'.
  if (user && matches(pathname, ["/admin"]) && !(await isAdmin(user.id))) {
    return withSecurityHeaders(NextResponse.redirect(new URL("/unauthorized", req.url)));
  }

  return withSecurityHeaders(res);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
