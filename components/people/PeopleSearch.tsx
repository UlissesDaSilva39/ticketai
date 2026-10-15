"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function PeopleSearch({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initial);

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (q) params.set("q", q);
      else params.delete("q");
      const qs = params.toString();
      router.replace("/people" + (qs ? "?" + qs : ""));
    }, 300);
    return () => clearTimeout(t);
  }, [q, router]);

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name, @username, city, or genre..."
        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm focus:border-black focus:outline-none"
      />
    </div>
  );
}