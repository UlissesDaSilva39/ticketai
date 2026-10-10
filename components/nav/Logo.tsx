import { BRAND } from '@/config/brand';

export function Logo() {
  return (
    <a href="/" className="flex items-center gap-2 shrink-0">
      <span className="text-xl font-black tracking-tight text-black">
        {BRAND.master}
      </span>
    </a>
  );
}
