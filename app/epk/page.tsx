import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { roleLabel } from "@/lib/hooks/useMe";
import CopyLinkButton from "./CopyLinkButton";

// "My EPK": the member's real electronic press kit from their profile and posts.
// Replaces a hard-coded mock-up that included invented reviews.

export const metadata: Metadata = { title: "My EPK" };
export const dynamic = "force-dynamic";

const LINKS: { key: "spotify" | "soundcloud" | "youtube" | "instagram" | "twitter" | "website"; label: string }[] = [
  { key: "spotify", label: "Spotify" },
  { key: "soundcloud", label: "SoundCloud" },
  { key: "youtube", label: "YouTube" },
  { key: "instagram", label: "Instagram" },
  { key: "twitter", label: "X / Twitter" },
  { key: "website", label: "Website" },
];

// Turn handles like "@name" into links; leave full URLs as they are.
function toHref(key: string, value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  const handle = value.replace(/^@/, "").split("@")[0];
  if (key === "instagram") return `https://instagram.com/${handle}`;
  if (key === "twitter") return `https://x.com/${handle}`;
  return `https://${value.replace(/^\/+/, "")}`;
}

export default async function MyEpkPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/epk");

  const [{ data: p }, { count: followers }, { count: postCount }, { data: tracks }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, username, avatar_url, cover_image, role, genre, label, city, bio, spotify, soundcloud, youtube, instagram, twitter, website")
      .eq("id", user.id)
      .maybeSingle(),
    supabase.from("follows").select("id", { count: "exact", head: true }).eq("target_type", "user").eq("target_id", user.id),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("author_id", user.id),
    supabase
      .from("posts")
      .select("id, audio_url, audio_title, created_at")
      .eq("author_id", user.id)
      .not("audio_url", "is", null)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  if (!p?.username) redirect("/profile/edit");

  const name = (p.full_name && !p.full_name.includes("@") ? p.full_name : p.username) || "Your name";
  const links = LINKS.filter((l) => p[l.key]).map((l) => ({ ...l, href: toHref(l.key, String(p[l.key])) }));
  const missing = [!p.avatar_url && "a photo", !p.bio && "a bio", !p.genre && "your genre", !p.city && "your city", links.length === 0 && "a music or social link", (tracks ?? []).length === 0 && "a track"].filter(Boolean) as string[];

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-[calc(100vh-56px)]">
      <div className="mx-auto max-w-3xl px-4 py-6 space-y-4">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          {p.cover_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.cover_image} alt="" className="h-40 w-full object-cover" />
          ) : (
            <div className="h-40 bg-gradient-to-r from-zinc-900 via-emerald-900 to-emerald-600" />
          )}
          <div className="p-6 -mt-16">
            {p.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.avatar_url} alt={name} className="h-28 w-28 rounded-2xl object-cover ring-4 ring-white dark:ring-zinc-900" />
            ) : (
              <div className="grid h-28 w-28 place-items-center rounded-2xl bg-emerald-800 text-4xl font-bold text-white ring-4 ring-white dark:ring-zinc-900">
                {name.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{name}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {roleLabel(p.role, p.genre)}
                  {p.city ? ` · ${p.city}` : ""}
                  {p.label ? ` · ${p.label}` : ""}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {followers ?? 0} followers · {postCount ?? 0} posts
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/profile/edit" className="rounded-lg border border-gray-300 dark:border-zinc-700 px-4 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800">
                  Edit
                </Link>
                <CopyLinkButton path={`/u/${p.username}`} />
              </div>
            </div>

            {p.bio ? (
              <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300">{p.bio}</p>
            ) : (
              <p className="mt-5 text-sm text-gray-500">No bio yet.</p>
            )}

            {links.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {links.map((l) => (
                  <a key={l.key} href={l.href} target="_blank" rel="noopener noreferrer" className="rounded-full bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-gray-800 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-zinc-700">
                    {l.label} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 dark:text-white">Latest tracks</h2>
          {(tracks ?? []).length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">
              No tracks yet. Use <strong>Audio</strong> in the post box on your <Link href="/home" className="text-emerald-700 underline">home page</Link> to share one.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {(tracks ?? []).map((t) => (
                <li key={t.id} className="rounded-xl bg-gray-50 dark:bg-zinc-800/60 p-3">
                  <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">{t.audio_title || "Untitled track"}</p>
                  <audio src={t.audio_url ?? undefined} controls preload="none" className="w-full" />
                </li>
              ))}
            </ul>
          )}
        </section>

        {missing.length > 0 && (
          <p className="text-center text-sm text-gray-500">
            Make your EPK stronger: add {missing.join(", ")} on{" "}
            <Link href="/profile/edit" className="text-emerald-700 font-semibold underline">your profile</Link>.
          </p>
        )}
      </div>
    </div>
  );
}
