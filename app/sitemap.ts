import type { MetadataRoute } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { CITIES } from "@/lib/cities";
import { GENRES } from "@/lib/genres";

const SITE_URL = process.env.NEXT_PUBLIC_ROOT_URL || "https://ticketai.org.uk";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabase();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL,                  lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: SITE_URL + "/search",      lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: SITE_URL + "/venues",      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: SITE_URL + "/promoters",   lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
  ];

  const cityRoutes: MetadataRoute.Sitemap = CITIES.map((c) => ({
    url: SITE_URL + "/events/" + c.slug,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const genreRoutes: MetadataRoute.Sitemap = GENRES.map((g) => ({
    url: SITE_URL + "/events/" + g.slug,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const { data: events } = await supabase
    .from("events")
    .select("id, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(5000);

  const eventRoutes: MetadataRoute.Sitemap = (events ?? []).map((e) => ({
    url: SITE_URL + "/events/" + e.id,
    lastModified: new Date(e.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const { data: venues } = await supabase
    .from("venues")
    .select("id, created_at")
    .eq("status", "published")
    .limit(2000);

  const venueRoutes: MetadataRoute.Sitemap = (venues ?? []).map((v) => ({
    url: SITE_URL + "/venues/" + v.id,
    lastModified: new Date(v.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...cityRoutes,
    ...genreRoutes,
    ...eventRoutes,
    ...venueRoutes,
  ];
}