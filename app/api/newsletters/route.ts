import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { isCategory, isFrequency, slugify } from "@/lib/newsletters/format";
import { MAX_NEWSLETTERS_PER_MEMBER, currentUser, ownCoverUrl } from "@/lib/newsletters/server";

export const dynamic = "force-dynamic";

// POST /api/newsletters { name, description, category, frequency, coverUrl? }
export async function POST(req: NextRequest) {
  const { user } = await currentUser();
  if (!user) return NextResponse.json({ error: "Please log in to create a newsletter." }, { status: 401 });
  if (!rateLimit(`newsletter-new:${user.id}`, 5, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const b = await req.json().catch(() => ({}));
  const name = String(b.name ?? "").trim().replace(/\s+/g, " ").slice(0, 80);
  const description = String(b.description ?? "").trim().slice(0, 300);
  if (name.length < 3) return NextResponse.json({ error: "Give your newsletter a name (at least 3 characters)." }, { status: 400 });
  if (description.length < 10) return NextResponse.json({ error: "Describe your newsletter in a sentence (at least 10 characters)." }, { status: 400 });
  if (!isCategory(b.category)) return NextResponse.json({ error: "Choose a topic." }, { status: 400 });
  if (!isFrequency(b.frequency)) return NextResponse.json({ error: "Choose how often you'll publish." }, { status: 400 });

  const admin = createAdminClient();
  const { count } = await admin.from("newsletters").select("id", { count: "exact", head: true }).eq("owner_id", user.id);
  if ((count ?? 0) >= MAX_NEWSLETTERS_PER_MEMBER) {
    return NextResponse.json({ error: `You can run up to ${MAX_NEWSLETTERS_PER_MEMBER} newsletters.` }, { status: 400 });
  }

  // Unique, readable address: /newsletters/<slug>
  const base = slugify(name).slice(0, 70) || "newsletter";
  let slug = base.length >= 3 ? base : `${base}-news`;
  for (let i = 2; i < 50; i++) {
    const { data } = await admin.from("newsletters").select("id").eq("slug", slug).maybeSingle();
    if (!data) break;
    slug = `${base}-${i}`;
  }

  const { data, error } = await admin
    .from("newsletters")
    .insert({ owner_id: user.id, slug, name, description, category: b.category, frequency: b.frequency, cover_url: ownCoverUrl(b.coverUrl) })
    .select("id, slug")
    .single();
  if (error || !data) {
    console.error("[newsletters POST]", error?.message);
    return NextResponse.json({ error: "Newsletters are being set up. Please try again soon." }, { status: 500 });
  }
  return NextResponse.json(data);
}
