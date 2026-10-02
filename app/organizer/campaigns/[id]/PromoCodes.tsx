"use client";

import { useEffect, useState } from "react";

type Promo = {
  id: string;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  max_uses: number | null;
  times_used: number;
  expires_at: string | null;
  active: boolean;
  created_at: string;
};

export default function PromoCodes({ campaignId }: { campaignId: string }) {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [creating, setCreating] = useState(false);

  async function loadPromos() {
    try {
      const res = await fetch("/api/promo/list?campaignId=" + campaignId, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setPromos(data.promos || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPromos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/promo/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId,
          code: code.trim().toUpperCase(),
          discount_type: discountType,
          discount_value: Number(discountValue),
          max_uses: maxUses ? Number(maxUses) : null,
          expires_at: expiresAt || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setCode("");
      setDiscountValue("");
      setMaxUses("");
      setExpiresAt("");
      setShowForm(false);
      await loadPromos();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setCreating(false);
    }
  }

  async function deactivate(id: string) {
    if (!confirm("Deactivate this code?")) return;
    try {
      const res = await fetch("/api/promo/" + id, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      await loadPromos();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    }
  }

  function formatDiscount(p: Promo) {
    return p.discount_type === "percent"
      ? p.discount_value + "% off"
      : "£" + Number(p.discount_value).toFixed(2) + " off";
  }

  return (
    <section className="rounded-xl border bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Promo codes</h2>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg border border-black px-4 py-2 text-sm font-medium hover:bg-black hover:text-white"
        >
          {showForm ? "Cancel" : "+ Create code"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 space-y-4 rounded-lg bg-gray-50 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Code</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
                placeholder="FRIEND20"
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-black font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as "percent" | "fixed")}
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-black"
              >
                <option value="percent">Percent off</option>
                <option value="fixed">Fixed £ off</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                {discountType === "percent" ? "Discount %" : "Discount £"}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                required
                placeholder={discountType === "percent" ? "20" : "5"}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max uses (optional)</label>
              <input
                type="number"
                min="1"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                placeholder="100"
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expires (optional)</label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-black text-white px-5 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create code"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : promos.length === 0 ? (
        <p className="text-sm text-gray-500">
          No promo codes yet. Create one to offer discounts to your audience.
        </p>
      ) : (
        <div className="space-y-2">
          {promos.map((p) => (
            <div
              key={p.id}
              className={"flex items-center justify-between rounded-lg border p-4 " + (p.active ? "bg-white" : "bg-gray-50 opacity-60")}
            >
              <div>
                <p className="font-mono font-semibold">{p.code}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {formatDiscount(p)} · Used {p.times_used}
                  {p.max_uses ? "/" + p.max_uses : ""}
                  {p.expires_at ? " · Expires " + new Date(p.expires_at).toLocaleDateString("en-GB") : ""}
                </p>
              </div>
              {p.active ? (
                <button
                  type="button"
                  onClick={() => deactivate(p.id)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium hover:border-red-300 hover:text-red-700"
                >
                  Deactivate
                </button>
              ) : (
                <span className="text-xs uppercase tracking-widest text-gray-400">
                  Inactive
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}