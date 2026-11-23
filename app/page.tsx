import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import HomeLanding from "@/components/landing/HomeLanding";

export default async function RootPage() {
  // Signed-in users go straight to their feed; everyone else sees the landing page.
  let signedIn = false;
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase.auth.getUser();
    signedIn = !!data.user;
  } catch {
    // Supabase not configured or unreachable: show the landing page.
  }

  if (signedIn) redirect("/home");
  return <HomeLanding />;
}
