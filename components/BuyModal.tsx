"use client";
import { useState } from "react";
import { useRevenue, PLATFORM_COMMISSION } from "@/lib/hooks/useRevenue";

interface Props {
  open: boolean;
  onClose: () => void;
  item: {
    id: string;
    name: string;
    pricePence: number;
    sellerId: string;
    sellerName: string;
  } | null;
}

export default function BuyModal({ open, onClose, item }: Props) {
  const { recordSale } = useRevenue();
  const [success, setSuccess] = useState(false);

  if (!open || !item) return null;

  const commissionPence = Math.round(item.pricePence * PLATFORM_COMMISSION.marketplace);
  const sellerPence = item.pricePence - commissionPence;
  const priceStr = (item.pricePence / 100).toFixed(2);

  const handleBuy = () => {
    recordSale({
      itemId: item.id,
      itemName: item.name,
      sellerId: item.sellerId,
      sellerName: item.sellerName,
      buyerId: "ulisses",
      pricePence: item.pricePence,
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Purchase complete</h2>
            <p className="text-sm text-gray-500">{item.name} is yours. Download link sent to your email.</p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Buy {item.name}</h2>
              <p className="text-sm text-gray-500 mt-1">Sold by {item.sellerName}</p>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600 dark:text-zinc-400">Price</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">£{priceStr}</span>
              </div>
              <div className="flex justify-between items-center mb-2 text-xs text-gray-500">
                <span>Seller receives</span>
                <span>£{(sellerPence / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-6 text-xs text-gray-500">
                <span>GRID fee (10%)</span>
                <span>£{(commissionPence / 100).toFixed(2)}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 font-semibold py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBuy}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg transition-colors"
                >
                  Pay £{priceStr}
                </button>
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-3">
                Secure checkout · 30-day refund policy
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}