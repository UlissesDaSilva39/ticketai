"use client";
import { useState } from "react";
import Link from "next/link";
import { PlayIcon, MarketIcon, BookmarkIcon, UsersIcon, CalendarSVG, MicIcon } from "@/components/MusicIcons";

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
const LockIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
);

export default function PaymentsPage() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  
  // Dispute State
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [isDisputed, setIsDisputed] = useState(false);

  const handleDisputeSubmit = () => {
    if (!disputeReason) return;
    setShowDisputeModal(false);
    setIsDisputed(true);
  };

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen relative">
      <div className="mx-auto max-w-[1280px] px-4 py-6 grid grid-cols-12 gap-6">

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
                <button className="w-full border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 text-sm font-bold py-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">View EPK</button>
              </div>
            </div>
            <div className="border-t border-gray-100 dark:border-zinc-800 p-4">
              <ul className="space-y-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <li><Link href="/marketplace" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><MarketIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Marketplace</span></Link></li>
                <li><Link href="/saved" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><BookmarkIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Saved Items</span></Link></li>
                <li><Link href="/groups" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><UsersIcon className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Groups</span></Link></li>
                <li><Link href="/events" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"><CalendarSVG className="w-5 h-5 text-emerald-600" /> <span className="group-hover:text-emerald-700">Events</span></Link></li>
                <li>
                  <Link href="/promote" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                    <span className="group-hover:text-emerald-700">Promote Music</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        <main className="col-span-12 lg:col-span-9 space-y-4">
          
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-full text-amber-600 flex-shrink-0"><AlertIcon /></div>
              <div>
                <h3 className="font-bold text-amber-900 dark:text-amber-400 text-sm">Action Required: Link your bank account</h3>
                <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5">You need to complete your Stripe Connect onboarding to withdraw your Â£1,240.00 balance.</p>
              </div>
            </div>
            <button className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors whitespace-nowrap shadow-sm">Link Bank Account</button>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-2xl flex items-center gap-2"><ShieldIcon className="w-6 h-6 text-emerald-600" /> Escrow Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Secure payments for your music collaborations.</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-lg p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white"><WalletIcon /></div>
              <div>
                <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">Available Balance</p>
                <p className="font-bold text-gray-900 dark:text-white text-xl">Â£1,240.00</p>
              </div>
              <button onClick={() => setShowWithdrawModal(true)} className="ml-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">Withdraw</button>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">Active Projects</h2>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${isDisputed ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                {isDisputed ? '1 Disputed Project' : '2 Projects in Escrow'}
              </span>
            </div>
            
            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              
              <div className={`p-5 transition-colors ${isDisputed ? 'bg-red-50/30 dark:bg-red-900/10' : 'hover:bg-gray-50 dark:hover:bg-zinc-800/50'}`}>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isDisputed ? 'bg-red-100 text-red-600' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'}`}>
                      {isDisputed ? <LockIcon className="w-5 h-5" /> : <MicIcon className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-base">House Track - Session Vocals</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">With: <span className="font-semibold text-gray-900 dark:text-white">Sarah J.</span></p>
                      {isDisputed ? (
                        <p className="text-xs text-red-600 font-bold mt-1">Funds Frozen â€” Under Review by GRID Support</p>
                      ) : (
                        <button onClick={() => setShowBreakdownModal(true)} className="text-xs text-emerald-600 font-semibold hover:underline mt-1">View Payment Breakdown</button>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-left md:text-right bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-gray-100 dark:border-zinc-700">
                    <div className="flex justify-between md:justify-end gap-4 text-xs text-gray-500 mb-1"><span>Artist Payout:</span><span className="font-semibold text-gray-900 dark:text-white">Â£250.00</span></div>
                    <div className="flex justify-between md:justify-end gap-4 text-xs text-gray-500 mb-1"><span>GRID Fee (5%):</span><span className="font-semibold text-amber-600">Â£12.50</span></div>
                    <div className="flex justify-between md:justify-end gap-4 text-xs text-gray-500 pt-1 border-t border-gray-200 dark:border-zinc-700"><span className="font-bold">Buyer Pays:</span><span className="font-bold text-gray-900 dark:text-white">Â£262.50</span></div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[140px]">
                    {isDisputed ? (
                      <button disabled className="bg-gray-300 dark:bg-zinc-700 text-gray-500 text-sm font-semibold px-4 py-2 rounded-lg cursor-not-allowed flex items-center justify-center gap-2">
                        <LockIcon className="w-4 h-4" /> Locked
                      </button>
                    ) : (
                      <>
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                          Release Funds <ArrowRightIcon />
                        </button>
                        <button onClick={() => setShowDisputeModal(true)} className="text-red-500 hover:text-red-700 text-xs font-bold transition-colors">
                          Report an Issue
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* DISPUTE MODAL */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 w-full max-w-md p-6">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <AlertIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Report an Issue</h2>
            <p className="text-sm text-gray-500 mb-4">Flagging this project will freeze the escrowed funds (Â£262.50) and escalate the matter to GRID Support for mediation.</p>
            
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Reason for Dispute</label>
            <select 
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-red-500 text-sm"
            >
              <option value="">Select a reason...</option>
              <option value="not_delivered">Work was not delivered</option>
              <option value="poor_quality">Quality does not match agreement</option>
              <option value="copyright">Copyright / Plagiarism issue</option>
              <option value="other">Other</option>
            </select>

            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Additional Details</label>
            <textarea rows={3} placeholder="Describe the issue..." className="w-full bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:border-red-500 text-sm resize-none" />
            
            <div className="flex gap-3">
              <button onClick={() => setShowDisputeModal(false)} className="flex-1 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">Cancel</button>
              <button onClick={handleDisputeSubmit} disabled={!disputeReason} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50">Submit Dispute</button>
            </div>
          </div>
        </div>
      )}

      {/* WITHDRAW MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Withdraw Funds</h2>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowWithdrawModal(false)} className="flex-1 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold py-2 rounded-lg">Cancel</button>
              <button onClick={() => setShowWithdrawModal(false)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* FEE BREAKDOWN MODAL */}
      {showBreakdownModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Project Breakdown</h2>
            <div className="flex justify-between mb-2"><span className="text-gray-600">Artist Payout (Sarah J.)</span><span className="font-bold">Â£250.00</span></div>
            <div className="flex justify-between mb-2"><span className="text-gray-600">GRID Platform Fee (5%)</span><span className="font-bold text-amber-600">Â£12.50</span></div>
            <div className="flex justify-between text-xs mb-4"><span className="text-gray-500">VAT on Fee (20%)</span><span className="text-gray-500">Â£2.50</span></div>
            <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex justify-between mb-6"><span className="font-bold text-gray-900 dark:text-white">Total Buyer Pays</span><span className="font-bold text-emerald-600 text-lg">Â£262.50</span></div>
            <button onClick={() => setShowBreakdownModal(false)} className="w-full bg-gray-900 text-white font-semibold py-2 rounded-lg">Close</button>
          </div>
        </div>
      )}

    </div>
  );
}