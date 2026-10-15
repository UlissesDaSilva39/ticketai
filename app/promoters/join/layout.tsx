import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a promoter - free, no commission | GRID",
  description: "Join GRID as a promoter. Free to use. No commission. No monthly fee.",
};

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
