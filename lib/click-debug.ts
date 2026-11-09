"use client";
// Diagnostic helper: patches window.console so we see clicks
export function logClick(label: string) {
  if (typeof window !== "undefined") {
    console.log("[CLICK]", label);
  }
}
