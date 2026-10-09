import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import ArtistEditForm from "@/components/artist/ArtistEditForm";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Edit artist profile" };

export const dynamic = "force-dynamic";

export default async function ArtistEditPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/artist/${slug}/edit`);
  }

  const { data: artist } = await supabase
    .from("artists")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!artist) notFound();
  if (artist.owner_id !== user.id) notFound();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <section className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-3">
            Artist dashboard
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-3"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Edit your profile
          </h1>
          <p className="text-gray-600">
            Update your bio, links, and details. Changes appear immediately on
            your public page.
          </p>
        </section>

        <ArtistEditForm
          initial={{
            name: artist.name || "",
            bio: artist.bio || "",
            genre: artist.genre || "",
            artistType: artist.artist_type || "",
            city: artist.city || "",
            country: artist.country || "",
            postcode: artist.postcode || "",
            website: artist.website || "",
            spotify: artist.spotify || "",
            instagram: artist.instagram || "",
            secondaryGenres: artist.secondary_genres || [],
            slug: artist.slug,
          }}
        />
      </div>
    </div>
  );
}
