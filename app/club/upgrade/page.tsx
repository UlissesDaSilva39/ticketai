import { CLUB_PLANS } from '@/lib/club';

export default function ClubUpgradePage() {
  return (
    <div className="min-h-screen px-6 py-12" style={{ background: '#f9fafb' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Upgrade to GRID Club</h1>
          <p className="text-gray-600 text-lg">
            Unlock analytics, priority placement, and a verified badge.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {CLUB_PLANS.map((plan) => (
            <div
              key={plan.tier}
              className={
                'rounded-2xl border bg-white p-6 flex flex-col ' +
                (plan.tier === 'pro'
                  ? 'border-violet-600 shadow-lg ring-2 ring-violet-100'
                  : 'border-gray-200')
              }
            >
              {plan.tier === 'pro' && (
                <div className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-2">
                  Most popular
                </div>
              )}
              <h2 className="text-2xl font-bold mb-1">{plan.name}</h2>
              <div className="text-3xl font-bold mb-4">
                £{plan.monthlyPriceGbp}
                <span className="text-sm font-normal text-gray-500">/mo</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-700 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={
                  'w-full rounded-full py-2.5 font-semibold transition ' +
                  (plan.tier === 'free'
                    ? 'bg-gray-100 text-gray-700 cursor-default'
                    : 'bg-gradient-to-r from-violet-600 to-pink-500 text-white hover:opacity-90')
                }
                disabled={plan.tier === 'free'}
              >
                {plan.tier === 'free' ? 'Current plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Stripe Checkout not wired yet — this page shows the tiers.
        </p>
      </div>
    </div>
  );
}
