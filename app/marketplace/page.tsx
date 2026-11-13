"use client";
import { useState } from "react";
import Link from "next/link";
import { PlayIcon, MarketIcon, BookmarkIcon, UsersIcon, CalendarSVG, NoteIcon } from "@/components/MusicIcons";
import BuyModal from "@/components/BuyModal";

const CheckIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);

export default function MarketplacePage() {
  const [buyItem, setBuyItem] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [pricingMode, setPricingMode] = useState<"fixed" | "pwyw">("fixed");
  const [customPrice, setCustomPrice] = useState(0);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const products = [
    { id: 1, title: "Dark Techno Sample Pack Vol. 1", seller: "Ulisses Silva", price: 24.99, fee: 2.50, type: "Sample Pack", color: "bg-emerald-800", pwyw: true },
    { id: 2, title: "House Beat - 'Midnight' (Lease)", seller: "Demo Producer", price: 49.99, fee: 5.00, type: "Beat", color: "bg-blue-800", pwyw: true },
    { id: 3, title: "Mixing & Mastering (1 Track)", seller: "Studio X", price: 100.00, fee: 10.00, type: "Service", color: "bg-purple-800", pwyw: false },
    { id: 4, title: "GRID Logo Tour T-Shirt", seller: "GRID Official", price: 19.99, fee: 2.00, type: "Merch", color: "bg-zinc-800", pwyw: true },
  ];

  const handleBuyNow = (product: any) => {
    setSelectedProduct(product);
    setPricingMode("fixed");
    setCustomPrice(product.price);
    setPurchaseSuccess(false);
  };

  const handleConfirmPurchase = () => {
    setPurchaseSuccess(true);
    setTimeout(() => {
      setPurchaseSuccess(false);
      setSelectedProduct(null);
    }, 2500);
  };

  const finalPrice = pricingMode === "fixed" ? selectedProduct?.price : customPrice;
  const platformFee = finalPrice * 0.10;
  const totalCost = finalPrice + platformFee;

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen relative">
      <div className="mx-auto max-w-[1280px] px-4 py-6 grid grid-cols-12 gap-6">

        {/* LEFT COLUMN: Sidebar (UNCHANGED) */}
        <aside className="col-span-12 lg:col-span-3 space-y-3 hidden lg:block">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-emerald-600 to-emerald-500" />
            <div className="p-5 -mt-10 text-center relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-800 text-white grid place-items-center font-bold text-2xl ring-4 ring-white dark:ring-zinc-900 mb-3">U</div>
              <p className="font-bold text-gray-900 dark:text-white text-lg">Ulisses Silva</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Music Producer &amp; DJ</p>
              <p className="text-xs text-gray-500 mt-1">London, UK</p>
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

        {/* MAIN COLUMN: Marketplace (UPDATED) */}
        <main className="col-span-12 lg:col-span-9 space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
            <h1 className="font-bold text-gray-900 dark:text-white text-2xl flex items-center gap-2"><MarketIcon className="w-6 h-6 text-emerald-600" /> GRID Marketplace</h1>
            <p className="text-sm text-gray-500 mt-1">Buy and sell beats, sample packs, merch, and studio services.</p>
            <div className="flex gap-3 mt-4">
              <Link href="/seller" className="border border-emerald-600 text-emerald-700 dark:text-emerald-400 text-sm font-bold px-5 py-2.5 rounded-lg transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-900/20">Seller Dashboard</Link>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors shadow-sm">+ Sell on GRID</button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {["All", "Beats", "Sample Packs", "Services", "Merch"].map((tab, i) => (
              <button key={tab} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${i === 0 ? "bg-emerald-600 text-white" : "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden group hover:border-emerald-500 transition-colors">
                <div className={`h-40 ${p.color} flex items-center justify-center relative`}>
                  <div className="w-16 h-16 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <NoteIcon className="w-8 h-8 text-white" />
                  </div>
                  <span className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 text-gray-900 dark:text-white text-xs font-bold px-2 py-1 rounded-md">{p.type}</span>
                  {p.pwyw && (
                    <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">💰 Pay What You Want</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">{p.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">by {p.seller}</p>
                  <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold">Price {p.pwyw ? "(or more)" : ""}</p>
                      <p className="font-bold text-emerald-600 text-lg">£{p.price.toFixed(2)}</p>
                      <p className="text-[10px] text-red-500 font-semibold mt-0.5">🔥 3 people have this in cart</p>
                      <p className="text-[10px] text-red-500 font-semibold mt-0.5 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        </svg>
                        3 people have this in cart
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">GRID Fee (10%)</p>
                      <p className="text-xs text-gray-500">£{p.fee.toFixed(2)}</p>
                    </div>
                  </div>
                  <button onClick={() => handleBuyNow(p)} className="w-full mt-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-sm py-2 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    {p.pwyw ? "Choose Price & Buy" : "Buy Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* PURCHASE MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md p-6">
            {purchaseSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckIcon className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Purchase Complete!</h2>
                <p className="text-sm text-gray-500">Your download is ready. Check your email for the link.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Complete Your Purchase</h2>
                  <button onClick={() => setSelectedProduct(null)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">&times;</button>
                </div>

                <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-3 mb-4">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{selectedProduct.title}</p>
                  <p className="text-xs text-gray-500">by {selectedProduct.seller}</p>
                </div>

                {selectedProduct.pwyw ? (
                  <>
                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2">Choose Your Price</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setPricingMode("fixed")}
                          className={`py-2.5 rounded-lg border-2 font-bold text-sm transition-colors ${
                            pricingMode === "fixed" ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : "border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          £{selectedProduct.price.toFixed(2)}
                        </button>
                        <button
                          onClick={() => setPricingMode("pwyw")}
                          className={`py-2.5 rounded-lg border-2 font-bold text-sm transition-colors ${
                            pricingMode === "pwyw" ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : "border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          Pay More 💚
                        </button>
                      </div>
                    </div>

                    {pricingMode === "pwyw" && (
                      <div className="mb-4">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Your Price (£)</p>
                        <input
                          type="number"
                          value={customPrice}
                          onChange={(e) => setCustomPrice(Number(e.target.value))}
                          className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                        />
                        <p className="text-[10px] text-gray-500 mt-1">Suggested: £{(selectedProduct.price * 1.5).toFixed(2)} — Support the artist!</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Fixed Price</p>
                    <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">
                      <p className="font-bold text-gray-900 dark:text-white text-lg">£{selectedProduct.price.toFixed(2)}</p>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-3 mb-4 space-y-1">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Item price:</span><span>£{finalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>GRID Fee (10%):</span><span>£{platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-zinc-700">
                    <span>Total:</span><span>£{totalCost.toFixed(2)}</span>
                  </div>
                </div>

                <button onClick={handleConfirmPurchase} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors">
                  Confirm Purchase — £{totalCost.toFixed(2)}
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <BuyModal open={!!buyItem} onClose={() => setBuyItem(null)} item={buyItem} />
    </div>
  );
}