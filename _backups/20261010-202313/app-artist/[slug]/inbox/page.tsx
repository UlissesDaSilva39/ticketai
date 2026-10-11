import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Artist inbox" };
export const dynamic = "force-dynamic";

export default async function InboxPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/artist/${slug}/inbox`);
  }

  const { data: artist } = await supabase
    .from("artists")
    .select("owner_id, name, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (!artist) notFound();
  if (artist.owner_id !== user.id) notFound();

  const [bookingsRes, messagesRes] = await Promise.all([
    supabase
      .from("booking_requests")
      .select("*")
      .eq("artist_slug", slug)
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("artist_messages")
      .select("*")
      .eq("artist_slug", slug)
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const bookings = bookingsRes.data ?? [];
  const messages = messagesRes.data ?? [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-3">
              Artist dashboard
            </p>
            <h1
              className="text-4xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              Inbox
            </h1>
            <p className="text-gray-600 mt-2">
              Booking requests and messages for {artist.name}.
            </p>
          </div>
          <Link
            href={`/artist/${slug}/edit`}
            className="text-sm text-gray-500 hover:text-black whitespace-nowrap"
          >
            Edit profile ↗
          </Link>
        </div>

        <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg font-semibold">Booking requests</h2>
            <span className="text-xs text-gray-500">
              {bookings.length} {bookings.length === 1 ? "request" : "requests"}
            </span>
          </div>

          {bookings.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">
              No booking requests yet. When promoters or venues submit a
              request from your profile, it will appear here.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {bookings.map((b) => (
                <li key={b.id} className="py-4">
                  <div className="flex justify-between items-baseline mb-1 gap-3">
                    <span className="font-medium text-sm">
                      {b.name}
                      {b.venue ? (
                        <span className="text-gray-500 font-normal">
                          {" "}
                          · {b.venue}
                        </span>
                      ) : null}
                    </span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(b.date).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        timeZone: "Europe/London",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    <a href={`mailto:${b.email}`} className="hover:underline">
                      {b.email}
                    </a>
                    {" · submitted "}
                    {new Date(b.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      timeZone: "Europe/London",
                    })}
                  </p>
                  {b.message && (
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                      {b.message}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg font-semibold">Messages</h2>
            <span className="text-xs text-gray-500">
              {messages.length} {messages.length === 1 ? "message" : "messages"}
            </span>
          </div>

          {messages.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">
              No messages yet. Direct messages sent from your profile will
              appear here.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {messages.map((m) => (
                <li key={m.id} className="py-4">
                  <div className="flex justify-between items-baseline mb-1 gap-3">
                    <span className="font-medium text-sm">{m.name}</span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(m.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        timeZone: "Europe/London",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    <a href={`mailto:${m.email}`} className="hover:underline">
                      {m.email}
                    </a>
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {m.message}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
