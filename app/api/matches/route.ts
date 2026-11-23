import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { isOpen, scoreOpportunity, type Opportunity } from "@/lib/matching";

export const dynamic = "force-dynamic";

// GET /api/matches            -> open opportunities ranked for the logged-in user
// GET /api/matches?category=collab&limit=3 -> newest open ones in a category (Open Collabs)
export async function GET(req: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ matches: [], profile: null });

  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "6", 10) || 6, 1), 20);

  const [{ data: me }, { data: rows, error }] = await Promise.all([
    supabase.from("profiles").select("role, city, genre").eq("id", user.id).maybeSingle(),
    (() => {
      let q = supabase
        .from("opportunities")
        .select("id, title, org, category, location, remote, compensation, description, deadline, created_by, created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      if (category) q = q.eq("category", category);
      return q;
    })(),
  ]);
  if (error) return NextResponse.json({ error: "Could not load opportunities" }, { status: 500 });

  const profile = { role: me?.role ?? null, city: me?.city ?? null, genre: me?.genre ?? null };
  const now = Date.now();
  const open = ((rows ?? []) as Opportunity[]).filter((o) => isOpen(o, now) && o.created_by !== user.id);

  const matches = category
    ? open.slice(0, limit).map((o) => scoreOpportunity(o, profile, now)) // newest first
    : open.map((o) => scoreOpportunity(o, profile, now)).sort((a, b) => b.score - a.score).slice(0, limit);

  // The poster's id is only used server-side for Apply; don't hand it out.
  return NextResponse.json({
    profile,
    matches: matches.map(({ created_by, description, ...m }) => ({
      ...m,
      canApply: !!created_by,
      summary: description ? description.slice(0, 160) : null,
    })),
  });
}
