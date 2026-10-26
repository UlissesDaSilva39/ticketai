import Link from 'next/link';
import { INDUSTRY_NAV_COLUMNS } from '@/config/industryNav';
import {
  IconIndustry,
  IconTrending,
  IconShield,
  IconRider,
  IconStar,
  IconSearch,
  IconArrow,
  IconBrief,
  IconMessage,
  IconCheck,
} from '@/lib/industryIcons';

const TRENDING_SERVICES = [
  {
    title: 'Record a 3-min track, mixed + mastered',
    price: '£150–£500',
    delivery: '5 days',
    rating: 4.9,
    reviews: 42,
    seller: 'Alex Morgan',
    city: 'London',
    category: 'producer',
    categoryLabel: 'Producer',
  },
  {
    title: 'Full event poster + social media kit',
    price: '£80–£300',
    delivery: '3 days',
    rating: 4.8,
    reviews: 67,
    seller: 'Design Atelier',
    city: 'Manchester',
    category: 'graphic-designer',
    categoryLabel: 'Graphic Design',
  },
  {
    title: '90-minute DJ set — house/techno',
    price: '£300–£3,000',
    delivery: 'Book date',
    rating: 5.0,
    reviews: 28,
    seller: 'DJ Poxy',
    city: 'London',
    category: 'dj',
    categoryLabel: 'DJ',
  },
];

const WHY_GRID = [
  {
    Icon: IconShield,
    title: 'Escrow payments',
    desc: 'Money held safely until delivery is approved. No more "I never got paid" emails.',
  },
  {
    Icon: IconRider,
    title: 'Rider system',
    desc: 'Technical, hospitality, and backstage — one link. Share with every promoter.',
  },
  {
    Icon: IconStar,
    title: 'Verified references',
    desc: 'Every hire becomes a public reference. Build reputation with proof.',
  },
];

const STEPS = [
  { n: '01', Icon: IconBrief,   title: 'Post a brief',   desc: 'What do you need? When? Budget?' },
  { n: '02', Icon: IconMessage, title: 'Get proposals',  desc: 'Vetted pros reply with quotes and timelines.' },
  { n: '03', Icon: IconCheck,   title: 'Hire + pay',     desc: 'Escrow protects both sides. Deliver. Done.' },
];

export default function IndustryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="bg-white border-b border-gray-200">
        <p className="text-center text-sm text-gray-500 mb-2">12,000+ verified pros and crews on the platform</p>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 text-violet-700 px-4 py-1.5 text-sm font-semibold mb-4">
              <IconIndustry size={16} />
              GRID Industry Marketplace
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Hire anyone in live music.
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              From DJs to lighting designers. One marketplace. All vetted,
              all with riders, all with verified references.
            </p>

            {/* SEARCH BAR */}
            <div className="flex items-center gap-2 bg-white border-2 border-gray-300 rounded-full px-4 py-3 mb-6 max-w-2xl mx-auto focus-within:border-violet-600 transition">
              <IconSearch size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search producers, engineers, venues, riders..."
                className="flex-1 outline-none text-gray-900 placeholder-gray-400"
              />
              <Link
                href="/industry/artists/producer"
                className="rounded-full bg-black text-white px-5 py-2 text-sm font-semibold hover:bg-neutral-800"
              >
                Search
              </Link>
            </div>

            {/* CTA BUTTONS */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/industry/post-job"
                className="inline-flex items-center gap-2 rounded-full bg-black text-white px-8 py-3.5 font-semibold hover:bg-neutral-800 transition"
              >
                Post a job
                <IconArrow size={16} />
              </Link>
              <Link
                href="/rider"
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 text-gray-900 px-8 py-3.5 font-semibold hover:bg-gray-50 transition"
              >
                Build a rider
              </Link>
            </div>

            {/* SOCIAL PROOF */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-3">Trusted by the scene</p>
              <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm font-medium">
                <span>DJ Poxy</span>
                <span>Basement 44</span>
                <span>Voice Records</span>
                <span>Pompeii Odyssey</span>
                <span>Ulisses Booking</span>
              </div>
            </div>
          </div>
        </div>
      
        <p className="text-center text-sm text-gray-500 mt-4">Available in London, Manchester, Berlin, Amsterdam, Paris, and 12 more cities.</p></section>

      {/* TRENDING SERVICES */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold inline-flex items-center gap-2">
              <IconTrending size={28} className="text-violet-600" />
              Trending services
            </h2>
            <p className="text-gray-500 mt-1">Booked this week by promoters and venues</p>
          </div>
          <Link
            href="/industry/artists/producer"
            className="inline-flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700"
          >
            View all
            <IconArrow size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRENDING_SERVICES.map((svc, i) => (
            <Link
              key={i}
              href={`/industry/${svc.category === 'dj' || svc.category === 'producer' ? 'artists' : 'creative'}/${svc.category}`}
              className="rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg hover:border-violet-300 transition group"
            >
              <div className="h-40 bg-gradient-to-br from-violet-200 to-pink-200 relative">
                <div className="absolute top-3 left-3 rounded-full bg-black/80 text-white text-xs px-2.5 py-1 font-medium">
                  {svc.categoryLabel}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-violet-600 transition">
                  {svc.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <IconStar size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-medium text-gray-900">{svc.rating}</span>
                  <span>({svc.reviews} reviews)</span>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  <strong className="text-gray-900">{svc.seller}</strong> · {svc.city}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500">From</div>
                    <div className="font-bold text-gray-900">{svc.price}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Delivery</div>
                    <div className="text-sm font-medium">{svc.delivery}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="bg-white border-y border-gray-200 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse by category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {INDUSTRY_NAV_COLUMNS.map((col) => (
              <Link
                key={col.category}
                href={col.categoryHref}
                className="rounded-xl border border-gray-200 bg-white p-5 hover:border-violet-300 hover:shadow-md transition group"
              >
                <div className="font-semibold text-gray-900 group-hover:text-violet-600 mb-1">
                  {col.label}
                </div>
                <div className="text-xs text-gray-500 mb-3">{col.description}</div>
                <ul className="space-y-1">
                  {col.links.slice(0, 3).map((link) => (
                    <li key={link.href} className="text-sm text-neutral-600">
                      {link.label}
                    </li>
                  ))}
                  {col.links.length > 3 && (
                    <li className="text-xs text-violet-600 font-medium pt-1">
                      +{col.links.length - 3} more →
                    </li>
                  )}
                </ul>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY GRID */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Why GRID Industry</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {WHY_GRID.map((item) => (
            <div key={item.title} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 text-violet-600 mb-4">
                <item.Icon size={28} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      
          <p className="text-sm text-gray-500 mt-6 text-center max-w-2xl mx-auto">Every completed hire becomes a public reference page — indexed by search engines, linked from your profile.</p></section>

      {/* HOW IT WORKS */}
      <section className="bg-white border-y border-gray-200 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.n} className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-violet-50 text-violet-600 mb-4 relative">
                  <step.Icon size={32} />
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-7 h-7 rounded-full bg-black text-white text-xs font-bold">
                    {step.n}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ============ FREELANCER HOW IT WORKS ============ */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3 text-center">FOR FREELANCERS</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center text-gray-900">Get booked. Get paid. Build reputation.</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">The other side of the marketplace. Show up, deliver, let your references do the selling.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-5xl font-bold text-gray-300 mb-3">01</p>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Build your profile</h3>
              <p className="text-gray-600">Add services, rates, past clients, and your rider. Verified badge after first hire.</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-gray-300 mb-3">02</p>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Get matched to briefs</h3>
              <p className="text-gray-600">Promoters post briefs. GRID surfaces yours based on genre, city, and availability.</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-gray-300 mb-3">03</p>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Deliver and get paid</h3>
              <p className="text-gray-600">Escrow releases on approval. Weekly payouts via Stripe. Reference published publicly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to hire or get hired?</h2>
        <p className="text-gray-600 mb-8">Free to join. Free to browse. Only pay when you hire.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-black text-white px-8 py-3.5 font-semibold hover:bg-neutral-800 transition"
          >
            Create free account
            <IconArrow size={16} />
          </Link>
          <Link
            href="/industry/post-job"
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 text-gray-900 px-8 py-3.5 font-semibold hover:bg-gray-50 transition"
          >
            Post a job
          </Link>
        </div>
      </section>
    </div>
  );
}
