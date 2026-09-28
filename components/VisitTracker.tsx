"use client";

import { useEffect, useState } from "react";

export default function VisitTracker({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const key = "visit_tracked_" + new Date().toDateString();
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    fetch("/api/stats/track-visit", { method: "POST" })
      .then((r) => r.json())
      .then((data) => {
        if (data.total_visits) setCount(data.total_visits);
      })
      .catch(() => {});
  }, []);

  return (
    <p className="text-xs uppercase tracking-widest text-gray-500 mt-6">
      <span className="inline-block w-2 h-2 bg-[#00FF87] rounded-full animate-pulse mr-2" />
      {count.toLocaleString()} people have visited this page
    </p>
  );
}
