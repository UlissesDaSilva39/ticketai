import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// GET /api/promote/mine: things this member can promote, and which are promoted now.
export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const admin = createAdminClient();
  const now = new Date().toISOString();
  const [posts, listings, lives, promos, profile] = await Promise.all([
    admin.from("posts").select("id, body, created_at").eq("author_id", user.id).order("created_at", { ascending: false }).limit(10),
    admin.from("marketplace_listings").select("id, title, price_pence").eq("seller_id", user.id).eq("status", "active").order("created_at", { ascending: false }).limit(10),
    admin.from("live_streams").select("id, title, status").eq("host_id", user.id).neq("status", "ended").order("created_at", { ascending: false }).limit(5),
    admin.from("promotions").select("kind, ref_id, ends_at").eq("owner_id", user.id).eq("status", "active").gt("ends_at", now),
    admin.from("profiles").select("full_name, username").eq("id", user.id).maybeSingle(),
  ]);
  const activeUntil = new Map((promos.data ?? []).map((p) => [`${p.kind}:${p.ref_id}`, p.ends_at as string]));
  const until = (kind: string, id: string) => activeUntil.get(`${kind}:${id}`) ?? null;
  const name = profile.data?.full_name && !profile.data.full_name.includes("@") ? profile.data.full_name : profile.data?.username ?? "Your profile";

  return NextResponse.json({
    items: [
      { kind: "profile", id: user.id, title: name, sub: "Your profile", promotedUntil: until("profile", user.id) },
      ...(lives.data ?? []).map((l) => ({ kind: "live", id: l.id, title: l.title, sub: l.status === "live" ? "Live now" : "Scheduled live", promotedUntil: until("live", l.id) })),
      ...(listings.data ?? []).map((l) => ({ kind: "listing", id: l.id, title: l.title, sub: `Marketplace · £${(l.price_pence / 100).toFixed(2)}`, promotedUntil: until("listing", l.id) })),
      ...(posts.data ?? []).map((p) => ({ kind: "post", id: p.id, title: String(p.body ?? "").slice(0, 90) || "Photo / video post", sub: `Post · ${new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`, promotedUntil: until("post", p.id) })),
    ],
  });
}
