"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function MarkPaidForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const payoutId = searchParams.get("id") || "";
  const [reference, setReference] = useState("");
  const [method, setMethod] = useState("bank");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!payoutId) { setError("Missing payout ID"); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/payouts/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payoutId, status: "paid", reference, method, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      router.push("/admin/payouts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <Link href="/admin/payouts" className="text-sm text-gray-500 hover:text-black">
        ← Back to Payouts
      </Link>

      <h1 className="text-4xl font-bold mb-8 mt-4" style={{ fontFamily: "var(--font-antonio)" }}>
        MARK PAYOUT AS PAID
      </h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none">
            <option value="bank">Bank Transfer</option>
            <option value="paypal">PayPal</option>
            <option value="stripe">Stripe</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Reference (e.g. bank transfer ID)</label>
          <input type="text" value={reference} onChange={(e) => setReference(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="Optional" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="Optional" />
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

        <button onClick={submit} disabled={saving} className="w-full py-4 bg-black text-white font-medium rounded-full hover:bg-gray-800 disabled:opacity-50">
          {saving ? "Saving..." : "Confirm Payment Sent"}
        </button>
      </div>
    </div>
  );
}

export default function MarkPaidPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
      <MarkPaidForm />
    </Suspense>
  );
}
