import type { MetadataRoute } from "next";
import { createServerSupabase } from "@/lib/supabase/server";

const SITE_URL =
  process.env.NEXT_PUBLIC_ROOT_URL || "https://ticketai.org.uk";

export const revalidate = 3600; // regenerate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabase();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/search`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/venues`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/promoters`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/for-promoters`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/for-venues`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/refunds`, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Events
  const { data: events } = await supabase
    .from("events")
    .select("id, created_at")
    .eq("status", "published")
    .order("start_date", { ascending: false })
    .limit(5000);

  const eventPages: MetadataRoute.Sitemap = (events || []).map((e) => ({
    url: `${SITE_URL}/event/${e.id}`,
    lastModified: e.created_at ? new Date(e.created_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Venues
  const { data: venues } = await supabase
    .from("venues")
    .select("slug, created_at")
    .eq("status", "published")
    .not("slug", "is", null)
    .limit(5000);

  const venuePages: MetadataRoute.Sitemap = (venues || []).map((v) => ({
    url: `${SITE_URL}/venue/${v.slug}`,
    lastModified: v.created_at ? new Date(v.created_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Promoters
  const { data: promoters } = await supabase
    .from("promoters")
    .select("id, created_at")
    .limit(5000);

  const promoterPages: MetadataRoute.Sitemap = (promoters || []).map((p) => ({
    url: `${SITE_URL}/promoters/${p.id}`,
    lastModified: p.created_at ? new Date(p.created_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...eventPages,
    ...venuePages,
    ...promoterPages,
  ];
}