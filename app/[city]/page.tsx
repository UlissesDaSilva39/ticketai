import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CITIES, getCity } from "@/lib/cities";
import { loadCityData } from "@/lib/city-data";
import CityLanding from "@/components/city/CityLanding";

type Props = { params: Promise<{ city: string }> };

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) return { title: "Not found" };
  return {
    title: city.name + " events, venues & artists",
    description: city.blurb,
    openGraph: {
      title: city.name + " on GRID",
      description: city.blurb,
      type: "website",
    },
  };
}

export default async function TopLevelCityPage({ params }: Props) {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();

  const { venues, events, artists } = await loadCityData(city);

  return <CityLanding city={city} venues={venues} events={events} artists={artists} />;
}
