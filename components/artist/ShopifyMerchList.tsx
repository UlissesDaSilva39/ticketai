"use client";

import { useEffect, useState } from "react";
import { getProducts, ShopifyProduct } from "@/lib/shopify";
import ShopifyMerchCard from "./ShopifyMerchCard";

export default function ShopifyMerchList({ storeDomain }: { storeDomain: string }) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Note: For this to work, your backend lib/shopify.ts must use this domain 
    // AND the Shopify Token in .env.local must have access to this store.
    getProducts(6)
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCheckout = (variantId: string) => {
    const numericId = variantId.split("/").pop();
    if (!numericId) return;
    window.location.href = `https://${storeDomain}/cart/${numericId}:1`;
  };

  if (loading) return <p className="text-sm text-gray-500">Loading merch...</p>;
  if (error) return <p className="text-sm text-red-500">Store error: {error}</p>;
  if (products.length === 0) return <p className="text-sm text-gray-500">No merch available yet.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((p) => (
        <ShopifyMerchCard key={p.id} product={p} onCheckout={handleCheckout} />
      ))}
    </div>
  );
}
