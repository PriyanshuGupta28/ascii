"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
  speed?: number; // seconds for one full loop
  separator?: string;
}

export default function Marquee({
  items,
  className,
  speed = 28,
  separator = "·",
}: MarqueeProps) {
  const doubled = [...items, ...items];

  return (
    <div
      className="overflow-hidden whitespace-nowrap select-none"
      aria-hidden="true"
    >
      <div
        className="inline-flex"
        style={{ animation: `marquee-scroll ${speed}s linear infinite` }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className={cn("inline-flex items-center gap-4", className)}
          >
            <span>{item}</span>
            <span className="opacity-30">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
