import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export default function EmptyState({ icon, title, description, action, className = "" }: Props) {
  const actionEl = action ? (
    action.href ? (
      <Link href={action.href} className="inline-block mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors">
        {action.label} →
      </Link>
    ) : (
      <button onClick={action.onClick} className="inline-block mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors">
        {action.label} →
      </button>
    )
  ) : null;

  return (
    <div className={"text-center py-12 " + className}>
      {icon && (
        <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-zinc-800 mx-auto mb-4 flex items-center justify-center text-gray-400">
          {icon}
        </div>
      )}
      <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{title}</p>
      {description && <p className="text-xs text-gray-500 max-w-sm mx-auto">{description}</p>}
      {actionEl}
    </div>
  );
}