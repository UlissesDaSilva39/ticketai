import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Business — GRID",
  description: "Tools for organisers, promoters, venues, artists and labels.",
};

export default function BusinessLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-neutral-50 text-neutral-900">{children}</div>;
}