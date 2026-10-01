import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import BoostButtons from "./BoostButtons";

export const dynamic = "force-dynamic";

export default async function BoostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("organizer_id", user.id)
    .maybeSingle();

  if (!event) return notFound();

  const isFeatured = event.featured_until && new Date(event.featured_until) > new Date();
  const featuredUntil = event.featured_until
    ? new Date(event.featured_until).toLocaleDateString("en-GB", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/organizer" className="text-sm text-gray-500 hover:text-black">Back to Dashboard</Link>
      </div>
      <h1 className="text-5xl font-bold mb-3" style={{ fontFamily: "var(--font-antonio)" }}>BOOST EVENT</h1>
      <p className="text-gray-500 mb-10">Feature {event.title} at the top of the home page.</p>
      {isFeatured && (
        <div className="bg-[#00FF87] rounded-lg p-6 mb-8">
          <p className="font-bold text-xl mb-1" style={{ fontFamily: "var(--font-antonio)" }}>CURRENTLY FEATURED</p>
          <p className="text-sm">Boosted until {featuredUntil}</p>
        </div>
      )}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-antonio)" }}>Why Boost?</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>Top placement on the home page</li>
          <li>Yellow FEATURED badge on your event card</li>
          <li>Priority in search results</li>
          <li>Up to 3-5x more views</li>
        </ul>
      </div>
      <BoostButtons eventId={id} currentFeatured={!!isFeatured} />
    </div>
  );
}

