"use client";
import Link from "next/link";
import { useProStatus } from "@/lib/hooks/useProStatus";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ApplyGate({ open, onClose }: Props) {
  const { applicationsThisWeek, freeApplicationsLeft } = useProStatus();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-6 text-center text-white">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-1">Weekly application limit reached</h2>
          <p className="text-xs text-amber-100">
            You&apos;ve used all {applicationsThisWeek} free applications this week.
          </p>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-700 dark:text-zinc-300 mb-4">
            <strong>Upgrade to Pro</strong> for unlimited applications, priority in matched results, and full analytics.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-zinc-300">
              <svg className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>Unlimited gig applications</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-zinc-300">
              <svg className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>Priority in matched results</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-zinc-300">
              <svg className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>Full post analytics</span>
            </li>
          </ul>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 font-semibold py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Wait until next week
            </button>
            <Link
              href="/pro"
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-lg transition-colors text-center"
            >
              Start trial →
            </Link>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-3">
            Free users get {freeApplicationsLeft} applications/week. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}