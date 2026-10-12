type Props = {
  points: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
};

export default function AnalyticsSparkline({
  points,
  width = 600,
  height = 140,
  stroke = "#ffffff",
  fill = "rgba(255,255,255,0.06)",
}: Props) {
  if (!points || points.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-white/30 text-xs border border-white/10 rounded-xl"
        style={{ height }}
      >
        No data yet
      </div>
    );
  }

  const max = Math.max(...points, 1);
  const stepX = points.length > 1 ? width / (points.length - 1) : 0;
  const padY = 8;
  const usableH = height - padY * 2;

  const coords = points.map((v, i) => {
    const x = i * stepX;
    const y = padY + (1 - v / max) * usableH;
    return [x, y] as const;
  });

  const linePath = coords
    .map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`))
    .join(" ");

  const areaPath =
    `M 0 ${height} ` +
    coords.map(([x, y]) => `L ${x} ${y}`).join(" ") +
    ` L ${width} ${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      className="block"
    >
      <path d={areaPath} fill={fill} />
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}