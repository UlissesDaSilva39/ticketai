"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { products } from "@/data/mock";

export function PromoteMerchModal({ open, onClose, preselectProductId }:{
  open: boolean; onClose: () => void; preselectProductId?: string;
}) {
  const [productId, setProductId] = useState(preselectProductId ?? products[0].id);
  const [feedSidebar, setFeedSidebar] = useState(true);
  const [feedInline, setFeedInline] = useState(false);
  const [profileBanner, setProfileBanner] = useState(false);
  const [budget, setBudget] = useState(50);
  const [duration, setDuration] = useState(7);

  const selected = products.find(p => p.id === productId)!;
  const reachLow  = Math.round(budget * 84);
  const reachHigh = Math.round(budget * 136);

  return (
    <Modal open={open} onClose={onClose} title="Promote your merch">
      <div className="space-y-5 text-sm">
        <div>
          <p className="mb-2 font-medium">Select product</p>
          <div className="space-y-2">
            {products.map(p => {
              const disabled = p.stock === 0;
              return (
                <label key={p.id} className={`flex items-center justify-between rounded-lg border border-neutral-800 p-3 ${disabled ? "opacity-40" : "cursor-pointer hover:border-neutral-700"}`}>
                  <span className="flex items-center gap-3">
                    <input type="radio" name="product" disabled={disabled}
                           checked={productId === p.id}
                           onChange={() => setProductId(p.id)} />
                    <span>{p.name}</span>
                  </span>
                  <span className="text-neutral-400">
                    £{p.price.toFixed(2)} · Stock: {p.stock === "infinity" ? "inf" : p.stock}
                    {disabled && " (out of stock)"}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 font-medium">Placement</p>
          <label className="flex items-center gap-2"><input type="checkbox" checked={feedSidebar} onChange={e => setFeedSidebar(e.target.checked)} /> Feed sidebar (right)</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={feedInline} onChange={e => setFeedInline(e.target.checked)} /> Feed inline (every 10 posts)</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={profileBanner} onChange={e => setProfileBanner(e.target.checked)} /> Artist profile banner</label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-neutral-400">Budget (£)</span>
            <input type="number" min={5} value={budget} onChange={e => setBudget(+e.target.value)}
                   className="mt-1 w-full rounded-lg bg-neutral-800 px-3 py-2 outline-none" />
          </label>
          <label className="block">
            <span className="text-neutral-400">Duration</span>
            <select value={duration} onChange={e => setDuration(+e.target.value)}
                    className="mt-1 w-full rounded-lg bg-neutral-800 px-3 py-2 outline-none">
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
            </select>
          </label>
        </div>

        <p className="rounded-lg bg-neutral-800 p-3 text-neutral-300">
          Estimated reach: <span className="font-semibold text-white">~{reachLow.toLocaleString()} – {reachHigh.toLocaleString()}</span> feed views
        </p>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-4 py-2 hover:bg-neutral-800">Cancel</button>
          <button
            onClick={() => { console.log("Launch", { productId, feedSidebar, feedInline, profileBanner, budget, duration }); onClose(); }}
            disabled={selected.stock === 0 || !(feedSidebar || feedInline || profileBanner)}
            className="rounded-lg bg-white px-4 py-2 font-medium text-black disabled:opacity-40">
            Launch promotion
          </button>
        </div>
      </div>
    </Modal>
  );
}