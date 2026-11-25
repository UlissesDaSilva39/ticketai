import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import NewListingForm from "./NewListingForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "List a track for licensing | GRID" };

export default async function NewLicenceListingPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=${encodeURIComponent("/licensing/new")}`);
  return <NewListingForm />;
}
