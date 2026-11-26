import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { UUID, currentUser } from "@/lib/newsletters/server";

export const dynamic = "force-dynamic";

// POST /api/articles { newsletterId? }: start a draft (individual article or a newsletter edition).
export async function POST(req: NextRequest) {
  const { user } = await currentUser();
  if (!user) return NextResponse.json({ error: "Please log in to write an article." }, { status: 401 });
  if (!rateLimit(`article-new:${user.id}`, 30, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Too many drafts. Try again later." }, { status: 429 });
  }

  const b = await req.json().catch(() => ({}));
  const admin = createAdminClient();
  let newsletterId: string | null = null;
  if (typeof b.newsletterId === "string" && UUID.test(b.newsletterId)) {
    const { data: nl } = await admin.from("newsletters").select("id, owner_id").eq("id", b.newsletterId).maybeSingle();
    if (!nl || nl.owner_id !== user.id) return NextResponse.json({ error: "That newsletter isn't yours." }, { status: 403 });
    newsletterId = nl.id;
  }

  const { data, error } = await admin.from("articles").insert({ author_id: user.id, newsletter_id: newsletterId }).select("id").single();
  if (error || !data) {
    console.error("[articles POST]", error?.message);
    return NextResponse.json({ error: "Newsletters are being set up. Please try again soon." }, { status: 500 });
  }
  return NextResponse.json({ id: data.id });
}
