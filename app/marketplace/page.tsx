"use client";
import { useState } from "react";
import Link from "next/link"; // IMPORTED LINK
import { PlayIcon, MarketIcon, BookmarkIcon, UsersIcon, CalendarSVG, NoteIcon } from "@/components/MusicIcons";

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState("All");

  const products = [
    {
      id: 1,
      title: "Dark Techno Sample Pack Vol. 1",
      seller: "Ulisses Silva",
      price: "£24.99",
      fee: "£2.50",
      type: "Sample Pack",
      image: "bg-emerald-800",
      icon: <NoteIcon className="w-8 h-8 text-emerald-400" />
    },
    {
      id: 2,
      title: "House Beat - 'Midnight' (Lease)",
      seller: "Demo Producer",
      price: "£49.99",
      fee: "£5.00",
      type: "Beat",
      image: "bg-blue-800",
      icon: <PlayIcon className="w-8 h-8 text-blue-400" />
    },
    {
      id: 3,
      title: "Mixing & Mastering (1 Track)",
      seller: "Studio X",
      price: "£100.00",
      fee: "£10.00",
      type: "Service",
      image: "bg-purple-800",
      icon: <UsersIcon className="w-8 h-8 text-purple-400" />
    },
    {
      id: 4,
      title: "GRID Logo Tour T-Shirt",
      seller: "GRID Official",
      price: "£19.99",
      fee: "£2.00",
      type: "Merch",
      image: "bg-zinc-800",
      icon: <MarketIcon className="w-8 h-8 text-zinc-400" />
    }
  ];

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 py-6 grid grid-cols-12 gap-6">

        {/* LEFT COLUMN: Sidebar */}
        <aside className="col-span-12 lg:col-span-3 space-y-3 hidden lg:block">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-emerald-600 to-emerald-500" />
            <div className="p-5 -mt-10 text-center relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-800 text-white grid place-items-center font-bold text-2xl ring-4 ring-white dark:ring-zinc-900 mb-3">U</div>
              <p className="font-bold text-gray-900 dark:text-white text-lg">Ulisses Silva</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Music Producer &amp; DJ</p>
              <p className="text-xs text-gray-500 mt-1">London, UK</p>
              
              <div className="mt-5 space-y-2">
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-full transition-colors flex items-center justify-center gap-2">
                  <PlayIcon className="w-3.5 h-3.5" /> Play Latest Track
                </button>
                <button className="w-full border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 text-sm font-bold py-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                  View EPK
                </button>
              </div>
            </div>

            {/* FUNCTIONAL SIDEBAR LINKS */}
            <div className="border-t border-gray-100 dark:border-zinc-800 p-4">
              <ul className="space-y-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <li>
                  <Link href="/marketplace" className="flex items-center gap-3 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 transition-colors">
                    <MarketIcon className="w-5 h-5 text-emerald-600" /> 
                    <span>Marketplace</span>
                  </Link>
                </li>
                <li>
                  <Link href="/saved" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group">
                    <BookmarkIcon className="w-5 h-5 text-emerald-600" /> 
                    <span className="group-hover:text-emerald-700">Saved Items</span>
                  </Link>
                </li>
                <li>
                  <Link href="/groups" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group">
                    <UsersIcon className="w-5 h-5 text-emerald-600" /> 
                    <span className="group-hover:text-emerald-700">Groups</span>
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group">
                    <CalendarSVG className="w-5 h-5 text-emerald-600" /> 
                    <span className="group-hover:text-emerald-700">Events</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* MAIN COLUMN: Marketplace */}
        <main className="col-span-12 lg:col-span-9 space-y-4">
          
          {/* Header & Search */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-2xl flex items-center gap-2">
                <MarketIcon className="w-6 h-6 text-emerald-600" /> GRID Marketplace
              </h1>
              <p className="text-sm text-gray-500 mt-1">Buy and sell beats, sample packs, merch, and studio services.</p>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors shadow-sm">
              + Sell on GRID
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["All", "Beats", "Sample Packs", "Services", "Merch"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab 
                    ? "bg-emerald-600 text-white" 
                    : "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden group hover:border-emerald-500 transition-colors cursor-pointer">
                
                {/* Image Placeholder */}
                <div className={`h-40 ${p.image} flex items-center justify-center relative`}>
                  <div className="w-16 h-16 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    {p.icon}
                  </div>
                  <span className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 text-gray-900 dark:text-white text-xs font-bold px-2 py-1 rounded-md">
                    {p.type}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">{p.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">by {p.seller}</p>
                  
                  <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold">Price</p>
                      <p className="font-bold text-emerald-600 text-lg">{p.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">GRID Fee (10%)</p>
                      <p className="text-xs text-gray-500">{p.fee}</p>
                    </div>
                  </div>

                  <button className="w-full mt-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-sm py-2 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}