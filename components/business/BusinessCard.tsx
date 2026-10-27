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
      className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:shadow-lg"
    >
      <div className={`h-2 w-full bg-gradient-to-r ${accent}`} />
      <div className="p-5">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-neutral-600">{description}</p>
        <p className="mt-3 text-sm font-medium text-neutral-900 group-hover:underline">
          Open dashboard &rarr;
        </p>
      </div>
    </Link>
  );
}