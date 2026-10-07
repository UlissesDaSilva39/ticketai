"use client";

import { useRef } from "react";
import Link from "next/link";

type Props = {
  title: string;
  seeAllHref?: string;
  children: React.ReactNode;
};

export default function CardRow({ title, seeAllHref, children }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-xl font-bold hover:underline cursor-pointer">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {seeAllHref ? (
            <Link
              href={seeAllHref}
              className="text-xs uppercase tracking-wider text-gray-500 hover:text-black font-semibold"
            >
              Show all
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="w-9 h-9 rounded-full bg-white border border-gray-300 hover:bg-black hover:text-white hover:border-black flex items-center justify-center text-base font-bold transition-colors"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="w-9 h-9 rounded-full bg-white border border-gray-300 hover:bg-black hover:text-white hover:border-black flex items-center justify-center text-base font-bold transition-colors"
          >
            ›
          </button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        className="overflow-x-auto scroll-smooth pb-2"
        style={{ scrollbarWidth: "thin" }}
      >
        <ul className="flex gap-2">{children}</ul>
      </div>
    </section>
  );
}