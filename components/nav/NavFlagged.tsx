"use client";
import NavRoot from "./NavRoot";

export default function NavFlagged({ children }: { children: React.ReactNode }) {
  const mode = process.env.NEXT_PUBLIC_NAV_MODE || "six";
  if (mode === "ten") return <>{children}</>;
  return <NavRoot>{children}</NavRoot>;
}

