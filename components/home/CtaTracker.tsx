"use client";

import { useEffect } from "react";
import { track } from "../../lib/cta-track";

// Tracks every click on an element with a data-cta="..." attribute.
export default function CtaTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const el = target && target.closest ? target.closest("[data-cta]") : null;
      const id = el ? el.getAttribute("data-cta") : null;
      if (id) track("cta_click", { cta: id });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}