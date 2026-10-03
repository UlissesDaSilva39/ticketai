import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_ROOT_URL || "https://ticketai.org.uk";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/organizer/",
          "/promoter/dashboard/",
          "/venue/dashboard/",
          "/my-tickets/",
          "/checkout",
          "/confirmation",
          "/login",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}