'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';

const MERCH_ITEMS = [
  { id: 'm1', name: 'Classic Logo Tee', price: '£25.00', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop' },
  { id: 'm2', name: 'Limited Edition Hoodie', price: '£55.00', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400&auto=format&fit=crop' },
  { id: 'm3', name: 'Event Poster', price: '£15.00', img: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?q=80&w=400&auto=format&fit=crop' },
];

const s: Record<string, CSSProperties> = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24 },
  card: { border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', background: '#ffffff' },
  img: { width: '100%', height: 200, objectFit: 'cover', background: '#f3f4f6' },
  body: { padding: 16 },
  title: { margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: '#111827' },
  price: { margin: '0 0 16px', fontSize: 14, color: '#4b5563' },
  btn: { width: '100%', padding: '10px 0', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 100 },
  modal: { background: '#ffffff', padding: 32, borderRadius: 16, maxWidth: 400, width: '100%', textAlign: 'center' },
};

export default function MerchStore() {
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<typeof MERCH_ITEMS[0] | null>(null);

  const handleBuy = (item: typeof MERCH_ITEMS[0]) => {
    setSelectedItem(item);
    setCartOpen(true);
  };

  return (
    <div>
      <div style={s.grid}>
        {MERCH_ITEMS.map(item => (
          <div key={item.id} style={s.card}>
            <img src={item.img} alt={item.name} style={s.img} />
            <div style={s.body}>
              <h3 style={s.title}>{item.name}</h3>
              <p style={s.price}>{item.price}</p>
              <button style={s.btn} onClick={() => handleBuy(item)}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>

      {cartOpen && selectedItem && (
        <div style={s.overlay} onClick={() => setCartOpen(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>Checkout</h2>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>
              You are buying <strong>{selectedItem.name}</strong> for {selectedItem.price}.
            </p>
            <div style={{ padding: 16, background: '#f9fafb', borderRadius: 8, marginBottom: 24, fontSize: 13, color: '#4b5563' }}>
              This is a demo checkout. In production, this connects to Stripe.
            </div>
            <button style={s.btn} onClick={() => setCartOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
