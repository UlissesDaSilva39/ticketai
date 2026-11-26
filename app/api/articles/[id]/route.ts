import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { UUID, currentUser, ownCoverUrl } from "@/lib/newsletters/server";

export const dynamic = "force-dynamic";
type Ctx = { params: Promise<{ id: string }> };

async function ownArticle(id: string) {
  const { user } = await currentUser();
  if (!user) return { error: NextResponse.json({ error: "Please log in." }, { status: 401 }) } as const;
  if (!UUID.test(id)) return { error: NextResponse.json({ error: "Article not found." }, { status: 404 }) } as const;
  const admin = createAdminClient();
  const { data: a } = await admin.from("articles").select("id, author_id, status").eq("id", id).maybeSingle();
  if (!a || a.author_id !== user.id) return { error: NextResponse.json({ error: "Article not found." }, { status: 404 }) } as const;
  return { user, admin, article: a } as const;
}

// PATCH /api/articles/<id> { title, body, summary, coverUrl, newsletterId }: save (draft or published).
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const r = await ownArticle(id);
  if ("error" in r) return r.error;
  const b = await req.json().catch(() => ({}));

  let newsletterId: string | null = null;
  if (typeof b.newsletterId === "string" && UUID.test(b.newsletterId)) {
    const { data: nl } = await r.admin.from("newsletters").select("id, owner_id").eq("id", b.newsletterId).maybeSingle();
    if (!nl || nl.owner_id !== r.user.id) return NextResponse.json({ error: "That newsletter isn't yours." }, { status: 403 });
    newsletterId = nl.id;
  }

  const { error } = await r.admin
    .from("articles")
    .update({
      title: String(b.title ?? "").trim().slice(0, 150),
      body: String(b.body ?? "").slice(0, 100000),
      summary: String(b.summary ?? "").trim().slice(0, 300) || null,
      cover_url: ownCoverUrl(b.coverUrl),
      newsletter_id: newsletterId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return NextResponse.json({ error: "Couldn't save. Please try again." }, { status: 500 });
  return NextResponse.json({ saved: true, savedAt: new Date().toISOString() });
}

// DELETE /api/articles/<id>
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const r = await ownArticle(id);
  if ("error" in r) return r.error;
  await r.admin.from("articles").delete().eq("id", id);
  return NextResponse.json({ deleted: true });
}
