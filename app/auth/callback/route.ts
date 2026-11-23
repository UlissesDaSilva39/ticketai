import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/auth/ensure-profile";

/**
 * Finishes Google sign-in and email-confirmation links:
 * swaps the one-time code for a session, creates the profile if needed,
 * then sends the user on to `next`.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const role = url.searchParams.get("role");
  const nextParam = url.searchParams.get("next") ?? "/home";
  // Only allow same-site paths, never an external URL.
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/home";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", url.origin));
  }

  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    return NextResponse.redirect(new URL("/login?error=link_expired", url.origin));
  }

  await ensureProfile(supabase, data.user, role);
  return NextResponse.redirect(new URL(next, url.origin));
}
