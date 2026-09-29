import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/organizer" className="text-sm text-gray-500 hover:text-black">← Back to Dashboard</Link>
      </div>
      <h1 className="text-5xl font-bold mb-3" style={{ fontFamily: "var(--font-antonio)" }}>YOUR PROFILE</h1>
      <p className="text-gray-500 mb-10">This information appears on your public organizer page.</p>
      <ProfileForm
        userId={user.id}
        initial={{
          full_name: profile?.full_name || "",
          bio: profile?.bio || "",
          city: profile?.city || "",
          website: profile?.website || "",
          instagram: profile?.instagram || "",
          twitter: profile?.twitter || "",
        }}
      />
    </div>
  );
}
