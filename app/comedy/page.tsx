import { GenreEventsPage, genreMetadata, type GenreMeta } from "@/components/GenrePage";

const genre: GenreMeta = {
  slug: "comedy",
  name: "Comedy",
  blurb:
    "Stand-up, improv, and everything funny — find comedy nights near you.",
  keywords: ["comedy", "stand-up", "stand up", "improv"],
};

export const metadata = genreMetadata(genre);

export default function Page() {
  return <GenreEventsPage genre={genre} />;
}