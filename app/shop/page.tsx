import Link from 'next/link'
import { ShopCTA } from '@/components/shop/ShopCTA'
import { ShopGrid } from '@/components/shop/ShopGrid'
import type { ShopProduct } from '@/components/shop/ShopProductCard'

// Placeholder products for initial render. Replace with Supabase query in later phase.
const FEATURED_PRODUCTS: ShopProduct[] = [
  {
    id: 'demo-1',
    title: 'Tour T-Shirt 2026',
    price: 2800,
    type: 'T-Shirt',
    artist_name: 'DJ Poxy',
    artist_slug: 'dj-poxy',
    inventory: 50,
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&q=80',
  },
  {
    id: 'demo-2',
    title: 'Signed Vinyl — Limited',
    price: 4500,
    type: 'Vinyl',
    artist_name: 'Paper Lions',
    artist_slug: 'paper-lions',
    inventory: 12,
    image_url: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=600&h=600&fit=crop&q=80',
  },
  {
    id: 'demo-3',
    title: 'VIP Meet & Greet Bundle',
    price: 8500,
    type: 'Bundle',
    artist_name: 'Basement Collective',
    artist_slug: 'basement-collective',
    inventory: 8,
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop&q=80',
  },
  {
    id: 'demo-4',
    title: 'Tour Poster (A2)',
    price: 1800,
    type: 'Poster',
    artist_name: 'Analog Dreams',
    artist_slug: 'analog-dreams',
    inventory: null,
    image_url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&h=600&fit=crop&q=80',
  },
  {
    id: 'demo-5',
    title: 'Hoodie — Classic Logo',
    price: 5500,
    type: 'Hoodie',
    artist_name: 'DJ Poxy',
    artist_slug: 'dj-poxy',
    inventory: 30,
    image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop&q=80',
  },
  {
    id: 'demo-6',
    title: 'Limited Edition Cassette',
    price: 1500,
    type: 'Cassette',
    artist_name: 'Paper Lions',
    artist_slug: 'paper-lions',
    inventory: 5,
    image_url: 'https://images.unsplash.com/photo-1483032469466-cf4d2d6ba5f1?w=600&h=600&fit=crop&q=80',
  },
  {
    id: 'demo-7',
    title: 'Signed Drumsticks',
    price: 3200,
    type: 'Collector',
    artist_name: 'Basement Collective',
    artist_slug: 'basement-collective',
    inventory: 20,
    image_url: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&h=600&fit=crop&q=80',
  },
  {
    id: 'demo-8',
    title: 'Fan Bundle — Shirt + Poster',
    price: 3800,
    type: 'Bundle',
    artist_name: 'Analog Dreams',
    artist_slug: 'analog-dreams',
    inventory: null,
    image_url: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&h=600&fit=crop&q=80',
  },
]

export const metadata = {
  title: 'GRID Shop | Sell your merch where your fans already are',
  description: 'Sell merch, vinyl, bundles, and limited drops. Free to start. 10% fee only when you sell.',
}

export default function ShopLandingPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 dark:text-gray-100">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400 mb-3">
            GRID Shop
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Sell your merch where your fans already are.
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            No inventory. No shipping. No upfront cost. GRID handles printing and delivery.
            You keep 90% of every sale.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/artist/dashboard"
              className="px-6 py-3 rounded-full text-sm font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Open your shop
            </Link>
            <Link
              href="#featured"
              className="px-6 py-3 rounded-full text-sm font-semibold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              See what's for sale
            </Link>
          </div>
        </div>

        {/* Trust row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">90%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">You keep</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">£0</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Upfront cost</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">3 days</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Print to delivery</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">0</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Inventory to manage</p>
          </div>
        </div>
      </section>

      {/* Value props — 3 columns */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">For Artists</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your merch, your page, your revenue. Upload designs, we print and ship. Fans buy from your GRID profile.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">For Promoters</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sell event merch, VIP bundles, and limited drops. Fans buy at checkout with their ticket.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">For Venues</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Local artist collabs, event-specific drops, and venue-branded merch. All in one dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section id="featured" className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            What's for sale
          </h2>
          <Link href="/merch" className="text-sm font-semibold text-green-600 dark:text-green-400 hover:underline">
            Browse all →
          </Link>
        </div>
        <ShopGrid
          products={FEATURED_PRODUCTS}
          emptyTitle="Shop launching soon"
          emptyMessage="The first GRID shops open this week. Check back or open yours now."
        />
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <ShopCTA />
      </section>
    </main>
  )
}

