import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function saveProfile(formData: FormData) {
  "use server";
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const usernameRaw = String(formData.get("username") || "").trim().toLowerCase();
  const username = usernameRaw || null;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: String(formData.get("full_name") || "") || null,
      username,
      bio: String(formData.get("bio") || "") || null,
      city: String(formData.get("city") || "") || null,
      website: String(formData.get("website") || "") || null,
      instagram: String(formData.get("instagram") || "") || null,
      twitter: String(formData.get("twitter") || "") || null,
      is_public: formData.get("is_public") === "on",
    })
    .eq("id", user.id);

  if (error) {
    redirect("/profile/edit?error=" + encodeURIComponent(error.message));
  }

  if (username) redirect("/u/" + username);
  redirect("/");
}

export default async function EditProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, username, bio, city, website, instagram, twitter, is_public")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1
        className="text-5xl font-bold uppercase mb-8"
        style={{ fontFamily: "var(--font-antonio)" }}
      >
        Edit Profile
      </h1>

      {error && (
        <p className="text-red-600 text-sm mb-4 p-3 bg-red-50 border border-red-200 rounded">
          Save failed: {error}
        </p>
      )}

      <form action={saveProfile} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Full name</label>
          <input
            name="full_name"
            defaultValue={profile?.full_name || ""}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            name="username"
            defaultValue={profile?.username || ""}
            placeholder="yourname"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg lowercase"
          />
          <p className="text-xs text-gray-500 mt-1">Your public URL will be /u/yourname</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            defaultValue={profile?.bio || ""}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            name="city"
            defaultValue={profile?.city || ""}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Website</label>
          <input
            name="website"
            type="url"
            defaultValue={profile?.website || ""}
            placeholder="https://"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Instagram</label>
            <input
              name="instagram"
              defaultValue={profile?.instagram || ""}
              placeholder="@handle"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Twitter / X</label>
            <input
              name="twitter"
              defaultValue={profile?.twitter || ""}
              placeholder="@handle"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="is_public"
            name="is_public"
            type="checkbox"
            defaultChecked={profile?.is_public ?? true}
            className="w-4 h-4"
          />
          <label htmlFor="is_public" className="text-sm">
            Make my profile public (visible at /u/yourname)
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800"
          >
            Save
          </button>
          <Link
            href={profile?.username ? "/u/" + profile.username : "/"}
            className="px-6 py-3 border-2 border-black font-medium rounded-full hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
