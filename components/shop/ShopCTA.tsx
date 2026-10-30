import Link from 'next/link'

export function ShopCTA() {
  return (
    <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/30 dark:to-gray-950 border border-green-200 dark:border-green-900 rounded-2xl p-8 md:p-12 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Open your GRID Shop
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
        Free to start. 10% fee only when you sell. No inventory, no shipping, no upfront cost.
        We handle printing and delivery.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/artist/dashboard"
          className="inline-block px-6 py-3 rounded-full text-sm font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Start selling
        </Link>
        <Link
          href="/merch"
          className="inline-block px-6 py-3 rounded-full text-sm font-semibold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Browse all products
        </Link>
      </div>
    </div>
  )
}
