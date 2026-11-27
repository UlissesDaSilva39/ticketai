import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET /api/submit/reviewers?genre=House: people accepting paid demos/messages.
export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const genre = req.nextUrl.searchParams.get("genre");
  const admin = createAdminClient();
  let q = admin.from("reviewers").select("user_id, headline, genres, accepts_demos, accepts_messages").eq("active", true).limit(100);
  if (genre) q = q.contains("genres", [genre]);
  const { data, error } = await q;
  if (error) return NextResponse.json({ reviewers: [], setupPending: true });
  const ids = (data ?? []).map((r) => r.user_id);
  const [{ data: profiles }, { data: answered }] = await Promise.all([
    ids.length ? admin.from("profiles").select("id, full_name, username, avatar_url, role, city").in("id", ids) : Promise.resolve({ data: [] as { id: string; full_name: string | null; username: string | null; avatar_url: string | null; role: string | null; city: string | null }[] }),
    ids.length ? admin.from("submissions").select("reviewer_id, status").in("reviewer_id", ids).in("status", ["replied", "refunded"]) : Promise.resolve({ data: [] as { reviewer_id: string; status: string }[] }),
  ]);
  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
  const stats = new Map<string, { replied: number; total: number }>();
  for (const s of answered ?? []) {
    const t = stats.get(s.reviewer_id) ?? { replied: 0, total: 0 };
    t.total++;
    if (s.status === "replied") t.replied++;
    stats.set(s.reviewer_id, t);
  }
  return NextResponse.json({
    reviewers: (data ?? [])
      .filter((r) => r.user_id !== user?.id && byId.has(r.user_id))
      .map((r) => {
        const p = byId.get(r.user_id)!;
        const st = stats.get(r.user_id);
        return {
          id: r.user_id,
          name: p.full_name && !p.full_name.includes("@") ? p.full_name : p.username ?? "GRID member",
          username: p.username,
          avatar: p.avatar_url,
          role: p.role,
          city: p.city,
          headline: r.headline,
          genres: r.genres ?? [],
          acceptsDemos: r.accepts_demos,
          acceptsMessages: r.accepts_messages,
          replyRate: st && st.total >= 3 ? Math.round((st.replied / st.total) * 100) : null,
          replies: st?.replied ?? 0,
        };
      })
      .sort((a, b) => b.replies - a.replies),
  });
}
