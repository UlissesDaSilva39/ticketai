import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Google (OAuth) and email-confirmation links land here with a one-time ?code=.
// We swap it for a session cookie, make sure a profile row exists, then redirect.
function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/home";
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));
  const roleParam = url.searchParams.get("role");
  const role = roleParam === "industry" || roleParam === "artist" ? roleParam : "fan";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", url.origin));
  }

  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    return NextResponse.redirect(new URL("/login?error=auth_failed", url.origin));
  }

  const user = data.user;
  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!existing) {
    const meta = user.user_metadata ?? {};
    const full_name: string = meta.full_name || meta.name || user.email?.split("@")[0] || "";
    const base =
      (meta.username || full_name || user.email?.split("@")[0] || "user")
        .toLowerCase()
        .replace(/[^a-z0-9_.-]+/g, "")
        .slice(0, 24) || "user";
    const username = `${base}${Math.floor(1000 + Math.random() * 9000)}`;

    const { error: profileError } = await admin.from("profiles").upsert(
      {
        id: user.id,
        username,
        full_name,
        role: meta.role === "industry" || meta.role === "artist" ? meta.role : role,
        is_public: true,
      },
      { onConflict: "id" }
    );
    if (profileError) console.error("[auth/callback] profile upsert failed:", profileError);
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
