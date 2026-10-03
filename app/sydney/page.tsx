import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "sydney",
  name: "Sydney",
  region: "Australia",
  blurb:
    "Harbour views, beach clubs, and the best of Sydney's music and nightlife scene.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}