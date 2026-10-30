'use client'

import Link from 'next/link'
import { useState } from 'react'

export type ShopProduct = {
  id: string
  title: string
  description?: string | null
  price: number
  image_url?: string | null
  type?: string | null
  inventory?: number | null
  artist_id?: string | null
  artist_name?: string | null
  artist_slug?: string | null
}

function formatPrice(cents: number) {
  return '£' + (cents / 100).toFixed(2)
}

export function ShopProductCard({ product }: { product: ShopProduct }) {
  const [added, setAdded] = useState(false)

  function addToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    try {
      const key = 'grid-shop-cart'
      const raw = window.localStorage.getItem(key)
      const cart: string[] = raw ? JSON.parse(raw) : []
      if (!cart.includes(product.id)) cart.push(product.id)
      window.localStorage.setItem(key, JSON.stringify(cart))
      setAdded(true)
      setTimeout(function() { setAdded(false) }, 2000)
    } catch {
      setAdded(false)
    }
  }

  const href = product.artist_slug
    ? '/shop/' + product.artist_slug + '/product/' + product.id
    : '/shop'

  return (
    <Link
      href={href}
      className="group block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
    >
      <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600 text-4xl">
            ?
          </div>
        )}
        {product.type && (
          <span className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold bg-black/80 text-white rounded-full">
            {product.type}
          </span>
        )}
        {product.inventory === 0 && (
          <span className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
            Sold out
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {product.title}
        </h3>
        {product.artist_name && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
            {product.artist_name}
          </p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-base font-bold text-gray-900 dark:text-gray-100">
            {formatPrice(product.price)}
          </span>
          <button
            type="button"
            onClick={addToCart}
            disabled={product.inventory === 0}
            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-30 transition-colors"
          >
            {added ? 'Added' : 'Add to cart'}
          </button>
        </div>
      </div>
    </Link>
  )
}

