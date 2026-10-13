import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import EditProfileForm from "@/components/profile/EditProfileForm";

export const dynamic = "force-dynamic";

export default async function EditProfilePage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url, cover_image, bio, city, genre, role, website, instagram, twitter, spotify, youtube, soundcloud, is_public")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.from("profiles").insert({ id: user.id, is_public: true });
    redirect("/profile/edit");
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <Link href="/profile" className="text-sm text-gray-500 hover:text-black mb-4 inline-block">
          &larr; Back to profile
        </Link>
        <h1
          className="text-3xl font-bold uppercase mb-6"
          style={{ fontFamily: "var(--font-antonio)" }}
        >
          Edit profile
        </h1>
        <EditProfileForm profile={profile} />
      </div>
    </div>
  );
}
