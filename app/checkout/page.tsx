 "use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Event } from "@/lib/types";
import SeatMap from "@/components/SeatMap";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("event") || "";
  const campaignCode = searchParams.get("campaign") || "";
  const [event, setEvent] = useState<Event | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<Array<{ label: string; price: number; row: string }>>([]);

  const [reservedSeats, setReservedSeats] = useState<string[]>([]);
  const totalQty = Object.values(selectedTickets).reduce((a, b) => a + b, 0);
  useEffect(() => { setSelectedSeats([]); }, [totalQty]);
  useEffect(() => {
    if (!eventId) return;
    fetch("/api/events/" + eventId + "/reserved-seats")
      .then((r) => r.json())
      .then((d) => setReservedSeats(d.seats || []))
      .catch(() => {});
  }, [eventId]);

  useEffect(() => {
    if (!eventId) { setLoading(false); return; }
    const supabase = createClient();
    supabase.from("events").select("*").eq("id", eventId).single().then(({ data }) => {
      if (data) {
        setEvent(data as Event);
        if (data.ticket_types?.[0]) setSelectedTickets({ [data.ticket_types[0].name]: 1 });
      }
      setLoading(false);
    });
  }, [eventId]);

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount_type: "percent" | "fixed";
    discount_value: number;
  } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [applyingPromo, setApplyingPromo] = useState(false);

  const subtotal = event?.ticket_types?.reduce((sum, t) => sum + (selectedTickets[t.name] || 0) * Number(t.price), 0) || 0;

  const discountAmount = appliedPromo
    ? appliedPromo.discount_type === "percent"
      ? subtotal * (appliedPromo.discount_value / 100)
      : appliedPromo.discount_value
    : 0;

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const processingFee = discountedSubtotal * 0.029;
  const total = discountedSubtotal + processingFee;

  async function applyPromo() {
    if (!promoCode.trim()) return;
    setApplyingPromo(true);
    setPromoError("");
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode.trim(), eventId }),
      });
      const data = await res.json();
      if (!data.valid) {
        setPromoError(data.error || "Invalid code");
        setAppliedPromo(null);
      } else {
        setAppliedPromo(data.promo);
      }
    } catch {
      setPromoError("Could not validate code");
    } finally {
      setApplyingPromo(false);
    }
  }

  const handleCheckout = async () => {
    setProcessing(true);
    try {
      const tickets = Object.entries(selectedTickets)
        .filter(([, qty]) => qty > 0)
        .map(([name, qty]) => ({ name, qty }));

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          tickets,
          seats: selectedSeats,
          campaignCode,
          promoCode: appliedPromo?.code || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      if (data.url) {
        window.location.href = data.url;
      } else {
        window.location.href = "/confirmation";
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Checkout failed");
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!event) return <div className="p-20 text-center">Event not found</div>;

  const firstName = event.ticket_types?.[0]?.name || "";
  const currentQty = selectedTickets[firstName] || 1;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-bold mb-2" style={{ fontFamily: "var(--font-antonio)" }}>CHECKOUT</h1>
      <p className="text-gray-500 mb-8">{event.title}</p>
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-antonio)" }}>1. SELECT TICKET TYPE</h2>
          <div className="space-y-3">
            {event.ticket_types?.map((t) => (
              <label key={t.name} className={"flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer " + (selectedTickets[t.name] ? "border-black bg-gray-50" : "border-gray-200")}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="ticketType" checked={!!selectedTickets[t.name]} onChange={() => setSelectedTickets({ [t.name]: 1 })} className="w-5 h-5" />
                  <p className="font-medium">{t.name}</p>
                </div>
                <span className="font-bold">£{Number(t.price).toFixed(2)}</span>
              </label>
            ))}
          </div>
        </section>

        {event?.seatmap_config && event.seatmap_config.rows?.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-antonio)" }}>PICK YOUR SEATS</h2>
            <SeatMap
              key={totalQty}
              config={event.seatmap_config}
              reservedSeats={reservedSeats}
              maxSelectable={totalQty || 1}
              onChange={setSelectedSeats}
            />
            {selectedSeats.length > 0 && (
              <p className="text-sm text-gray-600 mt-3">Selected seats: {selectedSeats.map((s) => s.label).join(", ")}</p>
            )}
          </section>
        )}

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-antonio)" }}>2. QUANTITY</h2>
          <div className="flex items-center gap-4">
            <button onClick={() => { if (currentQty > 1) setSelectedTickets({ ...selectedTickets, [firstName]: currentQty - 1 }); }} className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-black text-xl">-</button>
            <span className="text-2xl font-bold w-12 text-center">{currentQty}</span>
            <button onClick={() => setSelectedTickets({ ...selectedTickets, [firstName]: currentQty + 1 })} className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-black text-xl">+</button>
          </div>
        </section>

        <section className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-antonio)" }}>ORDER SUMMARY</h2>
          <div className="space-y-3">
            {Object.entries(selectedTickets).filter(([, qty]) => qty > 0).map(([name, qty]) => {
              const t = event.ticket_types.find((x) => x.name === name);
              if (!t) return null;
              return <div key={name} className="flex justify-between"><span>{name} x {qty}</span><span>£{(Number(t.price) * qty).toFixed(2)}</span></div>;
            })}

            {!appliedPromo && (
              <div className="pt-3 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Promo code"
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    disabled={applyingPromo || !promoCode.trim()}
                    className="rounded-lg border border-black px-4 py-2 text-sm font-medium hover:bg-black hover:text-white disabled:opacity-50"
                  >
                    {applyingPromo ? "..." : "Apply"}
                  </button>
                </div>
                {promoError && <p className="text-xs text-red-600 mt-2">{promoError}</p>}
              </div>
            )}

            {appliedPromo && (
              <div className="flex justify-between text-sm text-green-700 pt-3 border-t border-gray-200">
                <span>Discount ({appliedPromo.code})</span>
                <span>-£{discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm text-gray-500"><span>Processing fee (2.9%)</span><span>£{processingFee.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-xl pt-3 border-t border-gray-300"><span>Total</span><span>£{total.toFixed(2)}</span></div>
          </div>
        </section>

        <button onClick={handleCheckout} disabled={processing} className="w-full py-5 bg-black text-white text-lg font-medium rounded-full hover:bg-gray-800 disabled:opacity-50">
          {processing ? "Redirecting to Stripe..." : "Confirm & Pay £" + total.toFixed(2)}
        </button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
