import { createServerSupabase } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import LineupEditor from "@/components/LineupEditor";

export const dynamic = "force-dynamic";

export default async function LineupPage({
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
    .select("id, title, organizer_id, lineup")
    .eq("id", id)
    .maybeSingle();

  if (!event) return notFound();
  if (event.organizer_id !== user.id) redirect("/");

  const initial = Array.isArray(event.lineup) ? event.lineup : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href={"/organizer/events/" + event.id}
        className="text-sm text-gray-500 hover:underline"
      >
        ← Back to event dashboard
      </Link>
      <h1
        className="text-5xl font-bold uppercase mt-4 mb-2"
        style={{ fontFamily: "var(--font-antonio)" }}
      >
        Lineup
      </h1>
      <p className="text-gray-600 mb-8">{event.title}</p>
      <LineupEditor eventId={event.id} initialLineup={initial} />
    </div>
  );
}
