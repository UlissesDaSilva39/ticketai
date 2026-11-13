"use client";
import Link from "next/link";
import { computeCompleteness, ProfileFields } from "@/lib/utils/profileCompleteness";

interface Props {
  profile: ProfileFields | null | undefined;
}

export default function ProfileCompleteness({ profile }: Props) {
  const result = computeCompleteness(profile);

  if (!result.visible) return null;

  const { percent, nextStep } = result;

  // SVG ring math: 2πr for r=32 is ~201. If we use a smaller radius inside a 72 box.
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  const strokeColor = percent >= 80 ? "#10b981" : percent >= 40 ? "#3b82f6" : "#f59e0b";

  const contextLine =
    percent < 40
      ? "Add your basics to unlock better matches"
      : percent < 80
      ? `${nextStep?.label ?? "Fill in more details"} would boost your visibility`
      : "Profile looks great — keep it fresh";

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Progress ring */}
        <div className="relative flex-shrink-0" style={{ width: 72, height: 72 }}>
          <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
            <circle cx="36" cy="36" r={radius} fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-100 dark:text-zinc-800" />
            <circle
              cx="36"
              cy="36"
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 500ms ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-base font-bold text-gray-900 dark:text-white">{percent}%</span>
          </div>
        </div>

        {/* Text + next step */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Profile completeness</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug mt-0.5">{contextLine}</p>
          {nextStep && (
            <Link
              href={nextStep.anchor}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-2 transition-colors"
            >
              {nextStep.label} →
            </Link>
          )}
        </div>
      </div>

      {/* Progress bar (compact) */}
      <div className="mt-3 h-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, backgroundColor: strokeColor }}
        />
      </div>

      {result.missing.length > 0 && (
        <p className="text-[10px] text-gray-500 mt-2">
          {result.missing.length} {result.missing.length === 1 ? "field" : "fields"} left · {result.earned} / {result.total} pts
        </p>
      )}
    </div>
  );
}