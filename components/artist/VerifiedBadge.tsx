type Props = {
  size?: number;
};

export default function VerifiedBadge({ size = 16 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Verified"
      title="Verified artist"
      style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 4 }}
    >
      <path
        d="M12 1.5l2.4 1.8 3-.3 1.2 2.7 2.7 1.2-.3 3 1.8 2.4-1.8 2.4.3 3-2.7 1.2-1.2 2.7-3-.3L12 22.5l-2.4-1.8-3 .3-1.2-2.7L2.7 16.5l.3-3-1.8-2.4 1.8-2.4-.3-3 2.7-1.2 1.2-2.7 3 .3L12 1.5z"
        fill="#1D9BF0"
      />
      <path
        d="M8.5 12.2l2.4 2.4 4.6-5"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
