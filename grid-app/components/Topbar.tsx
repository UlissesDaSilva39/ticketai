"use client";
import Link from "next/link";

export default function Topbar() {
  return (
    <header className="topbar">
      <Link href="/network" style={{ fontWeight: 700, letterSpacing: 1 }}>GRID</Link>
      <input className="search" placeholder="Search artists, DJs, producers, managers, promoters..." />
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent-tint)",
        color: "var(--accent)", display: "grid", placeItems: "center", fontWeight: 700 }}>A</div>
    </header>
  );
}
