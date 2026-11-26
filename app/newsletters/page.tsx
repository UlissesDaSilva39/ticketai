import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { CATEGORIES, categoryLabel, excerpt, frequencyLabel, isCategory } from "@/lib/newsletters/format";
import { displayName } from "@/lib/newsletters/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Newsletters | GRID", description: "Music newsletters from artists, producers and venues on GRID." };

type NL = { id: string; slug: string; name: string; description: string; category: string; frequency: string; cover_url: string | null; owner_id: string };
type Art = { id: string; title: string; summary: string | null; body: string; cover_url: string | null; status: string; published_at: string | null; updated_at: string; newsletter_id: string | null; author_id: string };

const card = "bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800";

function Cover({ url, label }: { url: string | null; label: string }) {
  return url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="" className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-800 flex items-center justify-center text-white text-2xl font-bold">{label[0]}</div>
  );
}

export default async function NewslettersPage({ searchParams }: { searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
  const sp = await searchParams;
  const category = typeof sp.category === "string" && isCategory(sp.category) ? sp.category : null;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let discoverQ = supabase.from("newsletters").select("id, slug, name, description, category, frequency, cover_url, owner_id").eq("status", "active").order("created_at", { ascending: false }).limit(24);
  if (category) discoverQ = discoverQ.eq("category", category);

  const [discoverRes, latestRes, mineRes, draftsRes, subsRes] = await Promise.all([
    discoverQ,
    supabase.from("articles").select("id, title, summary, body, cover_url, status, published_at, updated_at, newsletter_id, author_id").eq("status", "published").order("published_at", { ascending: false }).limit(12),
    user ? supabase.from("newsletters").select("id, slug, name, description, category, frequency, cover_url, owner_id").eq("owner_id", user.id).order("created_at") : Promise.resolve({ data: [] as NL[], error: null }),
    user ? supabase.from("articles").select("id, title, summary, body, cover_url, status, published_at, updated_at, newsletter_id, author_id").eq("author_id", user.id).eq("status", "draft").order("updated_at", { ascending: false }).limit(10) : Promise.resolve({ data: [] as Art[], error: null }),
    user ? supabase.from("newsletter_subscriptions").select("newsletter_id").eq("user_id", user.id) : Promise.resolve({ data: [] as { newsletter_id: string }[], error: null }),
  ]);

  if (discoverRes.error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-600 dark:text-gray-400">Newsletters are being set up. Please check back soon.</div>
    );
  }

  const discover = (discoverRes.data ?? []) as NL[];
  const latest = (latestRes.data ?? []) as Art[];
  const mine = (mineRes.data ?? []) as NL[];
  const drafts = (draftsRes.data ?? []) as Art[];
  const subscribedIds = new Set((subsRes.data ?? []).map((s) => s.newsletter_id));

  // Names and subscriber counts (counts are server-side: RLS only shows your own subscriptions).
  const admin = createAdminClient();
  const allNl = [...discover, ...mine];
  const nlIds = [...new Set(allNl.map((n) => n.id).concat(latest.map((a) => a.newsletter_id).filter((x): x is string => !!x)))];
  const peopleIds = [...new Set(allNl.map((n) => n.owner_id).concat(latest.map((a) => a.author_id)))];
  const [{ data: people }, { data: subRows }, { data: nlNames }] = await Promise.all([
    peopleIds.length ? admin.from("profiles").select("id, full_name, username").in("id", peopleIds) : Promise.resolve({ data: [] as { id: string; full_name: string | null; username: string | null }[] }),
    nlIds.length ? admin.from("newsletter_subscriptions").select("newsletter_id").in("newsletter_id", nlIds) : Promise.resolve({ data: [] as { newsletter_id: string }[] }),
    nlIds.length ? admin.from("newsletters").select("id, slug, name").in("id", nlIds) : Promise.resolve({ data: [] as { id: string; slug: string; name: string }[] }),
  ]);
  const personById = new Map((people ?? []).map((p) => [p.id, p]));
  const subCount = new Map<string, number>();
  for (const r of subRows ?? []) subCount.set(r.newsletter_id, (subCount.get(r.newsletter_id) ?? 0) + 1);
  const nlById = new Map((nlNames ?? []).map((n) => [n.id, n]));
  const subscribed = discover.filter((n) => subscribedIds.has(n.id));

  const NlCard = ({ n, own }: { n: NL; own?: boolean }) => (
    <li className={`${card} overflow-hidden flex flex-col`}>
      <Link href={`/newsletters/${n.slug}`} className="block aspect-[2.4/1]">
        <Cover url={n.cover_url} label={n.name} />
      </Link>
      <div className="p-4 flex-1 flex flex-col">
        <Link href={`/newsletters/${n.slug}`} className="font-bold text-gray-900 dark:text-white hover:underline">{n.name}</Link>
        <p className="text-xs text-gray-500 mt-0.5">
          {own ? "Your newsletter" : `by ${displayName(personById.get(n.owner_id))}`} · {frequencyLabel(n.frequency)} · {(subCount.get(n.id) ?? 0).toLocaleString("en-GB")} subscribers
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 flex-1">{n.description}</p>
        {own && (
          <Link href={`/articles/new?newsletter=${n.id}`} prefetch={false} className="mt-3 self-start px-4 py-1.5 rounded-full text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700">
            Write an edition
          </Link>
        )}
      </div>
    </li>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 sm:py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">GRID Newsletters</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Stories from the music world</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 max-w-xl">Release news, gig diaries, studio tips and scene reports, written by artists and the industry. Subscribe to get every new edition in your notifications.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/articles/new" prefetch={false} className="px-4 py-2.5 rounded-xl font-semibold text-sm border border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-zinc-900">
              Write an article
            </Link>
            <Link href="/newsletters/new" className="px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700">
              + Create a newsletter
            </Link>
          </div>
        </header>

        {user && (mine.length > 0 || drafts.length > 0) && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your writing</h2>
            {mine.length > 0 && <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">{mine.map((n) => <NlCard key={n.id} n={n} own />)}</ul>}
            {drafts.length > 0 && (
              <div className={`${card} p-4`}>
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">Drafts</p>
                <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
                  {drafts.map((d) => (
                    <li key={d.id}>
                      <Link href={`/articles/${d.id}/edit`} className="flex justify-between gap-4 py-2 text-sm hover:text-emerald-700">
                        <span className="truncate font-medium text-gray-800 dark:text-gray-200">{d.title || "Untitled draft"}</span>
                        <span className="text-gray-500 flex-none">edited {new Date(d.updated_at).toLocaleDateString("en-GB")}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {subscribed.length > 0 && !category && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Subscribed</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{subscribed.map((n) => <NlCard key={n.id} n={n} />)}</ul>
          </section>
        )}

        {latest.length > 0 && !category && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Latest articles</h2>
            <ul className="grid gap-4 md:grid-cols-2">
              {latest.map((a) => {
                const nl = a.newsletter_id ? nlById.get(a.newsletter_id) : null;
                return (
                  <li key={a.id} className={`${card} overflow-hidden`}>
                    <Link href={`/articles/${a.id}`} className="flex gap-4 p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-none"><Cover url={a.cover_url} label={a.title || "A"} /></div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 truncate">{nl?.name ?? displayName(personById.get(a.author_id))}</p>
                        <p className="font-bold text-gray-900 dark:text-white line-clamp-2">{a.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">{a.summary || excerpt(a.body, 120)}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{category ? categoryLabel(category) : "Discover newsletters"}</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4" role="navigation" aria-label="Topics">
            {[{ id: null, label: "All topics" }, ...CATEGORIES].map((c) => (
              <Link
                key={c.id ?? "all"}
                href={c.id ? `/newsletters?category=${c.id}` : "/newsletters"}
                aria-current={category === c.id ? "page" : undefined}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${category === c.id ? "bg-emerald-600 text-white" : "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-300 hover:border-emerald-400"}`}
              >
                {c.label}
              </Link>
            ))}
          </div>
          {discover.length === 0 ? (
            <div className={`${card} p-10 text-center`}>
              <p className="font-semibold text-gray-900 dark:text-white">No newsletters here yet.</p>
              <p className="text-sm text-gray-500 mt-1">Start the first one and build a following around your music.</p>
              <Link href="/newsletters/new" className="inline-block mt-4 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700">Create a newsletter</Link>
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{discover.map((n) => <NlCard key={n.id} n={n} own={n.owner_id === user?.id} />)}</ul>
          )}
        </section>
      </div>
    </div>
  );
}
