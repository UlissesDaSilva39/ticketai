 "use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

export default function CheckoutLink({
  eventId,
  className,
  children,
}: {
  eventId: string;
  className?: string;
  children: ReactNode;
}) {
  const params = useSearchParams();
  const campaign = params.get("campaign");
  const href = `/checkout?event=${eventId}${campaign ? `&campaign=${campaign}` : ""}`;

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}