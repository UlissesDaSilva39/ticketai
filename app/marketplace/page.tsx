"use client";
import { useState } from "react";
import Link from "next/link";
import { PlayIcon, MarketIcon, BookmarkIcon, UsersIcon, CalendarSVG, NoteIcon } from "@/components/MusicIcons";

export default function Page() {
  const [isPlaying, setIsPlaying] = useState(false);

  const products = [
    { title: "Dark Techno Sample Pack Vol. 1", seller: "Ulisses Silva", price: "£24.99", fee: "£2.50", type: "Sample Pack", color: "bg-emerald-800" },
    { title: "House Beat - 'Midnight' (Lease)", seller: "Demo Producer", price: "£49.99", fee: "£5.00", type: "Beat", color: "bg-blue-800" },
    { title: "Mixing & Mastering (1 Track)", seller: "Studio X", price: "£100.00", fee: "£10.00", type: "Service", color: "bg-purple-800" },
    { title: "GRID Logo Tour T-Shirt", seller: "GRID Official", price: "£19.99", fee: "£2.00", type: "Merch", color: "bg-zinc-800" },
  ];

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 py-6 grid grid-cols-12 gap-6">
        <aside className="col-span-12 lg:col-span-3 space-y-3 hidden lg:block">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-emerald-600 to-emerald-500" />
            <div className="p-5 -mt-10 text-center relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-800 text-white grid place-items-center font-bold text-2xl ring-4 ring-white dark:ring-zinc-900 mb-3">U</div>
              <p className="font-bold text-gray-900 dark:text-white text-lg">Ulisses Silva</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Music Producer &amp; DJ</p>
            </div>
            <div className="border-t border-gray-100 dark:border-zinc-800 p-4">
              <ul className="space-y-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <li><Link href="/marketplace" className="flex items-center gap-3 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 transition-colors"><MarketIcon className="w-5 h-5 text-emerald-600" /> <span>Marketplace</span></Link></li>
                <li><Link href="/saved" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><BookmarkIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Saved Items</span></Link></li>
                <li><Link href="/groups" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><UsersIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Groups</span></Link></li>
                <li><Link href="/events" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><CalendarSVG className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Events</span></Link></li>
              </ul>
            </div>
          </div>
        </aside>

        <main className="col-span-12 lg:col-span-9 space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
            <h1 className="font-bold text-gray-900 dark:text-white text-2xl flex items-center gap-2"><MarketIcon className="w-6 h-6 text-emerald-600" /> GRID Marketplace</h1>
            <p className="text-sm text-gray-500 mt-1">Buy and sell beats, sample packs, merch, and studio services.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((p, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden group">
                <div className={`h-40 ${p.color} flex items-center justify-center relative`}>
                  <div className="w-16 h-16 bg-black/20 rounded-full flex items-center justify-center"><NoteIcon className="w-8 h-8 text-white" /></div>
                  <span className="absolute top-3 right-3 bg-white/90 text-gray-900 text-xs font-bold px-2 py-1 rounded-md">{p.type}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white truncate">{p.title}</h3>
                  <p className="text-sm text-gray-500">by {p.seller}</p>
                  <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <div><p className="text-xs text-gray-400 uppercase">Price</p><p className="font-bold text-emerald-600 text-lg">{p.price}</p></div>
                    <div className="text-right"><p className="text-[10px] text-gray-400 uppercase">GRID Fee</p><p className="text-xs text-gray-500">{p.fee}</p></div>
                  </div>
                  <button className="w-full mt-4 bg-emerald-50 text-emerald-700 font-bold text-sm py-2 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">Buy Now</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}