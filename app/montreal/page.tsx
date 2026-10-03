import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "montreal",
  name: "Montreal",
  region: "Canada",
  blurb:
    "From Plateau to Mile End — Montreal's legendary festivals, clubs, and cultural scene.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}