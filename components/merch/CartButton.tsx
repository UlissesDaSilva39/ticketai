'use client';

import { useCart } from '@/lib/cart';

export function CartButton({ onClick }: { onClick: () => void }) {
  const { itemCount } = useCart();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Cart${itemCount > 0 ? `, ${itemCount} items` : ''}`}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-neutral-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  );
}