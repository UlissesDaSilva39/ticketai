import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import NewCampaignForm from "./NewCampaignForm";

export const dynamic = "force-dynamic";

export default async function NewCampaignPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: events } = await supabase
    .from("events")
    .select("id, title")
    .eq("organizer_id", user.id)
    .order("start_date", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/organizer/campaigns" className="text-sm text-gray-500 hover:text-black">Back to Campaigns</Link>
      </div>
      <h1 className="text-5xl font-bold mb-3" style={{ fontFamily: "var(--font-antonio)" }}>NEW CAMPAIGN</h1>
      <p className="text-gray-500 mb-10">Send an email to your past attendees.</p>
      <NewCampaignForm events={events || []} />
    </div>
  );
}
