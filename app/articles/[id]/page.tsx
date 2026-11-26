import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { excerpt, readingMinutes } from "@/lib/newsletters/format";
import { displayName } from "@/lib/newsletters/server";
import ArticleBody from "@/components/newsletters/ArticleBody";
import SubscribeButton from "@/components/newsletters/SubscribeButton";
import ShareLink from "./ShareLink";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ id: string }> };

async function load(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const supabase = await createServerSupabase();
  // RLS: published articles for everyone, drafts only for the author.
  const { data: a } = await supabase
    .from("articles")
    .select("id, author_id, newsletter_id, title, summary, body, cover_url, status, published_at, updated_at")
    .eq("id", id)
    .maybeSingle();
  return a ? { supabase, a } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await load((await params).id);
  if (!r || r.a.status !== "published") return { title: "Article | GRID" };
  const description = r.a.summary || excerpt(r.a.body, 160);
  return {
    title: `${r.a.title} | GRID`,
    description,
    openGraph: { title: r.a.title, description, images: r.a.cover_url ? [r.a.cover_url] : undefined, type: "article" },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const r = await load(id);
  if (!r) notFound();
  const { supabase, a } = r;

  const [{ data: author }, nlRes, { data: auth }] = await Promise.all([
    supabase.from("profiles").select("full_name, username, avatar_url, headline").eq("id", a.author_id).maybeSingle(),
    a.newsletter_id ? supabase.from("newsletters").select("id, slug, name, description").eq("id", a.newsletter_id).maybeSingle() : Promise.resolve({ data: null }),
    supabase.auth.getUser(),
  ]);
  const nl = nlRes.data;
  const user = auth.user;
  const isAuthor = user?.id === a.author_id;

  let subscribed = false;
  let subscribers = 0;
  if (nl) {
    const admin = createAdminClient();
    const [{ count }, mine] = await Promise.all([
      admin.from("newsletter_subscriptions").select("user_id", { count: "exact", head: true }).eq("newsletter_id", nl.id),
      user ? admin.from("newsletter_subscriptions").select("user_id").eq("newsletter_id", nl.id).eq("user_id", user.id).maybeSingle() : Promise.resolve({ data: null }),
    ]);
    subscribers = count ?? 0;
    subscribed = !!mine.data;
  }

  const name = displayName(author);
  const date = a.published_at ? new Date(a.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pb-16">
      <article className="max-w-3xl mx-auto px-4 pt-8">
        {a.status !== "published" && (
          <p className="mb-6 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 px-4 py-3 text-sm">
            This is a draft preview. Only you can see it. <Link href={`/articles/${a.id}/edit`} className="font-semibold underline">Keep editing</Link>
          </p>
        )}

        {nl && (
          <Link href={`/newsletters/${nl.slug}`} className="inline-block text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400 hover:underline mb-3">
            {nl.name}
          </Link>
        )}

        {a.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={a.cover_url} alt="" className="w-full aspect-[1.91/1] object-cover rounded-xl mb-8" />
        )}

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">{a.title || "Untitled"}</h1>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pb-6 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 overflow-hidden flex items-center justify-center font-bold text-emerald-700">
              {author?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={author.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                name[0]
              )}
            </div>
            <div>
              {author?.username ? (
                <Link href={`/u/${author.username}`} className="font-semibold text-gray-900 dark:text-white hover:underline">{name}</Link>
              ) : (
                <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
              )}
              <p className="text-sm text-gray-500">
                {author?.headline ? `${author.headline} · ` : ""}
                {date ?? "Not published yet"} · {readingMinutes(a.body)} min read
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShareLink title={a.title} />
            {isAuthor && (
              <Link href={`/articles/${a.id}/edit`} className="px-4 py-1.5 rounded-full text-sm font-bold border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-200 hover:border-emerald-500">
                Edit
              </Link>
            )}
          </div>
        </div>

        <ArticleBody body={a.body} className="mt-6" />

        {nl && (
          <aside className="mt-12 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Newsletter</p>
            <Link href={`/newsletters/${nl.slug}`} className="block text-xl font-bold text-gray-900 dark:text-white hover:underline mt-1">{nl.name}</Link>
            <p className="text-gray-600 dark:text-gray-400 mt-1 mb-4">{nl.description}</p>
            <SubscribeButton
              newsletterId={nl.id}
              initialSubscribed={subscribed}
              initialCount={subscribers}
              signedIn={!!user}
              isOwner={isAuthor}
              loginRedirect={`/articles/${a.id}`}
            />
          </aside>
        )}
      </article>
    </div>
  );
}
