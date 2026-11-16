interface Props {
  className?: string;
  title?: string;
}

export default function VerifiedBadge({ className = "w-4 h-4", title = "Verified" }: Props) {
  return (
    <svg
      className={className + " text-emerald-500 flex-shrink-0"}
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-label={title}
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}