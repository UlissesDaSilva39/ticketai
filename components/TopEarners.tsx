"use client";
import { useRevenue } from "@/lib/hooks/useRevenue";
import { formatCurrency } from "@/lib/utils/formatCurrency";

interface Props {
  limit?: number;
}

export default function TopEarners({ limit = 3 }: Props) {
  const { sales, bookings, hydrated } = useRevenue();

  if (!hydrated) return null;

  const bySeller: Record<string, number> = {};
  for (const s of sales) {
    bySeller[s.sellerName] = (bySeller[s.sellerName] || 0) + (s.pricePence - s.commissionPence);
  }
  for (const b of bookings) {
    if (b.status === "confirmed") {
      bySeller[b.artistName] = (bySeller[b.artistName] || 0) + (b.pricePence - b.commissionPence);
    }
  }

  const ranked = Object.entries(bySeller)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit);

  const demo = [
    { name: "Sarah Jenkins", role: "Vocalist", earned: 1240000 },
    { name: "Studio X", role: "Engineer", earned: 980000 },
    { name: "Demo Producer", role: "Producer", earned: 620000 },
  ];

  const display = ranked.length > 0
    ? ranked.map(([name, pence]) => ({ name, role: "", earned: pence }))
    : demo;

  const totalPence = display.reduce((sum, d) => sum + d.earned, 0);
  const colorClasses = ["bg-pink-500", "bg-blue-500", "bg-emerald-500"];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white text-base">Top earners this week</h3>
        <span className="text-[10px] font-bold text-emerald-600 uppercase">Live</span>
      </div>
      <div className="space-y-3">
        {display.map((d, i) => (
          <div key={d.name} className="flex items-center gap-3">
            <div className="w-6 text-center text-xs font-bold text-gray-400">{i + 1}</div>
            <div className={`w-8 h-8 rounded-full ${colorClasses[i % colorClasses.length]} text-white grid place-items-center text-xs font-bold flex-shrink-0`}>
              {d.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{d.name}</p>
              {d.role && <p className="text-[10px] text-gray-500 truncate">{d.role}</p>}
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-emerald-600">{formatCurrency(d.earned)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800 flex justify-between text-xs">
        <span className="text-gray-500">Total paid out this week</span>
        <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(totalPence)}</span>
      </div>
    </div>
  );
}