"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const DEFAULT_CITIES = [
  "London",
  "Manchester",
  "Birmingham",
  "Bristol",
  "Leeds",
  "Glasgow",
  "Brighton",
];

export function NearMeFilter({ cities }: { cities?: string[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("city") ?? "";

  const list = useMemo(() => {
    const source = cities && cities.length > 0 ? cities : DEFAULT_CITIES;
    return ["All", ...source];
  }, [cities]);

  function choose(city: string) {
    const next = new URLSearchParams(params.toString());
    if (city === "All") {
      next.delete("city");
    } else {
      next.set("city", city);
    }
    router.push(`?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {list.map((city) => {
        const active = (city === "All" && !current) || city === current;
        return (
          <button
            key={city}
            type="button"
            onClick={() => choose(city)}
            className={
              "whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition " +
              (active
                ? "bg-neutral-900 font-semibold text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200")
            }
          >
            {city}
          </button>
        );
      })}
    </div>
  );
}