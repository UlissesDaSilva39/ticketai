import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { SavedEventCard } from "@/components/wallet/SavedEventCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Wallet — GRID",
  description: "Your saved events and ticket links, all in one place.",
};

type SavedEvent = {
  id: string;
  title: string;
  start_date: string;
  venue_name?: string | null;
  city?: string | null;
  hero_image?: string | null;
  ticket_url?: string | null;
  external_source?: string | null;
};

async function getSavedEvents(): Promise<SavedEvent[]> {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Try a saved_events table first; fall back to empty list.
    const { data, error } = await supabase
      .from("saved_events")
      .select("event_id, created_at, events(id, title, start_date, hero_image, ticket_url, external_source, venues(name, city))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error || !data) return [];

    return data
      .map((row: any) => {
        const ev = row.events;
        if (!ev) return null;
        return {
          id: ev.id,
          title: ev.title,
          start_date: ev.start_date,
          venue_name: ev.venues?.name ?? null,
          city: ev.venues?.city ?? null,
          hero_image: ev.hero_image ?? null,
          ticket_url: ev.ticket_url ?? null,
          external_source: ev.external_source ?? null,
        };
      })
      .filter(Boolean) as SavedEvent[];
  } catch {
    return [];
  }
}

export default async function WalletPage() {
  const saved = await getSavedEvents();

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <header className="mb-8">
        <p className="text-sm uppercase tracking-widest text-neutral-500">
          GRID / Wallet
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">
          Saved events.
        </h1>
        <p className="mt-3 text-neutral-600">
          Everything you saved, with links to the official ticket source.
        </p>
      </header>

      {saved.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
          <p className="text-neutral-700">You have not saved any events yet.</p>
          <Link
            href="/discover"
            className="mt-4 inline-block rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white"
          >
            Explore events
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {saved.map((ev) => (
            <li key={ev.id}>
              <SavedEventCard event={ev} />
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8 text-xs text-neutral-500">
        Ticket links open on the provider&rsquo;s site. GRID does not issue tickets.
      </p>
    </main>
  );
}