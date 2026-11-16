import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  blurred?: boolean;
}

export default function AnalyticsCard({ title, subtitle, children, blurred = false }: Props) {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-sm">{title}</h3>
          {subtitle && <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5">{subtitle}</p>}
        </div>
        {blurred && (
          <span className="text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">PRO</span>
        )}
      </div>
      <div className={blurred ? "blur-sm select-none pointer-events-none" : ""}>
        {children}
      </div>
    </div>
  );
}