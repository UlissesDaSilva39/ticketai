import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "birmingham",
  name: "Birmingham",
  region: "United Kingdom",
  blurb:
    "From Digbeth warehouses to the Jewellery Quarter — discover what's happening in Birmingham.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}