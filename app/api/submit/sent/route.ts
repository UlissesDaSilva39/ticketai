import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { refundOverdue } from "@/lib/submissions/server";

export const dynamic = "force-dynamic";

// GET /api/submit/sent: what I've sent and the replies.
export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  await refundOverdue().catch(() => 0);
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("submissions")
    .select("id, kind, reviewer_id, title, track_url, message, amount_pence, status, verdict, reply, paid_at, due_at, replied_at")
    .eq("sender_id", user.id)
    .in("status", ["sent", "replied", "refunded"])
    .order("paid_at", { ascending: false })
    .limit(100);
  if (error) return NextResponse.json({ items: [], setupPending: true });
  const ids = [...new Set((data ?? []).map((d) => d.reviewer_id))];
  const { data: people } = ids.length ? await admin.from("profiles").select("id, full_name, username").in("id", ids) : { data: [] as { id: string; full_name: string | null; username: string | null }[] };
  const byId = new Map((people ?? []).map((p) => [p.id, p]));
  return NextResponse.json({
    items: (data ?? []).map((d) => {
      const p = byId.get(d.reviewer_id);
      return { ...d, reviewer: { name: p?.full_name && !p.full_name.includes("@") ? p.full_name : p?.username ?? "GRID member", username: p?.username ?? null } };
    }),
  });
}
