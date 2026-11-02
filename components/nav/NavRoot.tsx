"use client";
import NavSidebar from "./NavSidebar";
import NavBottom from "./NavBottom";

export default function NavRoot({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid-nav-shell">
      <NavSidebar />
      <div className="grid-nav-content">{children}</div>
      <NavBottom />
    </div>
  );
}

