"use client";
import { useState } from "react";
import Link from "next/link";

const CheckIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);
const CrossIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
);
const StarIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
);

export default function PremiumPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const features = [
    { name: "Unlimited Direct Messages", free: false, pro: true },
    { name: "Advanced EPK Analytics", free: false, pro: true },
    { name: "Priority Ranking in Collab Feed", free: false, pro: true },
    { name: "0% Escrow Fee (Saves you 5%)", free: false, pro: true },
    { name: "Unlimited Split Sheets", free: "Up to 3", pro: true },
    { name: "Verified Artist Badge", free: false, pro: true },
  ];

  const handleSubscribe = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setShowCheckout(false);
      setIsSuccess(false);
    }, 3000);
  };

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen py-12 px-4">
      <div className="max-w-[1000px] mx-auto">
        
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/home" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-emerald-600 transition-colors">
            &larr; Back
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold mb-4">
            <StarIcon className="w-3.5 h-3.5" /> GRID PRO
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 mb-8 max-w-2xl mx-auto flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-bold text-red-900 dark:text-red-400 text-sm">Founding Member Offer: Lock in £10/month forever.</p>
              <p className="text-xs text-red-700 dark:text-red-500">Upgrade now to keep unlimited DMs and 0% escrow fees.</p>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
            Take your music career to the <span className="text-emerald-600">next level.</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Upgrade to GRID Pro to unlock unlimited connections, advanced analytics, and zero fees on your collaborations.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className={`text-sm font-semibold ${!isAnnual ? "text-gray-900 dark:text-white" : "text-gray-500"}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-8 bg-emerald-600 rounded-full p-1 transition-colors relative flex items-center"
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${isAnnual ? "translate-x-6" : "translate-x-0"}`} />
            </button>
            <span className={`text-sm font-semibold ${isAnnual ? "text-gray-900 dark:text-white" : "text-gray-500"}`}>
              Annually <span className="text-emerald-600 text-xs ml-1 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left mb-12">
          
          {/* Free Tier */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Basic</h2>
            <p className="text-sm text-gray-500 mb-6">For artists just starting out.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">Â£0</span>
              <span className="text-gray-500">/month</span>
            </div>
            <button className="w-full border-2 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-xl mb-8 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-default">
              Manage Plan
            </button>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"><CheckIcon className="text-emerald-500" /> Standard Profile</li>
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"><CheckIcon className="text-emerald-500" /> 5 DMs per day</li>
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"><CheckIcon className="text-emerald-500" /> Up to 3 Split Sheets</li>
              <li className="flex items-center gap-3 text-sm text-gray-400 dark:text-gray-500"><CrossIcon /> 5% Escrow Fee<br/>No Analytics</li>
            </ul>
          </div>

          {/* Pro Tier */}
          <div className="bg-gray-900 dark:bg-zinc-950 rounded-2xl border-2 border-emerald-500 p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              GRID Pro <StarIcon className="w-5 h-5 text-amber-400" />
            </h2>
            <p className="text-sm text-gray-400 mb-6">For serious professionals.</p>
            <div className="mb-6 flex items-end gap-1">
              <span className="text-4xl font-bold text-white">{isAnnual ? "Â£8" : "Â£10"}</span>
              <span className="text-gray-400 mb-1">/month</span>
            </div>
            <button onClick={() => setShowCheckout(true)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl mb-8 transition-colors shadow-lg shadow-emerald-600/30">
              Upgrade to Pro
            </button>
            <ul className="space-y-4">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-200"><CheckIcon className="text-emerald-400" /> {f.name}</li>
              ))}
            </ul>
          </div>
        </div>

                {/* TESTIMONIALS SECTION */}
        <div className="text-center mb-8 mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trusted by top artists and producers</h2>
          <p className="text-gray-500 mt-2">See how GRID Pro is accelerating careers in the music industry.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col">
            <div className="flex text-amber-500 mb-4">
              {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-4 h-4" />)}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 flex-1 leading-relaxed">
              "I landed a Â£2,000 sync deal within two weeks of joining GRID Pro. The priority ranking in the collab feed is a game-changer."
            </p>
            <div className="flex items-center gap-3 mt-6">
              <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-sm">SJ</div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">Sarah Jenkins</p>
                <p className="text-xs text-gray-500">Vocalist Â· London</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col">
            <div className="flex text-amber-500 mb-4">
              {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-4 h-4" />)}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 flex-1 leading-relaxed">
              "The 0% escrow fee alone pays for the subscription. I've closed 4 mixing gigs this month without losing a cut to platform fees."
            </p>
            <div className="flex items-center gap-3 mt-6">
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">DC</div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">David Chen</p>
                <p className="text-xs text-gray-500">Producer Â· Berlin</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col">
            <div className="flex text-amber-500 mb-4">
              {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-4 h-4" />)}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 flex-1 leading-relaxed">
              "Unlimited split sheets saved my last collaboration. We signed the contract and released the track in the same day."
            </p>
            <div className="flex items-center gap-3 mt-6">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm">MC</div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">The Midnight Collective</p>
                <p className="text-xs text-gray-500">Indie Band Â· Manchester</p>
              </div>
            </div>
          </div>

        </div>
{/* Feature Comparison Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden mb-12">
          <div className="p-6 border-b border-gray-100 dark:border-zinc-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Compare Plans</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-zinc-800/50 text-gray-500 font-semibold border-b border-gray-100 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Feature</th>
                  <th className="px-6 py-4 text-center">Basic</th>
                  <th className="px-6 py-4 text-center text-emerald-600">GRID Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-gray-700 dark:text-gray-300">
                {features.map((f, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-4 font-medium">{f.name}</td>
                    <td className="px-6 py-4 text-center">{f.free === false ? <CrossIcon className="w-4 h-4 mx-auto text-gray-400" /> : f.free === true ? <CheckIcon className="w-4 h-4 mx-auto text-emerald-500" /> : f.free}</td>
                    <td className="px-6 py-4 text-center font-bold text-emerald-600">{f.pro === true ? <CheckIcon className="w-4 h-4 mx-auto" /> : f.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* STRIPE CHECKOUT MODAL */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            
            {isSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Welcome to GRID Pro!</h2>
                <p className="text-sm text-gray-500">Your account has been upgraded successfully.</p>
              </div>
            ) : (
              <>
                <div className="bg-gray-50 dark:bg-zinc-800 p-4 border-b border-gray-200 dark:border-zinc-700 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M2 5a2 2 0 012-2h16a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2 0v2h16V5H4zm0 4v10h16V9H4zm2 2h4v4H6v-4z"/></svg>
                    Stripe Checkout
                  </h3>
                  <button onClick={() => setShowCheckout(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">&times;</button>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100 dark:border-zinc-800">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">GRID Pro</p>
                      <p className="text-sm text-gray-500">{isAnnual ? "Annual Subscription" : "Monthly Subscription"}</p>
                    </div>
                    <p className="font-bold text-xl text-gray-900 dark:text-white">{isAnnual ? "Â£96.00" : "Â£10.00"}</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
                      <input type="email" placeholder="ulisses@example.com" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Card Information</label>
                      <div className="border border-gray-300 dark:border-zinc-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-zinc-800">
                        <input type="text" placeholder="4242 4242 4242 4242" className="w-full bg-transparent px-4 py-2.5 text-sm border-b border-gray-300 dark:border-zinc-700 focus:outline-none" />
                        <div className="flex">
                          <input type="text" placeholder="MM / YY" className="w-1/2 bg-transparent px-4 py-2.5 text-sm border-r border-gray-300 dark:border-zinc-700 focus:outline-none" />
                          <input type="text" placeholder="CVC" className="w-1/2 bg-transparent px-4 py-2.5 text-sm focus:outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleSubscribe} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm">
                    Pay {isAnnual ? "Â£96.00" : "Â£10.00"}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
                    Payments are secure and encrypted.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
            <p className="text-center text-xs text-gray-500 mt-12 max-w-2xl mx-auto">
          Subscriptions renew automatically. Cancel anytime. By upgrading, you agree to our <a href="/legal/terms" className="underline hover:text-gray-900">Terms of Service</a> and <a href="/legal/refund" className="underline hover:text-gray-900">Refund Policy</a>.
        </p>
</div>
  );
}