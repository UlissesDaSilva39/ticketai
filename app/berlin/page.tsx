import { CityEventsPage, cityMetadata, type CityMeta } from "@/components/CityPage";

const city: CityMeta = {
  slug: "berlin",
  name: "Berlin",
  region: "Germany",
  blurb:
    "The world capital of techno — from Berghain to Sisyphos and everything between.",
};

export const metadata = cityMetadata(city);

export default function Page() {
  return <CityEventsPage city={city} />;
}