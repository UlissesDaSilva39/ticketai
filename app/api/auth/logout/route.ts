import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

const LEGACY_COOKIE = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME ?? "ticketai_session";

export async function POST() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();

  const res = NextResponse.json({ data: { ok: true } });
  // Clear the old placeholder cookie from before real login existed.
  res.cookies.set(LEGACY_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
