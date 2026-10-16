import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import ArtistEditForm from "@/components/artist/ArtistEditForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: "Edit " + slug + " - GRID" };
}

export default async function ArtistEditPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/artist/" + slug + "/edit");

  const { data: artist } = await supabase
    .from("artists")
    .select(
      "id, slug, name, handle, genre, city, country, bio, website, instagram, spotify, avatar_url, cover_image, owner_id"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (!artist) notFound();
  if (artist.owner_id !== user.id) notFound();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-2">
            Artist dashboard
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Edit profile
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Changes appear immediately on your public page.
          </p>
        </div>

        <ArtistEditForm artist={artist} />
      </div>
    </div>
  );
}