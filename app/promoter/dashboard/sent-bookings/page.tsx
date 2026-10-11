import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  ArrowUpRight,
  Music,
} from "lucide-react";

export const metadata: Metadata = { title: "Sent booking requests" };

export const dynamic = "force-dynamic";

type Booking = {
  id: string;
  artist_slug: string;
  date: string;
  venue: string | null;
  message: string | null;
  status: string;
  created_at: string;
  artists?: {
    name: string;
    genre: string | null;
    city: string | null;
    avatar_url: string | null;
    artist_type: string | null;
  } | null;
};

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "declined", label: "Declined" },
];

function statusBadge(status: string) {
  if (status === "accepted") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 text-green-700 px-3 py-1 text-xs font-medium">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Accepted
      </span>
    );
  }
  if (status === "declined") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 text-gray-600 px-3 py-1 text-xs font-medium">
        <XCircle className="h-3.5 w-3.5" />
        Declined
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 px-3 py-1 text-xs font-medium">
      <Clock className="h-3.5 w-3.5" />
      Pending
    </span>
  );
}

export default async function SentBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "all" } = await searchParams;

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/promoter/dashboard/sent-bookings`);
  }

  // Fetch all booking requests by this promoter
  const { data: bookings } = await supabase
    .from("booking_requests")
    .select("*")
    .eq("promoter_id", user.id)
    .order("created_at", { ascending: false });

  const allBookings = (bookings ?? []) as Booking[];

  // Enrich with artist details
  const slugs = Array.from(new Set(allBookings.map((b) => b.artist_slug)));
  let artistMap: Record<string, any> = {};

  if (slugs.length > 0) {
    const { data: artists } = await supabase
      .from("artists")
      .select("slug, name, genre, city, avatar_url, artist_type")
      .in("slug", slugs);

    (artists ?? []).forEach((a: any) => {
      artistMap[a.slug] = a;
    });

    allBookings.forEach((b) => {
      b.artists = artistMap[b.artist_slug] || null;
    });
  }

  // Filter by status tab
  const filtered =
    status === "all"
      ? allBookings
      : allBookings.filter((b) => b.status === status);

  const pending = allBookings.filter((b) => b.status === "pending").length;
  const accepted = allBookings.filter((b) => b.status === "accepted").length;
  const declined = allBookings.filter((b) => b.status === "declined").length;

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Sent booking requests
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track all the requests you&apos;ve sent to artists.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="text-xs text-gray-500">Pending</div>
            <div className="mt-1 text-2xl font-bold text-amber-600">
              {pending}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="text-xs text-gray-500">Accepted</div>
            <div className="mt-1 text-2xl font-bold text-green-600">
              {accepted}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="text-xs text-gray-500">Declined</div>
            <div className="mt-1 text-2xl font-bold text-gray-500">
              {declined}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="rounded-2xl border border-gray-200 bg-white p-1 flex mb-4">
          {STATUS_TABS.map((t) => (
            <Link
              key={t.key}
              href={
                t.key === "all"
                  ? "/promoter/dashboard/sent-bookings"
                  : `/promoter/dashboard/sent-bookings?status=${t.key}`
              }
              className={
                "flex-1 rounded-xl py-2 text-center text-sm font-medium transition " +
                (status === t.key
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-50")
              }
            >
              {t.label}
            </Link>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <Music className="mx-auto h-8 w-8 text-gray-400" />
            <div className="mt-3 text-sm font-medium text-gray-900">
              {status === "all"
                ? "No booking requests yet"
                : `No ${status} requests`}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {status === "all"
                ? "Send your first request from the booking marketplace."
                : "Try another filter."}
            </p>
            {status === "all" && (
              <Link
                href="/book/artist"
                className="mt-4 inline-block rounded-full bg-black px-4 py-2 text-xs font-medium text-white hover:bg-gray-900 transition"
              >
                Book an artist
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-start gap-4">
                  {b.artists?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={b.artists.avatar_url}
                      alt={b.artists.name}
                      className="h-14 w-14 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-black text-sm font-bold text-white flex-shrink-0">
                      {(b.artists?.name || b.artist_slug || "?")[0].toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/artist/${b.artist_slug}`}
                          className="text-base font-bold text-gray-900 hover:underline inline-flex items-center gap-1.5"
                        >
                          {b.artists?.name || b.artist_slug}
                          <ArrowUpRight className="h-3.5 w-3.5 text-gray-400" />
                        </Link>
                        {b.artists && (
                          <div className="mt-0.5 text-xs text-gray-500">
                            {[b.artists.artist_type, b.artists.genre, b.artists.city]
                              .filter(Boolean)
                              .join(" · ")}
                          </div>
                        )}
                      </div>
                      {statusBadge(b.status)}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(b.date).toLocaleDateString("en-GB", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {b.venue && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {b.venue}
                        </span>
                      )}
                    </div>

                    {b.message && (
                      <p className="mt-3 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                        {b.message}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2 items-center">
                      <Link
                        href={`/artist/${b.artist_slug}`}
                        className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium hover:bg-gray-50 transition"
                      >
                        View artist
                      </Link>
                      <Link
                        href={`/messages`}
                        className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium hover:bg-gray-50 transition"
                      >
                        Message
                      </Link>
                      <span className="text-xs text-gray-400 ml-1">
                        Sent{" "}
                        {new Date(b.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
