export function FullBleedHeader({
  imageUrl,
  name,
  subtitle,
  onFollow,
}: {
  imageUrl: string;
  name: string;
  subtitle?: string;
  onFollow?: () => void;
}) {
  return (
    <div className="relative h-[60vh] w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-5 pb-4">
        <div>
          <h1 className="text-3xl font-bold">{name}</h1>
          {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
        </div>
        <button
          onClick={onFollow}
          className="rounded-full bg-purple-600 px-5 py-2 font-medium"
        >
          Follow
        </button>
      </div>
    </div>
  );
}
