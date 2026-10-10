import { Sparkles } from "lucide-react";

const DEFAULT_LOOKING_FOR = [
  "DJs",
  "Support acts",
  "Photographers",
  "Videographers",
  "Sponsors",
];

export default function PromoterLookingFor({
  lookingFor,
}: {
  lookingFor?: string[] | null;
}) {
  const list =
    lookingFor && lookingFor.length > 0 ? lookingFor : DEFAULT_LOOKING_FOR;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold mb-4 inline-flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-fuchsia-500" />
        Looking for
      </h2>
      <div className="flex flex-wrap gap-2">
        {list.map((item) => (
          <span
            key={item}
            className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700"
          >
            {item}
          </span>
        ))}
      </div>
      <div className="mt-5 pt-5 border-t border-gray-100">
        <a
          href="/opportunities"
          className="block w-full text-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition"
        >
          Post Opportunity
        </a>
      </div>
    </div>
  );
}
