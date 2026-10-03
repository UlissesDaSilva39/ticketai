import { GenreEventsPage, genreMetadata, type GenreMeta } from "@/components/GenrePage";

const genre: GenreMeta = {
  slug: "techno",
  name: "Techno",
  blurb:
    "Warehouse raves, dark rooms, and relentless kick drums — techno events near you.",
  keywords: ["techno", "rave", "warehouse", "electronic music"],
};

export const metadata = genreMetadata(genre);

export default function Page() {
  return <GenreEventsPage genre={genre} />;
}