"use client";
import { useState } from "react";
import { PromoteMerchModal } from "@/components/promote/PromoteMerchModal";

export default function ArtistAnalyticsPage() {
  const [open, setOpen] = useState(false);

  const kpis = [
    { label: "Profile Views", value: "1,284", delta: "+24%" },
    { label: "Followers",     value: "+48",   delta: "+12%" },
    { label: "Messages",      value: "7 new", delta: "+40%" },
    { label: "Bookings",      value: "3 pending", delta: "2 accepted" },
  ];

  return (
    <div className="mx-auto max-w-5xl p-6 text-neutral-100">
      <h1 className="text-2xl font-semibold">Artist Analytics · DJ POXY</h1>
      <p className="text-sm text-neutral-400">Last 30 days</p>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {kpis.map(k => (
          <div key={k.label} className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
            <p className="text-xs text-neutral-400">{k.label}</p>
            <p className="text-xl font-semibold">{k.value}</p>
            <p className="text-xs text-emerald-400">{k.delta}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
        <p className="mb-2 text-sm font-semibold">Profile Views Over Time</p>
        <div className="h-32 rounded-lg bg-gradient-to-r from-neutral-800 to-neutral-700" />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
          <p className="mb-2 text-sm font-semibold">Where Fans Are</p>
          <ul className="text-sm text-neutral-300">
            <li>London — 62%</li>
            <li>Manchester — 18%</li>
            <li>Berlin — 12%</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
          <p className="mb-2 text-sm font-semibold">Traffic Sources</p>
          <ul className="text-sm text-neutral-300">
            <li>Search — 44%</li>
            <li>Direct — 32%</li>
            <li>Social — 24%</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black">
          Promote merch
        </button>
        <button className="rounded-lg border border-neutral-700 px-4 py-2 text-sm">Download CSV</button>
        <button className="rounded-lg border border-neutral-700 px-4 py-2 text-sm">Export PDF</button>
      </div>

      <PromoteMerchModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}