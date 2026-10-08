"use client";

import { motion, useInView } from "framer-motion";
import { type ElementType, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

/* Clip-wipe heading reveal (left → right) on viewport entry. Drop-in alternative to <BlurIn>.
   The observer watches an unclipped wrapper: a fully clipped target never reports as
   intersecting in mobile Chrome, which left headings invisible on phones. */
export function WipeIn({ text, as = "h2", className, delay = 0, duration = 1.1 }: {
  text: string; as?: ElementType; className?: string; delay?: number; duration?: number;
}) {
  const Tag = useMemo(() => motion.create(as as "h2"), [as]);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref}>
      <Tag
        className={cn("fx-motion", className)}
        initial={{ clipPath: "inset(0 100% -10% 0)" }}
        animate={inView ? { clipPath: "inset(0 0% -10% 0)" } : undefined}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {text}
      </Tag>
    </div>
  );
}
