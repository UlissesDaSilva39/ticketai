import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { UUID, currentUser } from "@/lib/newsletters/server";

export const dynamic = "force-dynamic";

// POST /api/newsletters/<id>/subscribe { subscribe: boolean }
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await currentUser();
  if (!user) return NextResponse.json({ error: "Please log in to subscribe." }, { status: 401 });
  if (!UUID.test(id)) return NextResponse.json({ error: "Newsletter not found." }, { status: 404 });
  if (!rateLimit(`newsletter-sub:${user.id}`, 60, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const admin = createAdminClient();
  const { data: nl } = await admin.from("newsletters").select("id, owner_id, status").eq("id", id).maybeSingle();
  if (!nl || nl.status !== "active") return NextResponse.json({ error: "Newsletter not found." }, { status: 404 });
  if (nl.owner_id === user.id) return NextResponse.json({ error: "You can't subscribe to your own newsletter." }, { status: 400 });

  const { subscribe } = await req.json().catch(() => ({ subscribe: true }));
  if (subscribe === false) {
    await admin.from("newsletter_subscriptions").delete().eq("newsletter_id", id).eq("user_id", user.id);
  } else {
    await admin.from("newsletter_subscriptions").upsert({ newsletter_id: id, user_id: user.id }, { onConflict: "newsletter_id,user_id" });
  }
  const { count } = await admin.from("newsletter_subscriptions").select("user_id", { count: "exact", head: true }).eq("newsletter_id", id);
  return NextResponse.json({ subscribed: subscribe !== false, subscribers: count ?? 0 });
}
