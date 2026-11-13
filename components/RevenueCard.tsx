"use client";
import { useRevenue } from "@/lib/hooks/useRevenue";

export default function RevenueCard() {
  const { sales, bookings, totals, hydrated } = useRevenue();

  if (!hydrated) return null;

  const earnedPounds = (totals.marketplaceRevenuePence / 100).toFixed(0);
  const bookingsPounds = (totals.bookingRevenuePence / 100).toFixed(0);
  const totalPounds = (totals.platformTotalPence / 100).toFixed(0);
  const salesCount = sales.length;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-zinc-900 rounded-xl border border-emerald-200 dark:border-emerald-900/40 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm">Your earnings</h3>
        <span className="text-xs font-bold text-emerald-600">£{totalPounds} total</span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">£{earnedPounds}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wide">Marketplace</p>
          <p className="text-[10px] text-gray-400 mt-0.5">{salesCount} sale{salesCount === 1 ? "" : "s"}</p>
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">£{bookingsPounds}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wide">Bookings</p>
          <p className="text-[10px] text-gray-400 mt-0.5">{confirmedBookings} confirmed</p>
        </div>
        <div>
          <p className="text-xl font-bold text-emerald-600">£{totalPounds}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wide">Paid out</p>
          <p className="text-[10px] text-gray-400 mt-0.5">this month</p>
        </div>
      </div>
      <button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition-colors">
        Withdraw →
      </button>
    </div>
  );
}