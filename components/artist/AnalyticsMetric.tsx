type Props = {
  label: string;
  value: string | number;
  delta?: string;
  hint?: string;
};

export default function AnalyticsMetric({ label, value, delta, hint }: Props) {
  const deltaIsPositive = delta?.startsWith("+");
  return (
    <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
      <p className="text-xs tracking-widest text-white/40 mb-3">{label}</p>
      <p
        className="text-4xl md:text-5xl font-bold leading-none"
        style={{ fontFamily: "var(--font-antonio)" }}
      >
        {value}
      </p>
      {(delta || hint) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {delta && (
            <span
              className={
                deltaIsPositive ? "text-emerald-400" : "text-red-400"
              }
            >
              {delta}
            </span>
          )}
          {hint && <span className="text-white/40">{hint}</span>}
        </div>
      )}
    </div>
  );
}