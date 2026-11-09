"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Zap, TrendingUp, ShieldCheck, Star } from "lucide-react";

export default function PremiumPage() {
  const router = useRouter();

  const features = [
    { name: "Unlimited track uploads", free: true, pro: true },
    { name: "Standard EPK profile", free: true, pro: true },
    { name: "Collaboration proposals (Start Remix)", free: "3 / month", pro: "Unlimited" },
    { name: "Revenue split contracts", free: "Standard", pro: "Advanced Templates" },
    { name: "EPK Analytics (Who viewed you)", free: false, pro: true },
    { name: "Priority matching on Co-creation Board", free: false, pro: true },
    { name: "Verified Collaboration Badges", free: "Basic", pro: "Premium" },
    { name: "0% platform fee on splits", free: false, pro: "10% max" },
  ];

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 text-xs font-bold uppercase tracking-widest mb-6 border border-yellow-200">
            <Star className="w-3.5 h-3.5 fill-yellow-600" /> Upgrade your career
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-4">
            Try GRID Pro for £0
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Get the tools you need to stand out, track your growth, and land more collaborations. Start your 30-day free trial. No credit card required.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Free Plan */}
          <div className="rounded-3xl border border-gray-200 p-8 flex flex-col">
            <h2 className="text-2xl font-bold mb-2">Starter</h2>
            <p className="text-gray-500 text-sm mb-6">Everything you need to get started.</p>
            <div className="text-4xl font-black mb-6">£0<span className="text-lg text-gray-400 font-medium">/mo</span></div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {features.map((f, i) => (
                <li key={i} className={`flex items-start gap-3 text-sm ${!f.free ? 'opacity-40' : ''}`}>
                  {f.free ? <Check className="w-5 h-5 text-green-500 shrink-0" /> : <div className="w-5 h-5 shrink-0" />}
                  <span>{f.name} {typeof f.free === 'string' && <span className="text-gray-400">({f.free})</span>}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full rounded-full border border-gray-300 bg-white px-6 py-4 font-bold text-black hover:bg-gray-50 transition-colors">
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="rounded-3xl border-2 border-black p-8 flex flex-col relative overflow-hidden bg-gray-50/50">
            <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-bl-xl">
              Most Popular
            </div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              GRID Pro <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </h2>
            <p className="text-gray-500 text-sm mb-6">For serious artists and producers.</p>
            <div className="text-4xl font-black mb-6">£12<span className="text-lg text-gray-400 font-medium">/mo</span></div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <Check className="w-5 h-5 text-black shrink-0" />
                  <span className="font-medium">{f.name} {typeof f.pro === 'string' && <span className="text-gray-500 font-normal">({f.pro})</span>}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full rounded-full bg-black text-white px-6 py-4 font-bold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/20">
              Start 30-day free trial
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">Cancel anytime.</p>
          </div>

        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-16">
          <div>
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-black" />
            </div>
            <h3 className="font-bold text-lg mb-2">EPK Analytics</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              See exactly which promoters, labels, and remixers are viewing your profile. Stop guessing and start pitching.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <h3 className="font-bold text-lg mb-2">Priority Matching</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your Co-creation posts are featured at the top of the board, so vocalists and producers find you first.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-black" />
            </div>
            <h3 className="font-bold text-lg mb-2">Advanced Splits</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Access premium legal templates for complex collaborations (producers, topliners, session musicians).
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}