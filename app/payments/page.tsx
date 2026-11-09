"use client";
import { useState } from "react";
import Link from "next/link";
import { PlayIcon, MarketIcon, BookmarkIcon, UsersIcon, CalendarSVG, MicIcon, NoteIcon } from "@/components/MusicIcons";

const ShieldIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
);
const WalletIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
);
const ArrowRightIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
);
const AlertIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
);

export default function Page() {
  const [isPlaying, setIsPlaying] = useState(false);

  // All modals state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Status states
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [releaseSuccess, setReleaseSuccess] = useState(false);

  const handleRelease = () => {
    setReleaseSuccess(true);
    setTimeout(() => setReleaseSuccess(false), 2000);
  };

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen relative">
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
                <button onClick={() => setIsPlaying(!isPlaying)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-full transition-colors flex items-center justify-center gap-2">
                  <PlayIcon className="w-3.5 h-3.5" /> {isPlaying ? "Pause Track" : "Play Latest Track"}
                </button>
                <Link href="/epk" className="w-full border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 text-sm font-bold py-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors block text-center">View EPK</Link>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-6 pt-5 border-t border-gray-100 dark:border-zinc-800 text-center">
                <div><p className="font-bold text-gray-900 dark:text-white text-base">124</p><p className="text-[11px] text-gray-500 uppercase tracking-wide">Connections</p></div>
                <div><p className="font-bold text-gray-900 dark:text-white text-base">2.4K</p><p className="text-[11px] text-gray-500 uppercase tracking-wide">Followers</p></div>
              </div>
            </div>
            <div className="border-t border-gray-100 dark:border-zinc-800 p-4">
              <ul className="space-y-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <li><Link href="/marketplace" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><MarketIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Marketplace</span></Link></li>
                <li><Link href="/saved" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><BookmarkIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Saved Items</span></Link></li>
                <li><Link href="/groups" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><UsersIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Groups</span></Link></li>
                <li><Link href="/events" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><CalendarSVG className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Events</span></Link></li>
              </ul>
            </div>
          </div>
        </aside>

        {/* MAIN COLUMN */}
        <main className="col-span-12 lg:col-span-9 space-y-4">
          
          {/* ONBOARDING BANNER */}
          {!isOnboarded ? (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-full text-amber-600 flex-shrink-0"><AlertIcon /></div>
                <div>
                  <h3 className="font-bold text-amber-900 dark:text-amber-400 text-sm">Action Required: Link your bank account</h3>
                  <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5">Complete Stripe Connect to withdraw your £1,240.00 balance.</p>
                </div>
              </div>
              <button onClick={() => setShowOnboarding(true)} className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors whitespace-nowrap shadow-sm">
                Link Bank Account
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-full text-emerald-600 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-emerald-900 dark:text-emerald-400 text-sm">Bank Account Linked</h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-0.5">You are ready to receive payouts.</p>
              </div>
            </div>
          )}

          {/* ESCROW HEADER */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-2xl flex items-center gap-2"><ShieldIcon className="w-6 h-6 text-emerald-600" /> Escrow Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Secure payments for your music collaborations.</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-lg p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white"><WalletIcon /></div>
              <div>
                <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">Available Balance</p>
                <p className="font-bold text-gray-900 dark:text-white text-xl">£1,240.00</p>
              </div>
              <button onClick={() => setShowWithdrawModal(true)} className="ml-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">Withdraw</button>
            </div>
          </div>

          {/* ACTIVE PROJECTS */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">Active Projects</h2>
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">2 Projects in Escrow</span>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              <div className="p-5 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 flex-shrink-0"><MicIcon className="w-5 h-5" /></div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-base">House Track - Session Vocals</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">With: <span className="font-semibold text-gray-900 dark:text-white">Sarah J.</span></p>
                      <button onClick={() => setShowBreakdownModal(true)} className="text-xs text-emerald-600 font-semibold hover:underline mt-1">View Payment Breakdown</button>
                    </div>
                  </div>
                  <div className="text-left md:text-right bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-gray-100 dark:border-zinc-700">
                    <div className="flex justify-between md:justify-end gap-4 text-xs text-gray-500 mb-1"><span>Artist Payout:</span><span className="font-semibold text-gray-900 dark:text-white">£250.00</span></div>
                    <div className="flex justify-between md:justify-end gap-4 text-xs text-gray-500 mb-1"><span>GRID Fee (5%):</span><span className="font-semibold text-amber-600">£12.50</span></div>
                    <div className="flex justify-between md:justify-end gap-4 text-xs text-gray-500 pt-1 border-t border-gray-200 dark:border-zinc-700"><span className="font-bold">Buyer Pays:</span><span className="font-bold text-gray-900 dark:text-white">£262.50</span></div>
                  </div>
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    {releaseSuccess ? (
                      <button disabled className="bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2">✓ Released</button>
                    ) : (
                      <button onClick={handleRelease} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">Release Funds <ArrowRightIcon /></button>
                    )}
                    <button onClick={() => setShowDisputeModal(true)} className="text-red-500 hover:text-red-700 text-xs font-bold transition-colors">Report an Issue</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ==================== MODALS ==================== */}

      {/* 1. WITHDRAW MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Withdraw Funds</h2>
            <p className="text-sm text-gray-500 mb-4">Transfer your balance to your linked bank account.</p>
            <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3 mb-4 flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Available:</span>
              <span className="font-bold text-emerald-600 text-lg">£1,240.00</span>
            </div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount to Withdraw (£)</label>
            <input type="number" defaultValue="1240" className="w-full bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-emerald-500" />
            <div className="flex gap-3">
              <button onClick={() => setShowWithdrawModal(false)} className="flex-1 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => setShowWithdrawModal(false)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. BREAKDOWN MODAL */}
      {showBreakdownModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Project Breakdown</h2>
            <div className="flex justify-between mb-2"><span className="text-gray-600">Artist Payout (Sarah J.)</span><span className="font-bold">£250.00</span></div>
            <div className="flex justify-between mb-2"><span className="text-gray-600">GRID Platform Fee (5%)</span><span className="font-bold text-amber-600">£12.50</span></div>
            <div className="flex justify-between text-xs mb-4"><span className="text-gray-500">VAT on Fee (20%)</span><span className="text-gray-500">£2.50</span></div>
            <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex justify-between mb-6"><span className="font-bold">Total Buyer Pays</span><span className="font-bold text-emerald-600 text-lg">£262.50</span></div>
            <button onClick={() => setShowBreakdownModal(false)} className="w-full bg-gray-900 text-white font-semibold py-2 rounded-lg">Close</button>
          </div>
        </div>
      )}

      {/* 3. DISPUTE MODAL */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4"><AlertIcon /></div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Report an Issue</h2>
            <p className="text-sm text-gray-500 mb-4">Flagging this project will freeze the funds and escalate to GRID Support.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDisputeModal(false)} className="flex-1 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold py-2 rounded-lg">Cancel</button>
              <button onClick={() => setShowDisputeModal(false)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg">Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ONBOARDING MODAL */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-[#635BFF]" viewBox="0 0 24 24" fill="currentColor"><path d="M2 5a2 2 0 012-2h16a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2 0v2h16V5H4zm0 4v10h16V9H4zm2 2h4v4H6v-4z"/></svg>
                <span className="font-bold text-gray-900 dark:text-white">Stripe Connect</span>
              </div>
              <button onClick={() => setShowOnboarding(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">&times;</button>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Set up payouts</h2>
              <p className="text-sm text-gray-500 mb-6">Enter your details to receive earnings. Securely handled by Stripe.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Legal Name</label>
                  <input type="text" placeholder="Ulisses Silva" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#635BFF]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">IBAN / Account Number</label>
                  <input type="text" placeholder="GB29 NWBK 6016 1331 9268 19" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#635BFF]" />
                </div>
              </div>
              <button onClick={() => { setShowOnboarding(false); setIsOnboarded(true); }} className="w-full mt-6 bg-[#635BFF] hover:bg-[#544DDF] text-white font-bold py-3 rounded-lg transition-colors">Agree & Submit</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}