 import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Promoter = {
  id: string;
  user_id: string;
  display_name: string;
  bio: string | null;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  city: string | null;
  commission_rate: number | null;
  verified: boolean;
  created_at: string;
};

type PromoterEvent = {
  id: string;
  event_id: string;
  referral_code: string | null;
  commission_rate: number | null;
  status: string | null;
  clicks: number | null;
  conversions: number | null;
  revenue: number | null;
  events: {
    id: string;
    title: string;
    start_date: string | null;
    hero_image: string | null;
    status: string;
    ticket_types: Array<{ name: string; price: number }> | null;
  } | null;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: promoter } = await supabase
    .from("promoters")
    .select("display_name, bio, city")
    .eq("id", id)
    .maybeSingle();

  if (!promoter) return { title: "Promoter not found" };

  return {
    title: promoter.display_name,
    description:
      promoter.bio ||
      (promoter.city
        ? "Promoter on TicketAI · " + promoter.city
        : "Promoter on TicketAI"),
  };
}

function formatDate(value: string | null) {
  if (!value) return "TBC";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function money(v: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(Number(v || 0));
}

export default async function PromoterProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data: promoter } = await supabase
    .from("promoters")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!promoter) return notFound();

  const p = promoter as Promoter;

  // Which user is viewing?
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let viewerRole: string | null = null;
  if (user) {
    const { data: viewerProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    viewerRole = viewerProfile?.role ?? null;
  }

  const isOwner = user?.id === p.user_id;
  const isAdmin = viewerRole === "admin";
  const showStats = isOwner || isAdmin;

  const { data: promoterEvents } = await supabase
    .from("promoter_events")
    .select(
      "id, event_id, referral_code, commission_rate, status, clicks, conversions, revenue, events:event_id (id, title, start_date, hero_image, status, ticket_types)"
    )
    .eq("promoter_id", p.id)
    .order("created_at", { ascending: false });

  const links = (promoterEvents || []) as unknown as PromoterEvent[];

  const upcoming = links.filter((l) => {
    if (!l.events) return false;
    if (l.events.status !== "published") return false;
    if (!l.events.start_date) return false;
    return new Date(l.events.start_date).getTime() > Date.now();
  });

  const past = links.filter((l) => {
    if (!l.events) return false;
    if (!l.events.start_date) return false;
    return new Date(l.events.start_date).getTime() <= Date.now();
  });

  const totalClicks = links.reduce((s, l) => s + (l.clicks || 0), 0);
  const totalConversions = links.reduce((s, l) => s + (l.conversions || 0), 0);
  const totalRevenue = links.reduce((s, l) => s + Number(l.revenue || 0), 0);

  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {p.verified && (
              <span className="rounded-full bg-black text-white px-3 py-1 text-xs uppercase tracking-widest">
                Verified
              </span>
            )}
            {p.city && (
              <span className="text-sm uppercase tracking-widest text-gray-500">
                {p.city}
              </span>
            )}
            <span className="text-sm uppercase tracking-widest text-gray-400">
              Promoter since{" "}
              {new Date(p.created_at).toLocaleDateString("en-GB", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <h1
            className="text-6xl md:text-7xl font-bold uppercase leading-none tracking-tight"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            {p.display_name}
          </h1>

          {p.bio && (
            <p className="mt-6 text-lg text-gray-700 max-w-3xl">{p.bio}</p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {p.instagram && (
              <a
                href={"https://instagram.com/" + p.instagram}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-black px-5 py-2 text-sm font-medium hover:bg-black hover:text-white"
              >
                Instagram @{p.instagram}
              </a>
            )}
            {p.tiktok && (
              <a
                href={"https://tiktok.com/@" + p.tiktok}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-black px-5 py-2 text-sm font-medium hover:bg-black hover:text-white"
              >
                TikTok @{p.tiktok}
              </a>
            )}
            {p.youtube && (
              <a
                href={"https://youtube.com/@" + p.youtube}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-black px-5 py-2 text-sm font-medium hover:bg-black hover:text-white"
              >
                YouTube {p.youtube}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* STATS — only visible to the profile owner and admins */}
      {showStats && (
        <section className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border bg-white p-5">
              <p className="text-sm text-gray-500">Events promoted</p>
              <p className="mt-2 text-3xl font-bold">{links.length}</p>
            </div>
            <div className="rounded-xl border bg-white p-5">
              <p className="text-sm text-gray-500">Total clicks</p>
              <p className="mt-2 text-3xl font-bold">{totalClicks}</p>
            </div>
            <div className="rounded-xl border bg-white p-5">
              <p className="text-sm text-gray-500">Conversions</p>
              <p className="mt-2 text-3xl font-bold">{totalConversions}</p>
            </div>
            <div className="rounded-xl border bg-white p-5">
              <p className="text-sm text-gray-500">Revenue driven</p>
              <p className="mt-2 text-3xl font-bold">{money(totalRevenue)}</p>
            </div>
          </div>
        </section>
      )}

      {/* UPCOMING EVENTS */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2
          className="text-3xl font-bold uppercase mb-6"
          style={{ fontFamily: "var(--font-antonio)" }}
        >
          Upcoming events
        </h2>

        {upcoming.length === 0 ? (
          <div className="rounded-xl border bg-gray-50 p-10 text-center text-gray-500">
            No upcoming events yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((row) => {
              const e = row.events;
              if (!e) return null;
              const prices = (e.ticket_types || []).map((t) => t.price);
              const from = prices.length > 0 ? Math.min(...prices) : 0;
              return (
                <Link
                  key={row.id}
                  href={"/event/" + e.id}
                  className="group block overflow-hidden rounded-xl border bg-white transition hover:border-black"
                >
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    {e.hero_image ? (
                      <img
                        src={e.hero_image}
                        alt={e.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold leading-tight">
                      {e.title}
                    </h3>
                    <p className="mt-1 text-xs uppercase tracking-widest text-gray-500">
                      {formatDate(e.start_date)}
                    </p>
                    {from > 0 && (
                      <p className="mt-2 text-sm font-medium">
                        From £{from.toFixed(2)}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* PAST EVENTS */}
      {past.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <h2
            className="text-3xl font-bold uppercase mb-6"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Past events
          </h2>
          <div className="space-y-2">
            {past.map((row) => {
              const e = row.events;
              if (!e) return null;
              return (
                <Link
                  key={row.id}
                  href={"/event/" + e.id}
                  className="flex items-center justify-between rounded-lg border bg-white px-5 py-3 text-sm hover:border-black"
                >
                  <span className="font-medium truncate">{e.title}</span>
                  <span className="ml-4 shrink-0 text-gray-500">
                    {formatDate(e.start_date)}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}