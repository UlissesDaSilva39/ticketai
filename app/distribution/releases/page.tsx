import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { RELEASE_TYPE_LABEL, isReleaseType } from "@/lib/distribution/checks";

export const dynamic = "force-dynamic";
export const metadata = { title: "My releases | GRID Distribution" };

const STATUS: Record<string, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300" },
  ready: { label: "Ready for delivery", cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" },
  submitted: { label: "Submitted", cls: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" },
  in_review: { label: "In review", cls: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" },
  live: { label: "Live", cls: "bg-emerald-600 text-white" },
  rejected: { label: "Needs changes", cls: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300" },
  taken_down: { label: "Taken down", cls: "bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-gray-300" },
};

export default async function MyReleasesPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=${encodeURIComponent("/distribution/releases")}`);

  const { data, error } = await supabase
    .from("distribution_releases")
    .select("id, title, primary_artist, release_type, release_date, status, updated_at")
    .order("updated_at", { ascending: false })
    .limit(100);
  const releases = data ?? [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 sm:py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/distribution" className="text-xs font-semibold text-gray-500 hover:text-emerald-600 mb-6 inline-block">
          ← GRID Distribution
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My releases</h1>
            <p className="text-gray-600 dark:text-gray-400">Build releases now. Ready releases can be delivered as soon as GRID delivery opens.</p>
          </div>
          <Link href="/distribution/releases/new" prefetch={false} className="px-4 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 text-sm">
            + New release
          </Link>
        </div>

        <p className="mb-6 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200 px-4 py-3 text-sm">
          <strong>Early access:</strong> delivery to stores isn&apos;t open yet. We&apos;ll email you when it is, and your ready releases can be sent in one click.
        </p>

        {error ? (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-8 text-center text-gray-600 dark:text-gray-400">
            Distribution is being set up. Please check back soon.
          </div>
        ) : releases.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-10 text-center">
            <p className="font-semibold text-gray-900 dark:text-white">No releases yet</p>
            <p className="text-sm text-gray-500 mt-1">Start with a single: one track, cover art and a release date.</p>
            <Link href="/distribution/releases/new" prefetch={false} className="inline-block mt-4 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700">
              Start a release
            </Link>
          </div>
        ) : (
          <ul className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 divide-y divide-gray-200 dark:divide-zinc-800">
            {releases.map((r) => {
              const s = STATUS[r.status] ?? STATUS.draft;
              return (
                <li key={r.id}>
                  <Link href={`/distribution/releases/${r.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{r.title || "Untitled release"}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {r.primary_artist || "No artist yet"} · {isReleaseType(r.release_type) ? RELEASE_TYPE_LABEL[r.release_type] : "Release"}
                        {r.release_date ? ` · ${new Date(`${r.release_date}T00:00:00Z`).toLocaleDateString("en-GB", { timeZone: "UTC" })}` : ""}
                      </p>
                    </div>
                    <span className={`flex-none px-3 py-1 rounded-full text-xs font-bold ${s.cls}`}>{s.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
