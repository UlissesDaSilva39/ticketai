import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import EditProfileForm from "./EditProfileForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit profile" };

export default async function EditProfilePage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, bio, city, website, instagram, twitter, avatar_url, cover_image, genre, label, spotify, youtube, soundcloud, role")
    .eq("id", user.id)
    .maybeSingle();

  const initial = {
    full_name: profile?.full_name ?? null,
    bio: profile?.bio ?? null,
    city: profile?.city ?? null,
    website: profile?.website ?? null,
    instagram: profile?.instagram ?? null,
    twitter: profile?.twitter ?? null,
    avatar_url: profile?.avatar_url ?? null,
    cover_image: profile?.cover_image ?? null,
    genre: profile?.genre ?? null,
    label: profile?.label ?? null,
    spotify: profile?.spotify ?? null,
    youtube: profile?.youtube ?? null,
    soundcloud: profile?.soundcloud ?? null,
    role: profile?.role ?? null,
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <a href="/" className="text-sm text-gray-500 hover:underline">
        Back to feed
      </a>
      <h1
        className="text-4xl font-bold uppercase mt-4 mb-8"
        style={{ fontFamily: "var(--font-antonio)" }}
      >
        Edit profile
      </h1>
      <EditProfileForm initial={initial} />
    </div>
  );
}