import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import NewNewsletterForm from "./NewNewsletterForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Create a newsletter | GRID" };

export default async function NewNewsletterPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=${encodeURIComponent("/newsletters/new")}`);
  return <NewNewsletterForm />;
}
