import { notFound, redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { displayName } from "@/lib/newsletters/server";
import ArticleEditor from "./ArticleEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Write an article | GRID" };

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=${encodeURIComponent(`/articles/${id}/edit`)}`);

  const [{ data: article }, { data: newsletters }, { data: me }] = await Promise.all([
    supabase.from("articles").select("id, author_id, newsletter_id, title, summary, body, cover_url, status").eq("id", id).maybeSingle(),
    supabase.from("newsletters").select("id, name").eq("owner_id", user.id).eq("status", "active").order("created_at"),
    supabase.from("profiles").select("full_name, username, avatar_url").eq("id", user.id).maybeSingle(),
  ]);
  if (!article || article.author_id !== user.id) notFound();

  return (
    <ArticleEditor
      article={{
        id: article.id,
        newsletterId: article.newsletter_id,
        title: article.title,
        summary: article.summary ?? "",
        body: article.body,
        coverUrl: article.cover_url,
        published: article.status === "published",
      }}
      newsletters={(newsletters ?? []).map((n) => ({ id: n.id, name: n.name }))}
      author={{ name: displayName(me), avatarUrl: me?.avatar_url ?? null }}
    />
  );
}
