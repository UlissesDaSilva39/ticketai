import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get("ref");
  const response = NextResponse.next();

  if (ref) {
    response.cookies.set("referral_code", ref, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    });

    // Fire-and-forget click tracking
    const origin = request.nextUrl.origin;
    fetch(origin + "/api/promoter/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ referralCode: ref }),
    }).catch(() => {});
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
}
