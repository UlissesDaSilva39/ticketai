import type { SVGProps } from "react";

export function Verified({ size = 20, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 12 2 2 4-4" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}