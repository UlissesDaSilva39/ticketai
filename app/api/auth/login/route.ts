import { NextResponse } from "next/server";

const COOKIE = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME ?? "ticketai_session";

export async function POST(req: Request) {
  let body: { email?: string; password?: string } = {};
  try { body = await req.json(); } catch {
    return NextResponse.json({ message: "Bad JSON" }, { status: 400 });
  }
  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ message: "Email and password required" }, { status: 400 });
  }

  const token = "dev-" + Date.now();
  const res = NextResponse.json({ data: { user: { email, name: String(email).split("@")[0] } } });

  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 86400,
  });

  return res;
}