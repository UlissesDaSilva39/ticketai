'use client';

import { useState } from 'react';
import { CartButton } from './CartButton';
import { CartDrawer } from './CartDrawer';

export function CartWidget() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <CartButton onClick={() => setOpen(true)} />
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}