import { ShopProductCard } from './ShopProductCard'
import type { ShopProduct } from './ShopProductCard'

export function ShopGrid({
  products,
  emptyTitle,
  emptyMessage,
}: {
  products: ShopProduct[]
  emptyTitle?: string
  emptyMessage?: string
}) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center">
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {emptyTitle || 'No products yet'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {emptyMessage || 'Check back soon — new drops are added regularly.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(function(p) {
        return <ShopProductCard key={p.id} product={p} />
      })}
    </div>
  )
}
