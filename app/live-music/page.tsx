import { GenreEventsPage, genreMetadata, type GenreMeta } from "@/components/GenrePage";

const genre: GenreMeta = {
  slug: "live-music",
  name: "Live Music",
  blurb:
    "Bands, solo artists, and everything in between — live music near you.",
  keywords: ["live", "concert", "band", "gig"],
};

export const metadata = genreMetadata(genre);

export default function Page() {
  return <GenreEventsPage genre={genre} />;
}