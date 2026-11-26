import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { categoryLabel, excerpt, frequencyLabel, readingMinutes } from "@/lib/newsletters/format";
import { displayName } from "@/lib/newsletters/server";
import SubscribeButton from "@/components/newsletters/SubscribeButton";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ [k: string]: string | string[] | undefined }> };

async function load(slug: string) {
  if (!/^[a-z0-9-]{3,80}$/.test(slug)) return null;
  const supabase = await createServerSupabase();
  const { data: nl } = await supabase
    .from("newsletters")
    .select("id, owner_id, slug, name, description, category, frequency, cover_url, created_at")
    .eq("slug", slug)
    .maybeSingle();
  return nl ? { supabase, nl } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await load((await params).slug);
  return r ? { title: `${r.nl.name} | GRID Newsletters`, description: r.nl.description } : { title: "Newsletter | GRID" };
}

export default async function NewsletterPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const r = await load(slug);
  if (!r) notFound();
  const { supabase, nl } = r;

  const admin = createAdminClient();
  const [{ data: owner }, { data: auth }, { data: issues }, { count }] = await Promise.all([
    supabase.from("profiles").select("full_name, username, avatar_url, headline").eq("id", nl.owner_id).maybeSingle(),
    supabase.auth.getUser(),
    supabase.from("articles").select("id, title, summary, body, cover_url, status, published_at, updated_at").eq("newsletter_id", nl.id).order("updated_at", { ascending: false }).limit(50),
    admin.from("newsletter_subscriptions").select("user_id", { count: "exact", head: true }).eq("newsletter_id", nl.id),
  ]);
  const user = auth.user;
  const isOwner = user?.id === nl.owner_id;
  const { data: mine } = user
    ? await admin.from("newsletter_subscriptions").select("user_id").eq("newsletter_id", nl.id).eq("user_id", user.id).maybeSingle()
    : { data: null };

  const published = (issues ?? []).filter((i) => i.status === "published").sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));
  const drafts = isOwner ? (issues ?? []).filter((i) => i.status === "draft") : [];
  const ownerName = displayName(owner);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-16">
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <Link href="/newsletters" className="text-xs font-semibold text-gray-500 hover:text-emerald-600 mb-4 inline-block">← Newsletters</Link>

        {sp.created === "1" && isOwner && (
          <p className="mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200 px-4 py-3 text-sm">
            🎉 Your newsletter is live. Write your first edition. Your followers can subscribe from this page.
          </p>
        )}

        <header className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
          <div className="aspect-[3.2/1]">
            {nl.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={nl.cover_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-800" />
            )}
          </div>
          <div className="p-5 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              {categoryLabel(nl.category)} · {frequencyLabel(nl.frequency)}
            </p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{nl.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">{nl.description}</p>
            <p className="text-sm text-gray-500 mt-3">
              By{" "}
              {owner?.username ? (
                <Link href={`/u/${owner.username}`} className="font-semibold text-gray-800 dark:text-gray-200 hover:underline">{ownerName}</Link>
              ) : (
                <span className="font-semibold text-gray-800 dark:text-gray-200">{ownerName}</span>
              )}
              {owner?.headline ? ` · ${owner.headline}` : ""}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <SubscribeButton
                newsletterId={nl.id}
                initialSubscribed={!!mine}
                initialCount={count ?? 0}
                signedIn={!!user}
                isOwner={isOwner}
                loginRedirect={`/newsletters/${nl.slug}`}
              />
              {isOwner && (
                <Link href={`/articles/new?newsletter=${nl.id}`} prefetch={false} className="px-5 py-2.5 rounded-full font-bold text-white bg-emerald-600 hover:bg-emerald-700">
                  ✍️ Write an edition
                </Link>
              )}
            </div>
          </div>
        </header>

        {drafts.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Your drafts</h2>
            <ul className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 divide-y divide-gray-200 dark:divide-zinc-800">
              {drafts.map((d) => (
                <li key={d.id}>
                  <Link href={`/articles/${d.id}/edit`} className="flex justify-between gap-4 p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                    <span className="font-medium text-gray-800 dark:text-gray-200 truncate">{d.title || "Untitled draft"}</span>
                    <span className="text-sm text-gray-500 flex-none">edited {new Date(d.updated_at).toLocaleDateString("en-GB")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Editions</h2>
          {published.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-10 text-center text-gray-600 dark:text-gray-400">
              {isOwner ? "No editions yet. Write your first one and your subscribers will be notified." : "No editions yet. Subscribe to get the first one."}
            </div>
          ) : (
            <ul className="space-y-4">
              {published.map((a) => (
                <li key={a.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
                  <Link href={`/articles/${a.id}`} className="flex flex-col sm:flex-row gap-4 p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                    {a.cover_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.cover_url} alt="" className="w-full sm:w-48 aspect-[1.91/1] object-cover rounded-xl flex-none" />
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-lg text-gray-900 dark:text-white">{a.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{a.summary || excerpt(a.body, 160)}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {a.published_at ? new Date(a.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : ""} · {readingMinutes(a.body)} min read
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
