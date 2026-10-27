import Link from "next/link";

type BusinessCardProps = {
  title: string;
  description: string;
  href: string;
  accent?: string;
};

export function BusinessCard({
  title,
  description,
  href,
  accent = "from-neutral-800 to-neutral-600",
}: BusinessCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col h-full overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:shadow-md"
    >
      {/* Top color bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${accent} shrink-0`} />
      
      {/* Content */}
      <div className="flex flex-col flex-1 p-3 sm:p-5">
        <h3 className="text-sm sm:text-lg font-semibold leading-tight">{title}</h3>
        
        {/* Hide description on very small screens to prevent overlap */}
        <p className="mt-1 hidden text-xs text-neutral-500 sm:block sm:text-sm sm:text-neutral-600 flex-1">
          {description}
        </p>
        
        {/* Action text pinned to bottom */}
        <div className="mt-3 flex items-center text-[11px] sm:text-sm font-medium text-neutral-900 group-hover:underline">
          Open dashboard
          <svg className="ml-1 h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}