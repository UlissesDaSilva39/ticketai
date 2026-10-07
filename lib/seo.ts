import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_ROOT_URL || "https://ticketai.org.uk";

export function buildMetadata(opts: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
}): Metadata {
  const url = SITE_URL + opts.path;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: "TicketAI",
      type: "website",
      images: opts.image ? [{ url: opts.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: opts.image ? [opts.image] : undefined,
    },
  };
}