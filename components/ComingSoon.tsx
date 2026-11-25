import Link from "next/link";

export function ComingSoon({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "96px 24px", textAlign: "center" }}>
      <h1 style={{ fontSize: 30, fontWeight: 600, margin: 0 }}>{title}</h1>
      <p style={{ marginTop: 16, fontSize: 18, opacity: 0.75 }}>{message}</p>
      <Link
        href="/join"
        style={{
          display: "inline-block",
          marginTop: 32,
          padding: "12px 24px",
          borderRadius: 8,
          border: "1px solid currentColor",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        Join the waitlist
      </Link>
    </main>
  );
}
