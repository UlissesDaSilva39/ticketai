import Link from 'next/link'
import { ShopGrid } from '@/components/shop/ShopGrid'
import type { ShopProduct } from '@/components/shop/ShopProductCard'

export function ArtistShopTab({
  products,
  artistName,
  artistSlug,
}: {
  products: ShopProduct[]
  artistName?: string | null
  artistSlug?: string | null
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Shop {artistName ? '(' + artistName + ')' : ''}
        </h2>
        {artistSlug && (
          <Link
            href={'/shop/' + artistSlug}
            className="text-sm font-semibold text-green-600 dark:text-green-400 hover:underline"
          >
            Open full shop →
          </Link>
        )}
      </div>
      <ShopGrid
        products={products}
        emptyTitle="No merch yet"
        emptyMessage="This artist has not opened their shop yet."
      />
    </div>
  )
}
