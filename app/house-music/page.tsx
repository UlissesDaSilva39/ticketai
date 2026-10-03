import { GenreEventsPage, genreMetadata, type GenreMeta } from "@/components/GenrePage";

const genre: GenreMeta = {
  slug: "house-music",
  name: "House Music",
  blurb:
    "From deep and soulful to tech house — find the best house nights near you.",
  keywords: ["house", "deep house", "tech house", "DJ", "club night"],
};

export const metadata = genreMetadata(genre);

export default function Page() {
  return <GenreEventsPage genre={genre} />;
}