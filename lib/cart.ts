'use client';

import { createContext, useContext, useEffect, useReducer } from 'react';

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;      // in pence
  image: string;
  quantity: number;
  size?: string;
};

type CartAction =
  | { type: 'add'; item: Omit<CartItem, 'quantity'>; quantity?: number }
  | { type: 'remove'; id: string; size?: string }
  | { type: 'setQty'; id: string; size?: string; quantity: number }
  | { type: 'clear' }
  | { type: 'hydrate'; items: CartItem[] };

type CartState = { items: CartItem[] };

const STORAGE_KEY = 'grid.cart.v1';

function keyOf(item: Pick<CartItem, 'id' | 'size'>) {
  return `${item.id}::${item.size ?? ''}`;
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const qty = action.quantity ?? 1;
      const k = keyOf(action.item);
      const existing = state.items.find((i) => keyOf(i) === k);
      if (existing) {
        return {
          items: state.items.map((i) =>
            keyOf(i) === k ? { ...i, quantity: i.quantity + qty } : i
          ),
        };
      }
      return { items: [...state.items, { ...action.item, quantity: qty }] };
    }
    case 'remove': {
      const k = keyOf({ id: action.id, size: action.size });
      return { items: state.items.filter((i) => keyOf(i) !== k) };
    }
    case 'setQty': {
      const k = keyOf({ id: action.id, size: action.size });
      return {
        items: state.items
          .map((i) => (keyOf(i) === k ? { ...i, quantity: action.quantity } : i))
          .filter((i) => i.quantity > 0),
      };
    }
    case 'clear':
      return { items: [] };
    case 'hydrate':
      return { items: action.items };
    default:
      return state;
  }
}

export function useCartReducer() {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          dispatch({ type: 'hydrate', items: parsed });
        }
      }
    } catch {}
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  return { state, dispatch };
}

export type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;      // in pence
  add: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  remove: (id: string, size?: string) => void;
  setQty: (id: string, size: string | undefined, quantity: number) => void;
  clear: () => void;
};

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export function formatPence(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

export function parsePoundsToPence(str: string): number {
  const m = str.match(/([\d,]+(?:\.\d+)?)/);
  if (!m) return 0;
  return Math.round(Number(m[1].replace(/,/g, '')) * 100);
}