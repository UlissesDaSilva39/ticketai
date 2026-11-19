import { NextResponse } from "next/server";

const COOKIE = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME ?? "ticketai_session";

export async function POST() {
  const res = NextResponse.json({ data: { ok: true } });
  res.cookies.set(COOKIE, "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}