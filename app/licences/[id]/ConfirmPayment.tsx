"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// After Stripe sends the licensee back, activate the licence straight away
// (the webhook does the same, whichever arrives first wins).
export default function ConfirmPayment({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [state, setState] = useState<"checking" | "waiting" | "error">("checking");

  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    const check = async () => {
      tries += 1;
      try {
        const res = await fetch("/api/licensing/confirm", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok && data.active) {
          router.replace(window.location.pathname);
          router.refresh();
          return;
        }
        if (!res.ok) return setState("error");
        setState("waiting");
      } catch {
        if (!cancelled) setState("waiting");
      }
      if (!cancelled && tries < 10) setTimeout(check, 3000);
    };
    check();
    return () => {
      cancelled = true;
    };
  }, [sessionId, router]);

  return (
    <p role="status" className="mb-6 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 px-4 py-3 text-sm print:hidden">
      {state === "error"
        ? "We couldn't confirm your payment. If you were charged, your licence will activate shortly. Contact licensing@grid.app if it doesn't."
        : "Confirming your payment…"}
    </p>
  );
}
