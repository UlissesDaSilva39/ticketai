"use client";
import Link from "next/link";
import { useBadges } from "@/lib/hooks/useBadges";
import { ReactNode } from "react";

interface Props {
  href: string;
  className?: string;
  children: ReactNode;
}

export default function SimilarClickTracker({ href, className, children }: Props) {
  const { increment } = useBadges();
  return (
    <Link href={href} className={className} onClick={() => increment("similarClicks")}>
      {children}
    </Link>
  );
}