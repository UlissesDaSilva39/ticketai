import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "melbourne",
  name: "Melbourne",
  region: "Australia",
  blurb:
    "Laneway bars, live venues, and the best of Melbourne's famous cultural scene.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}