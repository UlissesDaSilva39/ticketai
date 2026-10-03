import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "new-york",
  name: "New York",
  region: "United States",
  blurb:
    "From Brooklyn warehouses to Manhattan jazz bars — the city that never sleeps.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}