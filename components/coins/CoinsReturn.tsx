"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Back from buying coins anywhere except a live room (which handles it itself):
 * credit the coins now and show a short confirmation.
 */
export default function CoinsReturn() {
  const router = useRouter();
  const pathname = usePathname();
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (pathname.startsWith("/live/")) return;
    const sp = new URLSearchParams(window.location.search);
    const status = sp.get("coins");
    if (!status) return;
    const sessionId = sp.get("session_id");
    sp.delete("coins");
    sp.delete("session_id");
    const clean = `${pathname}${sp.toString() ? `?${sp}` : ""}`;
    (async () => {
      if (status === "success" && sessionId) {
        const r = await fetch("/api/coins/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sessionId }) });
        const d = await r.json().catch(() => ({}));
        setMsg(r.ok ? `Coins added. Balance: ${(d.balance ?? 0).toLocaleString("en-GB")} coins.` : "Payment received. Your coins will appear in a moment.");
      } else if (status === "cancelled") {
        setMsg("Payment cancelled. You haven't been charged.");
      }
      router.replace(clean, { scroll: false });
      setTimeout(() => setMsg(""), 5000);
    })();
  }, [pathname, router]);

  if (!msg) return null;
  return (
    <div role="status" className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50 px-5 py-3 rounded-full shadow-lg text-sm font-semibold bg-emerald-600 text-white">
      {msg}
    </div>
  );
}
