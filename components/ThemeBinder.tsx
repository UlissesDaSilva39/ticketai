"use client";

import { useEffect } from "react";

const KEY = "grid-theme";

function setTheme(theme: "light" | "dark") {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  root.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(KEY, theme);
  } catch {}
}

// Finds the clickable "Theme" item in the navbar without editing Navbar.tsx.
function findThemeControl(start: Element): Element | null {
  let el: Element | null = start;
  let candidate: Element | null = null;
  for (let i = 0; i < 6 && el; i++, el = el.parentElement) {
    if (el.getAttribute("data-theme-toggle") !== null) return el;
    const text = (el.textContent || "").replace(/\s+/g, " ").trim();
    const label = el.getAttribute("aria-label") || "";
    if (text === "Theme" || /^(toggle )?(dark|theme)( mode)?$/i.test(label)) candidate = el;
    else if (candidate) break;
  }
  if (candidate && candidate.closest("nav, header, [role='navigation']")) return candidate;
  return null;
}

export default function ThemeBinder() {
  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "dark") setTheme("dark");
    } catch {}

    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      if (!target || !target.closest) return;
      const control = findThemeControl(target);
      if (!control) return;
      e.preventDefault();
      e.stopPropagation();
      const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
      setTheme(next);
      control.setAttribute("aria-pressed", String(next === "dark"));
      control.setAttribute("title", next === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}