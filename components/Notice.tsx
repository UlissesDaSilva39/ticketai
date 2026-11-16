import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  tone?: "warning" | "info";
  children?: ReactNode;
}

export default function Notice({ tone = "warning", children }: Props) {
  const tones = {
    warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300",
  };
  return (
    <div className={`rounded-lg border p-3 ${tones[tone]}`}>
      <div className="flex items-start gap-2">
        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div className="flex-1 text-xs">
          {children || (
            <>
              <strong>Rights required</strong> — by listing music on GRID you confirm you own or control the master and have permission from the composer/publisher.{" "}
              <Link href="/licensing" className="underline font-semibold hover:no-underline">Read our licensing policy →</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}