'use client';

import { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { DROPDOWN_MAP } from '@/config/navigation';
import { useClickOutside } from '@/hooks/useClickOutside';
import { ChevronDown } from 'lucide-react';

export function NavDropdown({
  label,
  dropdownKey,
  href,
}: {
  label: string;
  dropdownKey: keyof typeof DROPDOWN_MAP;
  href: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const active = pathname.startsWith(href);
  useClickOutside(ref, () => setOpen(false));

  const dropdown = DROPDOWN_MAP[dropdownKey];

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={[
          'flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors',
          active ? 'text-black' : 'text-gray-700 hover:text-black',
        ].join(' ')}
      >
        {label}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute left-0 top-full pt-2 z-50">
          <div className="min-w-[220px] rounded-2xl border border-gray-200 bg-white p-2 shadow-lg">
            {dropdown.sections.map((section) => (
              <div key={section.title} className="py-1">
                <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  {section.title}
                </div>
                <ul>
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
