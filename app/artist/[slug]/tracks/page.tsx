import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar/Sidebar";
import TrackUploadForm from "@/components/artist/TrackUploadForm";
import TrackList from "@/components/artist/TrackList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage tracks",
  description: "Upload and manage your tracks on GRID.",
};

type Props = { params: Promise<{ slug: string }> };

type TrackRow = {
  id: string;
  title: string;
  kind: string | null;
  audio_url: string | null;
  cover_url: string | null;
  duration_seconds: number | null;
  play_count: number | null;
};

type ArtistRow = {
  id: string;
  slug: string | null;
  owner_id: string | null;
  name: string | null;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ArtistTracksPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/artist/" + slug + "/tracks");

  let artistRow: ArtistRow | null = null;

  const bySlug = await supabase
    .from("artists")
    .select("id, slug, owner_id, name")
    .eq("slug", slug)
    .maybeSingle();
  if (bySlug.data) artistRow = bySlug.data as ArtistRow;

  if (!artistRow && UUID_RE.test(slug)) {
    const byId = await supabase
      .from("artists")
      .select("id, slug, owner_id, name")
      .eq("id", slug)
      .maybeSingle();
    if (byId.data) artistRow = byId.data as ArtistRow;
  }

  if (!artistRow) notFound();

  const isOwner = artistRow.owner_id === user.id;
  const lookupId = artistRow.owner_id ?? artistRow.id;

  const { data: tracksRaw } = await supabase
    .from("tracks")
    .select("id,title,kind,audio_url,cover_url,duration_seconds,play_count")
    .eq("artist_id", lookupId)
    .order("created_at", { ascending: false })
    .limit(100);

  const tracks: TrackRow[] = (tracksRaw as TrackRow[]) || [];

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <Sidebar />
        </div>
        <main className="col-span-12 lg:col-span-9 min-w-0">
          <header className="mb-6 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1
                className="text-3xl md:text-4xl font-bold uppercase"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                {(artistRow.name || "Artist") + " - Tracks"}
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                Upload new music and manage what is live.
              </p>
            </div>
            <Link
              href={"/artists/" + (artistRow.slug ?? artistRow.id)}
              className="text-sm underline text-gray-700 hover:text-black"
            >
              View public profile
            </Link>
          </header>

          {isOwner ? (
            <div className="mb-8">
              <TrackUploadForm
                profileId={user.id}
                defaultArtistName={artistRow.name ?? ""}
              />
            </div>
          ) : (
            <div className="mb-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
              You are viewing someone else&#39;s tracks. Only the owner can upload or remove.
            </div>
          )}

          <h2
            className="text-xl font-bold uppercase mb-3"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            {"Your tracks (" + tracks.length + ")"}
          </h2>
          <TrackList tracks={tracks} />
        </main>
      </div>
    </div>
  );
}
