import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import FollowButton from "@/components/FollowButton";
import PromoterLookingFor from "@/components/promoter/PromoterLookingFor";
import {
  MapPin,
  Calendar,
  Mail,
  Phone,
  Globe,
  Instagram,
  Youtube,
  Music,
  Users,
} from "lucide-react";

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
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
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
    city: string | null;
    venue_name: string | null;
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
        ? "Promoter · " + promoter.city
        : "Promoter on GRID"),
  };
}

function formatDate(value: string | null) {
  if (!value) return "TBC";
  return new Date(value).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
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

  const { data: promoterEvents } = await supabase
    .from("promoter_events")
    .select(
      "id, event_id, referral_code, commission_rate, status, clicks, conversions, revenue, events:event_id (id, title, start_date, hero_image, status, city, venue_name, ticket_types)"
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

  const initials = (p.display_name || "?")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const yearsActive = Math.max(
    1,
    new Date().getFullYear() - new Date(p.created_at).getFullYear()
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-2xl bg-black text-white grid place-items-center text-2xl font-bold flex-shrink-0">
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  {p.display_name}
                </h1>
                {p.verified && (
                  <span className="rounded-full bg-black text-white px-3 py-0.5 text-[10px] uppercase tracking-widest font-semibold">
                    Verified
                  </span>
                )}
              </div>

              {/* Chips */}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 text-xs font-medium bg-gray-100 border border-gray-200 rounded-full">
                  Promoter
                </span>
                {p.city && (
                  <span className="px-3 py-1 text-xs font-medium bg-gray-100 border border-gray-200 rounded-full inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {p.city}
                  </span>
                )}
                <span className="px-3 py-1 text-xs font-medium bg-gray-100 border border-gray-200 rounded-full inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {yearsActive} {yearsActive === 1 ? "year" : "years"} active
                </span>
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-wrap gap-3">
                <FollowButton
                  targetType="promoter"
                  targetId={p.id}
                  initialCount={0}
                  label="Follow"
                  variant="dark"
                />
                {p.contact_email && (
                  <a
                    href={"mailto:" + p.contact_email}
                    className="px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-full hover:bg-gray-50 transition inline-flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Message
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            {/* ABOUT */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-3">About</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {p.bio || "No description yet."}
              </p>
            </section>

            {/* STATS — owner/admin only */}
            {(isOwner || isAdmin) && (
              <section className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">Your stats</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="text-xs text-gray-500">Events</div>
                    <div className="mt-1 text-2xl font-bold text-gray-900">
                      {links.length}
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="text-xs text-gray-500">Clicks</div>
                    <div className="mt-1 text-2xl font-bold text-gray-900">
                      {links.reduce((s, l) => s + (l.clicks || 0), 0)}
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="text-xs text-gray-500">Conversions</div>
                    <div className="mt-1 text-2xl font-bold text-gray-900">
                      {links.reduce((s, l) => s + (l.conversions || 0), 0)}
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="text-xs text-gray-500">Revenue</div>
                    <div className="mt-1 text-2xl font-bold text-gray-900">
                      £
                      {links
                        .reduce((s, l) => s + Number(l.revenue || 0), 0)
                        .toLocaleString("en-GB", { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* UPCOMING EVENTS */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-lg font-semibold inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Upcoming events
                </h2>
                {upcoming.length > 0 && (
                  <a
                    href="/events"
                    className="text-sm text-gray-500 hover:text-black"
                  >
                    See all
                  </a>
                )}
              </div>

              {upcoming.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                  <Calendar className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="mt-3 text-sm font-medium text-gray-900">
                    No upcoming events yet
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Follow {p.display_name} to get notified when they announce new events.
                  </p>
                  <a
                    href="/events"
                    className="mt-4 inline-block rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-900 transition"
                  >
                    Explore events
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {upcoming.map((row) => {
                    const e = row.events;
                    if (!e) return null;
                    const prices = (e.ticket_types || []).map((t) => t.price);
                    const from = prices.length > 0 ? Math.min(...prices) : 0;
                    return (
                      <Link
                        key={row.id}
                        href={"/event/" + e.id}
                        className="group block overflow-hidden rounded-xl border border-gray-100 bg-white transition hover:border-black"
                      >
                        <div className="relative h-40 overflow-hidden bg-gray-100">
                          {e.hero_image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={e.hero_image}
                              alt={e.title}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          )}
                        </div>
                        <div className="p-4">
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {e.title}
                          </div>
                          <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(e.start_date)}
                            </span>
                            {e.city && (
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {e.city}
                              </span>
                            )}
                          </div>
                          {from > 0 && (
                            <div className="mt-2 text-sm font-medium text-gray-900">
                              From £{from.toFixed(2)}
                            </div>
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
              <section className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4 inline-flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  Past events
                </h2>
                <ul className="divide-y divide-gray-100">
                  {past.slice(0, 8).map((row) => {
                    const e = row.events;
                    if (!e) return null;
                    return (
                      <li key={row.id} className="py-2.5">
                        <Link
                          href={"/event/" + e.id}
                          className="flex items-center justify-between hover:underline"
                        >
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {e.title}
                          </span>
                          <span className="text-xs text-gray-500 ml-4 shrink-0">
                            {formatDate(e.start_date)}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {/* LOOKING FOR */}
            <PromoterLookingFor lookingFor={null} />
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            {p.city && (
              <section className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Location
                </h3>
                <p className="text-sm inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  {p.city}
                </p>
              </section>
            )}

            {/* Socials */}
            {(p.instagram || p.tiktok || p.youtube || p.website) && (
              <section className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Links
                </h3>
                <ul className="space-y-2 text-sm">
                  {p.website && (
                    <li>
                      <a
                        href={p.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 hover:underline"
                      >
                        <Globe className="h-3.5 w-3.5 text-gray-400" />
                        Website
                      </a>
                    </li>
                  )}
                  {p.instagram && (
                    <li>
                      <a
                        href={"https://instagram.com/" + p.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 hover:underline"
                      >
                        <Instagram className="h-3.5 w-3.5 text-gray-400" />
                        Instagram
                      </a>
                    </li>
                  )}
                  {p.tiktok && (
                    <li>
                      <a
                        href={"https://tiktok.com/@" + p.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 hover:underline"
                      >
                        TikTok
                      </a>
                    </li>
                  )}
                  {p.youtube && (
                    <li>
                      <a
                        href={"https://youtube.com/@" + p.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 hover:underline"
                      >
                        <Youtube className="h-3.5 w-3.5 text-gray-400" />
                        YouTube
                      </a>
                    </li>
                  )}
                </ul>
              </section>
            )}

            {/* Contact */}
            {(p.contact_email || p.contact_phone) && (
              <section className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Contact
                </h3>
                <ul className="space-y-2 text-sm">
                  {p.contact_email && (
                    <li>
                      <a
                        href={`mailto:${p.contact_email}`}
                        className="inline-flex items-center gap-2 hover:underline"
                      >
                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                        {p.contact_email}
                      </a>
                    </li>
                  )}
                  {p.contact_phone && (
                    <li>
                      <a
                        href={`tel:${p.contact_phone}`}
                        className="inline-flex items-center gap-2 hover:underline"
                      >
                        <Phone className="h-3.5 w-3.5 text-gray-400" />
                        {p.contact_phone}
                      </a>
                    </li>
                  )}
                </ul>
              </section>
            )}

            {/* Details */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Details
              </h3>
              <dl className="text-sm space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Type</dt>
                  <dd>Promoter</dd>
                </div>
                {p.city && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">City</dt>
                    <dd>{p.city}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-500">Active since</dt>
                  <dd>
                    {new Date(p.created_at).toLocaleDateString("en-GB", {
                      month: "short",
                      year: "numeric",
                    })}
                  </dd>
                </div>
              </dl>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
