import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar/Sidebar";
import TrackUploadForm from "@/components/artist/TrackUploadForm";
import TrackList from "@/components/artist/TrackList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit artist",
  description: "Manage your artist profile on GRID.",
};

type Props = { params: Promise<{ slug: string }> };

type ArtistRow = {
  id: string;
  slug: string | null;
  name: string | null;
  owner_id: string | null;
  status: string | null;
};

type TrackRow = {
  id: string;
  title: string;
  kind: string | null;
  audio_url: string | null;
  cover_url: string | null;
  duration_seconds: number | null;
  play_count: number | null;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function resolveArtist(slug: string): Promise<ArtistRow | null> {
  const supabase = await createServerSupabase();

  // 1) By slug in artists table
  const bySlug = await supabase
    .from("artists")
    .select("id, slug, name, owner_id, status")
    .eq("slug", slug)
    .maybeSingle();
  if (bySlug.data) return bySlug.data as ArtistRow;

  // 2) By id in artists table (if slug looks like a UUID)
  if (UUID_RE.test(slug)) {
    const byId = await supabase
      .from("artists")
      .select("id, slug, name, owner_id, status")
      .eq("id", slug)
      .maybeSingle();
    if (byId.data) return byId.data as ArtistRow;
  }

  // 3) By username in profiles table (no .or — split lookups only)
  const byUsername = await supabase
    .from("profiles")
    .select("id, username, full_name")
    .eq("username", slug)
    .maybeSingle();
  if (byUsername.data) {
    return {
      id: byUsername.data.id,
      slug: byUsername.data.username,
      name: byUsername.data.full_name || byUsername.data.username,
      owner_id: byUsername.data.id,
      status: "active",
    };
  }

  // 4) By id in profiles table (if slug looks like a UUID)
  if (UUID_RE.test(slug)) {
    const byId = await supabase
      .from("profiles")
      .select("id, username, full_name")
      .eq("id", slug)
      .maybeSingle();
    if (byId.data) {
      return {
        id: byId.data.id,
        slug: byId.data.username,
        name: byId.data.full_name || byId.data.username,
        owner_id: byId.data.id,
        status: "active",
      };
    }
  }

  return null;
}

export default async function ArtistEditPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const artist = await resolveArtist(slug);
  if (!artist) notFound();

  const isOwner = !!user && user.id === artist.owner_id;
  const lookupId = artist.owner_id ?? artist.id;

  const { data: tracksRaw } = await supabase
    .from("tracks")
    .select("id,title,kind,audio_url,cover_url,duration_seconds,play_count")
    .eq("artist_id", lookupId)
    .order("created_at", { ascending: false })
    .limit(200);

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
                {(artist.name || "Artist") + " — Edit"}
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                Upload new music and manage what is live on your public profile.
              </p>
            </div>
            <Link
              href={"/artists/" + (artist.slug ?? artist.id)}
              className="text-sm underline text-gray-700 hover:text-black"
            >
              View public profile
            </Link>
          </header>

          {!user ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-900 font-medium mb-3">Log in to edit</p>
              <Link
                href={"/login?next=/artist/" + slug + "/edit"}
                className="inline-block rounded-full bg-black text-white text-sm font-semibold px-6 py-2 hover:bg-gray-800"
              >
                Log in
              </Link>
            </div>
          ) : !isOwner ? (
            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
              You are viewing someone else&apos;s artist page. Only the owner can upload or remove tracks.
            </div>
          ) : (
            <>
              <section className="mb-8">
                <h2
                  className="text-xl font-bold uppercase mb-3"
                  style={{ fontFamily: "var(--font-antonio)" }}
                >
                  Add a new track
                </h2>
                <TrackUploadForm
                  profileId={user.id}
                  defaultArtistName={artist.name ?? ""}
                />
              </section>

              <section>
                <h2
                  className="text-xl font-bold uppercase mb-3"
                  style={{ fontFamily: "var(--font-antonio)" }}
                >
                  {"Your tracks (" + tracks.length + ")"}
                </h2>
                <TrackList tracks={tracks} />
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}