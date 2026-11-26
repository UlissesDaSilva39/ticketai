import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { excerpt } from "@/lib/newsletters/format";
import { UUID, currentUser, displayName } from "@/lib/newsletters/server";

export const dynamic = "force-dynamic";

// POST /api/articles/<id>/publish { notify?: boolean }
// Publishes the saved article. Newsletter editions notify every subscriber once.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await currentUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  if (!UUID.test(id)) return NextResponse.json({ error: "Article not found." }, { status: 404 });
  if (!rateLimit(`article-publish:${user.id}`, 10, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "You've published a lot today. Try again later." }, { status: 429 });
  }

  const admin = createAdminClient();
  const { data: a } = await admin.from("articles").select("id, author_id, newsletter_id, title, body, summary, status").eq("id", id).maybeSingle();
  if (!a || a.author_id !== user.id) return NextResponse.json({ error: "Article not found." }, { status: 404 });
  if (a.title.trim().length < 5) return NextResponse.json({ error: "Add a title (at least 5 characters) before publishing." }, { status: 400 });
  if (a.body.trim().length < 50) return NextResponse.json({ error: "Write a little more before publishing (at least 50 characters)." }, { status: 400 });

  const firstTime = a.status !== "published";
  const { error } = await admin
    .from("articles")
    .update({ status: "published", ...(firstTime ? { published_at: new Date().toISOString() } : {}), updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return NextResponse.json({ error: "Couldn't publish. Please try again." }, { status: 500 });

  // Notify subscribers the first time a newsletter edition goes out.
  const { notify } = await req.json().catch(() => ({ notify: true }));
  let notified = 0;
  if (firstTime && a.newsletter_id && notify !== false) {
    const [{ data: nl }, { data: me }] = await Promise.all([
      admin.from("newsletters").select("name").eq("id", a.newsletter_id).maybeSingle(),
      admin.from("profiles").select("full_name, username").eq("id", user.id).maybeSingle(),
    ]);
    const body = a.summary?.trim() || excerpt(a.body, 140);
    for (let from = 0; ; from += 1000) {
      const { data: subs } = await admin
        .from("newsletter_subscriptions")
        .select("user_id")
        .eq("newsletter_id", a.newsletter_id)
        .range(from, from + 999);
      if (!subs?.length) break;
      const { error: nErr } = await admin.from("notifications").insert(
        subs.map((s) => ({
          user_id: s.user_id,
          type: "newsletter",
          title: `${nl?.name ?? displayName(me)}: ${a.title}`,
          body,
          href: `/articles/${a.id}`,
        }))
      );
      if (nErr) console.error("[articles publish] notify failed:", nErr.message);
      else notified += subs.length;
      if (subs.length < 1000) break;
    }
  }

  return NextResponse.json({ published: true, url: `/articles/${a.id}`, notified });
}
