"use client";
export default function Topbar() {
  return (
    <header className="topbar">
      <strong style={{ letterSpacing: 1 }}>GRID</strong>
      <input className="search" placeholder="Search curators, pros, tracks..." aria-label="Global search" />
      <span className="role-chip">U / artist / Brazilian Funk</span>
      <span className="grooviz">0</span>
      <div className="avatar">U</div>
    </header>
  );
}
