import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_ROOT_URL || "https://GRID.org.uk";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/settings/",
          "/my-tickets",
          "/messages/",
          "/notifications",
          "/checkout/",
        ],
      },
    ],
    sitemap: SITE_URL + "/sitemap.xml",
    host: SITE_URL,
  };
}