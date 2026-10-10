import { Speaker, Disc3, Lightbulb, Music, TreePine, Car, Check } from "lucide-react";

const FACILITY_ICONS: Record<string, any> = {
  "sound system": Speaker,
  "dj booth": Disc3,
  "lighting": Lightbulb,
  "live stage": Music,
  "outdoor area": TreePine,
  "parking": Car,
};

const DEFAULT_FACILITIES = [
  "Sound system",
  "DJ booth",
  "Lighting",
  "Live stage",
];

export default function VenueFacilities({
  facilities,
}: {
  facilities?: string[] | null;
}) {
  const list = (facilities && facilities.length > 0)
    ? facilities
    : DEFAULT_FACILITIES;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold mb-4">Facilities</h2>
      <ul className="flex flex-wrap gap-2">
        {list.map((f) => {
          const key = f.toLowerCase();
          const IconCmp = FACILITY_ICONS[key] || Check;
          return (
            <li
              key={f}
              className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700"
            >
              <IconCmp className="h-3.5 w-3.5" />
              {f}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
