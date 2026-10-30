import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { ShopGrid } from '@/components/shop/ShopGrid'
import type { ShopProduct } from '@/components/shop/ShopProductCard'

export const dynamic = 'force-dynamic'

async function loadArtistShop(slug: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return null

  const supabase = createClient(url, key)

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, display_name, bio, avatar_url, city')
    .eq('username', slug)
    .maybeSingle()

  if (!profile) return null

  const { data: products } = await supabase
    .from('shop_products')
    .select('*')
    .eq('artist_id', profile.id)
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(50)

  return {
    profile,
    products: (products || []) as unknown as ShopProduct[],
  }
}

export default async function ArtistShopPage({
  params,
}: {
  params: Promise<{ artistSlug: string }>
}) {
  const { artistSlug } = await params
  const data = await loadArtistShop(artistSlug)
  if (!data) notFound()

  const { profile, products } = data
  const name = profile.display_name || profile.username || 'Artist'

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 dark:text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link href="/shop" className="text-sm text-gray-500 dark:text-gray-400 hover:underline mb-6 inline-block">
          ← All shops
        </Link>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold text-gray-700 dark:text-gray-200 flex-shrink-0">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 truncate">
                {name}
              </h1>
              {profile.city && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{profile.city}</p>
              )}
              {profile.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                  {profile.bio}
                </p>
              )}
            </div>
            <Link
              href={'/u/' + profile.username}
              className="hidden md:inline-block px-4 py-2 rounded-full text-sm font-semibold bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              View profile
            </Link>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </h2>

        <ShopGrid
          products={products}
          emptyTitle={name + ' has not opened their shop yet'}
          emptyMessage="Check back soon."
        />
      </div>
    </main>
  )
}
