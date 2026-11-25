// Server-only: uses the service-role key. Never import from a client component.
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Server-side admin gate for API routes.
 * Returns { user } when the caller is logged in AND profiles.role = 'admin',
 * otherwise { response } with a 401/403 to return straight away.
 *
 *   const gate = await requireAdmin();
 *   if ("response" in gate) return gate.response;
 */
export async function requireAdmin() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { response: NextResponse.json({ error: "Not signed in" }, { status: 401 }) };
  }

  // Read the role with the service client so RLS on profiles can't hide it.
  const { data: profile } = await createAdminClient()
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return { response: NextResponse.json({ error: "Admins only" }, { status: 403 }) };
  }
  return { user };
}

/** Same check for proxy/pages: true only for a logged-in admin. */
export async function isAdmin(userId: string) {
  const { data } = await createAdminClient()
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  return data?.role === "admin";
}
