'use client';

import { useMemo } from 'react';
import {
  CartContext,
  useCartReducer,
  type CartContextValue,
} from '@/lib/cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useCartReducer();

  const value: CartContextValue = useMemo(() => {
    const items = state.items;
    const itemCount = items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);

    return {
      items,
      itemCount,
      subtotal,
      add: (item, quantity = 1) => dispatch({ type: 'add', item, quantity }),
      remove: (id, size) => dispatch({ type: 'remove', id, size }),
      setQty: (id, size, quantity) => dispatch({ type: 'setQty', id, size, quantity }),
      clear: () => dispatch({ type: 'clear' }),
    };
  }, [state, dispatch]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}