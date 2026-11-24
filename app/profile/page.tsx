import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// /profile = "my profile". It used to be a hard-coded demo page ("Ulisses Silva")
// that crashed on a missing variable; now it opens the member's real profile.
export default async function MyProfilePage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/profile");

  const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle();

  // No username yet: set up the profile first.
  if (!profile?.username) redirect("/profile/edit");
  redirect(`/u/${encodeURIComponent(profile.username)}`);
}
