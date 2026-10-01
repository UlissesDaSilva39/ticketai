import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function VenueDashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return notFound();

  const { data: venues } = await supabase
    .from("venues")
    .select("*")
    .eq("organizer_id", user.id)
    .order("created_at", { ascending: false });

  const list = venues ?? [];

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold uppercase" style={{ fontFamily: "var(--font-antonio)" }}>
              My Venues
            </h1>
            <p className="mt-2 text-gray-600">
              Manage the venues you have listed on TicketAI.
            </p>
          </div>
          <Link
            href="/venues/join"
            className="rounded-full bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800"
          >
            + List new venue
          </Link>
        </div>

        {list.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center">
            <p className="text-lg text-gray-500">
              You have not listed any venues yet.
            </p>
            <Link
              href="/venues/join"
              className="mt-6 inline-block rounded-full bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800"
            >
              List your first venue
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {list.map((v) => (
              <Link
                key={v.id}
                href={"/venue/" + v.slug}
                className="rounded-xl border bg-white p-6 transition hover:border-black"
              >
                <p className="text-sm uppercase tracking-widest text-gray-500">
                  {v.venue_type || "Venue"}
                </p>
                <h2 className="mt-1 text-2xl font-bold">{v.name}</h2>
                <p className="mt-1 text-gray-600">{v.city}</p>
                {v.capacity ? (
                  <p className="mt-3 text-sm text-gray-500">
                    Capacity: {v.capacity}
                  </p>
                ) : null}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
