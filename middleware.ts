import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_PREFIXES = [
  "/my-tickets",
  "/venue/dashboard",
  "/organizer",
  "/promoter",
  "/promoter/dashboard",
  "/admin",
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const ref = request.nextUrl.searchParams.get("ref");
  const origin = request.nextUrl.origin;

  const needsAuth = PROTECTED_PREFIXES.some(
    (p) => path === p || path.startsWith(p + "/")
  );

  const response = NextResponse.next();

  if (ref) {
    response.cookies.set("referral_code", ref, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    });

    fetch(origin + "/api/promoter/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ referralCode: ref }),
    }).catch(() => {});
  }

  if (!needsAuth) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(
    "[middleware]",
    path,
    "needsAuth=" + needsAuth,
    "user=" + (user?.email || "none")
  );

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};